---
draft: false
title: "AsyncAPI Conventions"
date: 2024-05-27
publishdate: 2024-05-27
lastmod: 2024-11-04
weight: 2
---

## Conventions

In addition of schema information, Microcks uses [AsyncAPI Message Example Objects](https://v2.asyncapi.com/docs/reference/specification/v2.6.0) to produce example messages for mocking purpose.

For AsyncAPI `2.x` document, the `name` attribute of example is mandatory so that Microcks reuses this name to identify available mock messages. Starting with AsyncAPI `3.0`, the `name` is no longer mandatory and Microcks can then compute a name for you based on the message name and the index of example in the list.

For each version of an API managed by Microcks, it will create appropriate destination for **operations** in mixing specification elements, protocol binding specifics and versioning issues. Destination managed by Microcks are then referenced within the API details page.

## Bindings

AsyncAPI specification dissociates the concern of message description (through payload and headers schemas) from the concern of servers and protocol bindings. A same API may have different bindings allowing to specify protocol specific issues like queue or topic naming, serialization format and so on.

Microcks supports following bindings:
* `KAFKA` binding - the default if you don't explicitly define a binding into your AsyncAPI document,
* `WS` (for WebSocket) - is directly handled by Microcks and you don't need additional broker or server,
* `MQTT` will be active if Microcks is connected to a MQTT broker,
* `AMQP` will be active if Microcks is connected to a RabbitMQ or AMQP 0.9 comptaible broker,
* `NATS` will be active if Microcks is connected to a NATS broker,, 
* `GOOGLEPUBSUB` will be active if Microcks is connected to a Google Cloud PubSub service, 
* `SQS` will be active if Microcks is connected to an AWS SQS service ([LocalStack](https://www.localstack.cloud/) can be used),
* `SNS` will be active if Microcks is connected to an AWS SQS service ([LocalStack](https://www.localstack.cloud/) can be used).

For each, channel within your AsyncAPI specification, Microcks will create and manage destination on the connected brokers where bindings are defined.

Those destinations will be named with the following convention to avoid collisions between different APIs or versions:

```sh
<sanitized_API_name>(-|/)<API_version>(-|/)<sanitized_operation>[(-|/)<channel_path>]
```

## Channel parameters

Microcks supports templatized channel endpoints using parameter like `{id}` in their name. Support of parameter for AsyncAPI 2.x presents some restriction though.

### AsyncAPI v2.x

Microcks only supports **static parameter definition** for AsyncAPI v2.x. That means that for a parameter, you also need to specify the possible different values with examples.

Let's imagine a basic Chat Room channel. In order to have the different msesages (`Example 1`, `Example 2` and `Example 3`) dispatched on different rooms, you'll have to define the different values for the `roomId` parameter for those example. Like illustrated below:

```yaml
channels:
  /chat/{roomId}:
    parameters:
      idRoom:
        description: Identifier of the chat room
        schema:
          type: string
          examples:
            Example 1:
              value: 1
            Example 2:
              value: 2
            Example 3:
              value: 2
    [...]
components:
  messages:
    chatMessage:
      payload:
        $ref: '#/components/schemas/ChatMessageType'
      examples:
        - name: Example 1
          payload:
            message: Hello
        - name: Example 2
          payload:
            message: Bonjour
        - name: Example 3
          payload:
            message: Namaste
```

Starting with Microcks `1.11.0`, you'll also have access to a notation that is much more aligned with JSON Schema constraints on `schema.examples` definition being an array::

```yaml
channels:
  /chat/{roomId}:
    parameters:
      idRoom:
        description: Identifier of the chat room
        schema:
          type: string
          examples:
            - Example 1:
                value: 1
            - Example 2:
                value: 2
            - Example 3:
                value: 2
    [...]
```

or to a shorcut notation we introduced with AsyncAPI v3.x importer. This shorcut notation allows you to define example name and value using `name:value` items like illustrated below:

```yaml
channels:
  /chat/{roomId}:
    parameters:
      idRoom:
        description: Identifier of the chat room
        schema:
          type: string
          examples:
            - 'Example 1:1'
            - 'Example 2:2'
            - 'Example 3:2'
    [...]
```


### AsyncAPI v3.x

For AsyncAPI v3.x, Microcks still supports **static parameter definition** like for AsyncAPI v2.X but also provides support for **dynamic parameter definition** using the `location` attribute.

Let's reuse our basic Chat Room channel. The `location` attribute allows directly retrieving the `roomId` value from the message payload so that you don't have to specify alues for the parameter. Also, as Microcks supports AsyncAPI v3 examples without names, the examples no longer need to have `name` attributes in that case (because we don't need a key to match payload and parameter values).
 
```yaml
channels:
  chatRoom:
    address: /chat/{roomId}
    parameters:
      idRoom:
        description: Identifier of the chat room
        location: $message.payload#/roomId
    [...]
components:
  messages:
    chatMessage:
      payload:
        $ref: '#/components/schemas/ChatMessageType'
      examples:
        - payload:
            message: Hello
            room: 1
        - payload:
            message: Bonjour
            room: 2
        - payload:
            message: Namaste
            room: 2
```

## Illustration

We will illustrate how Microcks is using OpenAPI specification through a `User signed-up API` sample that is inspired by one of AsyncAPI tutorial. The specification file in YAML format can be found [here](https://raw.githubusercontent.com/microcks/microcks/master/samples/UserSignedUpAPI-asyncapi.yml). This is a single `SUBSCRIBE` operation API that defines the format of events that are published when a User signed-up an application.

### Specifying messages

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

Examples will be an array of [example objects](https://v2.asyncapi.com/docs/reference/specification/v2.6.0#messageExampleObject).

#### Payload 

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

#### Headers

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

### Channel/endpoint names

Given the following AsyncAPI specfiication:

```yaml
asyncapi: '2.1.0'
info:
  title: User signed-up API
  version: 0.1.1
  description: This service is in charge of processing user signups

channels:
  user/signedup:
    subscribe:
```

Microcks will detect an operation named `SUBSCRIBE user/signedup` and create destinations than integrates service name and version, channel name and protocol specific formmatting.  For example, it will create a Kafka topic named `UsersignedupAPI-0.1.1-user-signedup` or a WebScoket endpoint named `/ws/User+signed-up+API/0.1.1/user/signedup`. Destination and endpoint names for the different protocols are available on the page presenting API details.

## AsyncAPI extensions

Microcks proposes custom AsyncAPI extensions to specify mocks organizational or behavioral elements that cannot be deduced directly from AsyncAPI document.

At the `info` level of your AsyncAPI document, you can add labels specifications that will be used in [organizing the Microcks repository](/documentation/guides/administration/organizing-repository/). See below illustration and the use of `x-microcks` extension:

```yaml
asyncapi: '2.1.0'
info:
  title: User signed-up API
  version: 0.1.1
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

In AsyncAPI v3.x, `operation` are now differentiated from `channels`. Our extension is still called `x-microcks-operation` and should live at the operation level like illustrated below:

```yaml
[...]
channels:
  user-signedup:
    messages:
      userSignedUp:
        $ref: '#/components/messages/userSignedUp'
operations:
  publishUserSignedUps:
    action: 'send'
    channel:
      $ref: '#/channels/user-signedup'
    messages:
      - $ref: '#/channels/user-signedup/messages/userSignedUp'
    x-microcks-operation:
      frequency: 30
[...]
```

Once `labels` and `frequency` are defined that way, they will overwrite the different customizations you may have done through UI or API during the next import of the AsyncAPI document.