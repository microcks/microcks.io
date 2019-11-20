---
draft: false
title: "Microcks API"
date: 2019-11-11
publishdate: 2019-11-11
lastmod: 2019-11-11
menu:
  docs:
    parent: automating
    name: Microcks API
    weight: 50
toc: true
weight: 50 #rem
categories: [automating]
---

## Microcks own's API

As a tool focused on APIs, Microcks also offers its own API that allows you to query its datastore and control the import jobs and configuration objects. You may use this API from your automation tool to dynamically launch new tests, register new mocks or globally control your Microcks server configuration.
      
The Swagger-UI below allows you to browse and discover the various API endpoints.

{{ partial "swagger-ui.html" }}
