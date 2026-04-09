---
draft: false
title: "Async API events triggers"
date: 2026-04-01
publishdate: 2026-04-01
lastmod: 2026-04-01
weight: 9
---

# Introduction

In modern distributed and decloupled architectures, it's a very common pattern to have a synchronous interaction (ie. invocation of REST/SOAP/GraphQL/gRPC API operation) triggering the publication of an asynchronous event on a channel (and thus an AsyncAPI `SEND` operation)

So why not be able to define this triggering from the very beginning, at the mocking step in the API lifecycle? 🤔

Since release `1.14.0`, Microcks is able to leverage [dynamic mock content](/documentation/explanations/dynamic-content) and [API Metadata](/documentation/references/metadata) so that **you can describe such complex scenarios and have on-purpose asynchronous event mocks triggered by API invocations**.

> 💡 Sync-to-Async triggers support is available starting with Microcks `1.14.0`. 

Let's explain this advanced feature by taking the example of a User registrion interaction! 🛎️

## An Example

The `User Registration` API is used so that people post their user profile information (identity, preferences, etc.) to register. It proposes a simple `POST /register` operation. 

When invoked in real life, this registration should produce an event (on a message broker, a Websocket endpoint or whatever) that asynchronously publishes the user information to other systems like the CRM, the billing system, etc. This event publication is defined within the `User Signed-up` asynchronous API.

> 💡 For readers who aren't familiar with such patterns, we recommend reading this blog entry: [Continuous Testing of ALL your APIs](https://microcks.io/blog/continuous-testing-all-your-apis/) which explains in detail how both OpenAPI and AsyncAPI relate to each other in this scenario.

## Specifying Triggers

Let's assume our `User Registration` is a REST API; it can then be described using the OpenAPI specification. Below, we're going to use a specific `x-microcks-operation` [OpenAPI extension](/documentation/references/artifacts/openapi-conventions/#using-openapi-extensions) to specify a trigger:


```yaml
openapi: 3.0.2
info:
  title: User Registration API
  version: 1.0.0
  description: API used for registering new users in the system
paths:
  /register:
    post:
      x-microcks-operation:
        triggers:
          - 'User signed-up API:1.0.0:SUBSCRIBE user/signedup'
      #[...]    
```

The important things to notice here:

* The `x-microcks-operation` extension is defined at the operation level: for the `POST /register` operation,
* With this extension, we can add one or many `triggers` that will be processed on a mock invocation,
* A trigger is specified using this expression: `<API name>:<API version>:<API operation name>`. So here, we're specifying that the `SUBSCRIBE user/signedup` operation of the `User signed-up API` in version  `1.0.0` should be triggered - which will result in the production of one or more events.

## How does it work?

Specifying a trigger using above notation has the following consequences:

1. Upon the execution of a mock for the `POST /register` operation, the original request and response will be captured before the response is sent back to the caller,
2. Request and response will then be transfered asynchronously to the [Microcks Aync Minion component](/documentation/explanations/deployment-options/#complete-logical-architecture) with the information on the services, versions and operations to trigger,
3. The Async Minion will then take care of selecting the appropriate asynchronous service operatino and will try to find a **contextualized message** within this operation,
4. If such a **contextualized message** is found, then it will be rendered and it will be sent over all the procotol bindings that are available for this asynchronous service (Kafka, WebSocket, etc.)

Now you may wonder: what is a **contextualized message**? 🧐

## Specifying Contextualized Messages

If you already worked with asynchronous mocks in Microcks, you may have learned that you can produce [dynamic data](/documentation/tutorials/first-asyncapi-mock/#4-mocking-dynamic-data) using expressions like `{{ uuid() }}` for example.

**Contextualized messages** are quite the same except that they must include expressions like `{{ request.* }}` or `{{ response.* }}`. Besides regular static or dynamic examples in your AsyncAPI specification, you can also declare contextualized ones like below:

```yaml
asyncapi: '2.0.0'
info:
  title: User signed-up API
  version: 1.0.0
  description: AsyncAPI for user signedup events
defaultContentType: application/json
channels:
  user/signedup:
    description: The topic on which user signed up events may be consumed
    subscribe:
      message:
        description: An event describing that a user just signed up.
        # [...]
        examples:
          - contextualized:
              headers:
                my-app-header: 25
              payload:
                id: '{{ response.body/id }}'
                sendAt: '{{ now() }}'
                fullName: '{{ request.body/fullName }}'
                email: '{{ request.body/email }}'
                age: '{{ response.body/age }}'

```

The important things to notice here:

* The example is named `contextualized` but the name is free: you can choose what you want,
* The message is contextualize because it reuses element coming from the original request (`{{ request.body/fullName }}`) and/or from the mock response (`{{ response.body/id }}`),
* The message can also use other dynamic expressions like `{{ now() }}`,
* You may have more than one contextualized message,

Contextualized messages will not be part of the regular, scheduled production of messages by the Microcks Async Minion component. They are only sent when a request/response context is available, after a synchronous mock invocation.

## What if I'm not using OpenAPI?

Sync-to-Async trigegrs are not only for REST APIs! You can typically also used them on gRPC services for example. When in that case - or when you don't want to add the `x-microcks` extensions attributes into your spec - you can use an [API Metadata](/documentation/references/metadata) artifact, imported as a secondary artiafct - thanks to Microcks' [Multi Artifacts support](/documentation/explanations/multi-artifacts)!

Here's an example on how to include triggers as well in an `APIMetadata` file:

```yaml
apiVersion: mocks.microcks.io/v1alpha1
kind: APIMetadata
metadata:
  name: io.github.microcks.grpc.hello.v1.HelloService
  version: v1
  labels:
    domain: samples
    status: GA
operations:
  'greeting':
    #[...]
    triggers:
      - 'User signed-up API:1.0.0:SUBSCRIBE user/signedup'
```

## Wrap-up

Sync-to-Async triggers are a powerful tool for simulating complex scenarios that involve synchronous interaction, capture of a request/response context and publication of ad-hoc events on multiple protocols channels. And it's now available in Microcks `1.14.0` release.

Happy mocking! 🤡
