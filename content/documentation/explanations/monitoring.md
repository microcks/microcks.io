---
draft: false
title: "Monitoring & Observability"
date: 2022-09-09
publishdate: 2022-09-09
lastmod: 2024-09-30
weight: 20
---

## Introduction

As a cloud-native application, we take great care of providing observability on what's going on within a Microcks instance. We dissociate two kinds of metrics: the **Functional metrics** are related to all the domain objects you may find in Microcks and the **Technical metrics** that are related to resource consumption and performance.

## Functional metrics

Microcks provides functional metrics directly from within [its own REST API](/documentation/references/apis/open-api). This API will give you visibility on how you use the platform to invoke mocks, execute tests and enhance or degrade quality metrics. The endpoints of the API are returning JSON data.

Three categories of endpoints are available:

* `/api/metrics/conformance/*` for querying/collecting the metrics related to the Test Conformance of the API | Services of your repository - see [Conformance metrics](/documentation/explanations/conformance-testing/#conformance-metrics),
* `/api/metrics/invocations/*` for querying the metrics related to mocks invocations (daily/hourly invocations, by API | Service or aggregated),
* `/api/metrics/tests/*` for aggregated metrics on tests executed on the platform

Have a look at [Connecting Microcks API](/documentation/guides/automation/api) and [REST API reference](/documentation/references/apis/open-api) reference to get detailed on how to use those endpoints.

## Technical metrics

For Technical metrics, Microcks components expose [Prometheus](https://prometheus.io) endpoints that can be scraped to collect technical metrics. That way you ca neasily integrate Microcks monitoring into any modern monitoring stack with [Alert Manager](https://prometheus.io/docs/alerting/latest/alertmanager/) or [Grafana](https://grafana.com/grafana/).

Two different endpoints are available:

* `/actuator/prometheus` path for the main webapp component,
* `/q/metrics` path for async-minion component

From those endpoints, you will be able to collect resource consumption or perfromance metrics such as: JVM memory used, JVM thread pools, HTTP endpoints performance, Database queries performance and so on.

## OpenTelemetry support

Starting with Microcks `1.9.0`, the main webapp component now supports [OpenTelemetry](https://opentelemetry.io/) instrumention for logs, distributed tracing and metrics.

OpenTelemetry is disabled by default and must be enabled using two different environment variables:

* `OTEL_JAVAAGENT_ENABLED` is set to false by default, so you'll have to explicitly set it to `true`
* `OTEL_EXPORTER_OTLP_ENDPOINT` is set to a local dummy endpoint, so you'll have to set it to an OpenTelemetry collector endpoint of your environment. Something like `http://otel-collector.acme.com:4317` for example.

Check the dedicated [README](https://github.com/microcks/microcks/tree/master/observability) on GitHub to get more details.

## Grafana dashboard

Starting with Microcks `1.9.0`, we also provide a [Grafana](https://grafana.com/) dashbaord that allows you to easily track the performance and health status of your Microcks instance. 

This dashboard is using data coming from a Prometheus source so you don't have to enabled the full OpenTelemetry support to use it. Standard Prometheus endpoints scraped by your Prom instance will do the job.

Check the dedicated [/dashbaords](https://github.com/microcks/microcks/tree/master/observability/dashboards) on GitHub to get more details.

## Benchmark suite

Starting with Microcks `1.9.0`, we also provide a benchmark suite as an easy way of validating/sizing/evaluating changes on your Microcks instance. It allows you to simulate Virtual Users on different usage scenarios and gather performance metrics of your instance.

Check the dedicated [README](https://github.com/microcks/microcks/tree/master/benchmark) on GitHub to get more details.