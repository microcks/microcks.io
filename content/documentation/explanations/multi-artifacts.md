---
draft: false
title: "Multi-artifacts support"
date: 2024-04-30
publishdate: 2024-04-30
lastmod: 2024-05-27
weight: 8
---

## Introduction

Microcks can have multiple artifacts (one `primary` and many `secondary`) mapping to one API definition. The `primary` one will bring API or Service and operation metadata and examples. The `secondary` ones will only enrich existing operations with new non-conflicting requests/responses and event samples.

A typical illustration of this may be using an [OpenAPI](https://www.openapis.org/) specification as a `primary` one and then bringing one (or many) additional [Postman](https://www.postman.com/collection/) collections to provide examples or test constraints.

{{< image src="images/documentation/artifacts-merging.png" alt="image" zoomable="true" >}}

In that case, Microcks is first fed with an OpenAPI file to get the main identification and structure information about the API or Service. This allows Microcks to initialize its internal metamodel for the discovered API. Then, Microcks will load the secondary artifacts and try to merge new non-conflicting information into the preexisting internal metamodel. The merging process is based on a compound key: the API **name** + **version**.

If not explicitly identified as `primary` or `secondary,` the default is to consider an imported artifact as the primary one. Microcks will simply ignore a `secondary` artifact if it doesn't match any existing API name + version.

> 💡 Note that the `secondary` artifact is not necessarily a Postman Collection. It can also be some other artifacts like [HTTP Archive Format (HAR)](https://w3c.github.io/web-performance/specs/HAR/Overview.html) file, for example. Check our reference on [Supported artifacts and conventions](/documentation/references/artifacts/).

## Usage for different protocols

For specific types of APIs and protocols, loading multiple artifacts for the same API definition may be necessary. Typically, when a single artifact is not able to handle a comprehensive set of examples, we need to rely on `secondary` artifacts to provide those examples. 

It is then mandatory to use multiple artifacts in Microcks for [GraphQL](https://graphql.org/), [gRPC](https://grpc.io/) and [Swagger v2](https://swagger.io/specification/v2/) defined APIs as the `primary` artifacts that provide the structure are not able to hold complete examples (yes, even Swagger v2 doesn't allow complete examples 😉)

{{< image src="images/documentation/artifacts-merging-protocols.png" alt="image" zoomable="true" >}}

> 💡 Here again, the `secondary` artifact is not necessarily a Postman Collection just used for illustration purpose. Check our reference on [Supported artifacts and conventions](/documentation/references/artifacts/).

Also, note that multiple artifacts for one API definition don't necessarily involve different specifications and file formats! The merging process in Microcks is generic, so you can use the same format multiple times. For example, you may want to use an OpenAPI specification as a `primary` one and apply some overlay by managing examples into other OpenAPI files.

{{< image src="images/documentation/artifacts-merging-overlay.png" alt="image" zoomable="true" >}}

One specific case of the merging process - that can be used in combination with any other artifact as a `primary` one - relates to the [Microcks APIMetadata](/documentation/references/metadada) format. When importing such artifacts as secondary ones, the merging process involves the metadata of the API or Service and not the examples or tests as illustrated below:

{{< image src="images/documentation/artifacts-merging-metadata.png" alt="image" zoomable="true" >}}

## Opportunities

Microcks's multi-artifacts support is a flexible and powerful feature that opens many opportunities for managing your artifacts.

An emerging use case is that some people may have a single OpenAPI file containing only base/simple examples but manage complementary/advanced examples using, for example, a Postman Collection.

One can extend this base use case to implement some variations:

* Different Postman collections for different lifecycle environments, maintained in coordination with reference datasets,
* Different Postman collections for different API providers implementing a shared industrial standard (think of IoT [Fiware](https://www.fiware.org/) implementation but for different industry verticals),
* Different Postman collections for different API consumers that will allow consumer-driven contract testing.
