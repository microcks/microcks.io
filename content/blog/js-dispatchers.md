---
title: JavaScript dispatchers
date: 2025-09-29
image: "images/blog/js-dispatchers-banner.svg"
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
2. Go to **Microcks Hub** -> **MicrocksIO Samples APIs** -> **Pastry API - 2.0**
3. Hit **Install** -> **+ Direct Import**
4. In the left panel, open **APIs | Services**
5. Pick **API Pastry - 2.0** -> select the second endpoint `⋮` (three dots) -> **Edit Properties**
6. Scroll down and set **Dispatcher** to `JS` ✅

## Introducing JavaScript dispatchers

Now comes the fun part. In your API definition, you can attach a **JavaScript dispatcher script**.
This script inspects incoming requests and decides which example response to serve.

### Example: dispatch by path parameter and Accept header

We’ll attach a script that looks at the `name` path parameter and the `Accept` header to choose the appropriate example. For `Eclair Cafe`, we’ll return a JSON or XML variant depending on the requested content type; for anything else, we’ll default to `Millefeuille`.

```js
const contentType = mockRequest.getRequestHeader("Accept").toString();
const nameParam = mockRequest.getURIParameter("name");

if (nameParam === "Eclair Cafe") {
  if (contentType === "text/xml") {
    return "Eclair Cafe Xml";
  } else {
    return "Eclair Cafe";
  }
}

return "Millefeuille";
```

Try the following requests against `API Pastry - 2.0`:

```bash
curl -X GET 'http://localhost:8080/rest/API+Pastry+-+2.0/2.0.0/pastry/Eclair+Cafe' -H 'Accept: application/json'
```

Returns:

```json
{
  "name": "Eclair Cafe",
  "description": "Delicieux Eclair au Cafe pas calorique du tout",
  "size": "M",
  "price": 2.5,
  "status": "available"
}
```

Requesting XML:

```bash
curl -X GET 'http://localhost:8080/rest/API+Pastry+-+2.0/2.0.0/pastry/Eclair+Cafe' -H 'Accept: text/xml'
```

Returns:

```xml
<pastry>
    <name>Eclair Cafe</name>
    <description>Delicieux Eclair au Cafe pas calorique du tout</description>
    <size>M</size>
    <price>2.5</price>
    <status>available</status>
</pastry>
```

And the default variant when requesting another pastry name:

```bash
curl -X GET 'http://localhost:8080/rest/API+Pastry+-+2.0/2.0.0/pastry/Millefeuille' -H 'Accept: application/json'
```

Returns:

```json
{
  "name": "Millefeuille",
  "description": "Delicieux Millefeuille pas calorique du tout",
  "size": "L",
  "price": 4.4,
  "status": "available"
}
```

### Tweaking the script is easy (with server-side logging)

One of the benefits of JavaScript dispatchers is how quickly you can iterate: update the snippet, save, and re-run the same requests. You can also add server-side logs with the built-in `log.info` to trace what’s happening:

```js
const accept = mockRequest.getRequestHeader("Accept").toString();
const name = mockRequest.getURIParameter("name");
log.info(`Dispatching for name=${name}, accept=${accept}`);

if (name === "Eclair Cafe" && accept === "text/xml") {
  log.info("Returning XML example for Eclair Cafe");
  return "Eclair Cafe Xml";
}

return "Millefeuille";
```

Check your Microcks container/server logs to see these messages and understand which path the script took.

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
