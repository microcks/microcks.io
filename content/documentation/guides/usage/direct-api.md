---
draft: false
title: "Generating Direct API"
date: 2019-09-01
publishdate: 2019-09-01
lastmod: 2024-06-02
weight: 5
---

## Overview

Even though Microcks promotes a contract-first approach for defining mocks, starting that way in real life may be difficult without a great maturity in API and Service contracts. You often need to play a bit with a fake API to really figure out their needs and how you should design an API contract. To help with this situation, Microcks offers the ability to **directly generate an API** that you may use as a sandbox.

This guide shows you how Microcks is able to easily generate, in a few clicks:
* **REST API** with CRUD operations (CRUD for *Create-Retrieve-Update-Delete*) and associated mocks that you'll be able to use for recording, retrieving and deleting any type of JSON document,
* **Event-Driven API** with a single *Publish* operation with an associated reference payload that will be used to simulate event emission, whether on Kafka or WebSocket protocols.

## 1. Few concepts

In a few clicks, Microcks is able to easily generate for you:
* **REST API** with CRUD operations (CRUD for *Create-Retrieve-Update-Delete*) and associated mocks that you'll be able to use for recording, retrieving and deleting any type of JSON document,
* **Event-Driven API** with a single *Publish* operation with an associated reference payload that will be used to simulate event emission, whether on Kafka or WebSocket protocols.

<div align="center">
<br/>
{{< figure src="images/documentation/direct-wizard.png" alt="image" zoomable="true" width="90%" >}}
<br/>
</div>

In order to access this **Direct API** wizard, just go to the **API | Services** repository and hit the **Add Direct API...** button:
      
{{< image src="images/documentation/direct-link.png" alt="image" zoomable="false" >}}

Each kind of Direct API has the same common properties. After selecting the type, the wizard asks you to give the following **API | Service** properties:

* `Service Name` and `Version` will be the unique identifiers of the new Direct API you want to create,
* `Resource` will be the kind of resource that will be managed by this Direct API.

## 2. Generate a Direct REST API

### Create the API

Let's start with a basic Direct API: the `Foo API`!

<div align="center">
<br/>
{{< figure src="images/documentation/direct-rest-form.png" alt="image" zoomable="true" width="90%" >}}
<br/>
</div>

In the next step of this wizard, you'll be able to assign a **Reference JSON Payload** for your Direct API. When provided, this payload is used to infer a schema for the data exposed by this API. Schema information is then integrated into the generated API specifications.

> 💡 Reference JSON Payload is optional for Direct REST API but mandatory for Direct Event-driven API.

<div align="center">
<br/>
{{< figure src="images/documentation/direct-rest-payload.png" alt="image" zoomable="true" width="90%" >}}
<br/>
</div>

Now, just hit the **Next** button, confirm on the next screen, and you'll have a ready-to-use API that proposes different operations, as shown in the capture below. 

{{< image src="images/documentation/direct-operations.png" alt="image" zoomable="true" >}}

This Direct REST API immediately exposes mock endpoints for the different operations. The corresponding OpenAPI contract is also directly available for download. It integrates schema information deduced from the reference payload you may have provided in the previous step.

Given the previously created Direct API, it is now possible to use the `/dynarest/Foo+API/0.1/foo` endpoint (append after your Microcks base URL) to interact with it. This Direct API is, in fact, agnostic to the payload you send to it as long as it is formatted as JSON. For example, you can easily record a new `foo` resource having a `name` and a `bar` attribute like this: 

```sh
curl -X POST http://localhost:8080/dynarest/Foo%20API/0.1/foo -H 'Content-type: application/json' \
    -d '{"name":"andrew", "bar": 223}'
```

And you should receive the following response:

```json
{ "name" : "andrew", "bar" : 223, "id" : "5a1eb52a710ffa9f0b7c6de8" }
```

What Microcks has simply done is record your JSON payload and assign it an `id` attribute.
  
### Create resources
  
Creating a resource is useful, but how to check what the already existing resources are? Let's create another bunch of `foo` resources like this: 

```sh
curl -X POST http://localhost:8080/dynarest/Foo+API/0.1/foo -H 'Content-type: application/json' -d '{"name":"andrew", "bar": 224}'
curl -X POST http://localhost:8080/dynarest/Foo+API/0.1/foo -H 'Content-type: application/json' -d '{"name":"marina", "bar": 225}'
curl -X POST http://localhost:8080/dynarest/Foo+API/0.1/foo -H 'Content-type: application/json' -d '{"name":"marina", "bar": 226}'
```

Now, just hitting the `Resources` button just next to `Operations` section, you should be able to check all the resources Microcks has recorded as being viable representations of the `foo` resource. Each of them has received a unique identifier:

<div align="center">
<br/>
{{< image src="images/documentation/direct-resources.png" alt="image" zoomable="true" >}}
<br/><br/>
</div>

