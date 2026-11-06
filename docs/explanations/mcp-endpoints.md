---
sidebar_custom_props:
  tags: [AI, MCP]
title: MCP endpoints support
sidebar_position: 7
last_update:
  date: '2025-05-27'
description: "Expose OpenAPI, GraphQL and gRPC mocks as MCP tools for LLMs and AI agents."
---

## Introduction

You know that API and AI are closely related and that LLMs and AI agents will be among the top consumers of your APIs tomorrow and even today. It becomes crucial to be able to check how AI Agents will reuse your API as tools!

Starting with version `1.12.0`, Microcks automatically translates your API mocks into [Model Context Protocol](https://modelcontextprotocol.io/) (or MCP) aware endpoints! A new **MCP Server** section in a mock property gives you access to MCP-compatible endpoints to integrate your mocks with your favorite tool.

![mcp endpoints](/images/documentation/mcp-endpoints.png)

As you can see in the capture above, Microcks provides two different kinds of endpoints and transports:
* **HTTP SSE Endpoint** as defined in the [2024-11-05](https://modelcontextprotocol.io/specification/2024-11-05/basic/transports#http-with-sse) version of the protocol,
* **HTTP Streamable Endpoint** as defined in the [2025-03-26](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http) version of the protocol.

Depending on the tool you're using - [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector), [Postman](https://learning.postman.com/docs/postman-ai-agent-builder/overview/), [Claude](https://claude.ai/) or [Cherry Studio](https://www.cherry-ai.com/) are the ones we tested - you'll need one or the other endpoint based on how they support MCP.

## OpenAPI mocks support

The different operations of an API mock baked by an OpenAPI specification are automatically published as [MCP tools](https://modelcontextprotocol.io/specification/2025-03-26/server/tools).

Microcks reuses elements from the schemas found in the OpenAPI spec to translate them into descriptive MCP input schemas so that the agent calling the tool is aware of expected input arguments. As MCP is based on JSON-RPC, we don't have all the REST possibilities that accept operation arguments in `body`, `path`, `query` and `headers`. Consequently, Microcks wraps those elements into the `params.arguments` field of an incoming MCP request.

Check this video below that demonstrates OpenAPI-to-MCP Server conversion in Microcks:

<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/nC6JXe1Dt58" title="YouTube video" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>

## GraphQL mocks support

The queries and mutations of an API mock baked by a GraphQL schema are automatically published as [MCP tools](https://modelcontextprotocol.io/specification/2025-03-26/server/tools).

Microcks reuses elements from the GraphQL schema to translate them into descriptive MCP input schemas so that the agent calling the tool is aware of expected input arguments. As of today, the results returned by Microcks will not be filtered and will contain all the properties and relations that are specified in your mock responses.

Check this video below that demonstrates GraphQL-to-MCP Server conversion in Microcks:

<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/vLz_LeuJjg0" title="YouTube video" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>

## gRPC mocks support

The different RPC unary calls of a gRPC service defined in a Protobuf contract are automatically published as [MCP tools](https://modelcontextprotocol.io/specification/2025-03-26/server/tools).

Microcks reuses elements from the Protobuffer contract to translate them into descriptive MCP input schemas so that the agent calling the tool is aware of expected input arguments.

Check this video below that demonstrates gRPC-to-MCP Server conversion in Microcks:

<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/iR4OHePm-XU" title="YouTube video" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>


## Final note

As MCP - and AI integration at large - is a fast-moving part, expect some important and breaking changes in the coming release. If something doesn't work as expected, please check Microcks `nightly` version by switching the [container image](/documentation/references/container-images/) you're using.
