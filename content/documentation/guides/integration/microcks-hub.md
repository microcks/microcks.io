draft: false
title: "Integrating with Microcks Hub"
date: 2024-04-30
publishdate: 2024-04-30
lastmod: 2025-08-24
weight: 2
---

## Overview

Microcks Hub is a community hub and free marketplace where API producers publish ready‑to‑use API mocks and test suites for Microcks. From any Microcks instance, you can browse the Hub, discover API Packages, and install versions in one click to quickly provision mocks and conformance tests.

- **Hub URL**: `https://hub.microcks.io`
- **What you get**: OpenAPI/AsyncAPI/GraphQL/gRPC artifacts, Postman tests, curated as installable API Packages
- **Typical use cases**: try APIs, build sandboxes, validate upgrades, run conformance testing

The Hub is enabled by default in Microcks and appears as a menu entry in the left navigation.

## 1. Prerequisites

- A running Microcks instance (local or cluster). See [Installation guides](/documentation/guides/installation/).
- A user with a role allowed to use the Hub menu (see Roles below).

## 2. Enable or disable the Hub

Hub integration is controlled by `features.properties` and is enabled by default. Administrators can configure the endpoint and restrict access to specific roles.

### Raw properties (Docker/Podman Compose)

Mount a `features.properties` file into the `microcks` container (see [Application Configuration reference](/documentation/references/configuration/application-config/#hub-access)) and define:

```properties
features.feature.microcks-hub.enabled=true
features.feature.microcks-hub.endpoint=https://hub.microcks.io/api
features.feature.microcks-hub.allowed-roles=admin,manager,manager-any
```

- Set `enabled=false` to hide the Hub entry from the UI.
- Adjust `allowed-roles` to match your access policy. `manager-any` means any user who belongs to at least one management group.

### Helm Chart

Use the `values.yaml` equivalent under `features.microcksHub` (see [Helm Chart config](/documentation/references/configuration/helm-chart-config)) to enable/disable and set endpoint/roles.

### Kubernetes Operator

Use the `Microcks` Custom Resource under `spec.features.microcksHub` (see [Operator config](/documentation/references/configuration/operator-config)).

## 3. Browse and install from the Hub

1. In Microcks, open the left menu and click `Microcks Hub`.
2. Browse available tiles. For a quick start, pick `MicrocksIO Samples API` to import sample APIs.
3. Click an API Package to open its details and select the API Version you need.
4. Click `Install` and choose an import method:
   - **Direct import**: immediately imports artifacts into your repository.
   - **Create Importer**: sets up a scheduled Importer to keep in sync from source control or remote URLs.
5. On success, follow the `Go` link to open the imported API or find it under `APIs | Services`.

Refer to the Getting Started tutorial for screenshots of the Hub entry and flow: see [Loading a Sample](/documentation/tutorials/getting-started/#loading-a-sample).

## 4. Roles and permissions

Access to the Hub UI is restricted to users whose role is included in `features.feature.microcks-hub.allowed-roles`.

- Default: `admin`
- Set an empty or stricter list to reduce access surface.

Imported artifacts follow your repository labels, segmentation and permissions. See [Organizing Repository](/documentation/guides/administration/organizing-repository/).

## 5. Network and connectivity

Microcks connects to the Hub backend via the configured `endpoint` (default `https://hub.microcks.io/api`). Ensure outbound egress is allowed for the Microcks Webapp pod/container. If you use a proxy, configure JVM/system proxy settings accordingly.

## 6. Troubleshooting

- Hub menu missing: verify `features.feature.microcks-hub.enabled=true` and that your user has an allowed role.
- Cannot reach the Hub: check egress/firewall/proxy rules and `endpoint` URL. Test from the host/container with `curl`.
- Install fails: open the package page and prefer `Direct import` first; if using `Create Importer`, validate credentials/secrets and artifact URLs.
- Permissions: confirm repository labels/segmentation do not prevent visibility or management actions.

## 7. Related resources

- Blog announcement: [Microcks’ hub and marketplace](/blog/microcks-hub-announcement/)
- Contribution guide (publish your Package): `https://hub.microcks.io/doc/how-to-contribute`
- Package model and examples: `https://hub.microcks.io/doc/package-api-mocks`
- Getting started tutorial: [Using Microcks Hub](/documentation/tutorials/getting-started/#loading-a-sample)
- Application configuration reference: [Hub Access](/documentation/references/configuration/application-config/#hub-access)

## 8. FAQ

- Is the Hub a Postman alternative? No. The Hub complements Postman by distributing mocks and conformance suites for enterprise workflows. See the [announcement](/blog/microcks-hub-announcement/#enthusiastic) for details.
- Can I run a private Hub? The built‑in integration targets the public Hub. For private catalogs, rely on Importers pointing to your internal repositories.

  > **Note:** Running a private Hub is a common community request and is currently a work in progress.  
  > We welcome contributions on this feature: [GitHub Issue #118](https://github.com/microcks/hub.microcks.io/issues/118).