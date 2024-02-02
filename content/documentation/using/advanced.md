---
draft: false
title: "Advanced topics"
date: 2019-12-12
publishdate: 2019-12-13
lastmod: 2019-12-13
weight: 15
---

## Content negocation in REST mocks

Microcks mocks engine supports [Content Negotiation](https://restfulapi.net/content-negotiation/) for REST APIs based on `Accept` HTTP header.

So suppose you have defined 2 representations for the same example of a `GET /pastry/{name}` operation into your API contract:

* One describing a JSON response like below

{{< image src="images/content-negociation-json.png" alt="image" zoomable="true" >}}

* Another describing a XML response like below

{{< image src="images/content-negociation-xml.png" alt="image" zoomable="true" >}}

Both samples match the same dispatch criterion that is the `name` part of the URI. However, Microcks will return different responses depending on the `Accept` header of your request:

```sh
$ curl http://localhost:8080/rest/API+Pastry+-+2.0/2.0.0/pastry/Eclair+Cafe
{"name":"Eclair Cafe","description":"Delicieux Eclair au Cafe pas calorique du tout","size":"M","price":2.5,"status":"available"}
```

or 

```xml
$ curl http://localhost:8080/rest/API+Pastry+-+2.0/2.0.0/pastry/Eclair+Cafe -H 'Accept: text/xml'
<pastry>
    <name>Eclair Cafe</name>
    <description>Delicieux Eclair au Cafe pas calorique du tout</description>
    <size>M</size>
    <price>2.5</price>
    <status>available</status>
</pastry>
```

## Operation parameters constraints

Sometimes it may be important to specify additional constraints onto a Mock operation. Constraints that are related to API behaviour or semantic may be hard even impossible to express with an API contract. Microcks allows you to specify such constraints by editing the properties of a Service or API operation.

Constraints can be put onto `Query` or `Header` parameters and are of 3 types:

* `required` constraints force the presence of parameter in incoming request,
* `recopy` constraints just send back the same parameter name and value into mock response,
* `match` constraints check the value of a parameter against a specified regular expression.

Now imagine you put such constraints onto the `GET /pastry` operation of your REST API that is secured using a JWT Bearer and should managed tracabelity using a correlation id:

{{< image src="images/parameters-constraints.png" alt="image" zoomable="true" >}}

Now let's do some tests to check Microcks behavior:

```sh
$ http http://localhost:8080/rest/API+Pastry/1.0.0/pastry
HTTP/1.1 400 
Connection: close
Content-Length: 65
Content-Type: text/plain;charset=UTF-8
Date: Fri, 13 Dec 2019 19:20:31 GMT
X-Application-Context: application

Parameter Authorization is required. Check parameter constraints.
```

Hum... Adding the `Authorization` header...

```sh
$ http http://localhost:8080/rest/API+Pastry/1.0.0/pastry Authorization:'Bearer 123'
HTTP/1.1 400 
Connection: close
Content-Length: 89
Content-Type: text/plain;charset=UTF-8
Date: Fri, 13 Dec 2019 19:31:01 GMT
X-Application-Context: application

Parameter Authorization should match ^Bearer\s[a-f0-9]{36}$. Check parameter constraints.
```

Hum... Fixing the `Bearer` format and adding the `x-request-id` header:

```sh
$ http http://localhost:8080/rest/API+Pastry/1.0.0/pastry Authorization:'Bearer abcdefabcdefabcdefabcdefab1234567890' x-request-id:123
HTTP/1.1 200 
Content-Length: 559
Content-Type: application/json
Date: Fri, 13 Dec 2019 19:33:52 GMT
X-Application-Context: application
x-request-id: 123

[
    {
        "description": "Delicieux Baba au Rhum pas calorique du tout",
        "name": "Baba Rhum",
        "price": 3.2,
        "size": "L",
        "status": "available"
    },
    {
        "description": "Delicieux Divorces pas calorique du tout",
        "name": "Divorces",
        "price": 2.8,
        "size": "M",
        "status": "available"
    },
    {
        "description": "Delicieuse Tartelette aux Fraises fraiches",
        "name": "Tartelette Fraise",
        "price": 2,
        "size": "S",
        "status": "available"
    }
]
```

> Operation parameter constraints are saved into Microcks database and not replaced by a new import of your Service or API definition. They can be independently set and updated using the [Microcks APIs](../automating/api/).

## Override default headers during tests

Coming soon...