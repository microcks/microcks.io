---
title: Microcks 1.7.1 release 🚀
date: 2023-06-21
image: "images/blog/microcks-1.7.1-feature.png"
author: "Laurent Broudoux"
type: "regular"
description: "Microcks 1.7.1 release 🚀"
draft: false
---

The seasons follow one another and here’s a Microcks release just ready for summer ☀️. We’re proud to announce today the `1.7.1` release of Microcks - the Open source Kubernetes-native tool for API Mocking and Testing.

With 37 resolved issues - our record for a minor release - this release is an illustration of how community-driven the roadmap is: **Amazon SQS & SNS** support and **Specifications goodies** as well as **many** **enhancements** came directly from user requests and contributions. Kudos to all of them 👏 and see greetings along the notes below.

{{< image src="images/blog/microcks-1.7.1-feature.png" alt="image" zoomable="true" >}}

Let’s do a review of what’s new on each one of our highlights without delay.


## AWS Messaging protocols support cooked for you!

This new `1.7.1` release brings support for two popular messaging protocols of the Amazon Web Services stack: SQS and SNS. These protocols are more and more used in combination for supporting various use-cases such as microservices communication, mobile notification or Edge/IoT (Internet of Things) communication backbone.

[Amazon Simple Queue Service](https://aws.amazon.com/sqs/) (SQS) lets you send, store, and receive messages between software components. As stated by the name, it is a message queuing service where one message from a queue can only be consumed by one component. [Amazon Simple Notification Service](https://aws.amazon.com/sns/) (SNS) sends notifications two ways and provides high-throughput, push-based, many-to-many messaging between distributed systems, microservices, and event-driven serverless applications.

As with the other protocols, we integrate with [AsyncAPI Bindings](https://github.com/asyncapi/bindings/tree/master/amqp) directives that you include into your AsyncAPI document to seamlessly add the SQS or SNS support for your API: 

```yaml
bindings:
  sqs:
    queue:
      name: my-sqs-queue
  sns:
    topic:
      name: my-sns-topic
```

And of course, you’re not limited to a single protocol binding! Microcks now supports eight different protocols for [AsyncAPI](https://www.asyncapi.com/) - enabling you to reuse the same API definition on different protocols depending if you’re using messaging in the organization or at the edge for example. 

{{< image src="images/blog/microcks-1.7.1-protocols.png" alt="image" zoomable="true" >}}

> Check out our updated [Event-based API test endpoints](https://microcks.io/documentation/references/test-endpoints/#event-based-apis) documentation and the complete guide for both protocols has also been published. See the [Amazon SQS/SNS Guide](https://microcks.io/documentation/guides/usage/async-protocols/aws-sqs-sns-support/). For easier testing purposes, we also enabled the support of [LocalStack](https://localstack.cloud/). Thanks to [Xavier Escudero Sabadell](http://github.com/xescuder) 🙏 for the help in designing and testing this.


## API Specs goodies

Multi-protocol and multi-styles of API is a reality and we see it every day in the community. This new revision is also the opportunity to embed enhancements related to three different specifications we support in Microcks.

Microcks now supports the resolution of external references on [AsyncAPI specification](https://www.asyncapi.com/) documents. May you embed a reference like ``$ref: "./user-signedup.json"`` into your AsyncAPI file, Microcks will follow the reference, retrieve it to add this JSON Schema to the list of your API contracts and re-reference it to be later able to use it at validation time.

> The actual behavior has been detailed in issue [#782](https://github.com/microcks/microcks/issues/782)

[GraphQL](https://graphql.org/) support has also been enhanced with now the support of multi-queries on different API operations. Supporting such construction allows - for example - a mobile application to perform multiple different queries in a single server roundtrip.

> Thanks to [Stéffano Bonaiva Batista](https://github.com/sbonaiva) 🙏 who shared with us his use case but also the [Pull Request](https://github.com/microcks/microcks/pull/805) for implementing this in Microcks. You rock!

Finally, [gRPC](https://grpc.io/) protocol is not left out as we added automatic import of internal ``google/protobuf/*.proto`` libraries when not provided in your code repository. This eases the pain of repository maintainers by lowering the number of dependencies in their repo. As these libs are provided within ``protoc`` compiler, it’s safe to assume they’ll be there during the compilation of their protobuffer resources by Microcks.

> Thanks to [lennakai](https://github.com/lennakai) 🙏 for raising the issue and for the discussion [#830](https://github.com/orgs/microcks/discussions/830) that leads to a solution


## Deployment enhancements

### Podman & Docker compose

As the [Podman](https://podman.io) project releases its [first Generally Available version of Podman Desktop](https://developers.redhat.com/articles/2023/05/23/podman-desktop-now-generally-available), we found the timing was right to tidy some things up and update the experience using Podman for Microcks. Thanks also to our [previous release of ARM 64](https://microcks.io/blog/microcks-1.7.0-release/#technical-upgrades) container images, we drastically simplified the usage of both Podman-compose and Docker-compose by removing redundant resources and unifying them for the three main operating systems. 

> Microcks `1.7.1` has been run successfully with latest versions of Podman-compose and now using a simple `./run-microcks.sh`. The experience is now the same whatever your OS.


### Docker Desktop Extension

You may have seen it some days ago as announced by our fellow [Hugo Guerrero](https://www.linkedin.com/in/hugoguerrero/): [Docker Desktop Extension `0.2`is out](https://microcks.io/blog/docker-desktop-extension-0.2/)!

{{< image src="images/blog/docker-desktop-extension-0.2-list.png" alt="image" zoomable="true" >}}

> The extension improves the [Microcks](https://microcks.io/) experience by offering a user-friendly interface, quick access to API mock URLs, and optional integration with popular tools such as Postman. [Grab it](https://hub.docker.com/extensions/microcks/microcks-docker-desktop-extension) while it’s hot! 🔥 It will be updated really soon to `1.7.1`.


### Helm Chart enhancements

The Kubernetes installation via Helm Chart has also benefited from two enhancements: the number of desired replicas is now configurable via the `values.yaml` file and re-deployments are automatically triggered when a configuration change occurs.

> As scalability and automatic redeployment was only available through the Operator, these two enhancements suggested by [Sara Jarjoura](https://github.com/sarasensible) 🙏 and [sbr82](https://github.com/sbr82) 🙏 now allow to have a very scalable and dynamic setup of Microcks via Helm for better GitOps implementation.


## More enhancements 

Some other minor enhancements that are worth be noticed:

### JSON_BODY dispatcher presence

A fix has been made to allow a dispatch decision based on the presence or absence of a JSON node in the request payload (not only the presence of a value as it was before).

> Thanks to [Chris Belanger](https://github.com/Feasoron) 🙏 for raising this issue and for the detailed analysis.


### OpenAPI specification detection

We reviewed how OpenAPI is detected when importing a new artifact, leading to a more robust detection pattern that should cover more cases (especially JSON containing spaces, simple quotes, double quotes, etc..)

> Thanks to [Mathis Goichon](https://github.com/MathisGoichon) 🙏 for raising this one and helping validate the fix. 


### Response templating with a parameter containing a dot

This is again an issue that leads to more robust behavior of [Microcks templating engine](https://microcks.io/documentation/references/templates/) when sending parameters that may contain dots or other non-alphanumeric characters.

> Thanks again to [Mathis Goichon](https://github.com/MathisGoichon) 🙏 for raising this one and helping validate the fix. 


## Community amplification

Community contributions are essential to us and do not come only from feature requests, bug issues, and open discussions. What a pleasure to see people relaying our messages, integrating Microcks in a demonstration, inviting us to events, or even talking about Microcks!

We’d like to thank the following awesome people:

* [Nurettin Mert Aydın](https://mert.codes/) 🙏 for its awesome [Your Local Zero Day Collocutor: Contract Based gRPC Mocking with Microcks](https://mert.codes/your-loyal-zero-day-collocutor-contract-based-grpc-mocking-with-microcks-ec614977070e) blog post. Awesome content!

* Great blog post from [Piotr Mińkowski](https://www.linkedin.com/in/piotrminkowski/) 🙏 on API contract testing with Microcks & Quarkusio. See: [Contract Testing on Kubernetes with Microcks](https://piotrminkowski.com/2023/05/20/contract-testing-on-kubernetes-with-microcks/),

* [Holly Cummins](https://www.linkedin.com/in/holly-k-cummins/) 🙏 for her excellent talk on [Contract testing with Pact and Quarkus](https://speakerdeck.com/hollycummins/contract-testing-with-pact-and-quarkus), mentioning Microcks in the [contract testing landscape](https://speakerdeck.com/hollycummins/contract-testing-with-pact-and-quarkus?slide=86),

* [Hugo Guerrero](https://github.com/hguerrero ) 🙏 from [Red Hat](https://redhat.com) for having contributed the [Docker Desktop Extension v0.2](https://microcks.io/blog/docker-desktop-extension-0.2/) code and blog post. Well done mate! 💪


## What’s coming next?

As usual, we will be eager to prioritize items according to community feedback: you can check and collaborate via our list of [issues on GitHub](https://github.com/microcks/microcks/issues) and the project [roadmap](https://github.com/orgs/microcks/projects/1)

Remember that we are an open community, and it means that you too can jump on board to make Microcks even greater! Come and say hi! on our [Github discussion](https://github.com/microcks/microcks/discussions) or [Discord chat](https://microcks.io/discord-invite/) 🐙, simply send some love through [GitHub stars](https://github.com/microcks/microcks) ⭐️ or follow us on [Twitter](https://twitter.com/microcksio), [Mastodon](https://hachyderm.io/@microcksio@mastodon.social), [LinkedIn](https://www.linkedin.com/company/microcks/) and our [YouTube channel](https://www.youtube.com/c/Microcks)!

Thanks for reading and supporting us! ❤️
