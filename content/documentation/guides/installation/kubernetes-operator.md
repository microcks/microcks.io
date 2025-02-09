---
draft: false
title: "On Kubernetes with Operator"
date: 2024-04-30
publishdate: 2024-04-30
lastmod: 2025-01-22
weight: 9
---

## Overview

This guide shows you how to deploy and use the [Microcks Kubernetes Operator](https://github.com/microcks/microcks-operator). If you're not familiar with Operators, we recommend having a read of this [excellent introduction on Kubernetes Operators](https://www.cncf.io/blog/2022/06/15/kubernetes-operators-what-are-they-some-examples/) and their benefits.

The Microcks Operator offers advanced features comparing to the Helm chart and can be used in a complete [GitOps approach](https://www.redhat.com/en/topics/devops/what-is-gitops) where all the content of a Microcks instance can be pulled from a Git repository. Deploying this practice will allow the automated creation of fully-configured instances on demand, in seconds or minutes, and in a full reproducible way. The Microcks Operator is the cornerstone for your Sandbox-as-a-Service approach!

Let's walk the different steps 🥾

## 1. Operator deployment

Before starting, we'll assume you have access to a working Kubernetes cluster with the adminstrator privileges. If it's not the case, please ask your favorite SRE or Platform Engineer to do this preparation step for you. If you're practicing, you can also use a local Minikube or Kind cluster. You can have a look a the first two steps of our [Minikube with Helm](/documentation/guides/installation/minikube-helm) or [Kind with Helm](/documentation/guides/installation/minikube-helm) installation guides to do so.

First thing, you need to do is to install the [Custom Resource Definitions](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) of the Operator in your cluster. You can do this directly pointing to the resources on our GitHub repository: 

```shell
kubectl apply -f https://raw.githubusercontent.com/microcks/microcks-operator/refs/heads/main/deploy/crd/microckses.microcks.io-v1.yml
kubectl apply -f https://raw.githubusercontent.com/microcks/microcks-operator/refs/heads/main/deploy/crd/apisources.microcks.io-v1.yml
kubectl apply -f https://raw.githubusercontent.com/microcks/microcks-operator/refs/heads/main/deploy/crd/secretsources.microcks.io-v1.yml
```

Then, you can install the operator itself in a dedicated namespace - let's say `microcks` - using:

```shell
kubectl create namespace microcks
kubectl apply -f https://raw.githubusercontent.com/microcks/microcks-operator/refs/heads/main/deploy/operator-jvm.yaml -n microcks
```

> 💡 For a reproducible production-grade deployment, we recommend using tagged versions of the resource definitions. It means you have to replace the `/heads/main` part or the above URLs by `/tags/<version>`. For example: `/tags/0.0.3/` if you want to pin the `0.0.3` version of the operator.

## 2. Install Microcks with default options

Once the operator is up and running, you can create a new `Microcks` Custom Resource (CR) to get a working instance of Microcks.

The default options of the Custom Resource will deploy a full Microcks instance without the asynchronous components (the Async Minion and the Kafka broker) such as explained in [Architecture & deployment options](/documentation/explanations/deployment-options/). The access to Microcks and Keycloak is done using Ingresses by default.

In below example, we're creating a new `Microcks` CR named `microcks` that will install Microcks `1.11.0`. You need to customize the two url fields to match your environment with DNS names that will be mapped to the Microcks and Keycloak ingresses:

```yaml
cat <<EOF | kubectl apply -n microcks -f -
apiVersion: microcks.io/v1alpha1
kind: Microcks
metadata:
  name: microcks
spec:
  version: 1.11.0
  microcks:
    url: microcks.m.minikube.local
  keycloak:
    url: keycloak.m.minikube.local
EOF
```

Wait a bit for the operator to be triggered, the images to be pulled, pods to be started and ingresses to be there:

```shell
$ kubectl get pods -n microcks
--- OUTPUT --- 
NAME                                            READY   STATUS    RESTARTS   AGE
microcks-6779c95d59-v2p7j                       1/1     Running   0          55s
microcks-keycloak-7cc44f6cb5-ntgl6              1/1     Running   0          56s
microcks-keycloak-postgresql-85b69859d9-nwqqs   1/1     Running   0          56s
microcks-mongodb-5f7764bbd8-fgqhb               1/1     Running   0          56s
microcks-operator-6ff95d44f9-5kgvq              1/1     Running   0          73s
microcks-postman-runtime-6fdd4659f5-vm76j       1/1     Running   0          55s

$ kubectl get ingresses -n microcks
--- OUTPUT --- 
NAME                CLASS    HOSTS                             ADDRESS        PORTS     AGE
microcks            <none>   microcks.m.minikube.local        192.168.49.2   80, 443   3m20s
microcks-grpc       nginx    microcks-grpc.m.minikube.local   192.168.49.2   80, 443   85s
microcks-keycloak   <none>   keycloak.m.minikube.local        192.168.49.2   80, 443   3m19s
```

Start opening `https://keycloak.m.minikube.local` in your browser to validate the self-signed certificate. Once done, you can visit `https://microcks.m.minikube.local` in your browser, validate the self-signed certificate and start playing around with Microcks!

The default user/password is `admin/microcks123`

## 3. Use Operator Custom Resources

As said in the Overview section, one goal of the Microcks Operator is to allow you to manage all the content of your Microcks instance via Kubernetes resources only to allow a full GitOps approach. For that, the operator also provides the `APISource` and `SecretSource` Custom Resources to load pre-existing API definitions and connection secrets into an operator-managed Microcks instance.

### APISource resource

For example, you can create a new `APISource` CR named `tests-artifacts` that will load four artifacts into the microcks instance and create an additional `Hello Soap Service` importer. Instead of [importing Services & APIs via the UI or the API](/documentation/guides/usage/importing-content/) or [creating an importer](/documentation/guides/usage/importing-content/#2-import-content-via-importer), you can directly apply this YAML resource on your Kubernetes namespace:

```yaml
cat <<EOF | kubectl apply  -n microcks -f -
apiVersion: microcks.io/v1alpha1
kind: APISource
metadata:
  name: tests-artifacts
  annotations:
    microcks.io/instance: microcks
spec:
  artifacts:
    - url: https://raw.githubusercontent.com/microcks/microcks/master/samples/APIPastry-openapi.yaml
      mainArtifact: true
    - url: https://raw.githubusercontent.com/microcks/microcks/master/samples/hello-v1.proto
      mainArtifact: true
    - url: https://raw.githubusercontent.com/microcks/microcks/master/samples/HelloService.metadata.yml
      mainArtifact: false
    - url: https://raw.githubusercontent.com/microcks/microcks/master/samples/HelloService.postman.json
      mainArtifact: false
  importers:
    - name: Hello Soap Service
      mainArtifact: true
      active: false
      repository:
        url: https://raw.githubusercontent.com/microcks/microcks/master/samples/HelloService-soapui-project.xml
      labels:
        domain: authentication
        status: GA
        team: Team A
EOF
```

There are three important things to notice here:

* The target Microcks instance to those API & Services is provided by the `microcks.io/instance` annotation,
* The connection to this target instance is realized using a specific [Service Account](/documentation/explanations/service-account/) named `microcks-operator-serviceaccount` and created by the Operator during the installation of Keycloak. The operator also supports using an external Keycloak instance - we recommend to read [this advanced documentation](https://github.com/microcks/microcks-operator/blob/main/documentation/microcks-dependent-cr.md) for the setup,
* This resource allows you to specify primary and secondary artifacts using the `mainArtifact` property in the respect of [Multi-artifacts support](/documentation/explanations/multi-artifacts/)

### SecretSource resource

A Microcks instance may also [need some Secrets](/documentation/guides/administration/secrets/) to be able to connect or to authenticate to external services like repositories or messaging brokers. The `SecretSource` CR is here to help you define those secrets and have them loaded into the Microcks instance.

For example, you can create a new `SecretSource` CR named `tests-secrets` that will load two secrets into the `microcks` instance. The first one is a simple secret with username, password, token and CA certificate. The second one is a secret that will be loaded from a Kubernetes secret named `microcks-keycloak-admin` and will use the `username` and `password` keys from this secret:

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: microcks.io/v1alpha1
kind: SecretSource
metadata:
  name: tests-secrets
  annotations:
    microcks.io/instance: microcks
spec:
  secrets:
    - name: my-secret
      description: My secret description
      username: my-username
      password: my-password
      token: my-token
      tokenHeader: my-token-header
      caCertPem: |
        ----BEGIN CERTIFICATE-----
        SGVsbG8gZXZlcnlvbmUgYW5kIHdlbGNvbWUgdG8gTWljcm9ja3Mh
        ----END CERTIFICATE-----
    - name: my-secret-2
      description: My secret description 2
      valuesFrom:
        secretRef: microcks-keycloak-admin
        usernameKey: username
        passwordKey: password
EOF
```

There are three important things to notice here:

* Like the `APISource`, the target Microcks instance to those API & Services is provided by the `microcks.io/instance` annotation,
* The connection to this target instance is realized using a specific [Service Account](/documentation/explanations/service-account/) named `microcks-operator-serviceaccount` and created by the Operator during the installation of Keycloak. The operator also supports using an external Keycloak instance - we recommend to read [this advanced documentation](https://github.com/microcks/microcks-operator/blob/main/documentation/microcks-dependent-cr.md) for the setup,
* The synchronization with Kubernetes Secrets is limited to the namespace secrets. As the operator is scoped to a namespace, it is not able to view secrets outside its namespace.

### Status management

`APISource` artifacts may need and reference secrets to accesss remote repositories. As one cannot predict the order of resource reconcialiation in Kubernetes, if an `APISource` artifact creation is failing because of a missing secret, the reconciliation will be retried after a certain delay. The operator will track the status of each `APISource` artifact & importers as well as `SecretSource` secrets using the `Status` property of the corresponding resource.

You can check the description of the `Status` property for `APISource` [here](https://github.com/microcks/microcks-operator/blob/main/documentation/apisource-cr.md) and you can check the description of the `Status` property for `SecretSource` [there](https://github.com/microcks/microcks-operator/blob/main/documentation/secretsource-cr.md).


## 4. Install Microcks with asynchronous options

In this section, we're doing a complete install of Microcks, enabling the asynchronous protocols feature. To do so, the Operator will need either an existing Kafka cluster or it can provision and mange its own using the [Strimzi](https://strimzi.io) operator. Ask your favorite SRE or Platform Engineer for the best option. If you're oinging the Strimzi way, it will require administrator privileges to install Strimzi.

You can install Strimzi in different ways but the easier is just to execute the following command: 

```sh
kubectl create -f 'https://strimzi.io/install/latest?namespace=microcks' -n microcks
```

To be able to expose the Kafka cluster to the outside of Minikube, you’ll need to enable SSL passthrough on your ingress controller. Typically, using nginx, this require updating the default ingress controller deployment like below:

```sh
kubectl patch -n ingress-nginx deployment/ingress-nginx-controller --type='json' \
    -p '[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--enable-ssl-passthrough"}]'
```

So assuming you're having the Strimzi operator up and runinng in your `microcks` namespace, you can now create a new Microcks instance with additional properties to enable the asynchronous feature and to popup a new Kafka cluster that will be made available to users at `kafka.m.minikube.local`:

```yaml
cat <<EOF | kubectl apply -n microcks -f -
apiVersion: microcks.io/v1alpha1
kind: Microcks
metadata:
  name: microcks
spec:
  version: 1.11.0
  microcks:
    url: microcks.m.minikube.local
  keycloak:
    url: keycloak.m.minikube.local
  features:
    async: 
      enabled: true
      kafka:
        url: kafka.m.minikube.local
EOF
```

> 💡 The `spec.features.async.kafka` section has an `install` property those defeault value is `true`. You can also setup to `false` and then provide connection details to your own pre-existing Kafka cluster. See the reference documentation on [Reusing an existing secured Kafka](/documentation/references/configuration/security-config/#kafka)

Watch and check the pods you should get in the namespace:

```sh
$ kubectl get pods -n microcks
NAME                                              READY   STATUS    RESTARTS        AGE
microcks-585d4554bf-bplwc                         1/1     Running   0               7m21s
microcks-async-minion-545d5bf4fc-l5xrq            1/1     Running   3 (3m43s ago)   7m21s
microcks-kafka-entity-operator-55b4db89b5-zktlk   2/2     Running   0               2m14s
microcks-kafka-kafka-0                            1/1     Running   0               3m37s
microcks-kafka-zookeeper-0                        1/1     Running   1 (5m33s ago)   7m14s
microcks-keycloak-7cc44f6cb5-cd7mj                1/1     Running   0               7m22s
microcks-keycloak-postgresql-85b69859d9-mrzs2     1/1     Running   0               7m22s
microcks-mongodb-5f7764bbd8-qxn72                 1/1     Running   0               7m22s
microcks-operator-6ff95d44f9-5kgvq                1/1     Running   0               33m
microcks-postman-runtime-6fdd4659f5-qx27x         1/1     Running   0               7m21s
strimzi-cluster-operator-76d9558969-ll2mn         1/1     Running   0               8m21s
```

Now you can extract the Kafka cluster certificate using `kubectl get secret microcks-kafka-cluster-ca-cert -n microcks -o jsonpath='{.data.ca\.crt}' | base64 -d > ca.crt` and apply the checks found at [Async Features with Docker Compose](https://microcks.io/blog/async-features-with-docker-compose/).

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
{"id": "sinHVoQvNdA3Bhl4fi57IVI15390WBkn", "sendAt": "1703599175911", "fullName": "Laurent Broudoux", "email": "laurent@microcks.io", "age": 41}
{"id":"650YIRQaB2OsG52txubYAEJfdFB3jOzh","sendAt":"1703599175914","fullName":"John Doe","email":"john@microcks.io","age":36}
{"id": "QWimzV9X1BRgIodOWoDdsP9EKtFSniDW", "sendAt": "1703599185914", "fullName": "Laurent Broudoux", "email": "laurent@microcks.io", "age": 41}
{"id":"ivMQIz7J7IXqps5yqcaVo6qvuByhviVk","sendAt":"1703599185921","fullName":"John Doe","email":"john@microcks.io","age":36}
{"id": "hEUfxuQRHHZkt9zFzMl5ti9DOIp12vpd", "sendAt": "1703599195914", "fullName": "Laurent Broudoux", "email": "laurent@microcks.io", "age": 41}
{"id":"OggnbfXX67QbfeMGXOTiOGT2BuqEPCPL","sendAt":"1703599195926","fullName":"John Doe","email":"john@microcks.io","age":36}
^CProcessed a total of 6 messages
sh-4.4$ exit
exit
command terminated with exit code 130
```

That's it! You deployed a full Microcks instance using the operator! 🚀

## 5. Delete everything and remove the Operator

Deleting everything from your namespace and cluster is straightforward. You can start deleting the `APISource` and `SecretSource` resources we created before. And then, delete the `Microcks` resource itself. If you have used Strimzi for provisioning a Kafka broker, this broker will be deleted as well with the Microcks instance.

```sh
kc delete apisources/tests-artifacts -n microcks
kc delete secretsources/tests-secrets -n microcks
kc delete microckses/microcks -n microcks
```

Finally, you can remove the Microcks Operator itself:

```sh
kc delete -f https://raw.githubusercontent.com/microcks/microcks-operator/refs/heads/main/deploy/operator-jvm.yaml -n microcks
```

## Wrap-up

You've been through this guide and learned how to install Microcks on a Kubernetes cluster using the Operator. Congrats! 🎉

If you want to get more information about available deployment options and production-grade deployment concerns, we'd recommend looking at [Architecture & deployment options](http://localhost:1313/documentation/explanations/deployment-options/#deploying-on-kubernetes) documentation. If you like to review all the available installation parameters, you can check our [reference documentation on GitHub](https://github.com/microcks/microcks-operator/blob/main/README.md).

Happy learning!