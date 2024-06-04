---
draft: false
title: "CLI for Microcks"
date: 2019-09-01
publishdate: 2019-09-01
lastmod: 2022-09-06
weight: 3
---

## Microcks CLI

`microcks-cli` is a command-line tool for interacting with Microcks server APIs. It allows to launch tests or import API artifacts with minimal dependencies. It is managed and released independently of the core Microcks server components within its [own GitHub repository](https://github.com/microcks/microcks-cli).

The CLI makes usage of Microcks [Service Account](../service-account) so it's definitely worth the read 😉

> Starting with release `0.5.2`, the CLI also supports non-authenticated mode when Microcks is deployed in dev mode without Keycloak. You'll still have to provide client id and secret to commands but they will be ignored. See [issue #23](https://github.com/microcks/microcks-cli/issues/23) for more details.

## Usage instructions

Usage is simply `microcks-cli [command]`

where `[command]` can be one of the following:

* `version` to check this CLI version,
* `help` to display usage informations,
* `test` to launch new test on Microcks server,
* `import` to import API artifacts on Microcks server.

### Test command

The `test` command has a bunch of arguments and flags so that you can use it that way:

```sh
$ microcks-cli test <apiName:apiVersion> <testEndpoint> <runner> \
  --microcksURL=<> --waitFor=5sec \
  --keycloakClientId=<> --keycloakClientSecret=<>
```

Check [README.md](https://github.com/microcks/microcks-cli/blob/master/README.md) for full instructions on arguments and flags.

### Import command

The `import` command has one argument and common flags with `test` command. You can use it that way:

```sh
$ microcks-cli import <specificationFile1[:primary],specificationFile2[:primary]> \
  --microcksURL=<> \
  --keycloakClientId=<> --keycloakClientSecret=<>
```

Check [README.md](https://github.com/microcks/microcks-cli/blob/master/README.md) for full instructions on arguments and flags.

## Installation

### Binary

Binary releases for Linux, MacOS or Windows platform are available on the GitHub [releases page](https://github.com/microcks/microcks-cli/releases). Just download the binary corresponding to your system and put the binary into the `PATH` somewhere.

### Container image

The `microcks-cli` is now available as a container image. So that you'd be able to easily use it from a GitLab CI or a [Tekton pipeline](../tekton). The hosting repository is now on Quay.io [here](https://quay.io/repository/microcks/microcks-cli?tab=info).

Below a sample on how using the image without getting the CLI binary:

```sh
$ docker run -it quay.io/microcks/microcks-cli:latest microcks-cli test 'Beer Catalog API:0.9' \
    http://beer-catalog-impl-beer-catalog-dev.apps.144.76.24.92.nip.io/api/ POSTMAN \
    --microcksURL=http://microcks.apps.144.76.24.92.nip.io/api/ \
    --keycloakClientId=microcks-serviceaccount \ --keycloakClientSecret=7deb71e8-8c80-4376-95ad-00a399ee3ca1 --waitFor=8sec \
    --operationsHeaders='{"globals": [{"name": "x-api-key", "values": "my-values"}], "GET /beer": [{"name": "x-trace-id", "values": "xcvbnsdfghjklm"}]}'
```