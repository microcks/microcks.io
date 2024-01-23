---
draft: false
title: Microcks 1.4.1 release 🚀
layout: post
date: 2021-10-15
publishdate: 2021-10-15
lastmod: 2021-10-15
image: "/images/blog/microcks-1.4.1-feature.png"
categories: [blog]
author: "Laurent Broudoux"
author_title: "MicrocksIO founder"
author_image: "/images/blog/bio/lbroudoux.jpeg"
author_twitter: "lbroudoux"
---

We are thrilled to announce today the 1.4.1 release of Microcks - the Open source Kubernetes-native tool for API Mocking and Testing. This release is another demonstration of the ability of Microcks to play on both sides with new Enterprise related features but also enhancement towards the Developer eXperience.

You’ll see that we put a lot of effort (and love ❤️) into listening and implementing feedback and ideas from our community: the number of people that suggested, contributed or helped amplify Microcks reach in communities is huge!

Kudos to our community users and partners for supporting and pushing us to this momentum 👏See greetings below.

![microcks-feature](/images/blog/microcks-1.4.1-feature.png)


Let’s do a review of what’s new on each one of our highlights without delay.

> And yes… we screwed things up on the `1.4.0` release… so we directly jump to `1.4.1` instead 😉


## Repository multi-tenancy

