---
draft: false
title: "Your 1st REST mock"
date: 2024-04-30
publishdate: 2024-04-30
lastmod: 2024-06-18
weight: 3
---

## Overview

This tutorial is a step-by-step walkthrough on how to use [OpenAPI v3 Specification](https://www.openapis.org/) to specify your mocks for your API.
This is hands-on introduction to [OpenAPI Conventions reference](/documentation/references/artifacts/openapi-conventions) that brings all details on conventions being used.

We will go through a practical example based on the famous PetStore API. We'll build the reference [petstore-1.0.0-openapi.yaml](../petstore-1.0.0-openapi.yaml) file by iterations, highlighting the details to get you starting with mocking OpenAPI on Microcks.

Let's start! 💥

## 1. Setup Microcks and OpenAPI skeleton

First mandatory step is obviously to setup Microcks 😉. For OpenAPI usage, we don't need any particular setup and the simple `docker` way of deploying Microcks as exposed in [Getting started](/documentation/tutorials/getting-started) is perfectly suited. Following the getting started, you should have a Microcks running instance on `http://localhost:8585`.

> This could be on another port if `8585` is already used on your machine.

Now let start with the skeleton of our OpenAPI contract for the PetStore API. We'll start with general information on this API and with definition of two different datatypes:

* `NewPet` is the data structure that will be used to register a new pet in our store - it just mandates a `name` attribute,
* `Pet` is an extension of this structure for already registered pets. Once registered a pet has an additional `id` attribute.

This is over-simplistic but enough to help demonstrate how to do things. Here's the YAML representing this part of the OpenAPI contract:

```yaml
openapi: 3.0.2
info:
  title: Petstore API
  version: 1.0.0
  description: |-
    A sample API that uses a petstore as an example to demonstrate features
    in the OpenAPI 3.0 specification and Microcks
  contact:
    name: Microcks Team
    url: 'https://microcks.io'
  license:
    name: Apache 2.0
    url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
components:
  schemas:
    Pet:
      allOf:
        - $ref: '#/components/schemas/NewPet'
        - properties:
            id:
              format: int64
              type: integer
          required:
            - id
    NewPet:
      properties:
        name:
          type: string
      required:
        - name
```

## 2. Basic operation in OpenAPI

Let's now define a first operation to this API. We want give a user the ability to consult her list of favorite pets in the store. Hence, we'll define a `/my/pets` path in our API with a `GET` operation. This operation will just return an array of `Pet` objects.

We're going to add OpenAPI [Example Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#example-object). As this operation does not expect anything as input but just produces a result, we'll add an example called `my_pets` in the response content. Just paste the content below at the end of above skeleton:

```yaml
paths:
  /my/pets:
    get:
      responses:
        "200":
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Pet'
              examples:
                my_pets:
                  value:
                    - id: 1
                      name: Zaza
                    - id: 2
                      name: Tigress
                    - id: 3
                      name: Maki
                    - id: 4
                      name: Toufik
```

Because of the `application/json` content type, we can express examples as JSON or as YAML objects. Examples are really helpful when carefully chosen to represent real-life samples very close to actual functional situation. Here I've put my real cats 🐈 names.

As soon as your contract contains examples, you can import it into Microcks and it will use examples to produce real life simulation of your API. Use the [Direct Upload](/documentation/guides/usage/importing-content/#1-import-content-via-upload) method to inject your OpenAPI file in Microcks. You should get the following result:

{{< image src="images/documentation/openapi-101-basic.png" alt="image" zoomable="true" >}}

> 🤔 You may have noticed in the above screenshot that dispatching properties are empty for now. This is normal as we're on a basic operation with no routing logic. We'll talk about dispatchers in next section.

Microcks has found `my_pets` as a valid sample to build a simulation upon. A mock URL has been made available and you can use it to test the API operation as demonstrated below with a `curl` command:

```sh
$ curl http://localhost:8585/rest/Petstore+API/1.0.0/my/pets -s | jq
[
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
```

This is your first OpenAPI mock 🎉 Nice achievement!

## 3. Using query parameters in OpenAPI

Let's make things a bit more spicy by adding query parameters. Now assume we want to provide a simple searching operation to retrieve all pets in store using simple filter. We'll end up adding a new `GET` operation in your API, bound to the `/pets` path. Of course, we'll have to define the `filter` parameter that will be present in query so that users will query `/pets?filter=zoe` to get all the pets having `zoe` in name.

So we'll add a new path snippet in the `paths` section of our OpenAPI document like below. This snippet is also integrating [Example Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#example-object) for both the query parameter and the response. 

```yaml
paths:
  [...]
  /pets:
    get:
      parameters:
        - name: filter
          in: query
          schema:
            type: string
          examples:
            k_pets:
              value: k  
      responses:
        "200":
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Pet'
              examples:
                k_pets:
                  value:
                    - id: 3
                      name: Maki
                    - id: 4
                      name: Toufik
```

The important things to notice here is the **logic behind example naming**. In fact, OpenAPI specification allows to specify example fragments for each and every piece of a contract. To be tied together by Microcks, related parts must have the same key. Here the key is `k_pets` that allows to link `filter=k` with the associated response containing the 2 cats having a `k` in their name. When imported into Microcks, you should have following result:

{{< image src="images/documentation/openapi-101-query.png" alt="image" zoomable="true" >}}

What about dispatching properties we mentioned earlier? You can see that they now having values. Because of the presence of parameter in your operation, Microcks has inferred a routing logic named `URI_PARAMS` that will be based on matching rule on `filter` parameter. Let's try the mock URL with this command:

```shell
$ curl http://localhost:8585/rest/Petstore+API/1.0.0/pets\?filter\=k -s | jq 
[
  {
    "id": 3,
    "name": "Maki"
  },
  {
    "id": 4,
    "name": "Toufik"
  }
]
```

> 🛠️ As an exercice to validate your understanding, just add a new `i_pets` sample so that when user specify a filter with value `i`, the 3 correct cats are returned (Tigresse, Maki and Toufik)

In this section, we introduced the naming convention that allows tying together elements that allow to define matching request and response elements. This is the foundation mechanism for defining comprehensive examples illustrating functional expectations of your API. Depending on tied elements, Microcks is deducing a dispatching or routing logic depending on incoming request elements. `Dispatcher` is a powerful concept in Microcks that can be [fully customized](/documentation/guides/usage/custom-dispatchers) if inferred ones are not enough for your needs. 

## 4. Using path parameters in OpenAPI

Another very common construction in OpenAPI is the usage of path parameters. Such parameters are directly integrated into API request URL path so that you have the ability to access identified resources. Typically with the Petstore API, you'd want to allow users to use directly the `/pets/1` to access the cat with identifier `1`.

Let's add such a new operation into the API by adding the following path snippet into the `paths` section. Once again, we're integrating [Example Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#example-object) for both the path parameter and the response.

```yaml
paths:
  [...]
  /pets/{id}:
    get:
      parameters:
        - name: id
          in: path
          schema:
            type: string
          examples:
            pet_1:
              value: '1'
            pet_2:
              value: '2'
      responses:
        "200":
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pet'
              examples:
                pet_1:
                  value:
                    id: 1
                    name: Zaza
                pet_2:
                  value:
                    id: 2
                    name: Tigresse
```

You can notice in this snippet that we directly integrates two different samples using the same keys (`pet_1` and `pet_2`) to tie together the example fragments in a coherent way. When imported into Microcks, you should have following result:

{{< image src="images/documentation/openapi-101-path.png" alt="image" zoomable="true" >}}

The `Dispatcher` inferred by Microcks has been adapted to `URI_PARTS` which means that routing logic is made of parts (or path elements) or the URI. The element that is considered for routing is the `id` parameter. Let's tests these new mocks with some commands:

```shell
$ curl http://localhost:8585/rest/Petstore+API/1.0.0/pets/1 -s | jq
{
  "id": 1,
  "name": "Zaza"
}

$ curl http://localhost:8585/rest/Petstore+API/1.0.0/pets/2 -s | jq
{
  "id": 2,
  "name": "Tigresse"
}
```

🎉 Fantastic! We now have a mock with routing logic based on API path elements.

> 💡 Microcks dispatcher can support multiple path elements to find appropriate response to an incoming request. In that case, the dispatcher rule will have the form of `part_1 && part_2 && part_3`. In that case of having multiple parts, you may find it useful to reuse definition of example values using `$ref` notation. This is totally supported by Microcks.

## 5. Mocking a POST operation

And now the final step! Let's deal with a new operation that allows registering a new pet within the Petstore. For that, you'll typically have to define a new `POST` operation on the `/pets` path. In order to be meaningful to the user of this operation, a mock would have to integrate some logic that reuse contents from the incoming request and/or generate sample data. That's typically what we're going to do in this last section 😉

Let's add such a new operation into the API by adding the following path snippet into the `paths/pets` section. The subtlety here is that we're integrating specific elements in our [Example Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#example-object):

```yaml
paths:
  /pets:
    [...]
    post:
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/NewPet'
            examples:
              new_pet:
                value:
                  name: Jojo
      responses:
        "201":
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pet'
              examples:
                new_pet:
                  value: |-
                    {
                      "id": {{ randomInt(5,10) }},
                      "name": "{{ request.body/name }}"
                    }
```

Microcks has this ability to generate [dynamic mock content](/documentation/explanations/dynamic-content). The `new_pet` example fragment above embeds two specific notations that are:

* `{{ randomInt(5,10) }}` for asking Microcks to generate a random integer between 5 and 10 for us (remember: the other pets have ids going from 1 to 4),
* `{{ request.body/name }}` for asking Microcks to reuse here the `name` property of the request body. Simply.

When imported into Microcks, you should have following result:

{{< image src="images/documentation/openapi-101-template.png" alt="image" zoomable="true" >}}

You can see in the picture above that the `Dispatcher` has no value as we have no parameters in operation. But this does not prevent use to use both parameters and template functions. In fact, template also allows you to reuse response parameters to inject in response content. Let's now finally test this mock URL using some content and see what's going on:

```shell
$ curl http://localhost:8585/rest/Petstore+API/1.0.0/pets -H 'Content-Type: application/json' -d '{"name":"Rusty"}' -s | jq
{
  "id": 8,
  "name": "Rusty"
}
```

As a result we've got our pet name `Rusty` being returned with a new `id` being generated. Ta Dam! 🥳

> 🛠️ As a validation, send a few more requests changing your pet name. You'll check that given name is always returned. But you can also go further by defining an [advanced dispatcher](/documentation/explanations/dispatching/#json-body-dispatcher) that will inspect your request body content to decide which response must be sent back. Very useful to describe different creation or error cases!

## Wrap-Up

In this tutorial we have seen the basics on how Microcks can be used to mock responses of an OpenAPI. We introduced some Microcks concepts like examples, dispatchers and templating features that are used to produce a live simulation. This definitely helps speeding-up the feedback loop on the ongoing design as the development of a frontend consuming this API.

Thanks for reading and let us know what you think on our [Discord chat](https://microcks.io/discord-invite) 🐙
