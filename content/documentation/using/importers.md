---
draft: false
title: "Importing Services & APIs"
date: 2020-02-26
publishdate: 2020-02-26
lastmod: 2020-02-26
menu:
  docs:
    parent: using
    name: Importing Services & APIs
    weight: 5
toc: true
weight: 30 #rem
---

## Introduction

Once you get your Microcks instance up and running, the next step is to start adding some Services or APIs into its internal repository. We've seen in this [Getting Started](../../getting-started/#loading-samples) section how to quickly load samples into the repository. This page will drive you through the complete explanations of supported formats and import mechanisms present into Microcks.

## Supported formats

As previously introduced, Microcks *"turns out your API contract into live mocks in seconds"* - the noticeable part of these sentence being **API contract**. The cool things here is that is does not require you to produce another document: it is able to reuse existing **artifacts** that you may gather Microcks with. In order to be usable by Microcks, such artifacts should hold syntactical contracts but also full samples on how your Service is expected to work - and this is only possible by embedding complete pairs of requests and responses.

Microcks supports the folloming editing tools and export/import formats as **artifacts** formats:

![artifacts-formats](/images/artifacts-formats.png)

We provide built-in parsers and importers for the following formats:

* [SoapUI projects](https://www.soapui.org/soapui-projects/soapui-projects.html) files starting with the version 5.1 or SoapUI. See our [documentation](../soapui/) on some conventions you should follow for this project structure,
* [Postman collecitons](https://learning.postman.com/docs/postman/collections/data-formats/) files with v1.0 or v2.x file format. See our [documentation](../postman/) on some conventions you should follow for this collection structure,
* [Apicurio Studio](https://apicurio-studio.readme.io/docs/integrate-microcks-for-mocking-your-api) direct integration when working on OpenAPI 3.x API specifications,
* [OpenAPI v3.x](http://spec.openapis.org/oas/v3.0.3) files whether using the YAML of JSON format. See our [documentation](../openapi/) on some conventions you should follow for this specification,

> People very often ask *"Why the Swagger format - aka OpenApi 2.0 - isn't supported by Microcks?"*. This is because Swagger is incomplete for specifying mocks as it does not allow full specifications of examples. Sure, the Swagger spec allows you to illustrate responses with samples but it does not allow you to do so with request or request parameters (whether in path, query or headers). And if some tools - like Swagger UI - seems to compose sample requests, they're only doing this using schema information with random generated values...

If you own a bunch of Swagger specifications, you won't be able to directly import thme into Microcks - see the above note on the reason why. Thus, you will need to have an extra step and use a wrapper tool (Postman or SoapUI) for adding complete requests / responses pairs that will be used as the basis of your API real-life mocks.

![artifacts-swagger-adaptations](/images/artifacts-swagger-adaptations.png)

> Please notice that the same issue and workaround may apply to some others API specification formats like [WADL](https://www.w3.org/Submission/wadl/) or [RAML](https://raml.org/). They've got really good importers for Postman or SoapUI that offers you a very easy way to complete your syntactic specification with some real life samples that can make the genesis for useful mocks ;-)

## Direct upload



## Scheduled import

![artifacts-scheduling](/images/artifacts-scheduling.png)

### Creating a new scheduled import

![importer-status](/images/importer-status.png)

![importer-step1](/images/importer-step1.png)

![importer-step3](/images/importer-step2.png)

![importer-step3](/images/importer-step3.png)