---
draft: false
title: "On Kube using Operator"
date: 2020-02-11
publishdate: 2020-02-11
lastmod: 2021-04-28
weight: 2
---

## Overview 

Operators are next-gen installer, maintainer and life-cycle manager for Kubernetes native applications. Operators are a Kubernetes native piece of software (aka Kube controller) that manages specific `Custom Resources` defining their domain of expertise. Microcks provide an Operator that was developed using the [Operator Framework SDK](https://github.com/operator-framework/operator-sdk) and that is distributed through [OperatorHub.io](https://operatorhub.io/operator/microcks).

At the time of writing, Microcks only defines one customer resource that is called the `MicrocksInstall`: a description of the instance configuration you want to deploy. The properties of this custom resource are briefly described below.

Depending on your needs and usage of Operators, they can be easily deployed and managed using the [Operator Lifecycle Manager](https://github.com/operator-framework/operator-lifecycle-manager), an add-on that you may install into your Kubernetes cluster to track subscription and upgrades of operators. We describe both installation methods below: with or without Operator Lifecycle Manager (OLM).

## Minikube Quick Start

This assumes that you have the latest version of the `minikube` binary, which you can get [here](https://kubernetes.io/docs/setup/minikube/#installation).

```sh
$ minikube start --vm=true --cpus=4 --memory=6144 # 2cpus and 2GB default memory isn't always enough
$ minikube addons enable ingress
```

> Make sure to start minikube with your configured VM. If need help look at the [documentation](https://kubernetes.io/docs/setup/minikube/#quickstart) for more.

Next we create a Kubernetes namespace and deploy the latest version of the Microcks Operator:

```sh
$ kubectl create namespace microcks
$ kubectl apply -f https://microcks.io/operator/operator-latest.yaml -n microcks
```

From this point, you have the choice of deploying:

* Either, a minimal Microcks instance that will allow you to mock and test REST APIs and SOAP WebServices as well as import AsyncAPI. However it will not allow you to play with AsyncAPI mocking features,
* Or, a fully featured Microcks instance.

### Option 1: Minimal features

Retrieve the `minikube-minimal.yaml` manifest from our website and apply a substitution of `KUBE_APPS_URL` with your local Minikube IP address:

```sh
$ curl https://microcks.io/operator/minikube-minimal.yaml -s | sed 's/KUBE_APPS_URL/'$(minikube ip)'.nip.io/g' | kubectl apply -n microcks -f -
```

After some minutes, check all the pods are up and running. You should have 6 pods (including the Operator) running:

```sh
$ kubectl get pods -n microcks
NAME                                              READY   STATUS    RESTARTS   AGE
microcks-64dbf6dc9d-c5c6v                         1/1     Running   0          1h
microcks-ansible-operator-6f76fcc5cb-d2br4        1/1     Running   0          1h
microcks-keycloak-fd7467749-24cvs                 1/1     Running   0          1h
microcks-keycloak-postgresql-549f469d7d-pw7mz     1/1     Running   0          1h
microcks-mongodb-7b54785454-vsssq                 1/1     Running   0          1h
microcks-postman-runtime-75f74d6779-9gjrn         1/1     Running   0          1h
```

### Option 2: Full features

```sh
$ kubectl apply -f 'https://strimzi.io/install/latest?namespace=microcks' -n microcks
$ curl https://microcks.io/operator/minikube-features.yaml -s | sed 's/KUBE_APPS_URL/'$(minikube ip)'.nip.io/g' | kubectl apply -n microcks -f -
```

If you need to access the Kafka cluster from the outside, you'll also have to enable the `SSL Passthrough` within the Nginx Ingress controller:

```sh
$ kubectl patch -n ingress-nginx deployment/ingress-nginx-controller --type='json' \
    -p '[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--enable-ssl-passthrough"}]'
```

After some minutes, check all the pods are up and running. You should have 10 pods (including the Operator) running:

```sh
$ kubectl get pods -n microcks
NAME                                              READY   STATUS    RESTARTS   AGE
microcks-64dbf6dc9d-c5c6v                         1/1     Running   0          1h
microcks-ansible-operator-6f76fcc5cb-d2br4        1/1     Running   0          1h
microcks-async-minion-57c4c46f7d-mcl27            1/1     Running   2          1h
microcks-kafka-entity-operator-54b9468564-k4ptg   3/3     Running   0          1h
microcks-kafka-kafka-0                            1/1     Running   0          1h
microcks-kafka-zookeeper-0                        1/1     Running   0          1h
microcks-keycloak-fd7467749-24cvs                 1/1     Running   0          1h
microcks-keycloak-postgresql-549f469d7d-pw7mz     1/1     Running   0          1h
microcks-mongodb-7b54785454-vsssq                 1/1     Running   0          1h
microcks-postman-runtime-75f74d6779-9gjrn         1/1     Running   0          1h
```

This installation process is demonstrated in following video that also demonstrates AsyncAPI mocking features:

{{< youtube id="ise7ljoGdEY" autoplay="false" >}}

### Post-installation operations

Now you can retrieve the URL of the created ingress using `kubectl get ingress -n microcks`.

Before starting playing with Microcks, you'll have to connect to the Keycloak component in order to configure an identity provider or define some users for the Microcks realm (see [Keycloak documentation](http://www.keycloak.org/docs/latest/server_admin/index.html#user-management)). Connection to Keycloak can be done using username and password stored into a `microcks-keycloak-config` secret created during setup.

> Starting with Microcks `1.2.0` release, the installation process now creates default users with the different roles available. So you can directly login using `user`, `manager` or `admin` username with `microcks123` password.

## MicrocksInstall resource

Here's below the minimalistic form of a `MicrocksInstall`. You just have to specify a name, the desired version of Microcks and replicas.

```yaml
apiVersion: microcks.github.io/v1alpha1
kind: MicrocksInstall
metadata:
  name: microcks
spec:
  name: microcks
  version: "1.2.1"
  microcks:
    replicas: 1
  postman:
    replicas: 1
```

This form can only be used onto OpenShift as vanilla Kube will need more information to customize `Ingress`. Here's for example a full version that can be used onto Minikube:

```yaml
apiVersion: microcks.github.io/v1alpha1
kind: MicrocksInstall
metadata:
  name: microcks-minikube
spec:
  name: microcks-minikube
  version: "1.2.1"
  microcks: 
    replicas: 1
    url: microcks.192.168.99.100.nip.io
  postman:
    replicas: 2
  keycloak:
    install: true
    persistent: true
    volumeSize: 1Gi
    url: keycloak.192.168.99.100.nip.io
    replicas: 1
  mongodb:
    install: true
    persistent: true
    volumeSize: 2Gi
    replicas: 1
```

We recommend having a look at the [operator documentation](https://github.com/microcks/microcks-ansible-operator) for full understanding of CR.

## On any Kube distribution without OLM

For development or on bare OpenShift and Kubernetes clusters, without Operator Lifecycle Management (OLM).

Start cloning this repos and then, optionally, create a new project:

```sh
$ git clone https://github.com/microcks/microcks-ansible-operator.git
$ cd microcks-ansible-operator/
$ kubectl create namespace microcks
```

Then, from this repository root directory, create the specific CRDS and resources needed for Operator:

```sh
$ kubectl create -f deploy/crds/microcks_v1alpha1_microcksinstall_crd.yaml
$ kubectl create -f deploy/service_account.yaml -n microcks
$ kubectl create -f deploy/role.yaml -n microcks
$ kubectl create -f deploy/role_binding.yaml -n microcks 
```

Finally, deploy the operator:

```sh
$ kubectl create -f deploy/operator.yaml -n microcks
```

Wait a minute or two for the deployment to be ready:

```sh
kubectl wait --for=condition=available --timeout=600s deployment/microcks-ansible-operator -n microcks
```

Finally, check everything is running:

```sh
$ kubectl get pods -n microcks                               
NAME                                        READY     STATUS    RESTARTS   AGE
microcks-ansible-operator-f58b97548-qj26l   1/1       Running   0          3m
```

Now just create a `MicrocksInstall` CR!


## On OpenShift 4 with OLM

As OpenShift 4.x is embedding OLM by default, it is fairly easy to realize a new Microcks installation. The video below shows an install from scratch on OpenShift but also exposes the post-installation steps required for creating user and connecting to the app.

{{< youtube id="P2RFDxL0xsA" autoplay="false" >}}


## On Kubernetes with OLM

Install Operator Lifecycle Manager (OLM), a tool to help manage the Operators running on your cluster.

```sh
$ curl -sL https://github.com/operator-framework/operator-lifecycle-manager/releases/download/0.14.1/install.sh | bash -s 0.13.0
```

Install the operator by running the following command:

```sh
$ kubectl create -f https://operatorhub.io/install/microcks.yaml
```

For more details on what's going on with this command, check [this page](https://operatorhub.io/how-to-install-an-operator#What-happens-when-I-execute-the-'Install'-command-presented-in-the-pop-up?).
This Operator will be installed in the `my-microcks` namespace and will be usable from this namespace only. After install, watch your operator come up using next command.

```sh
$ kubectl get csv -n my-microcks
```

To use it, checkout the custom resource definitions (CRDs) introduced by this operator to start using it.
