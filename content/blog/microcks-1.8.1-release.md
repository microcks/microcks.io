---
draft: false
title: Microcks 1.8.1 release 🚀
date: 2024-01-18
image: "images/blog/microcks-1.8.1-feature.png"
author: "Laurent Broudoux"
type: "regular"
description: "Microcks 1.8.1 release 🚀"
draft: false
---

We are thrilled to start this New Year with a brand new Microcks release! Say hi to the `1.8.1` release of Microcks, the Open-source cloud-native tool for API Mocking and Testing 👏

This release embeds **54 resolved issues** as we release an intermediary `1.8.1-M1` version to avoid some users waiting too much time. Here are the highlights of this release:

* **OpenAPI complex structures** support was asked to handle edge cases or organizations having a great maturity on OpenAPI,
* **Uber/All-in-one architecture simplification** was required to allow further enhancements in our Shift-Left strategy and [Testcontainers](https://testcontainers.com/modules/microcks/) support,
* **Kubernetes** deployments are now better managed with **Helm enhancements**, enabling greater customization for an enhanced **GitOps** approach!

{{< image src="images/blog/microcks-1.8.1-feature.png" alt="microcks-feature">}}

Let’s do a review of what’s new on each one of our highlights without delay.


## OpenAPI complex structures

While pretty simple in a self-contained approach, the OpenAPI specification can unveil a lot of complexity when dealing with references! At scale, it’s often common to split your API specification information into different files describing schemas, parameters, and examples in a way that eases reuse and favors consistency.


As Microcks already supported simple cases, we certainly faced limits regarding the depth of dependencies or the exhaustivity of constructions.

With great help from the community - thanks a lot to [Apoorva Srinivas Appadoo](https://www.linkedin.com/in/appadoo-apoorva-srinivas-481367207/) 🙏 - we successfully enriched the set supported complex structures:

* The `components` of an OpenAPI schema are now fully parsed and converted. See [#995](https://github.com/microcks/microcks/issues/995),
* JSON Pointer is now supported to navigate example files. See [#984](https://github.com/microcks/microcks/issues/984),
* The discovery of dependencies is now transitive. See [#986](https://github.com/microcks/microcks/issues/986),
* The imported OpenAPI elements are now fully re-normalized to allow their use for validation purposes. See [#1035](https://github.com/microcks/microcks/issues/1035) and [#1037](https://github.com/microcks/microcks/issues/1037),
* References are now supported at the path/operation level. See [#1034](https://github.com/microcks/microcks/issues/1034).

We’re looking forward to hearing from our vibrant community if you find some other structures that may not be yet supported. During the development process of these new features, we also set up a new GitLab repository that holds some very complex features we can now support. Have [a look at it](https://gitlab.com/lbroudoux/microcks-tests/) if you want to check if your case can be handled.


## Uber/All-in-one architecture simplification

In the previous `1.8.0` release, we [welcomed the Uber image](https://microcks.io/blog/microcks-1.8.0-release/#welcome-uber-image): a stripped-down version of Microcks dedicated to [Shift-Left scenarios](https://www.linkedin.com/pulse/how-microcks-fit-unify-inner-outer-loops-cloud-native-kheddache) and [Local development approaches](https://microcks.io/blog/microcks-1.8.0-release/#welcome-testcontainers-). We are going further with this release, extending the concept to the component holding the Async API-related features of Microcks: the Async Minion. And to bring you a lightweight experience, we had to review the way this component integrates with others.

In [canonical Microcks architecture](/documentation/explanations/deployment-options/#complete-logical-architecture), the Async Minion integrates mainly using an Apache Kafka broker. This architecture presents a very nice decoupling, allowing both Sync and Async components to scale independently and to be distributed on different nodes. However, these needs make little sense when Microcks is used locally on your development machine. As a consequence, we changed the Kafka communication channel, switching to simple WebSocket communication as illustrated in the schema below: 

{{< image src="images/blog/microcks-1.8.1-uber-architecture.png" >}}

As a consequence, a Kafka broker is no longer needed when you want to enable the Async API features of Microcks on your laptop! WebSocket protocol is directly supported by the new Microcks Uber Async Minion and if you’d like to mock or test some other protocols - like Amazon SQS, SNS, or even Kafka - You can, of course, bring and connect to your existing broker!

These essential elements can be also joined together when used in combination within our [Testcontainers Module](https://testcontainers.com/modules/microcks/) in what we call a `Microcks Ensemble`. An `Ensemble` is a simple way to configure them all together while offering a smooth and light experience. More on this in a future blog post 😉


## Helm Chart enhancements

Whilst we’re improving Microcks for Shift-Left scenarios, having a top-notch deployment experience on Kubernetes is always a strong priority for us! Hence, we were very happy to welcome three contributions for this release:

* The ability to disable Keycloak when deploying Microcks to use fewer resources when deploying on your laptop (see [#1001](https://github.com/microcks/microcks/issues/1001)). Many thanks to [Kevin Viet](https://www.linkedin.com/in/kevin-viet-863a137/) 🙏 for his contribution!
* The customization of Kubernetes resources labels and annotations (see [#1005](https://github.com/microcks/microcks/issues/1005)) is important to allow standardization of Kubernetes apps in big companies. You can now label and annotate Microcks resources the way you need to meet your company’s policies. Thanks again to [Kevin Viet](https://www.linkedin.com/in/kevin-viet-863a137/) 🙏 for it!
* The management of Secrets is always a tricky topic, especially when using a GitOps deployment process. Thanks to [Romain Quinio](https://www.linkedin.com/in/rquinio/) 🙏, we now have a robust Helm Chart (see [#1010](https://github.com/microcks/microcks/issues/1010)) that can be used in combination with GitOps engines like [ArgoCD](https://argo-cd.readthedocs.io/) to deploy Microcks like a breeze!


## Community and Events

Reaching, interacting with, and building a strong community is one of our top priorities! For that, we decided to start a [new Discord server](https://microcks.io/discord-invite) that offers better support for real-time messaging, support forums, and team coordination around different project’ areas.

You can now join the community here: [https://microcks.io/discord-invite](https://microcks.io/discord-invite) 

[{{< image src="images/blog/microcks-discord.png" >}}](https://microcks.io/discord-invite)

> To those who were already chatting with us on our previous Discord chat, **please make the switch**! We planned to sunset our Discord chat at the end of March.

The last quarter of 2023 was a super-busy one with a lot of travels, conferences, and opportunities to meet passionate and enthusiastic people! We also have a lot of recordings to share then 😉

You’ll find below the available recordings for some of the events we speak at - unfortunately, APIDays conferences are not recorded 😥:

* GraphQL Conference 2023 was hosted in the San Francisco Bay Area. We were talking about how to [Increase Your Productivity With No-Code GraphQL Mocking](https://www.youtube.com/watch?v=UjDnrrTp7uI),
* Devoxx Belgium 2023 takes place in Antwerp. We explained how to [Speed Up your API delivery with Microcks](https://www.youtube.com/watch?v=2C2AqEpNAWI),
* AsyncAPI Tour 2023 had a step at Bangalore this year! We traveled to India 🇮🇳 for the 1st time a had a talk called [Elevating Event-Driven Architecture: Boost your delivery with AsyncAPI and Microcks](https://www.youtube.com/watch?v=PYEW3F91wbI&list=PLbi1gRlP7pijVocLZS7FeWKA4NBzJa7_Z&index=9),
* Quarkus Insights is an online meetup talking everything [Quarkus.io](https://quarkus.io). We were invited for episode #148 to demonstrate the [Microcks in Quarkus with the Microcks DevService](https://www.youtube.com/watch?v=Op-PD6m-zPo). And even if we had a network outage during the call 😥 we recorded a [second demo](https://www.youtube.com/watch?v=EQ6i7jxv_Rk&t=0s).
* Red Hat DevNation Day was an online event on December 12th. We talked here with our friend [Hugo Guerrero](https://www.linkedin.com/in/hugoguerrero/) about "API Testing and Mocking with TestContainers" (link to be published soon). There are some nice demos using Quarkus and NodeJS out there!


## What’s coming next?

As usual, we will eagerly prioritize items according to community feedback. You can check and collaborate via our list of [issues on GitHub](https://github.com/microcks/microcks/issues) and the project [roadmap](https://github.com/orgs/microcks/projects/1).

More than ever, we want to involve community members in design discussions and start some discussion about important additions regarding [OpenAPI callbacks, webhooks and AsyncAPI](https://github.com/orgs/microcks/discussions/1039) in Microcks. Please join us to shape the future!

Remember that we are an open community, which means you, too, can jump on board to make Microcks even greater! Come and say hi! on our [GitHub discussion](https://github.com/microcks/microcks/discussions) or [Discord chat](https://microcks.io/discord-invite/) 👻, send some love through [GitHub stars](https://github.com/microcks/microcks) ⭐️ or follow us on [Twitter](https://twitter.com/microcksio), [Mastodon](https://hachyderm.io/@microcksio@mastodon.social), [LinkedIn](https://www.linkedin.com/company/microcks/), and our [YouTube channel](https://www.youtube.com/c/Microcks)!

Thanks for reading and supporting us! ❤️

