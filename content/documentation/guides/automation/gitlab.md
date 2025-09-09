---
draft: false
title: "Using GitLab CI"
date: 2019-11-11
publishdate: 2019-11-11
lastmod: 2025-09-08
weight: 7
---

## Overview

This guide shows how to integrate Microcks within your GitLab CI pipelines. You will:

- **Import** API [Artifacts](/documentation/references/artifacts/) (OpenAPI, Postman, AsyncAPI, etc.) into a Microcks instance
- **Launch tests** against a deployed API endpoint to verify contract conformance

We rely on the [Microcks CLI](/documentation/guides/automation/cli) executed via its container image inside GitLab CI jobs. Authentication uses a Microcks [Service Account](/documentation/explanations/service-account).

## 1. Prerequisites

- A running Microcks instance and its API URL, for example: `https://microcks.apps.acme.com/api/`
- A Service Account client configured in your Microcks Keycloak realm, with its `client_id` and `client_secret`
- A GitLab project where you can define CI variables

We recommend storing credentials as masked GitLab CI variables:

- `MICROCKS_URL` → Microcks API endpoint (must end with `/api/`)
- `KEYCLOAK_CLIENT_ID` → Service Account client ID
- `KEYCLOAK_CLIENT_SECRET` → Service Account client secret

In your project, navigate to Settings → CI/CD → Variables and add the variables above. Mark credentials as masked and protected according to your workflow.

## 2. Import job (push artifacts into Microcks)

Use the `microcks-cli` container to import one or multiple specification files. Optionally mark artifacts as `primary` to drive multi-artifact behavior (see [Multi-artifacts](/documentation/explanations/multi-artifacts)).

```yaml
# .gitlab-ci.yml (excerpt)
stages:
  - import

import-specs:
  stage: import
  image: quay.io/microcks/microcks-cli:latest
  variables:
    MICROCKS_URL: "$MICROCKS_URL"              # set at project/group level
    KEYCLOAK_CLIENT_ID: "$KEYCLOAK_CLIENT_ID"  # set at project/group level
    KEYCLOAK_CLIENT_SECRET: "$KEYCLOAK_CLIENT_SECRET" # set at project/group level
  script:
    - |
      microcks-cli import \
        'specs/weather-forecast-openapi.yml:true,specs/weather-forecast-postman.json:false' \
        --microcksURL="$MICROCKS_URL" \
        --keycloakClientId="$KEYCLOAK_CLIENT_ID" \
        --keycloakClientSecret="$KEYCLOAK_CLIENT_SECRET"
```

Notes:

- The argument to `import` is a comma-separated list of `<file[:primary]>` entries.
- If you use self-signed certificates, add `--insecure`.

## 3. Test job (run contract tests)

Run a contract test against your deployed API endpoint with one of the supported runners (`HTTP`, `SOAP`, `SOAP_UI`, `POSTMAN`, `OPEN_API_SCHEMA`, `ASYNC_API_SCHEMA`).

```yaml
# .gitlab-ci.yml (excerpt)
stages:
  - test

test-api-contract:
  stage: test
  image: quay.io/microcks/microcks-cli:latest
  variables:
    MICROCKS_URL: "$MICROCKS_URL"
    KEYCLOAK_CLIENT_ID: "$KEYCLOAK_CLIENT_ID"
    KEYCLOAK_CLIENT_SECRET: "$KEYCLOAK_CLIENT_SECRET"
  script:
    - |
      microcks-cli test \
        'API Pastry - 2.0:2.0.0' \
        'https://my-api-pastry.apps.example.com' \
        OPEN_API_SCHEMA \
        --microcksURL="$MICROCKS_URL" \
        --keycloakClientId="$KEYCLOAK_CLIENT_ID" \
        --keycloakClientSecret="$KEYCLOAK_CLIENT_SECRET" \
        --waitFor=10sec
```

Notes:

- The first three arguments are: `<apiName:apiVersion>` `<testEndpoint>` `<runner>`.
- `--waitFor` lets the job wait for test completion up to the specified duration.
- Add `--insecure` if your Microcks endpoint uses self-signed certificates.

## 4. End-to-end example pipeline

Below is a minimal pipeline with two stages: import artifacts and test the deployed API. Adapt the `only/except` or `rules` to your workflow.

```yaml
# .gitlab-ci.yml
stages: [import, test]

variables:
  # Prefer defining these at project/group level in Settings → CI/CD → Variables
  MICROCKS_URL: "$MICROCKS_URL"
  KEYCLOAK_CLIENT_ID: "$KEYCLOAK_CLIENT_ID"
  KEYCLOAK_CLIENT_SECRET: "$KEYCLOAK_CLIENT_SECRET"

import-specs:
  stage: import
  image: quay.io/microcks/microcks-cli:latest
  script:
    - microcks-cli version
    - |
      microcks-cli import \
        'specs/weather-forecast-openapi.yml:true,specs/weather-forecast-postman.json:false' \
        --microcksURL="$MICROCKS_URL" \
        --keycloakClientId="$KEYCLOAK_CLIENT_ID" \
        --keycloakClientSecret="$KEYCLOAK_CLIENT_SECRET"
  rules:
    - if: $CI_COMMIT_BRANCH

test-api-contract:
  stage: test
  image: quay.io/microcks/microcks-cli:latest
  needs: ["import-specs"]
  script:
    - |
      microcks-cli test \
        'API Pastry - 2.0:2.0.0' \
        'https://my-api-pastry.apps.example.com' \
        OPEN_API_SCHEMA \
        --microcksURL="$MICROCKS_URL" \
        --keycloakClientId="$KEYCLOAK_CLIENT_ID" \
        --keycloakClientSecret="$KEYCLOAK_CLIENT_SECRET" \
        --waitFor=10sec
  rules:
    - if: $CI_COMMIT_BRANCH
```

## Wrap-up

You have learned how to use the `microcks-cli` inside GitLab CI to import API artifacts and run contract tests. The CLI reuses the same authentication foundation described in the [Automation API guide](/documentation/guides/automation/api) and relies on a [Service Account](/documentation/explanations/service-account). For CLI flags and options, check the [Microcks CLI](/documentation/guides/automation/cli) guide and the tool's README.

If you prefer a native CI integration, see also the guides for [GitHub Actions](/documentation/guides/automation/github-actions) and [Jenkins](/documentation/guides/automation/jenkins).
