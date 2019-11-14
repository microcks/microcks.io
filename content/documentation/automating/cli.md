---
draft: false
title: "CLI for Microcks"
date: 2019-09-01
publishdate: 2019-09-01
lastmod: 2019-09-02
menu:
  docs:
    parent: automating
    name: CLI for Microcks
    weight: 30
toc: true
weight: 30 #rem
categories: [automating]
---

## Microcks CLI 

`microcks-cli` is a command-line tool for interacting with Microcks server APIs. It allows to launch tests with minimal dependencies. It is managed and released independently of the core Microcks server components within its [own GitHub repository](https://github.com/microcks/microcks-cli).

The CLI makes usage of Microcks [Service Account](../service-account) so it's defintely worth the read ;-)

## Usage instructions

Usage is simply `microcks-cli [command]`

where `[command]` can be one of the following:

* `version` to check this CLI version,
* `help` to display usage informations,
* `test` to launch new test on Microcks server.

The main `test` command has abunch of arguments and flags so that you can use it that way:
```
$ microcks-cli test <apiName:apiVersion> <testEndpoint> <runner> \
	--microcksURL=<> --waitFor=5sec \
	--keycloakClientId=<> --keycloakClientSecret=<>
```

Check [README.md](https://github.com/microcks/microcks-cli/blob/master/README.md) for full instructions on arguments and flags.

## Installation

### Binary

Binary releases for Linux, MacOS or Windows platform are available on the GitHub [releases page](https://github.com/microcks/microcks-cli/releases). Just download the binary corresponding to your system and put the binary into the `PATH` somewhere.

### Container image

The `microcks-cli` is now available as a container image as version `0.2.0`. So that you'd be able to easily use it from a GitLab CI or a [Tekton pipeline](../tekton). The hosting repository is now on Docker Hub [here](https://hub.docker.com/r/microcks/microcks-cli).

Below a sample on how using the image without getting the CLI binary:

```
$ docker run -it microcks/microcks-cli:latest microcks-cli test 'Beer Catalog API:0.9' \
    http://beer-catalog-impl-beer-catalog-dev.apps.144.76.24.92.nip.io/api/ POSTMAN \
    --microcksURL=http://microcks.apps.144.76.24.92.nip.io/api/ \
    --keycloakClientId=microcks-serviceaccount \ --keycloakClientSecret=7deb71e8-8c80-4376-95ad-00a399ee3ca1 --waitFor=8sec \
    --operationsHeaders='{"globals": [{"name": "x-api-key", "values": "my-values"}], "GET /beer": [{"name": "x-trace-id", "values": "xcvbnsdfghjklm"}]}'
```