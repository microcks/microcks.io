---
draft: false
title: "On Kind with Helm"
date: 2024-04-30
publishdate: 2024-04-30
lastmod: 2024-06-13
weight: 4
---

## Overview 

This guide will walk you through the different steps of running a full Microcks installation on your laptop using [Kind](https://kind.sigs.k8s.io). The step #4 is actually optional and may only be of interest if you'd like to use Asynchronous features of Microcks.

The installation notes were ran on an Apple Mac book M2 but those steps would sensibly be the same on any Linux machine. 

Let's go 🚀

## 1. Preparation

As being on a Mac, people usually use [brew](https://brew.sh) to install `kind`. However, it is also available from several different package managers out there. You can check the [Quick Start](https://kind.sigs.k8s.io/docs/user/quick-start/#installation) guide for that. Obviously, you'll also need the [`kubectl`](https://kubernetes.io/docs/tasks/tools/#kubectl) utility to interact with your cluster. 

```sh
$ brew install kind

$ kind --version
kind version 0.20.0
```

In a dedicated folder, prepare a `cluster-kind.yaml` configuration file like this:

```sh
$ cd ~/tmp
$ mkdir microcks && cd microcks
$ cat > cluster-kind.yaml <<EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP
EOF
```

## 2. Start and configure a cluster

We're now going to start a Kube cluster. Start your `kind` cluster using the `cluster-kind.yaml` configuration file we just created before:

```sh
$ kind create cluster --config=cluster-kind.yaml
--- OUTPUT ---
Creating cluster "kind" ...
 ✓ Ensuring node image (kindest/node:v1.27.3) 🖼 
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

Install an Ingress Controller in this cluster, we selected `nginx` but other options are available (see https://kind.sigs.k8s.io/docs/user/ingress ).

```sh
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
```

Wait for the controller to be available:

```sh
$ kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s
```

## 3. Install Microcks with default options

We're now going to install Microcks with basic options. We'll do that using the Helm Chart so you'll also need the [`helm`](https://helm.sh) binary. You can use `brew install helm` on Mac for that.

```sh
$ kubectl create namespace microcks

$ helm repo add microcks https://microcks.io/helm

$ helm install microcks microcks/microcks --namespace microcks --set microcks.url=microcks.127.0.0.1.nip.io --set keycloak.url=keycloak.127.0.0.1.nip.io --set keycloak.privateUrl=http://microcks-keycloak.microcks.svc.cluster.local:8080
--- OUTPUT ---
NAME: microcks
LAST DEPLOYED: Sun Dec  3 19:27:27 2023
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

Wait for images to be pulled, pods to be started and ingresses to be there:

```sh
$ kubectl get pods -n microcks
--- OUTPUT ---
NAME                                            READY   STATUS    RESTARTS   AGE
microcks-577874c5b6-z97zm                       1/1     Running   0          73s
microcks-keycloak-7477cd4fbb-tbmg7              1/1     Running   0          21s
microcks-keycloak-postgresql-868b7dbdd4-8zrbv   1/1     Running   0          10m
microcks-mongodb-78888fb67f-47fwh               1/1     Running   0          10m
microcks-postman-runtime-5d8fc9695-kp45w        1/1     Running   0          10m

$ kubectl get ingresses -n microcks
--- OUTPUT ---
NAME                CLASS    HOSTS                            ADDRESS     PORTS     AGE
microcks            <none>   microcks.127.0.0.1.nip.io        localhost   80, 443   10m
microcks-grpc       <none>   microcks-grpc.127.0.0.1.nip.io   localhost   80, 443   10m
microcks-keycloak   <none>   keycloak.127.0.0.1.nip.io        localhost   80, 443   10m
```

Start opening `https://keycloak.127.0.0.1.nip.io` in your browser to validate the self-signed certificate. Once done, you can visit `https://microcks.127.0.0.1.nip.io` in your browser, validate the self-signed certificate and start playing around with Microcks!

The default user/password is `admin/microcks123`

## 4. Install Microcks with asynchronous options

In this section, we're doing a complete install of Microcks, enabling the asynchronous protcolos feature. This requires deploying additional pods and a Kafka cluster. Microcks install can install and manage its own cluster using the [Strimzi](https://strimzi.io) project.

To be able to expose the Kafka cluster to the outside of Kind, you’ll need to enable SSL passthrough on nginx: This require updating the default ingress controller deployment:

```sh
$ kubectl patch -n ingress-nginx deployment/ingress-nginx-controller --type='json' \
    -p '[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--enable-ssl-passthrough"}]'
```

Then, you have to install the latest version of Strimzi that provides an easy way to setup Kafka on Kubernetes:
```sh
$ kubectl apply -f 'https://strimzi.io/install/latest?namespace=microcks' -n microcks
```

Now, you can install Microcks using the Helm chart and enable the asynchronous features:

```sh
$ helm install microcks microcks/microcks --namespace microcks --set microcks.url=microcks.127.0.0.1.nip.io --set keycloak.url=keycloak.127.0.0.1.nip.io --set keycloak.privateUrl=http://microcks-keycloak.microcks.svc.cluster.local:8080 --set features.async.enabled=true --set features.async.kafka.url=kafka.127.0.0.1.nip.io
--- OUTPUT ---
NAME: microcks
LAST DEPLOYED: Sun Dec  3 20:14:38 2023
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

Kafka broker has been deployed on microcks-kafka.kafka.127.0.0.1.nip.io.
It has been exposed using TLS passthrough on the Ingress controller, you should extract the certificate for your client using:

  $ kubectl get secret microcks-kafka-cluster-ca-cert -n microcks -o jsonpath='{.data.ca\.crt}' | base64 -d > ca.crt
```

Watch and check the pods you should get in the namespace:

```sh
$ kubectl get pods -n microcks
--- OUTPUT ---
NAME                                              READY   STATUS    RESTARTS        AGE
microcks-6ffcc7dc54-c9h4w                         1/1     Running   0               68s
microcks-async-minion-7f689d9ff7-ptv4c            1/1     Running   2 (40s ago)     48s
microcks-kafka-entity-operator-585dc4cd45-24tvp   3/3     Running   0               2m19s
microcks-kafka-kafka-0                            1/1     Running   0               2m41s
microcks-kafka-zookeeper-0                        1/1     Running   5 (4m56s ago)   6m43s
microcks-keycloak-77447d8957-fwhv6                1/1     Running   0               87s
microcks-keycloak-postgresql-868b7dbdd4-pb52g     1/1     Running   0               2m43s
microcks-mongodb-78888fb67f-7t2vf                 1/1     Running   4 (3m57s ago)   8m2s
microcks-postman-runtime-857c577dfb-d597r         1/1     Running   0               8m2s
strimzi-cluster-operator-95d88f6b5-p8bvs          1/1     Running   0               16m
```

Now you can extract the Kafka cluster certificate using `kubectl get secret microcks-kafka-cluster-ca-cert -n microcks -o jsonpath='{.data.ca\.crt}' | base64 -d > ca.crt` and apply the checks found at [Async Features with Docker Compose](https://microcks.io/blog/async-features-with-docker-compose/)

Start with loading the [User signed-up API](https://microcks.io/blog/async-features-with-docker-compose/#load-a-sample-and-check-up) sample within your Microcks instance - remember that you have to validate the self-signed certificates like in the basic install first.

Now connect to the Kafka broker pod to check a topic has been correctly created and that you can consume messages from there:


```sh
$ kubectl -n microcks exec microcks-kafka-kafka-0 -it -- /bin/sh
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

And finally, from your Mac host, you can install the [`kcat`](https://github.com/edenhill/kcat) utility to consume messages as well. You'll need to refer the `ca.crt` certificate you previsouly extracted from there:

```sh
$ kcat -b microcks-kafka.kafka.127.0.0.1.nip.io:443 -X security.protocol=SSL -X ssl.ca.location=ca.crt -t UsersignedupAPI-0.1.1-user-signedup
--- OUTPUT ---
% Auto-selecting Consumer mode (use -P or -C to override)
{"id": "zYcAzFlRoTGvu9Mu4ajg30lr1fBa4Kah", "sendAt": "1703699827456", "fullName": "Laurent Broudoux", "email": "laurent@microcks.io", "age": 41}
{"id":"v0TkDvd1Z7RxynQvi1i0NmXAaLPzuYXE","sendAt":"1703699827585","fullName":"John Doe","email":"john@microcks.io","age":36}
{"id": "JK55813rQ938Hj50JWXy80s5KWC61Uvr", "sendAt": "1703699837416", "fullName": "Laurent Broudoux", "email": "laurent@microcks.io", "age": 41}
{"id":"MZnR6UeKVXMhJET6asTjafPpfldiqXim","sendAt":"1703699837430","fullName":"John Doe","email":"john@microcks.io","age":36}
[...]
% Reached end of topic UsersignedupAPI-0.1.1-user-signedup [0] at offset 30
^C%  
```

## 5. Delete everything and stop the cluster

Deleting the microcks Helm release from your cluster is straightforward. Then you can finally delete your Kind cluster to save some resources!

```sh
$ helm delete microcks -n microcks
--- OUTPUT ---
release "microcks" uninstalled

$ kind delete cluster
--- OUTPUT ---
Deleting cluster "kind" ...
Deleted nodes: ["kind-control-plane"]
```

## Wrap-up

You've been through this guide and learned how to install Microcks on a Kubernetes cluster using Helm. Congrats! 🎉

If you'd like to learn more about all the available installation parameters, you can check our [Helm Chart Parameters](/documentation/references/configuration/helm-chart-config) reference documentation.

Happy learning!
