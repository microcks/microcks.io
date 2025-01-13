---
title: Announcing Testcontainers Modules 0.3
date: 2025-01-15
image: "images/blog/testcontainers-modules-0.3-feature.png"
author: "Laurent Broudoux"
type: "regular"
description: "Announcing Testcontainers Modules 0.3"
draft: false
---

To start the 2025 Year fresh, we're delighted to announce the release of the new series of our [Testcontainers](https://www.testcontainers.com) 
Modules 🧊! [Microcks modules](https://testcontainers.com/modules/microcks) are language-specific libraries that enable embedding Microcks into 
your unit tests with lightweight, throwaway instances thanks to containers.

The `0.3` series is a major step forward that completes the set of features and elevates Microcks as **a fully featured mocking library for development purposes**. 
It can be used with different testing styles (classicist, mockist, state-based, and interaction-based) and provides features for all major 
languages and all kinds of API!

{{< image src="images/blog/testcontainers-modules-0.3-feature.png" alt="image" zoomable="true" >}}
<div align="center" style="padding-bottom: 40px"><legend><small><i>Photo by Alexandre Boucey on Unsplash</i></small></legend></div>

The `0.3` versions are coincident releases made last week on the three main languages we currently support: [Java ☕️](https://github.com/microcks/microcks-testcontainers-java), 
[NodeJS/Typescript](https://github.com/microcks/microcks-testcontainers-node) and [Golang](https://github.com/microcks/microcks-testcontainers-go). 
With those new releases, we now have complete feature parity among the three different technology stacks! We plan to add the same features to 
the upcoming [.NET module](https://github.com/microcks/microcks-testcontainers-dotnet) that we added to our portfolio in December 2024.

Let's introduce the new features of those releases that complete the picture!

## What's inside?

#### 1️⃣ Interaction checks

If you spend some time reading about Test Driven Development, you may know that it exists two main school of thought: the *Classicist* and the *Mockist*.
(more on this in [this excellent article](https://medium.com/@adrianbooth/test-driven-development-wars-detroit-vs-london-classicist-vs-mockist-9956c78ae95f))

Until now, Microcks Testcontainers integration was *Classicist* in the sense that it was focused on providing canned responses when the mocks
endpoints were called. With this `0.3` release, we now also have a *Mockist* approach in the case you want to check the interactions of your
component under test with a dependant API.

You can now call `verify()` or `getServiceInvocationsCount()` on a Microcks container to check whether an API dependency has actually been 
called - or not. This is a super powerful way to ensure that your application logic (when to interact with an API) and access policies (caching, 
no caching, etc.) are correctly implemented and use the mock endpoints only when required!

{{< image src="images/blog/testcontainers-modules-0.3-interaction.png" alt="image" zoomable="true" >}}

A big shout out to [pierrechirstinimsa](https://github.com/pierrechristinimsa) 🙏 who contributed this one for [our Java module](https://github.com/microcks/microcks-testcontainers-java/pull/121) 🎉


#### 2️⃣ Access to `messages` in synchronous API contract-testing

The second thing we added in this release is the ability to retrieve exchanged messages when doing contract-testing. Different 
[contract-testing runners](https://microcks.io/documentation/references/test-endpoints/#test-runner) already exists in Microcks but they're 
mainly focused on **syntactical conformance** checking. However, we know that there are [multiple levels of contract testing](https://medium.com/@lbroudoux/different-levels-of-api-contract-testing-with-microcks-ccc0847f8c97).

The new `getMessagesForTestCase()` function on Microcks container allows you to retrieve the requests and responses that were used during an 
operation tests case. You can then use them to perform extra checks more related to **business conformance**; validating, for example, that 
data retrieval or transformation logic is  correctly implemented.

{{< image src="images/blog/testcontainers-modules-0.3-messages.png" alt="image" zoomable="true" >}}

These extra checks can be done *manually* directly in the programming language of your tests but you can also delegate them
to frameworks like [Cucumber](https://cucumber.io/) which are written in plain language by business experts; for running acceptance tests!


#### 3️⃣ Access to `events` in asynchronous EDA contract-testing

Finally, we also added a way to do the same thing for asynchronous events received during a contract test on an asynchronous broker.

Until now, Microcks `ASYNC_API_SCHEMA` tests allowed you to check that events were fired, correctly sent, read back from - let say - an 
[Apache Kafka](https://kafka.apache.org/) topic and valid regarding a schema. But what about the content of this event? Was it really related
to the business function call that fired it?

The new `getEventMessagesForTestCase()` function allow you to retrieve those events that were read from the broker topic and - here again - 
perform extra checks. Typically, you can validate that the data from the event is correctly correlated to the original data that triggered the
event emission.

{{< image src="images/blog/testcontainers-modules-0.3-events.png" alt="image" zoomable="true" >}}

> 💡 _In the the case of EDA, those checks are also tightly related to interaction checks; and this is a situation we faced during the development of the 
supporting demo application! Once we added them, we realized that our Kafka producer has a flushing issue and that we received more messages than we
expected! Due to a [too low timeout configuration](https://github.com/microcks/microcks-testcontainers-go-demo/blob/main/internal/service/order_event_publisher.go#L85),
events were not sent at the right time, introducing de-synchronization and collisions! 💥_ 


## Enthusiastic?

We hope this walkthrough has made you enthusiastic about this new set of features in Microcks Testcontainers `0.3`! The best thing is that you don't have
to wait another Microcks release to test them out as they're are leveraging APIs and features that are present for a long time in Microcks core!

If you want to learn them and see them in action, we have completed our demonstration application and tutorials on Testcontainers Modules as well!
You just have to check the following links:

* **For Java ☕️:** [How to check the mock endpoints are actually used](https://github.com/microcks/microcks-testcontainers-java-spring-demo/blob/main/step-4-write-rest-tests.md#-bonus-step---check-the-mock-endpoints-are-actually-used), [How to verify the business conformance of a synchronous API](https://github.com/microcks/microcks-testcontainers-java-spring-demo/blob/main/step-4-write-rest-tests.md#-bonus-step---verify-the-business-conformance-of-order-service-api-in-pure-java), and [How to verify the event content for an asynchronous API](https://github.com/microcks/microcks-testcontainers-java-spring-demo/blob/main/step-5-write-async-tests.md#-bonus-step---verify-the-event-content)

* **For NodeJS/TypeScript:** [How to check the mock endpoints are actually used](https://github.com/microcks/microcks-testcontainers-node-nest-demo/blob/main/step-4-write-rest-tests.md#-bonus-step---check-the-mock-endpoints-are-actually-used), [How to verify the business conformance of a synchronous API](https://github.com/microcks/microcks-testcontainers-node-nest-demo/blob/main/step-4-write-rest-tests.md#-bonus-step---verify-the-business-conformance-of-order-service-api-in-pure-java), and [How to verify the event content for an asynchronous API](https://github.com/microcks/microcks-testcontainers-node-nest-demo/blob/main/step-5-write-async-tests.md#-bonus-step---verify-the-event-content)

* **For Golang:** [How to check the mock endpoints are actually used](https://github.com/microcks/microcks-testcontainers-go-demo/blob/main/step-4-write-rest-tests.md#-bonus-step---check-the-mock-endpoints-are-actually-used), [How to verify the business conformance of a synchronous API](https://github.com/microcks/microcks-testcontainers-go-demo/blob/main/step-4-write-rest-tests.md#-bonus-step---verify-the-business-conformance-of-order-service-api-in-pure-java), and [How to verify the event content for an asynchronous API](https://github.com/microcks/microcks-testcontainers-go-demo/blob/main/step-5-write-async-tests.md#-bonus-step---verify-the-event-content)

As usual, we’re eager for community feedback: come and discuss on our [Discord chat](https://microcks.io/discord-invite/) 👻

Thanks for reading and supporting us!
