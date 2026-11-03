---
sidebar_custom_props:
  tags: [Postman, Importer]
title: Connecting to Postman Workspaces
sidebar_position: 8
last_update:
  date: '2024-06-18'
description: "Import collections straight from a Postman Workspace with an API key and an Importer."
---

## Overview 

[Postman Workspaces](https://www.postman.com/product/workspaces/) are a common and effective way of organizing your team's API work. Workspaces allow you to collaborate while designing your API and share your API artifacts like Postman Collections.

In this guide, you'll learn how to directly connect Microcks to your Postman Collection living in a Workspace so that changes in Postman may be automatically propagated to Microcks. 

## 1. Obtain an API Key

In order to connect to your Postman Workspace, you'll need an API Access Key so that Microcks will be able to authenticate while fetching your Collection. In order to do that, you'll need to generate an API Key from Postman Workspace as illustrated below:

<div align="center">
<img src="/images/documentation/postman-api-keys.png" alt="postman api keys" />
<br/><br/>
</div>

This API Key must then be saved as an authentication [Secret in Microcks](/documentation/guides/administration/secrets) so that your importer can reference it and supply it to the Postman API using the `X-API-Key` header. 

As an administrator, create a new Secret using this template and replace the token with your own value:

<div align="center">
<img src="/images/documentation/postman-api-secret.png" alt="postman api secret" />
<br/><br/>
</div>

## 2. Share your API

Now you need to retrieve the Collection API link. For that, you have to go through the **Share** button and select the **Via API** thumbnail as illustrated in the picture below:

![postman share api link](/images/documentation/postman-share-api-link.png)

> 🗒️ You can see that it's also possible to generate a new API key from this step if you have skipped step 1 😉

Copy this URL, which is unique and represents access to your Collection.


## 3. Create an Importer

Finally, you can use this URL (ending just before the `?`) and use it directly as an Importer URL when [creating a Scheduled Importer](/documentation/guides/usage/importing-content/#2-import-content-via-importer). 

## Wrap-up

Congrats 🎉 You now know how to connect Microcks to your Postman Workspace and get direct access to the Postman Collection shared with your team!
