---
draft: false
title: "Templating mock responses"
date: 2020-02-11
publishdate: 2020-02-11
lastmod: 2020-02-11
menu:
  docs:
    parent: using
    name: Templating mock responses
    weight: 120
toc: true
weight: 30 #rem
---

## Introduction

Whilst we deeply think that "real-world" static values for request/response samples are crucial in order to fully understand the business usages and expectations of an API, we have to admit that it is more than often useful to introduce some kind of dynamically generated content for response. 

Those use-case encompass:

* random numbers that may be defined in a range,
* today's date or today's + an amount of time (for validity date for example),
* response part expressed from request part (body part, header, query param)

Thus, we introduce in Microcks 0.9.0 version (use the `nightly` tag until it's released) some templating features allowing to specify dynamic parts in response content.

### Tell me more!

Let's introduc this new feature with an example: a simple `Hello API` that takes a JSON payload as request payload and that return a `Greeting` response including: the id of message, the date of message generation and the message content itself that is just saying `Hello !`.

You can find the OpenAPI v3 contract of this API [here](https://github.com/microcks/microcks/blob/0.9.0/src/test/resources/io/github/microcks/util/openapi/hello-dynamic-openapi.yaml) and here's below the result once imported into Microcks.

![template-intro](/images/template-intro.png)

You'll notice that response payload is expressed using some templating mustaches (`{{` and `}}`) that indicates here that Microcks should recognized the delimited expression and replace it with new values.

When invoked twice with different params at different dates, here are the results:

```sh
$ curl -XGET http://microcks.example.com/rest/Hello+Dynamic+API/1.0.0/hello -H 'Content-type: application/json' -d '{"name": "World"}' -s | jq .
{
  "id": "pQnDIytzeYJFLxaQg56yObw0WTpYNBMjPYu7FLBoNSGF6ZJsTcHov5ZmaiWG8Gt8",
  "date": "10/02/2020",
  "message": "Hello World!"
}

# Wait for a day...
$ curl -XGET http://microcks.example.com/rest/Hello+Dynamic+API/1.0.0/hello -H 'Content-type: application/json' -d '{"name": "Laurent"}' -s | jq .
{
  "id": "Hn9lUKkzYsvQq98wDEHa7Ln3H4eVfnfpJLLPPe4ns9vBgaTRvblOOBHIVq3BluEC",
  "date": "11/02/2020",
  "message": "Hello Laurent!"
}
```

Here we are: 1 sample definition but dynamic content generated on purpose!

### Few concepts

Let explain the few concepts behind Microcks templating features. These are really simple and straightforward: 

* An expression should be delimited by mustaches like this: `{{ expression }}`. This pattern can be included in any textual representation of your response body content: plain text, JSON, XML, whatever... Microcks will just replace this pattern by its evaluated content or `null` if evaluation fail for any reason,
* An expression can be a reference to a context variable. In this case, we use a `.` notation to tell which property of this variable we refer to. At time of writing, all contextual informations are attache to variable named `request` so we may use expression like `request.body` for example,
* An expression can also be a function evaluation. In this case, we use a `()` notation to indicate the function name and its arguments. For example we use `randomString(64)` to evaluate the random string generation function with one arg being `64` (the length of the desired string).

Pretty easy. No? The rest of this page presents the reference of available variable and function expressions.


## Variable Reference Expressions

### Simple, array and map

The `request` object is a simple bean of class `EvaluableRequest` that contains 4 properties of different types. Properties can be simply evaluated using the `.` notation to navigate to their value: 

* `body` is a string property representing request payload,
* `path` is a string array property representing the sequence of path elements in URI,
* `params` is a map of string:string representing the request query parameters,
* `headers` is a map of string:string representing the request headers.

Now let's imagine the following request coming onto a Microcks endpoint for `Hello API` version `1.0`:

```sh
$ curl -XGET http://microcks.example.com/rest/Hello+API/1.0/hello/microcksd?locale=US -H 'trace: azertyuiop' -d 'rocks'
```

Here's how the different expressions will be evaluated:

| Expression | Evaluation Result |
| ---------- | ----------------- |
| `request.body` | `rocks` |
| `request.path[1]` | `microcks` |
| `request.params[locale]` | `US`|
| `request.headers[trace]` | `azertyuiop`|


### JSON body Pointer expression

In the case where request payload body can be interpreted as JSON, Microcks has also the capability of defining template expressions that will analyse this structured content and pick some elements for rendering.

Imagine our API deal with library and may receive this kind of request body payload:

```json
{
  "library": "My Personal Library",
  "books": [
    { "title":"Title 1", "author":"Jane Doe" },
    { "title":"Title 2", "author":"John Doe" }
  ]
}
```

Using Microcks we can just append a [JSON Pointer](https://tools.ietf.org/html/rfc6901) expression to `request.body` element in order to ask for a deeper parsing and evaluation. The JSON Pointer part should be expressed just after a starting `/` indicating we're navigating into a sub-query. Here's a bunch of examples on previous library case and how they'll be rendered:

| Expression | Evaluation Result | Comment |
| ---------- | ----------------- | ------- |
| `request.body/library` | `My Personal Library` | |
| `request.body/library/books/1/author` | `John Doe` | JSON Pointer array index starting at 0 | 


### XML body XPath expression

In the case where request payload body can be interpreted as XML, Microcks has also the capability of defining template expressions too!

Imagine our API deal with library and may receive this kind of request body payload:

```xml
<library>
  <name>My Personal Library</name>
  <books>
    <book><title>Title 1</title><author>Jane Doe</author></book>
    <book><title>Title 2</title><author>John Doe</author></book>
  </books>
</library>
```

Analogous to JSON payload, we can just append a [XPath](https://www.w3.org/TR/xpath/all/) expression to `request.body` element to ask for deeper parsing and evaluation. Here's a bunch of examples on previous library case and how they'll be rendered:

| Expression | Evaluation Result | Comment |
| ---------- | ----------------- | ------- |
| `request.body/library/name` | `My Personal Library` | |
| `request.body//name` | `My Personal Library` | Use wilcard form. `//` means "any path" |
| `request.body/library/books/book[1]/author` | `Jane Doe` | Take care of XPath array index starting at 1 ;-) |

In the case you're dealing with namespaced XML or SOAP request, Microcks does not support namespaced for now but the relaxed `local-name()` XPath expression allowed you to workaround this limitation. If we get a namespaced version of our XML payload:

```xml
<ns:library xmlns:ns="https://microcks.io">
  <ns:name>My Personal Library</ns:name>
  <ns:books>
    <ns:book><ns:title>Title 1</ns:title><ns:author>Jane Doe</ns:author></ns:book>
    <ns:book><ns:title>Title 2</ns:title><ns:author>John Doe</ns:author></ns:book>
  </ns:books>
</ns:library>
```

We can adapt the XPath expression to ignore namespaces prefix:

| Expression | Evaluation Result | Comment |
| ---------- | ----------------- | ------- |
| `request.body//*[local-name() = 'name']` | `My Personal Library` | Ignore namespaces and use local tag names |

## Function Expressions

### Date generator

The `now()` function allows to generate current date.

Invoked with no argument, it's a simple mong timestamp since EPOCH beginning. This function can also be invoked with one argument being the pattern to use for rendering current's date as string. The Java [date and time patterns](https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html) are use as referenced.

It can also be called with a second argument representing an amount of time to add to current date before rendering string representation. It does not support composite ammount for the moment. Think of it as a commodity for generating expiry or validity dates ;-) Here's some examples below:

```js
now() // 1581425292309
now(dd/MM/yyyy HH:mm:ss) // 11/02/2020 13:48:12
now(dd/MM/yyyy, 1M) // 11/03/2020
```

### Random Integer generator

The `randomInt()` function allows to generate a random integer.

When called with no argument, the value span between -65635 and 65635. You can specify an argument to force the generation of a positive integer that is less or equals this argument.

Finally, it can be invoked with a second argument thus defining a range for the integer to be generated. Here's some examples below:

```js
randomInt() // -5239
randomInt(32) // 27
randomInt(25, 50) // 43
```

### Random String generator

The `randomString()` function simply generates a random alphanumeric string. The default lentgh when called by no argument is 32 charracters. One can specify a integer argument to force string length to desired lentgh. Here's some examples below:

```js
randomString() // kYM8nSjEdLfgKOGG1dfacro2IUmuuan
randomString(64) // VclBAQiNAybe0B5IrXjGqOChQNDFdoTguf5jWn2tqRNfptWSYFy7yxdpxoNIGOpC
```