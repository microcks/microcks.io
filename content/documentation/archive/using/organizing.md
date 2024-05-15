---
draft: false
title: "Organizing repository"
date: 2020-03-22
publishdate: 2020-03-22
lastmod: 2021-08-31
weight: 16
---

## Introduction

You can manage `labels` upon APIs & Services present into your Microcks repository.

Generally speaking, labels are key/value pairs that are attached to objects, such as **APIs & Services** or **Importer Jobs**. Labels are intended to be used to specify identifying attributes of objects that are meaningful and relevant to your business or organization, but do not directly imply semantics to the core system. Labels can be used to organize and to select subsets of APIs & Services. Labels can be attached at creation time and subsequently added and modified at any time. Each APIs & Services can have a set of key/value labels defined and each key must be unique for a given object.

Labels are a very flexible way to map your own organizational structures onto APIs & Services with loose coupling. Some example labels that may suit your classification needs:

* `domain` may represent the business or application domain this API belongs to. Example values: `customer`, `finance`, `sales`, `shipping`...
* `status` may represent the status of the API in the lifecycle. Example values: `wip`, `preview`, `GA`, `deprecated`, `retired`...
* `type` or `pattern` may represent the pattern involved in the API implementation. Example values: `proxy`, `composition`, `assembly`...
* `team` may represent the owner team for this API. Example values: `team-A`, `team-B`...

Microcks does not impose any labels or way of modeling them 😉 However, for now it only applies one level filtering in its UI using one `master` label you define as the most important. Below an example of what you've got on the UI side when defining `Domain` as the main label:

{{< image src="images/organizing-services.png" alt="image" zoomable="true" >}}

## Applying labels

When accessing API details, labels are displayed with global metadata at the top level. Users have the `manager` or `administrator` roles will also see the **Manage labels...**  item available right next to label list.

{{< image src="images/organizing-labels.png" alt="image" zoomable="true" >}}

Label management is done through the dialog shown below when one can easily add new labels or remove existing ones.

{{< image src="images/organizing-labels-edit.png" alt="image" zoomable="true" >}}

> Labels are saved into Microcks database and not replaced by a new importation of your Service or API definition. They can be independently set and updated using the [Microcks APIs](/documentation/using/automating/api).

## Master level filter

Microcks instance administrator are also able to configure one label as being the main one, the `master` that will be used for first level filtering in the Services list page of the Microcks web UI.

For that, we rely on the `features.properties` configuration file found on the server side. Depending on how you install Microcks - through Operator or Helm Chart or Docker-Compose - these properties are made available directly into a `MicrocksInstall` custom resource or a `ConfigMap` or a regular file.

The feature to activate for that is simply called `repository-filter`. It has the following sub-properties:

| Sub-Property | Description |
| ---------- | ----------------- |
| `enabled` | A boolean flag that turns on the feature. `true` or `false` |
| `label-key` | The label key to use for first level filtering in Services list page. |
| `label-label` | The display label of the first level filtering key in Services list page.|
| `label-list` | A comma separated list of label keys you want to display in Services list page. |

Here's below the portion of `features.properties` configuration used for enabling `repository-filter` and having the results shown in the capture on the top of this page. You'll see that we use `domain` as the main label and that we only display `domain` and `status` labels on the Services list page:

```properties
features.feature.repository-filter.enabled=true
features.feature.repository-filter.label-key=domain
features.feature.repository-filter.label-label=Domain
features.feature.repository-filter.label-list=domain,status
```

> Note: when configured through `MicrocksInstall` Kubernetes CRD or Helm Chart values, we use a Camel Case notation for this properties. They are named: `repositoryFilter` with sub-keys `labelKey`, `labelLabel` and `labelList`.

## RBAC security segmentation

From `1.4.0` release, we introduce the ability to segment the repository management depending on the `master` label that has been configured.

As an example, if you defined the `domain` label as the master with `customer`, `finance` and `sales` values, you'll be able to define users with the `manager` role **only** for the APIs & Services that have been labeled accordingly. Sarah may be defined as a `manager` for `domain=customer` and `domain=finance` services, while John may be defined as the `manager` for `domain=sales` APIs & services.

See the documentation on [Authorization](../../../administrating/users/#authorization) and [Users management](../../../administrating/users/#users-management) for more informations on how to manage this role attributions.

We rely on the `features.properties` configuration file found on the server side. Depending on how you install Microcks - through Operator or Helm Chart or Docker-Compose - these properties are made available directly into a `MicrocksInstall` custom resource or a `ConfigMap` or a regular file.

The feature to activate for that is simply called `repository-filter`. It has the following sub-properties:

| Sub-Property | Description |
| ---------- | ----------------- |
| `enabled` | A boolean flag that turns on the feature. `true` or `false` |
| `artifact-import-allowed-roles` | A comma separated list of roles that you may restrict import of artifacts to. |

Here's below the portion of `features.properties` configuration used for enabling `repository-tenancy`:

```properties
features.feature.repository-tenancy.enabled=true
features.feature.repository-tenancy.artifact-import-allowed-roles=admin,manager,manager-any
```

> Note: when configured through `MicrocksInstall` Kubernetes CRD or Helm Chart values, we use a Camel Case notation for this properties. They are named: `repositoryTenancy` with sub-key `artifactImportAllowedRoles`.

> Note 2: the `manager-any` is not actually a role, it's a notation meaning 'a people that belong to any management group even if not endorsing the global manager role'.