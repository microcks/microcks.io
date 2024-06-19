---
title: Apache Kafka Mocking and Testing
date: 2020-11-17
image: "images/blog/apache-kafka-mocking-testing-testing.png"
author: "Laurent Broudoux"
type: "regular"
description: "Apache Kafka Mocking and Testing"
draft: false
---

We see [Apache Kafka](https://kafka.apache.org/) being more and more commonly used as an event backbone in new organizations everyday. This is irrefutable. And while there are challenges adopting new frameworks and paradigms for the apps using Kafka, there is also a critical need to govern events and speed-up delivery. To improve time-to-market, organizations need to be able to develop without waiting for the whole system to be up and running ; and they will need to validate that the components talking with Kafka will send or receive correct messages.

That’s exactly what Microcks is sorting out for Kafka event-based APIs! For that, we’re taking advantage of the [AsyncAPI](https://www.asyncapi.com/) specification. This blog post is the follow-up of [Microcks 1.1.0 release notes](https://microcks.io/blog/microcks-1.1.0-release/) and will guide you through the main usages of Microcks for Apache Kafka.


## Mocking Kafka endpoint

{{< image src="images/blog/apache-kafka-mocking-testing-mocking.png" alt="image" zoomable="true" >}}

Let’s start with mocking on Kafka. This first mocking part was already introduced with [release 1.0.0](https://microcks.io/blog/microcks-1.0.0-release/) but that is worth mentioning so that you’ll have the full picture 😉 When importing your AsyncAPI specification into Microcks, you end up with a new API definition within your API catalogs. This is the overview of an `Event` typed API.

When using the Kafka capabilities of Microcks for the protocol binding of this API, you will see the highlighted informations appear on the API definition:

* The available bindings and the dispatching frequency: that means the time interval Microcks is publishing mock messages on Kafka - every `10 seconds` below,
* The Kafka broker / endpoint Microcks is connected to. Microcks can have its own broker that is deployed alongside or reuse an existing one,
* The Kafka topic that is used by Microcks for publishing sample messages.

{{< image src="images/blog/apache-kafka-mocking-testing-api.png" alt="image" zoomable="true" >}}

> Just import your AsyncAPI specification and you’ll have incoming sample messages on the specified topic for the configured Kafka broker! Without writing a single line of code! You can then immediately start developing an app that will consume these messages.

Imagine you have now developed a simple consumer that listens to this `UsersignedupAPI_0.1.1_user-signedup` topic and just displays the messages on the console. You will ended up with following results:

```json
// At startup time...
{
  "id": "tSWj3wp68S5w2D78NFe6EcbLF6vsGKRJ",
  "sendAt": "1604659425835",
  "fullName": "Laurent Broudoux",
  "email": "laurent@microcks.io",
  "age": 41
}
{
  "id": "LgAqKSJwooo5YStRjt2273lOC8UYXGid",
  "sendAt": "1604659425836",
  "fullName": "John Doe",
  "email": "john@microcks.io",
  "age": 36
}
// ...then 10 seconds later...
{
  "id": "VV6OSh4LkGYgymjIJOoggJ1BSS89AvEK",
  "sendAt": "1604659435834",
  "fullName": "Laurent Broudoux",
  "email": "laurent@microcks.io",
  "age": 41
}
{
  "id": "jabbeE3PBmbhXALKkVxwojIF2bSREDWr",
  "sendAt": "1604659435835",
  "fullName": "John Doe",
  "email": "john@microcks.io",
  "age": 36
}
// ...then 10 seconds later (you got it ;-)...
{
  "id": "AnVrWCQyFzHQJyji3aqIe7rXC06sYQtX",
  "sendAt": "1604659445834",
  "fullName": "Laurent Broudoux",
  "email": "laurent@microcks.io",
  "age": 41
}
{
  "id": "Y5Lh4ryHgVERYNvqw0IIzCQDiyqSqfpW",
  "sendAt": "1604659445835",
  "fullName": "John Doe",
  "email": "john@microcks.io",
  "age": 36
}
// ...until you kill your consumer...
```

Thanks to Microcks [message templating](https://microcks.io/documentation/references/templates/), you see that you receive different message ids each and every time.

The new thing in the Microcks release `1.1.0` is the little green-and-red bar chart in the upper right corner of the screen capture. That’s where you can launch tests of your Kafka event-based API. Let’s see what it means.

## Testing Kafka endpoints

{{< image src="images/blog/apache-kafka-mocking-testing-testing.png" alt="image" zoomable="true" >}}

In Microcks, testing Kafka endpoints means: connecting to a remote Kafka topic on an existing broker in the organisation, listening for incoming messages for a certain amount of time and checking that received messages are valid regarding the event-based API schema.

For defining such a test, you will need to specify:
* The Test Endpoint that is expressed using this simple form: `kafka://host[:port]/topic`
* A waiting timeout and an optional `Secret` that will handle all the credentials information to connect to a remote broker (think of user/password or certificates). Such `Secrets` are managed by administrators and users just reference them at test launch.

{{< image src="images/blog/apache-kafka-mocking-testing-test.png" alt="image" zoomable="true" >}}

> In 1.1.0 release we only deal with JSON Schema describing message payload but we plan to include [Avro Schema](http://avro.apache.org/docs/current/spec.html) support in next releases. For more details, see the [Test Runner](https://microcks.io/documentation/references/test-endpoints/#test-runner) documentation.

Microcks is able to launch tests asynchronously, to collect and store results and then give a restitution of the test results as well as the received messages. See the failed test below: received message triggered a validation error because the `sendAt` property was not of the expected type.

{{< image src="images/blog/apache-kafka-mocking-testing-result.png" alt="image" zoomable="true" >}}

> Even if it may be handy to launch tests manually for diagnostic or evaluation purposes, we recommend triggering tests automatically from your CI/CD pipeline. Microcks provides a [CLI](https://microcks.io/documentation/guides/automation/cli/) and some other options for that.

## Summary

In this walkthrough, you have learned how Microcks is leveraging the [AsyncAPI](https://www.asyncapi.com/) to provide helpful information on your event-based API. Moreover it can reuse all the elements of your API specification to automatically simulate a Kafka provider and then validate that your application is producing correct messages!

We have seen how easy it is to manually launch tests from the Microcks console even if you’ve deployed your Kafka broker in a secured context with credentials and certificates. Stay tuned for the next post where you will learn how to automate these tests from your CI/CD pipeline. We’ll also demonstrate how AsyncAPI and [OpenAPI](https://openapis.org) can play nicely together through a full sample application available on our [GitHub repo](https://github.com/microcks/api-lifecycle/tree/master/user-registration-demo).

Take care and stay tuned. ❤️
