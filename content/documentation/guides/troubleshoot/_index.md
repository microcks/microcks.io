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

## Import Issues

Common problems when importing API artifacts into Microcks.

<details>
  <summary><strong>"No service found" or empty import</strong></summary>

Things to check:
- **Artifact format**: Ensure your file follows the expected conventions for your API type. See [Artifacts Reference](/documentation/references/artifacts/) for format-specific rules.
- **Examples defined**: Microcks relies on examples to create mocks. Verify you have defined examples in your OpenAPI, AsyncAPI, Postman collection, or other supported formats.
- **YAML/JSON syntax**: Validate your artifact with a linter. Malformed files may silently fail to import.
- **API version**: Make sure the `info.version` field is present and not empty.

</details>

<details>
  <summary><strong>Artifact validation errors</strong></summary>

Things to check:
- **Schema compliance**: Validate your artifact against the appropriate specification (OpenAPI, AsyncAPI, etc.) using tools like [Swagger Editor](https://editor.swagger.io/) or [AsyncAPI Studio](https://studio.asyncapi.com/).
- **File encoding**: Use UTF-8 encoding without BOM. Special characters may cause parsing failures.
- **Required fields**: Check for missing required fields like `operationId` in OpenAPI or `message` examples in AsyncAPI.

Related documentation:
- [OpenAPI conventions](/documentation/references/artifacts/openapi-conventions/)
- [AsyncAPI conventions](/documentation/references/artifacts/asyncapi-conventions/)
- [Postman conventions](/documentation/references/artifacts/postman-conventions/)

</details>

<details>
  <summary><strong>External references ($ref) not resolved</strong></summary>

Things to check:
- **Import method**: Direct upload does not resolve external `$ref` by default. Use an Importer job instead, which can handle relative and remote references.
- **Reference base URL**: When using Importers, configure the reference base URL if your references use relative paths. See [Importing Services & APIs](/documentation/guides/usage/importing-content/#configure-dependency-resolution).
- **Multi-artifact strategy**: For complex setups, consider the multi-artifact approach. See [Multi-artifacts explanations](/documentation/explanations/multi-artifacts/).

</details>
