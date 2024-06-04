---
draft: false
title: "gRPC Mocking and Testing"
date: 2021-06-29
publishdate: 2021-06-29
lastmod: 2022-02-23
weight: 9
---

## Overview

### Introduction

In gRPC, a client application can directly call a method on a server application on a different machine as if it were a local object, making it easier for you to create distributed applications and services. As in many RPC systems, gRPC is based around the idea of defining a service, specifying the methods that can be called remotely with their parameters and return types. So that's a perfect fit for Microcks Service | API model and features 😉 

Starting with version `1.3.0`, Microcks is supporting gRPC mocking and testing thanks to the new [multi-artifacts support](../importers/#multi-artifacts-support) feature. In order to use gRPC in Microcks, you will need 2 artifacts for each Service definition:

* A gRPC / Protocol Buffers file definition that holds the Service metadata and operations definitions,
* A Postman Collection file that holds the mock examples (requests and responses) for the different operations of the gRPC Service.

### Conventions

In order to be correctly imported and understood by Microcks, your gRPC and Postman files should follow a little set of reasonable conventions and best practices.

* As of today Microcks only supports `proto3` syntax as it is now the default and encouraged version from gRPC community,
* gRPC doesn't have the notion of Service version. In Microcks, this notion is critical and we will use the package information in `Protofile` to compute a version.

    * For package name containing containing more than 2 paths levels, we'll extract the last one as being the version. So `package io.github.microcks.grpc.hello.v1;` will produce version `v1`
    * We'll keep unchanged simplest package named, so `package com.acme;` will produce version `com.acme` that is not very unique 😞.
    * So be sure to follow [gRPC versioning best practices](https://docs.microsoft.com/en-us/aspnet/core/grpc/versioning?view=aspnetcore-5.0#version-number-services)!

* Your Postman collection description will need to have a name that matches the gRPC service name and a custom property `version` that matches the above computed version,
* Your Postman collection will need to organize examples into requests having the same name and url as the gRPC methods,
* Your Postman collection will hold examples defined in JSON as JSON is a textual format easier to use than binary Protobuf 😅

We recommend having a look at our sample gRPC for [HelloService](https://raw.githubusercontent.com/microcks/microcks/master/samples/hello-v1.proto) as well as the [companion Postman collection](https://raw.githubusercontent.com/microcks/microcks/master/samples/HelloService.postman.json) to fully understand and see those conventions in action.

## Illustration

Let's dive in details of our sample `HelloService` gRPC service.

### Specifying Service structure

This is a fairly trivial gRPC Service that just greet new comers. You can see below the definition found in [hello-v1.proto](https://raw.githubusercontent.com/microcks/microcks/master/samples/hello-v1.proto).

```proto
syntax = "proto3";

package io.github.microcks.grpc.hello.v1;

option java_multiple_files = true;

message HelloRequest {
    string firstname = 1;
    string lastname = 2;
}

message HelloResponse {
    string greeting = 1;
}

service HelloService {
    rpc greeting(HelloRequest) returns (HelloResponse);
}
```

Considering the `package` of this proto file, when imported into Microcks, it will discover the `HelloService` with version `v1` and the unique operation `greeting`.

### Specifying Service examples

Specification of examples is done using a Postman Collection as examples cannot be attached to main `Profofile` and thanks to Microcks `1.3.0` [multi-artifacts support](../importers/#multi-artifacts-support) feature.

Using Postman, just create a new Collection - using the same name as gRPC Service and adding the custom property `version` at the beginning of description like illustrated below:

{{< image src="images/grpc-postman-collection.png" alt="image" zoomable="true" >}}

You can now start organizing and creating requests that are matching with the gRPC service method name. For our example, we're specifying the `greeting` request for the `greeting` gRPC method.

{{< image src="images/grpc-postman-operations.png" alt="image" zoomable="true" >}}

The next step is now to create a bunch of examples for each of the requests/operations of your Collection as explained by the [Postman documentation](https://www.getpostman.com/docs/postman/collections/examples). You'll give each example a meaningful name regarding the use-case it is supposed to represent. Example url should also match with the name of the gRPC method; here we have a simple `http:///greeting`.

As JSON / Protobuf translation is bi-directional, you'll define examples using simple JSON for request body and for response body as well. Below is a basic example but [Templating expressions and functions](../advanced/templates/) are obviously supported:

{{< image src="images/grpc-postman-example.png" alt="image" zoomable="true" >}}

Finally, when you have defined all examples and optional test scripts on your requests, you should export your Collection as a JSON file using the Collection v2 format like shown below. Just put the result JSON file into your favorite Source Configuration Management tool for an easy integration with Microcks.

### Importing artifacts

Both artifacts should be imported into Microcks either through [direct upload](../importers/#direct-upload) or [scheduled import](/..importers/#scheduled-import). The important thing to notice is that the gRPC Protofile artifact represents the `main` or `primary` artifact for this service definition and that the Postman Collection represents a `secondary` artifact. You have to mention it when importing it otherwise your gRPC definition will be overwritten!

### Defining dispatch rules

The final step for assembling data coming from gRPC Protofile and Postman Collection is to define how to dispatch requests. As explained into [Using exposed mocks](../mocks), Microcks is using `Dispatcher` and `Dispatching Rules` for finding an appropriate response to return when receiving a mock request. For gRPC, we can typically use a `JSON_BODY` dispatcher as explained into [Custom dispatching rules](../advanced/dispatching/#json-body-dispatcher).

> Starting with Microcks `1.4.0`, you'll be able to directly import these dispatching rules from your Git repository as well, thanks to [API Metadata](../advanced/metadata) documents!

Before Microcks `1.4.0` you should use the Microcks web console to edit the `greeting` operation properties and change the dispatcher and its rules as shown below. Here-after we have defined a simple rule that is routing incoming requests depending on the value of the `firstname` property of the incoming message.

{{< image src="images/grpc-dispatch-rule.png" alt="image" zoomable="true" >}}
