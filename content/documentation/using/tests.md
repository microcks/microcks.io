---
draft: false
title: "Executing tests"
date: 2019-09-01
publishdate: 2019-09-01
lastmod: 2022-01-06
menu:
  docs:
    parent: using
    name: Executing tests
    weight: 100
toc: true
weight: 30 #rem
---

## Running tests
			
Microcks offers mocks but can also be used for **Contract testing** of API or services being under development. You spend a lot of time describing request/response pairs and matching rules: it would be a shame not to use this sample as test cases once the development is on its way!
			
From the page displaying basic information on your [API or Service mocks](../mocks/#mocks-info), you have the ability to launch new tests against different endpoints that may be representing different environment into your development process. Hitting the **NEW TEST...** button, leads you to the following form where you will be able to specify a target URL for the test, as well as a Runner—a testing strategy for your new launch:
			
![test-form](/images/test-form.png)
			
> While it is convenient to launch test `on demand` manually, it may be interesting to consider launching new tests automatically when a new deployment of the application occurs for example... Microcks allows you such automation by offering API for ease of integration. See [here](../../automating/api/) for more details).
			
## Test parameters

### Service under test

**Service under test** is simply the reference of the API/Service specification we'd like to test. This a couple of `Service Name` and `Service Version`.

### Test Endpoint

The **Test Endpoint** is simply a URI where a deployed component is providing API specification endpoint. In the testing literature, this is usually defined as the URI of the [System Under Test](https://en.wikipedia.org/wiki/System_under_test).

#### HTTP based APIs

For HTTP based APIs (REST or SOAP), this is a simple URL that should respect following pattern:

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

##### WebSocket

WebSocket Test Endpoint have the following form with no optional parameters:

```sh
ws://{ws.endpoint.url:port}/{channel.name}
```

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

![test-history](/images/test-history.png)

Specific test details can be visualized : Microcks also records the request and response pairs exchanged with the tested endpoint so that you'll be able to access payload content as well as header. Failures are tracked and violated assertions messages displayed as shown in the screenshot below :

![test-details](/images/test-details.png)
