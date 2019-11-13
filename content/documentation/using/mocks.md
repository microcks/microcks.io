---
draft: false
title: "Using exposed mocks"
date: 2019-09-01
publishdate: 2019-09-01
lastmod: 2019-09-02
menu:
  docs:
    parent: using
    name: Using exposed mocks
    weight: 80
toc: true
weight: 30 #rem
---

## Using exposed mocks
    
### Getting infos on microservices mocks
			
Well, now that you have [installed](/documentation/getting-staretd) Microcks, created your own API/Service repository using [SoapUI](../soapui/) or [Postman](../postman/) and discover how to [import and browse content](/documentation/getting-started), you are ready to learn more about how to use mocks managed by Microcks.

First, let's have a look at the summary page presenting an API or Service managed by Microcks. This summary page contains three sections related to different part of the API/Service :

* `Properties` section show basic information on API/Service : its name, its version, its style (REST or SOAP) and you'll also got access to statistics regarding the utilization of the mocks of this API. SOAP style Service also contains extra information like the global `XML Namespace` used by the Service and the embedded `WSDL contract` if any was provided,
* `Tests trend` section shows a little histogram representing the latest tests trend on this API/Service. It provides an access to test history and for launching a new test on an API/Service implementation. More on this topic in the [](./tests/">Tests documentation</a>,
* `Operations` section concentrates informations on the different operations managed by this API or Service. More on that topic below.

			
![mock-rest-summary](/images/mock-rest-summary.png)
			
Here's an example of summary page for a SOAP Service mock :
			
![mock-soap-summary](/images/mock-soap-summary.png)
			
Let's now focus on the `Operations` section of this page. A click on the operation name, unveil its details. Within an Operation panel, you will get generic information on this operation as well as visualization of typical request/response pairs examples (payload content and headers). 2 major informations should be isolated here are :

* The `Mocks URL`: this is the URL fragment to which are exposed the mocks for this Operation of the API/Service. This fragment should be appended to your Microcks server URL to form a invokable URL. For example: `http://microcks-microcks.192.168.99.100.nip.io/rest/Test+API/0.0.1/order/:id`. When this URL contains variables part, this part is instanciated within each example panel,
* The `Dispatcher` and `Dispatching Rules` used by this operation. These elements are used by Microcks for finding an appropriate response to return receiving a mock request. It tells the user of the mocks what should be the immutable elements of his requests wether they may be located into the URL, the query string or the body payload. Microcks supports many dispatcher implementations whose names are rather self-explanatory. You may find: `URI_PARTS`, `URI_PARAMS`, `URI_ELEMENTS`, `QUERY_MATCH` or `SCRIPT`
			
![mock-details](/images/mock-details.png)
			
In the REST API mock example above, you can guess that the `:id` part of the Mock URL is used as the only criterion for finding accurate response when invoking mock. In the SOAP API mock example below, we use a much more elaborated dispatcher that is called `QUERY_MATCH` and uses the companion XPath expression provided as `Dispatching Rules` to extract from request payload the criterion for finding matching response.
			
![mock-soap-details](/images/mock-soap-details.png)
		
### Invoking microservices mocks
			
Invoking Mocks is now pretty easy if you have read the upper section! Just use Microcks for searching the API/Service you want to use and explore the operations of the API/Service. Find the Mock URL and the Http method of the corresponding operation, look at the instanciated URI fragement for different request/response pairs, append the fragment to the Microcks server url and that's it!
			
			
As a rule of thumb, here is how the URL fragment for mocks are built and exposed within Microcks :

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

Easy !?
			
### Common invocation params

| Param | Type | Description | Default / Examples |
| ----- | ---- | ----------- | ------------------ |
| **validate** | boolean | In case of a SOAP microservice with defined WSDL/XSD contract, the mock may realize a validation of XML payload send by consumer if this parameter is set to true. | Default is **false** |
| **delay** | positive integer | Set a response delay to simulate slow responding systems and check behavior of the service consumer being under tests. Note: this is an execution simulation response time: validation time and network latency are not taken into account | Default is **0**. Use for example 1000, to have a 1 second delay on mock invocation |
			
This parameters may be used in addition of the Mock URL displayed on microservice informations page and should be append to the query URL. You may end up with URLs such as : `http://microcks.example.com/soap/HelloService/1.0/sayHello/?delay=250&validate=true`
			
		
	

