---
title: "Troubleshooting"
date: 2025-02-03
description: "Here below all the guides related to **Troubleshooting**."
weight: 6
---

## General

#### Changing the log level

The default log level in Microcks is set to `INFO` which allow to track basic activity. To get more details on internal mechanics and behaviours, you may want to change the level to `DEBUG`. As explained in [Application Configuration reference](/documentation/references/configuration/application-config/), the logging configuration is set in a `logback.xml` file for the main webapp component and in `application.properties` for the Async Minion component.

Changing the log level depends on the way you installed Microcks.
<details>
  <summary><strong>Helm Chart</strong></summary>

When using the [Helm Chart](/documentation/references/configuration/helm-chart-config/) to deploy Microcks, there's a `microcks.logLevel`spec property you can set to `DEBUG`. Change it into your `values.yaml` file or as a command line argument using `--set microcks.logLevel=DEBUG` when redeploying the chart. This property changes both values for main webapp and Async Miniong components.
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

After the next operator reconciliation, the log level is changed in both main webapp and Async Miniong components.
</details>

<details>
  <summary><strong>Docker or Podman Compose</strong></summary>

When using [Docker or Podman Compose](/documentation/guides/installation/docker-compose/) for running Microcks, you shoud have a local `logback.xml` file mounted into the running containers in the `/deployments/config`.

First thing is to intialize this file into a local folder at the same location of your `docker-compose.yml` file, let's say `config-logs/`:

```sh
mkdir config-logs
cd config-logs
cat <<EOF >logback.xml
<?xml version="1.0" encoding="UTF-8"?>

<configuration scan="true">
  <statusListener class="ch.qos.logback.core.status.NopStatusListener" />

  <conversionRule conversionWord="clr" converterClass="org.springframework.boot.logging.logback.ColorConverter" />
  <conversionRule conversionWord="wex" converterClass="org.springframework.boot.logging.logback.WhitespaceThrowableProxyConverter" />
  <conversionRule conversionWord="wEx" converterClass="org.springframework.boot.logging.logback.ExtendedWhitespaceThrowableProxyConverter" />

  <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
      <charset>utf-8</charset>
      <pattern>%clr(%d{HH:mm:ss.SSS}){faint} %clr(${LOG_LEVEL_PATTERN:-%5p}) %clr(${PID:- }){magenta} %clr(---){faint} %clr([%10.10t]){faint} %clr(%-40.40logger{36}){cyan} %clr(:){faint} %m%n${LOG_EXCEPTION_CONVERSION_WORD:-%wEx}</pattern>
    </encoder>
  </appender>

  <logger name="io.github.microcks" level="DEBUG"/>

  <root level="INFO">
    <appender-ref ref="CONSOLE"/>
  </root>
</configuration>
EOF
```

In this folder, you also have to create a simple `application.properties` file that makes the main webapp component consider the `logback.xml` file as its reference and enable debug level for Async Minion component:

```sh
cat <<EOF >application.properties
# Logging configuration properties
logging.config=/deployments/config/logback.xml

%docker-compose.quarkus.log.level=DEBUG
%docker-compose.quarkus.log.console.level=DEBUG
EOF
```

Finally, you have to edit the `docker-compose.yml` file to mount those files in the containers. You can do it adding new volumes like below:

```yaml
  app:
    # [...]
    container_name: microcks
    volumes:
      - "./config-logs:/deployments/config"
    # [...]

  async-minion:
    depends_on:
      - app
    # [...]
    volumes:
      - "./config-logs:/deployments/config"
    # [...]
```
</details>
