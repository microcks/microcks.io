---
draft: false
title: "Architecture and deployment options"
date: 2020-12-15
publishdate: 2020-12-15
lastmod: 2020-12-15
menu:
  docs:
    parent: installing
    name: Architecture and deployment options
    weight: 40
toc: true
weight: 40 #rem
---

## Introduction

Now that you have probably gone thorugh the different installation methods of Microcks, you would may want to have a high-level view of its architecture and deployment options. This page will go through these topics, exposeing the different choices and options you may have depending on your target environment.

## High-level Architecture

As its simplest form, Microcks architecture is made of 4 components that are:

* The Microcks main web application (also called `webapp`) that holds the UI resources as well as API endpoints,
* Its associated MongoDB database for holding your data such as repository of **API | Services** and **Tests**,
* A Microcks Postman runtime (`microcks-postman-runtime`) that allow the execution of Postman Collection tests and calls back Microcks for storing results,
* A [Keycloak](https://keycloak.org) instance that holds the authentication mechanisms and identity provider integration.

The schema below illustrates this architecture and the relations between components. You'll see that users are accessing the main `webapp` either from their browser to see the console or from the [CLI](../../automating/cli) or any other application using the API endpoints.

<img src="/images/architecture-simple.png" class="img-responsive"/>

> For sake of simplicity we do not represent here the PostgreSQL (or other database) thay may be associated with Keycloak.

Your can deploy this simple architecture whatever the installation method you pick: from [Docker Compose](../docker-compose) to fully featured [Operator](../operator).

### Complete architecture

Since the [1.0.0 release](../../../blog/microcks-1.0.0-release) when we introduced asyncchronous API support, there's a much complete form of architecture that takes place when you enabled the asynchronous API feature.

To support this, we rely on 2 additional components:

* The Microcks Async Minion (`microcks-async-minion`) is a component responsible for publishing mock messages corresponding to [AsyncAPI](../../using/asyncapi) definitions. It retrieved theses definitions from Microcks `webapp` at startup and then listens to a Kafka topic for changes on theses definitions,
* An [Apache Kafka](https://kafka.apache.org) broker that holds our private topic for changes and the public topics that will be used to publish mock messages by the `microcks-async-minion`.

Because since the [1.1.0 release](../../../blog/microcks-1.1.0-release) we are now also able to test AsyncAPI events, the `microcks-async-minion` will also be likely to connect to outer message broker topics or queues in order to listen to incoming events and validate them.

The schema below represents this full-featured architecture with connection to outer brokers. We represented Kafka ones (`X` broker) as well as broker from other protocols with respect to our roadmap. 😉

<img src="/images/architecture-full.png" class="img-responsive"/>

> For sake of simplicity we do not represent here the Zookeeper ensemble thay may be associated with Kafka.

This complete architecture cannot be deployed using Docker Compose that only brings a subset of features. We rely on Kubernetes for deploying it and you will have to use our [Helm Chart](../kubernetes) or [Operator](../operator) installation methods for that.

## Deployment Options

At this point, you should have a better vision on Microcks architecture and should be wondering: should I deploy this as a monolith? Not at all, we provide different deployment options to better suit your environment.

### Everything managed by Microcks

Of course - when starting from scratch - the simplest way of deploying Microcks is to use our [Helm Chart](../kubernetes) or [Operator](../operator) that will handle the setup of all required dependencies for you. All the components from the architecture are setup through community container images or operators like the excellent [Strimzi Operator](https://strimzi.io).

This setup makes things easy to start and easy to drop: everything is placed under a single Kubernetes namespace as illustrated into the schema below:

<img src="/images/deployment-all-managed.png" class="img-responsive"/>

> Helm Chart or Operator? I would say it depends... 😉 Operator will handle more complex lifecycle and update procedures as weel as tuning operations in the future. While Helm Chart will remain easier for simple "throwable" setup.

### Partially managed by Microcks

Aside this all-in-one approache, you may also use boths installation method to pick the components you want Microcks to install and the other existing one you may want Microcks to connect to. You will have the following options:

* Do not deploy a MongoDB database and reuse an existing one. For that, put the `mongodb.install` flag to `false` and specify a `mongodb.url`, a `mongodb.database` as well as credentials and that's it!
* Do not deploy a Keycloak instance and reuse an existing one. For that, put the `keycloak.install` flag to `false` and specify a `keycloak.url` and a `keycloak.realm` and that's it! Optionally you may want to specify a `keycloak.privateUrl` so that security token trusintg will be done without hopping through a publicly reachable URL.
* Do not deploy a Kafka nstance and reuse an existing one. For that, put the `kafka.install` flag to `false` and specify a `kafka.url` and that's it!

<img src="/images/deployment-partially-managed.png" class="img-responsive"/>

> Reusing already deployed components may allow you to lower operational costs if you're using shared instances. It can also allow you to reuse managed services that may be provided by your favorite cloud vendor.

### The Kafka broker of your choice 

Whilst it may seem obvious to certain people, it can be useful to recall that Microcks-Kafka interactions are not tied to a particular Kafka vendor.

Whatever your Kafka vendor or your different Kafka vendors - be it vanilla Kafka, Confluent platform, Amazon MSK or Red Hat AMQ - Microcks will be able to connect and use them as source for testing your event-driven API. We will just need 2 test parameters for that:

* `testEndpointUrl`: a connection string to a remote broker including destination and authentication options,
* `testSecret`: a Secret provided by Microcks administrator that will provide authentication credentials such as user, password and certificates.

The schema below illustrates non exhaustive options:

<img src="/images/deployment-brokers.png" class="img-responsive"/>
