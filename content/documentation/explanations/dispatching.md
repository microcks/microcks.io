---
draft: false
title: "Dispatcher & dispatching rules"
date: 2020-03-03
publishdate: 2020-03-03
lastmod: 2025-09-22
weight: 18
---

## Introduction

In order to provide smart mocks, Microcks is using `Dispatcher` and `Dispatching Rules` to find the most appropriate response to return when receiving a request. 

The `Dispatcher` is defining a *routing logic* for mocks, which specifies the kind of elements of an incoming request that will be examined to find a match. The `Dispatcher Rules` refine those elements as well as the matching rule to find the correct response.

By default, Microcks looks at the variable parts between the different examples of the same operation when importing a new Service or API and infers those two elements. Then, based on those elements, it computes some *fingerprint* that allows unique identification for every request/response pair. That's what we called the `Dispatch Criteria`.

When using this default and receiving an incoming request on a mock endpoint, Microcks will reapply the Service or API's `Dispatching Rules` to compute the *fingerprint* again and find the appropriate response matching this criteria.

However, you may need more than this inferred logic in some situations. Microcks got you covered! It allows you to configure and use advanced dispatchers and associated rules, providing some advanced dispatchers to implement your own business rules or constraints.

## Inferred dispatchers

As a reminder on default, inferred dispatchers: you may find `URI_PARTS`, `URI_PARAMS`, `URI_ELEMENTS`, `QUERY_ARGS`, `QUERY_MATCH` or `SCRIPT`. The first three are usually found when using Postman or OpenAPI as a contract artifact; they are deduced from the paths and contract elements. The last two are usually found when using SoapUI as a contract artifact.

Below are some explanations on these dispatchers and associated dispatching rules syntax:

