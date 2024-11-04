---
draft: false
title: "OpenAPI Conventions"
date: 2024-05-27
publishdate: 2024-05-27
lastmod: 2024-11-04
weight: 1
---

## Conventions

In addition of schema information, Microcks uses [OpenAPI Example Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#exampleObject) to produce working mocks and build test suite for validating your implementation.

As example fragments are actually distributed along the OpenAPI specification, Microcks collects fragments and try to associate them by **name**. Microcks only takes care of comprehensive request/response examples - which means that if you provide examples for input elements (`parameter`, `requestBody`) but not for output (`response`), incomplete examples will be discarded.

## Illustration

The [Cars sample](https://github.com/microcks/microcks/blob/master/webapp/src/test/resources/io/github/microcks/util/openapi/cars-openapi.yaml). It is a simple API that allows registering cars to an owner, listing cars for this owner and adding passenger to a car. Within this sample specification, we have defined 2 mocks - one for the registering operation and another for the listing cars operation:

* The `POST /owner/{owner}/car` operation defines a sample called `laurent_307` where we'll register a *Peugeot 307* for *Laurent*,
* The `GET /owner/{owner}/car` operation defines a sample called `laurent_cars` where we'll list the cars owned by *Laurent*.

### Specifying request params

Specifying request params encompasses path params, query params and header params. Within our two examples, we have to define the `owner` path param value - one for `laurent_307` mock and another for `laurent_cars` mock.

#### Path parameters

This is done within the `parameters` part of corresponding API `path`, on [line 83](https://github.com/microcks/microcks/blob/master/webapp/src/test/resources/io/github/microcks/util/openapi/cars-openapi.yaml#L83) of our file:

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

#### No content response payload

Now let's imagine the case where you're dealing with an API operation that returns "No Content". This could by - for example - an operation that takes care of deleting a car from the database and return a simple `204` HTTP response code once done.

In that case, we cannot rely on [Example Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#exampleObject) because the response has typically no content we can attach an `example` to. We need another way to specify the matching of this response with an incoming request. For this, we introduced a specific `x-microcks-refs` extension that allows to tell Microcks on which requests it should match this response.

Let's illustrate the above-mentioned case with this snippet below:

```yaml
/owner/{owner}/car/{car}:
  delete:
    parameters:
      - name: owner
        in: path
        description: Owner of the cars
        required: true
        schema:
          format: string
          type: string
        examples:
          laurent_307:
            value: laurent
          laurent_jp:
            value: laurent
      - name: car
        in: path
        description: Owner of the cars
        required: true
        schema:
          format: string
          type: string
        examples:
          laurent_307:
            value: '307'
          laurent_jp:
            value: 'jean-pierre'
responses:
  204:
    description: No Content
    x-microcks-refs:
      - laurent_307
      - laurent_jp
```

When Microcks will receive `DELETE /owner/laurent/car/307` or `DELETE /owner/laurent/car/jean-pierre` call, it will just reply using a `204` HTTP response code.

> 💡 Note that this association also works if you defined some `requestBody` examples for the operation.

## OpenAPI extensions

Microcks proposes custom OpenAPI extensions to specify mocks organizational or behavioral elements that cannot be deduced directly from OpenAPI document.

At the `info` level of your OpenAPI document, you can add labels specifications that will be used in [organizing the Microcks repository](https://microcks.io/documentation/guides/administration/organizing-repository/). See below illustration and the use of `x-microcks` extension:

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

At the `operation` level of your OpenAPI document, we could add delay/frequency and dispatcher specifications. These one will be used to [customize the dispatching rules](/documentation/explanations/dispatching) to your API mocks. Let's give an example for OpenAPI using the `x-microcks-operation` extension:

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

> 💡 Note that we can use multi-line notation in YAML but we will have to escape everything and put `\` before double-quotes and `\n` characters if specified using JSON.

Once `labels` and dispatching rules are defined that way, they will overwrite the different customizations you may have done through UI or API during the next import of the OpenAPI document.

Starting with Microcks `1.11.0`, you can also declare [mock constraints](/documentation/guides/usage/mocks-constraints) using the `x-microcks-operation` extension:

```yaml
[...]
post:
  summary: Add a car to current owner
  description: Add a car to current owner description
  operationId: addCarOp
  x-microcks-operation:
    delay: 100
    parameterConstraints:
      - name: Authorization
        in: header
        required: true
        recopy: false
        mustMatchRegexp: "^Bearer\\s[a-zA-Z0-9\\._-]+$"
[...]

```