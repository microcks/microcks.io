---
draft: false
title: "Setting custom dispatcher"
date: 2024-04-30
publishdate: 2024-04-30
lastmod: 2025-11-09
weight: 2
---

## Overview

Custom dispatchers let you control how Microcks selects the response example to return for a given request. Instead of relying only on inferred rules, you can explicitly tell Microcks which request elements to inspect (headers, URL parts, query params, body, scripts, proxies, etc.) and how to route to a named example.

This guide shows how to set a custom dispatcher on an operation, verify the effect via the UI and with curl, and then how to achieve the same using OpenAPI extensions, API Metadata, or the Microcks API.

When to use this guide:

- When the default, inferred rules do not match your needs.
- When you want predictable routing based on headers, payload, or a fallback.
- When you need to keep custom dispatch logic together with the API definition or manage it externally.

## 1. Concepts

- **Dispatcher**: The strategy that defines which request elements are examined (for example: `QUERY_HEADER`, `URI_PARTS`, `JSON_BODY`, `SCRIPT`, `FALLBACK`, `PROXY`, `PROXY_FALLBACK`).
- **Dispatching rules**: The expression or configuration associated with a dispatcher. For example, for `QUERY_HEADER`, it’s the list of header names to consider; for `JSON_BODY`, it’s a JSON Pointer-based expression with cases; for `SCRIPT`, it’s a Groovy or JavaScript script returning a response name.
- **Scope**: Dispatchers are configured at the operation level (for example, `GET /pastry/{name}`). They are persisted in Microcks and survive future refreshes/imports unless overwritten by extensions or metadata.

For a broader tour and advanced strategies, see [Dispatcher & dispatching rules](/documentation/explanations/dispatching).

## 2. Practice

We will use the `API Pastry - 2.0` sample from the Getting Started tutorial. It contains multiple examples for the `GET /pastry/{name}` operation. We’ll set a custom dispatcher to demonstrate a default response using `FALLBACK` when the requested pastry doesn’t exist (something distinct from default content negotiation, which Microcks already handles automatically).

### 2.1 Load the sample API

To load the `API Pastry-2.0` sample into your Microcks instance, follow the [Getting started](/documentation/tutorials/getting-started) tutorial.

### 2.2 Set a custom dispatcher via the UI

1. Open the `API Pastry - 2.0` service page.
2. Locate the `GET /pastry/{name}` operation. Open the 3-dots menu on the right and choose **Edit Properties**.
3. In the dispatching section:
   - Set **Dispatcher** to `FALLBACK`.
   - Set **Dispatching rules** to the following JSON:

```json
{
  "dispatcher": "URI_PARTS",
  "dispatcherRules": "name",
  "fallback": "Millefeuille"
}
```
4. Save.

This tries to match a response by the `name` path parameter first (using `URI_PARTS`). If no example matches (unknown pastry), Microcks returns the `Millefeuille` example as a default.

<div class="swiper single-slider">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      {{< image src="images/documentation/custom-dispatcher-api-pastry.png" alt="image" zoomable="true" >}}      
    </div>
    <div class="swiper-slide">
      {{< image src="images/documentation/custom-dispatcher-pastry.png" alt="image" zoomable="true" >}}
    </div>
    <div class="swiper-slide">
      {{< image src="images/documentation/custom-dispatcher.png" alt="image" zoomable="true" >}}
    </div>
  </div>
  <div class="swiper-pagination"></div>
</div>

Note: You do not need `QUERY_HEADER` to implement content negotiation on `Accept` — Microcks already returns the appropriate representation if multiple media types exist for the same example.

### 2.3 Verify with curl

Call the mock endpoint with an existing pastry name, then with an unknown one to observe the fallback:

```sh
curl -X GET 'http://localhost:8585/rest/API+Pastry+-+2.0/2.0.0/pastry/Eclair%20Cafe'
```

```sh
curl -X GET 'http://localhost:8585/rest/API+Pastry+-+2.0/2.0.0/pastry/Unknown%20Pastry'
```

The second call returns the `Millefeuille` example thanks to the `FALLBACK` configuration.

> Tip: You can pick other strategies depending on your needs:
> - `JSON_BODY` to route based on a value in the request payload.
> - `FALLBACK` to always return a default response if no match is found.
> - `SCRIPT` for full flexibility with Groovy or JavaScript.

## 3. Other ways of proceeding

UI editing is convenient, but you may prefer a declarative approach that travels with the API or is managed externally.

### 3.1 Using OpenAPI extensions

Add an `x-microcks-operation` block at the operation level in your OpenAPI file, then re-import:

```yaml
paths:
  /pastry/{name}:
    get:
      x-microcks-operation:
        dispatcher: FALLBACK
        dispatcherRules: |
          {
            "dispatcher": "URI_PARTS",
            "dispatcherRules": "name",
            "fallback": "Millefeuille"
          }
```

On the next import, this will overwrite any UI-edited dispatcher configuration for that operation. See [OpenAPI extensions](/documentation/references/artifacts/openapi-conventions/#openapi-extensions).

### 3.2 Using API Metadata

Keep dispatch config outside of the API definition using an `APIMetadata` artifact:

```yaml
apiVersion: mocks.microcks.io/v1alpha1
kind: APIMetadata
metadata:
  name: API Pastry - 2.0
  version: '2.0.0'
operations:
  'GET /pastry/{name}':
    dispatcher: FALLBACK
    dispatcherRules: |-
      {
        "dispatcher": "URI_PARTS",
        "dispatcherRules": "name",
        "fallback": "Millefeuille"
      }
```

Import this as a secondary artifact (via Importers or Upload). It will set or overwrite the dispatcher for the target operation. See [API Metadata Format](/documentation/references/metadada/#api-metadata-properties).

### 3.3 Using the Microcks API

You can also update an operation programmatically. After obtaining a token (see [Connecting to Microcks API](/documentation/guides/automation/api)), call the OpenAPI endpoint to update an operation:

```sh
curl -X PUT 'https://microcks.example.com/api/services/{serviceId}/operation' \
  -H 'Authorization: Bearer $TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
        "name": "GET /pastry/{name}",
        "dispatcher": "FALLBACK",
        "dispatcherRules": "{\n  \"dispatcher\": \"URI_PARTS\",\n  \"dispatcherRules\": \"name\",\n  \"fallback\": \"Millefeuille\"\n}"
      }'
```

Refer to the [Open API reference](/documentation/references/apis/open-api/) for the full payload structure and how to retrieve the `serviceId`.

## Wrap-up

- You set a custom dispatcher at the operation level and verified it using curl.
- You saw how to declare the same behavior using OpenAPI extensions or API Metadata, and how to automate it via the Microcks API.

Next steps and related topics:

- **Learn more about strategies**: [Dispatcher & dispatching rules](/documentation/explanations/dispatching)
- **Keep it in your artifact**: [OpenAPI extensions](/documentation/references/artifacts/openapi-conventions/#openapi-extensions)
- **Manage separately**: [API Metadata](/documentation/references/metadada)
- **See similar guides**: [Importing Services & APIs](/documentation/guides/usage/importing-content) · [Defining delays for mocks](/documentation/guides/usage/delays)
