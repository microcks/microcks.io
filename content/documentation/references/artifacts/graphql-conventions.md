---
draft: false
title: "GraphQL Conventions"
date: 2024-05-27
publishdate: 2024-05-27
lastmod: 2024-05-27
weight: 4
---

In order to use GraphQL in Microcks, you will need two artifacts for each API definition as explained in [Multi-artifacts support](/documentation/explanations/multi-artifacts):

* A [GraphQL IDL Schema](https://graphql.org/learn/schema/) definition that holds the API metadata and operations definitions,
* A Postman Collection file that holds the mock examples (requests and responses) for the different operations of the GraphQL API.

### Conventions

In order to be correctly imported and understood by Microcks, your GraphQL IDL and Postman files should follow a little set of reasonable conventions and best practices.

* GraphQL Schema doesn't have the notion of API name or version. In Microcks, this notion is critical and we thus we will need to have a specific comment notation to get this information. You'll need to add a comment line starting with `microcksId:` in your schema file and then referring the `<API name>:<API version>`. See an example below:

```graphql
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

### Dispatchers

GraphQL API mocks in Microcks support 5 different types of [dispatcher](/documentation/explanations/dispatching). The first two can be directly inferred by Microcks during the import of GraphQL Schema:

* `empty` dispatcher means that Microcks will pick the first available response of operation. It is deduced for queries with no arguments like the `allFilms` operation,
* `QUERY_ARGS` dispatcher is deduced for queries or mutations presentation simple [scalar typed](https://graphql.org/learn/schema/#scalar-types) arguments like for example the `film` query that allows finding by identifier.

Other dispatching strategies can then be set up with `dispatcher` and `dispatherRules` customization:

* [`JSON_BODY`](/documentation/explanations/dispatching/#json-body-dispatcher) dispatcher can be used for dispatching based on the content of [GraphQL variables](https://graphql.org/learn/queries/#variables). The JSON representing variables is injected as the reference body and is used for evaluation,
* [`SCRIPT`](/documentation/explanations/dispatching/#script-dispatcher) dispatcher can be used for dispatching based on the content of the complete HTTP Request body. Basically, you'll receive the whole [POST request](https://graphql.org/learn/serving-over-http/#post-request) and have to return the name of response to return based on whatever criteria,
* [`FALLBACK`](/documentation/explanations/dispatching/#fallback-dispatcher) dispatcher can finally be used in combination with any of the 4 other dispatchers to provide fallback behavior.


## Illustration

Let's dive in details of our sample `Movie Graph` API.

### Specifying API structure

This is a fairly basic GraphQL API that is inspired by the famous `Film`samples you find on [Graphql.org](https://graphql.org). You can see below the definition using Schema IDL below found in [films.graphql](https://raw.githubusercontent.com/microcks/microcks/master/samples/films.graphql) file:

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

Specification of examples is done using a Postman Collection as examples cannot be attached to main `GraphQL Schema` and thanks [multi-artifacts support](/documentation/explanations/multi-artifacts) feature.

Using Postman, just create a new Collection - using the same name as GraphQL API and adding the custom property `version` at the beginning of description like illustrated below:

<div align="center">
{{< figure src="images/documentation/graphql-postman-collection.png" alt="image" width="90%" >}}
</div>

You can now start organizing and creating requests that are matching with the GraphQL API queries or mutations operation name. For our example, we're specifying the four operations: `allFilms`, `film`, `addStar` and `addReview`.

> 💡 If you have imported or define you GraphQL Schema API into Postman, you can also directly create a Collection from it. In that case, Postman will auto-organize content using the `/queries` and `/mutations` folders like below. This is convenient but not required by Microcks.

<div align="center">
{{< image src="images/documentation/graphql-postman-operations.png" alt="image" >}}
</div>

The next step is now to create a bunch of examples for each of the requests/operations of your Collection as explained by the [Postman documentation](https://learning.postman.com/docs/sending-requests/response-data/examples). You'll give each example a meaningful name regarding the use-case it is supposed to represent. Example url must also match the name of the GraphQL operation method; here we have a simple `{{url}}` because the url at the upper request level but this one must have the `http://allFilms` value.

You'll define examples using simple JSON for request body and for response body as well. Below is a basic example but [Templating expressions and functions](/documentation/references/templates/) are obviously supported:

<div align="center">
{{< figure src="images/documentation/graphql-postman-example.png" alt="image" width="90%" >}}
</div>

> 💡 One particular things of GraphQL is that it allows API consumers to select the fields they want to have in response. Microcks GraphQL mocks are smart enough to realize that filtering but you should take care to define every possible fields value in your Collection examples. Otherwise, missing fields could not be retrieved by consumers.
