---
draft: false
title: "Your 1st GraphQL mock"
date: 2024-04-30
publishdate: 2024-07-03
lastmod: 2024-07-03
weight: 4
---

## Overview

This tutorial is a step-by-step walkthrough on how to use [GraphQL](https://graphql.org/) schemas to get mocks for your GraphQL API. This is hands-on introduction to [GraphQL Conventions reference](/documentation/references/artifacts/graphql-conventions) that brings all details on conventions being used.

We will go through a practical example based on the famous PetStore API. We’ll build the reference [petstore-1.0.graphql](../petstore-1.0.graphql) file by iterations, highlighting the details to get you starting with mocking GraphQL on Microcks.

To complete this tutorial, you will need one additional tool: [Postman](https://www.postman.com/) to define sample data that will be used by your mocks. To validate that our mock is working correctly, you'll be able to reuse Postman as-well but we'll also provide simple `curl` commands.

Let's go! 💥

## 1. Setup Microcks and GraphQL schema skeleton

First mandatory step is obviously to setup Microcks 😉. For GraphQL usage, we don't need any particular setup and the simple `docker` way of deploying Microcks as exposed in [Getting started](/documentation/tutorials/getting-started) is perfectly suited. Following the getting started, you should have a Microcks running instance on `http://localhost:8585`.

> This could be on another port if `8585` is already used on your machine.

Now let's start with the skeleton of our GraphQL schema for the PetStore API. We'll start with general information on this API and with definition of one type and one query:
* `Pet` is the data structure that represents a registered pet in our store - it has an `id`, a `name` and a `color`,
* `allPets` is the query that allows fetching all the registered pets as an API call result.

One important thing with GraphQL conventions in Microcks is that **we must add an additional specific comment** in this schema file so that we can identity your API name and version (something GraphQL Schema does not allow us to handle by default). The `microcksId:` comment simply identity the API name and version separated with a colon (`:`).

Here's the first iteration of our GraphQL Schema:

```graphql
# microcksId: Petstore Graph API : 1.0
schema {
  query: Query
}

type Pet {
  id: ID!
  name: String!
  color: String!
}

type Query {
  allPets: [Pet]!
}
```

From now, you can save this as a file on your disk, then go to the **Importers** page in the left navigation menu and choose to **Upload** this file. The file should import correctly and you should receive a toast notifiation on the upper right corner. Then, while browsing **APIs | Services**, you should get acess to the following details in Microcks:

{{< image src="images/documentation/first-graphql-initial-import.png" alt="image" zoomable="true" >}}

## 2. Specifying mock data with Postman

We have loaded a GraphQL schema definition in Microcks that correctly discovered the structure of your API, but you have no sample data loaded at the moment. We're going to fix this using Postman and create a [Collection](https://www.postman.com/collection/) to hold our mock data.

In your Postman Workspace, start creating a new standard and empty Collection. As one of [our conventions](/documentation/references/artifacts/postman-conventions/), your Collection must have the full name of your GraphQL API: `Petstore Graph API`. The documentation summary you put in the Collection must also start with `version=1.0` like illustrated below:

{{< image src="images/documentation/first-graphql-collection-creation.png" alt="image" zoomable="true" >}}

Having the **same name and the same version in the Postman Collection is very important** as it will allow Microcks to merge this information with the one from the Protobuf file.

We will use this Collection to specify sample data for our mock. This is a three step process that is illustrated below in the slider (you can the blue dots to freeze the swiper below):

1️⃣ Add a new Request named `allPets`. Change this request to be a `POST` request and update its URL to `http://allPets`. This will ensure Microcks will asoociate it to the correct GraphQL operation,

2️⃣ On this request, add a new example with the name of your choice. Edit this example to put a list of Pets as the result body. Your can copy/paste the JSON snippet below:
```json
{
  "data": {
    "allPets": [
        {"id": "1", "name": "Zaza", "color": "blue"},
        {"id": "2", "name": "Tigress", "color": "stripped"},
        {"id": "3", "name": "Maki", "color": "calico"},
        {"id": "4", "name": "Toufik","color": "stripped"}
    ]
  }
}
```

3️⃣ Finally, export your Collection to a local file with the name of your choice. You can find ours in the [PetstoreGraph.postman.json](../PetstoreGraph.postman.json) file.

<div class="swiper single-slider">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      {{< image src="images/documentation/first-graphql-collection-request.png" alt="image" zoomable="true" >}}      
    </div>
    <div class="swiper-slide">
      {{< image src="images/documentation/first-graphql-collection-allpets.png" alt="image" zoomable="true" >}}
    </div>
    <div class="swiper-slide">
      {{< image src="images/documentation/first-graphql-collection-export.png" alt="image" zoomable="true" >}}
    </div>
  </div>
  <div class="swiper-pagination"></div>
</div>

> 🚨 Take care of saving your edits before exporting!

## 3. Basic query of GraphQL API

It's now the time to import this Postman Collection back in Microcks and see the results! Go to the **Importers** page in the left navigation menu and choose to **Upload** this file. Proceed with care because **this time you need to tick the box** telling Microcks to consider the Collection as a _Secondary Artifact_ like below:

{{< image src="images/documentation/first-graphql-collection-import.png" alt="image" zoomable="true" >}}

Your GraphQL API details should now have been updated with the samples you provided via the Postman Collection:

{{< image src="images/documentation/first-graphql-allpets.png" alt="image" zoomable="true" >}}

> 🤔 You may have noticed in the above screenshot that dispatching properties are empty for now. This is normal as we're on a basic operation with no routing logic. We'll talk about dispatchers in next section.

Microcks has found `allPets` as a valid sample to build a simulation upon. A mock URL has been made available. We can use this to test the query as demonstrated below with a `curl` command:

```shell
$ echo '{ "query":
  "query {
    allPets
  }"
}' | tr -d '\n' | curl \
  -X POST \
  -H "Content-Type: application/json" \
  -s -d @- \
  http://localhost:8585/graphql/Petstore+Graph+API/1.0

{
  "data":{
    "allPets":[
      {
        "id":"1",
        "name":"Zaza",
        "color":"blue"
      },
      {
        "id":"2",
        "name":"Tigress",
        "color":"stripped"
      },
      {
        "id":"3",
        "name":"Maki",
        "color":"calico"
      },
      {
        "id":"4",
        "name":"Toufik",
        "color":"stripped"
      }
    ]
  }
}
```

This is nice! However remember that one of GraphQL most powerful feature is to allow consumers to specify the data they actually need. What if we only care about pets `id` and `color`? Let's try a new filtered query:

```shell
$ echo '{ "query":
  "query {
    allPets {
      id
      color
    }
  }"
}' | tr -d '\n' | curl \
  -X POST \
  -H "Content-Type: application/json" \
  -s -d @- \
  http://localhost:8585/graphql/Petstore+Graph+API/1.0

{
  "data":{
    "allPets":[
      {
        "id":"1",
        "color":"blue"
      },
      {
        "id":"2",
        "color":"stripped"
      },
      {
        "id":"3",
        "color":"calico"
      },
      {
        "id":"4",
        "color":"stripped"
      }
    ]
  }
}
```

Fantastic! 🙌 Microcks is applying GraphQL semantics and filter your mock data!

> 💡 As a consequence you understand **the importance with GraphQL of providing value for all the mock attributes**. This doesn't mean that your consumers will receive everything but you'll oferr them the ability to apply GraphQL semantics.

This is your first GraphQL mock 🎉 Nice achievement!

## 4. Using query variables in GraphQL query

Let's make things a bit more elaborated by adding query arguments. Now assume we want to provide a simple searching method to retrieve all pets in store using simple filter. We'll end up adding a new `searchPets()` method in your API. Of course, we'll have to define a `name` input argument so that users will specify `name=zoe` to get all the pets having `zoe` in name.

So we'll add a new query in our GraphQL schema like below:

```graphql
type Query {
  allPets: [Pet]!
  searchPets(name: String!): [Pet]
}
```

You can then import the updated GraphQL file into Microcks using the upload dialog but **without ticking the box** as we want to update our service definition and not simply add test data. You can check the updated result:

{{< image src="images/documentation/first-graphql-2-operations.png" alt="image" zoomable="true" >}}

What about the dispatcher property we mentioned earlier? You can see that it now have the `QUERY_ARG` value. Because of the presence of arguments in the new query definition, Microcks has inferred a routing logic based on this argument. If you get access to the operation details, you'll see that the associated rule is `name`. Microcks will use the name to route incoming GraphQL query.

Let's complete our Postman Collection with a new request for the new `searchPets` method and a new example for searching for pets having a `k` in their name. This time it can be useful to provide also an example for the request body that is now using a **variable** identified with `$name`:

<div class="swiper single-slider">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      {{< image src="images/documentation/first-graphql-collection-searchpets.png" alt="image" zoomable="true" >}}      
    </div>
    <div class="swiper-slide">
      {{< image src="images/documentation/first-graphql-collection-kpets.png" alt="image" zoomable="true" >}}
    </div>
    <div class="swiper-slide">
      {{< image src="images/documentation/first-graphql-collection-export.png" alt="image" zoomable="true" >}}
    </div>
  </div>
  <div class="swiper-pagination"></div>
</div>

> 🚨 Take care of saving your edits before exporting!

Import this updated Postman Collection back in Microcks - **this time you need to tick the box** - and see the results:

{{< image src="images/documentation/first-graphql-searchpets.png" alt="image" zoomable="true" >}}

Let's try the new GraphQL query mock with this command, this time specifying the `variables` property to provide a name:

```shell
$ echo '{ "query":
  "query search($name: String) {
    searchPets(name: $name)
  }",
  "variables": {
    "name": "k"
  }
}' | tr -d '\n' | curl \
  -X POST \
  -H "Content-Type: application/json" \
  -s -d @- \
  http://localhost:8585/graphql/Petstore+Graph+API/1.0

{
  "data":{
    "searchPets":[
      {
        "id":"3",
        "name":"Maki",
        "color":"calico"
      },
      {
        "id":"4",
        "name":"Toufik",
        "color":"stripped"
      }
    ]
  }
}
```

🎉 Fantastic! We now have a mock with routing logic based on request arguments.

> 💡 Microcks dispatcher can support multiple arguments to find appropriate response to an incoming request. In that case, the dispatcher rule will have the form of `arg_1 && arg_2 && arg_3`.

> 🛠️ As an exercice to validate your understanding, just add a new `i pets` sample so that when user specify a filter with value `i`, the 3 correct cats are returned (Tigresse, Maki and Toufik). Once both cases are passing, you can also try some more advanced query like the one below. Yes, Microcks supports advanced GraphQL semantics like composite queries and fragments 😉

```shell
$ echo '{ "query":
  "{
    k_pets: searchPets(name: \"k\") {
      ...comparisonFields
    }
    i_pets: searchPets(name: \"i\") {
      ...comparisonFields
    }
  }

  fragment comparisonFields on Pet {
    name
  }"
}' | tr -d '\n' | curl \
  -X POST \
  -H "Content-Type: application/json" \
  -s -v -d @- \
  http://localhost:8585/graphql/Petstore+Graph+API/1.0

{
  "data":{
    "k_pets":[
      {"name":"Maki"},
      {"name":"Toufik"}
    ],
    "i_pets":[
      {"name":"Tigress"},
      {"name":"Maki"},
      {"name":"Toufik"}
    ]
  }
}
```

## 5. Mocking a mutation operation

And now the final step! Let's deal with a new method that allows registering a new pet within the Petstore. For that, you'll typically have to define a new `createPet()` method on the `PetstoreService`. In order to be meaningful to the user of this operation, a mock would have to integrate some logic that reuse contents from the incoming request and/or generate sample data. That's typically what we're going to do in this last section 😉

Let's add such a new operation into the Protobuf file by updating the schema and adding the following elements:

```graphql
schema {
  query: Query
  mutation: Mutation
}

type NewPet {
  name: String!
  color: String!
}

type Mutation {
  createPet(newPet: NewPet!): Pet
}
```

You can then import the updated GraphQL Schema file into Microcks using the upload dialog but **without ticking the box** as we want to update our service definition and not simply add test data. You can check the updated result:

{{< image src="images/documentation/first-graphql-3-operations.png" alt="image" zoomable="true" >}}

As said above, we want to define a smart mock with some logic. Thankfully, Microcks has this ability to generate [dynamic mock content](/documentation/explanations/dynamic-content). When defining our example in the Postman Collection, we're are going to use three specific notations that are:

* `{{ randomInt(5,10) }}` for asking Microcks to generate a random integer between 5 and 10 for us (remember: the other pets have ids going from 1 to 4),
* `{{ request.body/variables/newPet/name }}` for asking Microcks to reuse here the `name` property provided as a variable in the request body.
* `{{ request.body/variables/newPet/color }}` for asking Microcks to reuse here the `color` property provided as a variable in the request body. Simply.

Here's the final snippet of the response body you may want to copy/paste:

```json
{
  "data": {
    "createPet": {
      "id": "{{ randomInt(5,10) }}",
      "name": "{{ request.body/variables/newPet/name }}",
      "color": "{{ request.body/variables/newPet/color }}"
    }
  }
}
```

Let's complete our Postman Collection with a new request for the new `createPet` method and a new example named `new pet`:

<div class="swiper single-slider">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      {{< image src="images/documentation/first-graphql-collection-createpet.png" alt="image" zoomable="true" >}}      
    </div>
    <div class="swiper-slide">
      {{< image src="images/documentation/first-graphql-collection-newpet.png" alt="image" zoomable="true" >}}
    </div>
    <div class="swiper-slide">
      {{< image src="images/documentation/first-graphql-collection-export.png" alt="image" zoomable="true" >}}
    </div>
  </div>
  <div class="swiper-pagination"></div>
</div>

> 🚨 Take care of saving your edits before exporting!

Import this updated Postman Collection back in Microcks - **this time you need to tick the box** - and verify the results:

{{< image src="images/documentation/first-graphql-createpet.png" alt="image" zoomable="true" >}}

Let's now finally test this new method using some content and see what's going on:

```shell
$ echo '{ "query":
  "mutation createPet($newPet: NewPet) {
    createPet(review: $newPet) {
        id
        name
        color
    }
  }",
  "variables": {
    "newPet": {
      "name": "Rusty",
      "color": "harlequin"
    }
  }
}' | tr -d '\n' | curl \
  -X POST \
  -H "Content-Type: application/json" \
  -s -d @- \
  http://localhost:8585/graphql/Petstore+Graph+API/1.0

{
  "data":{
    "createPet":{
      "id":"5",
      "name":"Rusty",
      "color":"harlequin"
    }
  }
}
```

As a result we've got our pet name `Rusty` being returned with a new `id` being generated. Ta Dam! 🥳

> 🛠️ As a validation, send a few more requests changing your pet name. You'll check that given name is always returned and the `id` is actual random. But you can also go further by defining an [advanced dispatcher](/documentation/explanations/dispatching/#json-body-dispatcher) that will inspect your request variables content to decide which response must be sent back. Very useful to describe different creation or error cases!

## Wrap-up

In this tutorial we have seen the basics on how Microcks can be used to mock responses of a GraphQL API. We introduced some Microcks concepts like examples, dispatchers and templating features that are used to produce a live simulation. This definitely helps speeding-up the feedback loop on the ongoing design as the development of a consumer using this API.

Thanks for reading and let us know what you think on our [Discord chat](https://microcks.io/discord-invite) 🐙