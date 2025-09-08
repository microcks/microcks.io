---
draft: false
title: "Dynamic mock content"
date: 2020-02-11
publishdate: 2020-02-11
lastmod: 2025-08-26
weight: 8
---

## Introduction

Whilst we deeply think that "real-world" static values for request/response samples are crucial to fully understanding the business usages and expectations of an API, we have to admit that it is more than often useful to introduce some kind of dynamically generated content for the response. 

Those use cases encompass:

* random numbers that may be defined in a range,
* today's date or today's + an amount of time (for validity date, for example),
* response part expressed from request part (body part, header, query param)

Thus, Microcks has some templating features allowing the specification of dynamic parts in response content.

Let's introduce this new feature with an example: a simple `Hello API` that takes a JSON payload as the request payload and returns a `Greeting` response including the message's ID, the date of message generation, and the message content itself, which is just saying `Hello !`.

You can find the OpenAPI v3 contract of this API [here](https://github.com/microcks/microcks/blob/master/webapp/src/test/resources/io/github/microcks/util/openapi/hello-dynamic-openapi.yaml), and here's the result once imported into Microcks:

{{< image src="images/documentation/template-intro.png" alt="image" zoomable="true" >}}

You'll notice that the response payload is expressed using some templating mustaches (`{{` and `}}`) that indicate here that Microcks should recognize the delimited expression and replace it with new values.

When invoked twice with different params at different dates, here are the results:

```sh
  curl -XGET http://microcks.example.com/rest/Hello+Dynamic+API/1.0.0/hello -H 'Content-type: application/json' \
    -d '{"name": "World"}' -s | jq .

```

```json
{
  "id": "pQnDIytzeYJFLxaQg56yObw0WTpYNBMjPYu7FLBoNSGF6ZJsTcHov5ZmaiWG8Gt8",
  "date": "10/02/2020",
  "message": "Hello World!"
}
```
# Wait for a day...
```sh
  curl -XGET http://microcks.example.com/rest/Hello+Dynamic+API/1.0.0/hello -H 'Content-type: application/json' \
    -d '{"name": "Laurent"}' -s | jq .
```

```json
{
  "id": "Hn9lUKkzYsvQq98wDEHa7Ln3H4eVfnfpJLLPPe4ns9vBgaTRvblOOBHIVq3BluEC",
  "date": "11/02/2020",
  "message": "Hello Laurent!"
}
```

Here we are: 1 sample definition but dynamic content generated on purpose!

## Few concepts

Let's explain the few concepts behind Microcks' templating features. These are really simple and straightforward: 

* An expression should be delimited by mustaches like this: `{{ expression }}`. This pattern can be included in any textual representation of your response body content: plain text, JSON, XML, whatever... Microcks will just replace this pattern with its evaluated content or `null` if evaluation fails for any reason,
* An expression can be a reference to a context variable. In this case, we use a `.` notation to tell which property of this variable we refer to. Built-in contextual information is attached to the variable named `request` so we may use expressions like `request.body`, for example,
* An expression can also be a function evaluation. In this case, we use a `()` notation to indicate the function name and its arguments. For example, we use `randomString(64)` to evaluate the random string generation function with one arg being `64` (the length of the desired string),
* An expression may include `>` redirect character so that the result from a first evaluation is injected as an extra argument on the next function. For example, you may use `uuid() > put(myId)`. So that result from `uuid()` function is printed out and also injected as the second argument of the `put()` function so that this will be stored within the `myId` context variable,
* An expression may also include `||` fallback marker so that if the result from a first evaluation (left part ofthis marker) is `null`, the right part is then evaluated and sent as the result. For example, you may use `request.body/name || randomFirstName()` to ask reusing the incoming request name if present or generate a new random one.

Pretty easy. No? 🎉

You can check the [Mock Templates reference](/documentation/references/templates) to get a full list of available variables and function expressions.
