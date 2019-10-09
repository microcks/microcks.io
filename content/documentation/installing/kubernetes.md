---
draft: false
title: "Installing on Kubernetes"
date: 2019-09-01
publishdate: 2019-09-01
lastmod: 2019-09-02
menu:
  docs:
    parent: installing
    name: Installing on Kubernetes
    weight: 30
toc: true
weight: 10 #rem
categories: [installing]
---

## Installing on Kubernetes

### Instructions

One easy way if installing Microcks is to do it on Kubernetes. Kubernetes in version 1.6 or greater is required. It is assumed that you have some kind of Kubernetes cluster up and running available. This can take several forms depending on your environment and needs:

* Lightweight Minikube on your laptop, see [Minikube project page](https://github.com/kubernetes/minikube),
* Google Cloud Engine account in the cloud, see how to start a [Free trial](https://console.cloud.google.com/freetrial),
* Any other Kubernetes distribution provider.

We provide [basic Kubernetes manifest](https://raw.githubusercontent.com/microcks/microcks/master/install/kubernetes/kubernetes-ephemeral-full.yml) for simple needs but also a <code>Chart</code> for using with [Helm](https://helm.sh/) Packet Manager. This is definitely the preferred way of installing apps on Kubernetes.

Just clone the GitHub repository, go to Helm directory and install the chart with these commands:

```
$ git clone https://github.com/microcks/microcks.git
$ cd microcks/install/kubernetes/helm
$ helm install ./microcks --name microcks --namespace=microcks
```

After some minutes and components have been deployed, you should end up with a Spring-boot Pod, a MongoDB Pod, a Postman-runtime Pod, a Keycloak Pod and a PostgreSQL Pod like in the screenshot below.

<img src="/images/running-pods-k8s.png" class="img-responsive"/>

Now you can retrieve the URL of the created ingress using <code>kubectl get ingress -n microcks</code>. Before starting playing with Microcks, you'll have to connect to Keycloak component in order to configure an identity provider or define some users for the Microcks realm (see [Keycloak documentation](http://www.keycloak.org/docs/latest/server_admin/index.html#user-management)). Connection to Keycloak can be done using username and password stored into a <code>microcks-keycloak-config</code> secret created during setup.

