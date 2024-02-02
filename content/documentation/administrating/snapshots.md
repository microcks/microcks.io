---
draft: false
title: "Repository Snapshots"
date: 2019-11-18
publishdate: 2019-11-18
lastmod: 2019-11-19
weight: 3
---

## Introduction

Microcks allows users to export a part of its database as a Snapshot and import such a Snapshot within another instance. Such Snapshots are not complete database exports because they only integrate the Services & APIs definitions parts. As an example, they do not embed all the tests runs and analytics data.

Snapshots are lightweight structures that can be used to:
* easily exchange a set of Services & APIs definition with another instance of Microcks,
* easily setup a new Microcks instance dedicated for mocking a functionnal subsystem - optionally with different configured response times for simulating a real behaviour,
* easily backup your instance if you do not bother loosing tests runs and analytics data

Snapshots can only be managed by Microcks `administrator` - we mean people having the `administrator` role assigned. If you need further information on how to manage users and roles, please check [here](./users). Snapshots management is simply a thumbnail with the `Administration` page that is available from the vertical menu on the left once logged in as administrator.

## Exporting a Snapshot

Creating and exporting a new Snapshot is as simple as selecting the different Services you want to export and click the **Export** button on top right. See the capture below: 

{{< image src="images/snapshots.png" alt="image" zoomable="true" >}}

> Becareful: the services list panel has limited height and is scrollable. If you have many services, you may not seen some of them at first sight.

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

## Importing a Snapshot

The opposite import operation can be easily done by uploading your Snapshot file and hitting the **Import** button 😉
