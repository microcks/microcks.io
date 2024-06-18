---
draft: false
title: "Main Concepts"
date: 2024-04-29
publishdate: 2024-04-29
lastmod: 2024-05-23
weight: 2
---

Before diving in, it is useful to briefly introduce or recall concepts or terminology we frequently use in the documentation.

## Artifacts

In Microcks, an `Artifact` is an asset that **holds valuable information on how your API or microservices are expected to work**. It is usually represented by a file on your local machine or in a remote version control system.

One of Microcks's beauties is that it uses standard specifications or standard tooling files as Artifacts, allowing you to reuse existing assets. [OpenAPI](https://www.openapis.org/), [AsyncAPI](https://asyncapi.com) specs, [GraphQL](https://graphql.org/), [gRPC](https://grpc.io/) schemas, [Postman](https://www.postman.com/collection/) collections or [SoapUI](https://www.soapui.org/docs/soapui-projects/) projects are all valid artifacts you can feed Microcks with. Microcks will use **constraints and examples** from them to build its knowledge base.

{{< image src="images/documentation/concepts-artifacts.png" alt="Artifacts" zoomable="false" >}}

The more Artifacts you put in Microcks, the richer its knowledge base about your APIs and their versions will be, and the more accurate the `Mocks` and `Tests` that result from this process will be!

## Mocks

`Mocks` - or simulations as we sometimes call them - **are fake API or service implementations** inferred from the aggregated knowledge base. In a nutshell, you feed Microcks with your `Artifacts`, and it immediately produces `Mocks` available on specific endpoints.

You can use these endpoints to play around with your API as if it were real. As an API owner, you can start collecting consumer feedback. As a developer, you can start developing and using this API without bothering with external dependency. You don't even have to write code!

{{< image src="images/documentation/concepts-mocks.png" alt="Mocks" zoomable="true" >}}

Microcks provides smart and transparent mocks. Your consumers don't even notice they are fake! Here again: the more comprehensive `Artifacts` you put in Microcks, the more intelligent your mocks will be!

## Tests

`Tests` are the direct side effect benefits of the Microcks knowledge base! From all the acquired knowledge and samples, Microcks can also **validate that an actual implementation of an API or service conforms to its expectations**.

In the literature, this process is usually called contract or conformance testing and is associated with integration testing methodologies.

{{< image src="images/documentation/concepts-tests.png" alt="Tests" zoomable="true" >}}

From the different `Artifacts` you provided, Microcks can apply different testing strategies ranging from the infrastructure to the business level, reusing information and constraints in various Artifacts.