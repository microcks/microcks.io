---
draft: false
title: "Using in GitHub Actions"
date: 2021-02-19
publishdate: 2021-02-19
lastmod: 2024-06-10
weight: 3
---

## Overview

This guide shows you how to integrate Microcks into your [Github Actions workflows](https://github.com/features/actions). Microcks provides 2 GitHub Actions for interacting with a Microcks instance from your workflows:

* The [Microcks Import GitHub Action](https://github.com/microcks/import-github-action) allows you to import [Artifacts](/documentation/references/artifacts/) in a Microcks instance. If import succeeds is pursuing, if not it fails,

* The [Microcks Test GitHub Action](https://github.com/microcks/test-github-action) allows you to launch a Microcks test on a deployed API endpoint. If test succeeds (ie. API endpoint is conformant with API contract in Microcks) the workflow is pursuing, if not it fails.

Those 2 actions are basically a wrapper around the [Microcks CLI](/documentation/guides/automation/cli/) and are using [Service Account](/documentation/explanations/service-account/). They provide the same configuration capabilities. Especially, they're sharing the same mandatory configuration parameters that are:

* `microcksURL` for the Microcks API endpoint,
* `keycloakClientId` for the Keycloak Realm Service Account ClientId,
* `keycloakClientSecret` for the Keycloak Realm Service Account ClientSecret.

## 1. Find them in the Marketplace

Obviously we can find this action with [GitHub Actions Marketplace](https://github.com/marketplace?query=microcks) 😉

You may add one of the Action to your Workflow directly from the GitHub UI.

{{< image src="images/documentation/github-marketplace.png" alt="image" zoomable="true" >}}

## 2. Import GitHub Action

The `import` action, based on the CLI command, has just one argument that specifies a comma separated list of file paths:

* `<specificationFile1[:primary],specificationFile2[:primary]>`: The file paths with an optional flag telling if it should be imported as `primary` or not. See [Multi-artifacts explanations](/documentation/explanations/multi-artifacts) documentation. Default is `true` so it is considered as primary.

### Step 1 - Configure the Action

Here's an example below:

```yaml
name: my-workflow
on: [push]
jobs:
  my-job:
    runs-on: ubuntu-latest
    environment: Development
    steps:
      - uses: microcks/import-github-action@v1
        with:
          specificationFiles: 'samples/weather-forecast-openapi.yml:true,samples/weather-forecast-postman.json:false'
          microcksURL: 'https://microcks.apps.acme.com/api/'
          keycloakClientId:  ${{ secrets.MICROCKS_SERVICE_ACCOUNT }}
          keycloakClientSecret:  ${{ secrets.MICROCKS_SERVICE_ACCOUNT_CREDENTIALS }}
```

### Step 2 - Configure the Secrets

It's a best practice to use GitHub Secrets (general or tied to `Environment` like in the example) to hold the Keycloak credentials (client Id and Secret). See below the Secrets configuration we've used for the example:

{{< image src="images/documentation/github-secrets.png" alt="image" zoomable="true" >}}

## 3. Test GitHub Action

The `test` action, based on the CLI command, needs 3 arguments:

* `<apiName:apiVersion>` : Service to test reference. Exemple: `'Beer Catalog API:0.9'`
* `<testEndpoint>` : URL where is deployed implementation to test
* `<runner>` : Test strategy (one of: `HTTP`, `SOAP`, `SOAP_UI`, `POSTMAN`, `OPEN_API_SCHEMA`, `ASYNC_API_SCHEMA`)

And some optional ones tha are the same as the CLI that you may find in the [Microcks Test GitHub Action](https://github.com/microcks/test-github-action) repository.

### Step 1 - Configure the Action

Here's an example below:

```yaml
name: my-workflow
on: [push]
jobs:
  my-job:
    runs-on: ubuntu-latest
    environment: Development
    steps:
      - uses: microcks/test-github-action@v1
        with:
          apiNameAndVersion: 'API Pastry - 2.0:2.0.0'
          testEndpoint: 'http://my-api-pastry.apps.cluster.example.com'
          runner: OPEN_API_SCHEMA
          microcksURL: 'https://microcks.apps.acme.com/api/'
          keycloakClientId:  ${{ secrets.MICROCKS_SERVICE_ACCOUNT }}
          keycloakClientSecret:  ${{ secrets.MICROCKS_SERVICE_ACCOUNT_CREDENTIALS }}
          waitFor: '10sec'
```

### Step 2 - Configure the Secrets

It's a best practice to use GitHub Secrets (general or tied to `Environment` like in the example) to hold the Keycloak credentials (client Id and Secret). See below the Secrets configuration we've used for the example:

{{< image src="images/documentation/github-secrets.png" alt="image" zoomable="true" >}}

## Wrap-up

You have learned how to get and use the Microcks GitHub Actions. The GitHub actions reuse the [Microcks CLI](/documentation/guides/automation/cli) and the [Service Account](/documentation/explanations/service-account) and so it's definitely worth the read 😉

The most up-to-date information and reference documentation can be found into the repository [README](https://github.com/microcks/test-github-action).
