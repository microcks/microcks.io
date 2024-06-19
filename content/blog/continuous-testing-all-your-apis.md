---
title: Continuous Testing of ALL your APIs
date: 2020-12-03
image: "images/blog/continuous-testing-all-your-apis-pipeline.png"
author: "Laurent Broudoux"
type: "regular"
description: "Continuous Testing of ALL your APIs"
draft: false
---

We talk a lot about asynchronous API lately at Microcks! We added many new innovative features taking advantage of the [AsyncAPI](https://www.asyncapi.com/) specification. These are nice additions but we do not want them to hide the foundational essence of Microcks: **offering you a consistent approach whatever the type of API**. See our [Why Microcks ?](https://microcks.io/blog/why-microcks/) post for a refresher. 

With this post we want to demonstrate how traditional REST API and event-based API can be used together and how Microcks can leverage your [OpenAPI](https://www.openapis.org/) and [AsyncAPI](https://www.asyncapi.com/) assets to ease the testing of scenarios involving both of them. It is a follow-up of our [Microcks 1.1.0 release notes](https://microcks.io/blog/microcks-1.1.0-release/) and our [Apache Kafka Mocking and Testing](https://microcks.io/blog/apache-kafka-mocking-testing/) previous posts where we detailed usages of Microcks for asynchronous APIs.

## OpenAPI & AsyncAPI scopes

Let’s imagine this simple use-case: you are designing a new application for registering users in your system. We always need to register and welcome new users 😉 Obviously, some other parts of your information systems will also need to know when a new user registered so that they can - for example - send a welcome email, initialize the fidelity account, fill the CRM with basic information and so on.

The best practices in system design are clearly promoting separation of concerns and loose coupling. Thus you may build the high-level design below mixing :

* [Service Oriented Architecture](https://en.wikipedia.org/wiki/Service-oriented_architecture) (SOA) for blocking interaction with the user performing registration,
* [Event Driven Architecture](https://en.wikipedia.org/wiki/Event-driven_architecture) (EDA) for asynchronous and non-blocking interaction made by systems reacting on user registration.

 {{< image src="images/blog/continuous-testing-all-your-apis-design.png" alt="image" zoomable="true" >}}

To specify the contract of these interaction you ended up designing two APIs :

* **1 synchronous REST API** that will allow the actual registration, 
* **1 asynchronous event-based API** that will publish a `User Signed Up` message each and every time a registration succeeds. This message will be consumed by the Email, CRM, Marketing systems and any other future usages.

And that’s the time where [OpenAPI](https://www.openapis.org/) and [AsyncAPI](https://www.asyncapi.com/) enter the game! You will use them to describe the protocol semantics you plan to use (HTTP verbs, message broker topics, security schemes, ...) and the syntactic definitions of exchanged data.

 {{< image src="images/blog/continuous-testing-all-your-apis-apis.png" alt="image" zoomable="true" >}}

We can see that OpenAPI and AsyncAPI are addressing different and complementary scopes of API contract definition. Even if different, you will surely benefit from having a consistent approach while governing them and feature parity when it comes to accelerating delivery.

## OpenAPI & AsyncAPI testing altogether

Having the feature parity between synchronous and asynchronous APIs in Microcks opens the door to many new ways of efficiently testing components that provide and implement both API types. Once loaded into Microcks, you will have access to both API definitions including semantic and syntactic elements.

{{< image src="images/blog/continuous-testing-all-your-apis-repository.png" alt="image" zoomable="true" >}}

Using Microcks for mocking both APIs will tremendously accelerate things! Allowing the different teams to start working without waiting for each others! The mobile team will start developing the mobile frontend using REST mocks, the backend team will start working on the backend and the CRM and email system team will start receiving mock messages coming from Microcks.

But using Microcks for testing will also ensure you will be able to reconnect the dots and validate everything - automatically! The better being that Microcks allows testing of REST API using the same tooling and the same code as the ones used for event-driven API.

That is what we have demonstrated using the following CI/CD pipeline. For each and every code change in the Git repository, this pipeline is:

* Building and deploying the application - pretty classic 😉
* Starting a first parallel branch where it will ask Microcks to listen to the Kafka topic used by the application to publish messages. This is the `test-asyncapi` step,
* Starting a second parallel branch where it will ask Microcks to test the REST API endpoints - and do this 2 times on 2 different API versions. Theses are the `test-openapi-v1` and `test-openapi-v2` steps,
* The branches finally join and the application is promoted.

{{< image src="images/blog/continuous-testing-all-your-apis-pipeline.png" alt="image" zoomable="true" >}}

The beauty of it is that the promotion is done `ONLY IF` the REST API endpoints are compliant with the corresponding [OpenAPI specification](https://swagger.io/specification/) `AND` the invocation of this APIs have triggered the publication of messages on Kafka `AND` these messages are all valid regarding the event-based API [AsyncAPI specification](https://v2.asyncapi.com/docs/reference/specification/v2.6.0). Wouah! 🎉

Wondering about the plumbing part of the pipeline? What does the code look like? Is it complex to understand, write and maintain?

For this demonstration, we have used Microcks [Tekton task](https://microcks.io/documentation/guides/automation/tekton/) so it’s basically YAML. Principles remain the same whatever the pipeline technology used. Here’s below the YAML for launching a test on the REST API:

```yaml
- name: test-openapi-v1
  taskRef:
    name: microcks-test
    runAfter:
      - deploy-app
    params:
      - name: apiNameAndVersion
        value: "User registration API:1.0.0"
      - name: testEndpoint
        value: http://user-registration-user-registration.KUBE_APPS_URL
      - name: runner
        value: OPEN_API_SCHEMA
      - name: microcksURL
        value: https://microcks-microcks.KUBE_APPS_URL/api/
      - name: waitFor
        value: 8sec
```

And here’s below the YAML for launching a test on the Async API, they’re pretty similar exception the `testEndpoint` and the `runner` used:

```yaml
- name: test-asyncapi
  taskRef:
    name: microcks-test
    runAfter:
      - deploy-app
    params:
      - name: apiNameAndVersion
        value: "User signed-up API:0.1.1"
      - name: testEndpoint
        value: kafka://my-cluster-kafka-bootstrap-user-registration.KUBE_APPS_URL:443/user-signed-up
      - name: runner
        value: ASYNC_API_SCHEMA
      - name: microcksURL
        value: https://microcks-microcks.KUBE_APPS_URL/api/
      - name: waitFor
        value: 20sec
      - name: secretName
        value: user-registration-broker
```

> This demonstration is using [Tekton pipelines](https://tekton.dev/) but can also be implemented using Jenkins or GitLab CI by using either our [Jenkins plugin](https://microcks.io/documentation/guides/automation/jenkins/) or our [portable CLI tool](https://microcks.io/documentation/guides/automation/cli/).

### Want to play with it?

Excited about the possibilities that it will offer you? Thinking about your next pipeline that will test both types of APIs and validate all your events triggering rules? Wondering about chaining Dev to QA to Production promotion including tests on different brokers and endpoints?

The opportunities are endless and we provide real code allowing you to try them. This whole **User Registration demo** can be found on our [GitHub repository](https://github.com/microcks/api-lifecycle/tree/master/user-registration-demo) with all the instructions to deploy it and run it on your Kubernetes cluster. Do not hesitate trying it out and sending us feedback or ideas on what you want to see next via our [Discord chat](https://microcks.io/discord-invite) 🐙

Thanks for reading and take care. ❤️
