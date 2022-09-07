---
draft: false
title: "Microcks API"
date: 2019-11-11
publishdate: 2019-11-11
lastmod: 2022-09-01
menu:
  docs:
    parent: automating
    name: Microcks API
    weight: 50
toc: true
weight: 50 #rem
---

## Microcks own's API

As a tool focused on APIs, Microcks also offers its own API that allows you to query its datastore and control the import jobs and configuration objects. You may use this API from your automation tool to dynamically launch new tests, register new mocks or globally control your Microcks server configuration.

The Swagger-UI below allows you to browse and discover the various API endpoints.

Previous releases of the API definitions can be found in the [GitHub repository](https://github.com/microcks/microcks/tree/master/api).

{{< oai-spec url="https://raw.githubusercontent.com/microcks/microcks/1.6.x/api/microcks-openapi-v1.6.yaml" >}}

