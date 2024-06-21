---
draft: false
title: "gRPC Conventions"
date: 2024-05-27
publishdate: 2024-05-27
lastmod: 2024-06-20
weight: 5
---

In order to use gRPC in Microcks, you will need two artifacts for each service definition as explained in [Multi-artifacts support](/documentation/explanations/multi-artifacts):

* A [gRPC / Protocol Buffers](https://grpc.io/docs/what-is-grpc/introduction/) file definition that holds the Service metadata and operations definitions,
* A Postman Collection file that holds the mock examples (requests and responses) for the different operations of the gRPC Service.

## Conventions

In order to be correctly imported and understood by Microcks, your gRPC and Postman files should follow a little set of reasonable conventions and best practices.

* As of today Microcks only supports `proto3` syntax as it is now the default and encouraged version from gRPC community,
* gRPC doesn't have the notion of Service version. In Microcks, this notion is critical and we will use the package information from the **proto file** to compute a version.

    * For package names containing more than 2 path levels, we'll extract the last one as being the version. So `package io.github.microcks.grpc.hello.v1;` will produce version `v1`
    * We'll keep unchanged shorter package named, so `package com.acme;` will produce version `com.acme` that is not very unique 😞.
    * So be sure to follow [gRPC versioning best practices](https://docs.microsoft.com/en-us/aspnet/core/grpc/versioning?view=aspnetcore-5.0#version-number-services)!

* Your Postman collection description will need to have a **name** that matches the gRPC service name and a custom property `version` that matches the above computed version,
* Your Postman collection will need to organize examples into requests having the same name and url as the gRPC methods,
* Your Postman collection will hold examples defined in JSON as JSON is a textual format easier to use than binary Protobuf 😅

We recommend having a look at our sample gRPC for [HelloService](https://raw.githubusercontent.com/microcks/microcks/master/samples/hello-v1.proto) as well as the [companion Postman collection](https://raw.githubusercontent.com/microcks/microcks/master/samples/HelloService.postman.json) to fully understand and see those conventions in action.


## Dispatchers

gRPC service mocks in Microcks supports 4 different types of [dispatcher](/documentation/explanations/dispatching):

* `empty` dispatcher means that Microcks will pick the first available response of operation,
* [`QUERY_ARGS`](/documentation/explanations/dispatching/#inferred-dispatchers) dispatcher can be inferred automatically at import time. It is used for dispatching based on the content of the gRPC Request if this one is made of [Protobuff scalar types](https://protobuf.dev/programming-guides/proto3/#scalar) (string, integer, boolean, float, ...) excepted `bytes`,
* [`JSON_BODY`](/documentation/explanations/dispatching/#json-body-dispatcher) dispatcher can be used for dispatching based on the content of the complete gRPC Request body translated in JSON,
* [`SCRIPT`](/documentation/explanations/dispatching/#script-dispatcher) dispatcher can be used for dispatching based on the content of the complete gRPC Request body translated in JSON.

{{< image src="images/documentation/grpc-dispatch-rule.png" alt="image" zoomable="true" >}}


## Illustration

Let's dive in details of our sample `io.github.microcks.grpc.hello.v1.HelloService` gRPC service.

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

Considering the `package` of this **proto file**, when imported into Microcks, it will discover the `io.github.microcks.grpc.hello.v1.HelloService` service with version `v1` and the unique operation `greeting`.

### Specifying Service examples

Specification of examples is done using a Postman Collection as examples cannot be attached to main **proto file** and thanks [multi-artifacts support](/documentation/explanations/multi-artifacts) feature.

Using Postman, just create a new Collection - using the same name as gRPC Service and adding the custom property `version` at the beginning of description like illustrated below:

<div align="center">
{{< figure src="images/documentation/grpc-postman-collection.png" alt="image" width="90%" >}}
</div>

You can now start organizing and creating requests that are matching with the gRPC service method name. For our example, we're specifying the `greeting` request for the `greeting` gRPC method.

<div align="center">
{{< figure src="images/documentation/grpc-postman-operations.png" alt="image" width="60%" >}}
</div>

The next step is now to create a bunch of examples for each of the requests/operations of your Collection as explained by the [Postman documentation](https://learning.postman.com/docs/sending-requests/response-data/examples/). You'll give each example a meaningful name regarding the use-case it is supposed to represent. Example url should also match with the name of the gRPC method; here we have a simple `http:///greeting`.

<div align="center">
{{< figure src="images/documentation/grpc-postman-example.png" alt="image" zoomable="true" width="90%"  >}}
</div>

### Defining dispatch rules

If the default inferred dispatchers don't match with your use-case, you'll need an additional step for assembling data coming from gRPC Protofile and Postman Collection is to define how to dispatch requests. For gRPC, your can typically use a `JSON_BODY` or a `SCRIPT` dispatcher as mentionned above.

You can use a [Metadata artifact](/documentation/references/metadada) for that or directly edit the dispatcher in the Web UI. Here-after we have defined a simple rule that is routing incoming requests depending on the value of the `firstname` property of the incoming message.

{{< image src="images/documentation/grpc-dispatch-rule.png" alt="image" zoomable="true" >}}
