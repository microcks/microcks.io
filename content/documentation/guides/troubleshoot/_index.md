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



## Docker-compose specific

### 🔧 Troubleshooting

  
#### 1. Postman Runner tests get stuck with infinite spinner

**Problem:** When running tests with the POSTMAN runner, the blue spinner runs forever and the test never completes. Browser console shows repeated `[AuthenticationHttpInterceptor] intercept for GET` messages.

**Solution:** This is typically a network connectivity issue where the Postman runtime container cannot reach the host machine.

-  **For Mac users**: Use `http://host.docker.internal:3002` instead of `http://docker.for.mac.localhost:3002` as the upstream service endpoint. While `docker.for.mac.localhost` works for the OpenAPI Schema runner, it doesn't resolve correctly from within the Postman runtime container.
-  **For Linux users**: Try using the host machine's IP address directly, or consult Docker's documentation for host networking options specific to your distribution.
-  **For Windows users**: Use `host.docker.internal` (similar to Mac).

  

**Debug steps:**

1. Enable debug logging for the Postman runtime container:

```sh
docker  compose  down
export  LOG_LEVEL=debug
docker  compose  up  -d
```

  

#### 2. Cannot access Microcks at localhost:8080

**Problem**: Browser cannot connect to Microcks interface.

**Solutions**:

- Ensure all containers are running: docker compose ps
- Check if port 8080 is already in use: `lsof -i :8080` (Mac/Linux) or `netstat -ano | findstr :8080` (Windows)
- Verify firewall settings aren't blocking the port
- Try accessing via `http://127.0.0.1:8080` instead of `localhost`

  

#### 3. Authentication issues with Keycloak

**Problem**: Cannot login with default credentials.

**Solutions**:

- Ensure you're using the exact credentials:


		Username: admin (all lowercase)

		Password: microcks123


- Clear browser cache and cookies
- Try incognito/private browsing mode
- Check Keycloak container logs: docker logs microcks-sso


#### 4. Container startup failures

**Problem**: One or more containers fail to start.

**Solutions**:

Check disk space: `df -h`

Verify Docker daemon is running: `docker ps`

Remove old containers and volumes:

```sh
docker  compose  down  -v
docker  compose  up  -d
```

Check individual container logs for specific errors

### ❓ Frequently Asked Questions

<details>
<summary><strong>Q: What's the difference between docker.for.mac.localhost and host.docker.internal?</strong></summary>

A: Both are special DNS names that resolve to the host machine from within Docker containers. However:

`docker.for.mac.localhost` is Mac-specific and deprecated
`host.docker.internal` is the recommended cross-platform solution (Mac, Windows, and newer Linux versions)

Some Microcks components (like Postman runtime) may not properly resolve the older Mac-specific hostname
</details>

<details>
<summary><strong>Q: Can I change the default ports?</strong></summary>

A: Yes, modify the port mappings in docker-compose.yml:

```yaml

services:

  microcks:

		ports:

		- "9090:8080" # Changes external port to 9090

```
</details>

<details>
<summary><strong>Q: How do I enable verbose logging for debugging?</strong></summary>

A: Set environment variables for specific containers:

```yaml
services:

	microcks-postman-runtime:

		environment:

		- LOG_LEVEL=debug
```

Or via command line:

```sh
LOG_LEVEL=debug docker compose up -d
```
</details>

<details>
<summary><strong>Q: Can I use Microcks with Podman instead of Docker?</strong></summary>

A: Yes, with some modifications:
- Use podman-compose instead of docker compose
- Network configuration may need adjustments
- Host resolution might require different approaches

  
</details>

<details>

<summary><strong>Q: Why does the OpenAPI Schema runner work but Postman runner fails with the same endpoint?</strong></summary>

A: The OpenAPI Schema runner and Postman runner use different execution environments:

  

- OpenAPI Schema runner executes from the main Microcks container

- Postman runner executes in a separate container with different network context

- This can lead to different DNS resolution behavior
</details>

<details>
<summary><strong>Q: How do I know if async features are working correctly?</strong></summary>

A: Check that all async-related containers are running:

```sh 
docker compose ps | grep -E "(kafka|zookeeper|async-minion)" 
```

Verify Kafka connectivity:

```sh 
docker exec microcks-kafka kafka-topics.sh --list --bootstrap-server localhost:9092 
```
</details>