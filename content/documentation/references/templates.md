---
draft: false
title: "Mock Templates"
date: 2020-02-11
publishdate: 2020-02-11
lastmod: 2024-12-18
weight: 2
---

## Introduction

This page contains the comprehensive lists of variables and functions that can be used to genete [dynamic mock content](/documentation/explanations/dynamic-content) in Microcks.

There is 3 different kinds of expressions that can be used to generate dynamic content in mocks when included into the `{{ }}` expression marker:
* **Variables Reference Expressions** allow reusing elements from an incoming request, accessed from variables, 
* **Context Expressions** allow reusing elements from the request processing context,
* **Function Expressions** allow generating dynamic data using helper functions.

## Variable Reference Expressions

### Simple, array and map

The `request` object is a simple bean of class `EvaluableRequest` that contains 4 properties of different types. Properties can be simply evaluated using the `.` notation to navigate to their value: 

* `body` is a string property representing request payload,
* `path` is a string array property representing the sequence of path elements in URI,
* `params` is a map of string:string representing the request query parameters,
* `headers` is a map of string:string representing the request headers.

Now let's imagine the following request coming onto a Microcks endpoint for `Hello API` version `1.0`:

```sh
$ curl http://microcks.example.com/rest/Hello+API/1.0/hello/microcks?locale=US -H 'trace: azertyuiop' -d 'rocks'
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

Using Microcks we can just append a [JSON Pointer](https://tools.ietf.org/html/rfc6901) expression to `request.body` element in order to ask for a deeper parsing and evaluation. The JSON Pointer part should be expressed just after a starting `/` indicating we're navigating into a sub-query.

Pointer can reference text value node as well as arrays and objects. The node's contents will be rendered as JSON string if complex objects or arrays are referenced. Please be aware that the whitespacing might differ from the request in this case.

Here's a bunch of examples on previous library case and how they'll be rendered:

| Expression | Evaluation Result | Comment |
| ---------- | ----------------- | ------- |
| `request.body/library` | `My Personal Library` | |
| `request.body/books/1/author` | `John Doe` | JSON Pointer array index starting at 0 | 
| `request.body/books/1` | `{"title":"Title 1","author":"Jane Doe"}`| JSON Pointer to object returning JSON seralized string of contents |
| `request.body/books` | `[{"title":"Title 1","author":"Jane Doe"},{ "title":"Title 2","author":"John Doe"}]` | JSON Pointer to array returning JSON seralized string of contents |

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

### Fallback

When dealing with optional content from incoming request, it can be useful to have some fallback in case of missing content. For that purpose, you can use the `||` notation to express a fallback expression. In the example below, either the incoming request `prefix` is used, or we generate a random one using a function in the case it's null or empty.

```json
{
  "prefix": "{{ request.body/prefix || randomNamePrefix() }}",
  "fullname": "{{ request.body/firstname request.body/lastname }}"
}
```

## Context Expression

Aside the `request` object that is automatically injected, you have access to mock-request wide context. You can inject custom variables into this context using the `SCRIPT` dispatcher through the `requestContext` object (see [this documentation](/documentation/explanations/dispatching/#script-dispatcher)) or by using the `put(myVariable)` function with redirect expression as detailed below.

Variables from context can be simply used in templates using their name within the template mustaches markers like this `{{ myVariable }}`

## Function Expressions

Function expressions allows generation of dynamic content. They are different from varaible reference as they include the `()` notation to provide arguments. Microcks also support the notation compatibility with [Postman Dynamic variables](https://learning.postman.com/docs/writing-scripts/script-references/variables-list/). So that you can reuse your existing response expressed within Postman Collection. The only limitation being that Postman dynamic variables cannot handle arguments passing so functions will always be invoked without arguments.

So basically, a function expression can be materialized with the Microcks notation `function(arg1, arg2)` **OR** the Postman notation `$function`.

### Common functions
#### Put in context

The `put()` function allows to store result into the mock-request wide context using a variable name. Result is acquired from a `>` redirect expression as the previous function invocation result. It has a mandatory argument that is the variable name used for storing into context.

```js
uuid() > put(myId) // 3a721b7f-7dc9-4c45-9777-516942b98e0d WITH this id stored in myId variable.
// Can be reused later in template using {{ myId }}.
```

#### Date generator

The `now()` function allows to generate current date. It can also be invoked using the `timestamp()` alias.

Invoked with no argument, it's a simple milliseconds timestamp since EPOCH beginning. This function can also be invoked with one argument being the pattern to use for rendering current's date as string. The Java [date and time patterns](https://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html) are use as referenced.

It can also be called with a second argument representing an amount of time to add to current date before rendering string representation. It does not support composite ammount for the moment. Think of it as a commodity for generating expiry or validity dates 😉 Here are some examples below:

```js
now() // 1581425292309
now(dd/MM/yyyy HH:mm:ss) // 11/02/2020 13:48:12
now(dd/MM/yyyy, 1M) // 11/03/2020
$now  // 1581425292309
$timestamp  // 1581425292309
```

#### UUID generator

The `uuid()` function allows to simply generate a UUID compliant with RFC 4122 (see https://www.cryptosys.net/pki/uuid-rfc4122.html). It can also be invoked using the `guid()` or `randomUUID()`. 

```js
uuid() // 3F897E85-62CE-4B2C-A957-FCF0CCE649FD
guid() // 3a721b7f-7dc9-4c45-9777-516942b98e0d
$randomUUID // 6929bb52-3ab2-448a-9796-d6480ecad36b
```

#### Random Integer generator

The `randomInt()` function allows to generate a random integer.

When called with no argument, the value span between -65635 and 65635. You can specify an argument to force the generation of a positive integer that is less or equals this argument.

Finally, it can be invoked with a second argument thus defining a range for the integer to be generated. Here's some examples below:

```js
randomInt() // -5239
randomInt(32) // 27
randomInt(25, 50) // 43
```

#### Random String generator

The `randomString()` function simply generates a random alphanumeric string. The default length when called by no argument is 32 charracters. One can specify a integer argument to force string length to desired lentgh. Here's some examples below:

```js
randomString() // kYM8nSjEdLfgKOGG1dfacro2IUmuuan
randomString(64) // VclBAQiNAybe0B5IrXjGqOChQNDFdoTguf5jWn2tqRNfptWSYFy7yxdpxoNIGOpC
```

#### Random Value generator

The `randomValue()` function simply generates a random string among provided values specified as arguments. Here's some examples below:

```js
randomValue(foo, bar) // foo OR bar
randomValue(apple, orange, grape, pear) // apple, orange, grape OR pear
```

#### Random Boolean generator

The `randomBoolean()` function simply generates a random boolean. Here's some examples below:

```js
randomBoolean() // true
$randomBoolean  // false
```

### Names related functions

The names related functions are using the [Datafaker library](https://github.com/datafaker-net/datafaker) to generate fake data from a library of common names and related.

#### First name generator

The `randomFirstName()` function allows to generate random person first name.

```js
randomFirstName() // Samantha
$randomFirstName  // Chandler
```

#### Last name generator

The `randomLastName()` function allows to generate random person last name.

```js
randomLastName() // Schneider
$randomLastName  // Williams
```

#### Full name generator

The `randomFullName()` function allows to generate random person full name.

```js
randomFullName() // Sylvan Fay
$randomFullName  // Jonathon Kunze
```

#### Name prefix generator

The `randomNamePrefix()` function allows to generate random person name prefix.

```js
randomNamePrefix() // Ms.
$randomNamePrefix  // Dr.
```
#### Name suffix generator

The `randomNameSuffix()` function allows to generate random person name prefix.

```js
randomNameSuffix() // MD
$randomNameSuffix  // DDS
```

### Phone, Address and Location related functions

The address related functions are using the [Datafaker library](https://github.com/datafaker-net/datafaker) to generate fake data from a library of common address and related.

#### Phone number generator

The `randomPhoneNumber()` function allows to generate random 10-digit phone numbers.

```js
randomPhoneNumber() // 494-261-3424
$randomPhoneNumber  // 662-302-7817
```

#### City generator

The `randomCity()` function allows to generate random city name.

```js
randomCity() // Paris
$randomCity  // Boston
```

#### Street Name generator

The `randomStreetName()` function allows to generate random street name.

```js
randomStreetName() // General Street
$randomStreetName  // Kendrick Springs
```

#### Street Address generator

The `randomStreetAddress()` function allows to generate random street address.

```js
randomStreetAddress() // 5742 Harvey Streets
$randomStreetAddress  // 47906 Wilmer Orchard
```

#### Country generator

The `randomCountry()` function allows to generate random country name.

```js
randomCountry() // Kazakhstan
$randomCountry  // Austria
```

#### Country code generator

The `randomCountryCode()` function allows to generate random 2-letter country code (ISO 3166-1 alpha-2).

```js
randomCountryCode() // CV
$randomCountryCode  // MD
```

#### Latitude generator

The `randomLatitude()` function allows to generate random latitude coordinate.

```js
randomLatitude() // 27.3644
$randomLatitude  // 55.2099
```

#### Longitude generator

The `randomLongitude()` function allows to generate random longitude coordinate.

```js
randomLongitude() // 40.6609
$randomLongitude  // 171.7139
```

### Domains, Emails and Usernames related functions

The address related functions are using the [Datafaker library](https://github.com/datafaker-net/datafaker) to generate fake data from a library of common domains, emails and related.

#### Email generator

The `randomEmail()` function allows to generate random email address.

```js
randomEmail() // ruthe42@hotmail.com
$randomEmail  // iva.kovacek61@hotmail.com
```
