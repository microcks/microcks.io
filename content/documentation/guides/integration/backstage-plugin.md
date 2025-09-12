---

draft: false
title: "Configuring the Backstage Plugin"
date: 2024-04-30
publishdate: 2024-04-30
lastmod: 2024-04-30
weight: 3

---

The Microcks Backstage provider discovers APIs from one or more Microcks instances and syncs them into the Backstage Software Catalog as `API` entities. This page explains how to install, configure, and verify the provider in your Backstage app.

- **Plugin repository**: https://github.com/microcks/microcks-backstage-provider
- **Overview blog post**: https://microcks.io/blog/backstage-integration-launch/

## Prerequisites

- A running Backstage application (backend package available)
- A running Microcks instance and its base URL, for example: `https://microcks.acme.com`
- A Microcks Service Account in your Keycloak realm, with client id and secret
  - See: [/documentation/explanations/service-account](/documentation/explanations/service-account)

## 1. Install the provider

Add the provider to your Backstage backend:

```bash
yarn add --cwd packages/backend @microcks/microcks-backstage-provider@^0.0.2
```

## 2. Configure providers in `app-config.yaml`

Declare one or more Microcks named providers under the Backstage catalog section. Each provider points to a Microcks instance and defines sync options.

```yaml
catalog:
  providers:
    microcksApiEntity:
      dev:
        baseUrl: https://microcks.acme.com
        serviceAccount: microcks-serviceaccount
        serviceAccountCredentials: ab54d329-e435-41ae-a900-ec6b3fe15c54
        systemLabel: domain
        ownerLabel: team
        schedule: # optional; same options as in TaskScheduleDefinition
          frequency: { minutes: 2 }
          timeout: { minutes: 1 }
      prod:
        baseUrl: https://microcks.example.com
        serviceAccount: backstage-sync
        serviceAccountCredentials: ${MICROCKS_BACKSTAGE_SYNC_SECRET}
        systemLabel: system
        ownerLabel: owner
```

- **baseUrl**: Public base URL of your Microcks instance (no trailing `/api/`).
- **serviceAccount / serviceAccountCredentials**: Credentials of a Service Account in the Microcks Keycloak realm used to query Microcks. Prefer storing secrets in environment variables.
- **systemLabel / ownerLabel**: Microcks labels to map onto Backstage `system` and `owner` fields of the `API` entity. Choose labels that exist on your APIs in Microcks.
- **schedule**: Optional sync cadence. If omitted, the default provider schedule applies.

For guidance on creating and managing Service Accounts and understanding default roles, see [/documentation/explanations/service-account](/documentation/explanations/service-account). For Keycloak-related configuration in Microcks, see [/documentation/references/configuration/security-config](/documentation/references/configuration/security-config).

## 3. Register the provider in your backend

Add the provider to the catalog plugin initialization in your Backstage backend (for example in `packages/backend/src/plugins/catalog.ts`). The exact file may vary depending on your app-template version.

```ts
import { MicrocksApiEntityProvider } from '@microcks/microcks-backstage-provider';

// within your builder/initializer
builder.addEntityProvider(
  MicrocksApiEntityProvider.fromConfig(env.config, {
    logger: env.logger,
    scheduler: env.scheduler,
  }),
);
```

Ensure your backend loads configuration from `app-config.yaml` and that the provider key path (`catalog.providers.microcksApiEntity`) matches your YAML.

## 4. Authentication and permissions

The provider authenticates to Microcks using a Keycloak client (Service Account). At minimum, it needs read access to list APIs and artifacts in Microcks. If you use the default realm import, the `microcks-serviceaccount` exists by default. For production, create a dedicated client for Backstage and scope it to read-only permissions.

- How to inspect or create accounts: [/documentation/explanations/service-account](/documentation/explanations/service-account)
- How Microcks references Service Accounts in its own configs: [/documentation/references/configuration/security-config](/documentation/references/configuration/security-config)

## 5. Verify the synchronization

1. Start your Backstage backend so the provider can run on schedule.
2. In Microcks, pick an API that has a name, version, and at least one artifact (OpenAPI/AsyncAPI/gRPC).
3. Wait for the next scheduled run (or restart the backend to trigger immediately).
4. In Backstage, open Catalog → APIs and search for the synchronized APIs.
5. Inspect an API entity details page; you should see links to the API contract, mock sandbox, and test results.

## 6. Troubleshooting

- **No APIs appear in Backstage**
  - Verify `baseUrl` points to the public Microcks URL and is reachable from the Backstage backend.
  - Check that the Service Account is valid and has permissions; try using its client id/secret to get a token against Keycloak.
  - Ensure your labels mapping (`systemLabel`, `ownerLabel`) corresponds to actual labels in Microcks (or omit them initially).
  - Increase backend log level and look for logs from `MicrocksApiEntityProvider`.

- **Auth or 401 errors**
  - Re-check the Service Account credentials and Keycloak realm. If using environment variables, confirm they are exported to the backend process.

- **Slow or infrequent updates**
  - Tune the `schedule.frequency` and `schedule.timeout` values. Avoid overly aggressive schedules in production.

- **Conflicting ownership or duplicates**
  - Confirm only one provider is responsible for a given set of APIs. If combining multiple Microcks instances, use consistent labeling to distinguish systems and owners.

## See also

- Blog overview and screenshots: [/blog/backstage-integration-launch/](/blog/backstage-integration-launch/)
- Provider source and issues: `https://github.com/microcks/microcks-backstage-provider`
- Backstage Catalog concepts: `https://backstage.io/docs/features/software-catalog/`