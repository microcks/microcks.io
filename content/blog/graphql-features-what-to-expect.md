---
title: "GraphQL features in Microcks: what to expect?"
date: 2022-01-07
image: "images/blog/graphql-features.png"
author: "Laurent Broudoux"
type: "regular"
description: "GraphQL features in Microcks: what to expect?"
draft: false
---


In various 2021 reports, [GraphQL](https://graphql.org) has been spotted as one of the most exciting technologies to consider for APIs. It is a query language and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

At Microcks, we also identified the importance of GraphQL and thought that’s a perfect fit for Microcks model and features 😉 This post is a walkthrough of the coming GraphQL features in Microcks `1.5.0` to be released in a few weeks. It will give you insight on the GraphQL feature set we will support and how it works underneath. 

{{< image src="images/blog/graphql-features.png" alt="image" zoomable="true" >}}

You’ll see that GraphQL is no different from the other API standards we are supporting in Microcks like [OpenAPI](https://openapi.org), [AsyncAPI](https://asyncapi.org) and [gRPC](https://grpc.io). We stick to our mantra of providing a homogeneous approach whatever the technology stack, embracing diversity. But GraphQL flexibility from the consumer point of view was another opportunity to demonstrate the smartness of our engine and hence deserved this blog post.

Before diving into the mocking and testing features, let’s just have a quick review at what you’ll need to use them on Microcks.

## What you’ll need?

In respect of the **contract-first** approach we’re big supporters of and rely on, you’ll first need a GraphQL Schema - expressed using the [Schema Definition Language](https://graphql.org/learn/schema/) - to import operations definition of your API into Microcks.

As a GraphQL schema doesn’t support the notion of examples - contrary to OpenAPI and AsyncAPI specifications - you’ll rely on a [Postman Collection](https://www.postman.com/collection/) that holds your mock dataset as examples.

Thanks to the [multi-artifacts support](https://microcks.io/documentation/explanations/multi-artifacts/) feature we introduced in release `1.3.0`, Microcks will be able to import both resources as **primary** and **secondary** artifacts to merge information and build a consolidated view of your GraphQL API.

{{< image src="images/blog/graphql-artifacts.png" alt="image" zoomable="true" >}}

If you need some illustration for better understanding, feel free to check out our [GtiHub repository](https://github.com/microcks/microcks/tree/1.5.x/samples), focusing on the `films*` resources for our `Movie Graph API` - version `1.0` detailed thereafter.

## Mocking GraphQL API features

After having defined and imported required artifacts, let’s have a tour of different features using our `Movie Graph API` - version `1.0` sample.

### Introspection Queries

It's often useful to ask a GraphQL schema for information about what queries it supports. For that, GraphQL has specified the [introspection system](https://graphql.org/learn/introspection/). A system we implemented in Microcks! So once you have the mock endpoint URL of your API, you can use smart GUI clients like [Insomnia](https://insomnia.rest) to start playing around with your API and discover queries and data structure.

{{< image src="images/blog/graphql-introspection.png" alt="image" zoomable="true" >}}

### Field Selection and fragments

At its very core, GraphQL query is about [selecting a set of fields](https://graphql.org/learn/queries/#fields) on objects. That’s obviously a feature we support in Microcks. You can issue different requests matching the same response but with different field selections : Microcks will apply filtering on response content to adapt it to the specific set required by the client.

Here below in the capture, we redefined the set of required fields and see that the response has been filtered to fit these fields.

{{< image src="images/blog/graphql-selection.png" alt="image" zoomable="true" >}}

Fields selection can also be expressed using [fragments](https://graphql.org/learn/queries/#fragments) that will centralize selection definition. Microcks supports fragment spreads and associated definitions in a transparent way. Fragments are notably very useful for the next feature…

### Multi-queries and aliases

One GraphQL query can embed different queries and selections to invoke on the server side. When using this multi-queries construction, the consumer will also need to define [aliases](https://graphql.org/learn/queries/#aliases) that will be reused by the provider when formatting the aggregated response. This feature is handled by Microcks mocks so that you can combine many operations within one mock invocation like illustrated below:

{{< image src="images/blog/graphql-aliases.png" alt="image" zoomable="true" >}}

### Arguments and variables

GraphQL has the ability to pass arguments to queries or mutations. In Microcks as in the specification, these arguments can be passed either inline or using a variable notation that references a query variables element defined as JSON alongside the query.

When you define a GraphQL operation that uses only GraphQL [scalar types](https://graphql.org/learn/schema/#scalar-types), Microcks automatically uses a new `QUERY_ARGS` dispatcher that analyses arguments values to match the corresponding response in your sample. This allows Microcks to have smart mock behavior to implement common queries and mutations like `findFilmById` or `findFilmByRating` or `addStartToFilmWithId` and so on.

### Mutation with custom type

You can also choose to use [custom types](https://graphql.org/learn/schema/#object-types-and-fields) as query or mutation arguments! Microcks will not be able to automatically infer dispatching rules in that case unfortunately. But it will allow you to define your own smart dispatcher simply, using the [`JSON BODY`](https://microcks.io/documentation/explanations/dispatching/#json-body-dispatcher) dispatcher. With this one you’ll be able to easily define an evaluation rule on the query variables JSON to return the response to the client.

Here below you can see an example of query variables JSON that will be evaluated to return the correct Film to add review to:

{{< image src="images/blog/graphql-variables.png" alt="image" zoomable="true" >}}

### Advanced features

We already got a bunch of exciting features but it’s worth noting that some other features of Microcks are obviously still available for GraphQL mocking as well!

We can mention here:

* [Templating expressions and functions](https://microcks.io/documentation/references/templates/) - so that you can include dynamic or random content into your mocks responses using notations like `{{ guid() }}` or `{{ request.body/filmId }}`,
* [`FALLBACK`](https://microcks.io/documentation/explanations/dispatching/#fallback-dispatcher) dispatcher if you want some complex `try-catch` behavior in your matching rules when dispatching to a response,
* `SCRIPT` dispatcher that offers you all the power of [Groovy](https://groovy-lang.org/) scripting to request dispatching (documentation to come soon).


## Testing GraphQL API features

Besides the mocking features in Microcks, there’s always the second side of the coin: the testing features!

Testing a GraphQL API in Microcks means that we’ll reuse the different unitary operations of your API against a Test Endpoint that represents the backend implementation of this API. For each and every example in your API, Microcks will invoke the backend and record the exchanged request and responses. Request is recorded using the [HTTP POST representation](https://graphql.org/learn/serving-over-http/#post-request) of a GraphQL query ; response is recorded as is. After this recording step, Microcks will finally perform a validation step to check that returned response is conforming to the GraphQL Schema defining your API. This will allow to mark the test as passed ✅ or failed ❌.

{{< image src="images/blog/graphql-test.png" alt="image" zoomable="true" >}}

As usual with other API technologies, tests in Microcks can be launched through the UI, the [API](https://microcks.io/documentation/guides/automation/api/), [Jenkins Plugin](https://microcks.io/documentation/guides/automation/jenkins/), [GitHub Action](https://microcks.io/documentation/guides/automation/github-actions/), [Tekton Task](https://microcks.io/documentation/guides/automation/tekton/) or simple [CLI](https://microcks.io/documentation/guides/automation/cli/) for full automation.

For the technical readers, one subtle detail to notice is that in fact a GraphQL Schema does not allow direct validation of a response content. GraphQL Schema is much more like a grammar defining the range of possibilities for a response. In GraphQL, actual response validation can only be done if you precisely know what was requested by the client.

We think we find an elegant solution to this problem when implementing validation in Microcks. As we precisely know the request sent to the tested backend and have the GraphQL Schema at hand, Microcks is dynamically building a new [JSON schema](https://json-schema.org) for each request - merging request information with schema information. This in-memory representation of JSON schema is then used to validate the response from the backend and be sure we’re doing validation as specific as possible. 🥳

## Enthusiastic?

We hope this walkthrough has made you enthusiastic about this new set of features coming in January in Microcks `1.5.0`. The best thing is that you don't have to wait for the release to test them out!

Everything is always present in the `1.5.x` branch of the [GitHub repository](https://github.com/microcks/microcks/tree/1.5.x) and in the `nightly` tagged container image. So starting playing with this new GraphQL support is as simple as this one-liner:

```shell
$ git clone https://github.com/microcks/microcks.git && cd microcks \
    && git fetch && git checkout 1.5.x && cd install/docker-compose \
    && docker-compose up -d
````

Now just open your browser on [http://localhost:8080](http://localhost:8080) and connect with `admin/microcks123` 🚀

As usual, we’re eager for community feedback: come and discuss on our [Discord chat](https://microcks.io/discord-invite/) 🐙

Thanks for reading and supporting us!
