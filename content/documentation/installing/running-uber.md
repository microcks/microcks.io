---
draft: false
title: "Running with Testcontainers"
date: 2023-10-12
publishdate: 2023-10-12
lastmod: 2023-11-14
menu:
  docs:
    parent: installing
    name: Running with Testcontainers
    weight: 50
toc: true
weight: 50 #rem
---

In order to support [Inner Loop integration or Shift-Left scenarios](https://www.linkedin.com/pulse/how-microcks-fit-unify-inner-outer-loops-cloud-native-kheddache), we've worked recently on a stripped down version of Microcks that makes embedding it in your development workflow, on a laptop, within your unit tests possible. This new distribution is called `microcks-uber` and provides the essential services in a single container as represented below:

<img src="/images/deployment-uber.png" class="img-responsive"/>

> As the Uber distribution of Microcks is perfectly well-adapted for a quick evaluation, we don't recommend running it in production! It doesn't embed the authroization/authentication features provided by Keycloak and the performance guarantees offered by a real external MongoDB instance.

The original purpose of this Uber distribution is to be used through testing libraries like [Testcontainers](https://testcontainers.com). Though it's very easy to launch it using a simple `docker` command like below, binding the only necessary port to your local `8585`:

```sh
docker run -p 8585:8080 -it quay.io/microcks/microcks-uber:nightly
```

## Testcontainers integration

Microcks now provides official modules for [Testcontainers](https://testcontainers.com) via a partenership with [AtomicJar](https://atomicjar.com/), the company behind this fantastic library! You can find information on the official module on [Testcontainers Microcks page](https://testcontainers.com/modules/microcks/).

As of today, we provide support for following languages:
* Java ☕️ - See our [GitHub repository](https://github.com/microcks/microcks-testcontainers-java) - See our demo application for [Spring Boot](https://github.com/microcks/api-lifecycle/blob/master/shift-left-demo/spring-boot-order-service/README.md) 🍃 and for [Quarkus](https://github.com/microcks/api-lifecycle/blob/master/shift-left-demo/quarkus-order-service/README.md).
* NodeJS - See our [GitHub repository](https://github.com/microcks/microcks-testcontainers-node)
* Go - See our [GitHub repository](https://github.com/microcks/microcks-testcontainers-go)

Also below a set of blog posts explaining the benefist and underlying mechanisms this integrations:
* [Mocking and contract-testing in your Inner Loop with Microcks - Part 1: Easy environment setup](https://medium.com/@lbroudoux/mocking-and-contract-testing-in-your-inner-loop-with-microcks-part-1-easy-environment-setup-dcd0f4355231)
* [Mocking and contract-testing in your Inner Loop with Microcks - Part 2: Unit testing with Testcontainers](https://medium.com/@lbroudoux/mocking-and-contract-testing-in-your-inner-loop-with-microcks-part-2-unit-testing-with-860a86cb4b4c)
* [Mocking and contract-testing in your Inner Loop with Microcks - Part 3: Quarkus Devservice FTW](https://medium.com/@lbroudoux/mocking-and-contract-testing-in-your-inner-loop-with-microcks-part-3-quarkus-devservice-ftw-a14b807737be)