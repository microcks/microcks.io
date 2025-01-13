---
draft: false
title: "Container Images"
date: 2024-05-13
publishdate: 2024-05-13
lastmod: 2025-01-13
weight: 1
---

## Introduction

Microcks components are distributed as [OCI](https://opencontainers.org/) container images that can be executed using container runtimes such as [Docker](https://www.docker.com/) or [Podman](https://podman.io/). All our container images are produced for both `linux/amd64` and `linux/arm64` architectures.

The components container image tags are respecting the following versioning scheme:
* The `x.y.z` tag identifies a released and stable version of the image, produced from a GitHub repo tag. This is an immutable tag,
* The `latest` tag identifies the latest released and stable version of the image. This is a mutable tag,
* The `nightly` tag identifies the latest built - and maybe un-stable - version of the image. This is a mutable tag.

Microcks images repositories are primilarly located on <img src="https://quay.io/static/img/quay_favicon.png" style="width: 20px; height: 20px"/> [Quay.io](https://quay.io/) and synchronized to the <img src="https://hub.docker.com/favicon.ico" style="width: 20px; height: 20px"/> [Docker Hub](https://hub.docker.com).

## Container images

Here is below the list of available container images. For more information on their role in the archutecture, you may check the [Architecture & deployment options](/documentation/explanations/deployment-options) explanations.

### Microcks App

The Microcks main web application (also called `webapp`) that holds the UI resources as well as API endpoints. It is produced from https://github.com/microcks/microcks/tree/master/webapp repo folder.

| Repository | Pull command      | Available tags |
| ---------- | ----------------- | -------------- |
| `quay.io/microcks/microcks` | `docker pull quay.io/microcks/microcks:latest` | <img src="https://quay.io/static/img/quay_favicon.png" style="width: 20px; height: 20px"/> [Quay.io](https://quay.io/repository/microcks/microcks?tab=tags) |
| `docker.io/microcks/microcks` | `docker pull microcks/microcks:latest` | <img src="https://hub.docker.com/favicon.ico" style="width: 20px; height: 20px"/> [Docker.io](https://hub.docker.com/r/microcks/microcks/tags) |

### Microcks Async Minion

The Microcks Async Minion (`microcks-async-minion`) is a component responsible for publishing mock messages corresponding to [AsyncAPI](/documentation/references/artifacts/asyncapi-conventions) definitions. It is produced from https://github.com/microcks/microcks/tree/master/minions/async repo folder.

| Repository | Pull command      | Available tags |
| ---------- | ----------------- | -------------- |
| `quay.io/microcks/microcks-async-minion` | `docker pull quay.io/microcks/microcks-async-minion:latest` | <img src="https://quay.io/static/img/quay_favicon.png" style="width: 20px; height: 20px"/> [Quay.io](https://quay.io/repository/microcks/microcks-async-minion?tab=tags) |
| `docker.io/microcks/microcks-async-minion` | `docker pull microcks/microcks-async-minion:latest` | <img src="https://hub.docker.com/favicon.ico" style="width: 20px; height: 20px"/> [Docker.io](https://hub.docker.com/r/microcks/microcks-async-minion/tags) |

### Microcks Postman runtime

The Microcks Postman runtime (`microcks-postman-runtime`) allows the execution of Postman Collection tests. It is produced from the https://github.com/microcks/microcks-postman-runtime repository.

| Repository | Pull command      | Available tags |
| ---------- | ----------------- | -------------- |
| `quay.io/microcks/microcks-postman-runtime` | `docker pull quay.io/microcks/microcks-postman-runtime:latest` | <img src="https://quay.io/static/img/quay_favicon.png" style="width: 20px; height: 20px"/> [Quay.io](https://quay.io/repository/microcks/microcks-postman-runtime?tab=tags) |
| `docker.io/microcks/microcks-postman-runtime` | `docker pull microcks/microcks-postman-runtime:latest` | <img src="https://hub.docker.com/favicon.ico" style="width: 20px; height: 20px"/> [Docker.io](https://hub.docker.com/r/microcks/microcks-postman-runtime/tags) |

### Microcks Uber

The *Uber* distribution is designed to support [Inner Loop integration or Shift-Left scenarios](https://www.linkedin.com/pulse/how-microcks-fit-unify-inner-outer-loops-cloud-native-kheddache) to embed Microcks in your development workflow, on a laptop, within your unit tests easy. It is produced from https://github.com/microcks/microcks/tree/master/distro/uber repo folder.

The *Uber* distribution provide additional tags with `-native` suffix (`xyz-native`, `latest-native` and `nightly-native`) that allows pulling a [GraalVM native](https://www.graalvm.org/latest/reference-manual/native-image/) packageg image with reduced image size and faster bootstrap time. However, some dynamic features like `SCRIPT` dispatcher are not available in this native flavour.

| Repository | Pull command      | Available tags |
| ---------- | ----------------- | -------------- |
| `quay.io/microcks/microcks-uber` | `docker pull quay.io/microcks/microcks-uber:latest` <br/> `docker pull quay.io/microcks/microcks-uber:latest-native` | <img src="https://quay.io/static/img/quay_favicon.png" style="width: 20px; height: 20px"/> [Quay.io](https://quay.io/repository/microcks/microcks-uber?tab=tags) |
| `docker.io/microcks/microcks-uber` | `docker pull microcks/microcks-uber:latest` <br/> `docker pull microcks/microcks-uber:latest-native` | <img src="https://hub.docker.com/favicon.ico" style="width: 20px; height: 20px"/> [Docker.io](https://hub.docker.com/r/microcks/microcks-uber/tags) |

### Microcks Uber Async Minion

The Microcks Uber Async Minion (`microcks-uber-async-minion`) is responsible for publishing mock messages corresponding to [AsyncAPI](/documentation/references/artifacts/asyncapi-conventions) definitions with *Uber* distribution. It is produced from https://github.com/microcks/microcks/tree/master/distro/uber-async repo folder.

| Repository | Pull command      | Available tags |
| ---------- | ----------------- | -------------- |
| `quay.io/microcks/microcks-uber-async-minion` | `docker pull quay.io/microcks/microcks-uber-async-minion:latest` | <img src="https://quay.io/static/img/quay_favicon.png" style="width: 20px; height: 20px"/> [Quay.io](https://quay.io/repository/microcks/microcks-uber-async-minion?tab=tags) |
| `docker.io/microcks/microcks-uber-async-minion` | `docker pull microcks/microcks-uber-async-minion:latest` | <img src="https://hub.docker.com/favicon.ico" style="width: 20px; height: 20px"/> [Docker.io](https://hub.docker.com/r/microcks/microcks-uber-async-minion/tags) |

### Microcks Operator

This container image is a Kubernetes Operator for installing and managing Microcks using Custom Resources. It is produced from the https://github.com/microcks/microcks-operator repository.

| Repository | Pull command      | Available tags |
| ---------- | ----------------- | -------------- |
| `quay.io/microcks/microcks-operator` | `docker pull quay.io/microcks/microcks-operator:latest` | <img src="https://quay.io/static/img/quay_favicon.png" style="width: 20px; height: 20px"/> [Quay.io](https://quay.io/repository/microcks/microcks-operator?tab=tags) |
| `docker.io/microcks/microcks-operator` | `docker pull microcks/microcks-operator:latest` | <img src="https://hub.docker.com/favicon.ico" style="width: 20px; height: 20px"/> [Docker.io](https://hub.docker.com/r/microcks/microcks-operator/tags) |

### Microcks CLI

This container image is a [CLI](/documentation/guides/automation/cli) used for interacting with a Microcks instance. It is produced from the https://github.com/microcks/microcks-cli repository.

| Repository | Pull command      | Available tags |
| ---------- | ----------------- | -------------- |
| `quay.io/microcks/microcks-cli` | `docker pull quay.io/microcks/microcks-cli:latest` | <img src="https://quay.io/static/img/quay_favicon.png" style="width: 20px; height: 20px"/> [Quay.io](https://quay.io/repository/microcks/microcks-cli?tab=tags) |
| `docker.io/microcks/microcks-cli` | `docker pull microcks/microcks-operator:latest` | <img src="https://hub.docker.com/favicon.ico" style="width: 20px; height: 20px"/> [Docker.io](https://hub.docker.com/r/microcks/microcks-cli/tags) |


## Software Supply Chain Security

Software supply chain security combines best practices from risk management and cybersecurity to help protect the software supply chain from potential vulnerabilities. We aim to provide the most comprehensive information about the software, the people who wrote them, and the sources they come from, like registries, GitHub repositories, codebases, or other open source projects. It also includes any vulnerabilities that may negatively impact software security – and that’s where software supply chain security comes in.  

### Vulnerabilities

All our container images are scanned for vulnerabilities with both [Clair](https://www.redhat.com/en/topics/containers/what-is-clair) on <img src="https://quay.io/static/img/quay_favicon.png" style="width: 20px; height: 20px"/> [Quay.io](https://quay.io/) and [Docker Scout](https://docs.docker.com/scout/) on <img src="https://hub.docker.com/favicon.ico" style="width: 20px; height: 20px"/> [Docker Hub](https://hub.docker.com). Scanning reports are available for each image on every repository.

The container images base layers as well as the Microcks application dependencies are regularly updated as per the `SECURITY-INSIGHTS.yml` and  `DEPENDENCY_POLICY.md` file you may find in each GitHub source repository.

### Signatures

All our images are signed with [Cosign](https://docs.sigstore.dev/cosign/signing/overview/) and using the Sigstore framework.
The signing is actually done from withing our GitHub Actions process using the [GitHub OIDC token](https://docs.sigstore.dev/certificate_authority/oidc-in-fulcio/#github) associated with the Actions process.

To verify the signature of a Microcks container image you just pulled, you first have to check the name of the Actions process - usually `build-verify.yml` - and the tag or branch from where it has been produced.

For example: you can verify the signature of the `microcks:nightly` image, built from the `1.11.x` branch, using those commands:

```sh
IMAGE_WITH_DIGEST=`docker inspect --format='{{index .RepoDigests 0}}' quay.io/microcks/microcks:nightly`

cosign verify $IMAGE_WITH_DIGEST --certificate-identity https://github.com/microcks/microcks/.github/workflows/build-verify.yml@refs/heads/1.11.x --certificate-oidc-issuer https://token.actions.githubusercontent.com | jq .
```

that may produced following output:
```json
// Verification for quay.io/microcks/microcks@sha256:7241f2c0bbd9f5ba72c2bc908e9ee035db40c4fcff61d7d75788ddb8df139e2c --
// The following checks were performed on each of these signatures:
//  - The cosign claims were validated
//  - Existence of the claims in the transparency log was verified offline
//  - The code-signing certificate was verified using trusted certificate authority certificates
[
  {
    "critical": {
      "identity": {
        "docker-reference": "quay.io/microcks/microcks"
      },
      "image": {
        "docker-manifest-digest": "sha256:7241f2c0bbd9f5ba72c2bc908e9ee035db40c4fcff61d7d75788ddb8df139e2c"
      },
      "type": "cosign container image signature"
    },
    "optional": {
      "1.3.6.1.4.1.57264.1.1": "https://token.actions.githubusercontent.com",
      "1.3.6.1.4.1.57264.1.2": "push",
      "1.3.6.1.4.1.57264.1.3": "edbe55f846f554d500ac3dc33c8346195e70f2ac",
      "1.3.6.1.4.1.57264.1.4": "build-verify-package",
      "1.3.6.1.4.1.57264.1.5": "microcks/microcks",
      "1.3.6.1.4.1.57264.1.6": "refs/heads/1.11.x",
      "Bundle": {
        "SignedEntryTimestamp": "MEQCIGOggaElAVzClnzPfl1gs3+ZgBwl22XC51YhbTdqu+f8AiAQ3Nfk/GXwIe2X7KSVwFubiuJfdVyPeZQQN0mhnHVkpA==",
        "Payload": {
          "body": "ey---REDACTED---0=",
          "integratedTime": 1733173324,
          "logIndex": 152950063,
          "logID": "c0d23d6ad406973f9559f3ba2d1ca01f84147d8ffc5b8445c224f98b9591801d"
        }
      },
      "Issuer": "https://token.actions.githubusercontent.com",
      "Subject": "https://github.com/microcks/microcks/.github/workflows/build-verify.yml@refs/heads/1.11.x",
      "githubWorkflowName": "build-verify-package",
      "githubWorkflowRef": "refs/heads/1.11.x",
      "githubWorkflowRepository": "microcks/microcks",
      "githubWorkflowSha": "edbe55f846f554d500ac3dc33c8346195e70f2ac",
      "githubWorkflowTrigger": "push"
    }
  }
]
```

You can then extract the `logIndex` and connect to [Rekor](https://search.sigstore.dev/) to get some details on it. Here: https://search.sigstore.dev/?logIndex=152950063

### Provenance

All our images are built with a [SLSA Provenance](https://slsa.dev/spec/v1.0/provenance#v02) attestation (currently in `v0.2`). This attestation is attached as a layer of a 
metadata manifest of the main image index.

You can quickly inspect the `Provenance` attestations value using the `imagestools inspect` tool from `docker`like this:

```sh
docker buildx imagetools inspect quay.io/microcks/microcks:nightly --format "{{ json .Provenance }}"
```

If you need to get access to the raw [in-toto predicates](https://github.com/in-toto/attestation/tree/v1.0/spec/predicates), you can use a tool like [ORAS](https://oras.land/) utility.

As Microcks images are provided for `linux/amd64` and `linux/arm64` architectures, the 2 first manifests of an image index are reserved for these architectures. Then, starting
at index 2 come the metadata manifests from where you can extract in-toto attestations. For example: you can extract the Provenance of the `microcks:nightly` image using those
commands:

```sh
PROVENANCE_DIGEST=`docker manifest inspect --verbose quay.io/microcks/microcks:nightly | jq -r '.[2].OCIManifest.layers | map(select(.annotations."in-toto.io/predicate-type" == "https://slsa.dev/provenance/v0.2") | .digest)[0]'`

oras blob fetch --output - quay.io/microcks/microcks:nightly@$PROVENANCE_DIGEST | jq .
```

that may produced following output:
```json
{
  "_type": "https://in-toto.io/Statement/v0.1",
  "predicateType": "https://slsa.dev/provenance/v0.2",
  "subject": [
    {
      "name": "pkg:docker/quay.io/microcks/microcks@nightly?platform=linux%2Famd64",
      "digest": {
        "sha256": "109c1a70123a64c824b32dfebaf0934b6d40db127af409ed07ae303966f1b412"
      }
    },
    {
      "name": "pkg:docker/microcks/microcks@nightly?platform=linux%2Famd64",
      "digest": {
        "sha256": "109c1a70123a64c824b32dfebaf0934b6d40db127af409ed07ae303966f1b412"
      }
    }
  ],
  "predicate": {
    "builder": {
      "id": ""
    },
    "buildType": "https://mobyproject.org/buildkit@v1",
    "materials": [
      {
        "uri": "pkg:docker/registry.access.redhat.com/ubi9/ubi-minimal@9.4-1227.1725849298?platform=linux%2Famd64",
        "digest": {
          "sha256": "1b6d711648229a1c987f39cfdfccaebe2bd92d0b5d8caa5dbaa5234a9278a0b2"
        }
      }
    ],
    "invocation": {
      "configSource": {
        "entryPoint": "Dockerfile"
      },
      "parameters": {
        "frontend": "dockerfile.v0",
        "locals": [
          {
            "name": "context"
          },
          {
            "name": "dockerfile"
          }
        ]
      },
      "environment": {
        "platform": "linux/amd64"
      }
    },
    "metadata": {
      "buildInvocationID": "hpnt5a6sztl5mxvhlp1n8hd1v",
      "buildStartedOn": "2024-12-03T13:14:59.450237594Z",
      "buildFinishedOn": "2024-12-03T13:15:52.403132277Z",
      "completeness": {
        "parameters": false,
        "environment": true,
        "materials": false
      },
      "reproducible": false,
      "https://mobyproject.org/buildkit@v1#metadata": {
        "vcs": {
          "localdir:context": "webapp",
          "localdir:dockerfile": "webapp/src/main/docker",
          "revision": "f3cfa7c2c741e6023bd2bef77a5b87278f01d540",
          "source": "https://github.com/microcks/microcks"
        }
      }
    }
  }
}
```

You can find in the attestation the GitHub source and revision, the base image used (`ubi9/ubi-minimal@9.4-1227.1725849298`) as well as the build metadata.

### SBOM - Softwate Bill Of Materials

All our images are built with a [SPDX SBOM](https://spdx.dev/) attestation (currently in `v2.3`). This attestation is attached as a layer of a metadata manifest of the main image index.

You can quickly inspect the `Provenance` attestations value using the `imagestools inspect` tool from `docker`like this:

```sh
docker buildx imagetools inspect quay.io/microcks/microcks-postman-runtime:nightly --format "{{ json .SBOM }}"
```

If you need to get access to the raw [in-toto predicates](https://github.com/in-toto/attestation/tree/v1.0/spec/predicates), you can use a tool like [ORAS](https://oras.land/) utility.

As Microcks images are provided for `linux/amd64` and `linux/arm64` architectures, the 2 first manifests of an image index are reserved for these architectures. Then, starting
at index 2 come the metadata manifests from where you can extract in-toto attestations. For example: you can extract the SBOM of the `microcks-postman-runtime:nightly` image 
using those commands:

```sh
SBOM_DIGEST=`docker manifest inspect --verbose quay.io/microcks/microcks-postman-runtime:nightly | jq -r '.[2].OCIManifest.layers | map(select(.annotations."in-toto.io/predicate-type" == "https://spdx.dev/Document") | .digest)[0]'`

oras blob fetch --output - quay.io/microcks/microcks-postman-runtime:nightly@$SBOM_DIGEST | jq .
```

```json
{
  "_type": "https://in-toto.io/Statement/v0.1",
  "predicateType": "https://spdx.dev/Document",
  "subject": [
    {
      "name": "pkg:docker/quay.io/microcks/microcks-postman-runtime@nightly?platform=linux%2Famd64",
      "digest": {
        "sha256": "11c951599ed1bf649abbc2b23ae2730a4e1ef6ad9537a7f10df39b6546bf8429"
      }
    }
  ],
  "predicate": {
    "spdxVersion": "SPDX-2.3",
    "dataLicense": "CC0-1.0",
    "SPDXID": "SPDXRef-DOCUMENT",
    "name": "sbom",
    "documentNamespace": "https://anchore.com/syft/dir/sbom-250326c0-1ac9-45df-b956-7034af7e03f0",
    "creationInfo": {
      "licenseListVersion": "3.23",
      "creators": [
        "Organization: Anchore, Inc",
        "Tool: syft-v0.105.0",
        "Tool: buildkit-v0.17.2"
      ],
      "created": "2024-12-03T13:19:29Z"
    },
    "packages": [
      {
        "name": "@colors/colors",
        "SPDXID": "SPDXRef-Package-npm--colors-colors-0d3fee5f6cc0bed6",
        "versionInfo": "1.6.0",
        "supplier": "Person: DABH",
        "originator": "Person: DABH",
        "downloadLocation": "http://github.com/DABH/colors.js.git",
        "filesAnalyzed": false,
        "homepage": "https://github.com/DABH/colors.js",
        "sourceInfo": "acquired package info from installed node module manifest file: /app/node_modules/@colors/colors/package.json",
        "licenseConcluded": "NOASSERTION",
        "licenseDeclared": "MIT",
        "copyrightText": "NOASSERTION",
        "description": "get colors in your node.js console",
        "externalRefs": [
          // [...]
        ]
      },
      // [...]
    ]
  }
}
```

You can find in the attestation all the packages directly or transitively included into the container image.
