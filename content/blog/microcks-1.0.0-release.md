---
title: Microcks 1.0.0 release 🚀
date: 2020-08-11
image: "images/blog/microcks-1.0.0-loves-asyncapi.png"
author: "Laurent Broudoux"
type: "regular"
description: "Microcks 1.0.0 release 🚀"
draft: false
---

Today is a very special day as we launch Microcks 1.0.0 and as it materializes a vision we had 18 months ago when starting investing more time on what was just a fun side-project at that time. That vision was about building one simple, scalable and consolidating tool for all the Enterprise services mocking and testing needs — whatever the type of services or API: green-field or legacy.
Today, Microcks is the only Open source Kubernetes native tool for API Mocking and Testing supporting REST APIs, SOAP WebServices and now asynchronous / event-driven APIs!

{{< image src="images/blog/microcks-1.0.0-loves-asyncapi.png" alt="image" zoomable="true" >}}

This new 1.0.0 release is the first Microcks General Availability (GA) version to fully manage event-driven API through the support of AsyncAPI specification. This is a major step forward as we are convinced that the transition to cloud-native applications will strongly embrace event-based and reactive architecture. Thus the need to speed-up and govern event-based API like any other services mocking using Microcks will be crucial and a key success factor for any modern and agile software developments.

So thanks to the [AsyncAPI](https://www.asyncapi.com) and Microcks communities feedbacks, we unleashed this new release that really demonstrates the flexibility of Microcks:

* It can be installed on-premise or on your favorite cloud provider,
* It is extremely scalable and efficient to support a huge amount of business-critical API definitions as we seen in medium to very large organisations (hyperscalers are welcome),
* It is lightweight and fully automated to manage local and ephemeral use-cases in order to cover complex environment simulation or performance testing,
* It helps teams communicate by publishing their intents while gathering rapid feedback using API designs: which make Microcks the perfect tool for designers, providers and consumers to easily iterate whether you are already using microservice, serverless or not.

With this release we mainly focused on event-driven capabilities and finalizing the security enhancements we started on `0.0.9`. Let’s do a review on what’s new.

## AsyncAPI support

[AsyncAPI](https://www.asyncapi.com) is an Open source initiative that seeks to improve the current state of Event-Driven Architectures (EDA). Its long-term goal is to make working with EDA’s as easy as it is to work with REST APIs. That goes from documentation to code generation, from discovery to event management. Most of the processes you apply to your REST APIs nowadays would be applicable to your event-driven/asynchronous APIs too. So it clearly makes sense for Microcks to support AsyncAPI too, isn’t it 😀!

> Starting with version `1.0.0`, Microcks is now able to import AsyncAPI definitions for enriching the API catalogs with `Event` typed APIs.

{{< image src="images/blog/microcks-1.0.0-release-asyncapi.png" alt="image" zoomable="true" >}}

AsyncAPI defines multiple protocol bindings to details protocol specific issues. In this `1.0.0`, we have decided to focus on the `KAFKA` binding. Microcks installation procedure now offers to deploy a dedicated [Apache Kafka](https://kafka.apache.org/) broker as part of your setup or to reuse an already existing broker.

> Mocking events on Kafka with Microcks is now super easy! When set up accordingly, it is also able to mock the API by publishing sample messages on a dedicated topic. See this video below for a full demonstration.

{{< youtube id="uZaWAekvUz4" autoplay="false" >}}


## Security enhancements

Since a few releases Microcks is already following the “TLS everywhere” principles but as security really matters : it was time to update some obsolete dependencies… We have focused here on three main topics: components updates, [Keycloak](https://keycloak.org/) infrastructure reuse and container images vulnerabilities.

Microcks internal components have all received major updates to remove any discovered threats and vulnerabilities.

* Frontend part was bumped from Angular `6.1` to Angular `8.1` with all dependencies upgraded,
* Backend part was bumped from Spring Boot `1.5.17` to Spring Boot `2.2.5` with all dependencies upgraded,
* Keycloak server was bumped from `4.8.3` to `10.0.1`.

Many users from the community also asked for enhancements when reusing an existing Keycloak infrastructure. They were accustomed users of Keycloak, have some complex setup on their realm and want to add Microcks support with no collisions with their existing configuration. So we review our configuration and setup options to be able to integrate with no impact into a Keycloak infrastructure.

> More details here: https://github.com/microcks/microcks/issues/237

Finally, we did move our container images repositories from [Docker Hub](https://hub.docker.com/orgs/microcks) to [Quay.io](https://quay.io/) infrastructure. The major reason for moving to Quay.io is their excellent, built-in security vulnerabilities scan for container images. Now, for each and every commit into the Microcks repository, newly produced container images are scanned and trigger a notification if a vulnerability is found.

{{< image src="images/blog/microcks-1.0.0-release-quay.png" alt="image" zoomable="true" >}}

All the latest images from Microcks now have an “All green” scan report ;-)

> You can now find all the Microcks container images and their security scan reports from the same location: https://quay.io/organization/microcks. Check [here](https://quay.io/repository/microcks/microcks?tab=tags) the status of latests images.

## What’s coming next?

As you read this post, you have seen that there’s some huge new features in this `1.0.0` release, in just four months since the previous one. Sure we did not include all what we had in mind but did put the efforts on the topics that matter the most based on community feedback: kudos to all our users, contributors and friends (special thanks to the [AsyncAPI team](https://twitter.com/AsyncAPISpec/status/1265176378456059904) for listing us in their [tooling ecosystem](https://asyncapi.com/tools))

We still have a lot to accomplish but cannot do it without your support and ideas: tell us the enhancements or new features you are dreaming about using [GitHub](https://github.com/microcks/microcks/issues) issues.

We are open and you can help make Microcks an even greater tool!
Please spread the word, send us some love through [GitHub](https://github.com/microcks/microcks) stars, follow us on [Twitter](https://twitter.com/microcksio), send us [Gitter](https://gitter.im/microcks/microcks) messages or — even better — blog posts or tweets and tell us how you use Microcks.
