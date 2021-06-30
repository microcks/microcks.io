---
title: "News about Microcks"
layout: tweets-columns
categories: [releases]
lastmod: 2021-06-30
---

## Fresh Releases

### Microcks core

#### 1.3.0 on 30 Jun 2021

We are so proud and happy to share this new `1.3.0` and important Microcks release two months in advance based on our initial roadmap! Yes, this was yet another big challenge 🎉 Kudos to our community users and partners for supporting and pushing us to this momentum. Here are the main changes and enhancements of this release:

* The support of [AsyncAPI v2.1](https://www.asyncapi.com/blog/release-notes-2.1.0) specification,
* The support of [WebSocket](https://datatracker.ietf.org/doc/html/rfc6455) protocol mocking and testing,
* The support of Multi-artifacts mocks definition,
* The support of [gRPC](https://grpc.io/) mocking and testing.

Check out our [release notes](https://microcks.io/blog/microcks-1.3.0-release/)!

You can also check [GitHub milestone](https://github.com/microcks/microcks/milestone/14?closed=1) for the full list of closed issues.

#### 1.2.1 on 06 May 2021

We are very glad to announce today the **1.2.1** release of Microcks! This is mainly an “Enhancement release” pushing further the features we introduced within the previous `1.2.0`. Here are the main changes and enhancements of this release:

* The support of [OpenAPI v3.1](https://www.openapis.org/blog/2021/02/18/openapi-specification-3-1-released) specification,
* The support of [Apache Kafka](https://kafka.apache.org) headers through AsyncAPI mocking,
* The support of [MQTT](https://mqtt.org) parametrized channels  through AsyncAPI mocking,
* Enhancement of testing experience through [Secrets for authentication](https://github.com/microcks/microcks/issues/366), [tests timeouts](https://github.com/microcks/microcks/issues/365), [tests replays](https://github.com/microcks/microcks/issues/368) and [expression languages in request](https://github.com/microcks/microcks/issues/375),
* SOAP 1.2 full support in Microcks, fixing the [incoming version detection](https://github.com/microcks/microcks/pull/358) and the [response content-type](https://github.com/microcks/microcks/issues/356).
* Podman Compose support for running Microcks on your laptop. See the [Podman installation guide](https://microcks.io/documentation/installing/podman-compose/)

Check out our [release notes](https://microcks.io/blog/microcks-1.2.1-release/)!

You can also check [GitHub milestone](https://github.com/microcks/microcks/milestone/13?closed=1) for the full list of closed issues.

#### 1.2.0 on 21 Feb 2021

We are delighted to announce the **1.2.0** release of Microcks! Here are below the main highlights of this release:

* The support of [Apache Avro](https://avro.apache.org) as Event-driven APIs message encoding, as well as various schema registries. See our [Kafka, Avro and Schema Registry guide](https://microcks.io/documentation/guides/avro-messaging/)
* The support of [MQTT](https://mqtt.org/) protocol for mocking and testing Event-driven APIs that may be related to the Internet of Things (IoT),
* New [template functions](https://microcks.io/documentation/using/advanced/templates/#function-expressions) for bringing rich dynamic mocking responses,
* New `FALLBACK` dispatcher for smarter routing. See the [Fallback and advanced dispatching](https://microcks.io/blog/advanced-dispatching-constraints/) blog post.

Check out our [release notes](https://microcks.io/blog/microcks-1.2.0-release/)!

You can also check [GitHub milestone](https://github.com/microcks/microcks/milestone/12?closed=1) for the full list of closed issues.

[Look at the History for older release notes](./history)

### Microcks extensions

#### microcks-jenkins-plugin 0.4.0 on 30 Jun 2021

Please check [GitHub milestone](https://github.com/microcks/microcks-jenkins-plugin/milestone/2?closed=1) for the list of enhancement and issues.

#### microcks-cli 0.4.0 on 30 Jun 2021

Have a look at [GitHub milestone](https://github.com/microcks/microcks-cli/milestone/3?closed=1) for the list of enhancement and issues.

#### microcks-jenkins-plugin 0.3.0 on 18 Sep 2020

The **0.3.0** release mainly brings support for `AsyncAPI` testing feature but also some other enhancements:

* It adds the `ASYNC_API_SCHEMA` option for the `runner` argument of the `test`command,
* It adds the `Secret Name` parameter allowing to reference a Microcks secret holding authentication parameters for the tested endpoint,
* It aligns the configuration on CLI configuration, removing the `Keycloak URL` parameters. Making the config simpler,
* It makes the configuration more robust by taking care od adding an `/api` prefix on Microcks URL if missing,
* It fixes the persistence of some Build Step attributes when using the graphical editor.

Please check [GitHub milestone](https://github.com/microcks/microcks-jenkins-plugin/milestone/1?closed=1) for the list of enhancement and issues.

#### microcks-cli 0.3.0 on 17 Sep 2020

This **0.3.0** release brings support for `AsyncAPI` testing feature:

* It adds the `ASYNC_API_SCHEMA` option for the `runner` argument of the `test`command,
* It adds the `--secretName` feature flag for the `test` command allowing to reference a Microcks secret holding authentication parameters for the tested endpoint,
* Container image for `microcks-cli` is now hosted on [here](https://quay.io/repository/microcks/microcks-cli?tab=tags) Quay.io

Have a look at [GitHub milestone](https://github.com/microcks/microcks-cli/milestone/2?closed=1) for the list of enhancement and issues.

#### microcks-cli 0.2.0 on 14 Aug 2019

This **0.2.0** release simplify CLI usage by removing unecessary `keycloakURL` parameter and add support for:

* Operation headers override,
* HTTPS with unsecure mode or custom certificates,
* Verbose flag for debugging.

Please check [GitHub milestone](https://github.com/microcks/microcks-cli/milestone/1?closed=1) for the list of enhancement and issues.