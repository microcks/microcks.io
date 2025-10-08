---
draft: false
title: "Using GitLab CI"
date: 2019-11-11
publishdate: 2019-11-11
lastmod: 2025-10-03
weight: 7
---

## Overview

This guide shows how to integrate Microcks within your GitLab CI pipelines. You will:

- **Import** API [Artifacts](/documentation/references/artifacts/) (OpenAPI, Postman, AsyncAPI, etc.) into a Microcks instance
- **Launch tests** against a deployed API endpoint to verify contract conformance

To Integrate Microcks within your GitLab CI pipelines you can rely on [GitLab CI/CD Components](https://gitlab.com/explore/catalog/microcks-cncf/microcks-community/microcks-gitlab-components).

Authentication uses a Microcks [Service Account](/documentation/explanations/service-account).

## Finding the Component
The Microcks GitLab Components are available in the GitLab CI/CD Catalog at:
https://gitlab.com/explore/catalog/microcks-cncf/microcks-community/microcks-gitlab-components

## 1. Prerequisites

- A running Microcks instance and its API URL, for example: `https://microcks.apps.acme.com/api/`
- A Service Account client configured in your Microcks Keycloak realm, with its `client_id` and `client_secret`
- A GitLab project where you can define CI variables

We recommend storing credentials as masked GitLab CI variables:

- `MICROCKS_URL` → Microcks API endpoint (must end with `/api/`)
- `KEYCLOAK_CLIENT_ID` → Service Account client ID
- `KEYCLOAK_CLIENT_SECRET` → Service Account client secret

In your project, navigate to Settings → CI/CD → Variables and add the variables above. Mark credentials as masked and protected according to your workflow.

## 2. Importing API Artifacts (push artifacts into Microcks)

Use the `microcks-import` component to import one or multiple specification files.

```yaml
# .gitlab-ci.yml (excerpt)
include:
  - component: gitlab.com/microcks-cncf/microcks-community/microcks-gitlab-components/microcks-import@~latest
    inputs:
      specs: "specs/weather-forecast-openapi.yml:true,specs/weather-forecast-postman.json:false"
      microcks_url: "https://microcks.apps.acme.com/api/"
      keycloak_client_id: $KEYCLOAK_CLIENT_ID
      keycloak_client_secret: $KEYCLOAK_CLIENT_SECRET
      stage: import
      image: "quay.io/microcks/microcks-cli:latest"

stages:
  - import
```

## Inputs

| Input | Description | Type | Default |
|-------|-------------|------|---------|
| `microcks_url` | URL of the Microcks instance | string | `$MICROCKS_URL` |
| `keycloak_client_id` | Keycloak client ID for authentication | string | `$KEYCLOAK_CLIENT_ID` |
| `keycloak_client_secret` | Keycloak client secret for authentication | string | `$KEYCLOAK_CLIENT_SECRET` |
| `specs` | Specification files to import (format: 'file1:mainArtifact,file2:mainArtifact') | string | `specs/weather-forecast-openapi.yml:true,specs/weather-forecast-postman.json:false` |
| `stage` | CI/CD stage for the import job | string | `import` |
| `image` | Docker image to use for the import job | string | `quay.io/microcks/microcks-cli:latest` |

Note:
By default, the component `gitlab.com/microcks-cncf/microcks-community/microcks-gitlab-components/microcks-import@~latest` uses the latest released component version. You can use a specific version by specifying it in the component reference. For example to use the component version 0.0.1 use the following component reference:
```
include:
  - component: gitlab.com/microcks-cncf/microcks-community/microcks-gitlab-components/microcks-import@0.0.1
```

## 3. Running Conformance Tests

Run a contract test against your deployed API endpoint with one of the supported runners (`HTTP`, `SOAP`, `SOAP_UI`, `POSTMAN`, `OPEN_API_SCHEMA`, `ASYNC_API_SCHEMA`) by using `microcks-test` component 

```yaml
# .gitlab-ci.yml (excerpt)
include:
  - component: gitlab.com/microcks-cncf/microcks-community/microcks-gitlab-components/microcks-test@~latest
    inputs:
      api_name_version: "My API:1.0.0"
      test_endpoint: "https://my-api.example.com"
      test_runner: "OPEN_API_SCHEMA"
      microcks_url: "https://microcks.apps.acme.com/api/"
      keycloak_client_id: $KEYCLOAK_CLIENT_ID
      keycloak_client_secret: $KEYCLOAK_CLIENT_SECRET
      stage: test
      image: "quay.io/microcks/microcks-cli:latest"

stages:
  - test
```

## Inputs

| Input | Description | Type | Default |
|-------|-------------|------|---------|
| `microcks_url` | URL of the Microcks instance | string | `$MICROCKS_URL` |
| `keycloak_client_id` | Keycloak client ID for authentication | string | `$KEYCLOAK_CLIENT_ID` |
| `keycloak_client_secret` | Keycloak client secret for authentication | string | `$KEYCLOAK_CLIENT_SECRET` |
| `api_name_version` | API name and version to test (format: 'API Name:version') | string | `API Pastry - 2.0:2.0.0` |
| `test_endpoint` | Endpoint URL to test against | string | `https://my-api-pastry.apps.example.com` |
| `test_runner` | Test runner to use | string | `OPEN_API_SCHEMA` |
| `wait_for` | Time to wait for test completion | string | `10sec` |
| `stage` | CI/CD stage for the test job | string | `test` |
| `image` | Docker image to use for the test job | string | `quay.io/microcks/microcks-cli:latest` |

Note:
By default, the component `gitlab.com/microcks-cncf/microcks-community/microcks-gitlab-components/microcks-test@~latest` uses the latest released component version. You can use a specific version by specifying it in the component reference. For example to use the component version 0.0.1 use the following component reference:
```
include:
  - component: gitlab.com/microcks-cncf/microcks-community/microcks-gitlab-components/microcks-test@0.0.1
```

## Wrap-up

You have learned how to use the Microcks GitLab Components to import API artifacts and run conformance tests directly from the GitLab CI/CD Catalog. The components provide a reusable and versioned integration that simplifies your pipeline configuration. Behind the scenes, they leverage the `microcks-cli` and use the same authentication foundation described in the [Automation API guide](/documentation/guides/automation/api), relying on a [Service Account](/documentation/explanations/service-account). For the most up-to-date information and available versions, check the [GitLab CI/CD Catalog](https://gitlab.com/explore/catalog/microcks-cncf/microcks-community/microcks-gitlab-components).
