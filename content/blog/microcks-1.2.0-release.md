---
title: Microcks 1.2.0 release 🚀
date: 2021-02-21
image: "images/blog/microcks-1.2.0-avro-mqtt.png"
author: "Laurent Broudoux"
type: "regular"
description: "Microcks 1.2.0 release 🚀"
draft: false
---

We are delighted to announce the 1.2.0 release of Microcks - the Open source Kubernetes-native tool for API Mocking and Testing. With this new release, we are pursuing further our vision of a unique tool and consistent approach for speeding up the delivery and governing the lifecycle of ALL kinds of APIs - whether synchronous or asynchronous.

In this release, we put a lot of effort (and love ❤️) into listening and implementing feedback and ideas from our community. Three major things came as requests and feedback that made the key theme for this release:

* People are finding [Apache Kafka](https://kafka.apache.org/) everywhere and tightly coupled with [Apache Avro](https://avro.apache.org/docs/current/). As a result, we have added that feature! 
* Also, people want to use Microcks for the Internet of Things world and need another protocol binding. Hence, we have added [MQTT](https://mqtt.org/) support! 
* Users are looking for advanced logic in their [OpenAPI](https://www.openapis.org/) mocking. So, we implemented enhancements to have the smartest engine!

{{< image src="images/blog/microcks-1.2.0-avro-mqtt.png" alt="image" zoomable="true" >}}

As an Open Source project made for Enterprise usage, one major directive is ecosystem integration. You will see on this post that we take care of making Microcks working with many vendor’s products - could it be for registries, message brokers, or even Kubernetes distribution.

Let’s do a review of what’s new on each one of our highlights without delay.

## Avro & Schema Registry support 

With this new release, Microcks is now supporting Apache Avro encoding for extra-small messages. Avro is a compact binary format that is largely used in the Big Data and [Apache Hadoop](https://hadoop.apache.org/) ecosystems. It is also very popular on top of Apache Kafka as it allows to make reliable the exchange of messages through the use of Avro schemas.

When Avro is used with Kafka, it is also common to have a registry for easily sharing schemas with consuming applications. Microcks can now integrate with your organization schema registries in order to:

* speed-up the process of propagating Avro schema updates to API events consumers,
* detect any drifting issues between the expected Avro schema and the one effectively used.

{{< image src="images/blog/microcks-1.2.0-avro.png" alt="image" zoomable="true" >}}

>  Microcks have been successfully tested with both [Confluent Schema Registry](https://github.com/confluentinc/schema-registry) and [Apicurio Service Registry](https://www.apicur.io/registry/). You can find full documentation on this feature on our [Kafka, Avro and Schema Registry guide](https://microcks.io/documentation/guides/usage/async-protocols/avro-messaging/).

## MQTT support

The [Message Queuing Telemetry Transport protocol](https://mqtt.org/) (MQTT) is a standard messaging protocol for the Internet of Things (IoT). It is used today in a wide variety of industries, such as automotive, manufacturing, telecommunications, oil and gas, etc. We receive some massive push from community users for adding MQTT support and are now happy to announce that version `3.1.1` of MQTT is the second supported messaging protocol on Microcks!

Thanks to the excellent [AsyncAPI Specification](https://www.asyncapi.com/) and its support in Microcks, you are now able to design your API and produce mocks with multi-binding support! You define your API once, and the Microcks tooling will take care of publishing mocks and testing messages using one or both protocols.

{{< image src="images/blog/microcks-1.2.0-mqtt.png" alt="image" zoomable="true" >}}

> Microcks have been successfully tested with [ActiveMQ Artemis](https://activemq.apache.org/components/artemis/) as well as [Eclipse Mosquitto](https://mosquitto.org/). Check out full documentation on MQTT Mocking and Testing [here](https://microcks.io/documentation/guides/usage/async-protocols/mqtt-support/)

## OpenAPI enhancements

Aside from the major new features around Avro and MQTT support, we also deliver significant enhancements on the [OpenAPI](https://www.openapis.org/) mocking and testing.

We have added a lot of new templating functions that will allow Microcks to generate dynamic meaningful mock responses. You can now easily use `randomFullName()`, `randomStreetAddress()` or `randomEmail()` functions in your examples to have smart and always different mocks. Moreover, we introduced notation compatibility with [Postman Dynamic variables](https://learning.postman.com/docs/writing-scripts/script-references/variables-list/) so that you can reuse your existing Postman Collection without any change.

We have also added a new `FALLBACK` dispatcher that helps to define default responses and advanced behavior for your mocks.

> Thanks a lot to our community users 🙏 - [@gkleij](https://github.com/gkleij), [@robvalk](https://github.com/robvalk) and [@ChristianHauwert](https://github.com/ChristianHauwert) - that suggested enhancements and helped to validate them. Check our documentation on Template functions [here](https://microcks.io/documentation/references/templates/#function-expressions) and have a look at our blog post introducing [Fallback and advanced dispatching](https://microcks.io/blog/advanced-dispatching-constraints/).


### Get started with a streamlined installation experience

Developer experience is of great importance for us and we worked to make it even simpler to get started with Microcks. [Docker-compose based install](https://microcks.io/documentation/guides/installation/docker-compose/) has been drastically improved and does not require any configuration for you to start up! Installation procedures now all contain default users so that you can start playing immediately. 

[Kubernetes Operator install](/documentation/references/configuration/operator-config/) has also been simplified by providing one-liner installation (well actually, it’s two lines 😉):

```sh
$ kubectl apply -f https://microcks.io/operator/operator-latest.yaml -n microcks
$ curl https://microcks.io/operator/minikube-minimal.yaml -s | sed 's/KUBE_APPS_URL/'$(minikube ip)'.nip.io/g' | kubectl apply -n microcks -f -
```

While at first look it looks simpler, the installation has been enhanced to adapt to any Kube configuration and advanced users will now have the ability to specify resource utilization for the different components.

> Thanks a lot to our community users 🙏 - [@hguerrero](https://github.com/hguerrero),[@dicolasi](https://github.com/dicolasi) and [@abinet](https://github.com/abinet)  - who pushed for simplification and helped us tracking, fixing and validating all these issues. Please check our new Getting Started videos available on [Home Page](https://microcks.io) or through our [YouTube channel](https://www.youtube.com/channel/UCKlmXpav-DnliniEJ5FM52Q).

## What’s coming next?

In just a little more than three months since the [previous `1.1.0` release](https://microcks.io/blog/microcks-1.1.0-release/), we have been able to do a lot thanks to your ideas and help. Kudos for being so supportive and pushing Microcks up!

We have many plans for the coming months but will be very happy to prioritize depending on community feedback. On top of our head we are planning to work on:

* protocol binding addition for Async API ([AMQP](https://www.amqp.org/) seems a good candidate at the moment),
* community sharing of mocks and tests for regulatory or industrial standards,
* more metrics and analytics to govern your APIs with Microcks.

Remember that we are open and it means that you can jump on board to make Microcks even greater! Come and say hi! on our [Discord chat](https://microcks.io/discord-invite/) 🐙 , simply send some love through [GitHub stars]([https://github.com/microcks/microcks) ⭐️ or follow us on [Twitter]([https://twitter.com/microcksio).

Thanks for reading and supporting us! Stay safe and healthy. ❤️  