---
draft: false
title: "Testcontainers Modules"
date: 2025-07-17
publishdate: 2025-07-17
lastmod: 2026-01-30
weight: 7
---

## Introduction

As introduced in our [Developing with Testcontainers](/documentation/guides/usage/developing-testcontainers) guide, you can be embed Microcks into your unit tests with the help of [Testcontainers](https://testcontainers.com) librairies. We provide support for the following languages in dedicated Testcontainers modules: [Java](https://github.com/microcks/microcks-testcontainers-java), [NodeJS / Typescript](https://github.com/microcks/microcks-testcontainers-node), [Golang](https://github.com/microcks/microcks-testcontainers-go) and [.NET](https://github.com/microcks/microcks-testcontainers-dotnet).

In addition, a **community-maintained module for [Python](https://github.com/Caesarsage/microcks-testcontainers-python)** 🐍 is emerging with broad feature coverage. It's not yet part of the official Microcks organization, so it is tracked separately in the [Community modules](#community-modules) section below rather than in the matrices that follow. It may be promoted to an official module in the future as it matures.

We try to setup and manage a unified roadmap between modules but because they are maintained by different contributors, drifts between implementations may happen at some points. Our goal is obviously to make them consistent eventually. 

This page lists the implementation status of various features by the different modules on July 21st, 2025. It will be updated regularly. 

> 💡 Of course, **we welcome external contributions**! So, if you're in a hurry and need a missing feature, don't hesitate to propose a change and to submit a _Pull Request_ on the associated GitHub repository 🙏

## Initialization

This section lists the features related to Microcks initialization during the preparation of setup phase of tests.

| Feature                 | Java  | JS   | Go   | .NET |
| ----------------------- | ----- | ---- | ---- | ---- |
| Secret creation         | ✅    | ✅   | ✅   | ✅   |
| Snapshot restoration    | ✅    | ✅   | ✅   | ✅   |
| Local files (primary)   | ✅    | ✅   | ✅   | ✅   |
| Local files (secondary) | ✅    | ✅   | ✅   | ✅   |
| Remote urls (primary)   | ✅    | ✅   | ✅   | ✅   |
| Remote urls (secondary) | ✅    | ✅   | ✅   | ✅   |
| Remote urls with Secret | ✅    | ✅   | ❌   | ✅   |
| Enable DEBUG log level  | ✅    | ✅   | ✅   | ✅   |

## Mocking features

This sections lists the features related to the mocking part of Microcks (getting endpoints, checking invocations).

| Feature                 | Java  | JS   | Go   | .NET |
| ----------------------- | ----- | ---- | ---- | ---- |
| REST endpoints          | ✅    | ✅   | ✅   | ✅   |
| Soap endpoints          | ✅    | ✅   | ✅   | ✅   |
| GraphQL endpoints       | ✅    | ✅   | ✅   | ✅   |
| gRPC endpoints          | ✅    | ✅   | ✅   | ✅   |
| Invocation verification | ✅    | ✅   | ✅   | ✅   |
| Get invocation stats    | ✅    | ✅   | ✅   | ✅   |

## Testing features

This sections lists the features related to the testing part of Microcks (executing conformance tests, checking responses/messages).

| Feature               | Java  | JS   | Go   | .NET |
| --------------------- | ----- | ---- | ---- | ---- |
| OpenAPI conformance   | ✅    | ✅   | ✅   | ✅   |
| Soap conformance      | ✅    | ✅   | ✅   | ✅   |
| GraphQL conformance   | ✅    | ✅   | ✅   | ✅   |
| gRPC conformance      | ✅    | ✅   | ✅   | ✅   |
| Postman conformance   | ✅    | ✅   | ✅   | ✅   |
| AsyncAPI conformance  | ✅    | ✅   | ✅   | ✅   |
| Get TestCase messages | ✅    | ✅   | ✅   | ✅   |

## Asynchronous protocols

This sections lists the async protocols available on each language binding.

| Protocol            | Java  | JS   | Go   | .NET |
| ------------------- | ----- | ---- | ---- | ---- |
| Kafka               | ✅    | ✅   | ✅   | ✅   |
| WebSocket           | ✅    | ✅   | ❌   | ✅   |
| MQTT                | ✅    | ✅   | ✅   | ❌   |
| RabbitMQ (AMQP 0.9) | ✅    | ✅   | ❌   | ✅   |
| NATS                | ❌    | ❌   | ❌   | ❌   |
| AWS SQS             | ✅    | ✅   | ✅   | ❌   |
| AWS SNS             | ✅    | ✅   | ✅   | ❌   |
| Google PubSub       | ✅    | ✅   | ✅   | ❌   |

## Community modules

The modules listed in the matrices above are maintained within the official Microcks organization. The community is also building bindings for additional languages that are **not (yet) official** but may be promoted in the future as they mature.

### Python 🐍

A community-maintained module is available at [Caesarsage/microcks-testcontainers-python](https://github.com/Caesarsage/microcks-testcontainers-python). It's not yet published on PyPI, but it already provides a remarkably complete feature set — including a Microcks ensemble (with Postman and Async Minion containers), secrets, OAuth2-secured endpoint testing and all asynchronous connection types except NATS.

See the [Community modules](/documentation/guides/usage/developing-testcontainers/#5-community-modules) part of the *Developing with Testcontainers* guide for installation and usage. The feature coverage below was assessed from the module source on May 31st, 2026 — as it stabilizes, we intend to fold it into the matrices above.

**Initialization**

| Feature                 | Python |
| ----------------------- | ------ |
| Secret creation         | ✅     |
| Snapshot restoration    | ✅     |
| Local files (primary)   | ✅     |
| Local files (secondary) | ✅     |
| Remote urls (primary)   | ✅     |
| Remote urls (secondary) | ✅     |
| Remote urls with Secret | ✅     |
| Enable DEBUG log level  | ✅     |

**Mocking features**

| Feature                 | Python |
| ----------------------- | ------ |
| REST endpoints          | ✅     |
| Soap endpoints          | ✅     |
| GraphQL endpoints       | ✅     |
| gRPC endpoints          | ✅     |
| Invocation verification | ✅     |
| Get invocation stats    | ✅     |

**Testing features**

| Feature               | Python |
| --------------------- | ------ |
| OpenAPI conformance   | ✅     |
| Soap conformance      | ✅     |
| GraphQL conformance   | ✅     |
| gRPC conformance      | ✅     |
| Postman conformance   | ✅     |
| AsyncAPI conformance  | ✅     |
| Get TestCase messages | ✅     |

**Asynchronous protocols**

| Protocol            | Python |
| ------------------- | ------ |
| Kafka               | ✅     |
| WebSocket           | ✅     |
| MQTT                | ✅     |
| RabbitMQ (AMQP 0.9) | ✅     |
| NATS                | ❌     |
| AWS SQS             | ✅     |
| AWS SNS             | ✅     |
| Google PubSub       | ✅     |

This module is in active development — **trying it out, reporting issues, and starring the [repository](https://github.com/Caesarsage/microcks-testcontainers-python) ⭐** are all great ways to help it reach official-module status. Contributions are very welcome! 🙌
