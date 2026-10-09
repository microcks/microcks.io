---
draft: false
title: "Using Microcks CLI"
date: 2024-04-30
publishdate: 2024-04-30
lastmod: 2026-08-26
weight: 2
---

## Overview

This guide illustrates the usage of `microcks-cli`, a command-line tool for interacting with Microcks APIs. It allows for launching tests or importing API artifacts with minimal dependencies. It is managed and released independently of the core Microcks server components within its [own GitHub repository](https://github.com/microcks/microcks-cli). The CLI [connects to API](/documentation/guides/automation/api) and uses [Service Account](/documentation/explanations/service-account) and so it's definitely worth the read 😉

The CLI also supports authenticated and non-authenticated modes when Microcks is deployed without Keycloak. You'll still have to provide the client ID and secret to commands, but they are ignored. See [issue #23](https://github.com/microcks/microcks-cli/issues/23) for more details.

The installed binary is named `microcks`. Releases before `1.0.0` installed a binary named `microcks-cli`, and you may still find that name in older material.

## 1. Install the CLI

The CLI is provided as a binary distribution or can be used directly through a container image.

### Using Homebrew

You can install the CLI using [Homebrew](https://brew.sh):

```sh
brew tap microcks/tap
brew install microcks/tap/microcks
```

The tap also carries a legacy `microcks-cli` formula that stops at version `0.5.8`. Install the `microcks` formula shown above to get the current release.

### Binary distribution

The CLI binary releases are available for Linux, macOS or Windows platforms with different architectures on [GitHub releases](https://github.com/microcks/microcks-cli/releases). Each release is a `.tar.gz` archive containing a `microcks` binary that you extract and put in the `PATH` somewhere.

For example, on a Linux platform with `amd64` architecture, replace `<version>` with the release you want and run:

```sh
curl -sSL https://github.com/microcks/microcks-cli/releases/download/<version>/microcks-cli_<version>_linux_amd64.tar.gz \
    | tar -xz microcks
```

macOS builds are published as a single universal binary, so use `microcks-cli_<version>_darwin_all.tar.gz` on both Intel and Apple Silicon machines.

### Container image

The CLI is also available as a container image so that you may run it without installing it. The hosting repository is the [Quay.io microcks-cli repository](https://quay.io/repository/microcks/microcks-cli?tab=info). Pull the image to get it locally:

```sh
docker pull quay.io/microcks/microcks-cli:latest
```

## 2. Connect to a Microcks instance

Rather than repeating connection flags on every command, you can log in once. The CLI stores the resulting *context* and reuses it:

```sh
microcks login http://localhost:8585 --username <username> --password <password>
```

For an instance behind an identity provider, use the browser-based flow instead:

```sh
microcks login http://localhost:8585 --sso
```

List the contexts you have configured, and switch between them:

```sh
microcks context
microcks context <context-name>
```

To remove the stored credentials for a context, run `microcks logout <context-name>`.

Every command still accepts `--microcksURL`, `--keycloakClientId` and `--keycloakClientSecret` directly. That remains the right choice for CI/CD pipelines, where credentials come from the runner's secret store rather than from a saved context.

### Running a local instance

If you do not already have a server, the CLI can start one for you and set it as the current context:

```sh
microcks start
```

The command waits until Microcks answers before returning. Use `--port` to change the exposed port, `--driver podman` to use Podman instead of Docker, and `--rm` to remove the container when it exits. To shut the instance down again:

```sh
microcks stop
```

## 3. Import API artifacts

The `import` command pushes [Artifacts](/documentation/references/artifacts/) into the Microcks repository. This command requires a *Service Account* with more privileges than the default one:

```sh
microcks import ./openapi.yaml
```

Append `:false` to a file to load it as a secondary artifact that completes an existing API, rather than as the primary one:

```sh
microcks import ./openapi.yaml:true,./postman-collection.json:false
```

Two companion commands cover the other common cases. `import-dir` scans a directory:

```sh
microcks import-dir ./api-specs --recursive --pattern "*.yaml"
```

And `import-url` fetches artifacts Microcks downloads itself:

```sh
microcks import-url https://example.com/openapi.yaml
```

## 4. Launch a test

Assuming you are running the same examples as in the [Getting started](/documentation/tutorials/getting-started) and [Getting started with Tests](/documentation/tutorials/getting-started-tests) tutorials, you may use this command line to launch a new test:

```sh
microcks test 'API Pastry - 2.0:2.0.0' http://host.docker.internal:8282 OPEN_API_SCHEMA \
    --microcksURL=http://host.docker.internal:8585/api/ \
    --keycloakClientId=microcks-serviceaccount \
    --keycloakClientSecret=<client-secret> \
    --operationsHeaders='{"globals": [{"name": "x-api-key", "values": "azertyuiop"}], "GET /pastries": [{"name": "x-trace-id", "values": "qsdfghjklm"}]}' \
    --insecure-tls --waitFor=6sec
```

With some explanations on arguments and flags:
* 1st argument is API name and version separated with `:`,
* 2nd argument is the Application endpoint to test,
* 3rd argument is the testing strategy to execute,
* `--flags` are contextual flags for API endpoints, authentication and timeouts.

The same command can also be executed using the container image:

```sh
docker run -it quay.io/microcks/microcks-cli:latest microcks test \
    'API Pastry - 2.0:2.0.0' http://host.docker.internal:8282 OPEN_API_SCHEMA \
    --microcksURL=http://host.docker.internal:8585/api/ \
    --keycloakClientId=microcks-serviceaccount \
    --keycloakClientSecret=<client-secret> \
    --operationsHeaders='{"globals": [{"name": "x-api-key", "values": "azertyuiop"}], "GET /pastries": [{"name": "x-trace-id", "values": "qsdfghjklm"}]}' \
    --insecure-tls --waitFor=6sec
```

### Machine-readable results

Add `--output` to render the result for a machine instead of a person. The CLI supports `json`, `yaml` and `github-actions` alongside the default `text`. For these formats, progress messages move to `stderr` so that `stdout` carries only the result:

```sh
microcks test 'API Pastry - 2.0:2.0.0' http://localhost:8282 OPEN_API_SCHEMA \
    --microcksURL=http://localhost:8585/api/ --output=json > result.json
```

With `--output=github-actions`, a failing operation becomes an inline `::error::` annotation on the pull request, each operation gets a collapsible log group, and a per-operation table is appended to the job summary. See the [GitHub Actions guide](/documentation/guides/automation/github-actions/) for the surrounding workflow.

## 5. Test without a Microcks server

The `--dry-run` flag runs a contract test with no infrastructure at all: no running Microcks server, no Keycloak credentials and no prior import. The CLI starts an ephemeral Microcks container, imports your specification, runs the test against your endpoint and removes the container afterwards:

```sh
microcks test --dry-run \
    --artifact ./openapi.yaml \
    'API Pastry - 2.0:2.0.0' \
    http://localhost:8282 \
    OPEN_API_SCHEMA
```

This is useful before you commit: you get the same conformance verdict a pipeline produces, without touching a shared instance.

Adding `--watch` keeps the container alive and re-runs the test each time you save the specification, which turns the command into a feedback loop while you design an API:

```sh
microcks test --dry-run --watch \
    --artifact ./openapi.yaml \
    'API Pastry - 2.0:2.0.0' \
    http://localhost:8282 \
    OPEN_API_SCHEMA
```

An endpoint on `localhost` is reachable from inside the container without any change on your side, and the container is removed on every exit path, including `Ctrl+C`. Docker is used by default; pass `--driver podman` to use Podman.

## 6. Use the CLI in a pipeline

The CLI returns a distinct exit code per outcome, so a pipeline can tell a broken API apart from a broken pipeline:

| Code | Meaning |
| ---- | ------- |
| 0 | Success, or the contract test conformed |
| 1 | Contract test failed — a clean run whose result did not conform |
| 2 | Usage — bad arguments or flags |
| 11 | Connection — could not reach the Microcks or Keycloak endpoint |
| 12 | API — a server rejected the request or returned an unusable response |
| 13 | Not found — a requested resource does not exist |
| 14 | Environment — a local precondition failed, such as the container runtime |
| 20 | Generic — an unclassified failure |

Exit code `1` means the tool ran correctly and the API violated its contract. Codes of `2` and above mean the tool itself could not complete, which is the case you may want to retry.

Because flags and formats vary between releases, the CLI can report what it supports:

```sh
microcks capabilities --output json
```

Check for the capability identifier you depend on before using it, rather than inferring support from a version number.

## Wrap-up

You have learned how to install and use the Microcks CLI to launch a new test. This is what you would typically do within your CI/CD pipeline to ensure that the application you deployed correctly implements the API specifications. You have also seen how to import artifacts, how to get a conformance verdict without any server using `--dry-run`, and how to branch on exit codes from a pipeline.

Importing artifacts requires a *Service Account* with more privileges than the default one, so you may follow up on this guide by learning more about [Service Accounts](/documentation/explanations/service-account).

The CLI provides the helpful commands `version` and `help` to get basic information on it. For a per-command reference, including every flag, see the [command documentation](https://github.com/microcks/microcks-cli/tree/master/documentation) and the [README](https://github.com/microcks/microcks-cli/blob/master/README.md) in the CLI repository.
