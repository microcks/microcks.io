---
title: Microcks 1.16.0 release 🚀
slug: microcks-1.16.0-release
date: '2026-11-17'
draft: false
image: /images/blog/microcks-1.16.0-feature.jpg
authors:
  - laurent-broudoux
description: Microcks 1.16.0 connects more API workflows with OpenCollection, IBM MQ, Google Pub/Sub request/reply, better Avro support, and faster Java 25 container startup.
---

We are excited to announce the `1.16.0` release of Microcks, the [CNCF](https://landscape.cncf.io/?selected=microcks)'s open-source cloud-native tool for API Mocking and Testing! 🚀

Your API landscape rarely fits into a single tool or messaging platform. A collection created in Bruno, an enterprise application using IBM MQ, and a cloud service exchanging messages over Google Pub/Sub can all be part of the same business flow. Testing these systems means connecting those worlds without making your development environment harder to run.

That's the common thread of Microcks `1.16.0`: **more connections, less waiting!** This release opens new routes into your API simulation environment while making Microcks itself faster to start. To illustrate these new connections and faster starts, we chose a bridge carrying trails of light into the sunrise:

![Light trails crossing a bridge at sunrise in Sweden](/images/blog/microcks-1.16.0-feature.jpg)

Here are the highlights:

- **OpenCollection support** brings a new source of API mocks, especially for teams using Bruno.
- **Docker Hardened Images and Java 25 AOT caching** give our JVM-based containers a new foundation and faster startup.
- **IBM MQ support** extends AsyncAPI mocking and testing to another enterprise messaging platform.
- **Google Pub/Sub request/reply** lets you simulate asynchronous conversations, not just independent events.
- **Improved Avro handling and Avro binary publishing over NATS** make event-based mocks and contract tests more reliable.

Let's take a closer look! 

## OpenCollection: bring your Bruno examples to Microcks

API collections are a natural place to capture the requests and responses your team uses every day. With this release, **Microcks supports [OpenCollection](https://www.opencollection.com/) as a new import format for mocks**. This open, YAML-based format pioneered by [Bruno](https://www.usebruno.com/) opens the door to reusing your API client examples in a shared simulation environment.

Instead of maintaining a separate set of mock examples, you can reuse examples from an [OpenCollection](https://www.opencollection.com/) document in Microcks. The import also computes dispatching criteria so that those examples can be selected and served by the mocking engine. Your collection becomes useful beyond your API client: teammates and automated tests can consume the resulting mock endpoints.

This continues a core Microcks principle: **reuse the API artifacts you already maintain**, rather than rewrite them for a dedicated mocking tool.

> Thanks to [SebastienDegodez](https://github.com/SebastienDegodez) 🙏 for the OpenCollection contributions! See the [example import work](https://github.com/microcks/microcks/pull/2401) and the [dispatching enhancement](https://github.com/microcks/microcks/issues/2411) for implementation details.

## A hardened foundation, ready to start faster

Short-lived development environments and CI jobs shouldn't spend unnecessary time waiting for their mocking infrastructure. Microcks `1.16.0` updates the default JVM-based webapp and *uber* container images with **Docker Hardened Images, Java 25, and a Project Leyden AOT cache**.

The new runtime is based on a **distroless Docker Hardened Image**: it runs as a non-root user and has no shell. Alongside this smaller runtime surface, the image build now includes a training step that prepares a JVM ahead-of-time cache. Java reuses that cache at startup, reducing the work needed to load and link application classes.

**This is a JVM optimization, not a native executable.** It brings faster startup to the JVM-based distributions while retaining their Java runtime and support for custom libraries.

Early measurements reported in the [DHI implementation issue](https://github.com/microcks/microcks/issues/2341), with 1 CPU and 512 MB of memory, showed startup times of around **2.2 seconds for the webapp and 2.6 seconds for the uber distribution**. These are measurements from that setup, not a performance guarantee for every deployment.

> **Upgrading customized deployments?** The new images no longer include `run-java.sh`, so its `JAVA_OPTIONS` mechanism is gone. Review your JVM settings and use `JAVA_TOOL_OPTIONS` or `JDK_JAVA_OPTIONS` as appropriate. Custom probes or scripts that rely on a shell or `curl` inside the container also need updating. See [the DHI migration details](https://github.com/microcks/microcks/issues/2341) and [the Leyden AOT cache work](https://github.com/microcks/microcks/issues/2340).

## IBM MQ joins the AsyncAPI bindings

Modernizing an application doesn't mean leaving its existing messaging infrastructure behind. **[IBM MQ](https://www.ibm.com/products/mq) is now supported as an AsyncAPI binding in Microcks**, bringing API simulation and contract testing to teams working with this enterprise messaging platform.

This release adds both **mocking and testing support**, including queue and topic scenarios. You can describe your messages with [AsyncAPI](https://asyncapi.com), use Microcks to simulate producers, and check messages from your implementation against the contract. The integration also includes UI support and Helm configuration for deployment.

For teams connecting established enterprise systems to newer services, this means one more part of the architecture can join the same contract-driven testing workflow.

> Thanks to [alokkumardalei-wq](https://github.com/alokkumardalei-wq) 🙏 for the IBM MQ contributions! Explore the work on [mocking](https://github.com/microcks/microcks/pull/2217), [contract testing](https://github.com/microcks/microcks/pull/2216), and [Helm setup](https://github.com/microcks/microcks/pull/2211).

## Google Pub/Sub: from events to conversations

Not every asynchronous interaction is fire-and-forget. Sometimes a service publishes a request and expects an answer on another channel, with enough context to connect the two messages.

Microcks `1.16.0` extends its [AsyncAPI request/reply](https://www.asyncapi.com/docs/tutorials/getting-started/request-reply) mocking capabilities to **Google Pub/Sub**. You can now simulate a responding service over Pub/Sub, allowing consumers to exercise a request/reply flow without waiting for the real service to be available.

This builds on the request/reply capabilities introduced in previous releases and brings them to another messaging ecosystem. It's especially useful when your integration tests need a conversation with a dependency rather than a periodic stream of sample events.

> Follow [the Google Pub/Sub request/reply implementation](https://github.com/microcks/microcks/issues/2337) for details.

## Avro: more reliable contracts and binary mocks

### Better schema parsing, serialization, and validation feedback

Binary message formats need careful handling: a schema parsing problem or an invalid payload should produce useful feedback, not leave you wondering whether your broker is reachable.

This release improves **[Avro](https://avro.apache.org/) schema parsing for AsyncAPI 3.0 Multi Format Schema Objects**, including inline schemas and external schema references. It also improves union handling during serialization and decoding, and the reporting of parsing and validation errors. These changes address cases where Avro errors could interrupt a test before its result was reported.

The result is more reliable [Avro](https://avro.apache.org/) mocking and contract testing, with better feedback when a schema or message needs attention.

> See [the Avro issue and resolution](https://github.com/microcks/microcks/issues/2320). Thanks to [drazen-nikolic](https://github.com/drazen-nikolic) 🙏 for the detailed reproducer and investigation!

### Avro binary publishing over NATS

**The [NATS](https://nats.io/) binding now publishes Avro-encoded mock messages** when an Avro binary content type is declared. Previously, those examples were published as JSON text, which Avro consumers could not decode as expected.

Together with the schema handling improvements, this lets you use AsyncAPI 3.0 contracts with Avro payloads over [NATS](https://nats.io/) for both mock publishing and message validation.

> **Encoding note:** NATS publishes raw Avro binary, without a schema registry envelope. Non-Avro content types are unchanged. Thanks to [drazen-nikolic] 🙏(https://github.com/drazen-nikolic) for [contributing this enhancement](https://github.com/microcks/microcks/pull/2325) and testing it against a real broker!

## Other improvements

There are more enhancements beyond these highlights, including:

- [Google Pub/Sub Workload Identity authentication through Application Default Credentials](https://github.com/microcks/microcks/pull/2204).
- [TLS support for the Microcks HTTP endpoint](https://github.com/microcks/microcks/pull/2038).
- [External reference support in the OpenAPI-to-MCP tool converter](https://github.com/microcks/microcks/pull/2214).
- [Better UI feedback when a test fails early](https://github.com/microcks/microcks/pull/2209).

For the detailed list of changes used to prepare this announcement, check the [1.16.0-rc1 release notes](https://github.com/microcks/microcks/releases/tag/1.16.0-rc1) and the [1.16.0 milestone](https://github.com/microcks/microcks/milestone/59?closed=1).

## What's coming next?

More connections, less waiting: we look forward to seeing what you build with these new formats, bindings, and runtime improvements. Tell us how they work in your environment, especially as you adopt the new container images or bring IBM MQ and Avro-based flows into your tests.

Thank you to all the contributors and adopters who helped shape this release through code, bug reports, reproductions, and feedback!

We will continue to prioritize improvements with the community. Join our [GitHub discussions](https://github.com/microcks/microcks/discussions), explore the [issues](https://github.com/microcks/microcks/issues) and [roadmap](https://github.com/orgs/microcks/projects/1), or come say hi on [Discord](https://microcks.io/discord-invite/).

Send some love through [GitHub stars](https://github.com/microcks/microcks), and follow us on [Bluesky](https://bsky.app/profile/microcks.io), [LinkedIn](https://www.linkedin.com/company/microcks/), and [YouTube](https://www.youtube.com/c/Microcks) for more examples and demonstrations.

Thanks for reading and supporting us! ❤️