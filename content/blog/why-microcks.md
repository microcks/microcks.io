---
title: Why Microcks?
date: 2020-10-20
image: "images/blog/why-microcks.png"
author: "Laurent Broudoux"
type: "regular"
description: "Why Microcks?"
draft: false
---

Microcks recently reached a key milestone as we officially announced on Aug 11th 2020 the release of [Microcks 1.0.0](https://microcks.io/blog/microcks-1.0.0-release/), being our first General Availability (GA) version. With it we deliver the promise of providing *an enterprise-grade solution to speed up, secure and scale your API strategy for the digital era* — whatever the type of services or API.

As we have received massive supportive feedback since August, we consider it a great opportunity to take some time to come back to the reasons why we started Microcks, especially for the newcomers. Surprisingly enough, we explain a lot why mocking and testing are necessary in today’s cloud-native area - see [Mocking made easy with Microcks](https://www.openshift.com/blog/mocking-microservices-made-easy-microcks) - but do not spend that much time on why we were not satisfied with existing solutions.

So here’s a little refresher that will give you insights on why we started Microcks ? We’ll develop this through three main concerns.

{{< image src="images/blog/why-microcks.png" alt="image" zoomable="true" >}}

## #1 Business requirements without translation

One huge problem in software development is the translation mismatch we usually face between business requirements and product release - you don’t learn anything new here isn’t it ? Business Lines people usually produce some spec documents that are translated into software packages, API contracts and so on. These one are then put into a Git repository and thrown away to the CI/CD pipelines or staging and release process.

<figure class="tc">
  {{< image src="images/blog/why-microcks-spec.png" alt="image" zoomable="true" >}}
  <figcaption><i class="f5">Fig 1: Specifications produced as documents are “translated” into software packages <br/> and API contracts. Translation leads to drifts from initial expectations.</i></figcaption>
</figure>

As agile and DevOps practices - like [CI/CD](https://en.wikipedia.org/wiki/CI/CD), [mocking](https://en.wikipedia.org/wiki/Mock_object) and [continuous testing](https://en.wikipedia.org/wiki/Continuous_testing) - tend to become mainstream, the feedback loop is getting shorter. However even the mocks and the tests are suffering from this translation mismatch !

Existing tools that propose writing code for mocks are contributing to this mismatch. Sure, they are helpful because they are lightweight and easy to start with. But at the end of the day, you have no guarantee that what was written is actually the perfect translation of the business expert knowledge.

At Microcks we were thinking of using the concepts of example-driven design and executable specification to help define API and microservices contracts. Those concepts are both simple and powerful: just express your specification as examples - in the case of API and services it means request and response examples - and reuse them as the acceptance rules for produced software. We saw it as a way that allows Business Line experts and Developers to collaborate and produce a **contract definition** ; eliminating the translation and the drift risk.

<figure class="tc">
  {{< image src="images/blog/why-microcks-examples.png" alt="image" zoomable="true" >}}
  <figcaption><i class="f5">Fig 2: Specifications produced as examples within API contracts represent <br/> the “source of truth”. It eliminates drifting risks.</i></figcaption>
</figure>

Sure software code still has to be written for implementing the behaviour but provided examples will allow to provide fully accurate mocks faster so that dependant consumers may start playing with the API immediately. From these examples, we are also able to deduce a comprehensive test suite that will validate the implementation when ready. 

At the time we investigated first Microcks prototypes in early 2015, a bunch of standards and toolings arose that would be of great help making these ideas real. Supporting standards was a no-brainer for us and luckily enough the [OpenAPI](https://www.openapis.org/) and [AsyncAPI](https://www.asyncapi.com/) specifications were handling examples ! We saw it as the confirmation of the crucial role of examples as we foresaw it. We were also truly convinced that toolings had a great role to play to foster collaboration between personas. So we extended the range of possibilities and now Microcks supports all these formats as contract definition.

<figure class="tc">
  {{< image src="images/blog/why-microcks-standards.png" alt="image" zoomable="true" >}}
  <figcaption><i class="f5">Fig 3: Supported standards and tools in Microcks.</i></figcaption>
</figure>

So at first sight, Microcks is a tool that follows example-driven designs to build mocks and tests from standard specifications and collaborative design toolings. But there’s more ...

## #2 Scaling the practice with less resources & more efficiency

Our second concern - and thus the reason for starting Microcks - was about scaling the practice of mocking and contract testing. When things are growing up and you want to apply those practices in many applications or at a large organization level, you start encountering many new issues ! Since we have entered a cloud-native era where APIs, microservices and event-driven architecture are all the rage, the growth and troubles are now a reality.

From our experience, the following questions arose very rapidly :

* How to share contracts and mock definitions so that everyone uses the same set of definitions for the same APIs ?
* How to limit the resources dedicated to mocking ? If everybody is popping dedicated services for mocking, you could have **a lot of resources used just** for mocking,
* How to keep everything up-to-date and in sync, avoiding spending time refreshing definitions in different places ?
* How to embrace the diversity of technologies ? Conciliating green-field APIs and the legacy WebServices we usually build our new API on top ...

We face these challenges on a day-to-day basis working with companies that have to deal with hundreds or even thousands of API and microservices across their whole organisation. 

Most of the existing tools propose running the mock services on the developer laptop or within the CI/CD pipeline. This leads to many developers running a lot of short-lived de-synchronized mocks locally. Imagine building an application with a dozen dependencies and a team of a dozen developers. This made more than 100 mocks to configure, run and keep up-to-date as the development sprints are coming. This model is simply not viable at scale!

<figure class="tc">
  {{< image src="images/blog/why-microcks-distributed.png" alt="image" zoomable="true" >}}
  <figcaption><i class="f5">Fig 4: Running mocks on developer’s laptop or build servers imply synchronization efforts <br/> and a lot of consumed resources. This model is not scalable.
</i></figcaption>
</figure>

We were looking for a scalable model with no risk of having out-of-sync mocks with later changes. That’s why we built Microcks using a platform approach. In an organisation, Microcks can be deployed centrally and connected to the various Git repositories. It will take care of **discovering and syncing contract definitions** for your APIs and provide always up-to-date endpoints mocking the last committed changes. It will also keep the history of all previously managed and deployed versions of your APIs and services - and thus help with their governance and natural referencing.

<figure class="tc">
  {{< image src="images/blog/why-microcks-platform.png" alt="image" zoomable="true" >}}
  <figcaption><i class="f5">Fig 5: Microcks is central, lightweight, always-in-sync with API contracts in Git <br/> and provides always-up and scalable mocks.
</i></figcaption>
</figure>

For Microcks we wanted a fully dynamic mocking model: you don’t need to generate nor re-deploy artifacts or packages when updating your interface or datasets. It provides a powerful matching engine to find correct answers for incoming mocking requests whilst consuming few resources. It also provides API and CI/CD engine integration for launching compliance tests when implementations are ready. And of course, these features are available for all the types of API and services within the organization: REST API, SOAP WebServices and Event-based API that are using [Apache Kafka](https://kafka.apache.org/) or some other message brokers.

The platform approach of Microcks solves many of the issues that come with maturity and expansion of the API mocking and testing practices. You may think it brings some constraints in the way you operate it or the location you deploy it ... Let’s see that in the next section.

## #3 Everywhere & automated

One of our strong belief - whilst we entered the cloud-native era - was that the advent of API would be global to all industries. However all of them will have different cloud adoption strategies. As such, organisations will need API and services mocking and testing capabilities on public cloud as well as on-premises infrastructures for legacy / regulatory / security concerns.

Despite being a “platform” Microcks could not impose any deployment location. Also the hybrid nature of cloud adoption will certainly drive multiple Microcks instances to **segregate contract definitions** per Business Unit / visibility scope / security zones or other criteria. We surely need a deployment model providing flexibility as well as ease of operations. 

Within our team we’re early adopters of containers and Kubernetes. So the choice was natural to make Microcks Kubernetes-native from day 1. But we do not just “run on Kubernetes” ; we integrate all the ecosystems like Operators, Helm, Autoscalers and so on to provide you the easiest and automated operational experience.

<figure class="tc">
  {{< image src="images/blog/why-microcks-deployment.png" alt="image" zoomable="true" >}}
  <figcaption><i class="f5">Fig 6: Deployment options for Microcks: on-premises or on the cloud.</i></figcaption>
</figure>

Microcks relies on Kubernetes as the abstraction layer of infrastructure and thus gives you the choice of deployment location. Whether on public cloud providers managed services or on in-house Kubernetes distribution, you’ll be able to deploy and scale Microcks. And you’ll be able to do that easily, repeatedly, with a very low resources footprint and in a fully automated way. 

## Microcks does mocks differently! 

As a wrap-up of this “Why Microcks?” manifesto, we’d like you to remember this definition: *Microcks is an Open Source Kubernetes-native tool for API Mocking and Testing. It provides an enterprise-grade solution to speed up, secure and scale your API strategy for the digital era.*

It is “simply” doing API mocking and testing but differently: 

* It promotes **collaborative example-driven design principles** : you do not write code, your Business experts just describe examples as we believe in the true value of real-life samples with no translation in-between,
* It supports **open standards for contract definitions** and also support mainstream open collaborative tools : it do not impose you a design process nor tooling and foster reuse of existing assets,
* It provides **efficient, resource effective** dynamic mocking capabilities that **solve the synchronisation and governance issues** your organisation will face at scale,
* It embraces all the different technologies that are REST, SOAP and event-based APIs. It is not just a tool for the latest trendy API style. It offers a **consistent approach whatever the type of API,**
* It can be deployed easily **on-premises as well on all the major cloud providers** managed services. Thanks to Kubernetes and Operators it provides easy and automated operational experience.

Last but not least, Microcks is fully Open Source and community driven. So jump in if you’re interested in it!

