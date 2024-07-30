---
draft: false
title: "Applying constraints to mocks"
date: 2024-06-18
publishdate: 2024-06-18
lastmod: 2024-06-18
weight: 3
---

## Overview

Sometimes it may be required to specify additional constraints onto a mock operation. Constraints that are related to API behaviour or semantic may be hard even impossible to express with an API contract. Microcks allows you to specify such constraints by editing the properties of a Service or API operation.

This guide will introduce you the concepts of Microcks **parameters constraints** that allows you to customize the behavior and the validation of your mocks. You'll kearn through a simple example how to place constraints onto a REST API operation.

## 1. Concepts

In Microcks, constraints can be put onto `Query` or `Header` parameters and are of 3 types:

* `required` constraints force the presence of parameter in incoming request,
* `recopy` constraints just send back the same parameter name and value into mock response,
* `match` constraints check the value of a parameter against a specified regular expression.

## 2. Practice

To practice the setup of constraints, you can reuse the `Pastry API` sample that ois described into our [Getting Started](/documentatoin/tutorials/getting-started) tutorial. Now imagine you put such constraints onto the `GET /pastry` operation of your REST API that is secured using a JWT Bearer and should managed tracabelity using a correlation id:

{{< image src="images/documentation/parameters-constraints.png" alt="image" zoomable="true" >}}

Now let's do some tests to check Microcks behavior:

```sh
$ http http://localhost:8080/rest/API+Pastry/1.0.0/pastry
--- OUTPUT ---
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
--- OUTPUT ---
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
--- OUTPUT ---
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

Yeah! That's it 🎉
You sucessfully conifgured parmaeters contraints on the `GET /pastry` operation!

## Wrap-up

Constraints are an easy to use and powerful for specifying additonal behavior or validation rules for your mocks. Defining constraints place your consumers in a better position for a seamless transition to real-life implementation of your API once it is ready.

It's worth noting that Operation parameter constraints are saved into Microcks database and not replaced by a new import of your Service or API definition. They can be independently set and updated using the [Microcks REST API](/documentation/guides/automation/api).

