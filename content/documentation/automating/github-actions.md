---
draft: false
title: "Using Microcks from GitHub Actions"
date: 2021-02-19
publishdate: 2021-02-19
lastmod: 2021-11-22
weight: 5
---

## Microcks GitHub Actions

### What is it?

Microcks provides 2 GitHub Actions for interacting with a Microcks instance from your GitHub workflows:

* The [Microcks Import GitHub Action](https://github.com/microcks/import-github-action) is a GitHub Action you may use in your Workflow to import a bunch of API artifacts in a Microcks installs. If test succeeds (ie. API endpoint is compliant with API contract in Microcks) the workflow is pursuing, if not it fails,

* The [Microcks Test GitHub Action](https://github.com/microcks/test-github-action) is a GitHub Action you may use in your Workflow to launch a Microcks test on a deployed API endpoint. If test succeeds (ie. API endpoint is compliant with API contract in Microcks) the workflow is pursuing, if not it fails.

Those 2 actions are basically a wrapper around the [Microcks CLI](https://github.com/microcks/microcks-cli) and provides the same configuration capabilities. Especially, they're sharing the same mandatory configuration parameters that are

* `microcksURL` for the Microcks API endpoint,
* `keycloakClientId` for the Keycloak Realm Service Account ClientId,
* `keycloakClientSecret` for the Keycloak Realm Service Account ClientSecret.


### How to use them?

Obviously we can find this action with [GitHub Actions Marketplace](https://github.com/marketplace?type=actions&query=microcks+) 😉

You may add one of the Action to your Workflow directly from the GitHub UI.

{{< image src="images/github-marketplace.png" alt="image" zoomable="true" >}}

### Import GitHub action

The `import` action, based on the CLI command, has just one argument that specifies a comma separated list of file paths:

* `<specificationFile1[:primary],specificationFile2[:primary]>` : The file paths with an optional flag telling if it should be imported as `primary` or not. See [Multi-artifacts support](../using/importers/#multi-artifacts-support) doc. Default is `true` so it is considered as primary.

#### Step 1 - Configure the GH action

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

#### Step 2 - Configure the Secrets

As you probably saw just above, we do think it's a best practice to use GitHub Secrets (general or tied to `Environment` like in the example) to hold the Keycloak credentials (client Id and Secret). See below the Secrets configuration we've used for the example:

{{< image src="images/github-secrets.png" alt="image" zoomable="true" >}}

### Test GitHub action

The `test` action, based on the CLI command, needs 3 arguments:

* `<apiName:apiVersion>` : Service to test reference. Exemple: `'Beer Catalog API:0.9'`
* `<testEndpoint>` : URL where is deployed implementation to test
* `<runner>` : Test strategy (one of: `HTTP`, `SOAP`, `SOAP_UI`, `POSTMAN`, `OPEN_API_SCHEMA`, `ASYNC_API_SCHEMA`)

And some optional ones:

* `--waitFor` for the time to wait for test to finish (int + one of: milli, sec, min). Default is `5sec`,
* `--secretName='<Secret Name>'` is an optional flag specifying the name of a Secret to use for connecting endpoint,
* `--operationsHeaders=<JSON>` allows to override some operations headers for the tests to launch.

#### Step 1 - Configure the GH action

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

#### Step 2 - Configure the Secrets

As you probably saw just above, we do think it's a best practice to use GitHub Secrets (general or tied to `Environment` like in the example) to hold the Keycloak credentials (client Id and Secret). See below the Secrets configuration we've used for the example:

{{< image src="images/github-secrets.png" alt="image" zoomable="true" >}}
