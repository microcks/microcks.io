---
title: Microcks 1.10.0 release 🚀
date: 2024-08-07
image: "images/blog/microcks-1.10.0-feature.png"
author: "Laurent Broudoux"
type: "regular"
description: "Microcks 1.10.0 release 🚀"
draft: false
---

We are excited to announce today the `1.10.0` release of Microcks, the [CNCF](https://landscape.cncf.io/?selected=microcks)'s open-source cloud-native tool for API Mocking and Testing, ready for summer ☀️ vacations! 🚀

For this release, we received help from **4 new code committers** and dozens of others who opened, contributed, and reviewed **46 issues**. Most of them are adopters! Kudos to all of them 👏 and see greetings along the notes below.

`1.10.0` release brings you a wave of new features, including **Stateful mocks support**, a **new lightweight API Examples specification format**, tons of **enhancements in the Uber and Native distributions**, and a **big refresh on installation dependencies**.

{{< image src="images/blog/microcks-1.10.0-feature.png" alt="microcks-feature" >}}

Let's review the latest updates for our key highlights without further ado.


## Welcome, stateful mocks!

Microcks has allowed specifying [dynamic mock content](https://microcks.io/documentation/explanations/dynamic-content) using expressions since the early days. Those features help translate an API's dynamic behavior and provide meaningful simulations.

But sometimes, you may need to provide even more realistic behavior, and that’s where stateful mocks may be of interest. **Stateful mocks are a game-changer in the pursuit of an  even smartest mocking experience.** You can now experience enhanced realism in your API simulations and free your creativity!

However, automatically turning mocks into stateful simulations is impossible as numerous design guidelines need to be considered. At Microcks, we put this power in the user’s hand, providing powerful primitives like `scripts`, `store`, `requestContext`, and [template expressions](https://microcks.io/documentation/references/templates) to manage persistence where it makes sense for your simulations. This feature is now available at your convenience via the `store` service that is directly usable from scripts like this:

```groovy
store.put("my-key", "Any value represented as a String");
def value = store.get("my-key");
store.delete("my-key");
```

> Check our new[ Configuring stateful mocks](https://microcks.io/documentation/guides/usage/stateful-mocks/) how-to guide, which will take you through a real use-case of managing a realistic shopping cart where customers' items are persisted during the process.


## A new API Examples specification format

While Microcks' motto is not to reinvent the wheel and reuse standard artifacts (see [artifacts reference](https://microcks.io/documentation/references/artifacts/)), we think `1.10.0` may be the right time to introduce our own specification format,  which will be fully driven by the goal of importing mock datasets into Microcks.

`APIExamples` can be seen as a lightweight, general-purpose specification that solely serves the need to provide mock datasets. The goal of this specification is to keep the Microcks adoption curve very smooth with development teams but also for non-developers. The files are simple YAML and aim to be very easy to understand and edit.

Moreover, the description is independent of the API protocol! We’re rather attached to describing examples depending on the API interaction style: Request/Response based or Event-driven/Asynchronous.

As a sample, you’ll see below the `APIExamples` snippet for our [gRPC mock tutorial](https://microcks.io/documentation/tutorials/first-grpc-mock/), but it would be rather the same when dealing with a REST API:

```yaml
apiVersion: mocks.microcks.io/v1alpha1
kind: APIExamples
metadata:
 name: org.acme.petstore.v1.PetstoreService
 version: v1
operations:
 getPets:
   All Pets:
     request:
       body: ""
     response:
       body:
         pets:
           - id: 1
             name: Zaza
           - id: 2
             name: Tigress
           - id: 3
             name: Maki
           - id: 4
             name: Toufik
 searchPets:
   k pets:
     request:
       body: |-
         { "name": "k" }
     response:
       body: |-
         {
         "pets": [
           {
             "id": 3,
             "name": "Maki"
           },
           {
             "id": 4,
             "name": "Toufik"
           }
         ]
        }
```

This format is intended to be used as a secondary artifact format. It would be a companion to our existing [APIMetada format](https://microcks.io/documentation/references/metadada/) but dedicated to API Examples.

> Be sure to read our [API Examples Format](https://microcks.io/documentation/references/examples/) reference documentation that details the different properties available and how to use this format for different types of APIs.


## Uber and Native images enhancements

Introduced in recent Microcks releases, [`microcks-uber`](https://microcks.io/blog/microcks-1.8.0-release/#welcome-uber-image) distribution and its [GraalVM native variant](https://microcks.io/blog/microcks-1.9.0-release/#reduced-bootstrap-time-with-graalvm) are perfectly well-adapted for a quick evaluation or for an ephemeral usage via libraries like [Testcontainers](https://testcontainers.com/). However, they were still a bit behind the regular distribution in terms of features covered.

Starting with `1.10.0`, we reduced this feature gap a lot by making:

* [MQTT](https://mqtt.org/) and [RabbitMQ/AMQP](https://www.rabbitmq.com/) protocols available to the Uber distribution,
* [gRPC](https://grpc.io/) features and full templating features work into the Native-variant of this Uber distribution.

The long-term goal we’re pursuing and are close to achieving is full feature parity between the regular/uber/uber-native distributions—except for some structural ones that would be impossible to port. Typically, the Groovy `SCRIPT` feature will never be available in native mode as dynamic evaluation is, by definition, antagonistic to static compilation.

> If you want to learn more about feature gap reduction and associated changesets, please refer to [#1239](https://github.com/microcks/microcks/issues/1239) for MQTT support, [#1240](https://github.com/microcks/microcks/issues/1240) for RabbitMQ support, [#1227](https://github.com/microcks/microcks/issues/1227) for gRPC testing features support, and [#1226](https://github.com/microcks/microcks/issues/1226) for templating features support.


## Dependencies and installation upgrade

While considering upgrading to `1.10.0`, you should also plan your update carefully depending on your setup. We’ve made significant updates on external container dependencies like MongoDB, Keycloak, and theirits associated Postgres database.

These are noticeable changes you should take care of: 

* The `centos/mongodb-36-centos7` that was no longer maintained for 3 years has been replaced by the `library/mongo:4.4.29` that Is 3 months old and still updated,
* The `quay.io/keycloak/keycloak:22.0.3` has reported CVEs and has been replaced by the fresher `quay.io/keycloak/keycloak:24.0.4`,
* The `centos/postgresql-95-centos7:latest` has not been updated in 5 years and has been replaced by a fresher `library/postgres:16.3-alpine` updated 12 days ago.

Unfortunately, updating MongoDB and Postgres engines cannot be done without breaking things. That’s why **we recommend not rolling in-place upgrades of existing installations but rather proceeding with care**: exporting and backing up your data from MongoDB and Postgres before importing it again in new instances. This can be done with low-level tools (like [mongodump](https://www.mongodb.com/docs/database-tools/mongodump/) and [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html)) or at an application level (using [Microcks snapshots ](https://microcks.io/documentation/guides/administration/snapshots/)or [Keycloak realm exports](https://www.keycloak.org/server/importExport#_exporting_a_realm_to_a_file)).

> ⚠️ _Warning_
>
> Be cautious that the dependencies Microcks proposes during installation are provided for commodity purposes only. Our take is that _you shouldn't rely on them for crucial "production" workloads but rather use an external component_. You can override the default image OR completely disable the installation of external dependencies in our Helm Chart or Operator.

In addition to these upgrades, we also changed the way you can customize the images and external dependencies artifacts in our Helm Chart. Where we previously had a single `image` field for each component (the main one, postman, keycloak, mongo, etc…), we have split these single fields into multiple properties `registry`, `repository`, `tag` or `digest` like illustrated below:

```yaml
image:
  registry: quay.io
  repository: microcks/microcks
  tag: nightly
  digest:
```

This change brings the benefits of:

* Being aligned with community best practices regarding image customization - other communities like [OpenTelemetry](https://github.com/open-telemetry/opentelemetry-helm-charts/blob/main/charts/opentelemetry-collector/values.yaml#L165-L172$), [Strimzi](https://github.com/strimzi/strimzi-kafka-operator/blob/main/helm-charts/helm3/strimzi-kafka-operator/values.yaml#L15-L19) or [Jaeger](https://github.com/jaegertracing/helm-charts/blob/main/charts/jaeger/values.yaml#L25-L31) are following the same conventions,
* Allowing easier customization for people using a corporate registry as a cache or wanting to pin the artifact coordinates to an immutable digest.

> Thanks to [Romain Quinio](https://github.com/rquinio1A) 🙏 from [Amadeus IT Group](https://github.com/AmadeusITGroup) for bringing this enhancement suggestion to the discussion! You can check the original [#1211](https://github.com/microcks/microcks/issues/1211) issue.


## Community amplification

The Microcks community continues to grow and make waves in the tech world! Here are some of our latest highlights:

###### 🎤 Talk from [Hugo Guerrero](https://www.linkedin.com/in/hugoguerrero/) at [Riviera DEV](https://rivieradev.fr/) 2024

We are thrilled to share that Hugo ([Red Hat](https://www.redhat.com/)) presented an outstanding talk at Riviera DEV 2024! His session featured a great demo showcasing Microcks' [shift-left approach](https://www.linkedin.com/pulse/how-microcks-fit-unify-inner-outer-loops-cloud-native-kheddache/) using [Quarkus](https://quarkus.io/extensions/io.github.microcks.quarkus/quarkus-microcks/) and [Testcontainers](https://testcontainers.com/modules/microcks/). Check out his [LinkedIn post](https://www.linkedin.com/posts/hugoguerrero_rivieradev-rivieradev-quarkusworldtour-activity-7218572716658888704-6mVO) for more details.

######  📝 Microcks Mentioned as an Alternative to WireMock

Microcks has been highlighted in [Speedscale](https://speedscale.com/)'s blog post as a top alternative to WireMock. We're proud to be recognized among the top 5 WireMock alternatives: 

[https://speedscale.com/blog/wiremock-alternatives/](https://speedscale.com/blog/wiremock-alternatives/)

######  🌐 Microcks Joins the [CAMARA Project](https://camaraproject.org/)

Microcks, a Cloud Native Computing Foundation ([CNCF](https://landscape.cncf.io/?selected=microcks)) Sandbox project, is now officially listed as a member of the CAMARA Project, an initiative by [The Linux Foundation](https://www.linuxfoundation.org/press/linux-foundation-telco-api-project-camara-graduates-to-funded-model-with-strong-industry-commitment)! 🎉

[https://camara.landscape2.io/](https://camara.landscape2.io/)

######  🚀 Member of CNCF [App Development Working Group](https://tag-app-delivery.cncf.io/wgs/app-development/charter/charter.md/)

As a CNCF project, Microcks is proud to join the App Development Working Group within the CNCF TAG App Delivery. This initiative aims to bridge the gap between developers and CNCF projects that directly impact daily workflows 🙌

[https://www.cncf.io/blog/2024/07/05/a-new-app-development-wg-has-now-been-launched/](https://www.cncf.io/blog/2024/07/05/a-new-app-development-wg-has-now-been-launched/)

######  📢 Shoutout to [Java Dominicano Community](https://jconfdominicana.org/)

A massive thank you to the Java Dominicano community and a special shoutout to [Eudris Cabrera ](https://eudriscabrera.com/)for his outstanding [talk and demo](https://www.youtube.com/live/hYMYPqSuPh4?si=CHZugCtEDPyWmMKI&t=19) on Microcks! 🌟

######  🎉 Microcks Hits [2000+ Followers](https://www.linkedin.com/feed/update/urn:li:share:7213576968112349184/) on LinkedIn!

We are excited to announce that we have reached over 2000 followers on LinkedIn! Join us to stay updated on the latest news and updates about Microcks. [Follow Us](https://www.linkedin.com/company/microcks/) on LinkedIn.

> Stay tuned for more updates, and continue to be a part of our journey as we grow and innovate together!


## What’s coming next?

As usual, we will eagerly prioritize items according to community feedback. You can check and collaborate via our list of [issues on GitHub](https://github.com/microcks/microcks/issues) and the project [roadmap](https://github.com/orgs/microcks/projects/1).

More than ever, we want to involve community members in design discussions and start some discussion about significant additions regarding [OpenAPI callbacks, webhooks and AsyncAPI](https://github.com/orgs/microcks/discussions/1039) in Microcks. Please join us to shape the future!

Remember that we are an open community, which means you, too, can jump on board to make Microcks even greater! Come and say hi! on our [GitHub discussion](https://github.com/microcks/microcks/discussions) or [Discord chat](https://microcks.io/discord-invite/) 👻, send some love through [GitHub stars](https://github.com/microcks/microcks) ⭐️ or follow us on [Twitter](https://twitter.com/microcksio), [Mastodon](https://hachyderm.io/@microcksio@mastodon.social), [LinkedIn](https://www.linkedin.com/company/microcks/), and our [YouTube channel](https://www.youtube.com/c/Microcks)!

Thanks for reading and supporting us! ❤️

