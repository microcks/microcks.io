---
title: Microcks 1.5.1 release 🚀
date: 2022-04-08
image: "images/blog/microcks-1.5.1-feature.png"
author: "Laurent Broudoux"
type: "regular"
description: "Microcks 1.5.1 release 🚀"
draft: false
---

We are proud to announce the `1.5.1` release of Microcks - the Open source Kubernetes-native tool for API Mocking and Testing. We considered it a minor release this time as it “just” brought a new protocol binding and a lot of enhancements!

Once again this release is an illustration of how community-driven the roadmap is: **AMQP** and **Swagger v2** support as well as **more** **enhancements** came directly from user requests. So thanks a lot to those who helped push up a new release with significant features once again. Kudos to all of them 👏 and see greetings below.

{{< image src="images/blog/microcks-1.5.1-feature.png" alt="image" zoomable="true" >}}

> As we’re also entering the Easter season, we couldn’t resist insisting the rabbit side of things 😉

Let’s do a review of what’s new on each one of our highlights without delay.

## AMQP/RabbitMQ, you asked for it: here it is!

With tens of thousands of users, [RabbitMQ](https://www.rabbitmq.com/) 🐇 is one of the most popular open source message brokers. It uses AMQP - the Advanced Message Queuing Protocol - in version 0.9 (not to be confused with [AMQP 1.0 protocol that is quite different](https://www.rabbitmq.com/specification.html)).

At Microcks, we identified the importance of RabbitMQ as it appears in high priorities in previous community polls and is one choice technology in [NodeJS](https://levelup.gitconnected.com/introduction-to-rabbitmq-with-nodejs-61e2aec0c52c) or [Java Spring communities](https://spring.io/guides/gs/messaging-rabbitmq/) ☕

As usual, we integrate with [AsyncAPI Bindings](https://github.com/asyncapi/bindings/tree/master/amqp) directives that you include into your AsyncAPI document to seamlessly add the RabbitMQ support for your API: 

```yaml
bindings:
  amqp:
    is: routingKey
    type: topic
    durable: true
    autoDelete: false
    vhost: /
```

Of course we support queues and all the different types of exchanges for both mocking and testing.

> Whereas mocking just requires adding the binding, testing needs to be familiar with new RabbitMQ/AMQP endpoints syntax. Check out our updated [Event-based API test endpoints](/documentation/references/test-endpoints/#event-based-apis) documentation for that. Complete guide to come soon!

## Swagger v2, you asked for it: here it is too!

From the origin, we didn’t support Swagger (aka OpenAPI v2) standard in Microcks as Swagger was incomplete and does not allow specifying full examples and request/response mapping. Especially:

* Parameter does not allow specification of examples,
* Request does not allow specification of examples,
* Response examples cannot be named and are unique for a mime type.

So from the start we supported OpenAPI v3 that does not have these limitations. And that was a nice fit for us as Microcks followed the _1 artifact == 1 API mock definition_ principle.

However we did get feedback from the community and now are convinced that this approach can be too restrictive sometimes. A use-case that is emerging is that some people may have a single OpenAPI file containing only base/simple examples but are managing complementary/advanced examples using a Postman Collection. As a consequence, we implemented the [Multi-artifacts support](/documentation/explanations/multi-artifacts/) in release `1.3.0`.

The thing we didn't think about at that time is that [Multi-artifacts support](/documentation/explanations/multi-artifacts/) could also be leveraged to finally support Swagger v2 in Microcks! Allowing you to reuse your Swagger v2 contracts and related Postman Collection have direct mocking and contract-testing within Microcks. 💥

In a similar fashion to [gRPC support](/documentation/references/artifacts/grpc-conventions/) or [GraphQL support](/documentation/references/artifacts/graphql-conventions/) in Microcks you’ll first need a Swagger v2 file that will be considered as the primary artifact holding service and operation definitions and rely on a [Postman Collection](https://www.postman.com/collection/) that holds your mock dataset as examples:

{{< image src="images/blog/microcks-1.5.1-swagger.png" alt="image" zoomable="true" >}}

> Check out our [Swagger conventions for Microcks](/documentation/references/artifacts/swagger-conventions/) documentation that illustrates how Swagger v2 specification and Postman Collection can be combined and used together.

## More enhancements

### Consistent behavior for Subscribe and Publish in AsyncAPI

At the beginning of Microcks, we started supporting the `SUBSCRIBE` operations of AsyncAPI only - with Kafka binding. This because it was the most obvious thing to understand : walking in the shoes of an AsyncAPI consumer. However with more maturity and new implementations (MQTT, WebSocket) we started implementing stuff for `PUBLISH` operations as well, but this was not backported to Kafka and not very consistent regarding the UI.

We fixed this and got this little drawing below to summarize use-cases:

{{< image src="images/blog/microcks-1.5.1-asyncapi.png" alt="image" zoomable="true" >}}

> We now made everything consistent whatever the protocol you’re using. Mocking can be used by API consumers for `SUBSCRIBE` as well as providers for `PUBLISH`. Testing can be used to validate API providers for `SUBSCRIBE` as well as consumers for `PUBLISH`. Thanks to [Hassen Bennour](https://github.com/Hassen-BENNOUR) 🙏 and tom (Zulip user) 🙏 for testing it 🧪

### Resolution of OpenAPI external dependencies

For unknown reasons, the resolution mechanism that was used on import time for AsyncAPI spec files was not available on OpenAPI support yet. However, referencing JSON Schema files from OpenAPI files is now a very common practice. We fixed this.

> It means that Microcks `1.5.1` will now be able to resolve your local dependencies (like in `$ref: ../my-schema.json#MyRequest`) as well as external ones (like in `$ref: [https://acme.org/schemas//my-schema.json#MyRequest](https://acme.org/schemas//my-schema.json#MyRequest)`). Thanks to Hans Peter (Zulip user) 🙏 and [redben](https://github.com/redben) 🙏 for suggesting enhancement 😉


### Custom certificates on OpenShift

When using the [Kubernetes Operator](/documentation/references/configuration/operator-config/) to deploy on [OpenShift](https://openshift.com), `Routes` are created to allow external access to the different Microcks services. Before the `1.5.1` release of Microcks Operator, routes were created with default settings regarding TLS so they have to reuse the default configuration for the cluster ingress controller.  

> Thanks to Arjun (Zulip user) 🙏 for suggesting the enhancement. You now have the ability with [Microcks Operator](https://operatorhub.io/operator/microcks) `1.5.1` to specify custom TLS certificates for `Routes` either through directly putting them into the custom resource or using labels that will trigger [cert-utils-operator](https://github.com/redhat-cop/cert-utils-operator) and [cert-manager](https://cert-manager.io/) certificate management services


## Community amplification

Community contributions are essential to us and do not come only from feature requests, bug issues, and open discussions. What a pleasure to see people relaying our messages, integrating Microcks in a demonstration, inviting us to events, or even talking about Microcks!

We’d like to thank the following awesome people:

* [Noelia Martín Hernández](https://www.linkedin.com/in/noelia-mart%C3%ADn-hern%C3%A1ndez-9bb12960/) 🙏 for its awesome introduction on [Kafka events mocking with AsyncAPI and Microcks](https://www.paradigmadigital.com/dev/mockear-eventos-en-kafka-con-asyncapi-microcks/) in Spanish on [Paradigma Digital](https://www.paradigmadigital.com/) blog,
* [Nicolas Ehrman](https://www.linkedin.com/in/nicolas-ehrman-629b8910/) 🙏 and [Jérôme Delabarre](https://www.linkedin.com/in/jerome-delabarre-a350848/) 🙏 from [Hashicorp](https://www.hashicorp.com/) for a very nice chat in French regarding Microcks genesis,
* [OpenShift Coffee Break](https://www.youtube.com/playlist?list=PLaR6Rq6Z4IqdKiGzRkBRKCiyAzQ5hM-rb) 🙏 Red Hat team for inviting us to talk about API testing into a Microservices world with Microcks. The recording is available on [YouTube](https://www.youtube.com/watch?v=j1vRuXNSsHo&list=PLaR6Rq6Z4IqdKiGzRkBRKCiyAzQ5hM-rb&index=8) too,
* [Hugo Guerrero](https://github.com/hguerrero ) 🙏 from [Red Hat](https://redhat.com) for having contributed a super nice video on [Creating Fluid API Mocks in 3 minutes](https://www.youtube.com/watch?v=7jQClrrR-Dw) on our [YouTube channel](https://www.youtube.com/c/Microcks). Well done mate! 💪


## What’s coming next?

As usual, we will be eager to prioritize items according to community feedback: you can check and collaborate via our list of [issues on GitHub](https://github.com/microcks/microcks/issues). 

Remember that we are an open community, and it means that you too can jump on board to make Microcks even greater! Come and say hi! on our [Github discussion](https://github.com/microcks/microcks/discussions) or [Discord chat](https://microcks.io/discord-invite/) 🐙, simply send some love through [GitHub stars](https://github.com/microcks/microcks) ⭐️ or follow us on [Twitter](https://twitter.com/microcksio), [LinkedIn](https://www.linkedin.com/company/microcks/) and our brand new [YouTube channel](https://www.youtube.com/c/Microcks)!

Thanks for reading and supporting us!