Using Direct API in Microcks is thus a simple and super-fast means of recording sample resources to illustrate what should be the future contract design!
      
### Query resources
      
Beyond the simple checking of created resources, those resources are also directly available through the endpoints corresponding to retrieval operations. As every resource recorded is identified using an `id` attribute, it's really easy to invoke the GET endpoint using this id like this: 

```sh
curl -X GET http://localhost:8080/dynarest/Foo+API/0.1/foo/5a1eb52a710ffa9f0b7c6de8
```

This gives you the JSON payload you have previously recorded!

```json
{ "name" : "andrew", "bar" : 223, "id" : "5a1eb52a710ffa9f0b7c6de8" }`
```

More sophisticated retrieval options are also available when using the listing endpoint of the dynamic Service. Microcks follows the conventions of querying by example: you can specify a JSON document as data, and it will be used as a prototype for retrieving recorded resources having the same attributes and same attribute values. For example, to get all the `foo` resources having a name of *marina*, just issue this query:

```sh
curl -X GET http://localhost:8080/dynarest/Foo+API/0.1/foo -H 'Content-type: application/json' \
    -d '{"name": "marina"}}'
```

That will give you the following results:

```json
[{ "name" : "marina", "bar" : 225, "id" : "5a1eb608710ffa9f0b7c6deb" }, { "name" : "marina", "bar" : 226, "id" : "5a1eb613710ffa9f0b7c6dec" }]
```
      
Microcks is also able to understand the operators you'll find in [MongoDB Query DSL](https://docs.mongodb.com/manual/tutorial/query-documents/) syntax. Thus, you're able, for example, to filter results using a range for an integer value like this:

```sh
curl -X GET http://localhost:8080/dynarest/Foo+API/0.1/foo -H 'Content-type: application/json' \
    -d '{"bar": {$gt: 223, $lt: 226} }}'
```

With results:

```json
[{ "name" : "andrew", "bar" : 224, "id" : "5a1eb5fd710ffa9f0b7c6dea" }, { "name" : "marina", "bar" : 225, "id" : "5a1eb608710ffa9f0b7c6deb" }]
```

You can also mix-and-match attribute values and DSL operators so that you may build more complex filters like this one, restricted to the previous set of `foo` to those having only the name of *marina*:

```sh
curl -X GET http://localhost:8080/dynarest/Foo+API/0.1/foo -H 'Content-type: application/json' \
    -d '{"name": "marina", "bar": {$gt: 223, $lt: 226} }}'
```

With results:

```json
[{ "name" : "marina", "bar" : 225, "id" : "5a1eb608710ffa9f0b7c6deb" }]
```
<br/>

## 3. Generate a Direct Event-Driven API

Direct API is also able to manage Event Driven API that are described using AsyncAPI specifications. Imagine a `MyQuote API` that notifies of quote updates on an asynchronous channel. You can define this API this way:

<div align="center">
<br/>
{{< figure src="images/documentation/direct-event-form.png" alt="image" zoomable="true" width="90%" >}}
<br/>
</div>

Then adding a reference JSON payload - such a payload can also include some [templating expressions](./advanced/templates) to get some more dynamic data. Here we define producing random stock symbols and range price values:

<div align="center">
<br/>
{{< figure src="images/documentation/direct-event-payload.png" alt="image" zoomable="true" width="90%" >}}
<br/>
</div>

After clicking `Next` some more time, you now have a Direct Async API that is immediately exposed on the WebSocket endpoint and on the Kafka broker Microcks is attached to. The AsyncAPI specification is also directly available for download.

{{< image src="images/documentation/direct-event-api.png" alt="image" zoomable="true" >}}

Looking at the operation details, you can retrieve the information of the endpoints used by different protocols and issue commands to receive the different messages published by the mock engine:

```sh
kcat -b my-cluster-kafka-bootstrap.apps.try.microcks.io:443 -t MyQuoteAPI-1.0-quotes -o end
```

```sh
% Auto-selecting Consumer mode (use -P or -C to override)
% Reached end of topic MyQuoteAPI-1.0-quotes [0] at offset 87
{
  "symbol": "GOOG",
  "price": "124"
}
% Reached end of topic MyQuoteAPI-1.0-quotes [0] at offset 88
{
  "symbol": "GOOG",
  "price": "121"
}
% Reached end of topic MyQuoteAPI-1.0-quotes [0] at offset 89
{
  "symbol": "IBM",
  "price": "127"
}
% Reached end of topic MyQuoteAPI-1.0-quotes [0] at offset 90
{
  "symbol": "GOOG",
  "price": "134"
}
[...]
```

## Wrap-up

In a few steps, you've discovered how easy it is to have Microcks generate fake APIs for you! This one may allow you to quickly bootstrap your API design and contracts while exposing mock endpoints that allow your consumers or partners to immediately start testing your API.
