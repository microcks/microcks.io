---
title: Microcks 1.1.0 release 🚀
date: 2020-11-09
image: "images/blog/microcks-1.1.0-kafka.png"
author: "Laurent Broudoux"
type: "regular"
description: "Microcks 1.1.0 release 🚀"
draft: false
---

We are very thrilled to announce today Microcks 1.1.0 release — the Open source Kubernetes-native tool for API Mocking and Testing. What a ride it has been over the last months since [1.0.0 release](https://microcks.io/blog/microcks-1.0.0-release/) and our announcement of [AsyncAPI](https://www.asyncapi.com/) support !

We received a huge amount of positive feedback from our community including many newcomers. So we took the time to come back and explain where we are coming from and what is our project purpose: see the ["Why Microcks ?"](https://microcks.io/blog/why-microcks/) post. But above all, we wanted to go further and complete what had been started in the previous version by adding [Apache Kafka](https://kafka.apache.org/) event-based API testing support. 

Today, Microcks is the only Open source Kubernetes-native tool that offers a consistent approach for mocking and testing your REST APIs, SOAP WebServices and now [asynchronous / event-driven](https://www.asyncapi.com/docs/community/tooling#mocking) Kafka APIs !

{{< image src="images/blog/microcks-1.1.0-kafka.png" alt="image" zoomable="true" >}}

So you may be wondering *"Why is this new release so fantastic and important ?"*. Well that `1.1.0` release means that you may now use the same tool for speeding-up the delivery and governing the lifecycle of your APIs - whether synchronous or asynchronous. Microcks will open up avenues for your team to test and create robust asynchronous workflows the easy way. 

> For those of you who needed to see some samples in action, please stay tuned! Here's the [follow-up post](../apache-kafka-mocking-testing) with details on how we're doing stuffs here 😉

## Mocking enhancements

Aside from the major new feature around Kafka testing, we also deliver significant enhancements on the [OpenAPI](https://www.openapis.org/) mocking and complete the support of all the specification details. Response references as well as parameter examples in references are now fully supported.

> Check our documentation for OpenAPI support [here](https://microcks.io/documentation/references/artifacts/openapi-conventions/)

Not surprisingly, Microcks turning GA generates a lot of attention from users managing big [SOAP WebServices](https://simple.wikipedia.org/wiki/SOAP_(protocol)) patrimony who wanted to mock them with Microcks. Dealing with legacy is always the opportunity to discover tricky cases or ambiguous interpretation of a standard. So we discovered and fixed some issues around SOAP operation, like discover, empty body support or complex WSDL with multiple interfaces management.

> All of them have been fixed and tested based on community real life samples. So thanks a lot to all of you 🙏 - [@ivsanmendez](https://github.com/ivsanmendez), [@sahilsethi12](https://github.com/sahilsethi12), [@bthdimension](https://github.com/bthdimension) -  who helped in a very collaborative way.

## Testing enhancements

For the need of asynchronous API testing features, we introduced a new testing strategy called `ASYNC_API_SCHEMA`. When testing an event-based API with this strategy, Microcks will try to validate the messages received on the connected broker endpoints against a schema found in the AsyncAPI specification.

> In 1.1.0 release we only deal with JSON Schema for describing message payload but we plan to include [Avro Schema](http://avro.apache.org/docs/current/spec.html) support in next releases. For more details, see the [Test Runner](https://microcks.io/documentation/references/test-endpoints/#test-runner) documentation.

Understanding testing value is usually not easy to evaluate and mainly because it implies having a functional application at hand. We have had a lot of comments on this point from community users and we have decided to provide a sample application from our famous `API Pastry` sample. So now, you can have a true application at hand to evaluate [OpenAPI](https://www.openapis.org/) testing 🥳

Run it in less than 100 ms and use a single command line: thanks to [Quarkus](https://quarkus.io/) !

```sh
$ docker run -i --rm -p 8282:8282 quay.io/microcks/quarkus-api-pastry:latest
__  ____  __  _____   ___  __ ____  ______ 
 --/ __ \/ / / / _ | / _ \/ //_/ / / / __/ 
 -/ /_/ / /_/ / __ |/ , _/ ,< / /_/ /\ \  
--\___\_\____/_/ |_/_/|_/_/|_|\____/___/   
2020-10-19 14:49:37,134 INFO  [io.quarkus] (main) quarkus-api-pastry 1.0.0-SNAPSHOT native (powered by Quarkus 1.7.1.Final) started in 0.104s. Listening on: http://0.0.0.0:8282
```

> Find our [Getting Started with Tests](https://microcks.io/documentation/tutorials/getting-started-tests/) quick start guide.

## Installation experience

We also added a very nice enhancement to improve your installation experience: the ability to put annotations on the `Ingress` resources, whether you choose to use [Helm Chart](https://microcks.io/documentation/references/configuration/helm-chart-config/) or [Kubenetes Operator](https://microcks.io/documentation/references/configuration/operator-config/). This sounds like little details but it clearly reinforces smooth integration of Microcks into the Enterprise ecosystem, allowing you to reuse ingress controllers specific features or integrate with organization PKI through [CertManager](https://cert-manager.io/).

> You can find full documentation on Microcks Helm Chart on the [README](https://github.com/microcks/microcks/blob/master/install/kubernetes/README.md) ; as well as on the Kubernetes Operator [README](https://github.com/microcks/microcks-ansible-operator/blob/master/README.md). Helm Chart is still distributed through [Helm Hub](https://hub.helm.sh/charts/microcks/microcks) and Operator through [OperatorHub.io](https://operatorhub.io/operator/microcks)

## What’s coming next ?

We still have a lot to accomplish but cannot do it without your support and ideas. Please use [GitHub](https://github.com/microcks/microcks/issues) (issues) to tell us the enhancements or new features you are dreaming about using. 

We are open and you can help make Microcks an even greater tool ! Please spread the word, send us some love through [GitHub](https://github.com/microcks/microcks) stars and follow us on [Twitter](https://twitter.com/microcksio).

To support the growth of our community we also wanted to enhance the way we interact and we have decided to abandon [Gitter](https://gitter.im/microcks/microcks) chat rooms in favor of [Discord](https://microcks.io/discord-invite/). [Discord](https://microcks.io/discord-invite/) offers streams and topics that will ease following each and every thread we’ve got on Gitter. It also provides a better mobile experience so you will be able to follow us on the move.

Thanks for your reading and for supporting us ! Take care in these particularly weird moments and stay tuned. ❤️
