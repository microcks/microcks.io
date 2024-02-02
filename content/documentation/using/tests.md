---
draft: false
title: "Testing with Microcks"
date: 2019-09-01
publishdate: 2019-09-01
lastmod: 2023-06-07
weight: 14
---

## Introduction

It is likely you experienced the painful situation of deploying to production only to find out that an API service you integrate with has broken the contract. How can we effectively ensure this does not happen?

Microcks offers mocks but can also be used for **Contract conformance testing** of API or services being under development. You spend a lot of time describing request/response pairs and matching rules: it would be a shame not to use this sample as test cases once the development is on its way!

## Conformance testing

You find on the internet many different representations of how the different testing techniques relates to one another and should be ideally combine into a robust testing pipeline. At Microcks, we particularly like the Watirmelon representation below. Microcks clearly allows you to realize **Automated API Tests** and focus more precisely on **Contract or Conformance testing**.

<p align="center">
  <img alt="Ideal Software Testing Pyrami" src="https://miro.medium.com/max/1400/0*f2vFclaitRRo1w2i.jpg" style="max-width: 75%; border-color: #dddddd; border-style: solid !important"/>
</p>

The purpose of Microcks tests is precisely to check that the **Interaction Contract** - as represented by an OpenAPI or AsyncAPI specification, a Postman collection or whatever [supported artifact](./importers/#supported-formats) - consumer and producer agreed upon is actually respected by the API provider. In other words: to check that an implementation of the API is conformant to its contract.

In order to help you getting confidence into your implementations, we developed the **Conformance index** and **Conformance score** metrics that you can see on the top right of each API | Service details page:

{{< image src="images/test-conformance.png" alt="image" zoomable="true" >}}

> This metrics are available from the `1.6.0` version of Microcks.

### Conformance metrics

The **Conformance index** is a kind of grade that estimates how your API contract is actually covered by the samples you've attached to it. We compute this index based on the number of samples you've got on each operation, the complexity of dispatching rules of these operation and so on... It represents the maximum possible conformance score you may achieve if all your tests are successfull.

The **Conformance score** is the current score that has been computed during your last test execution. We also added a trend computation if things are going better or worse comparing to your history of tests on this API.

Once you have activated [labels filtering](./advanced/organizing/#applying-labels) on your repository and have ran a few tests, Microcks is also able to give you an aggregated view of your API patrimony in termes of **Conformance Risks**. The tree map below is displayed on the *Dashboard* page and represents risks in terms of average score per group of APIs (depending on the concept you chose it could be per domain, per application, per team, ...)

{{< image src="images/test-conformance-risks.png" alt="image" zoomable="true" >}}

This visualization allows you to have a clear understanding of your conformance risks at first glance!

## Running tests
						
From the page displaying basic information on your [API or Service mocks](../mocks/#mocks-info), you have the ability to launch new tests against different endpoints that may be representing different environment into your development process. Hitting the **NEW TEST...** button, leads you to the following form where you will be able to specify a target URL for the test, as well as a Runner—a testing strategy for your new launch:
			
{{< image src="images/test-form.png" alt="image" zoomable="true" >}}
			
> While it is convenient to launch test `on demand` manually, it may be interesting to consider launching new tests automatically when a new deployment of the application occurs for example... Microcks allows you such automation by offering API for ease of integration. See [here](../../automating/api/) for more details).
			
## Test parameters

### Service under test

**Service under test** is simply the reference of the API/Service specification we'd like to test. This a couple of `Service Name` and `Service Version`.

### Test Endpoint

The **Test Endpoint** is simply a URI where a deployed component is providing API specification endpoint. In the testing literature, this is usually defined as the URI of the [System Under Test](https://en.wikipedia.org/wiki/System_under_test).

#### HTTP based APIs

For HTTP based APIs (REST, SOAP, GraphQL or gRPC), this is a simple URL that should respect following pattern:

```sh
http[s]://{service.endpoint.url:port}/{service.path}
```
#### Event based APIs

For Event based API through [Async API](../asyncapi) testing, pattern is depending on the protocole binding you'd like to test.

##### Kafka 

Kafka Test Endpoint have the following form with optional parameters placed just after a `?` and separated using `&` character:

```sh
kafka://{kafka.broker.url:port}/{kafka.topic.name}[?param1=value1&param2=value2]
```

| Optional Params | Description |
| --------------- | ----------- |
| `registryUrl` | The URL of schema registry that is associated to the tested topic. This parameter is required when using and testing [Avro](https://avro.apache.org) encoded messages. |
| `registryUsername` | The username used if access to the registry is secured. |
| `registryAuthCredSource` | The source for authentication credentials if any. Valid values are just `USER_INFO`. |

As an example, you may have this kind of Test Endpoint value: `kafka://mybroker.example.com:443/test-topic?registryUrl=https://schema-registry.example.com&registryUsername=fred:letmein&registryAuthCredSource=USER_INFO`

##### MQTT

MQTT Test Endpoint have the following form with no optional parameters:

```sh
mqtt://{mqtt.broker.url:port}/{mqtt.topic.name}
```

##### AMQP

AMQP 0.9.1 Test Endpoint have the following form with optional parameters placed just after a `?` and separated using `&` character:

```sh
amqp://{amqp.broker.url:port}/[{amqp.vhost}/]{amqp.destination.type}/{amqp.destination.name}[?param1=value1&param2=value2]
```

`amqp.destination.type` is used to specify if we shoulf connect to either a queue (use the `q` value) or an exchange speciyfing its type: `d` dor direct, `f` for fanout, `t` for topic, `h` for headers. Then you have to specify either the queue or exchange name in `amqp.detaintion.name`.

Depending on the type of destination, you will need additional optional parameters as specified below:

| Optional Params | Description |
| --------------- | ----------- |
| `routingKey` | Used to specify a routing key for direct or topic exchanges. If not specified the `*` wildcard is used. |
| `durable` | Flag telling if exchange to connect to is durable or not. Default is `false`. |
| `h.{header}` | A bunch of headers where name starts with `h.` in order to deal with headers exchange. The `x-match` property is set to `any`to gather the most message as possible. |

As an example, you may have this kind of Test Endpoint values: `amqp://rabbitmq.example.com:5672/h/my-exchange-headers?h.h1=h1&h.h2=h2` or `amqp://rabbitmq.example.com:5672/my-vhost/t/my-exchange-topic?routingKey=foo`

##### WebSocket

WebSocket Test Endpoint have the following form with no optional parameters

```sh
ws://{ws.endpoint.url:port}/{channel.name}
```

##### NATS

NATS Test Endpoint have the following form with no optional parameters:

```sh
nats://{nats.endpoint.url:port}/{queue-or-subject.name}
```

##### Google PubSub

Google PubSub Test Endpoint have the following form with no optional parameters:

```sh
googlepubsub://{google-platform-project.name}/{topic.name}
```

##### Amazon SQS

Amazon Simple Queue Service Test Endpoint have the following form with optional parameters placed just after a `?` and separated using `&` character:

```sh
sqs://{aws.region}/{sqs.queue.name}[?param1=value1]
```

| Optional Params | Description |
| --------------- | ----------- |
| `overrideUrl`   | The AWS endpoint override URI used for API calls. Handy for using SQS via [LocalStack](https://localstack.cloud) |

##### Amazon SNS

Amazon Simple Notification Service Test Endpoint have the following form with optional parameters placed just after a `?` and separated using `&` character:

```sh
sns://{aws.region}/{sns.topic.name}[?param1=value1]
```

| Optional Params | Description |
| --------------- | ----------- |
| `overrideUrl`   | The AWS endpoint override URI used for API calls. Handy for using SNS via [LocalStack](https://localstack.cloud) |


### Test Runner

As stated above, Microcks offers different strategies for running tests on endpoints where our microservice being developed are deployed. Such strategies are implemented as **Test Runners**. Here are the default Test Runners available within Microcks:
			
| Test Runner | API/Service Types | Description |
| ----------- | ----------------- | ----------- |
| `HTTP` | REST and SOAP | Simplest test runner that only checks that valid target endpoints are deployed and available: returns a `20x` or `404` Http status code when appropriated. This can be called a simple "smock test". |
| `SOAP` | SOAP | Extension of HTTP Runner that also checks that the response is syntactically valid regarding SOAP WebService contract. It realizes a validation of the response payload using XSD schemas associated to service. |
| `SOAP_UI` | REST and SOAP | When the API artifact is defined using [SoapUI](../soapui): ensures that assertions put into Test cases are checked valid. Report failures.|
| `POSTMAN` | REST | When the API artifact is defined using [Postman](../postman): executes test scripts as specified within Postman. Report failures.| 
| `OPEN_API_SCHEMA`|  REST | When the API artifact is defined using [Open API](../openapi): it executes example requests and check that results have the expected Http status and that payload is compliant with JSON / OpenAPI schema specified into OpenAPI specification.| 
| `ASYNC_API_SCHEMA`|  EVENT | When the API artifact is defined using [Async API](../asyncapi): it connects to specified broker endpoints, consume messages and check that payload is compliant with JSON / Avro / AsyncAPI schema specified into AsyncAPI specification.|
| `GRPC_PROTOBUF`|  GRPC | When the API artifact is defined using [gRPC](../grpc): it executes example requests and check that results payload is compliant with Protocol Buffer schema specified into gRPC proto file.|
| `GRAPHQL_SCHEMA`|  GRAPHQL | When the API is of type [GraphQL](../graphql): it executes example requests and check that results payload is compliant with the GraphQL Schema of the API.|

### Timeout

Depending on the type of Service or Tests you are running, the specification of a **Timeout** maybe mandatory. This is a numerical value expressed in milliseconds.

### Secret

Depending on the Test Endpoint you are connecting to, you may need additional authentication information - like credentials or custom X509 Certificates. You may reuse [External Secrets](../administrating/secrets) that has been made available in the Microcks installation by the administrator.

## Getting tests history and details

Tests history for an API/Service is easily accessible from the API | Service [summary page](../mocks/#mocks-info). Microcks keep history of all the launched tests on an API/Service version. Success and failures are kept in database with unique identifier and test number to allow you to compare cases of success and failures.

{{< image src="images/test-history.png" alt="image" zoomable="true" >}}

Specific test details can be visualized : Microcks also records the request and response pairs exchanged with the tested endpoint so that you'll be able to access payload content as well as header. Failures are tracked and violated assertions messages displayed as shown in the screenshot below :

{{< image src="images/test-details.png" alt="image" zoomable="true" >}}
