---
title: "Artifacts Reference"
date: 2024-05-27
description: "Here below all the documentation pages related to **Artifacts Reference**."
weight: 6
---

As exposed in the [Main Concepts](/documentation/overview/main-concepts), `Artifacts` are the corner stone in Microcks as they **hold valuable information on how your API or microservices are expected to work**. One of Microcks's beauties is that it uses standard specifications or standard tooling files as Artifacts, allowing you to reuse existing assets. Microcks will use **constraints and examples** from them to build its knowledge base.

Microcks supports the following specifications and tooling file formats as artifacts:

{{< image src="images/documentation/artifacts-formats.png" alt="image" zoomable="true" >}}

We provide built-in parsers and importers for the following formats:

* [SoapUI projects](https://www.soapui.org/soapui-projects/soapui-projects.html) files starting with version 5.1 of SoapUI. See the Microcks' [SoapUI Conventions](./soapui-conventions),
* [Swagger v2](https://swagger.io/specification/v2/) files. See the Microcks' [Swagger Conventions](./swagger-conventions),
* [OpenAPI v3.x](https://spec.openapis.org/) files in either YAML or JSON format. See the Microcks' [OpenAPI Conventions](./openapi-conventions),
* [AsyncAPI v2.x](https://v2.asyncapi.com/docs/reference/specification/v2.6.0) and [AsyncAPI v3.x](https://www.asyncapi.com/docs/reference/specification/v3.0.0) files in either YAML or JSON format. See the Microcks' [AsyncAPI Conventions](./asyncapi-conventions),
* [Postman collections](https://www.postman.com/collection/) files with v2.x file format,
* [gRPC / Protocol buffers v3](https://grpc.io/docs/what-is-grpc/introduction/) `.proto` files. See the Microcks' [gRPC Conventions](./gRPC-conventions),
* [GraphQL Schema](https://graphql.org/learn/schema/) `.graphql` files. See the Microcks' [GraphQL Conventions](./graphql-conventions),
* [HTTP Archive Format (HAR)](https://w3c.github.io/web-performance/specs/HAR/Overview.html) JSON files. See the Microcks' [HAR Conventions](./har-conventions),

Microcks may require those artifact files to follow some conventions in order to collect the valuable information it need. This documentation is a reference of those different conventions for the above mentioned formats.