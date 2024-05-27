---
draft: false
title: "OpenAPI Mocking and Testing"
date: 2019-09-01
publishdate: 2019-09-01
lastmod: 2024-05-27
weight: 5
---

## Using OpenAPI extensions

Starting with version `1.4.0`, Microcks proposes custom OpenAPI extensions to specify mocks organizational or behavioral elements that cannot be deduced directly from OpenAPI document.

At the `info` level of your OpenAPI document, you can add labels specifications that will be used in [organizing the Microcks repository](https://microcks.io/documentation/using/organizing/). See below illustration and the use of `x-microcks` extension:

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