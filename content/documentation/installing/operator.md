---
draft: false
title: "Installing with Kubernetes Operator"
date: 2020-02-11
publishdate: 2020-02-11
lastmod: 2020-12-08
menu:
  docs:
    parent: installing
    name: Installing with Kubernetes Operator
    weight: 20
toc: true
weight: 20 #rem
---

## Overview 

Operators are next-gen installer, maintainer and life-cycle manager for Kubernetes native applications. Operators are Kubernetes native piece of software (aka Kube controller) that manage specific `Custom Resources` defining their domain of expertise. Microcks provide an Operator that was developed using the [Operator Framework SDK](https://github.com/operator-framework/operator-sdk) and that is distributed through [OperatorHub.io](https://operatorhub.io/operator/microcks).

At time of writing, Microcks only define one cutomer resource that is called the `MicrocksInstall`: a description of the instance configuration you want to deploy. The properties of this custom resource are described below.

Depending on your needs and usage of Operators, they can be easily deployed and managed using the [Operator Lifecycle Manager](https://github.com/operator-framework/operator-lifecycle-manager), an add-on that you may install into your Kubernetes cluster to track subscription and upgrades of operators. We describe both installation methods below: with or without Operator Lifecycle Manager (OLM).

## MicrocksInstall resource

Here's below the minimalistic form of a `MicrocksInstall`. You just have to specify a name, the desired version of Microcks and replicas.

```yaml
apiVersion: microcks.github.io/v1alpha1
kind: MicrocksInstall
metadata:
  name: microcks
spec:
  name: microcks
  version: "0.8.0"
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
  version: "0.8.1"
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

We recommend having a look at [operator documentation](https://github.com/microcks/microcks-ansible-operator) for full understanding of CR.

## On any Kube distribution without OLM

For development or on bare OpenShift and Kubernetes clusters, without Operator Lifecycle Management (OLM).

Start cloning this repos and then, optionnally, create a new project:

```sh
$ git clone https://github.com/microcks/microcks-ansible-operator.git
$ cd microcks-ansible-operator/
$ oc new-project microcks-operator
```

Then, from this repository root directory, create the specific CRDS and resources needed for Operator:

```sh
$ oc create -f deploy/crds/microcks_v1alpha1_microcksinstall_crd.yaml
$ oc create -f deploy/service_account.yaml 
$ oc create -f deploy/role.yaml
$ oc create -f deploy/role_binding.yaml 
```

Finally, deploy the operator:

```sh
$ oc create -f deploy/operator.yaml
```

Wait a minute or two and check everything is running:

```sh
$ oc get pods                                                                                                                                 
NAME                                        READY     STATUS    RESTARTS   AGE
microcks-ansible-operator-f58b97548-qj26l   1/1       Running   0          3m
```

Now just create a `MicrocksInstall` CR!


## On OpenShift 4 with OLM

As OpenShift 4.x is embedding OLM by default, it is fairly easy to realize a new Microcks installation. The video below shows an install from scratch on OpenShift but also expose the post-installation steps required for creating user and connecting to the app.

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
