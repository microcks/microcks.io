---
title: Microcks 1.9.0 release 🚀
date: 2024-03-14
image: "images/blog/microcks-1.9.0-feature.png"
author: "Laurent Broudoux"
type: "regular"
description: "Microcks 1.9.0 release 🚀"
draft: false
---

This has been a busy week just before [KubeCon EU](https://www.linkedin.com/feed/update/urn:li:activity:7173641963068350464), but we are delighted to announce the `1.9.0` release of Microcks, the [CNCF](https://landscape.cncf.io/?selected=microcks)'s open-source cloud-native tool for API Mocking and Testing,

We received help from **6 different external code committers** and dozens of others who opened and reviewed issues and contributed ideas or blog posts. Most of them are adopters! Kudos to all of them 👏 and see greetings along the notes below.

The theme of this release is Time as illustrated by the highlights of this release:

* Asynchronous and parallel Time through the support of the new **AsyncAPI v3 specification**,
* Observed and measured Time with a lot of work done around the addition of **OpenTelemetry** support **and a benchmarking suite** for Microcks,
* Reduced startup Time with a new declination of Microcks that uses **GraalVM native** and [Spring AOT](https://docs.spring.io/spring-framework/reference/core/aot.html) compilations undercover to give you unprecedented fast bootstrap ⚡

{{< image src="images/blog/microcks-1.9.0-feature.png" alt="microcks-feature" >}}

Let’s do a review of what’s new on each one of our highlights without delay.


## Parallel time with AsyncAPI v3 support

Just three months [after the official announcement](https://www.asyncapi.com/blog/release-notes-3.0.0) of this significant spec update, Microcks is **the first solution to support v3 for mocking and testing Event-Driven Architectures**! Moreover, the eight protocols supported for AsyncAPI v2 are also directly available for AsyncAPI v3 in Microcks, ensuring a smooth transition for your team!

{{< image src="images/blog/microcks-1.7.1-protocols.png" alt="microcks-async-protocols" >}}

We also took advantage of our recent work on [OpenAPI complex structures](https://microcks.io/blog/microcks-1.8.1-release/#openapi-complex-structures), to integrate many enhancements in our AsyncAPI v3 importer! Consequently, Microcks can now follow spec fragments or document references (using the `$ref` keyword) everywhere! It could be in a single or multiple files; referenced using absolutes or relatives URLs!

Microcks can also now fully support the parametrized channel addresses of AsyncAPI v3. This feature enables you to define how destinations on brokers can be dynamically referenced using message payload elements like the below:

```yaml
channels:
 lightingMeasured:
   address: smartylighting.streetlights.1.0.event.{streetlightId}.lighting.measured
[...]
components:
  parameters:
    streetlightId:
      description: The ID of the streetlight.
      location: $message.payload#/streetlightId
```

In this situation, Microcks will dynamically create and manage corresponding destinations on your broker, depending on your mock messages. Imaging a message with `streetlightID` value being `01234` it will create a ``smartylighting.streetlights.1.0.event.01234.lighting.measured`` Kafka topic or SQS queue, and for another message with `streetlightID` value being `56789` it will create another ``smartylighting.streetlights.1.0.event.56789.lighting.measured`` Kafka topic or SQS queue, for example.

Finally, remember that our AsyncAPI v3 capabilities in Microcks support JSON or Avro schema, with integration with Schema Registry - and can also be instrumented by our [AI Copilot](https://microcks.io/blog/microcks-1.8.0-release/#introducing-ai-copilot) 🤖 to help you quickly generate rich mock datasets!

> Be sure to check our [updated AsyncAPI mocking and testing](https://microcks.io/documentation/references/artifacts/asyncapi-conventions/) documentation.


## Observability with OpenTelemetry and all

As part of this new `1.9.0`, we are also excited to unveil extended monitoring and observability features in Microcks. Adding those features was critical as more and more organizations rely on Microcks, at least for two reasons:

1. It is used in performance testing scenarios, and people have to be sure Microcks will not be the bottleneck,
2. It became a frequently updated centerpiece, and people have to ensure new releases do not bring regressions.

As part of the [CNCF](https://cncf.io) ecosystem, it was a natural decision that the way to go was to provide a comprehensive integration with the [OpenTelemetry](https://opentelemetry.io/) initiative. OpenTelemetry is a collection of APIs, SDKs, and tools that provide an open, vendor-agnostic way to instrument, generate, collect, transform, and export telemetry data.

However, instrumenting and plugging Microcks into an [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/) was not enough… We wanted to provide assistance in the process of visualizing, analyzing, and exploring the collected data. As a consequence, we now offer a comprehensive [Grafana dashboard](https://grafana.com/grafana/). That way you get a direct digest of all the collected information with instant access to performance metrics per mock endpoints, including TPS and response time percentile information as illustrated below:

{{< image src="images/blog/observability-for-microcks-1.png" alt="microcks-grafana-dashboard" >}}

Finally, as generating load on Microcks can be complex for new users, we added a benchmarking suite to Microcks `1.9.0`! Easy to go for beginners, this suite allows you to simulate Virtual Users on different usage scenarios and gather raw performance metrics of your instance. It can also be used directly, even if you don’t have or use the OpenTelemetry or Grafana services.

Using this benchmarking suite, we got an impressive **756.5 hits/second** with a **p(90) response time of 28.2ms** during the bench on a Macbook M2 with a 400MB heap! 🚀

> Check out this blog post on [Observability for Microcks at scale](https://microcks.io/blog/observability-for-microcks-at-scale/) with a comprehensive walkthrough on the different new features. Thanks to [Alain Pham](https://www.linkedin.com/in/alainpham/) 🙏 from [Grafana Labs](https://grafana.com/) for this excellent contribution!


## Reduced bootstrap time with GraalVM

The latest highlight of this `1.9.0` release is about reducing the bootstrap time of a Microcks instance. As our [Testcontainers module](https://testcontainers.com/modules/microcks/) is getting traction (more than 2K downloads per month) for integrating API mocking and testing into your local development workflow, we wanted to further enhance the developer experience. Sure we made some improvements with the `microcks-uber` container image, allowing you to start a Microcks instance in 2-3 seconds, but we thought we could do best…

Enter the new `docker run -p 8585:8080 -it quay.io/microcks/microcks-uber:1.9.0-native` command: 

{{< image src="images/blog/microcks-1.9.0-native.png" alt="microcks-1.9.0-native" >}}

And yes! ⚡🚀⚡ See now this **0.300 seconds** startup time! 

What have we done? We “just” packaged our Microcks Java application to a platform native binary thanks to [GraalVM native](https://www.graalvm.org/latest/reference-manual/native-image/) and [Spring Boot AOT](https://docs.spring.io/spring-boot/docs/current/reference/html/native-image.html) compilation. 

This gives you a complete, platform-specific executable that removes some of the JVM drawbacks (but also benefits) and is now ideally suited for fast, frequent, and ephemeral runs of Microcks. Aside from the effects on the startup time of the application, the new native image brings the following benefits:

* A **reduced image size**: 109MB instead of 220MB (yes, more than 50%)
* A reduced **surface for security attacks**: a static binary prevents the dynamic injection and execution of code in Java.

> This new declination of Microcks (named `microcks-uber native`) is perfectly well-adapted for usage through testing libraries like [Testcontainers](https://testcontainers.com). However, at the time of writing, we don’t recommend using it as a replacement for standard distribution for long-running instances. Some arguments for that: JVM-based applications still tend to have better throughput on the long run, some dynamic features like `SCRIPT` dispatcher are not available in this native version, and it is still very fresh. 

## Community amplification

Community contributions are essential to us and do not come only from feature requests, bug issues, and open discussions. What a pleasure to see people relaying our messages, integrating Microcks in a demonstration, inviting us to events, or even talking about Microcks!

We’d like to thank the following awesome people:

* [Josh Long](https://twitter.com/starbuxman) 🙏 for this fantastic [Coffee + Software Livestream](https://www.youtube.com/watch?v=VsTj0hyYiAA&t=1s) reloaded, we’ve recorded together to demo our Testcontainers support and Spring AOT features,
* [Apoorva64](https://github.com/Apoorva64) 🙏 for his numerous contributions like [Fixes on Cors suppor](https://github.com/microcks/microcks/issues/1082)t or [Documentation rendering with multi-OpenAPI files](https://github.com/microcks/microcks/issues/1067) issues. We know that many others are coming 😉
* [Leon Nunes](https://www.linkedin.com/in/leon-nunes/) 🙏 from [Solo.io](https://solo.io) for talking about [Mocking GraphQL with Microcks](https://www.youtube.com/watch?v=_Tfed1VJTHU) at the GraphQL Bangkok event,
* [Tsiry Sandratraina](https://www.linkedin.com/in/tsiry-sandratraina/) 🙏 from [FluentCI](https://fluentci.io/) for its [Dagger Microcks module](https://daggerverse.dev/mod/github.com/fluent-ci-templates/microcks-pipeline@49e9bd8005a27df55de8c42acc4a1841986a1518) allowing you to integrate Microcks into your [Dagger](https://dagger.io) pipelines,
* And our own [Hugo Guerrero](https://github.com/hguerrero) 🙏 for telling the Microcks story of joining the CNCF  at the[ KCD México](https://twitter.com/kcd_mexico) event.


## What’s coming next?

As usual, we will eagerly prioritize items according to community feedback. You can check and collaborate via our list of [issues on GitHub](https://github.com/microcks/microcks/issues) and the project [roadmap](https://github.com/orgs/microcks/projects/1).

More than ever, we want to involve community members in design discussions and start some discussion about significant additions regarding [OpenAPI callbacks, webhooks and AsyncAPI](https://github.com/orgs/microcks/discussions/1039) in Microcks. Please join us to shape the future!

Remember that we are an open community, which means you, too, can jump on board to make Microcks even greater! Come and say hi! on our [GitHub discussion](https://github.com/microcks/microcks/discussions) or [Discord chat](https://microcks.io/discord-invite/) 👻, send some love through [GitHub stars](https://github.com/microcks/microcks) ⭐️ or follow us on [Twitter](https://twitter.com/microcksio), [Mastodon](https://hachyderm.io/@microcksio@mastodon.social), [LinkedIn](https://www.linkedin.com/company/microcks/), and our [YouTube channel](https://www.youtube.com/c/Microcks)!

Thanks for reading and supporting us! ❤️
