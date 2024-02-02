---
draft: false
title: "AsyncAPI Mocking and Testing"
date: 2020-08-01
publishdate: 2020-08-05
lastmod: 2023-06-07
weight: 7
---

## Overview

### Introduction

AsyncAPI is an open source initiative that seeks to improve the current state of Event-Driven Architectures (EDA). Its long-term goal is to make working with EDA’s as easy as it is to work with REST APIs. That goes from documentation to code generation, from discovery to event management. Most of the processes you apply to your REST APIs nowadays would be applicable to your event-driven/asynchronous APIs too. So Microcks has support for AsyncAPI too 😉!

Starting with Microcks version `1.0.0`, Microcks is now able to import AsyncAPI definitions for enriching the API catalogs with `Event` typed APIs. When set up accordingly, it is also able to mock the API by publishing samples messages on a dedicated message broker destination.

### Bindings

AsyncAPI specification dissociates the concern of message description (through payload and headers schemas) from the concern of servers and protocol bindings. A same API may have different bindings allowing to specify protocol specific issues like queue or topic naming, serialization format and so on.

> At the time of `1.7.1` release, Microcks supports the `KAFKA`, the `MQTT`, the `WS` (for WebSocket), the `AMQP`, the `NATS`, the `GOOGLEPUBSUB`, the `SQS` and the `SNS` bindings. When setting up Microcks, you have the choice deploying a new Kafka broker as part of the Microcks installation or reusing an existing broker. Any other broker type must be provisioned independantly.

For each version of an API managed by Microcks, it will create appropriate destination for **operations** in mixing specification elements, protocol binding specifics and versioning issues. Destination managed by Microcks are then referenced within the API details page.

### Conventions

With AsyncAPI [Messages Objects](https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#messageObject) you have the ability to define `examples` with your AsyncAPI specification document. Since AsyncAPI `2.1.0` examples are now fully described but in the `2.0.0` release of the specification, `examples` were simply a `[Map[ string , any]]` and we ought to propose the here-after conventions as the formal specification (see this [Feature request](https://github.com/asyncapi/asyncapi/issues/329).

So basically, we propose to describe `examples` using the following guidelines. An `example` may have:

* A short `name` that will be used as a property since AsyncAPI 2.1 or as the key within the `examples` array prior that,
* An optional `summary` to provide more informations on the use-case mapping of the sample,
* A mandatory `payload` that should be compliant with the defined schema for Message payload and may be expressed directly in YAML or by embedding JSON representation,
* An optional `headers` that should be compliant with the aggregated schema for both Message-level headers and Trait-level headers.

## Illustration

We will illustrate how Microcks is using OpenAPI specification through a `User signed-up API` sample that is inspired by one of AsyncAPI tutorial. The specification file in YAML format can be found [here](https://raw.githubusercontent.com/microcks/microcks/master/samples/UserSignedUpAPI-asyncapi.yml). This is a single `SUBSCRIBE` operation API that defines the format of events that are published when a User signed-up an application.

### Specifying samples messages

Sample messages are defined within your specification document, simply using the `examples` attribute like marked below: 

```yaml
channels:
  user/signedup:
    description: The topic on which user signed up events may be consumed
    subscribe:
      summary: Receive informations about user signed up
      operationId: receivedUserSIgnedUp
      message:
        description: An event describing that a user just signed up.
        traits:
          - $ref: '#/components/messageTraits/commonHeaders'
        payload:
          [...]
        examples: # <= Where we'll define sample messages for this operation
```

Examples will be an array of example objects, starting with a **key** that Microcks will simply use as the example name. They may include a `summary` attribute to provide a short description.

#### Payload 

##### Using AsyncAPI 2.1.0 and more recent versions

Payload is expressed into the mandatory `payload` attribute, directly in YAML or by embedding JSON. In our illustration, we will define below 2 examples with straightforward summary:

```yaml
examples:
  - name: laurent
    summary: Example for Laurent user
    payload: |-
      {"id": "{{randomString(32)}}", "sendAt": "{{now()}}", "fullName": "Laurent Broudoux", "email": "laurent@microcks.io", "age": 41}
  - name: john:
    summary: Example for John Doe user
    payload:
      id: '{{randomString(32)}}'
      sendAt: '{{now()}}'
      fullName: John Doe
      email: john@microcks.io
      age: 36
```

##### Using AsyncAPI 2.0.0

Payload is expressed into the mandatory `payload` attribute, directly in YAML or by embedding JSON. In our illustration, we will define below 2 examples with straightforward summary:

```yaml
examples:
  - laurent:
      summary: Example for Laurent user
      payload: |-
        {"id": "{{randomString(32)}}", "sendAt": "{{now()}}", "fullName": "Laurent Broudoux", "email": "laurent@microcks.io", "age": 41}
  - john:
      summary: Example for John Doe user
      payload:
        id: '{{randomString(32)}}'
        sendAt: '{{now()}}'
        fullName: John Doe
        email: john@microcks.io
        age: 36
```

> You can see here that we're using specific `{{ }}` notation that involves the generation of dynamic content. You can find description of the `now()` and `randomString()` functions into [Function Expressions](../advanced/templates/#function-expressions) documentation.

#### Headers

##### Using AsyncAPI 2.1.0 and more recent versions

Headers are expressed into the optional `headers` attribute, directly in YAML or by embedding JSON. In our illustration, we will define below 2 examples using both methods:

```yaml
examples:
  - name: laurent
    [...]
    headers: |-
      {"my-app-header": 23}
  - name: john
    [...]
    headers:
      my-app-header: 24
```
##### Using AsyncAPI 2.0.0

Headers are expressed into the optional `headers` attribute, directly in YAML or by embedding JSON. In our illustration, we will define below 2 examples using both methods:

```yaml
examples:
  - laurent:
      [...]
      headers: |-
        {"my-app-header": 23}
  - john:
      [...]
      headers:
        my-app-header: 24
```

## Importing AsyncAPI specification

When you're happy with your API design and example definitions just put the result YAML or JSON file into your favorite Source Configuration Management tool, grab the URL of the file corresponding to the branch you want to use and add it as a regular Job import into Microcks. On import, Microcks should detect that it's an AsyncAPI specification file and choose the correct importer.

Using the above `User signed-up API` example, you should get the following results:

{{< image src="images/asyncapi-mocks.png" alt="image" zoomable="true" >}}

## Using AsyncAPI extensions

Microcks proposes custom AsyncAPI extensions to specify mocks organizational or behavioral elements that cannot be deduced directly from AsyncAPI document.

At the `info` level of your AsyncAPI document, you can add labels specifications that will be used in [organizing the Microcks repository](../advanced/organizing). See below illustration and the use of `x-microcks` extension:

```yaml
asyncapi: '2.1.0'
info:
  title: Account Service
  version: 1.0.0
  description: This service is in charge of processing user signups
  x-microcks:
    labels:
      domain: authentication
      status: GA
      team: Team B
[...]
```

At the `operation` level of your AsyncAPI document, we could add frequency that is the interval of time in seconds between 2 publications of mock messages.. Let's give an example for OpenAPI using the `x-microcks-operation` extension:

```yaml
[...]
channels:
  user/signedup:
    subscribe:
      x-microcks-operation:
        frequency: 30
      message:
        $ref: '#/components/messages/UserSignedUp'
[...]
```

Once `labels` and `frequency` are defined that way, they will overwrite the different customizations you may have done through UI or API during the next import of the AsyncAPI document.