---
draft: false
title: "Swagger Mocking and Testing"
date: 2022-04-06
publishdate: 2022-04-06
lastmod: 2022-04-06
weight: 6
---

## Overview

### Introduction

Despite its 7+ years old, [Swagger](https://swagger.io/specification/v2/) (aka as OpenAPI v2) is still a very popular specification format for REST APIs. Eventhough its [OpenAPI v3](../openapi.md) descendant is now well established and provides more comprehensive way of describing things, Swagger v2 is still very present.

Starting with version `1.5.1`, Microcks is supporting Sxwagger mocking and testing thanks to the new [multi-artifacts support](../importers/#multi-artifacts-support) feature. In order to use Swagger in Microcks, you will need 2 artifacts for each API definition:

* A [Swagger](https://swagger.io/specification/v2/) definition that holds the API metadata and operations definitions,
* A Postman Collection file that holds the mock examples (requests and responses) for the different operations of the API.

### Conventions

In order to be correctly imported and understood by Microcks, your Postman file should follow a little set of reasonable conventions and best practices.

* Your Postman collection description will need to have a name that matches the API name and a custom property `version` that matches the API version. As of writing, Postman does not allow editing of such custom property although the Collection v2 format allow them. By convention, we allow setting it through the collection description using this syntax: `version=1.0 - Here is now the full description of my collection...`.
* Your Postman collection will need to organize examples into requests having the same url as the Swagger paths and verbs. The comparison is realized apart the path templating characters. Eg. in Swagger you may have a `GET /path/{param}` operation, the Postman request with `GET` verb and `/path/:param` url will be considered as equivalent.
* Your Postman collection will then simply hold examples, defining the value for all different fields of a requeest/response pair.

We recommend having a look at our sample Swagger API for the [Beer Catalog API](https://raw.githubusercontent.com/microcks/microcks/1.5.x/samples/BeerCatalogAPI-swagger.json) as well as the [companion Postman collection](https://raw.githubusercontent.com/microcks/microcks/1.5.x/samples/BeerCatalogAPI-collection.json) to fully understand and see those conventions in action.

## Illustration

Let's dive in details of our sample `Beer Catalog` API.

### Specifying API structure

This is a fairly basic Swagger API. You can see below an excerpt of the the definition using Swagger below found in [BeerCatalogAPI-swagger.json](https://raw.githubusercontent.com/microcks/microcks/1.5.x/samples/BeerCatalogAPI-swagger.json) file and defining 3 operations:

```json
{
  "swagger": "2.0",
  "info": {
    "title": "Beer Catalog API",
    "version": "0.99"
  },
  "paths": {
    "/beer": {
      "get": {
      }
    },
    "/beer/{name}": {
      "get": {
      }
    },
    "/beer/findByStatus/{status}": {
      "get": {
      }
    }
  }
}
```

Considering the first comment line of this file, when imported into Microcks, it will discover the `Beer Catalog API` with version `0.99` and 3 operations that are: `GET /beer`, `GET /beer/{name}` and `GET /beer/findByStatus/{status}`.

### Specifying API examples

Specification of examples is done using a Postman Collection as examples cannot be attached to main Swagger and thanks to Microcks `1.3.0` [multi-artifacts support](../importers/#multi-artifacts-support) feature.

Using Postman, just create a new Collection - using the same name as Swagger API and adding the custom property `version` at the beginning of description like illustrated below:

{{< image src="images/swagger-postman-collection.png" alt="image" zoomable="true" >}}

You can now start organizing and creating requests those verb and url are matching with the Swagger API operation path and verbs. For our example, we're specifying the three operations: `GET /beer`, `GET /beer/{name}` and `GET /beer/findByStatus/{status}`.

{{< image src="images/swagger-postman-request.png" alt="image" zoomable="true" >}}

> Note in the example above that Microcks doesn't care on Postman request name but checks the verb and the url. Here we define request and attached examples for the Swagger `GET /beer/{name}` operation. The ehcked parts are the verb (`GET` here) and the url (`/beer/:name` is equivalent to `/beer/{name}` path).

You may then define different examples for each request. Below is a basic example but [Templating expressions and functions](../advanced/templates/) are obviously supported:

{{< image src="images/swagger-postman-example.png" alt="image" zoomable="true" >}}

### Importing artifacts

Both artifacts should be imported into Microcks either through [direct upload](../importers/#direct-upload) or [scheduled import](/..importers/#scheduled-import). The important thing to notice is that the Swagger specification artifact represents the `main` or `primary` artifact for this service definition and that the Postman Collection represents a `secondary` artifact. You have to mention it when importing it otherwise your API definition will be overwritten!
