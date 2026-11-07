---
title: On Kind with Helm
sidebar_position: 4
last_update:
  date: '2026-11-06'
description: This guide will walk you through the different steps of running a full Microcks installation on your laptop using Kind.
---

## Overview 

This guide will walk you through the different steps of running a full Microcks installation on your laptop using [Kind](https://kind.sigs.k8s.io). Step #6 is actually optional and may only be of interest if you'd like to use the Asynchronous features of Microcks.

The installation notes were run on an Apple MacBook M1, but those steps would sensibly be the same on any Linux machine. 

Let's go 🚀

## 1. Preparation

On a Mac, people usually use [brew](https://brew.sh) to install `kind`. However, it is also available from several different package managers out there. You can check the [Quick Start](https://kind.sigs.k8s.io/docs/user/quick-start/#installation) guide for that. Obviously, you'll also need the [`kubectl`](https://kubernetes.io/docs/tasks/tools/#kubectl) utility to interact with your cluster, and the [`helm`](https://helm.sh) binary to install Envoy Gateway and Microcks.

```sh
  brew install kind helm
  kind --version
```

```sh
kind version 0.33.0
```

In a dedicated folder, prepare a `cluster-kind.yaml` configuration file like this:

```sh
  cd ~/tmp
  mkdir microcks && cd microcks
  cat > cluster-kind.yaml <<EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
    extraPortMappings:
      - containerPort: 30443
        hostPort: 443
        listenAddress: "127.0.0.1"
        protocol: TCP
EOF
```

## 2. Start and configure a cluster

We're now going to start a Kube cluster. Start your `kind` cluster using the `cluster-kind.yaml` configuration file we just created before:

```sh
  kind create cluster --config=cluster-kind.yaml
```

```sh
Creating cluster "kind" ...
 ✓ Ensuring node image (kindest/node:v1.37.0) 🖼️ 
 ✓ Preparing nodes 📦  
 ✓ Writing configuration 📜 
 ✓ Starting control-plane 🕹️ 
 ✓ Installing CNI 🔌 
 ✓ Installing StorageClass 💾 
Set kubectl context to "kind-kind"
You can now use your cluster with:

kubectl cluster-info --context kind-kind

Have a question, bug, or feature request? Let us know! https://kind.sigs.k8s.io/#community 🙂
``` 

Check that the node is available:

```sh
  kubectl get nodes
```

```sh
NAME                 STATUS   ROLES           AGE   VERSION
kind-control-plane   Ready    control-plane   75s   v1.37.0
```

## 3. Install Envoy Gateway

Envoy Gateway implements Kubernetes Gateway API and provides the proxy that will route traffic to Microcks.

Install Envoy Gateway using its Helm chart:

```sh
  helm install envoy-gateway oci://docker.io/envoyproxy/gateway-helm -n envoy-gateway-system --create-namespace
```

```sh
NAME: envoy-gateway
LAST DEPLOYED: Fri Oct  9 15:02:08 2026
NAMESPACE: envoy-gateway-system
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
**************************************************************************
*** PLEASE BE PATIENT: Envoy Gateway may take a few minutes to install ***
**************************************************************************

Envoy Gateway is an open source project for managing Envoy Proxy as a standalone or Kubernetes-based application gateway.

Thank you for installing Envoy Gateway! 🎉

Your release is named: envoy-gateway. 🎉

Your release is in namespace: envoy-gateway-system. 🎉

To learn more about the release, try:

  $ helm status envoy-gateway -n envoy-gateway-system
  $ helm get all envoy-gateway -n envoy-gateway-system

To have a quickstart of Envoy Gateway, please refer to https://gateway.envoyproxy.io/latest/tasks/quickstart.

To get more details, please visit https://gateway.envoyproxy.io and https://github.com/envoyproxy/gateway.
```

Wait for the deployment to become ready:

```sh
  kubectl wait \
  --namespace envoy-gateway-system \
  --for=condition=Available \
  deployment/envoy-gateway \
  --timeout=120s
```

This installation also installs the Gateway API CRDs.

Create a `GatewayClass`:

```sh
  cat <<EOF | kubectl apply -f -
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: envoy
spec:
  controllerName: gateway.envoyproxy.io/gatewayclass-controller
EOF
```

```sh
gatewayclass.gateway.networking.k8s.io/envoy created
```

Verify that the `GatewayClass` has been accepted:

```sh
  kubectl get gatewayclass envoy
```

```sh
NAME    CONTROLLER                                      ACCEPTED   AGE
envoy   gateway.envoyproxy.io/gatewayclass-controller   True       22s
```

## 4. Create a local TLS certificate and the Gateway

Create the Microcks namespace:

```sh
  kubectl create namespace microcks
```

Generate a TLS certificate for the Gateway API listeners. It covers the Microcks, Keycloak and Microcks WebSocket hostnames:

```sh
  openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout microcks-local.key \
  -out microcks-local.crt \
  -subj "/CN=microcks.127.0.0.1.nip.io" \
  -addext "subjectAltName=DNS:microcks.127.0.0.1.nip.io,DNS:keycloak.127.0.0.1.nip.io,DNS:microcks-ws.127.0.0.1.nip.io"
```

Store it in a Kubernetes secret:

```sh
  kubectl create secret tls microcks-local-tls \
  --namespace microcks \
  --key=microcks-local.key \
  --cert=microcks-local.crt
```

Check that the secret is created:

```sh
  kubectl get secret microcks-local-tls -n microcks
```

```sh

NAME                 TYPE                DATA   AGE
microcks-local-tls   kubernetes.io/tls   2      20s
```

Note that the certificate is self-signed, so the browser will display a security warning until you trust it.

Configure an `EnvoyProxy` for the Kind cluster:

```sh
  cat <<EOF | kubectl apply -f -
apiVersion: gateway.envoyproxy.io/v1alpha1
kind: EnvoyProxy
metadata:
  name: microcks-proxy
  namespace: microcks
spec:
  provider:
    type: Kubernetes
    kubernetes:
      envoyService:
        type: NodePort
        patch:
          type: StrategicMerge
          value:
            spec:
              ports:
                - port: 443
                  nodePort: 30443
EOF
```

Create a Gateway with three HTTPS listeners on port 443: one for Microcks, one for Keycloak and one for the Microcks WebSocket endpoint (used by the asynchronous features of step 6). All listeners use the same certificate, which covers the three hostnames.

```sh
  cat <<EOF | kubectl apply -f -
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: microcks-gateway
  namespace: microcks
spec:
  gatewayClassName: envoy

  infrastructure:
    parametersRef:
      group: gateway.envoyproxy.io
      kind: EnvoyProxy
      name: microcks-proxy

  listeners:
    - name: microcks-https
      hostname: microcks.127.0.0.1.nip.io
      port: 443
      protocol: HTTPS
      tls:
        mode: Terminate
        certificateRefs:
          - kind: Secret
            name: microcks-local-tls
      allowedRoutes:
        namespaces:
          from: Same

    - name: keycloak-https
      hostname: keycloak.127.0.0.1.nip.io
      port: 443
      protocol: HTTPS
      tls:
        mode: Terminate
        certificateRefs:
          - kind: Secret
            name: microcks-local-tls
      allowedRoutes:
        namespaces:
          from: Same

    - name: microcks-ws-https
      hostname: microcks-ws.127.0.0.1.nip.io
      port: 443
      protocol: HTTPS
      tls:
        mode: Terminate
        certificateRefs:
          - kind: Secret
            name: microcks-local-tls
      allowedRoutes:
        namespaces:
          from: Same
EOF
```

## 5. Install Microcks 

We're now going to install Microcks with basic options, using the Helm Chart.

Add the Microcks Helm repository:

```sh
  helm repo add microcks https://microcks.io/helm/
  helm repo update
```

Install Microcks with Gateway API routes enabled and Ingress resources disabled:

```sh
  helm install microcks microcks/microcks \
  --namespace microcks \
  --set ingresses=false \
  --set gatewayRoutes=true \
  --set gatewayRefName=microcks-gateway \
  --set gatewayRefSectionName=microcks-https \
  --set microcks.url=microcks.127.0.0.1.nip.io \
  --set microcks.generateCert=false \
  --set keycloak.url=keycloak.127.0.0.1.nip.io \
  --set keycloak.privateUrl=http://microcks-keycloak.microcks.svc.cluster.local:8080 \
  --set keycloak.gatewayRefName=microcks-gateway \
  --set keycloak.gatewayRefSectionName=keycloak-https \
  --set keycloak.generateCert=false
```

```sh

NAME: microcks
LAST DEPLOYED: Fri Oct  9 22:41:23 2026
NAMESPACE: microcks
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
Thank you for installing microcks.

Your release is named microcks.

To learn more about the release, try:

  $ helm status microcks
  $ helm get microcks

Microcks is available at https://microcks.127.0.0.1.nip.io.

GRPC mock service is available at "microcks-grpc.127.0.0.1.nip.io".
It has been exposed using TLS passthrough on the Ingress controller, you should extract the certificate for your client using:

  $ kubectl get secret microcks-microcks-grpc-secret -n microcks -o jsonpath='{.data.tls\.crt}' | base64 -d > tls.crt

Keycloak has been deployed on https://keycloak.127.0.0.1.nip.io to protect user access.
You may want to configure an Identity Provider or add some users for your Microcks installation by login in using the
username and password found into 'microcks-keycloak-admin' secret.
```

> **Note:** The gRPC mock service is not exposed outside the cluster in this guide. The Helm chart still prints a message about the Ingress controller and creates a `GRPCRoute`, but no Gateway listener accepts this route, so you can ignore both. gRPC mocks are still reachable from inside the cluster on the `microcks-grpc` service, port 9090.

Wait for the pods to become ready:

```sh
  kubectl get pods -n microcks
```

```sh

NAME                                            READY   STATUS    RESTARTS   AGE
microcks-68657ccb64-l9zkx                       1/1     Running   0          118s
microcks-keycloak-7c995cbf6d-xtb69              1/1     Running   0          118s
microcks-keycloak-postgresql-6dbb9744df-56plm   1/1     Running   0          118s
microcks-mongodb-66c77b5dbd-wjf5f               1/1     Running   0          118s
microcks-postman-runtime-566748c78-f7mzk        1/1     Running   0          118s
```

Inspect the generated routes:

```sh
  kubectl get httproute -n microcks
```

```sh

NAME                HOSTNAMES                       AGE
microcks            ["microcks.127.0.0.1.nip.io"]   2m16s
microcks-keycloak   ["keycloak.127.0.0.1.nip.io"]   2m16s
```

Start opening `https://keycloak.127.0.0.1.nip.io/` in your browser to validate the self-signed certificate. Once done, you can visit `https://microcks.127.0.0.1.nip.io/` in your browser, validate the self-signed certificate and start playing around with Microcks!

The default user/password is `admin/microcks123`

## 6. Install Microcks with asynchronous options

This step is optional. It enables Microcks' asynchronous API mocking features and deploys a Kafka cluster managed by the [Strimzi](https://strimzi.io) project.

The Kafka cluster that the Microcks Helm chart can install for you is exposed through an `Ingress`. Since this guide uses Envoy Gateway instead of an Ingress controller, we deploy the Kafka cluster ourselves and expose it with Gateway API `TLSRoute` resources. This requires Strimzi 1.1.0 or later.

Install the latest version of the Strimzi operator in the `microcks` namespace:

```sh
  kubectl apply -f 'https://strimzi.io/install/latest?namespace=microcks' -n microcks
```

Wait for the operator to become ready:

```sh
  kubectl wait \
  --namespace microcks \
  --for=condition=Available \
  deployment/strimzi-cluster-operator \
  --timeout=300s
```

Kafka clients use TLS and Server Name Indication (SNI) to reach the bootstrap server and each broker. Add a TLS passthrough listener for the Kafka hostnames to the Gateway, so Envoy forwards the encrypted traffic directly to the brokers:

```sh
  kubectl patch gateway microcks-gateway -n microcks --type=json -p '[
    {
      "op": "add",
      "path": "/spec/listeners/-",
      "value": {
        "name": "kafka-tls",
        "hostname": "*.kafka.127.0.0.1.nip.io",
        "port": 443,
        "protocol": "TLS",
        "tls": { "mode": "Passthrough" },
        "allowedRoutes": { "namespaces": { "from": "Same" } }
      }
    }
  ]'
```

```sh
gateway.gateway.networking.k8s.io/microcks-gateway patched
```

Create a single-node Kafka cluster with an external `tlsroute` listener attached to this Gateway listener, and the topic Microcks uses to share service updates:

```sh
  cat <<EOF | kubectl apply -n microcks -f -
apiVersion: kafka.strimzi.io/v1
kind: KafkaNodePool
metadata:
  name: dual-role
  labels:
    strimzi.io/cluster: microcks-kafka
spec:
  replicas: 1
  roles:
    - controller
    - broker
  storage:
    type: ephemeral
---
apiVersion: kafka.strimzi.io/v1
kind: Kafka
metadata:
  name: microcks-kafka
spec:
  kafka:
    listeners:
      - name: plain
        port: 9092
        type: internal
        tls: false
      - name: external
        port: 9094
        type: tlsroute
        tls: true
        configuration:
          parentRefs:
            - name: microcks-gateway
              kind: Gateway
              group: gateway.networking.k8s.io
              namespace: microcks
              sectionName: kafka-tls
          bootstrap:
            host: bootstrap.kafka.127.0.0.1.nip.io
          hostTemplate: broker-{nodeId}.kafka.127.0.0.1.nip.io
    config:
      offsets.topic.replication.factor: 1
      transaction.state.log.replication.factor: 1
      transaction.state.log.min.isr: 1
      default.replication.factor: 1
      min.insync.replicas: 1
  entityOperator:
    topicOperator: {}
    userOperator: {}
---
apiVersion: kafka.strimzi.io/v1
kind: KafkaTopic
metadata:
  name: microcks-services-updates
  labels:
    strimzi.io/cluster: microcks-kafka
spec:
  partitions: 1
  replicas: 1
EOF
```

Wait for the Kafka cluster to become ready (pulling the images may take a few minutes):

```sh
  kubectl wait kafka/microcks-kafka -n microcks --for=condition=Ready --timeout=600s
```

Check that Strimzi created the TLS routes for the bootstrap server and the broker:

```sh
  kubectl get tlsroute -n microcks
```

```sh
NAME                             HOSTNAMES                              AGE
microcks-kafka-dual-role-0       ["broker-0.kafka.127.0.0.1.nip.io"]    1m
microcks-kafka-kafka-bootstrap   ["bootstrap.kafka.127.0.0.1.nip.io"]   1m
```

Now, upgrade the Microcks release to enable the asynchronous features. Microcks and its async minion connect to Kafka from inside the cluster, using the internal bootstrap service. The WebSocket endpoint is attached to the `microcks-ws-https` listener created in step 4:

```sh
  helm upgrade microcks microcks/microcks \
  --namespace microcks \
  --reuse-values \
  --set features.async.enabled=true \
  --set features.async.kafka.install=false \
  --set features.async.kafka.url=microcks-kafka-kafka-bootstrap:9092 \
  --set features.async.ws.gatewayRefSectionName=microcks-ws-https
```

Check that the WebSocket route has been created next to the Microcks and Keycloak ones:

```sh
  kubectl get httproute -n microcks
```

```sh
NAME                HOSTNAMES                          AGE
microcks            ["microcks.127.0.0.1.nip.io"]      12m
microcks-keycloak   ["keycloak.127.0.0.1.nip.io"]      12m
microcks-ws         ["microcks-ws.127.0.0.1.nip.io"]   30s
```

Watch and check the pods you should get in the namespace:

```sh
  kubectl get pods -n microcks
```

You should see the `microcks-async-minion`, `microcks-kafka-dual-role-0`, `microcks-kafka-entity-operator` and `strimzi-cluster-operator` pods running, in addition to the pods from the basic installation. The async minion may restart a few times while Kafka is starting.

Extract the Kafka cluster CA certificate, which external clients need to trust the brokers:

```sh
  kubectl get secret microcks-kafka-cluster-ca-cert -n microcks -o jsonpath='{.data.ca\.crt}' | base64 -d > ca.crt
```

You can now apply the checks found at [Async Features with Docker Compose](https://microcks.io/blog/async-features-with-docker-compose/).

Start with loading the [User signed-up API](https://microcks.io/blog/async-features-with-docker-compose/#load-a-sample-and-check-up) sample within your Microcks instance - remember that you have to validate the self-signed certificates like in the basic install first.

Now connect to the Kafka broker pod to check that a topic has been correctly created and that you can consume messages from there:

```sh
  kubectl -n microcks exec microcks-kafka-dual-role-0 -it -- /bin/sh
```
```sh
--- INPUT ---
sh-4.4$ cd bin
sh-4.4$ ./kafka-topics.sh --bootstrap-server localhost:9092 --list
UsersignedupAPI-0.1.1-user-signedup
__consumer_offsets
microcks-services-updates

sh-4.4$ ./kafka-console-consumer.sh --bootstrap-server microcks-kafka-kafka-bootstrap:9092 --topic UsersignedupAPI-0.1.1-user-signedup
{"id": "eNc5TNaPlHAKa38XQA8N7HkSRHl7Yvm1", "sendAt": "1703699907417", "fullName": "Laurent Broudoux", "email": "laurent@microcks.io", "age": 41}
{"id":"g9uDUhXPOPtwK9bZYSGmqbxHAC3tTxAz","sendAt":"1703699907428","fullName":"John Doe","email":"john@microcks.io","age":36}
{"id": "kllBuhcv3kTRNg75sFxWH6HGLtSbpXwZ", "sendAt": "1703699917413", "fullName": "Laurent Broudoux", "email": "laurent@microcks.io", "age": 41}
{"id":"YE2ZAdVwSK9JLGEyLFebHxMOVfmYlzs1","sendAt":"1703699917426","fullName":"John Doe","email":"john@microcks.io","age":36}
^CProcessed a total of 4 messages
sh-4.4$ exit
exit
command terminated with exit code 130
```

And finally, from your Mac host, you can install the [`kcat`](https://github.com/edenhill/kcat) utility to consume messages through the Gateway as well. You'll need to refer to the `ca.crt` certificate you previously extracted:

```sh
  kcat -b bootstrap.kafka.127.0.0.1.nip.io:443 -X security.protocol=SSL -X ssl.ca.location=ca.crt -t UsersignedupAPI-0.1.1-user-signedup
```
```sh

% Auto-selecting Consumer mode (use -P or -C to override)
{"id": "zYcAzFlRoTGvu9Mu4ajg30lr1fBa4Kah", "sendAt": "1703699827456", "fullName": "Laurent Broudoux", "email": "laurent@microcks.io", "age": 41}
{"id":"v0TkDvd1Z7RxynQvi1i0NmXAaLPzuYXE","sendAt":"1703699827585","fullName":"John Doe","email":"john@microcks.io","age":36}
{"id": "JK55813rQ938Hj50JWXy80s5KWC61Uvr", "sendAt": "1703699837416", "fullName": "Laurent Broudoux", "email": "laurent@microcks.io", "age": 41}
{"id":"MZnR6UeKVXMhJET6asTjafPpfldiqXim","sendAt":"1703699837430","fullName":"John Doe","email":"john@microcks.io","age":36}
[...]
% Reached end of topic UsersignedupAPI-0.1.1-user-signedup [0] at offset 30
^C%  
```

## 7. Delete everything and stop the cluster

To remove the Microcks installation, delete the Helm releases and the Kubernetes resources created for Envoy Gateway.

Delete Microcks first:

```sh
  helm delete microcks -n microcks
```

```sh

Release "microcks" uninstalled
```

If you followed step 6, delete the Kafka cluster and the Strimzi operator:

```sh
  kubectl delete kafkatopic,kafka,kafkanodepool --all -n microcks
  kubectl delete -f 'https://strimzi.io/install/latest?namespace=microcks' -n microcks
```

Delete the Gateway and its supporting resources:

```sh
  kubectl delete gateway microcks-gateway -n microcks
  kubectl delete envoyproxy microcks-proxy -n microcks
  kubectl delete secret microcks-local-tls -n microcks
  kubectl delete gatewayclass envoy
```

Then uninstall Envoy Gateway:

```sh
  helm uninstall envoy-gateway -n envoy-gateway-system
```

```sh

Release "envoy-gateway" uninstalled
```

Helm does not remove the CRDs installed by the Envoy Gateway chart. Delete the Gateway API and Envoy Gateway CRDs, then the namespaces:

```sh
  kubectl get crd -o name | grep -E 'gateway\.networking\.k8s\.io|gateway\.envoyproxy\.io' | xargs kubectl delete
  kubectl delete namespace microcks envoy-gateway-system
```

Finally, you can delete the cluster if you want:

```sh
  kind delete cluster
```

```sh

Deleting cluster "kind" ...
Deleted nodes: ["kind-control-plane"]
```

## Wrap-up

You've been through this guide and learned how to install Microcks on a Kubernetes cluster using Helm. Congrats! 🎉

If you'd like to learn more about all the available installation parameters, you can check our [Helm Chart Parameters](/documentation/references/configuration/helm-chart-config) reference documentation.

Happy learning!
