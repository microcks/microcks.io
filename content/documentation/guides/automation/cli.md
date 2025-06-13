---
draft: false
title: "Using Microcks CLI"
date: 2024-04-30
publishdate: 2024-04-30
lastmod: 2024-05-16
weight: 2
---

## Overview

This guide illustrates the usage of `microcks-cli`, a command-line tool for interacting with Microcks APIs. It allows for launching tests or importing API artifacts with minimal dependencies. It is managed and released independently of the core Microcks server components within its [own GitHub repository](https://github.com/microcks/microcks-cli). The CLI [connects to API](/documentation/guides/automation/api) and uses [Service Account](/documentation/explanations/service-account) and so it's definitely worth the read 😉

The CLI also supports authenticated and non-authenticated modes when Microcks is deployed without Keycloak. You'll still have to provide the client ID and secret to commands, but they will be ignored. See [issue #23](https://github.com/microcks/microcks-cli/issues/23) for more details.

## 1. Install the CLI

The CLI is provided as a binary distribution or can be used directly through a container image.

### Using Homebrew

You can install `microcks-cli` using [Homebrew](https://brew.sh).

```sh
brew tap microcks/tap
brew install microcks-cli
```

### Binary distribution

The CLI binary releases are available for Linux, macOS or Windows platforms with different architectures on [GitHub releases](https://github.com/microcks/microcks-cli/releases). Just download the binary corresponding to your system and put it in the `PATH` somewhere. For example, on a Linux platform with `amd64` architecture, you may run these commands:

```sh
curl -Lo microcks-cli https://github.com/microcks/microcks-cli/releases/download/0.5.5/microcks-cli-darwin-amd64 \
    && chmod +x microcks-cli
```

### Container image

The `microcks-cli` is also available as a container image so that you may run it without installing it. The hosting repository is on [Quay.io](https://quay.io/repository/microcks/microcks-cli?tab=info). You can simply pull the image to get it locally:

```sh
docker pull quay.io/microcks/microcks-cli:latest
```

## 2. Launching a test

Assuming you are running the same examples as in the [Getting started](/documentation/tutorials/getting-started) and [Getting started with Tests](/documentation/tutorials/getting-started-tests) tutorials, you may use this command line to launch a new test:

```sh
microcks-cli test 'API Pastry - 2.0:2.0.0' http://host.docker.internal:8282 OPEN_API_SCHEMA \
    --microcksURL=http://host.docker.internal:8585/api/ \
    --keycloakClientId=microcks-serviceaccount \
    --keycloakClientSecret="ab54d329-e435-41ae-a900-ec6b3fe15c54" \
    --operationsHeaders='{"globals": [{"name": "x-api-key", "values": "azertyuiop"}], "GET /pastries": [{"name": "x-trace-id", "values": "qsdfghjklm"}]}' \
    --insecure --waitFor=6sec
```

With some explanations on arguments and flags:
* 1st argument is API name and version separated with `:`,
* 2nd argument is the Application endpoint to test,
* 3rd argument is the testing strategy to execute,
* `--flags` are contextual flags for API endpoints, authentication, timeouts, etc.

The same command can also be executed using the container image:

```sh
docker run -it quay.io/microcks/microcks-cli:latest microcks-cli test \
    'API Pastry - 2.0:2.0.0' http://host.docker.internal:8282 OPEN_API_SCHEMA \
    --microcksURL=http://host.docker.internal:8585/api/ \
    --keycloakClientId=microcks-serviceaccount \
    --keycloakClientSecret="ab54d329-e435-41ae-a900-ec6b3fe15c54" \
    --operationsHeaders='{"globals": [{"name": "x-api-key", "values": "azertyuiop"}], "GET /pastries": [{"name": "x-trace-id", "values": "qsdfghjklm"}]}' \
    --insecure --waitFor=6sec
```

Check the `microcks-cli` [README](https://github.com/microcks/microcks-cli/blob/master/README.md) for full instructions on arguments and flags.

## Wrap-up

You have learned how to install and use the Microcks CLI to launch a new test. This is what you would typically do within your CI/CD pipeline to ensure that the application you just deployed correctly implements the API specifications.

Microcks CLI also provides the `import` command that allows you to push artifacts into the Microcks repository. This command requires that you have a *Service Account* with more privileges than the default one, though. You may follow up on this guide by learning more about [Service Accounts](/documentation/explanations/service-account).

The CLI provides the helpful commands `version` and `help` to get basic information on it. Check the `microcks-cli` [README](https://github.com/microcks/microcks-cli/blob/master/README.md) for full instructions on available commands depending on your version.
