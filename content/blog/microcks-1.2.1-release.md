---
title: Microcks 1.2.1 release 🚀
date: 2021-05-05
image: "images/blog/microcks-1.2.1-feature.png"
author: "Laurent Broudoux"
type: "regular"
description: "Microcks 1.2.1 release 🚀"
draft: false
---

We are very glad to announce today the 1.2.1 release of Microcks - the Open source Kubernetes-native tool for API Mocking and Testing. This is mainly an “Enhancement release” pushing further the features we introduced within the previous [1.2.0 release](https://microcks.io/blog/microcks-1.2.0-release/).

With this release, we are still applying our mantra for supporting ALL kinds of APIs and being community driven. Want some keywords on what’s in this `1.2.1` release? We’ve been working on [OpenAPI v3.1](https://www.openapis.org/blog/2021/02/18/openapi-specification-3-1-released), [AsyncAPI](https://asyncapi.com) MQTT and headers support as well as user experience support around Tests and Installation through [Podman](https://podman.io) support.

{{< image src="images/blog/microcks-1.2.1-feature.png" alt="image" zoomable="true" >}}

Let’s have a quick review on what’s new and what it brings to our users.


## Standards & Protocols…

[OpenAPI v3.1](https://www.openapis.org/blog/2021/02/18/openapi-specification-3-1-released) was released on the 18th February, exactly three days before the `1.2.0` so that we were not able to embed its support at that time. It is now done! We make sure that you may be able to use this new version without any issue, adding a dedicated test suite for that. 

> This makes Microcks one of the first tools to embrace OpenAPI v3.1 as mentioned by [@apisyouwonthate](https://twitter.com/apisyouwonthate). Whether switching your spec version or tooling, Microcks offers you a smooth transition. 

{{< image src="images/blog/microcks-1.2.1-tweet.png" alt="image" zoomable="true" >}}

Event Driven Architecture (EDA) is all the rage today in cloud-native era, as it brings you space and time decoupling as well as better resiliency and elasticity. However people struggle with picking the right specification: [AsyncAPI](https://asyncapi.com) or [CloudEvents](https://cloudevents.io)? Why not both? We demonstrate in [Simulating CloudEvents with AsyncAPI and Microcks](https://microcks.io/blog/simulating-cloudevents-with-asyncapi/) the benefits it brings. And we add support for AsyncAPI specification headers to make it work!

> CloudEvents simulation and compliance testing is at finger tip with Microcks! The mechanism we detailed makes Microcks suitable for any messaging envelope standard. See issue [#360](https://github.com/microcks/microcks/issues/360) for more details.

Still in the EDA space, you may know that we introduced [MQTT](https://mqtt.org/) support in the previous release but we did not grasp all the subtleties of it ;-) Thanks to some [Solace](https://solace.com) contributions we did fix channels naming conventions and add support for channel parameters as well. 

> With these community contributions, the AsyncAPI spec coverage in Microcks is near complete and makes it the most comprehensive tooling for managing, testing and governing your EDA assets. See issues [#363](https://github.com/microcks/microcks/issues/363), [#378 ](https://github.com/microcks/microcks/pull/378)and [#379](https://github.com/microcks/microcks/pull/379) for more details.

And this is a nice transition to remind you how Microcks roadmap is...


## … driven by community feedback!

🎉 Kudos to our community for great interactions, feedback, enhancements proposals and contributions these last two months! We’re very proud having achieved 350 🌟 on GitHub last week! Here are some noticeable contributions we integrated within the `1.2.1` release.

*   [Jonathan Vila](https://github.com/jonathanvila) 🙏 suggested many tests enhancements: the use of [Secrets for authentication](https://github.com/microcks/microcks/issues/366), [tests timeouts](https://github.com/microcks/microcks/issues/365), [tests replays](https://github.com/microcks/microcks/issues/368) and [expression languages in request](https://github.com/microcks/microcks/issues/375) will drastically improve the testing experience,
*   [Nicolas Massé](https://github.com/nmasse-itix) 🙏 - a Fedora geek ;-) - contributed the [Podman](https://podman.io) Compose [support for Microcks](https://github.com/microcks/microcks/pull/352) as a more secure alternative to Docker on your laptop. Nicolas also write a nice [introduction on our blog](https://microcks.io/blog/podman-compose-support/) as well as a more [in-depth article on Red Hat Developers](https://developers.redhat.com/blog/2021/04/22/using-podman-compose-with-microcks-a-cloud-native-api-mocking-and-testing-tool/),
*   [fogoforth](https://github.com/fgoforth) 🙏 implemented the SOAP 1.2 support in Microcks, fixing the [incoming version detection](https://github.com/microcks/microcks/pull/358) and the [response content-type](https://github.com/microcks/microcks/issues/356). Thanks for what seems to be your first-time contrib to Open-Source,
*   [Roxana Sterca](https://github.com/roxana-sterca) 🙏 discovered an un-documented feature and helped fixing and validating the new [`SCRIPT` dispatcher](https://github.com/microcks/microcks/issues/351) for REST mocking. Stay tuned for some documentation on this feature in forthcoming weeks.

> There would be many more to mention here so thanks a lot to those we didn’t mention here but help giving useful feedback everyday.


## What’s coming next?

In just a little more than two months since the [previous `1.2.0` release](https://microcks.io/blog/microcks-1.2.0-release/), we have been able to do a lot thanks to your ideas and help.

We have many plans for the coming months but will be very happy to prioritize depending on community feedback : Websocket, gRPC, GraphQL... What’s why we put substantial efforts creating several [issues on GitHub](https://github.com/microcks/microcks/issues) to detail what options we have in front of us. Please use them to react and vote for your preferred ones to allow us prioritize the backlog!

Remember that we are open and it means that you can jump on board to make Microcks even greater! Come and say hi! on our [Discord chat](https://microcks.io/discord-invite/) 🐙 , simply send some love through [GitHub stars](https://github.com/microcks/microcks) ⭐️ or follow us on [Twitter](https://twitter.com/microcksio).

{{< image src="images/blog/give-stars.jpeg" alt="image" zoomable="true" >}}

Thanks for reading and supporting us! Stay safe and healthy. ❤️  
