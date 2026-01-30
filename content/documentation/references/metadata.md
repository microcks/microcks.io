---
draft: false
title: "API Metadata Format"
date: 2024-05-16
publishdate: 2024-05-16
lastmod: 2024-11-04
weight: 5
---

## Introduction

Some Microcks mocks specific metadata or properties cannot be fully deduced from common attributes coming from OpenAPI or AsyncAPI. Thus we should rely on default values can be later overwritten by `manager` within Microcks either using the UI or through the Microcks API.

> 💡 For OpenAPI and AsyncAPI, we introduced [OpenAPI extensions](/documentation/references/artifacts/openapi-conventions/#using-openapi-extensions) and [AsyncAPI extensions](/documentation/references/artifacts/asyncapi-conventions/#using-asyncapi-extensions) to allow providing this informations using `x-microcks` properties.

But sometimes you don't want to add some `x-microcks` extensions attributes into AsyncAPI / OpenAPI document **OR** you'd need to specify these metadata and properties for some other artifact types like [Protobuf](/documentation/references/artifacts/grpc-conventions) + [Postman Collection](/documentation/references/artifacts/postman-conventions) for GRPC mocking for instance 😉.

Hence we propose defining these metadata and properties into a standalone document called an `APIMetadata` ; document that can imported as a `secondary` artifact thanks to the [Multi-Artifacts support](/documentation/explanations/multi-artifacts).

> 💡 For the later gRPC use-case, it means that the [Defining dispatch rules](/documentation/references/artifacts/grpc-conventions/#defining-dispatch-rules) step can be done automatically by importing another artifact that lives right next your files in Git repo.

For ease of use, we provide a [JSON Schema](https://json-schema.org/) that you can [download here](https://microcks.io/schemas/APIMetadata-v1alpha1-schema.json). Thus, you can integrate it in your code editor and benefit from code completion and validation.

`APIMetadata` documents are intended to be imported as `secondary` artifacts only ; thanks to the [Multi-Artifacts support](/documentation/explanations/multi-artifacts).

## API Metadata properties

Let start with an example! Here's below an illustration of what could such an `APIMetadata` document for one API. If you're a reader of the Microcks Blog, you'll notice this sample API with custom dispatching rules was introduced into the [Advanced Dispatching and Constraints for mocks](https://microcks.io/blog/advanced-dispatching-constraints/) post.

```yml 
apiVersion: mocks.microcks.io/v1alpha1
kind: APIMetadata
metadata:
  name: WeatherForecast API
  version: 1.1.0
  labels:
    domain: weather
    status: GA
    team: Team C
operations:
  'GET /forecast/{region}':
    delay: 100
    dispatcher: FALLBACK
    dispatcherRules: |-
      {
        "dispatcher": "URI_PARTS",
        "dispatcherRules": "region",
        "fallback": "Unknown"
      }
```

This example is pretty straightforward to understand and explain:

* This document is related to the `WeatherForecast API` in version `1.1.0`. That means that this API version should already exist into your repository, otherwise the document will be ignored,
* This document specifies additional `labels` used for [Organizing the Microcks repository](/documentation/guides/administration/organizing-repository). This labels will be added to existing ones,
* This document specifies a default `delay` as well as custom dispatching informations for our `GET` operation. The name of operation should perfectly match the name of an existing operation - whether defined through OpenAPI, AsyncAPI, Postman Collection, SoapUI Project or Protobuf definition - otherwise it will be ignored.

> 💡 Note that we can use multi-line notation in YAML but we will have to escape everything and put `\` before double-quotes and `\n` characters if specified using JSON.

The semantic of those attributes are exactly the same that the one introduced into [OpenAPI extensions](/documentation/references/artifacts/openapi-conventions/#openapi-extensions) and [AsyncAPI extensions](/documentation/references/artifacts/asyncapi-conventions/#asyncapi-extensions).

Starting with Microcks `1.11.0`, you can also declare [mock constraints](/documentation/guides/usage/mocks-constraints) into your `APIMetadata` file:

```yaml
apiVersion: mocks.microcks.io/v1alpha1
kind: APIMetadata
metadata:
  name: WeatherForecast API
  version: 1.1.0
  labels:
    domain: weather
    status: GA
    team: Team C
operations:
  'GET /forecast/{region}':
    delay: 100
    parameterConstraints:
      - name: Authorization
        in: header
        required: true
        recopy: false
        mustMatchRegexp: "^Bearer\\s[a-zA-Z0-9\\._-]+$"
      - name: x-request-id
        in: header
        required: true
        recopy: true
```

## Importing API Metadata

When you're happy with your API Metadata just put the result YAML or JSON file into your favorite Source Configuration Management tool, grab the URL of the file corresponding to the branch you want to use and add it as a regular Job import into Microcks. On import, Microcks should detect that it's an `APIMetadata` specification file and choose the correct importer.

Using a `Hello GRPC metadata` example [here](https://raw.githubusercontent.com/microcks/microcks/master/webapp/src/test/resources/io/github/microcks/util/metadata/hello-grpc-v1-metadata.yml), you should get the following screen. Do not forget to tick the **Secondary Artifact** checkbox!

{{< image src="images/documentation/metadata-import.png" alt="image" zoomable="true" >}}