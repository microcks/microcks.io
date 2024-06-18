---
draft: false
title: "Helm Chart Parameters"
date: 2024-04-29
publishdate: 2024-04-29
lastmod: 2024-06-17
weight: 3
---

## Introduction

One easy way of installing Microcks is via a [Helm Chart](https://helm.sh/). Kubernetes version 1.17 or greater is required. It is assumed that you have some kind of Kubernetes cluster up and running available. This can take several forms depending on your environment and needs:

* Lightweight Minikube on your laptop, see [Minikube project page](https://github.com/kubernetes/minikube),
* A Google Cloud Engine account in the cloud, see how to start a [Free trial](https://console.cloud.google.com/freetrial),
* Any other Kubernetes distribution provider.

## Helm 3 Chart

Microcks provides a Helm 3 chart that is now available on our own repository: https://microcks.io/helm. This allows you to install Microcks with just 3 commands:

```sh
$ helm repo add microcks https://microcks.io/helm

$ kubectl create namespace microcks

$ helm install microcks microcks/microcks --version 1.9.1 --namespace microcks \
   --set microcks.url=microcks.$(minikube ip).nip.io \
   --set keycloak.url=keycloak.$(minikube ip).nip.io \
   --set keycloak.privateUrl=http://microcks-keycloak.microcks.svc.cluster.local:8080
```

## Values Reference

For full instructions and deployment options, we recommend reading the [README](https://github.com/microcks/microcks/blob/master/install/kubernetes/README.md) on GitHub repository.