Starting with this release, we introduce the ability to segment your APIs & Services repository in Microcks. This feature was critical for some heavy users of Microcks that use it for managing dozens or even hundreds of APIs within their global organization - and we’re very happy to have them on-board to validate the design and implementation early before the release date. Thanks to [Romain Gil](https://github.com/romg66) and [Nicolas Matelot](https://github.com/nmatelot) 🙏

Repository multi-tenancy should be explicitly opted-in and will leverage the labels you assign to APIs & Services. As an example, if you define the `domain` label as the primary label with `customer`, `finance` and `sales` values, you’ll be able to define users with the manager role **only** for the APIs & Services that have been labeled accordingly. Sarah may be defined as a manager for `domain=customer` and `domain=finance` services, while John may be defined as the manager for `domain=sales` APIs & services.

For each and every tenant, Microcks takes care of creating and managing dedicated groups. The Microcks administrator will then be able to assign users to groups easily like illustrated below: 

![group-management](/images/users-group-management.png)


> How to enable and manage a multi-tenant repository? It’s very easy! New options have been added into both Helm Chart and Operator. Check our updated documentation on [activation](https://microcks.io/documentation/using/advanced/organizing/#rbac-security-segmentation) and user [groups management](https://microcks.io/documentation/administrating/users/#group-membership).


### Scaling labels using new APIMetadata

You may have understood that `labels` are an important part in multi-tenancy support but also more generally in repository organization even in a single-tenant configuration. Hence we wanted to make things easier for you to set, update and manage labels at scale. We introduced a new `APIMetadata` descriptor that allows you to specify:

* labels for your API and also,
* operations mocking properties.

This descriptor can live in your Git repository, close to your specification artifacts so that it follows the “Git as the source of truth” principle! Microcks will be able to import it repeatedly to track changes due to API lifecycle, classification, ownership or mocking behaviour. Here’s below the anatomy of such a descriptor configuring labels and operations properties automatically:

```yaml
apiVersion: mocks.microcks.io/v1alpha1
kind: APIMetadata
metadata:
  name: WeatherForecast API
  version: 1.1.0
  labels:
    domain: weather
    status: GA
    team: Team C
operations:
  'GET /forecast/{region}':
    delay: 50
```

> For more information on that feature, checkout the [APIMetadata documentation](https://microcks.io/documentation/using/advanced/metadata/). You can also embed such metadata directly into your [OpenAPI](https://www.openapis.org/) or [AsyncAPI](https://asyncapi.com) specification file. Please pursue your reading to the “OpenAPI & AsyncAPI Specification support” section `😉`


## Developer & Installation eXperiences

As mentioned in the introduction, Developer eXperience was a focus on `1.4.1` and associated with installation enhancements it makes a big theme for this release!

The important addition of this feature is the Docker-compose support for [AsyncAPI](https://asyncapi.com) mocking and testing! It was a long time request not having to go through a Minikube or Kube cluster installation to use AsyncAPI in Microcks. Starting Microcks with AsyncAPI support and embedded Kafka broker is now as easy as:

```sh
$ docker-compose -f docker-compose.yml -f docker-compose-async-addon.yml up -d
```

> Thanks a lot to [Ilia Ternovykh](https://github.com/tillias) 🙏 for having baked this new capability. It has been fully detailed in the [Async Features with Docker Compose](https://microcks.io/blog/async-features-with-docker-compose/) blog post if you want to give it a try!

Aside from this new feature, come a lot of enhancements and capabilities suggested by the community. The most noticeable one are:

* Connecting to a secured [external Kafka broker](https://microcks.io/documentation/installing/deployment-options/#the-kafka-broker-of-your-choice) (using TLS, MTLS or SCRAM) for producing mock messages,
* NodePort ServiceType for Helm Chart install (in alternative to regular Ingress), thanks to [john873950](https://github.com/john873950) 🙏 contrib,
* Resources values override for Keycloak and MongoDB, thanks to [john873950](https://github.com/john873950) 🙏 contrib,
* Configuration of storage classes for Keycloak and MongoDB, thanks to [Mohammad Almarri](https://github.com/ALMARRI) 🙏 suggestion.


## OpenAPI & AsyncAPI specification support

As our corner stones, we can’t release a new Microcks version without enhancing the support of these two specifications! 

The major novelty in this release is the introduction of Microcks specific OpenAPI and AsyncAPI extensions as provided by both specifications. These extensions come in the form of `x-microcks` and `x-microcks-operation` attributes that you may insert into your specification document.

As an example below, `x-microcks` can be used at the information level to specify labels to set on your AsyncAPI (or OpenAPI) once imported into Microcks: 

```yaml
asyncapi: '2.1.0'
info:
  title: Account Service
  version: 1.0.0
  description: This service is in charge of processing user signups
  x-microcks:
    labels:
      domain: authentication
      status: GA
      team: Team B
```

You can also insert a `x-microcks-operation` property at the operation level (or AsyncAPI) to force some response delay or dispatching rules like below: 

```yaml
openapi: '3.1.0'
[...]
    post:
      summary: Add a car to current owner
      description: Add a car to current owner description
      operationId: addCarOp
      x-microcks-operation:
        delay: 100
        dispatcher: SCRIPT
        dispatcherRules: |
          def path = mockRequest.getRequest().getRequestURI();
          if (!path.contains("/laurent/car")) {
            return "Not Accepted"
          }
          def jsonSlurper = new groovy.json.JsonSlurper();
          def car = jsonSlurper.parseText(mockRequest.getRequestContent());
          if (car.name == null) {
            return "Missing Name"
          }
          return "Accepted"
```

> Want to learn more about these extensions? Check our updated [OpenAPI support](https://microcks.io/documentation/using/openapi/#using-openapi-extensions) and [AsyncAPI support](https://microcks.io/documentation/using/asyncapi/#using-asyncapi-extensions) documentation. If embedding our extension into your spec doesn’t please you, you can still use the new `APIMetadata` document like explained in the “Repository organization” section 😇

And of course we produced a number of fixes or enhancements thanks to user feedback that deal with edge cases of these specifications. Let mentioned: 

* One Liner OpenAPI JSON file support,
* Fix OpenAPI to JSON Schema structures conversion for `anyOf`, `oneOf` or `allOf`, discovered by [Ms. Boba](https://github.com/essential-randomness) 🙏,
* Messages polymorphism using `oneOf`, `anyOf` or `allOf` constructions, detected by [ivanboytsov](https://github.com/ivanboytsov)  🙏.


## Community support

Community contributions do not come only from feature requests, bug issues and open discussions. What a pleasure to see people relaying our messages, integrating Microcks in demonstration, inviting us to events or even talking about Microcks!

We’d like to thank the following awesome people:

* [Tamimi Ahmad](https://github.com/TamimiGitHub) 🙏 that invited us to talk about Microcks at the [Solace Community Lightning Talk](https://solace.com/event/solace-community-lightning-talks-2-0/) where we had the opportunity to demonstrate our work. Recording is available on [YouTube](https://www.youtube.com/watch?v=dMnk-jCkBOo),
* The [Solace Dev Community](https://solace.community/)  and [Tamimi Ahmad](https://github.com/TamimiGitHub) 🙏for working on a joint demonstration with their PubSub+ Event Portal product. The demo has been played 2 times during Solace Office Hours at Kafka Summit Americas - recording is available on [KafkaSummit.io](https://kafkasummit.io/virtual-exhibitor/?v0326b739525aaf6a5900c153ea6485e67109462e8db159b156161fc07c7e3d8016769932b4c0398e64b5ea52edb3d1c5=8CE57701960DC72CFEEC2914486E877EC8E915BB1B8FF22FD4AF4DB0EA864B2A38BC29BDAE9AB1040E3570683DD40382) 😉
* [Cloud Nord](https://www.cloudnord.fr/programme2021) 🙏 team for inviting us to talk at their latest event. Recording to come very soon but for french folks only! 
* [Hugo Guerrero](https://github.com/hguerrero ) 🙏for having two talks on Kafka Summit APAC and Americas 2021! Be sure to watch the replay of its [Automated Apache Kafka Mocking and Testing with AsyncAPI](https://kafkasummit.io/session-virtual/?v26dd132ae80017cdaf764437c30ebe6f10c1b1eeaab01165e44366654b368dfaeab6baf7e386a642ecb238989334530e=E64EFD7272E5F3345043B3D69A4D2BBAF2C9E410AC7D32BAC53CCA4ECB3CFD7412D76A6F755F2261D4D4E5CA294B3EAA). Congrats mate! 💪


## What’s coming next?

As usual, we will be very happy to prioritize depending on community feedback : you can check and collaborate via our list of [issues on GitHub](https://github.com/microcks/microcks/issues). We’ll probably also setup some more Twitter polls to get your ideas about:



* protocol addition ([AMQP](https://www.amqp.org/) and [GraphQL](https://graphql.org/) seem to be good candidates at the moment - see [#402](https://github.com/microcks/microcks/issues/402) and [#401](https://github.com/microcks/microcks/issues/401)),
* even easier on-boarding experience for new users (see issue [#484](https://github.com/microcks/microcks/issues/484)),
* community sharing of mocks and tests for regulatory or industrial standards (see this [repository](https://github.com/microcks/hub.microcks.io)),
* more metrics and analytics to govern your APIs with Microcks.

Remember that we are open and it means that you can jump on board to make Microcks even greater! Come and say hi! on our [Zulip chat](https://microcksio.zulipchat.com/) 🐙, simply send some love through [GitHub stars](https://github.com/microcks/microcks) ⭐️ or follow us on [Twitter](https://twitter.com/microcksio) and [LinkedIn](https://www.linkedin.com/company/microcks/).

Thanks for reading and supporting us! Stay safe and healthy. ❤️  
