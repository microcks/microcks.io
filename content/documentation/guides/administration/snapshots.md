---
draft: false
title: "Snapshotting/restoring Repository"
date: 2019-11-18
publishdate: 2019-11-18
lastmod: 2024-04-27
weight: 4
---

## Overview 

This guide will teach you what are Microcks *Snapshots* and what are their use-case sweet spots. As an administrator, you will learn  how to select the elements you would like to Snapshots and how to import a previous Snapshot to restore content.

> 🚨 **Prerequisites**
>
> Users can only be managed by Microcks `admin` - we mean people having the `admin` role assigned. In order to be able to retrieve the list of users and operate changes, the user should also have **manage-users** and **manage-clients** roles from **realm-management** Keycloak internal client. See [Keycloak documentation](https://www.keycloak.org/docs/latest/server_admin/index.html#_per_realm_admin_permissions) for more on this point.

## 1. Use-cases

Microcks Snapshots are not complete database exports because they only integrate the Services & APIs definitions parts. As an example, they do not embed all the tests runs and analytics data.

> 🚨 **Warning**
>
> Snapshots cannot be substitutes for proper database backup and restore procedures! If you choose to deploy Microcks as a central instance that should always up-and-running, databases backups are necessary to keep all the history of different objects and retain the configuration of your instance.

Snapshots are lightweight structures that can be used to:
* easily exchange a set of Services & APIs definition with another instance of Microcks,
* easily setup a new Microcks instance dedicated for mocking a functionnal subsystem - optionally with different configured response times for simulating a real behaviour,
* easily backup your instance if you do not bother loosing tests runs and analytics data

Snapshots can only be managed by Microcks `administrator` - we mean people having the `administrator` role assigned. If you need further information on how to manage users and roles, please check [here](/documentation/guides/administration/users). Snapshots management is simply a thumbnail with the `Administration` page that is available from the vertical menu on the left once logged in as administrator.

## 2. Create a Snapshot

Snapshots management is simply a thumbnail with the **Administration** page that is available from the vertical menu on the left once logged in as administrator. 
Creating and exporting a new Snapshot is as simple as selecting the different API & Services you want to export and click the **Export** button on top right. See the capture below: 

{{< image src="images/documentation/snapshots.png" alt="image" zoomable="true" >}}

> 💡 Be careful: the services list panel has limited height and is scrollable. If you have many services, you may not seen some of them at first sight.

The export allows you to download a JSON file called `microcks-repository.json` that embeds the foundationnal elements of a repository:

```json
{
  "services": [
    {
      "id": "5dd5661d7afe58688acc7eff",
      "name": "API Pastry",
      "version": "1.1.0",
      "xmlNS": null,
      "type": "REST",
      "metadata": {
        "createdOn": 1574266397964,
        "lastUpdate": 1584877046174,
        "annotations": null,
        "labels": {
          "domain": "pastry",
          "status": "GA"
        }
      },
      "operations": [
        [...]
      ]
    },
    [...]
  ],
  "resources": [...],
  "requests": [...],
  "responses": [...]
}
```

## 3. Restoring from Snasphot

The opposite import operation can be easily done by uploading your Snapshot file and hitting the **Import** button 😉

## Wrap-up

Snapshots are lightweight structures that are really helpful to quickly share or reload API & Services definitions.
They are very convenient to use for example when [Developing with Testcontainers](/documentation/guides/usage/developing-testcontainers) to ensure all your developers share the
same third-parties API definitions.

Keep in mind that Snapshots can also be exported and imported using [Microcks REST API](/documentation/references/apis/open-api)! 😉
