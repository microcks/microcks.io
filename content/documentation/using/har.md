---
draft: false
title: "Http Archive usage for Microcks"
date: 2023-02-23
publishdate: 2023-02-23
lastmod: 2023-02-23
weight: 41 #rem
---

## Overview

### Introduction

As the Microcks community is growing, we heard a lot of people capturing live traffic in order to re-inject this data into their [OpenAPI](../openapi) or [Postman Collection](../postman) files and reuse them as mock definitions. During this process, they curate the recording list and have to develop/automate the transformation of their captured data to other formats. We'd like to ease their pain and propose a more straightforward way using [HTTP Archive Format (HAR)](https://w3c.github.io/web-performance/specs/HAR/Overview.html).

Lots of proxy tooling already use this format as an export format (mitmproxy, Chromium-based browsers, Postman, Insomnia, Proxyman, Fiddler, Gatling, Selenium, GitLab HAR recorder, ...) so it is easy to integrate with most existing recording solutions.

That way, we think we've got Linux philosophy as it's best, supporting the following flow:
1. Let specialized tooling do the capture/recording and exporting of traffic using HAR format.
2. Optionally curate the recorded content to remove noise and inappropriate data
3. Integrate the resulting HAR into Microcks so that captures may be reused as mock sources.

### Conventions

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

* Optionnaly - if the captured traffic was behind gateways or other stuffs rewriting URLs - you may want to remove API invocations URL prefix to better fit your API definition. You can then add an additional comment line starting with `apiPrefix:` to specify a part of the path Microcks will remove from found paths. See an example below:

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

### Importing artifacts

An HAR file should be imported into Microcks either through [direct upload](../importers/#direct-upload) or [scheduled import](/..importers/#scheduled-import). It can be imported aither as a `main` or `primary` artifact or as a `secondary` artifact.

When imported as a `primary` artifact, Microcks tries to guess the type of API (`REST`, `GraphQL` or `SOAP`) looking at the payload of requests. It also tries to find similarities between entries path to deduce operations for your API. 

When imported as a `secondary` artifact - a `primary` one being an OpenAPI specification, a GraphQL Schema or a SoapUI project - Microcks uses the definition of the API provided by this primary artifact to associate entries with operations accordingly.

