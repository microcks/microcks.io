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

The Microcks Operator offers advanced features comparing to the Helm chart and can be used in a complete [GitOps approach](https://www.redhat.com/en/topics/devops/what-is-gitops) where all the content of a Microcks instance can be pulled from a Git repository. Deploying this practice will allow the automated creation of fully-configured instances on demands, in seconds or minutes and in a full reproducible way. The Microcks Operator is the cornerstone for your Sandbox-as-aService approach!

Let's walk the different steps, highlighting the concerns and options to achieve production-grade deployment 🥾

## 1. Operator deployment

Before starting, we'll assume you have access to a working Kubernetes cluster with the adminstrator privileges. If it's not the case, please ask your favorite SRE or Platform Engineer to do this preparation step for you. If you're practicing, you can also use a local Minikube or Kind cluster

```shell
kubectl apply -f https://raw.githubusercontent.com/microcks/microcks-operator/refs/heads/main/deploy/crd/microckses.microcks.io-v1.yml
kubectl apply -f https://raw.githubusercontent.com/microcks/microcks-operator/refs/heads/main/deploy/crd/apisources.microcks.io-v1.yml
kubectl apply -f https://raw.githubusercontent.com/microcks/microcks-operator/refs/heads/main/deploy/crd/secretsources.microcks.io-v1.yml
```

```shell
kubectl create namespace microcks
kubectl apply -f https://raw.githubusercontent.com/microcks/microcks-operator/refs/heads/main/deploy/operator-jvm.yaml -n microcks
```

## 2. Install Microcks with default options


```yaml
cat <<EOF | kubectl apply -f -
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

## 3. Use Operator Custom Resources

```yaml
cat <<EOF | kubectl apply -f -
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

## 4. Install Microcks with asynchronous options

## 5. Delete everything and remove the Operator

## Wrap-up