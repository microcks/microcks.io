---
title: Advanced Dispatching and Constraints for mocks
date: 2021-01-28
image: "images/blog/advanced-dispatching-constraints.jpg"
author: "Laurent Broudoux"
type: "regular"
description: "Advanced Dispatching and Constraints for mocks"
draft: false
---

The purpose of this post is to explain the advanced dispatching and constraint features available when mocking a REST API using Microcks. As I recently went again through the documentation answering questions on our [Discord chat](https://microcks.io/discord-invite), I realized that all the pieces were present but we did not have any overall example showing how to use them!

So I setup this new example based on a real life use-case our community users have submitted. It is based on a very simple `WeatherForecast API` that has just one `GET` endpoint for fetching the forecast. This endpoint has two query parameters:
* `region` (one of the four cardinal points) allows to specify the zone to fetch,
* `apiKey` is a parameter allowing to identify API caller and apply tracing, rate limits and so on...

<figure class="tc">
  {{< image src="images/blog/advanced-dispatching-constraints.jpg" alt="image" zoomable="true" >}}
<br> Photo by <a href="https://unsplash.com/@jordanmadrid?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Jordan Madrid</a> on <a href="https://unsplash.com/s/photos/compass?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></i></figcaption>
</figure>

We'll see how to configure advanced mocking rules in Microcks so that requests will be routed to correct responses based on `region` value and `apiKey` will be checked as mandatory even if we do not care of the actual value. If user specified an unknown region, the mock should return a fallback response. 

## Let's start!

Let's start by importing the below OpenAPI contract into your running Microcks instance. As this is a [GitHub gist](https://gist.github.com/lbroudoux/75b4ea340d5ddecf9b27a06e7f18ab6d) you may easily retrieve it. If you already have many APIs in the repository, you'll find this one having the name `WeatherForecast API` with version `1.0.0`.

<style type="text/css">
  .gist-file .gist-data {max-height: 540px}
</style>

<script src="https://gist.github.com/lbroudoux/75b4ea340d5ddecf9b27a06e7f18ab6d.js"></script>

Some important things to notice in this OpenAPI specification:
* There's a single `GET` operation definition starting at line 16,
* We defined `north`, `east`, `west` and `south` examples for `200` response - see lines 50 to 74 - as well as examples with the same names for `region` query parameter - see lines 23 to 29,
* We defined an `unknown` example for the `404` response - see lines 82 and 83 - as well as an example with same name for query parameter - see line 21,
* We defined an `apiKey` query parameter starting at line 37 but did not specify any example as it makes no sense for random values.

Once imported into Microcks, you should have the same result as below screenshot:

{{< image src="images/blog/advanced-dispatching-constraints-init.png" alt="image" zoomable="true" >}}

Some important things to notice here on how Microcks has interpreted the data coming from the OpenAPI specification:
* It has inferred that this dispatcher will be based on `URI_PARAMS` (see [Your 1st REST mock](https://microcks.io/documentation/tutorials/first-rest-mock/#3-using-query-parameters-in-openapi) for introduction on dispatchers),
* Is has inferred that this dispatcher will take care of two parameters being `region` and `apiKey`,
* It has discovered 5 request/response sample pairs (see [OpenAPI Usage Conventions](https://microcks.io/documentation/references/artifacts/openapi-conventions/) for detailed explanations). Each request is holding an example **Mock URL** for invoking it.

As soon as it has been imported, new mock endpoints are available and you can start playing around with the mocks like illustrated with below commands: 

```sh
$ curl https://microcks.apps.example.com/rest/WeatherForecast+API/1.0.0/forecast\?region\=east -k -s | jq .
{
  "region": "east",
  "temp": -6.6,
  "weather": "frosty",
  "visibility": 523
}

$ curl https://microcks.apps.example.com/rest/WeatherForecast+API/1.0.0/forecast\?region\=north -k -s | jq . 
{
  "region": "north",
  "temp": -1.5,
  "weather": "snowy",
  "visibility": 25
}
```

OK! So the default is working pretty well but we'll need to add our constraint related to `apiKey` and manage our fallback response as well 😉

## Adding constraint

We need to add constraint on `apiKey` query parameter so that requests that do not have this parameter will be refused by Microcks. In Microcks you can easily add constraints to an operation when accessing the **Edit Properties** page from API summary. You'll just need to have the `manager` or `admin` role assigned.

Once on the properties edition for the `GET /forecast` operation, add a new constraint like illustrated below: 

{{< image src="images/blog/advanced-dispatching-constraints-add-constraint.png" alt="image" zoomable="true" >}}

Do not forget to hit the **Save** button and then you can re-try calling a mock endpoint:

```
$ curl https://microcks.apps.example.com/rest/WeatherForecast+API/1.0.0/forecast\?region\=east -k       
Parameter apiKey is required. Check parameter constraints.% 
```

🎉 Perfect! Our constraint now applies correctly. Getting back on the API summary page and looking at the operation details, you'll see that a new **Parameter Constraints** block has appeared explaining the constraint:

{{< image src="images/blog/advanced-dispatching-constraints-constraint-added.png" alt="image" zoomable="true" >}}

So far so good but now let's try adding the `apiKey` parameter to our requests:

```sh
$ curl https://microcks.apps.example.com/rest/WeatherForecast+API/1.0.0/forecast\?region\=east\&apiKey\=qwertyuiop -k -s | jq .
{
  "region": "north",
  "temp": -1.5,
  "weather": "snowy",
  "visibility": 25
}

$ curl https://microcks.apps.example.com/rest/WeatherForecast+API/1.0.0/forecast\?region\=west\&apiKey\=qwertyuiop -k -s | jq .
{
  "region": "north",
  "temp": -1.5,
  "weather": "snowy",
  "visibility": 25
}
```

Seems to be OK at first sight but wait... we are now receiving the same response whatever the requested `region`! What the hell!? 🧐

## Adjusting dispatcher rules

The problem is now that we supply `apiKey` and remember that `apiKey` belongs to the dispatching rules. When receiving a request, Microcks is looking for a response associated to the `qwertyuiop` value for `apiKey` and because we do not have defined examples for `apiKey` it finds nothing... Its fallback behaviour is then to answer with the first response it finds - here the `north` response.

From there you have two options:
* Define a set of possible values for `apiKey` within the OpenAPI specification examples. This will add complexity and a number of examples to manage if you're managing combinations of parameters,
* Simply tall Microcks to not worry about the `apiKey` value when dispatching to a response. This makes a lot of sense here as this parameter is purely technical!

Obviously we choose the second option and get back to the **Edit Properties** page for this operation. Just below the parameter constraints we have used previously, we have the ability to change the dispatching properties. We'll simply tell Microcks to keep the current dispatcher but we'll adapt the rules to only let `region` as the sole dispatching criterion:

{{< image src="images/blog/advanced-dispatching-constraints-adapt-rules.png" alt="image" zoomable="true" >}}

Once saved, you will be able to test again the different mock URLs for the four regions and you'll see that now you're getting the response associated with each requested region:

```sh
$ curl https://microcks.apps.example.com/rest/WeatherForecast+API/1.0.0/forecast\?region\=west\&apiKey\=qwertyuiop -k -s | jq .
{
  "region": "west",
  "temp": 12.2,
  "weather": "rainy",
  "visibility": 300
}

$ curl https://microcks.apps.example.com/rest/WeatherForecast+API/1.0.0/forecast\?region\=south\&apiKey\=qwertyuiop -k -s | jq .
{
  "region": "south",
  "temp": 28.3,
  "weather": "sunny",
  "visibility": 1500
}
```

🎉 Excellent! We solved our routing issue. But let's try now with an unknown `center` region:

```sh
$ curl https://microcks.apps.example.com/rest/WeatherForecast+API/1.0.0/forecast\?region\=center\&apiKey\=qwertyuiop -s | jq .
{
  "region": "north",
  "temp": -1.5,
  "weather": "snowy",
  "visibility": 25
}
```

We still got default fallback response because Microcks cannot find any response associated with the `center` region... 🤨

## Changing dispatcher

In order to address our final requirement - having a proper 404 response if region is unknown - we will have to change the dispatcher that was inferred by Microcks. Let's get back to the **Edit Properties** page for the operation once again and now change the dispatcher to `FALLBACK` value. You'll see documentation appearing on the right with the ability to copy-paste the example.

> The `FALLBACK` dispatcher is a new feature from `1.2.0` release. Depending on the day you are reading this post it may be possible that the release it not yet available. If you need it urgently please use the `latest` version of Microcks. This feature is already enabled there and will be available till 1.2.0 announcements.

The `FALLBACK` dispatcher behaves kinda like a `try-catch` wrapping block in programming: it will try applying a first dispatcher with its own rule and if it find nothings it will default to the `fallback` response. Configure this dispatcher as shown below: picking the `unknown` response as the one representing our fallback.

{{< image src="images/blog/advanced-dispatching-constraints-adapt-dispatcher.png" alt="image" zoomable="true" >}}

Hit the **Save** button and test again the previous curl command, you'll see that you're now receiving the `404` response called `unknown`: 

```sh
$ curl https://microcks.apps.example.com/rest/WeatherForecast+API/1.0.0/forecast\?region\=center\&apiKey\=qwertyuiop -k
Region is unknown. Choose in north, west, east or south.%
```

🎉 TADAM! Now when getting back the API summary page and checking the `GET /forecast` operation details, you'll see that dispatcher and dispatching rules have been updated to display your new configuration:

{{< image src="images/blog/advanced-dispatching-constraints-final.png" alt="image" zoomable="true" >}}

## Wrap-up

In this blog post, we walked through a *near real-life* sample explaining Microcks default dispatching engine as well as advanced customizations available. We saw that default configuration deduced only from the OpenAPI specification is a great start but does not allow to handle more advanced scenario where we need little smartness. Microcks is proposing advanced constructs for [Parameters Constraints](hhttps://microcks.io/documentation/guides/usage/mocks-constraints/) and [Dispatching Rules](https://microcks.io/documentation/explanations/dispatching/): we only scratched the surface here!

You may think that setting up these configuration may be cumbersome but remember that you'll only have to do it once! Microcks will keep your customizations upon subsequent imports - as long as you keep the same operation name of course 😉

As a primer on what's coming next on Microcks, we plan to integrate some [OpenAPI Specifications Extensions](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.3.md#specificationExtensions) so that these customizations could live directly within the specification file:

```yaml
paths:
  /forecast:
    get:
      operationId: GetForecast
      summary: Get forecast for region
      x-microcks-dispatcher: FALLBACK
      x-microcks-dispatcherRules:
        dispatcher: URI_PARAMS
        dispatcherRules: region
        fallback: unknown
```

If interested in this feature, do not hesitate commenting or voting for the [GitHub issue](https://github.com/microcks/microcks/issues/311)!

Take care and stay tuned. ❤️