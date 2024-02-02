---
draft: false
title: "OpenAPI Mocking and Testing"
date: 2019-09-01
publishdate: 2019-09-01
lastmod: 2022-02-23
weight: 5
---

## Overview

### Introduction

As [OpenAPI](https://www.openapis.org/) emerges as an Open standard and provides way of defining [Example Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#exampleObject), Microcks provides direct support for OpenAPI 3.0 and 3.1.

With this feature, you are able to directly import your OpenAPI specification as a Job within Microcks. Then, it directly discover service definition as well as request/response samples defined as OpenAPI examples. If your specification embeds a JSON or OpenAPI schema definition for your custom datatypes, Microcks will use it for validating received response payload during [tests](../tests) when using the `OPEN_API_SCHEMA` strategy.

### Conventions

With OpenAPI [Example Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#exampleObject), you are now able to define named example fragments within your OpenAPI specification in YAML or JSON format. In order to produce working mocks, Microcks will need complete request/response samples. So to gather and aggregate fragments into something coherent, the importer will take care of collecting fragments having the same name and re-assemble them into comprehensive request/response pair.

## Illustration

We will illustrate how Microcks uses OpenAPI specification through a `Car API` sample. The specification file in YAML format can be found [here](https://github.com/microcks/microcks/blob/master/webapp/src/test/resources/io/github/microcks/util/openapi/cars-openapi.yaml). This API specification was designed using [Apicurio](https://apicur.io), a design studio that supports OpenAPI standards. It is a really simple API that allows registering cars to an owner, listing cars for this owner and adding passenger to a car.

Within this sample specification, we have defined 2 mocks - one for the registering operation and another for the listing cars operation:

* The `POST /owner/{owner}/car` operation defines a sample called `laurent_307` where we'll register a Peugeot 307 for Laurent,
* The `GET /owner/{owner}/car` operation defines a sample called `laurent_cars` where we'll list the cars owned by Laurent.

### Specifying request params

Specifying request params encompasses path params, query params and header params. Within our 2 samples, we have to define the `owner` path param and using our convention introduced above, we have to define it 2 times - one for `laurent_307` mock and another for `laurent_cars` mock.

#### Path parameters

This is done within the `parameters` part of corresponding API `path`, on [line 83](https://github.com/microcks/microcks/blob/master/webapp/src/test/resources/io/github/microcks/util/openapi/cars-openapi.yaml#L83) of our file. Snippet is represented below:

```yaml
parameters:
  - name: owner
    in: path
    description: Owner of the cars
    required: true
    schema:
      format: string
      type: string
    examples:
      laurent_cars:
        summary: Value for laurent related examples
        value: laurent
      laurent_307:
        $ref: '#/components/examples/param_laurent'
```

One thing to notice here is that Microcks importer supports the use of references like `'#/components/examples/param_laurent'` to avoid duplication of complex values.

#### Query parameters

Query parameters are specified using parameters defined under the `verb` of the specification as you may find on [line 20](https://github.com/microcks/microcks/blob/master/webapp/src/test/resources/io/github/microcks/util/openapi/cars-openapi.yaml#L20). Snippet is represented below for the `laurent_cars` mock:

```yaml
- name: limit
  in: query
  description: Number of result in page
  required: false
  schema:
    type: integer
  examples:
    laurent_cars:
      value: 20
```

### Specifying request payload

Request payload is used within our `laurent_307` sample. It is specified under the `requestBody` of the specification as you may find starting on [line 55](https://github.com/microcks/microcks/blob/master/webapp/src/test/resources/io/github/microcks/util/openapi/cars-openapi.yaml#L55). Request payload may refer to OpenAPI schema definitions like in the snippet below:

```yaml
requestBody:
  description: Car body
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/Car'
      examples:
        laurent_307:
          summary: Creation of a valid car
          description: Should return 201
          value: '{"name": "307", "model": "Peugeot 307", "year": 2003}'
  required: true
```

### Specifying response payload

Response payload is used within our `laurent_cars` sample. It is defined under the `Http status` of the specification as you may find starting on [line 40](https://github.com/microcks/microcks/blob/master/webapp/src/test/resources/io/github/microcks/util/openapi/cars-openapi.yaml#L40). Response payload may refer to OpenAPI schema definitions like in the snippet below:

```yaml
responses:
  200:
    description: Success
    content:
      application/json:
        schema:
          type: array
          items:
            $ref: '#/components/schemas/Car'
        examples:
          laurent_cars:
            value: |-
              [
                  {"name": "307", "model": "Peugeot 307", "year": 2003},
                  {"name": "jean-pierre", "model": "Peugeot Traveller", "year": 2017}
              ]
```

And yes... I've called one of my car jean-pierre... ;-)

## Importing OpenAPI specification

When you're happy with your API design and example definitions just put the result YAML or JSON file into your favorite Source Configuration Management tool, grab the URL of the file corresponding to the branch you want to use and add it as a regular Job import into Microcks. On import, Microcks should detect that it's an OpenAPI specification file and choose the correct importer.

Using the above `Car API` example, you should get the following results:

{{< image src="images/openapi-mocks.png" alt="image" zoomable="true" >}}

## Using OpenAPI extensions

Starting with version `1.4.0`, Microcks proposes custom OpenAPI extensions to specify mocks organizational or behavioral elements that cannot be deduced directly from OpenAPI document.

At the `info` level of your OpenAPI document, you can add labels specifications that will be used in [organizing the Microcks repository](../advanced/organizing). See below illustration and the use of `x-microcks` extension:

```yaml
openapi: 3.1.0
info:
  title: OpenAPI Car API
  description: Sample OpenAPI API using cars
  contact:
    name: Laurent Broudoux
    url: https://github.com/lbroudoux
  license:
    name: MIT License
    url: https://opensource.org/licenses/MIT
  version: 1.1.0
  x-microcks:
    labels:
      domain: car
      status: beta
      team: Team A
[...]
```

At the `operation` level of your OpenAPI document, we could add delay/frequency and dispatcher specifications. These one will be used to [customize the dispatching rules](../advanced/dispatching) to your API mocks. Let's give an example for OpenAPI using the `x-microcks-operation` extension:

```yaml
[...]
post:
  summary: Add a car to current owner
  description: Add a car to current owner description
  operationId: addCarOp
  x-microcks-operation:
    delay: 100
    dispatcher: SCRIPT
    dispatcherRules: |
      def path = mockRequest.getRequest().getRequestURI();
      if (!path.contains("/laurent/car")) {
        return "Not Accepted"
      }
      def jsonSlurper = new groovy.json.JsonSlurper();
      def car = jsonSlurper.parseText(mockRequest.getRequestContent());
      if (car.name == null) {
        return "Not Accepted"
      }
      return "Accepted"
[...]
```

> Note that we can use multi-line notation in YAML but we will have to escape everything and put `\` before double-quotes and `\n` characters if specified using JSON.

Once `labels` and dispatching rules are defined that way, they will overwrite the different customizations you may have done through UI or API during the next import of the OpenAPI document.