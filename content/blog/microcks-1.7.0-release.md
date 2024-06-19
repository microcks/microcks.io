---
title: Microcks 1.7.0 release 🚀
date: 2023-03-30
image: "images/blog/microcks-1.7.0-feature.png"
author: "Laurent Broudoux"
type: "regular"
description: "Microcks 1.7.0 release 🚀"
draft: false
---

The end of the winter season ☃️ is coming. But unlike our fellow hibernators 🐻, instead of living off stores of fat, our amazing community has worked hard on yet another Microcks release - yes, version `1.7.0` is out 👏

In a few words, here are the highlights of this new release:

* **Some new protocols & connectors**, you asked for it so: [NATS](https://nats.io/), [Google PubSub](https://cloud.google.com/pubsub/docs/overview?hl=en), and [Postman Workspace](https://www.postman.com/product/workspaces/) are now available, 

* **Feature enhancements** see below for further details on issues (Script dispatcher and request context, Enhanced templating,...) integrated into this release,

* **Technical upgrades** to keep main components secure and up-to-date, yes we care about security 🔐 but also green 🍃

* And of course, some bug fixes based on **community feedback** 🙌

Thanks a lot to those who helped push up these significant features once again 🙏

{{< image src="images/blog/microcks-1.7.0-feature.png" alt="image" zoomable="true" >}}

> As we’re entering Spring, a green leaf seems perfectly legit. But once can also see all the interconnected veins that we try to build with the ecosystem 🌍


## New protocols & connector

It has been a long time since we added new protocols & connectors. This release brings three new ones! Let’s start with the Event Driven / Asynchronous protocols.

This new `1.7.0` release brings support for [NATS](https://nats.io) - a very low-latency message oriented middleware that meets growing adoptions in various industries like Gaming, Telco but also FinTech - and [Google PubSub](https://cloud.google.com/pubsub/docs/overview?hl=en) - the Google Cloud global and highly scalable messaging system being the backbone of Google Data Platform. We see big demands of community of these two protocols and we hope to share some nice stories soon 😉

As with the other protocols, we integrate with [AsyncAPI Bindings](https://github.com/asyncapi/bindings/tree/master/amqp) directives that you include into your AsyncAPI document to seamlessly add the NATS or Google PubSub support for your API: 

```yaml
bindings:
  nats:
    queue: my-nats-queue
  googlepubsub:
    topic: projects/my-project/topics/my-topic
```

And of course, you’re not limited to a single protocol binding! Microcks now supports six different protocols for [AsyncAPI](https://www.asyncapi.com/) - enabling you to reuse the same API definition on different protocols depending if you’re using messaging in the organization or at the edge for example. 

{{< image src="images/blog/microcks-1.7.0-protocols.png" alt="image" zoomable="true" >}}


> Whereas mocking just requires adding the binding, testing needs to be familiar with new testing endpoints syntax. Check out our updated [Event-based API test endpoints](https://microcks.io/documentation/references/test-endpoints/#event-based-apis) documentation for that. Complete guides for both protocols have also been published. See the [NATS Guide](https://microcks.io/documentation/guides/usage/async-protocols/nats-support/) and the [Google PubSub Guide](https://microcks.io/documentation/guides/usage/async-protocols/googlepubsub-support/). Thanks to [Jonas Lagoni](https://github.com/jonaslagoni) 🙏 for the awesome contribution on NATS.

With this new release, we also introduce a new connector and importer for filling your Microcks repository with API artifacts: the [Postman Workspace](https://www.postman.com/product/workspaces/) connector. While it was previously necessary to export your Postman Collection as a file to later import it into Microcks, [Jason Miesionczek](https://github.com/JasonMiesionczek) 🙏 asks how we could directly integrate with collaborative workspaces from Postman to remove this extra step. 

{{< image src="images/blog/microcks-1.7.0-workspace.png" alt="image" zoomable="true" >}}

This new integration is now shipped into the `1.7.0` release and the best thing is that it’s totally transparent for users! Just create a new importer with a `https://api.getpostman.com/collections/:collection_uuid` URL pattern (or everything else that conforms to Postman Collection API 😉) and the format will be automatically detected by the importer.

> Check out our [Connect Collection workspace](https://microcks.io/documentation/guides/integration/postman-workspace/) documentation that illustrates how to retrieve your Collection unique identifier and set up the secured connection through API keys if necessary.

## Feature enhancements

### Using Scripting for super-smart dispatching

For a long time Microcks had the `SCRIPT` dispatcher that allows to define mock request dispatching logic using [Groovy](https://groovy-lang.org/) dynamic scripts. However, this feature was mostly unknown and reserved to SoapUI users for portability concerns. This is no longer the case as we have adapted the `SCRIPT` dispatcher to all the different API & Services types in Microcks. So you can now use it for REST but also GRPC or GraphQL as well!

Scripts can be used in Microcks to do a lot of powerful things like:

* analyzing all the elements of a request to decide what response to return,
* calling an external endpoint to get dynamic information to make a dispatching decision,
* computing new data that may be put in the request context to be later used in the response template.

Let's see it in action with the example below that fill a `conditionMsg` context variable that is used later in the `Paris` response:

```groovy
def weatherJson = new URL("https://api.weatherapi.com/v1/current.json?q=Paris).getText()
def condition = new groovy.json.JsonSlurper().parseText(weatherJson).current.condition.text
requestContext.conditionMsg = "Today it's " + condition
return "Paris"
```

And the `Paris` response that now include direct reference to the request context variable:

```json
{"city": "Paris", "message": "{{ conditionMsg }}"}
```

> Have a look at our new documentation on [Script dispatcher](https://microcks.io/documentation/explanations/dispatching/#script-dispatcher) to check typical examples on how to use it. Thanks to [Sébastien Fraigneau](https://github.com/sfraigneau) 🙏 for having suggested the request context features and to [Dorian Brun](https://github.com/dorianbrun) 🙏 for having explored usage with dynamic arrays (see [#751](https://github.com/microcks/microcks/issues/751))!


### Enhanced response and message templates

Response and message templating has also been enhanced to implement requirements from the community like the reuse of generated values. This led us to some refactoring in the templating engine to integrate a new `>` notation that allows for post-processing of values. 

Below you can see a sample on how a generated identifier can be put into the request context in order to be reused later when referencing a primary object:

```json
{
  "primary" : {
    "uuid" : "{{ guid() > put(my-uuid) }}"
  },
  "reference": {
    "primary-uuid": "{{ my-uuid }}"
  }
}
```

> For more information, check the [`put()` function](https://microcks.io/documentation/references/templates/#put-in-context) documentation. Also good to notice that for compatibility purposes, we now support the SoapUI notation for functions or context access within response templates. So your SoapUI `${ }` notation will be translated into Microcks double-mustaches notation `{{ }}` automatically 😉

## Technical upgrades 

Aside from features improvements, the `1.7.0` release also brings a ton of technical upgrades that aims Microcks to be more efficient and secure 🔒. 

Our Java components and associated container images now all rely on OpenJDK [Java 17 ](https://openjdk.org/projects/jdk/17/)and the frameworks we used have been updated to recent versions - [Spring Boot 2.7.8](https://spring.io/blog/2023/01/19/spring-boot-2-7-8-available-now) for the main component and[ Quarkus 2.13.0](https://quarkus.io/blog/quarkus-2-13-0-final-released/) for the asynchronous part. We also conduct different “CVE Hunting” campaigns to lower them at minimum.

> Feel free to check our container images size and security scan results on [Quay.io](https://quay.io/repository/microcks/microcks?tab=tags), the free and open source container registry we’re using for distributing Microcks.

On the topic of efficiency, we also changed two major things in the Microcks `1.7.0` distribution! This release now includes Keycloak 20 that is based on the [Keycloak.X](https://www.keycloak.org/2021/10/keycloak-x-update) distribution - announced a long time ago, but with rather recent stabilized versions - AND all our container images are now all available for [ARM architecture](https://en.wikipedia.org/wiki/ARM_architecture_family).

> This release of Keycloak will bring significantly faster startup time with reduced runtime footprint. Also ARM architecture is reputed to be cheaper and [more efficient](https://www.infoq.com/articles/arm-vs-x86-cloud-performance/) 🌿 especially in the cloud ☁️. Though we haven’t done any comprehensive benchmark at the moment, first feedback from community users is very enthusiastic! 

> For those of you using an external Keycloak that may not have been upgraded to the latest version, we checked the compatibility of Microcks `1.7.0` with Keycloak versions down to `14.0`.

## Community feedback

Community contributions are essential to us and do not come only from feature requests, bug issues, and open discussions. What a pleasure to see people relaying our messages, integrating Microcks in a demonstration, inviting us to events, or even talking about Microcks!

We’d like to thank the following awesome people:

* [Ludovic Pourrat](https://www.linkedin.com/in/ludovic-pourrat/) 🙏 for its awesome talk and super kind mentions of Microcks on [Adding a mock as a service capability to your API strategy portfolio](https://www.slideshare.net/APIdays_official/apidays-paris-2022-adding-a-mock-as-a-service-capability-to-your-api-strategy-portfolio-ludovic-pourrat-lombard-odier) on APIDays Paris December 2022, 

* [Pedro Gute Teira](https://www.linkedin.com/in/pedrogudeteira/) 🙏, [Pablo Curiel](https://github.com/pcuriel) 🙏, [timchase01](https://github.com/timchase01) 🙏, [Sébastien Fraigneau](https://github.com/sfraigneau) 🙏, [spencer-cheng](https://github.com/spencer-cheng) 🙏 and many others for raising bugs or suggesting improvements. 


## What’s coming next?

As we recently [announced our partnership with Postman](https://microcks.io/blog/microcks-partners-with-postman/) to shape the multi-protocol API tooling future, the times ahead are really exciting! We all want the Microcks project to be a neutral and independent space with open collaboration on multi-protocol API topics.

Then, one crucial next step for us will be to set up an open governance and host the project on a neutral foundation in order to ensure the best possible community engagement and our long-term success. We’re currently evaluating the next best actions to help with following goals:

* Allow onboarding of champions in governance through steering committee,
* Amplify awareness and collaboration through community calls, office hours,…
* Ease and increase the contributions on various topics: issues, documentation, blog posts, events,..

Remember that we are an open community, and it means that you too can jump on board to make Microcks even greater! Come and say hi! on our [Github discussion](https://github.com/microcks/microcks/discussions) or [Discord chat](https://microcks.io/discord-invite/) 🐙, simply send some love through [GitHub stars](https://github.com/microcks/microcks) ⭐️ or follow us on [Twitter](https://twitter.com/microcksio), [LinkedIn](https://www.linkedin.com/company/microcks/) and our [YouTube channel](https://www.youtube.com/c/Microcks)!

Thanks for reading and supporting us! ❤️
