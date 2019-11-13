---
draft: false
title: "Executing tests"
date: 2019-09-01
publishdate: 2019-09-01
lastmod: 2019-09-02
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
			
From the page displaying basic information on your [microservice mocks](../mocks/#mocks-info), you have the ability to launch new tests against different endpoints that may be representing different environment into your development process. Hitting the <b>NEW TEST...</b> button, leads you to the following form where you will be able to specify an target URL for test, as weel as a Runner - a testing strategy for your new launch :
			
![test-form](/images/test-form.png)
			
> While it is convenient to launch test 'on demand' manually, it may be interesting to consider launching new tests automatically when a new deployment of the application occurs for example... Microcks allows you such automation by offering API for ease of integration. See [here](../../contributing/api/"> for more details).
			
## Different tests runners
			
As stated above, Microcks offers different strategies for runnning tests on endpoints where our microservice being developped should have been developped. Such strategies are implemented as <b>Test Runners</b>. Here are the default Test Runners available within Microcks:
			
| Test Runner | API/Service Types | Description |
| ----------- | ----------------- | ----------- |
| `HTTP` | REST and SOAP | Simplest test runner that only checks that valid target endpoints are deployed and available: returns a `20x` or `404` Http status code when appropriated. This can be called a simple "smock test". |
| `SOAP` | SOAP | Extension of HTTP Runner that also checks that the response is syntaxically valid regarding SOAP WebService contract. It realizes a validation of the response payload using XSD schemas associated to service. |
| `SOAP_UI` | REST and SOAP | When the microservice mock repository is defined using [SoapUI](../soapui): ensures that assertions put into Test cases are checked valid. Report failures.| 
| `POSTMAN` | REST | When the microservice mock repository is defined using [Postman](../postman): executes test scripts as specified within Postman. Report failures.| 
| `OPEN_API_SCHEMA`|  REST | When the microservice mock repository is defined using [Open API](../openapi): it executes example requests and check that results have the expected Http status and that payload is compliant with JSON / OpenAPI schema specified into OpenAPI specification.| 

## Getting tests history and details

Tests history for an API/Service is easily accessible from the microservice [summary page](../mocks/#mocks-info). Microcks keep history of all the launched tests on an API/Service version. Success and failures are kept in database with unique identifier and test number to allow you to compare cases of success and failures.
			
![test-history](/images/test-history.png)
			
Specific test details can be visualized : Microcks also records the request and response pairs exchanged with the tested endpoint so that you'll be able to access payload content as well as header. Failures are tracked and violated assertions messages displayed as shown in the screenshot below :
			
![test-details](/images/test-details.png)
