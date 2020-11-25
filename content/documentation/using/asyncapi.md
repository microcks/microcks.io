---
draft: false
title: "AsyncAPI usage for Microcks"
date: 2020-08-01
publishdate: 2020-08-05
lastmod: 2020-08-05
menu:
  docs:
    parent: using
    name: AsyncAPI usage for Microcks
    weight: 25
toc: true
weight: 30 #rem
---

## Overview

### Introduction

AsyncAPI is an open source initiative that seeks to improve the current state of Event-Driven Architectures (EDA). Its long-term goal is to make working with EDA’s as easy as it is to work with REST APIs. That goes from documentation to code generation, from discovery to event management. Most of the processes you apply to your REST APIs nowadays would be applicable to your event-driven/asynchronous APIs too. So Microcks has support for AsyncAPI too ;-) !

Starting with Microcks version `1.0.0`, Microcks is now able to import AsyncAPI definitions for enriching the API catalogs with `Event` typed APIs. When set up accordingly, it is also able to mock the API by publishing samples messages on a dedicated message broker destination.

### Bindings

AsyncAPI specification decorellates the concern of message description (through payload and headers schemas) from the concern of servers and protocol bindings. A same API may have different bindings allowing to specify protocol specific issues like queue or topic naming, serialization format and so on.

> At the time of `1.0.0` release, Microcks only supports the `KAFKA` binding. When setting up Microcks, you may have the choice deploying a new Kafka broker as part of the Microcks installation or reusing an existing broker.

For each version of an API managed by Microcks, it will create appropriate destination for **operations** in mixing specification elements, protocol binding specifics and versionning issues. Destination managed by Microcks are then referenced within the API details page.

### Conventions

With AsyncAPI [Messages Objects](https://github.com/asyncapi/asyncapi/blob/master/versions/2.0.0/asyncapi.md#messageObject) you have the ability to define `examples` with your AsyncAPI specification document. For now (in the `2.0.0` release of the specification), `examples` is simply a `[Map[ string , any]]` but we ought to propose the here-after conventions as the formal specification (see this [Feature request](https://github.com/asyncapi/asyncapi/issues/329) if you want to contribute to conversation).

So basically, we propose to describe `examples` using the following guidelines. An `example` may have:
* A short name that will be used as the key within the `examples` array,
* An optional `summary` to provide more informations on the use-case mapping of the sample,
* A mandatory `payload` that should be compliant with the defined schema for Message payload and may be expressed directly in YAML or by embedding JSON representation,
* An optional `headers` that should be compliant with the aggregated schema for both Message-level headers and Trait-level headers.

## Illustration

We will illustrate how Microcks is using OpenAPI specification through a `User signed-up API` sample that is inspired yb one of AsyncAPI tutorial. The specification file in YAML format can be found [here](https://raw.githubusercontent.com/microcks/microcks/master/samples/UserSignedUpAPI-asyncapi.yml). This is a single `SUBSCRIBE` operation API that defines the format of events that are published when a User signed-up an application.

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

![asyncapi-mocks](/images/asyncapi-mocks.png)