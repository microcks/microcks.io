---
draft: false
title: "Monitoring & Observability"
date: 2022-09-09
publishdate: 2022-09-09
lastmod: 2022-09-09
weight: 20
---

## Introduction

As a cloud-native application, we take great care of providing observability on what's going on within a Microcks instance. We dissociate two kinds of metrics: the **Functional metrics** are related to all the domain objects you may find in Microcks and the **Technical metrics** that are related to resource consumption and performance.

## Functional metrics

Microcks provides functional metrics directly from within [its own API](../../../automating/api). This API will give you visibility on how you use the platform to invoke mocks, execute tests and enhance or degrade quality metrics. The endpoints of the API are returning JSON data.

Three categories of endpoints are available:

* `/api/merics/conformance/*` for querying/collecting the metrics related to the Test Conformance of the API | Services of your repository - see [Conformance metrics](../../tests#conformance-metrics),
* `/api/metrics/invocations/*` for querying the metrics related to mocks invocations (daily/hourly invocations, by API | Service or aggregated),
* `/api/metrics/tests/*` for aggregated metrics on tests executed on the platform

Have a look at [Microcks API](../../../automating/api) to get detailed on how to use those endpoints.

## Technical metrics

For Technical metrics, Microcks components expose [Prometheus](https://prometheus.io) endpoints that can be scraped to collect technical metrics. That way you ca neasily integrate Microcks monitoring into any modern monitoring stack with [Alert Manager](https://prometheus.io/docs/alerting/latest/alertmanager/) or [Grafana](https://grafana.com/grafana/).

Two different endpoints are available:

* `/actuator/prometheus` path for the main webapp component,
* `/q/metrics` path for async-minion component

From those endpoints, you will be able to collect resource consumption or perfromance metrics such as: JVM memory used, JVM thread pools, HTTP endpoints performance, Database queries performance and so on.
