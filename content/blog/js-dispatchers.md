---
title: JavaScript dispatchers
date: 2025-09-29
image: "images/blog/javascript-microcks-todo.png"
author: "Andrea Peruffo"
type: "regular"
description: "Announcing JavaScript dispatcher in Microcks 1.13"
draft: true
---

# Dynamic Mocking with JavaScript Dispatchers in Microcks

One of the most exciting new features introduced in **Microcks 1.13** is the ability to write **JavaScript dispatchers**.
This gives you fine-grained control over how mock responses are selected and tailored—based not only on static examples but also on request headers, payloads, and parameters.

This is a powerful step forward: instead of static mocks, you can now create dynamic, context-aware simulations that behave much closer to real services.

> ℹ️ **Note:** Microcks already supported **Groovy-based dispatchers** in earlier releases. JavaScript is now offered as an alternative, making it easier for teams who prefer JS or want to align dispatcher logic with front-end or Node.js skills.

---

## Setting up Microcks locally

To get started quickly, you’ll need **Docker Compose**.
This sample command will give you a demo working environment in a one-liner:

```bash
echo 'services:
  mongo:
    image: mongo:4.4.29
  app:
    depends_on:
      - mongo
    image: docker.io/andreatp/microcks-1.13:PREVIEW
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATA_MONGODB_URI=mongodb://mongo:27017
      - SPRING_DATA_MONGODB_DATABASE=microcks
      - KEYCLOAK_ENABLED=false' | docker compose -f - up
```

Once Microcks is up, try this quick path:

1. Open [http://localhost:8080](http://localhost:8080) in your browser  
2. Go to **Microcks Hub** -> **MicrocksIO Samples APIs** -> **Hello REST API SoapUI**  
3. Hit **Install** -> **+ Direct Import**  
4. In the left panel, open **APIs | Services**  
5. Pick **Hello API Mock** -> `⋮` (three dots) -> **Edit Properties**  
6. Scroll down and set **Dispatcher** to `JS` ✅

## Introducing JavaScript dispatchers

Now comes the fun part. In your API definition, you can attach a **JavaScript dispatcher script**.
This script inspects incoming requests and decides which example response to serve.

### Example 1: selecting by header

Let’s try it out with the first dispatcher script from the docs.

```js
const testCase = mockRequest.getRequestHeader("testcase")[0];
log.info("testCase: " + testCase);
if (testCase !== undefined) {
   switch(testCase) {
      case "1":
         return "amount negativo";
      case "2":
         return "amount nullo";
      case "3":
         return "amount positivo";
      case "4":
         return "amount standard";
   }
}
return "amount standard";
```

and exercise the endpoint by adding the header:

```bash
curl -X GET 'http://localhost:8080/rest/Hello+API+Mock/0.8/v1/hello?David' -H "testcase: 3"
```

<!-- TODO: the current example returns a meaningful error, better if we just resutrn a result? -->

### Example 2: dispatching based on request body

JavaScript dispatchers can also inspect the **payload**.

Change the JavaScript script with this content:

```js
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

Now, you can post a JSON body containing a `cars` field:

```bash
curl -X GET "http://localhost:8080/rest/Hello+API+Mock/0.8/v1/hello?David" \
  -H "Content-Type: application/json" \
  --data '{"cars": { "Peugeot": true }}'
```

The script can check whether `"Peugeot": true` exists in the request and pick a matching response accordingly.
You can verify in the server logs what happened.

---

## Why it matters

With JavaScript dispatchers, Microcks becomes much more flexible:

* **Dynamic behavior** – responses vary depending on request context
* **Richer test scenarios** – simulate more realistic API flows
* **Fewer examples needed** – reuse existing payloads with smart logic

This makes it easier to mock APIs for contract testing, early integration, or even demos where you want your mock to “feel alive”.

---

## Next steps

We’ve only scratched the surface here. In the full documentation you’ll find:

* How to write and attach dispatcher scripts
* The full request/response object model available in scripts
* Examples covering REST, gRPC, and event-based APIs

👉 [Check the official documentation](https://microcks.io/documentation/) for more details and start experimenting with your own mocks.
