---
draft: false
title: "Your 1st gRPC mock"
date: 2024-04-30
publishdate: 2024-04-30
lastmod: 2024-08-07
weight: 4
---

## Overview

This tutorial is a step-by-step walkthrough on how to use a [gRPC / Protocol Buffers](https://grpc.io/docs/what-is-grpc/introduction/) specification to get mocks for your gRPC Service. This is hands-on introduction to [gRPC Conventions reference](/documentation/references/artifacts/grpc-conventions) that brings all details on conventions being used.

We will go through a practical example based on the famous PetStore API. We’ll build the reference [petstore-v1.proto](../petstore-v1.proto) file by iterations, highlighting the details to get you starting with mocking gRPC on Microcks.

To complete this tutorial, you will need this two additional tools:
* [Postman](https://www.postman.com/) to define sample data that will be used by your mocks,
* [grpcurl](https://github.com/fullstorydev/grpcurl) to interact with and check your mocks are working as expected (this is optional as you can also do this using Postman but I prefer the command line 😉)

Ready? Go! 💥

## 1. Setup Microcks and Protobuf skeleton

First mandatory step is obviously to setup Microcks 😉. For gRPC usage, we don't need any particular setup and the simple `docker` way of deploying Microcks as exposed in [Getting started](/documentation/tutorials/getting-started) is perfectly suited. 

Run this command below to get your Microcks instance ready:

```shell
docker run -p 8585:8080 -p 8686:9090 -it --rm quay.io/microcks/microcks-uber:latest-native
```

> This could be on other ports if `8585` or `8686` are already used on your machine.

Following the getting started, you should have a Microcks running instance on `http://localhost:8585` with a gRPC server available on `localhost:8686`.

Now let's start with the skeleton of our Protobuf contract for the Petstore Service. We'll start with the definition of three different messages:
* `Pet` is the data structure that represents a registered pet in our store - it has an `id` and a `name`,
* `PetsResponse` is a structure that allows returning many pets as a service method result,
* `AllPetsRequest` is an empty structure that represents the input type of our first method.

We also have the definition of one `getPets()` method that allow returning all the pets in the store. This is over-simplistic but enough to help demonstrate how to do things. Here's the protobuffer contract:

```proto
syntax = "proto3";

package org.acme.petstore.v1;

message Pet {
    int32 id = 1;
    string name = 2;
}

message AllPetsRequest {}

message PetsResponse {
    repeated Pet pets = 1;
}

service PetstoreService {
    rpc getPets(AllPetsRequest) returns (PetsResponse);
}
```

From now, you can save this as a file on your disk, then go to the **Importers** page in the left navigation menu and choose to **Upload** this file. The file should import correctly and you should receive a toast notifiation on the upper right corner. Then, while browsing **APIs | Services**, you should get acess to the following details in Microcks:

{{< image src="images/documentation/first-grpc-initial-import.png" alt="image" zoomable="true" >}}


## 2. Specifying mock data with Postman

We have loaded a gRPC / Protobuf definition in Microcks that correctly discovered the structure of your service, but you have no sample data loaded at the moment. We're going to fix this using Postman and create a [Collection](https://www.postman.com/collection/) to hold our mock data.

In your Postman Workspace, start creating a new standard and empty Collection. As one of [our conventions](/documentation/references/artifacts/postman-conventions/), your Collection must have the full name of your gRPC Service: `org.acme.petstore.v1.PetstoreService`. The documentation summary you put in the Collection must also start with `version=v1` like illustrated below:

{{< image src="images/documentation/first-grpc-collection-creation.png" alt="image" zoomable="true" >}}

Having the **same name and the same version in the Postman Collection is very important** as it will allow Microcks to merge this information with the one from the Protobuf file.

> 🤔 You may wonder the origin of this `v1` version? It's another convention that follows gRPC versioning best practices. As there's no pre-defined way to specify the version of a Protobuf file, the community agreed that the last part of package name will be the version. Microcks has extracted this information from `org.acme.petstore.v1`. Read more on [the gRPC conventions](/documentation/references/artifacts/grpc-conventions/) Microcks is following.


From now, we will use this Collection to specify sample data for our mock. This is a three step process that is illustrated below in the slider (you can the blue dots to freeze the swiper below):

1️⃣ Add a new Request named `getPets`. Change this request to be a `POST` request and update its URL to `http:///getPets`. This will ensure Microcks will asoociate it to the correct gRPC method,

2️⃣ On this request, add a new example with the name of your choice. Edit this example to put an empty object as the request body (`{}`) and a list of Pets as the result body. Your can copy/paste the JSON snippet below:
```json
{ "pets": [ { "id": 1, "name": "Zaza" }, { "id": 2, "name": "Tigress" }, { "id": 3, "name": "Maki" }, { "id": 4, "name": "Toufik" } ] }
```

3️⃣ Finally, export your Collection to a local file with the name of your choice. You can find ours in the [PetstoreService.postman.json](../PetstoreService.postman.json) file.

<div class="swiper single-slider">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      {{< image src="images/documentation/first-grpc-collection-request.png" alt="image" zoomable="true" >}}      
    </div>
    <div class="swiper-slide">
      {{< image src="images/documentation/first-grpc-collection-allpets.png" alt="image" zoomable="true" >}}
    </div>
    <div class="swiper-slide">
      {{< image src="images/documentation/first-grpc-collection-export.png" alt="image" zoomable="true" >}}
    </div>
  </div>
  <div class="swiper-pagination"></div>
</div>

> 🚨 Take care of saving your edits before exporting!


## 3. Basic operation of gRPC service

It's now the moment to import this Postman Collection back in Microcks and see the results! Go to the **Importers** page in the left navigation menu and choose to **Upload** this file. Proceed with care because **this time you need to tick the box** telling Microcks to consider the Collection as a _Secondary Artifact_ like below:

{{< image src="images/documentation/first-grpc-collection-import.png" alt="image" zoomable="true" >}}

Your gRPC service details should now have been updated with the samples you provided via the Postman Collection:

{{< image src="images/documentation/first-grpc-getpets.png" alt="image" zoomable="true" >}}

> 🤔 You may have noticed in the above screenshot that dispatching properties are empty for now. This is normal as we're on a basic operation with no routing logic. We'll talk about dispatchers in next section.

Microcks has found `All Pets` as a valid sample to build a simulation upon. A mock URL has been made available but remember that in our case, we exposed the gRPC port to `8686`. We can use this to test the service method as demonstrated below with a `grpcurl` command:

```shell
$ grpcurl -plaintext -d '{}' localhost:8686 org.acme.petstore.v1.PetstoreService/getPets
{
  "pets": [
    {
      "id": 1,
      "name": "Zaza"
    },
    {
      "id": 2,
      "name": "Tigress"
    },
    {
      "id": 3,
      "name": "Maki"
    },
    {
      "id": 4,
      "name": "Toufik"
    }
  ]
}
```

This is your first gRPC mock 🎉 Nice achievement!

## 4. Using request arguments in gRPC method

Let's make things a bit more spicy by adding request arguments. Now assume we want to provide a simple searching method to retrieve all pets in store using simple filter. We'll end up adding a new `searchPets()` method in our service. Of course, we'll have to define a new `PetSearchRequest` input message so that users will specify `name=zoe` to get all the pets having `zoe` in name.

So we'll add new elements in our Protobuf document like below: a new message and we complete the service with a new `rpc` method: 

```proto
message PetSearchRequest {
    string name = 1;
}

service PetstoreService {
    rpc getPets(AllPetsRequest) returns (PetsResponse);
    rpc searchPets(PetSearchRequest) returns (PetsResponse);
}
```

You can then import the updated Protobuf file into Microcks using the upload dialog but **without ticking the box** as we want to update our service definition and not simply add test data. You can check the updated result:

{{< image src="images/documentation/first-grpc-2-methods.png" alt="image" zoomable="true" >}}

What about the dispatcher property we mentioned earlier? You can see that it now have the `QUERY_ARG` value. Because of the presence of arguments in the new method definition, Microcks has inferred a routing logic based on this argument. If you get access to the operation details, you'll see that the associated rule is `name`. Microcks will use the name to route incoming gRPC request.

Let's complete our Postman Collection with a new request for the new `searchPets` method and a new example for searching for pets having a `k` in their name:

<div class="swiper single-slider">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      {{< image src="images/documentation/first-grpc-collection-searchpets.png" alt="image" zoomable="true" >}}      
    </div>
    <div class="swiper-slide">
      {{< image src="images/documentation/first-grpc-collection-kpets.png" alt="image" zoomable="true" >}}
    </div>
    <div class="swiper-slide">
      {{< image src="images/documentation/first-grpc-collection-export.png" alt="image" zoomable="true" >}}
    </div>
  </div>
  <div class="swiper-pagination"></div>
</div>

> 🚨 Take care of saving your edits before exporting!

Import this updated Postman Collection back in Microcks - **this time you need to tick the box** - and see the results:

{{< image src="images/documentation/first-grpc-searchpets.png" alt="image" zoomable="true" >}}

Let's try the new gRPC method mock with this command:

```shell
$ grpcurl -plaintext -d '{"name": "k"}' localhost:8686 org.acme.petstore.v1.PetstoreService/searchPets
{
  "pets": [
    {
      "id": 3,
      "name": "Maki"
    },
    {
      "id": 4,
      "name": "Toufik"
    }
  ]
}
```

🎉 Fantastic! We now have a mock with routing logic based on request arguments.

> 💡 Microcks dispatcher can support multiple arguments to find appropriate response to an incoming request. In that case, the dispatcher rule will have the form of `arg_1 && arg_2 && arg_3`.

> 🛠️ As an exercice to validate your understanding, just add a new `i pets` sample so that when user specify a filter with value `i`, the 3 correct cats are returned (Tigresse, Maki and Toufik)

## 5. Mocking a creation operation

And now the final step! Let's deal with a new method that allows registering a new pet within the Petstore. For that, you'll typically have to define a new `createPet()` method on the `PetstoreService`. In order to be meaningful to the user of this operation, a mock would have to integrate some logic that reuse contents from the incoming request and/or generate sample data. That's typically what we're going to do in this last section 😉

Let's add such a new operation into the Protobuf file by adding the following elements:

```proto
message PetNameRequest {
    string name = 1;
}

service PetstoreService {
    rpc getPets(AllPetsRequest) returns (PetsResponse);
    rpc searchPets(PetSearchRequest) returns (PetsResponse);
    rpc createPet(PetNameRequest) returns (Pet);
}
```

You can then import the updated Protobuf file into Microcks using the upload dialog but **without ticking the box** as we want to update our service definition and not simply add test data. You can check the updated result:

{{< image src="images/documentation/first-grpc-3-methods.png" alt="image" zoomable="true" >}}

As said above, we want to define a smart mock with some logic. Thankfully, Microcks has this ability to generate [dynamic mock content](/documentation/explanations/dynamic-content). When defining our example in the Postman Collection, we're are going to use two specific notations that are:

* `{{ randomInt(5,10) }}` for asking Microcks to generate a random integer between 5 and 10 for us (remember: the other pets have ids going from 1 to 4),
* `{{ request.body/name }}` for asking Microcks to reuse here the `name` property of the request body. Simply.

Let's complete our Postman Collection with a new request for the new `createPet` method and a new example named `new pet`:

<div class="swiper single-slider">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      {{< image src="images/documentation/first-grpc-collection-createpet.png" alt="image" zoomable="true" >}}      
    </div>
    <div class="swiper-slide">
      {{< image src="images/documentation/first-grpc-collection-newpet.png" alt="image" zoomable="true" >}}
    </div>
    <div class="swiper-slide">
      {{< image src="images/documentation/first-grpc-collection-export.png" alt="image" zoomable="true" >}}
    </div>
  </div>
  <div class="swiper-pagination"></div>
</div>

> 🚨 Take care of saving your edits before exporting!

Import this updated Postman Collection back in Microcks - **this time you need to tick the box** - and verify the results:

{{< image src="images/documentation/first-grpc-createpet.png" alt="image" zoomable="true" >}}

Let's now finally test this new method using some content and see what's going on:

```shell
$ grpcurl -plaintext -d '{"name": "Rusty"}' localhost:8686 org.acme.petstore.v1.PetstoreService/createPet
{
  "id": 6,
  "name": "Rusty"
}
```

As a result we've got our pet name `Rusty` being returned with a new `id` being generated. Ta Dam! 🥳

> 🛠️ As a validation, send a few more requests changing your pet name. You'll check that given name is always returned and the `id` is actual random. But you can also go further by defining an [advanced dispatcher](/documentation/explanations/dispatching/#json-body-dispatcher) that will inspect your request body content to decide which response must be sent back. Very useful to describe different creation or error cases!

## Wrap-up

In this tutorial we have seen the basics on how Microcks can be used to mock responses of a gRPC service. We introduced some Microcks concepts like examples, dispatchers and templating features that are used to produce a live simulation. This definitely helps speeding-up the feedback loop on the ongoing design as the development of a consumer using this service.

Thanks for reading and let us know what you think on our [Discord chat](https://microcks.io/discord-invite) 🐙

