---
title: Microcks 1.3.0 release 🚀
date: 2021-06-30
image: "images/blog/microcks-1.3.0-feature.png"
author: "Laurent Broudoux"
type: "regular"
description: "Microcks 1.3.0 release 🚀"
draft: false
---

We are so proud and happy to share this new major and important Microcks release two months in advance based on our initial roadmap! Yes, this was yet another big challenge 🎉 Kudos to our community users and partners for supporting and pushing us to this momentum. 

Nothing could have been done without all your feedback and contributions 👏

So why is this release so special? First, We always stay on our principles and we are still applying our mantra for supporting ALL kinds of APIs and being community driven. We work hard and we strongly believe that Microcks is not only an API tooling “by developers, for developers” as it also aims to create a bridge between all the enterprise layers “à la” BizDevSecOps.

{{< image src="images/blog/microcks-1.3.0-feature.png" alt="image" zoomable="true" >}}

And this new release is a big accomplishment as it includes in a single batch : 

* THE first (again…) mocking and testing tools integration that support [AsyncAPI Spec v2.1.0 ](https://www.asyncapi.com/blog/release-notes-2.1.0), YES, just one day after the Spec release 💪
* A new and very popular AsyncAPI protocol binding 👉 [WebSocket](https://datatracker.ietf.org/doc/html/rfc6455), YES... it is available right now for mocking and testing within Microcks 🎉
* A big and very structural add-on is the support of Multi-artifacts for mock definitions: this unlocks some previous limitations and provides a clean way to better interoperate with our ecosystem (ex: [Postman collections](https://microcks.io/documentation/references/artifacts/postman-conventions/)) and add new specific and tricky protocol bindings to our roadmap,
* Last but not least and thanks to the new Multi-artifacts feature, we have been able to support and include [gRPC](https://grpc.io/) communications to our API hunting board 😃


## Standards & Protocols...

[AsyncAPI Spec v2.1.0 ](https://www.asyncapi.com/blog/release-notes-2.1.0) was released on the 29th June, and it include one of our very important contribution :

{{< image src="images/blog/asyncapi-2.1-examples.png" alt="image" zoomable="true" >}}

This is amazing for us as it clearly confirms our contract-first vision and strategy. It took us a year to make it happen the way it should always be done 👉 using the standards: big thanks to the AsyncAPI folks and community to support and embrace this Microcks contribution.

> This also makes Microcks the first tools to support AsyncAPI v2.1 like we have done previously for OpenAPI v3.1 😉 Remember, whether switching your spec version or tooling, Microcks offers you a smooth transition. 

## WebSocket, you asked for it: here it is!

The WebSocket API is an advanced technology that makes it possible to open a two-way interactive communication session between the user's browser and a server. This is the perfect match with AsyncAPI Spec, see this [AsyncAPI blog post](https://www.asyncapi.com/blog/websocket-part2) for more tech details.

Based on the number of requests we received from Microcks community to support WebSocket mocking and testing, we have decided to launch a public poll on our [Twitter account](https://twitter.com/microcksio):

{{< image src="images/blog/asyncapi-bindings-poll.png" alt="image" zoomable="true" >}}

As you can see, this was a strong confirmation of users and partners interest regarding WebSocket integration and boosted by this feedback we implemented WebSocket support in just two weeks!

> How to enable WebSocket mocking and testing? Easy! Simply add a WebSocket binding to your AsyncAPI specification file and Microcks takes care of publishing endpoints in seconds. Check our [updated documentation](https://microcks.io/documentation/references/artifacts/asyncapi-conventions/#bindings).

## Endless possibilities with Multi-artifacts support

Since origin, Microcks has been following the _1 artifact == 1 API mock_ definition principle. However we did get feedback from the community and are now convinced that this approach can be too restrictive sometimes.

A use-case that is emerging is that some people may have a single OpenAPI file containing only base/simple examples but are managing complementary/advanced examples using a Postman Collection for instance. Moreover specification formats have their own strengths and weaknesses. We do think there should be some smart way to use them in a complementary way to address complex uses-cases - please pursue your reading to the following gRPC section 😉

So from `1.3.0`, Microcks is now able to have multiple artifacts (1 `primary` and some `secondary`) mapping to 1 API mock definition. The `primary` one will bring Service and operation metadata as well as examples. The `secondary` ones will only enrich existing operations with new non-conflicting request/responses and event examples.

{{< image src="images/blog/multi-artifacts-support.png" alt="image" zoomable="true" >}}

> You may now have multiple artifacts contributing to the same API mocks and tests definition: it opens to endless possibilities and use-case covering. Check [documentation](https://microcks.io/documentation/explanations/multi-artifacts/). A first demonstration of that is the tricky gRPC support just below that was made possible only thanks to the multi-artifacts support.

## A hug to gRPC fans

We always follow from the back seat the gRPC vs REST debates 😇 but clearly understand why some enterprises are intensively relying on gRPC for their backend development... See this [great article](https://cloud.google.com/blog/products/api-management/understanding-grpc-openapi-and-rest-and-when-to-use-them) from Google for more information. 

Integrating gRPC within Microcks was not an easy task - mainly due to the fact gRPC uses Protocol Buffers (aka protobuf), which is a data serialization protocol like a JSON or XML. But unlike them, the protobuf is not for humans, serialized data is compiled bytes and hard for the human reading. And for Microcks purposes: it does not include any example notions... See how it all started here in this [discussion on GitHub](https://github.com/microcks/microcks/issues/372).

Thanks to [Ben Bolton](https://github.com/molteninjabob) 🙏 pugnacity and help we have been able all together to validate a strong and robust implementation perfectly aligned with our vision and principles. This is one of the beauties of the new and great feature described above : “Multi-artifacts support”. Guess you now understand why it is so important for us as it unlock any new protocols integration in a very clean and smooth way 💥

> Check out our [gRPC usage for Microcks](https://microcks.io/documentation/references/artifacts/grpc-conventions/) documentation that illustrates how Protocol Buffer specifications and Postman Collection can be combined and used together. You’ll see that defining mocks and tests are as easy as describing requests and responses expectations using JSON. Microcks will do the conversion to protobuf undercover.

## Community amplification

Community contributions do not come only from feature requests, bug issues and open discussions. What a pleasure to see people relaying our messages, integrating Microcks in demonstration, inviting us to events or even talking about Microcks at events!

We’d like to thank the following awesome people:

* [Jonathan Vila](https://github.com/jonathanvila) 🙏 that invited us to talk about Microcks at the [Barcelona JUG](https://www.barcelonajug.org/) on a session dedicated to [Web API Contracts](https://youtu.be/p5gdmrPFTw8?t=2210)  and also for giving us the idea of our new [Import API GitHub Action](https://github.com/marketplace/actions/microcks-import-github-action),
* [Dale Lane](https://github.com/dalelane) 🙏 that is including Microcks in some of its [blog posts ](https://dalelane.co.uk/blog/?p=4219)and [videos](https://www.youtube.com/watch?v=SIHZOaw15s4), as he seems to use it a lot when playing with [Node-Red](https://nodered.org/). On our side we're ready to collaborate on IBM MQ binding implementation 😉
* [Shekhar Benarjee](https://tech.ebayinc.com/authors/shekhar-banerjee/) 🙏for mentioning Microcks within its [AsyncAPI 2.0: Enabling the Event-Driven World](https://tech.ebayinc.com/engineering/asyncapi-2-0-enabling-the-event-driven-world/) manifesto at Ebay engineering, 
* [Hugo Guerrero](https://github.com/hguerrero ) 🙏 for releasing a nice [Apache Kafka mock service with Microcks](https://dzone.com/articles/deploying-an-apache-kafka-mock-server-with-microck) on Dzone as well as having two talks on Kafka Summit APAC and Americas 2021! Be sure to attend its [Automated Apache Kafka Mocking and Testing with AsyncAPI](https://www.kafka-summit.org/sessions/automated-apache-kafka-mocking-and-testing-with-asyncapi). Congrats mate! 💪

> There would be many more to mention here so sorry for those we forget but kudos to our amazing growing community: your help, feedback and support is a gift.


## What’s coming next?

We still have many plans for the coming months and you should stay tuned during the summer time ;-) But as usual, we will be very happy to prioritize depending on community feedback: you can check and collaborate via our list of [issues on GitHub](https://github.com/microcks/microcks/issues). 

Remember that we are open and it means that you can jump on board to make Microcks even greater! Come and say hi! on our [Discord chat](https://microcks.io/discord-invite/) 🐙, simply send some love through [GitHub stars](https://github.com/microcks/microcks) ⭐️ or follow us on [Twitter](https://twitter.com/microcksio) and [LinkedIn](https://www.linkedin.com/company/microcks/).

Thanks for reading and supporting us!

Stay safe and healthy and enjoy the summer time ❤️  


