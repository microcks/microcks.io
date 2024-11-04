---
draft: false
title: "API Examples Format"
date: 2024-07-26
publishdate: 2024-07-26
lastmod: 2024-10-09
weight: 6
---

## Introduction

`APIExamples` format is Microcks' own specification format for defining examples intented to be used by Microcks mocks. It can be seen as a lightweight, general purpose specification to solely serve the need to provide mock datasets. The goal of this specification is to keep the Microcks adoption curve very smooth with development teams but also for non developers.

> 💡 `APIExamples` artifacts are supported starting with Microcks `1.10.0`.

`APIExamples` files are simple YAML and aim to be very easy to understand and edit. More over, the description is independant from the API protocol! We're rather attached to describe examples depending on the API interaction style: Request/Response based or Event-driven/Asynchronous.

For ease of use, we provide a [JSON Schema](https://json-schema.org/) that you can [download here](https://microcks.io/schemas/APIExamples-v1alpha1-schema.json). Thus, you can integrate it in your code editor and benefit from code completion and validation.

`APIExamples` documents are intended to be imported as `secondary` artifacts only ; thanks to the [Multi-Artifacts support](/documentation/explanations/multi-artifacts).

## API Examples properties

Let start with an example! First, such an `APIExamples` file must always start with the below lines that allows to clearly identity the artifact type but also the Miccrocks API/Service it refers to.

```yml
apiVersion: mocks.microcks.io/v1alpha1
kind: APIExamples
metadata:
  name: API Pastry - 2.0
  version: '2.0.0'
operations:
  [...]
```

This above snippet is related to the `API Pastry - 2.0` in version `2.0.0`. That means that this API version should already exist into your repository, otherwise the document will be ignored during import.

The examples from this file will be organized by API/Service operation. So after the mandatory headers, you'll find an `operations:` maker to start the examples definitions.

Direct children of `operations` are the operation names like described below.

### Request/Response based API

In the case of a Request/Response based API, examples must be described using a `request` and a `response` attribute like in the example below:

```yml
[...]
operations:
  'GET /pastry/{name}':
    Eclair Chocolat:
      request:
        parameters:
          name: Eclair Chocolat
        headers:
          Accept: application/json
      response:
        mediaType: application/json
        body:
          name: Eclair Chocolat
          description: Delicieux Eclair Chocolat pas calorique du tout
          size: M
          price: 2.5
          status: unknown
    Eclair Chocolat Xml:
      request:
        parameters:
          name: Eclair Chocolat
        headers:
          Accept: text/xml
      response:
        status: '200'
        mediaType: text/xml
        body: |-
          <pastry>
            <name>Eclair Cafe</name>
            <description>Delicieux Eclair au Chocolat pas calorique du tout</description>
            <size>M</size>
            <price>2.5</price>
            <status>unknown</status>
          </pastry>
```

The above snippet is pretty straightforward to understand:

* The operation `GET /pastry/{name}` has 2 examples defined: `Eclair Chocolat` and `Eclair Chocolat Xml`,
* Both examples should be matched to a pastry `name` of `Eclair Chocolat`, defined within the request `parameters`. Those `parameters` can contain any number of parameter mapped on operation path or on query parameters,
* Both `request` and `response` can define `headers` and a `body` - though it only makes sens to have a response body on this use-case,
* Request and response `body` can be defined as plain String (Json or Xml), as Yaml object or as Yaml array (automatically converted to Json during the import),
* A `response` may have additional attributes like the response `status` (optional - `200` is actually the default for REST API) and the `mediaType` of the response.

The beauty of it is that the principles are kinda the same for a gRPC service:

```yml
[...]
operations:
  'greeting':
    Laurent:
      request:
        body:
          firstname: Laurent
          lastname: Broudoux
      response:
        body:
          greeting: Hello Laurent Broudoux !
    John:
      request:
        body: |-
          {"firstname": "John", "lastname": "Doe"}
      response:
        body:
          greeting: Hello John Doe !
```

You can see that request and response bodies are specified either as Yaml objects or plain Json but are indeed converted in Protobuffer by Microcks underhood. You can also use `APIExamples` for a GraphQL API that way:

```yml
[...]
operations:
  film:
    film ZmlsbXM6MQ==:
      request:
        body:
          query: |-
            query {
              film(id: $id) {
                id
                title
                episodeID
                director
                starCount
                rating
              }
            }
          variables:
            id: ZmlsbXM6MQ==
      response:
        mediaType: application/json
        body:
          data:
            film:
              id: ZmlsbXM6MQ==
              title: A New Hope
              episodeID: 4
              director: George Lucas
              starCount: 432
              rating: 4.3
```

### Event Driven/Asynchronous API

Event Driven or Asynchronous interaction style API are a bit different as they just need to specify an `eventMessage` as the content of an example. Let's have a look at the snippet below:

```yml
[...]
operations:
  'SUBSCRIBE /user/signedup':
    jane:
      eventMessage:
        headers:
          my-app-header: 123
          sentAt: "2024-07-14T18:01:28Z"
        payload:
          fullName: Jane Doe
          email: jane@microcks.io
          age: 35
```

For this example named `jane`, we just have to specify and event messages made of optional `headers` and a mandatory `body`. Here again, the `body`can be specified as plain String, as an object or an array.

## Importing API Examples

When you're happy with your API Examples just put the result YAML or JSON file into your favorite Source Configuration Management tool, grab the URL of the file corresponding to the branch you want to use and add it as a regular Job import into Microcks. On import, Microcks should detect that it's an `APIExamples` specification file and choose the correct importer.

> 💡 Do not forget to tick the **Secondary Artifact** checkbox!

## See it in action!

Want to see it in action? Then, you can replay the tutorials below, replacing the Postman Collection parts with the corresponding `APIExamples` files 😉

* [Your 1st GraphQL mock](/documentation/tutorials/first-graphql-mock), but using the [petstore-1.0-examples.yaml](/documentation/tutorials/petstore-1.0-examples.yaml) file,
* [Your 1st gRPC mock](/documentation/tutorials/first-grpc-mock), but using the [petstore-v1-examples.yaml](/documentation/tutorials/petstore-v1-examples.yaml) file,
