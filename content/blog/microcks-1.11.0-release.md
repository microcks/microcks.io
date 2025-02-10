---
title: Microcks 1.11.0 release 🚀
date: 2025-01-22
image: "images/blog/microcks-1.11.0-feature.png"
author: "Laurent Broudoux"
type: "regular"
description: "Microcks 1.11.0 release 🚀"
draft: false
---

Start fresh this New Year and welcome the `1.11.0` release of Microcks, the [CNCF](https://landscape.cncf.io/?selected=microcks)’s open-source cloud-native API Mocking and Testing tool! 

With over **60 resolved issues** and **12 contributors**, this is one of the biggest releases! Kudos to all the people 👏 who helped along the way by writing code, commenting on issues, or writing posts. Check our greetings and notes below.

This release had no specific theme at the beginning but reviewing the content, we realized it was mainly about validation & traceability: 

* **Validation on mocks** with new controls on input requests and new gRPC error management;
* **Validation and Traceability of the way we build Microcks** with huge enhancements related to the security of the software supply chain!

{{< image src="images/blog/microcks-1.11.0-feature.png" alt="microcks-feature" >}}

Without further ado, let’s review the latest updates for each of our key highlights.


## Validation on mocks

It’s a common concern to lower the entry barrier when providing mocks so that people can easily discover and play around with your API endpoints. For that, Microcks only uses a subset of incoming request elements to try to find a matching mock response. This is great for a quick start but this also means that all the non-matching elements - like query parameters or body information - can be totally false without any raised concern on the consumer side 🤔

The [Constraints](https://microcks.io/documentation/guides/usage/mocks-constraints/) feature is typically there to avoid this, but until today, it was an opt-in option you had to explicitly set by adding constraints to your mocks via the Web console or the API only.

With this new `1.11.0`, **we drastically enhanced the way that Constraints can be set and applied** to prevent your API consumers from being blind to their own errors.

1️⃣ The [Parameters Constraints](https://microcks.io/documentation/guides/usage/mocks-constraints/) corresponding to `required` elements in query or headers are now automatically inferred and applied at runtime. Just try calling a Microcks mock missing a required header and you’ll now receive a `400` response indicating a malformed request,

2️⃣ All the other constraints - type, regular expression, recopy, etc. - can now be specified in your OpenAPI or YAML artifacts using our [OpenAPI extension](https://microcks.io/documentation/references/artifacts/openapi-conventions/#openapi-extensions) or our own [APIMetadata format](https://microcks.io/documentation/references/metadada/#api-metadata-properties). You no longer need to issue an API call or connect to the console.

What about body payload? Applying full body payload validation on each incoming request can be impactful on behavior for existing users but also on performance. That’s why **we also introduced new validation-enabled mock endpoints** with this version! 

From the small toggle next to the **Mock URL** you can now ask for the `valid` endpoint option:

{{< image src="images/blog/microcks-1.11.0-validation.png" alt="mock-endpoint-validation" >}}

Just issue an invalid call to this endpoint - changing the price to a string for example - and you’ll see the validation in action:

```sh
$ curl -X PATCH 'http://localhost:8080/rest-valid/API+Pastries/0.0.1/pastries/Eclair+Cafe' \
    -H 'Accept: application/json' -H 'Content-Type: application/json' \
    -d '{ "price": "2.6" }' -v
=== OUTPUT ===
[...]
< HTTP/1.1 400 
[...]
[instance type (string) does not match any allowed primitive type (allowed: ["integer","number"])]%
``` 

> This new validation option is available for both REST and SOAP endpoints. The [gRPC](https://grpc.io/) endpoint already embeds this body payload validation, which is mandatory for Protobuffer serialization.


## gRPC enhancements

[gRPC](https://grpc.io/) is quickly gaining popularity as it offers an efficient alternative to text message serialization in performance-critical situations. With this `1.11.0`, Microcks enhanced its gRPC mocking and testing support thanks to awesome contributions by [Anika Apel](https://github.com/anika-apel) 🙏 and [Caio Amaral](https://github.com/camaral) 🙏

1️⃣ Microcks now supports using gRPC metadata (or headers) into the `SCRIPT` dispatcher. This allows you to simply use the ``mockRequest.getRequestHeaders()`` function to access gRPC metadata and define smart dispatching rules using them,

2️⃣ It also supports injecting gRPC headers into test requests when contract-testing implementation endpoints. The headers you specify - either through the Web console, the [Microcks CLI](https://microcks.io/documentation/guides/automation/cli/), an [API call](https://microcks.io/documentation/guides/automation/api/), or your favorite [Testcontainers module](https://microcks.io/blog/testcontainers-modules-0.3/) - are passed to the endpoint under test and become dynamic elements of the tests,

3️⃣ And it also relates to validation - you’ll now have the capability to mock gRPC failure responses as well! Oftentimes, one wants to simulate edge cases in order to verify the application behavior and simulating errors can be a handful too! It’s now possible to do so and it’s even easier using our new [APIExamples](https://microcks.io/documentation/references/examples/#requestresponse-based-api) format simply specifying the `status` of a gRPC response 😉

> In addition to those awesome contributions, our friends at [Bitso](https://bitso.com/) have also crafted a very interesting blog post on [how they’re using Microcks to setup isolated local development](https://medium.com/bitso-engineering/isolated-local-development-environment-with-microcks-70c8ff291950) for their Spring Boot gRPC developers. A must-read! 🤩


## Secured Software Supply Chain

As in most software projects, the way we build Microcks is not the most glamorous part of it! But as an open-source project, part of an exposed foundation like the [CNCF](https://landscape.cncf.io/?selected=microcks), and being used in mission-critical organizations like Banks, Telcos, and Public Governmental organizations, the software supply chain integrity is a major concern 🤔

The `1.11.0` release **has been entirely built with this in mind**, applying the best practices from the community and especially from the [SLSA](https://slsa.dev/) project (for Supply-chain Levels for Software Artifacts).

What changes have been introduced? What traceability, auditability and integrity guarantees are we providing? Well, that’s a lot! Here’s a non-exhaustive list of new practices and guarantees we introduced: 

* We settled the [dependencies management policy](https://clomonitor.io/docs/topics/checks/#dependencies-policy), [dependencies update tools](https://clomonitor.io/docs/topics/checks/#dependency-update-tool-from-openssf-scorecard), and [security insights](https://github.com/ossf/security-insights-spec/blob/v1.0.0/specification.md),
* We removed [dangerous workflows](https://clomonitor.io/docs/topics/checks/#dangerous-workflow-from-openssf-scorecard) by reviewing [CI/CD permissions](https://clomonitor.io/docs/topics/checks/#token-permissions-from-openssf-scorecard) and dependencies,
* We fully [automated the release process](https://github.com/microcks/microcks/issues/1468) so that change can’t appear without a formal review,
* We now generate a [Software Bill of Materials](https://clomonitor.io/docs/topics/checks/#software-bill-of-materials-sbom) (SBOM) for each package we release,
* We are also [signing released packages](https://clomonitor.io/docs/topics/checks/#signed-releases-from-openssf-scorecard) and their checksums so that it’s easy to check their integrity.

<p style="margin: 0px; line-height: 0.8rem">&nbsp</p>

The Microcks project also provides a bunch of **container images** and we’ve done similar things for them:

* The images we provide are now all [signed using Sigstore](https://www.sigstore.dev/),
* Attached as image layers, we also provide:

    * A [SLSA Provenance](https://slsa.dev/spec/v1.0/provenance#v02) attestation that can attest that the container comes from our CI/CD process,
    * A [SPDX SBOM](https://spdx.dev/) attestation that tracks all the dependent layers in the image
* We became a `Verified` and `Official` publisher on [ArtifactHub.io](https://artifacthub.io/packages/search?org=microcks&sort=relevance&page=1), the CNCF official artifact repository. 

Whouah! This was a **long-run task that spans the six last months** and has been tracked in issue [#1201](https://github.com/microcks/microcks/issues/1201). This has been done not just for the main Microcks packages but for all the packages coming from all the GitHub repositories in the [Microcks organization](https://github.com/microcks)! To help us monitor that daily, we have set the [CLO Monitor tooling](https://clomonitor.io/projects/cncf/microcks) that you can also use to track our progress 😎 

> As a Microcks end-user, you would be particularly interested in the process of checking the integrity of downloaded container images. The [Software Supply Chain Security documentation](https://microcks.io/documentation/references/container-images/#software-supply-chain-security) details how things are structured and can be easily checked using standard tools like `docker`, `cosign`, or `oras`. 


## Improvements that are worth noting

Aside from the major changes listed above, here are some other improvements that are worth being aware of. Without any specific priorities: 

* We now support embedded Avro schema and schema registry integration for AsyncAPI - See issue [#1422](https://github.com/microcks/microcks/issues/1422)
* We now support multi-templating in AsyncAPI channel names - See issue [#1339](https://github.com/microcks/microcks/issues/1399)
* We fixed a permission issue when deploying MongoDB on certain Kubernetes distro - See issue [#1420](https://github.com/microcks/microcks/issues/1420)
* We fixed all the documentation links in the Web console - See issue [#1350](https://github.com/microcks/microcks/issues/1350)
* We provide a new fallback notation for templating - See issue [#1446](https://github.com/microcks/microcks/issues/1446)

And many more… The full release notes with all changes can be found [here](https://github.com/microcks/microcks/releases/tag/1.11.0).

> ⚠️ ***Warning***<br/><br/>
>
> With the release `1.11.0`, **we decommissioned the [Microcks Ansible Operator](https://github.com/microcks/microcks-ansible-operator)** that will no longer work if you choose Microcks `1.11.0` or `latest` as your Microcks version. As a consequence, we recommend not to change the Microcks version in your existing `MicrocksInstall` Custom-Resource and pin it to `1.10.1` if you temporarily want to stick with this operator.<br/><br/>
>
> We now **provide a [new Microcks Operator](https://github.com/microcks/microcks-operator) that is more lightweight, performant with more features** in a 100% GitOps oriented way. The new Microcks Operator has been used in production for months by different adopter and we're confident it behaves well.


## What’s coming next?

As usual, we will eagerly prioritize items according to community feedback. You can check and collaborate via our list of [issues on GitHub](https://github.com/microcks/microcks/issues) and the project [roadmap](https://github.com/orgs/microcks/projects/1).

More than ever, we want to involve community members in design discussions and start some discussions about significant changes regarding [Microcks UI Future](https://github.com/orgs/microcks/discussions/1458) or our [Participation to LFX mentorship programs](https://github.com/orgs/microcks/discussions/1463). Please join us to shape the future!

Remember that we are an open community, which means you, too, can jump on board to make Microcks even greater! Come and say hi! on our [GitHub discussion](https://github.com/microcks/microcks/discussions) or [Discord chat](https://microcks.io/discord-invite/) 👻, send some love through [GitHub stars](https://github.com/microcks/microcks) ⭐️ or follow us on [BlueSky](https://bsky.app/profile/microcks.io), [Twitter](https://twitter.com/microcksio), [Mastodon](https://hachyderm.io/@microcksio@mastodon.social), [LinkedIn](https://www.linkedin.com/company/microcks/), and our [YouTube channel](https://www.youtube.com/c/Microcks)!

Thanks for reading and supporting us! ❤️

