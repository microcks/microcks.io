---
title: Simulating CloudEvents with AsyncAPI and Microcks
date: 2021-04-02
image: "images/blog/simulating-cloudevents-with-asyncapi.png"
author: "Laurent Broudoux"
type: "regular"
description: "Simulating CloudEvents with AsyncAPI and Microcks"
draft: false
---

> TL;DR: [CloudEvents](https://cloudevents.io/) and [AsyncAPI](https://asyncapi.com/) are complementary specifications that help define your [Event Driven Architecture](https://en.wikipedia.org/wiki/Event-driven_architecture). [Microcks](https://microcks.io/) allows simulation of CloudEvent to speed-up and ensure autonomy of development teams.

<figure class="tc center w-70">
{{< image src="images/blog/simulating-cloudevents-with-asyncapi.png" alt="image" zoomable="true" >}}
</figure>

The rise of Event Driven Architecture (EDA) is a necessary evolution step towards cloud-native applications. Events are the ultimate weapon to decouple your microservices within your architecture. They are bringing great benefits like space and time decoupling, better resiliency and elasticity.

But events come also with challenges! One of the first you are facing when starting up as a development team - aside the technology choice - is how to describe these events structure? Another challenge that comes very quickly after being: How can we efficiently work as a team without having to wait for someone else's events?

We'll explore those particular two challenges and see how to simulate events using [CloudEvents](https://cloudevents.io/), [AsyncAPI](https://asyncapi.com/) and [Microcks](https://microcks.io/).


## CloudEvents or AsyncAPI?

New standards like [CloudEvents](https://cloudevents.io/) or [AsyncAPI](https://asyncapi.com/) came up recently to address this need of structure description. People keep asking: Should I use CloudEvents or AsyncAPI? There is the belief that CloudEvents and AsyncAPI are competing on the same scope. I see things differently, and I'd like to explain to you why. Read on!

### What is CloudEvents?

From [cloudevents.io](http://cloudevents.io/):

> CloudEvents is a specification for describing event data in common formats to provide interoperability across services, platforms, and systems.

CloudEvents purpose is to establish a common format for event data description and they are part of the [CNCF's Serverless Working Group](https://github.com/cncf/wg-serverless). A lot of integrations already exist within [Knative Eventing](https://knative.dev/docs/eventing/), [Trigger Mesh](https://www.triggermesh.com/) or [Azure Event Grid](https://azure.microsoft.com/en-us/products/event-grid/) ; allowing a true cross-vendor platform interoperability.

**The CloudEvents specification is focused on the events** and defines a **common envelope** (set of attributes) for your application event. See this example from their repo:

<script src="https://gist.github.com/lbroudoux/e3261b13eb7a9dbb14ccf59b1580d5b7.js"></script>

This is a *structured* CloudEvent. As of today, CloudEvent propose two different [content modes](https://github.com/cloudevents/spec/blob/v1.0.1/kafka-protocol-binding.md#13-content-modes) for transferring events: *structured* and *binary*.

Here your event data is actually the `<much wow=\"xml\"/>` XML node but it can be of any type. CloudEvents takes care of defining meta information about your event but does not really help you define the actual content of your event.

## What is AsyncAPI?

From [asyncapi.com](http://asyncapi.com/):

> AsyncAPI is an industry standard for defining asynchronous APIs. Our long-term goal is to make working with EDAs as easy as it is to work with REST APIs.

So here's a new term here: `API`. API implies talking about application interaction and capabilities. AsyncAPI can indeed be seen as the sister specification of [OpenAPI](https://github.com/OAI/OpenAPI-Specification) but targeting asynchronous protocols based on event brokering.

**AsyncAPI is focused on the application and the communication channels it uses**. Unlike CloudEvents, AsyncAPI does not impose how your events should be structured. However, AsyncAPI provides extended means to precisely define the event's format. It can be the meta information and the actual content. See an example:

<script src="https://gist.github.com/lbroudoux/67252933bcfea50c996b44dd20225962.js"></script>

From this example, you can see the definition of a `User signed-up` event, that is published to the `user/signedup` channel. These events have 3 properties: `fullName`, `email` and `age` that are defined using the semantics coming from [JSON Schema](https://json-schema.org/). Also - but not shown in this example - AsyncAPI allows us to specify event headers and whether these events will be available through different protocol bindings like [Kafka](https://kafka.apache.org/), [AMQP](https://www.amqp.org/), [MQTT](https://mqtt.org/) or [WebSocket](https://en.wikipedia.org/wiki/WebSocket).

## CloudEvents with AsyncAPI

From the example and explanations above, you see that both standards are tackling different scopes! We can actually combine them to achieve a complete specification of an event: including **application definition**, **channels description**, **structured envelope** and detailed **functional data** carried by the event.

The global idea of a combination is to use the **AsyncAPI specification as a hosting document**. It will **hold references to CloudEvents attributes** and add some more details on the event format.

There are two mechanisms we can use in AsyncAPI to ensure this combination. Choosing the correct mechanism may depend mainly on the protocol you'll choose to convey your events. Things aren't perfect yet and you'll have to make a choice 🤨.

Let's take the example of using [Apache Kafka](https://kafka.apache.org/) to distribute events.

* In the *structured* content mode, CloudEvents meta-information are tangled with the data in the messages value. For that mode, we'll use the JSON Schema composition mechanism that is accessible from AsyncAPI,
* In the *binary* content mode (that may use [Avro](https://avro.apache.org/)), CloudEvents meta-information are dissociated from message value and projected on messages headers. For that, we'll use the [`MessageTrait`](https://v2.asyncapi.com/docs/reference/specification/v2.0.0#messageTraitObject) application mechanism present in AsyncAPI.

### Structured content mode

Let's move our previous AsyncAPI example so that it can reuse CloudEvents in *structured* content mode. Here's the completed definition:

<script src="https://gist.github.com/lbroudoux/035ccc4d7b7cdd414f0ebc5a53e80c4c.js"></script>

The important things to notice here are:

* The definition of headers on line 16. Containing our application `custom-header` as well as the mandatory CloudEvents `content-type`,
* The inclusion of CloudEvents spec on line 33, reusing this specification as a basis for our message,
* The refining of the `data` property description on line 36.

### Binary content mode

Let's do the same thing as our previous AsyncAPI example but now applying the binary content mode. Here's the completed definition:

<script src="https://gist.github.com/lbroudoux/d5eca1c76fd57e5b3326b5d5db26bbd3.js"></script>

The important things to notice here are:

* The application of a `trait` at the message level on line 16. The trait resource is just a partial AsyncAPI document containing a `MessageTrait` definition. This trait will bring all the mandatory attributes (`ce_*`) from CloudEvents. It is indeed the equivalent of the CloudEvents JSON Schema.
* This time we're specifying our event payload using an Avro schema as specified on line 25.

### What are the benefits?

Whatever the content mode you chose, you now have a comprehensive description of your event and all the elements of your Even Driven Architecture! Not only you are guaranteeing its low-level interoperability with the ability to be routed and trigger some function in a [Serverless](https://en.wikipedia.org/wiki/Serverless_computing) world ; but you also bring complete description of the carried data that will be of great help for applications consuming and processing events.

## Simulating CloudEvents with Microcks

Let's tackle the the second challenge: How can we efficiently work as a team without having to wait for someone else's events? We saw just above how we can fully describe our events. However it would be even better to have a pragmatic approach for leveraging this CloudEvents + AsyncAPI contract... And that's where Microcks comes to the rescue 😎

### What is Microcks?

Microcks is an Open source [Kubernetes](https://kubernetes.io/)-native tool for mocking/simulating and testing APIs. One purpose of Microcks is to turn your API contract (OpenAPI, AsyncAPI, Postman Collection) into live mocks in seconds. It means that once it has imported your AsyncAPI contract, Microcks start producing mock events on a message broker at a defined frequency.

Using Microcks you can then **simulate CloudEvents in seconds**, without writing a single line of code. Microcks will allow the team relying on input events to start working without waiting for the team coding the event publication.

### Use it for CloudEvents

How Microcks is doing that? Simply by re-using examples you may add to your contract. We omitted the examples property before but let see now how to specify such examples for the binary content mode on line 27:

<script src="https://gist.github.com/lbroudoux/820c925b8ff84929ebf0c30ad1900c62.js"></script>

Some interesting things to notice here:

* You can put as many examples as you want as this is a map in AsyncAPI,
* You can specify both `headers` and `payload` values,
* Even if `payload` will be Avro-binary encoded, you use YAML or JSON to specify examples,
* You may use templating functions using the `{{ }}` notation to introduce some [random or dynamic values](https://microcks.io/documentation/references/templates/#function-expressions)

Once imported into Microcks, it is discovering the API definition as well as the different examples. It starts immediately producing mock events on the Kafka broker it is connected to - each and every 3 seconds here.

{{< image src="images/blog/simulating-cloudevents-with-asyncapi-microcks.png" alt="image" zoomable="true" >}}

Since release [1.2.0](https://microcks.io/blog/microcks-1.2.0-release/), Microcks is also supporting the connection to a Schema Registry. Therefore it publishes the Avro schema used at mock message publication time. Using the [`kafkacat`](https://github.com/edenhill/kafkacat) CLI tool, it's then easy to connect to the Kafka broker and registry - we're using here the [Apicurio Service Registry](https://www.apicur.io/registry/) - to inspect the content of mock events:

```shell
$ kafkacat -b my-cluster-kafka-bootstrap.apps.try.microcks.io:9092 -t UsersignedupCloudEventsAPI_0.1.3_user-signedup -s value=avro -r http://apicurio-registry.apps.try.microcks.io/api/ccompat -o end -f 'Headers: %h - Value: %s\n'
--- OUTPUT 
% Auto-selecting Consumer mode (use -P or -C to override)
% Reached end of topic UsersignedupCloudEventsAPI_0.1.3_user-signedup [0] at offset 276
Headers: sentAt=2020-03-11T08:03:38Z,content-type=application/avro,ce_id=7a8cc388-5bfb-42f7-8361-0efb4ce75c20,ce_type=io.microcks.example.user-signedup,ce_specversion=1.0,ce_time=2021-03-09T15:17:762Z,ce_source=/mycontext/subcontext - Value: {"fullName": "John Doe", "email": "john@microcks.io", "age": 36}
% Reached end of topic UsersignedupCloudEventsAPI_0.1.3_user-signedup [0] at offset 277
Headers: ce_id=dde8aa04-2591-4144-aa5b-f0608612b8c5,sentAt=2020-03-11T08:03:38Z,content-type=application/avro,ce_time=2021-03-09T15:17:733Z,ce_type=io.microcks.example.user-signedup,ce_specversion=1.0,ce_source=/mycontext/subcontext - Value: {"fullName": "John Doe", "email": "john@microcks.io", "age": 36}
% Reached end of topic UsersignedupCloudEventsAPI_0.1.3_user-signedup [0] at offset 279
```

We can check that the emitted events are respecting both the CloudEvents meta-information structure and the AsyncAPI data definition. Moreover, each event has some different random attributes allowing it to simulate diversity and variation for the consuming application.

## Wrap-up

We've learned in this - quite long 😉 - blog post how to solve some of challenges that come with EDA.

First we've described how recent standards like CloudEvents and AsyncAPI are focusing on different scopes: the event for CloudEvents and the application for AsyncAPI.

Then we have demonstrated how both specifications can be combined to provide a comprehensive description of all the elements involved in Event-Driven Architecture: **application definition**, **channels description**, **structured envelope** and detailed **functional data** carried by the event. Both specifications are complementary and using one or both is matter on how deep you want to go in this formal description.

Finally, we've seen how Microcks can be used to simulate any events based on AsyncAPI - CloudEvents one included - just by using examples. It answers the challenge of working, testing and validating in autonomy when different development teams are using EDA.

I hope you learned something new, if so, please consider reacting, commenting or sharing.

Thanks for reading! 👋