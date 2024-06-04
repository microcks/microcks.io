---
draft: false
title: "GraphQL Mocking and Testing"
date: 2022-01-05
publishdate: 2022-01-05
lastmod: 2022-02-23
weight: 10
---

## Overview

### Introduction

GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools. So that's a perfect fit for Microcks Service | API model and features 😉 

Starting with version `1.5.0`, Microcks is supporting GraphQL mocking and testing thanks to the new [multi-artifacts support](../importers/#multi-artifacts-support) feature. In order to use GraphQL in Microcks, you will need 2 artifacts for each API definition:

* A [GraphQL IDL Schema](https://graphql.org/learn/schema/) definition that holds the API metadata and operations definitions,
* A Postman Collection file that holds the mock examples (requests and responses) for the different operations of the GraphQL API.

### Conventions

In order to be correctly imported and understood by Microcks, your GraphQL IDL and Postman files should follow a little set of reasonable conventions and best practices.

* GraphQL Schema doesn't have the notion of API name or version. In Microcks, this notion is critical and we thus we will need to have a specific comment notation to get this information. You'll need to add a comment line starting with `microcksId:` in your schema file and then referring the `<API name>:<API version>`. See an example below:

```
# microcksId: Movie Graph API : 1.0
schema {
    query: Query
    mutation: Mutation
}
[...]
```

* Your Postman collection description will need to have a name that matches the GraphQL API name and a custom property `version` that matches the above referenced version,
* Your Postman collection will need to organize examples into requests having the same name and url as the GraphQL queries or mutations,
* Your Postman collection will then simply hold examples defined in JSON, defining the value for all different fields of a response. Microcks will later apply field selection as required in GraphQL.

We recommend having a look at our sample GraphQL API for the [Movie Graph API](https://raw.githubusercontent.com/microcks/microcks/master/samples/films.graphql) as well as the [companion Postman collection](https://raw.githubusercontent.com/microcks/microcks/master/samples/films-postman.json) to fully understand and see those conventions in action.

## Illustration

Let's dive in details of our sample `Movie Graph` API.

### Specifying API structure

This is a fairly basic GraphQL API that is inspired by the famous `Film`samples you find on [Graphql.org](https://graphql.org). You can see below the definition using Schema IDL below found in [film-1.0.graphql](https://raw.githubusercontent.com/microcks/microcks/master/samples/film-1.0.graphql) file:

```graphql
# microcksId: Movie Graph API : 1.0
schema {
    query: Query
    mutation: Mutation
}
type Film {
    id: String!
    title: String!
    episodeID: Int!
    director: String!
    starCount: Int!
    rating: Float!
}

type FilmsConnection {
    totalCount: Int!
    films: [Film]
}

input Review {
    comment: String
    rating: Int
}

type Query {
    allFilms: FilmsConnection
    film(id: String): Film
}

type Mutation {
    addStar(filmId: String): Film
    addReview(filmId: String, review: Review): Film
}
```

Considering the first comment line of this file, when imported into Microcks, it will discover the `Movie Graph API` with version `1.0.0` and four operations that are: `allFilms`, `film`, `addStar` and `addReview`.

### Specifying API examples

Specification of examples is done using a Postman Collection as examples cannot be attached to main `GraphQL Schema` and thanks to Microcks `1.3.0` [multi-artifacts support](../importers/#multi-artifacts-support) feature.

Using Postman, just create a new Collection - using the same name as GraphQL API and adding the custom property `version` at the beginning of description like illustrated below:

{{< image src="images/graphql-postman-collection.png" alt="image" zoomable="true" >}}

You can now start organizing and creating requests that are matching with the GraphQL API queries or mutations operation name. For our example, we're specifying the four operations: `allFilms`, `film`, `addStar` and `addReview`.

> If you have imported or define you GraphQL Schema API into Postman, you can also directly create a Collection from it. In that case, Postman will auto-organize content using the `/queries` and `/mutations` folders like below. This is convenient but not required by Microcks.

{{< image src="images/graphql-postman-operations.png" alt="image" zoomable="true" >}}

The next step is now to create a bunch of examples for each of the requests/operations of your Collection as explained by the [Postman documentation](https://www.getpostman.com/docs/postman/collections/examples). You'll give each example a meaningful name regarding the use-case it is supposed to represent. Example url must also match the name of the GraphQL operation method; here we have a simple `{{url}}` because the url at the upper request level but this one must have the `http://allFilms` value.

You'll define examples using simple JSON for request body and for response body as well. Below is a basic example but [Templating expressions and functions](../advanced/templates/) are obviously supported:

{{< image src="images/graphql-postman-example.png" alt="image" zoomable="true" >}}

> One particular things of GraphQL is that it allows API consumers to select the fields they want to have in response. Microcks GraphQL mocks are smart enough to realize that filtering but you should take care to define every possible fields value in your Collection examples. Otherwise, missing fields could not be retrieved by consumers.

### Importing artifacts

Both artifacts should be imported into Microcks either through [direct upload](../importers/#direct-upload) or [scheduled import](/..importers/#scheduled-import). The important thing to notice is that the GraphQL Schema artifact represents the `main` or `primary` artifact for this service definition and that the Postman Collection represents a `secondary` artifact. You have to mention it when importing it otherwise your GraphQL API definition will be overwritten!

### Defining dispatch rules

In order to be able to find response associated to incoming request, Microcks is using the concept of `dispatcher`. Default `dispatcher` and associated `dispatcherRules` for an operation is generally inferred by Microcks at import time but can be later overwritten.

GraphQL API mocks in Microcks support 5 different types of `dispatcher`. The first two can be directly inferred by Microcks during the import of GraphQL Schema:

* `empty` dispatcher means that Microcks will pick the first available response of operation. It is deduced for queries with no arguments like the `allFilms` operation,
* `QUERY_ARGS` dispatcher is deduced for queries or mutations presentation simple [scalar typed](https://graphql.org/learn/schema/#scalar-types) arguments like for example the `film` query that allows finding by identifier.

Other dispatching strategies can then be set up with `dispatcher` and `dispatherRules` customization:

* [`JSON_BODY`](../advanced/dispatching/#json-body-dispatcher) dispatcher can be used for dispatching based on the content of [GraphQL variables](https://graphql.org/learn/queries/#variables). The JSON representing variables is injected as the reference body and is used for evaluation,
* `SCRIPT` dispatcher can be used for dispatching based on the content of the complete HTTP Request body. Basically, you'll receive the whole [POST request](https://graphql.org/learn/serving-over-http/#post-request) and have to return the name of response to return based on whatever criteria,
* [`FALLBACK`](../advanced/dispatching/#fallback-dispatcher) dispatcher can finally be used in combination with any of the 4 other dispatcher to provide fallback behavior.

> You'll be able to directly import these dispatching rules from your Git repository as well, thanks to [API Metadata](../advanced/metadata) documents! Look at the [companion API Metadata file](https://raw.githubusercontent.com/microcks/microcks/master/samples/films-metadata.json) of our sample and try importing it at `secondary` artifact :wink: 