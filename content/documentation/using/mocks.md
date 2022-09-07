---
draft: false
title: "Using exposed mocks"
date: 2019-09-01
publishdate: 2019-09-01
lastmod: 2022-09-07
menu:
  docs:
    parent: using
    name: Using exposed mocks
    weight: 80
toc: true
weight: 30 #rem
---

## Using exposed mocks
    
### Getting info on microservices mocks
			
Well, now that you have [installed](/documentation/getting-started) Microcks, created your own API/Service repository using [OpenAPI](../openapi/), [AsyncAPI](../asyncapi/), [gRPC](../grpc/), [GraphQL](../graphql/), [SoapUI](../soapui/) or [Postman](../postman/) and discovered how to [import and browse content](/documentation/getting-started), you are ready to learn more about how to use mocks managed by Microcks.

First, let's have a look at the summary page presenting an API or Service managed by Microcks. This summary page contains three sections related to different parts of the API/Service :

* `Properties` section shows basic information on the API/Service : its name, its version, its style (REST, SOAP, EVENT, GRAPH or GRPC) and you'll also get access to statistics such as the utilization of this API's mocks. SOAP style Services also contain extra information like the global `XML Namespace` used by the Service and the embedded `WSDL contract` if any was provided,
* `Tests` section shows a little histogram representing the conformance index and tests trend on this API/Service. It provides access to the test history and allows a new test on an API/Service implementation to be launched. More on this topic in the [Tests documentation](/documentation/using/tests),
* `Operations` section focuses on the different operations managed by this API or Service. More on that topic below.

			
![mock-rest-summary](/images/mock-rest-summary.png)
			
Here's an example of summary page for a SOAP Service mock :
			
![mock-soap-summary](/images/mock-soap-summary.png)
			
Let's now focus on the `Operations` section of this page. A click on the operation name unveils its details. Within an Operation panel, you will get generic information on this operation as well as visualization of typical request/response pair examples (payload content and headers). Two major highlights should be pointed out here :

* The `Mocks URL`: this is the URL that exposes the mocks for this Operation of the API/Service. For example: `http://microcks-microcks.192.168.99.100.nip.io/rest/Test+API/0.0.1/order/:id`. When this URL contains variables part, this part is instantiated within each example panel,
* The `Dispatcher` and `Dispatching Rules` used by this operation. These elements are used by Microcks for finding an appropriate response to return when receiving a mock request. It tells the user of the mocks what should be the immutable elements of their request whether they may be located in the URL, the query string or the body payload. Microcks supports many dispatcher implementations whose names are rather self-explanatory. You may find: `URI_PARTS`, `URI_PARAMS`, `URI_ELEMENTS`, `QUERY_MATCH`, `QUERY_ARGS`, `JSON_BODY`, `SCRIPT` or `FALLBACK`

![mock-details](/images/mock-details.png)

In the REST API mock example above, you will guess that the `:id` part of the Mock URL is used as the only criterion for finding a specific response when invoking the mock. In the SOAP API mock example below, we use a much more elaborate dispatcher called `QUERY_MATCH` and use the companion XPath expression provided as `Dispatching Rules` to extract from the request payload the criterion for finding the matching response.

![mock-soap-details](/images/mock-soap-details.png)

### Invoking API | services mocks

Invoking Mocks is now pretty easy if you have read the section above! Just use Microcks for searching the API/Service you want to use and then explore the operations of the API/Service. Find the Mock URL and the Http method of the corresponding operation, look at the instantiated URI for each example request/response pair, copy the URI to your favorite http client and you're ready to go!

As a rule of thumb, here is how the URL fragments for mocks are built and exposed within Microcks :

* Mocks for REST API mocks are exposed on `/rest` sub-context. Mock for SOAP API mocks are exposed on `/soap` sub-context,
* Name of API/Service is then added as path element of URL. Special characters of name are encoded within URL part,
* Version of API/Service is then added as path element of URL,
* For REST API, name of resource managed by operation and URL parts may be added.

Some examples in the table below for a Microcks server reachable at `http://microcks.example.com` :

| Type | Name | Version | Operation / Parts / Params | Full Mock URL |
| ---- | ---- | ------- | -------------------------- | -------- |
| SOAP | HelloService | 0.9 | "sayHello operation", NA | `http://microcks.example.com/soap/HelloService/0.9/` |
| REST | Test API | 0.0.1 | "Find by id" operation, order resource, example with id=123456 | `http://microcks.example.com/rest/Test+API/0.0.1/order/123456`|
| REST | Test API | 0.0.1 | "List by status" operation, order resource, example with status=approved | `http://microcks.example.com/rest/Test+API/0.0.1/order?status=approved` |

Easy!?

### Common invocation params

| Param | Type | Description | Default / Examples |
| ----- | ---- | ----------- | ------------------ |
| **validate** | boolean | In case of a SOAP microservice with a defined WSDL/XSD contract, the mock will perform a validation of the XML payload sent by consumer if this parameter is set to true. | Default is **false** |
| **delay** | positive integer | Set a response delay to simulate slow responding systems and to check the behavior of the service consumer under test. Note: this is an execution simulation response time: validation time and network latency are not taken into account | Default is **0**. Use for example 1000, to have a 1 second delay on mock invocation |

These parameters may be used in addition of the Mock URL displayed on the microservice's information page and should be append to the query URL. You will end up with URLs such as : `http://microcks.example.com/soap/HelloService/1.0/sayHello/?delay=250&validate=true`
