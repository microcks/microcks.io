---
draft: false
title: "Http Archive Conventions"
date: 2024-05-27
publishdate: 2024-05-27
lastmod: 2024-05-27
weight: 8
---

## Conventions

In order to be correctly imported and understood by Microcks, your HAR file should follow a little set of reasonable conventions and best practices.

* HAR file doesn't have the notion of API name or version. In Microcks, this notion is critical and we thus we will need to have a specific comment notation to get this information. You'll need to add a comment line starting with `microcksId:` in your file and then referring the `<API name>:<API version>`. HAR provides a header `log` structure that may host such a comment. See an example below:

```json
{
  "log": {
    "version": "1.2",
    "comment": "microcksId: API Pastries:0.0.2",
    "creator": {
      "name": "WebInspector",
      "version": "537.36"
    },
  [...]
}
```

* Optionnaly - if the captured traffic is located behind gateways or other stuffs rewriting URLs - you may want to remove API invocations URL prefix to better fit your API definition. You can then add an additional comment line starting with `apiPrefix:` to specify a part of the path Microcks will remove from found paths. See an example below:

```json
{
  "log": {
    "version": "1.2",
    "comment": "microcksId: API Pastries:0.0.2 \n apiPrefix: /my/prefix/toRemove",
    "creator": {
      "name": "WebInspector",
      "version": "537.36"
    },
  [...]
}
```

With this configuration, the `apiPrefix` is used for 2 purposes by Microcks:
* to filter out the log entries that are not starting by `/my/prefix/toRemove`,
* to clean-up the path and find a short operation name.

As an example, imagine you'll have a `GET https://pastries.acme.org/my/prefix/toRemove/pastries?size=S` log entry in the HAR file, this one will be considered as a valid entry because it containtes the `apiPrefix` after having removed host information and it will be considered as an example for the `GET /pastries` operation.

## Primary or Secondary?

A HAR file can be imported aither as a `primary` artifact or as a `secondary` artifact.

When imported as a `primary` artifact, Microcks tries to guess the type of API (`REST`, `GRAPHQL` or `SOAP`) looking at the payload of requests. It also tries to find similarities between entries path to deduce operations for your API. 

When imported as a `secondary` artifact - a `primary` one being an OpenAPI specification, a GraphQL Schema or a SoapUI project - Microcks uses the definition of the API provided by this primary artifact to associate entries with operations accordingly.

