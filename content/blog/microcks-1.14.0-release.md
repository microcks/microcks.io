---
title: Microcks 1.14.0 release 🚀
date: 2026-04-29
image: "images/blog/microcks-1.14.0-feature.png"
author: "Laurent Broudoux"
type: "regular"
description: "Microcks 1.14.0 release 🚀"
draft: false
---

We are thrilled to announce the `1.14.0` release of Microcks, the [CNCF](https://landscape.cncf.io/?selected=microcks)'s open-source cloud-native tool for API Mocking and Testing! 🚀

This release marks a significant milestone in our journey to provide the **most comprehensive simulation environment for modern architectures**. As distributed systems become more complex, the lines between synchronous and asynchronous interactions blur. Microcks `1.14.0` bridges these worlds with powerful new features for [OpenAPI](https://www.openapis.org/) and [AsyncAPI](https://www.asyncapi.com), allowing you to **simulate sophisticated business flows with ease**.

{{< image src="images/blog/microcks-1.14.0-feature.png" alt="microcks-feature" >}}

Below are the highlights of this major release.

## Simulating OpenAPI Callbacks 🛎️

In the OpenAPI v3 specification, **Callbacks** are used to describe asynchronous, out-of-band requests that your service sends back in response to a specific event (like a payment confirmation or a long-running registration process).

Microcks `1.14.0` now fully supports the simulation of these callbacks. You can now define ordered, contextual, and asynchronous callback sequences. By using the `x-microcks-callback.order` extension, you can ensure that notifications are sent in the exact order your business logic requires, using data captured from the initial request to make the simulation realistic.

{{< image src="images/blog/microcks-1.14.0-callbacks.png" alt="openai-callbacks-timelines" >}}

> Check out the [OpenAPI Callbacks guide](https://microcks.io/documentation/guides/usage/openapi-callbacks/) to see how to implement this in your mocks.

## Support for OpenAPI Webhooks 🎣

While callbacks are tied to a specific request, **Webhooks** represent a stream of events that consumers can subscribe to independently. They are essential for modeling event-driven behaviors within a RESTful ecosystem.

With this release, Microcks introduces a dedicated **Manage Webhooks** UI and API. This allows you to register subscribers, configure the frequency of events, set expiration delays, and even monitor delivery errors. It’s never been easier to simulate a live stream of "New Pet" or "Order Updated" events for your consumers!

{{< image src="images/blog/microcks-1.14.0-webhooks.png" alt="openai-webhooks-timelines" >}}

> Dive into our [OpenAPI Webhooks documentation](https://microcks.io/documentation/guides/usage/openapi-webhooks/) for a full walkthrough.

## Sync-to-Async Triggers ⚡️

In modern cloud-native apps, a common pattern is a "Sync-to-Async" flow: a user hits a REST endpoint (Sync), which then triggers an event on a message broker like Kafka or RabbitMQ (Async).

Microcks `1.14.0` introduces **Sync-to-Async trigger**s**, allowing you to describe these cross-protocol scenarios. By adding a simple trigger to your OpenAPI or gRPC operation, Microcks will automatically publish a contextualized message to your AsyncAPI channels whenever the mock is invoked. This ensures that your entire event-driven choreography can be tested end-to-end without a single line of code.

{{< image src="images/blog/microcks-1.14.0-sync-to-async.png" alt="openai-asyncapi-timelines" >}}

> Read more about [Async API event triggers](https://microcks.io/documentation/explanations/async-triggers/) to master these complex scenarios.

## Request-Reply for AsyncAPI 🤝

Microcks is a community-driven project, and this release features a fantastic contribution from [Adam Hicks](https://www.linkedin.com/in/the-adam/) 🙏, who implemented support for the **Request-Reply** pattern in AsyncAPI.

This enhancement is a game-changer for simulating asynchronous interactions that require a correlation between a request message and a response message. 

{{< image src="images/blog/microcks-1.14.0-request-reply.png" alt="asyncapi-request-reply-timelines" >}}

> A huge thank you to Adam for his hard work and for helping Microcks support even more real-world messaging patterns! 👏

## Other Improvements

This release is one of our largest yet, with nearly **70 issues resolved**! Beyond the major features, we’ve included:

* **UI Enhancements:** Updates to Angular `19.2.18` for a smoother experience.

* **Better Debugging:** Homogenized "Live Traces" between Groovy and JS engines.

* **Quality & Stability:** Numerous bug fixes in gRPC error handling and test controllers.

For the full list of changes, please check the [milestone details on GitHub](https://github.com/microcks/microcks/milestone/57?closed=1).


## What’s Next?

As we continue to push the boundaries of API mocking and testing, your feedback is our North Star. Join our community, share your ideas, and let's build the future of API tooling together! You can either help us define the scope of the next `1.15` release [in this discussion](https://github.com/microcks/microcks/issues/2048).

Come say hi on our [Discord](https://microcks.io/community/) chat, give us a star on [GitHub](https://github.com/microcks/microcks) ⭐️, or follow us on our social channels!

Thanks for your continued support! ❤️