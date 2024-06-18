---
draft: false
title: "Operator Configuration"
date: 2024-04-29
publishdate: 2024-04-29
lastmod: 2024-05-17
weight: 4
---

## Introduction

Operators are next-gen installer, maintainer and life-cycle manager for Kubernetes native applications. Operators are a Kubernetes native piece of software (aka Kube controller) that manages specific `Custom Resources` defining their domain of expertise. Microcks provide an Operator that was developed using the [Operator Framework SDK](https://github.com/operator-framework/operator-sdk) and that is distributed via [OperatorHub.io](https://operatorhub.io/operator/microcks).

Microcks project currently proposes two operator with different maturity:
* The *Ansible-based Operator* is the legacy one. It is production release and currently distributed via [OperatorHub.io](https://operatorhub.io/operator/microcks) 
* The *Quarkus-based Operator* which is an ongoing effort in active development for providing a more robust, scalable and fezature-rich operator in the future.

## Ansible-based Operator

Microcks Ansible Operator only defines one customer resource that is called the `MicrocksInstall`: a description of the instance configuration you want to deploy. The properties of this custom resource are briefly described below.

This operator is scoped to the namespace, you can easily install it in your namespace using:

```shell
kubectl apply -f https://microcks.io/operator/operator-latest.yaml -n microcks
```

or:

```shell
kubectl apply -f https://microcks.io/operator/operator-1.9.0.yaml -n microcks
```

### CustomResource Reference

For full instructions and deployment options, we recommend reading the [README](https://github.com/microcks/microcks-ansible-operator/blob/master/README.md) on the GitHub repository.

### Option 1: Minimal features

This below represent a minimalistic `MicrocksInstall` custom resource:

```yaml
apiVersion: microcks.github.io/v1alpha1
kind: MicrocksInstall
metadata:
  name: microcks
spec:
  name: microcks
  version: "1.9.1"
  microcks: 
    url: microcks.192.168.99.100.nip.io
  keycloak:
    url: keycloak.192.168.99.100.nip.io
    privateUrl: http://microcks-keycloak.microcks.svc.cluster.local:8080
```

### Option 2: Full features

Here's now a more complex `MicrocksInstall` CRD that can be use to configure Ingress secrets and certificates, replicas, enable Async API support, etc...

```yaml
apiVersion: microcks.github.io/v1alpha1
kind: MicrocksInstall
metadata:
  name: microcks
spec:
  name: microcks
  version: "1.9.1"
  microcks: 
    replicas: 4
    url: microcks.192.168.99.100.nip.io
    ingressSecretRef: my-secret-for-microcks-ingress
  postman:
    replicas: 2
  keycloak:
    install: true
    persistent: true
    volumeSize: 1Gi
    url: keycloak.192.168.99.100.nip.io
    privateUrl: http://microcks-keycloak.microcks.svc.cluster.local:8080
    ingressSecretRef: my-secret-for-keycloak-ingress
  mongodb:
    install: true
    uri: mongodb:27017
    database: sampledb
    secretRef:
      secret: mongodb
      usernameKey: database-user
      passwordKey: database-password
    persistent: true
    volumeSize: 2Gi
  features:
    async:
      enabled: true
      defaultBinding: KAFKA
      defaultFrequency: 10
      kafka:
        install: true
        url: 192.168.99.100.nip.io
    repositoryFilter:
      enabled: true
      labelKey: app
      labelLabel: Application
      labelList: app,status
```

The installation process is demonstrated in following video that also demonstrates AsyncAPI mocking features:

{{< youtube id="ise7ljoGdEY" autoplay="false" >}}

## Quarkus-based Operator

This is an oinging effort under active development. Please check the [README](https://github.com/microcks/microcks-operator/blob/main/README.md) on the GitHub repository for latest information.