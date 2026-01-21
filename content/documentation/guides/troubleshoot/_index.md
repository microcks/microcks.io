---
title: "Troubleshooting"
date: 2025-12-08
description: "Below are all the guides related to **Troubleshooting**."
weight: 6
---

## General

#### Changing the log level

The default log level in Microcks is set to `INFO`, which allows tracking basic activity. To get more details on internal mechanics and behaviours, you may want to change the level to `DEBUG`. As explained in [Application Configuration reference](/documentation/references/configuration/application-config/), the logging configuration is set in a `logback.xml` file for the main webapp component and in `application.properties` for the Async Minion component.

Changing the log level depends on the way you installed Microcks.
<details>
  <summary><strong>Helm Chart</strong></summary>

When using the [Helm Chart](/documentation/references/configuration/helm-chart-config/) to deploy Microcks, there's a `microcks.logLevel`spec property you can set to `DEBUG`. Change it into your `values.yaml` file or as a command line argument using `--set microcks.logLevel=DEBUG` when redeploying the chart. This property changes both values for the main webapp and Async Miniong components.
</details>

<details>
  <summary><strong>Microcks Operator</strong></summary>

When using the [Microcks Operator](/documentation/references/configuration/operator-config/), to deploy Microcks, the `Microcks` Custom Resource holds a `microcks.logLevel` property you can set to `DEBUG`. Change your CR to something like belob before re-deploying it:

```yaml
apiVersion: microcks.io/v1alpha1
kind: Microcks
metadata:
  name: microcks
spec:
  version: 1.11.0
  microcks:
    url: microcks.m.minikube.local
    logLevel: DEBUG
  keycloak:
    url: keycloak.m.minikube.local
```

After the next operator reconciliation, the log level is changed in both the main webapp and the Async Minion component.
</details>

<details>
  <summary><strong>Docker or Podman Compose</strong></summary>

When using [Docker or Podman Compose](/documentation/guides/installation/docker-compose/) for running Microcks, you just have to add additional environment variables to the `microcks` and `microcks-async-minoin` containers. 

You just have to edit the `docker-compose.yml` file to uncomment/enable the correct environement variables:

```yaml
  app:
    # [...]
    container_name: microcks
    environment:
      # [...]
      - LOGGING_LEVEL_IO_GITHUB_MICROCKS=DEBUG
    # [...]

  async-minion:
    depends_on:
      - app
    # [...]
    container_name: microcks-async-minion
    environment:
      # [...]
      - QUARKUS_LOG_CONSOLE_LEVEL=DEBUG
      - QUARKUS_LOG_CATEGORY__IO_GITHUB_MICROCKS__LEVEL=DEBUG
    # [...]
```

> Depending on the type of deployment (with or without asynchronous features), these container definitions may be distributed on different files.

</details>
