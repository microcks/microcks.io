---
draft: false
title: "Dynamic mock content"
date: 2020-02-11
publishdate: 2020-02-11
lastmod: 2024-06-13
weight: 8
---

## Introduction

Whilst we deeply think that "real-world" static values for request/response samples are crucial in order to fully understand the business usages and expectations of an API, we have to admit that it is more than often useful to introduce some kind of dynamically generated content for response. 

Those use-case encompass:

* random numbers that may be defined in a range,
* today's date or today's + an amount of time (for validity date for example),
* response part expressed from request part (body part, header, query param)

Thus, Microcks has some templating features allowing to specify dynamic parts in response content.

Let's introduce this new feature with an example: a simple `Hello API` that takes a JSON payload as request payload and that return a `Greeting` response including: the id of message, the date of message generation and the message content itself that is just saying `Hello !`.

You can find the OpenAPI v3 contract of this API [here](https://github.com/microcks/microcks/blob/master/webapp/src/test/resources/io/github/microcks/util/openapi/hello-dynamic-openapi.yaml) and here's below the result once imported into Microcks:

{{< image src="images/documentation/template-intro.png" alt="image" zoomable="true" >}}

You'll notice that response payload is expressed using some templating mustaches (`{{` and `}}`) that indicates here that Microcks should recognize the delimited expression and replace it with new values.

When invoked twice with different params at different dates, here are the results:

```sh
$ curl -XGET http://microcks.example.com/rest/Hello+Dynamic+API/1.0.0/hello -H 'Content-type: application/json' \
    -d '{"name": "World"}' -s | jq .
{
  "id": "pQnDIytzeYJFLxaQg56yObw0WTpYNBMjPYu7FLBoNSGF6ZJsTcHov5ZmaiWG8Gt8",
  "date": "10/02/2020",
  "message": "Hello World!"
}

# Wait for a day...
$ curl -XGET http://microcks.example.com/rest/Hello+Dynamic+API/1.0.0/hello -H 'Content-type: application/json' \
    -d '{"name": "Laurent"}' -s | jq .
{
  "id": "Hn9lUKkzYsvQq98wDEHa7Ln3H4eVfnfpJLLPPe4ns9vBgaTRvblOOBHIVq3BluEC",
  "date": "11/02/2020",
  "message": "Hello Laurent!"
}
```

Here we are: 1 sample definition but dynamic content generated on purpose!

## Few concepts

Let explain the few concepts behind Microcks templating features. These are really simple and straightforward: 

* An expression should be delimited by mustaches like this: `{{ expression }}`. This pattern can be included in any textual representation of your response body content: plain text, JSON, XML, whatever... Microcks will just replace this pattern by its evaluated content or `null` if evaluation fail for any reason,
* An expression can be a reference to a context variable. In this case, we use a `.` notation to tell which property of this variable we refer to. Built-in contextual informations are attached to variable named `request` so we may use expression like `request.body` for example,
* An expression can also be a function evaluation. In this case, we use a `()` notation to indicate the function name and its arguments. For example we use `randomString(64)` to evaluate the random string generation function with one arg being `64` (the length of the desired string),
* An expression may also include `>` redirect character so that result from a first evaluation is injected as an extra argument on the next function. For example, you may use `uuid() > put(myId)`. So that result from `uuid()` function is printed out and also injected as second argument of the `put()` function so that this is will be stored within the `myId` context variable,

Pretty easy. No? 🎉

You can check the [Mock Templates reference](/documentation/references/templates) to get full list of available variable and function expressions.