| <div style="width: 160px">Dispatcher</div>  | Explanations | Rules syntax |
| ------------------------------------------- | ------------ | ------------ |
| `URI_PARTS` | Inferred when a Service or API operation has only `path` parameters | Path variables name separated by a `&&`. Example: for a `/blog/post/{year}/{month}` path, rule is `year && month` |
| `URI_PARAMS`| Inferred when a Service or API operation has only `query` parameters | Query variables name separated by a `&&`. Example: for a `/search?status={s}&query={q}` operation, rule is `status && query` |
| `URI_ELEMENTS` | Inferred when a Service or API operation has both `path` and `query` parameters | Path variables name separated by a `&&` then `??` followed by query variables name separated by a `&&`. Example: for a `/v2/pet/{petId}?user_key={k}`, rule is `petId ?? user_key` |
| `QUERY_ARGS` | Inferred when a GraphQL API or gRPC service operation has only primitive types arguments | Variables name separated by a `&&`. Example: for a GraphQL mutation `mutation AddStars($filmId: String, $number: Int) {...}`, rule is `filmId && number` |
| `QUERY_MATCH` | Extracted from SoapUI project. Defines a XPath matching evaluation: extracted result from input query should match a response name | Example: for a `Hello` SOAP Service that extracts the `sayHello` element value to find a greeting rule is `declare namespace ser='http://www.example.com/hello'; //ser:sayHelloResponse/sayHello`. <br/><br/> XPath functions can also be used here for evaluation - eg. something like: `concat(//ser:sayHello/title/text(),' ',//ser:sayHello/name/text())` |
| `SCRIPT` | Extracted from SoapUI project. Defines a Groovy script evaluation: result of type String should match a response name | See [below section on script dispatcher](./#script-dispatcher). |

## Dispatching rules override

Changing `Dispatching Rules` or even the `Dispatcher` can be done by different ways:
* Via the web UI, selecting `Edit Properties` of the operation from the 3-dots menu on the right of the operation name. You should be logged as a repository `manager` to have this option (see [Managing Users](/documentation/guides/administration/users) how-to guide if needed),
* Via [Microcks' owns API](/documentation/references/apis/open-api) after being [connected to Microcks API](/documentation/guides/automation/api),
* Via an additional [API Metadata](/documentation/references/metadata) artifact that allow this customization,
* Via Microcks [OpenAPI extensions](/documentation/references/artifacts/openapi-conventions/#openapi-extensions) or [AsyncAPI extensions](/documentation/references/artifacts/asyncapi-conventions/#asyncapi-extensions) that allow this customization as well.

## Advanced dispatchers and rules

### QUERY HEADER dispatcher

Since Microcks `1.11`, the `QUERY_HEADER` dispatching strategy has been available on REST mocks. It allows specifying one or many request headers as the criterion for finding a matching response.

If you want to use it, you can just specify a dispatching rule where header names are separated by a `&&`. An example rule can be `x-api-key && x-tenant` - in this case, Microcks will use both request headers' values to find a matching response.

### JSON BODY dispatcher

The `JSON_BODY` dispatching strategy allows specifying a dispatching rule that will analyse the request payload in order to find a matching response. In order to specify such an expression, you can use the help vertical right section of the page, which will provide examples and copy/paste shortcuts.

The dispatching rules of `JSON_BODY` dispatcher are always expressed using a JSON payload with 3 properties:

* `exp` is the expression to evaluate against the request body. It is indeed a [JSON Pointer](https://tools.ietf.org/html/rfc6901) expression. We already use this expression language in [Templating features](/documentation/references/templates/#json-body-pointer-expression). From the evaluation of this expression, we'll get a value. Here `/country` denotes the `country` field of the incoming request.
* `operator` is the operator to apply. Different operators are available like `equals`, `range`, `regexp`, `size` and `presence`,
* `cases` are a number of cases where keys are values to compare to the extracted value from the incoming request.

Depending on the operator applied, the `cases` may have different specification formats.

| <div style="width: 120px">Operator</div> |<div style="width: 200px">Cases syntax</div> | Comments |
| ---------- | ----------------- | ------- |
| `equals` | `"<value>": "<response>"` | A case named `default` is used as the default option |
| `range` | `[<min>;<max>]: "<response>"` | Bracket side matter: `[` means include, `]` means exclusive for a left bracket. A case named `default` is used as default option | 
| `size` | `"[<min>;<max>]": "<response>"` | Size of an array property. Brackets must be inclusive. A case named `default` is used as the default option |
| `regexp` | `"<posix regexp>": "<response>"` | Regular expression applied to value. A case named `default` is used as the default option |
| `presence` | `"found": "<response>"` | Check the presence/absence of a property. 2 mandatory cases: `found` and `default` |

Say we've got this Beer API allowing us to record a new beer in our own catalog. We have a `POST` method that allows to create new beer resources and we want to make the difference between 2 cases: the `Accepted` and the `Not accepted` responses. So we have to start describing the 2 examples in our API contract. You'll notice in the capture below that:

* `Dispatcher` and `Dispatching Rules` are empty. That means that you'll get the first found response when invoking the mock, no matter the request.
* We have used [Templating features](/documentation/references/templates) to make the response content more dynamic. So the `{{ }}` notation is within the response body.

{{< image src="images/documentation/dispatcher-case.png" alt="image" zoomable="true" >}}

Our business constraint here is to only accept beers coming from Belgium 🇧🇪; otherwise, we have to return the `Not accepted` response. We may edit our dispatching rule to use the `equals` operator and save, and we can check that this rule is applied to our operation. This rule override will be persisted into Microcks and will survive future discoveries and refreshes of this API version.

{{< image src="images/documentation/dispatcher-updated.png" alt="image" zoomable="true" >}}

> 💡 We recommend having an in-depth look at the example provided on the page to fully understand the power of different options.

#### Illustration

Given the templated responses and the above dispatching rule for evaluating the body of incoming requests, we can now test our mock.

Let's start by creating a new beer coming from Belgium:

```sh
  curl -X POST http://microcks.example.com/rest/Beer+Catalog+API/1.0/beer \
    -H 'Content-type: application/json' \
    -d '{"name": "Abbey Brune", "country": "Belgium", "type": "Brown ale", "rating": 4.2, "references": [ { "referenceId": 1234 }, { "referenceId": 5678 } ]}'
```

```sh    
{
  "name": "Abbey Brune",
  "country": "Belgium",
  "type": "Brown ale",
  "rating": 4.2,
  "references": [
    { "referenceId": 1234 },
    { "referenceId": 5678 }
  ]
}
```

It is a success as the `country` has the `Belgium` value, and the `Accepted` response is returned. Templates in this response are evaluated regarding the request content.

Now let's try with a German beer... You'll see that the `Not accepted` response is matched (look also at the return code) and adapted regarding the incoming request:

```sh
  curl -X POST http://microcks.example.com/rest/Beer+Catalog+API/1.0/beer \
    -H 'Content-type: application/json' \
    -d '{"name": "Spaten Oktoberfiest", "country": "Germany", "type": "Amber", "rating": 2.8, "references": []}'
```

```sh
< HTTP/1.1 406 
{
  "error": "Not accepted",
  "message": "Germany origin country is forbidden"
}
```

### FALLBACK dispatcher

Another useful advanced dispatching strategy introduced in the [Advanced Dispatching and Constraints for mocks](https://microcks.io/blog/advanced-dispatching-constraints/) blog post is the `FALLBACK` strategy. As you may have guessed by its name, it behaves like a `try-catch` wrapping block in programming: it will try applying a first dispatcher with its own rule, and if it finds nothing, it will default to a `fallback` response. This will allow you to define a default response event for the incoming requests that do not match any dispatching criteria.

The dispatching rules of `FALLBACK` dispatcher are expressed using a JSON payload with 3 properties:

* `dispatcher` is the original dispatching strategy you want to be applied at first. Valid values are all the other dispatching strategies,
* `dispatcherRules` are the rules you want the original dispatcher to apply when looking for a response,
* `fallback` is simply the name of the response to use as the fallback if nothing is found on the first try.

Here is the sample that was introduced in the aforementioned blog post. In case of an unknown region requested as a query parameter on a Weather Forecast API, we'll fallback to an `unknown` response providing a meaningful error message:

{{< image src="images/blog/advanced-dispatching-constraints-final.png" alt="image" zoomable="true" >}}

#### Illustration

Just issue an HTTP request with an unmanaged region like below:

```sh
  curl 'https://microcks.apps.example.com/rest/WeatherForecast+API/1.0.0/forecast?region=center&apiKey=qwertyuiop' -k
```

```sh
Region is unknown. Choose in north, west, east or south.%
```

### PROXY dispatcher

The `PROXY` dispatcher was released in Microcks `1.9.1` and introduced in this [blog post](https://microcks.io/blog/new-proxy-features-1.9.1/). As you may have guessed, this dispatcher simply changes Microcks' base URL and makes a call to a real backend service.

When using `PROXY` as a dispatcher, the `dispatcherRules` should just be set to the base URL of the target backend service.

### PROXY FALLBACK dispatcher

The advanced `PROXY_FALLBACK` dispatcher works similarly to the `FALLBACK` dispatcher, but with one key difference: when no matching response is found within the Microcks’ dataset, instead of returning a fallback response, it changes the base URL of the request and makes a call to the real service.

The dispatching rules of `PROXY_FALLBACK` dispatcher are expressed using a JSON payload with 3 properties:

* `dispatcher` is the original dispatching strategy you want to be applied at first. Valid values are all the other dispatching strategies,
* `dispatcherRules` are the rules you want the original dispatcher to apply when looking for a response,
* `proxyUrl` must be set to the base URL of the target backend service.

### SCRIPT dispatcher

`SCRIPT` dispatchers are the most versatile and powerful to integrate custom dispatching logic in Microcks. When using such a `Dispatcher`, `Dispatching Rule` is a script that is evaluated and has to return the name of mock response. You need to use `GROOVY` or `JS` to specify the scripting language. 

Before actually evaluating the script, Microcks builds a runtime context where elements from incoming requests are made available. Therefore, you may have access to different objects from the script.

| <div style="width: 160px">Object</div> | Description |
| ------ | ----------- |
| `mockRequest` | Wrapper around incoming request that fulfills the contract of [Soap UI mockRequest](https://www.soapui.org/docs/soap-mocking/creating-dynamic-mockservices/#2-Mock-Handler-Objects). Allows you to access body payload with `requestContent`, request headers with `getRequestHeaders()`, or all other request elements with `getRequest()` that accesses underlying Java HttpServletRequest object |
| `requestContext` | Allows you to access a request-scoped context for storing any kind of objects. Such context elements can be later reused when producing response content from [templates](/documentation/references/templates) |
| `log` | Access to a logger with commons methods like `debug()`, `info()`, `warn()` or `error()`. Useful for troubleshooting. |
| `store` | Allows you to access a service-scoped persistent store for string values. Such store elements can be later reused in other operations' scripts to keep track of state or feed the `requestContext`. Store provides helpful methods like `put(key, value)`, `get(key)` or `delete(key)`. Store elements are subject to a Time-To-Live that is 10 seconds by default. This TTL can be overridden using the `put(key, value, ttlInSeconds)` method. |

#### Groovy Scripting

Groovy is the traditional scripting language supported by Microcks.

**Common use-cases:**

Dispatch according to a header value:

```groovy
def headers = mockRequest.getRequestHeaders()
log.info("headers: " + headers)
if (headers.hasValues("testcase")) {
   def testCase = headers.get("testcase", "null")
   switch(testCase) {
      case "1":
         return "negative amount";
      case "2":
         return "null amount";
      case "3":
         return "positive amount";
      case "4":
         return "standard amount";
   }
}
return "standard amount"
```

Analyse XML body payload content:

```groovy
import com.eviware.soapui.support.XmlHolder
def holder = new XmlHolder( mockRequest.requestContent )
def name = holder["//name"]

if (name == "Andrew"){
    return "Andrew Response"
} else if (name == "Karla"){
    return "Karla Response"
} else {
    return "World Response"
}
```

Analyse JSON body payload content and set context:

```groovy
log.info("request content: " + mockRequest.requestContent);
def json = new groovy.json.JsonSlurper().parseText(mockRequest.requestContent);
if (json.cars.Peugeot != null) {
   requestContext.brand = "Peugeot";
   log.info("Got Peugeot");
}
if (json.cars.Volvo != null) {
   requestContext.brand = "Volvo";
   log.info("Got Volvo");
}
return "Default"
```

Calling an external API (here the invocations metrics from Microcks in fact 😉) to use external information in the dispatching logic:

```groovy
def invJson = new URL("http://127.0.0.1:8080/api/metrics/invocations/OneApp%20Home/1.0.0").getText();
def inv = new groovy.json.JsonSlurper().parseText(invJson).dailyCount
log.info("daily invocation: " + inv)
[...]
```

Persist, read and delete information from the service-scoped persistent store:

```groovy
def foo = store.get("foo");
def bar = store.put("bar", "barValue");
store.delete("baz");
```

#### JavaScript Scripting

JavaScript support is available through QuickJS4J integration.
JavaScript scripts have access to the same runtime context objects as Groovy scripts.

> **NOTE**: Available from version 1.13.X

**Common use-cases:**

Dispatch according to a header value:

```javascript
const testCase = mockRequest.getRequestHeader("testcase")[0];
log.info("testCase: " + testCase);
if (testCase !== undefined) {
   switch(testCase) {
      case "1":
         return "negative amount";
      case "2":
         return "null amount";
      case "3":
         return "positive amount";
      case "4":
         return "standard amount";
   }
}
return "standard amount";
```

Analyse JSON body payload content and set context:

```javascript
log.info("request content: " + mockRequest.requestContent());
const json = JSON.parse(mockRequest.requestContent());
if (json.cars && json.cars.Peugeot) {
   requestContext.brand = "Peugeot";
   log.info("Got Peugeot");
}
if (json.cars && json.cars.Volvo) {
   requestContext.brand = "Volvo";
   log.info("Got Volvo");
}
return "Default";
```

Calling an external API using fetch:

```javascript
const response = fetch("http://127.0.0.1:8080/api/metrics/invocations/top");
const invJson = response.body;
const inv = JSON.parse(invJson)[0].dailyCount;
log.info("daily invocation: " + inv);
// ... rest of logic
```

Persist, read and delete information from the service-scoped persistent store:

```javascript
const foo = store.get("foo");
const bar = store.put("bar", "barValue");
store.delete("baz");
```
