---
draft: false
title: "Getting dynamic mocks"
date: 2019-09-01
publishdate: 2019-09-01
lastmod: 2019-09-02
menu:
  docs:
    parent: using
    name: Getting dynamic mocks
    weight: 90
toc: true
weight: 30 #rem
---

## Getting dynamic mocks

## Creating dynamic mocks
      
Eventhough Microcks promotes a contract first approach for defining mocks, we are well aware that in real-life it may be difficult starting that way without a great maturity on API and Service contracts. We often meet situations where design and development teams need to play a bit with a fake API to really figure out their needs and how they should then design API contract. In order to help with those situation, Microcks offers the ability to dynamically generate a generic API that you may use as a sandbox.
      
      
In a few clicks, Microcks will easily generate for you a basic API with CRUD operations (CRUD for *Create-Retrieve-Update-Delete*) and associated mocks that you'll be able to use for recording, retrieving and deleting any type of JSON document. In order to use this "Backend As A Service" like feature, just go to the **API | Services** repository and hit the `Add Dynamic API...` button:
      
![dynamic-link](/images/dynamic-link.png)
  
A simple form is now display, asking you to give the following Service Properties:

* `Service Name and Version` will be the unique identifiers of the new dynamic service you want to create,
* `Resource` will the kind of resource (as REST protocol understands *resource*) that will be manage by dynamic service.
  
![dynamic-form](/images/dynamic-form.png")
  
Just hit the `Add` button and you are few seconds away of having a ready-to-use REST Service/API that proposes different operations as shown in capture below. This Service/API is immediately exposing mocks endpoints for the different operations. It Swagger contract is also directly available for download.
  
![dynamic-operations](/images/dynamic-operations.png)
  
Given the previously created dynamic Service, it is now possible to use the `/dynarest/Foo+API/0.1/foo` endpoint (append after your Microcks base URL) to interact with it. This dynamic Service/API is indeed agnostic to a payload you send to it as long as it is formatted as JSON. For example, you can easily record a new `foo` resource having a `name` and a `bar` attributes like this: 

{{< highlight bash >}}
$ curl -X POST http://localhost:8080/dynarest/Foo%20API/0.1/foo -H 'Content-type: application/json' -d '{"name":"andrew", "bar": 223}'
{{< / highlight >}}

```sh
$ curl -X POST http://localhost:8080/dynarest/Foo%20API/0.1/foo -H 'Content-type: application/json' -d '{"name":"andrew", "bar": 223}'
```

And you should receive the following response :
```json
{ "name" : "andrew", "bar" : 223, "id" : "5a1eb52a710ffa9f0b7c6de8" }
```

What has simply done Microcks is recorded your JSON payload and assigned it an `id` attribute.
  
## Checking created resources
  
Creating resource is useful but how to check what are the already existing resources ? Let create another bunch of `foo` resources like this: 

```sh
curl -X POST http://localhost:8080/dynarest/Foo+API/0.1/foo -H 'Content-type: application/json' -d '{"name":"andrew", "bar": 224}'
curl -X POST http://localhost:8080/dynarest/Foo+API/0.1/foo -H 'Content-type: application/json' -d '{"name":"marina", "bar": 225}'
curl -X POST http://localhost:8080/dynarest/Foo+API/0.1/foo -H 'Content-type: application/json' -d '{"name":"marina", "bar": 226}'
```
    
Now, just hitting the `Resources` button just next to `Operations` section, you should be able to check all the resources Microcks has recorded as being viable representations of the `foo` resource. Each of them has received a unique identifier:
      
![dynamic-resources](/images/dynamic-resources.png)
      
Using dynamic Service/API in Microcks is thus a simple and super-fast mean of recording sample resources to illustrate what should be the future contract design!
      
    
## Querying dynamic mock resources
      
Beyond the simple checking of created resources, those resources are also directly available through the endpoints corresponding to retrieval operations. As every resource recorded is identified using an `id` attribute, it s really easy to invoke the GET endpoint using this id like this: 

```sh
curl -X GET http://localhost:8080/dynarest/Foo+API/0.1/foo/5a1eb52a710ffa9f0b7c6de8
```

This give you the JSON payload you have previously recorded!

```json
{ "name" : "andrew", "bar" : 223, "id" : "5a1eb52a710ffa9f0b7c6de8" }`
```

More sophisticated retrieval options are also available when using the listing endpoint of dynamic Service. Microcks follows the conventions of querying by example: you can specify a JSON document as data and it will be used as a prototype for retrieving recorded resources having the same attributes and same attribute values. For example, to get all the `foo` resources having a name of *marina* just issue this query:

```sh
curl -X GET http://localhost:8080/dynarest/Foo+API/0.1/foo -H 'Content-type: application/json' -d '{"name": "marina"}}'
```

That will give you the following results:

```json
[{ "name" : "marina", "bar" : 225, "id" : "5a1eb608710ffa9f0b7c6deb" }, { "name" : "marina", "bar" : 226, "id" : "5a1eb613710ffa9f0b7c6dec" }]
```
      
Microcks is also able to understand the operators you'll find into [MongoDB Query DSL](https://docs.mongodb.com/manual/tutorial/query-documents/) syntax. Thus you're able for example to filter results using a range for an integer value like this:

```sh
curl -X GET http://localhost:8080/dynarest/Foo+API/0.1/foo -H 'Content-type: application/json' -d '{"bar": {$gt: 223, $lt: 226} }}'
```

With results:

```json
[{ "name" : "andrew", "bar" : 224, "id" : "5a1eb5fd710ffa9f0b7c6dea" }, { "name" : "marina", "bar" : 225, "id" : "5a1eb608710ffa9f0b7c6deb" }]
```

You can also mix-and-match attribute values and DSL operators so that you may build more complex filters likte this one restricted the previous set of `foo` to those having only the name of *marina*:

```sh
curl -X GET http://localhost:8080/dynarest/Foo+API/0.1/foo -H 'Content-type: application/json' -d '{"name": "marina", "bar": {$gt: 223, $lt: 226} }}'
```

With results:

```json
[{ "name" : "marina", "bar" : 225, "id" : "5a1eb608710ffa9f0b7c6deb" }]
```
