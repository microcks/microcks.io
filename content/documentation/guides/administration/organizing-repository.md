---
draft: false
title: "Organizing Repository"
date: 2020-03-22
publishdate: 2020-03-22
lastmod: 2024-06-13
weight: 1
---

## Overview

This guide walks through the different techniques for organinzing your API & Services repository content in Microcks. As you import more and more artifacts into Microcks, it can be come difficult to find the API you're looking for! Microcks proposes handling by putting `labels` 🏷️ on **APIs & Services** or **Importer Jobs** of your repository. Labels are a very flexible way to map your own organizational structures with loose coupling. 

This guide will show **3 techniques** that are using labels to enhance the organization of your repository. These techniques are progressive and you decide applying the first one without pursuing on others. However, applying the third ones requires to have adopted the previous ones.

1️⃣ We will **apply labels** labels to different objects in order to add categorization informations,

2️⃣ From there, we can then **define a master filter** for our repository, choosing a discriminetion criterion,

3️⃣ From tehre, we can also **segment the management permsissions** to different users.

> 🚨 **Prerequisites**
>
> Labels setup and management require changing its configuration and accessing it with the `manager` or `admin` role. Be sure to be able to have access or ask some help to your admin.

Let’s jump in! 🏂


## 1. Applying labels

Generally speaking, `labels` 🏷️  are key/value pairs that are attached to objects, such as **APIs & Services** or **Importer Jobs**. Labels are intended to be used to specify identifying attributes of objects that are meaningful and relevant to your business or organization, but do not directly imply semantics to the core system. 

Some example labels that may suit your classification needs:

* `domain` may represent the business or application domain this API belongs to. Example values: `customer`, `finance`, `sales`, `shipping` ...
* `status` may represent the status of the API in the lifecycle. Example values: `wip`, `preview`, `GA`, `deprecated`, `retired` ...
* `type` or `pattern` may represent the pattern involved in the API implementation. Example values: `proxy`, `composition`, `assembly` ...
* `team` may represent the owner team for this API. Example values: `team-A`, `team-B` ...

Labels can be attached at creation time and subsequently added and modified at any time. Each APIs & Services can have a set of key/value labels defined and each key must be unique for a given object.

When accessing API details, labels are displayed with global metadata at the top level with the **Manage labels...** link:

<div align="center">
{{< figure src="images/documentation/organizing-labels.png" alt="image" zoomable="true" width="80%" >}}
</div>
<br/>

Label management is done through the dialog shown below when one can easily add new labels or remove existing ones.

<div align="center">
{{< figure src="images/documentation/organizing-labels-edit.png" alt="image" zoomable="true" width="70%" >}}
</div>
<br/>

## 2. Filtering repository content

Labels can also be used to select subsets of APIs & Services.

Microcks does not impose any labels or way of modeling them 😉 However, for now it applies one level filtering in its UI using one `master` label you define as the most important. Below an example of what you've got on the UI side when defining `Domain` as the main label:

<div align="center">
{{< figure src="images/documentation/organizing-services.png" alt="image" zoomable="true" width="90%" >}}
</div>
<br/>

Microcks administrator can configure one label as being the main one, the `master` that will be used for first level filtering in the Services list page of the Microcks web UI.

For that, we rely on the `features.properties` configuration file found on the server side. Here's below the portion of `features.properties` configuration used for enabling `repository-filter` and having the results shown in the capture just above. You'll see that we use `domain` as the main label and that we only display `domain` and `status` labels on the Services list page:

```properties
features.feature.repository-filter.enabled=true
features.feature.repository-filter.label-key=domain
features.feature.repository-filter.label-label=Domain
features.feature.repository-filter.label-list=domain,status
```

> 💡 You may check the [Application Configuration reference](/documentation/references/configuration/application-config#repository-filtering-properties) documentation to get comprehensive list and explanations of above properties.

## 3. Segmenting management responsibilities

The final techniques of repository organization is to distribute/segment the management permissions between different users. 

As an example, if you defined the `domain` label as the master with `customer`, `finance` and `sales` values, you'll be able to define users with the `manager` role **only** for the APIs & Services that have been labeled accordingly. Sarah may be defined as a `manager` for `domain=customer` and `domain=finance` services, while John may be defined as the `manager` for `domain=sales` APIs & services.

For that, we rely on the `features.properties` configuration file found on the server side Here's below the portion of `features.properties` configuration used for enabling `repository-tenancy`:

```properties
features.feature.repository-tenancy.enabled=true
features.feature.repository-tenancy.artifact-import-allowed-roles=admin,manager,manager-any
```

As an administrator of the Microcks instance, you can now assign users to different groups using [Users Management](/documentation/guides/administration/users) capabilities within Microcks Web UI.

> 💡 You may check the [Security Configuration reference](/documentation/references/configuration/security-config#groups-segmentation) documentation to get comprehensive list and explanations of above properties.


## Wrap-up

Walking this guide, you have learned the different means available for organizing your API & Services repository thanks to `labels` 🏷️. It's important to note that labels are saved into Microcks database and not replaced by a new import of your Service or API definition. They can be independently set and updated using the [Microcks APIs](/documentation/references/apis/open-api), [Microcks Metadata](/documentation/references/metadada), [OpenAPI extensions](/documentation/references/artifacts/openapi-conventions/#openapi-extensions) or [AsyncAPI extensions](/documentation/references/artifacts/asyncapi-conventions/#asyncapi-extensions).

You may follow-up this guide with the one related to [Managing Users](/documentation/guides/administration/users) or [Snapshotting/restoring your Repository](/documentation/guides/administration/snapshots)

