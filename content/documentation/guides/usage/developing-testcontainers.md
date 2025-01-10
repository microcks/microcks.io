---
draft: false
title: "Developing with Testcontainers"
date: 2024-04-30
publishdate: 2024-04-30
lastmod: 2025-01-10
weight: 6
---

## Overview

This guide will provide you with pointers on how to embed Microcks into your unit tests with the help of [Testcontainers](https://testcontainers.com). The project now provides official modules for [Testcontainers](https://testcontainers.com) via a partenership with [AtomicJar](https://atomicjar.com/), the company behind this fantastic library! 

You’ll learn how to automatically launch and shut down Microcks’ instances so that you can easily test your API clients and API contracts. You can find information on the official module on [Testcontainers Microcks page](https://testcontainers.com/modules/microcks/).

As of today, we provide support for the following languages:
* Java ☕️ - starting from Java 8 to latest releases - via a library available on [Maven Central](https://mvnrepository.com/repos/central),
* NodeJS / Typescript - via a Javascript library with types available on [NPM](https://www.npmjs.com),
* Golang - via a library distributed via our GitHub,
* .NET -  starting from .NET 6.0 to latest releases - via a library available on [Nuget](https://www.nuget.org/packages/Microcks.Testcontainers).

Let’s go 🧊

## 1. Java support

Our Testcontainers module for Java is `io.github.microcks:microcks-testcontainers`, you easily add it to your Maven or Gradle powered project.

The library is making usage of our [*Uber* distribution](/documentation/explanations/deployment-options/#regular-vs-uber-distribution) and you can simply start Microcks that way:

```java
MicrocksContainer microcks = new MicrocksContainer(
      DockerImageName.parse("quay.io/microcks/microcks-uber:1.10.0"));
microcks.start();
```

See our [microcks-testcontainers-java repository](https://github.com/microcks/microcks-testcontainers-java) for full details.

### Spring Boot integration

Microcks Testcontainers can be easily integrated in a Spring Boot application using [Spring Boot Developer Tools](https://docs.spring.io/spring-boot/reference/using/devtools.html) so that when running in test mode, Microcks can be wired into your application to provide mocks for your dependencies.

See our [demo application for Spring Boot](https://github.com/microcks/api-lifecycle/blob/master/shift-left-demo/spring-boot-order-service/README.md) 🍃 

### Quarkus integration

Microcks Testcontainers has also being extended to provide a [Quarkus Dev Service](https://quarkus.io/guides/dev-services). That way Microcks can be automatically started, configured and wxired to your application when starting in `dev:mode`.

See our [microcks-quarkus repository](https://github.com/microcks/microcks-quarkus) for full details as well as our [demo application for Quarkus](https://github.com/microcks/api-lifecycle/blob/master/shift-left-demo/quarkus-order-service/README.md).


## 2. NodeJS support

Our Testcontainers module for Javascript is `@microcks/microcks-testcontainers`, you easily add it to your NPM or Yarn powered project.

The library is making usage of our [*Uber* distribution](/documentation/explanations/deployment-options/#regular-vs-uber-distribution) and you can simply start Microcks that way:

```javascript
const container = await new MicrocksContainer("quay.io/microcks/microcks-uber:1.10.0").start();
```

See our [microcks-testcontainers-node repository](https://github.com/microcks/microcks-testcontainers-node) for full details and our full [demo application using NestJS](https://github.com/microcks/microcks-testcontainers-node-nest-demo)


## 3. Golang support

Our Testcontainers module for Javscript is `github.com/testcontainers/testcontainers-go`, you easily add it to your Go mod file.

The library is making usage of our [*Uber* distribution](/documentation/explanations/deployment-options/#regular-vs-uber-distribution) and you can simply start Microcks that way:

```go
microcksContainer, err := microcks.RunContainer(ctx, testcontainers.WithImage("quay.io/microcks/microcks-uber:1.10.0"))
```

See our [microcks-testcontainers-go repository](https://github.com/microcks/microcks-testcontainers-go) for full details and our full [demo application](https://github.com/microcks/microcks-testcontainers-go-demo)


## 4. .NET support

Our Testcontainers module for .NET is `Microcks.Testcontainers`, you easily add it to your `.csproj` file in your project.

The library is making usage of our [*Uber* distribution](/documentation/explanations/deployment-options/#regular-vs-uber-distribution) and you can simply start Microcks that way:

```csharp
MicrocksContainer container = new MicrocksBuilder()
	.WithImage("quay.io/microcks/microcks-uber:1.10.0")
	.Build();
await container.StartAsync();
```

See our [microcks-testcontainers-dotnet repository](https://github.com/microcks/microcks-testcontainers-dotnet) for full details and our (incoming) full [demo application](https://github.com/microcks/microcks-testcontainers-dotnet-demo)


## Wrap-up

Testcontainers + Microcks is really a powerful combo for simplifying the write-up of robust unit or integration tests where the fixtures can be directly deduced from specifications. And the best thing is that this tooling is totally independent of your technology stack! You can use them for NodeJS, Go, Java, Ruby development, or whatever!

We don't provide a built-in module for the stack you're using? Poke us on [Discord](/discord-invite/), we'd really like to get your suggestion and help to get this rolling!

If you want to learn more about the underlying thoughts and alternatives you may have if you're not running Testcontainers, here's below a set of blog posts writtent during our explorations:
* [Mocking and contract-testing in your Inner Loop with Microcks - Part 1: Easy environment setup](https://medium.com/@lbroudoux/mocking-and-contract-testing-in-your-inner-loop-with-microcks-part-1-easy-environment-setup-dcd0f4355231)
* [Mocking and contract-testing in your Inner Loop with Microcks - Part 2: Unit testing with Testcontainers](https://medium.com/@lbroudoux/mocking-and-contract-testing-in-your-inner-loop-with-microcks-part-2-unit-testing-with-860a86cb4b4c)
* [Mocking and contract-testing in your Inner Loop with Microcks - Part 3: Quarkus Devservice FTW](https://medium.com/@lbroudoux/mocking-and-contract-testing-in-your-inner-loop-with-microcks-part-3-quarkus-devservice-ftw-a14b807737be)
