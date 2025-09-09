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

We will use the `API Pastry - 2.0` sample from the Getting Started tutorial. It contains multiple examples for the `GET /pastry/{name}` operation, including JSON and XML variants. We’ll set a custom dispatcher to route based on the `Accept` header.

### 2.1 Load the sample API

Follow the [Getting started](/documentation/tutorials/getting-started) tutorial to load the `API Pastry - 2.0` sample into your Microcks instance.

### 2.2 Set a custom dispatcher via the UI

1. Open the `API Pastry - 2.0` service page.
2. Locate the `GET /pastry/{name}` operation. Open the 3-dots menu on the right and choose **Edit Properties**.
3. In the dispatching section:
   - Set **Dispatcher** to `QUERY_HEADER`.
   - Set **Dispatching rules** to `Accept`.
4. Save.

This tells Microcks to select the response example whose request `Accept` header matches the incoming request header value.

### 2.3 Verify with curl

Call the mock endpoint and switch the `Accept` header to observe the selected example change:

```sh
curl -X GET 'http://localhost:8585/rest/API+Pastry+-+2.0/2.0.0/pastry/Eclair%20Chocolat' -H 'Accept: application/json'
```

```sh
curl -X GET 'http://localhost:8585/rest/API+Pastry+-+2.0/2.0.0/pastry/Eclair%20Chocolat' -H 'Accept: text/xml'
```

With `QUERY_HEADER: Accept`, Microcks will choose the example that was defined with the corresponding `Accept` value in its request.

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
        dispatcher: QUERY_HEADER
        dispatcherRules: Accept
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
    dispatcher: QUERY_HEADER
    dispatcherRules: Accept
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
        "dispatcher": "QUERY_HEADER",
        "dispatcherRules": "Accept"
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
