---
draft: false
title: "Microcks' AsyncAPI"
date: 2024-04-29
publishdate: 2024-04-29
lastmod: 2024-11-13
weight: 2
---

As a tool focused on APIs and Events, Microcks also offers its own Events API that allows you subscribe to events produced by Microcks. Depending on your deployment topology, those events can be consumed directly via WebSockets or via a Kafka topic named `microcks-services-updates`.

The AsyncAPI Web Component below allows you to browse and discover the various API events.

Previous releases of the API definitions can be found in the [GitHub repository](https://github.com/microcks/microcks/tree/master/api).

{{< aai-spec url="https://raw.githubusercontent.com/microcks/microcks/refs/heads/1.11.x/api/microcks-asyncapi-v1.10.yaml" >}}