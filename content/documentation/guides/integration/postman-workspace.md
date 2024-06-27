---
draft: false
title: "Connecting to Postman Workspaces"
date: 2023-02-23
publishdate: 2024-06-18
lastmod: 2024-06-18
weight: 8
---

## Overview 

[Postman Workspaces](https://www.postman.com/product/workspaces/) are a common and effective way of organizing your team API work. Workspaces allow you to collaborate while designing your API and share your API artifacts like Postman Collections.

In this guide, you'll learn how to directly connect Microcks to your Postman Collection living in a Workspace so that changes in Postman may be automatically propagated to Microcks. 

## 1. Obtain an API Key

In order to connect to your Postman Workspace, you'll need an API Access Key so that Microcks will be able to authenticate while fetching your Collection. In order to do that, you'll need to generate an API Key from Postman Workspace as illustrated below:

<div align="center">
{{< image src="images/documentation/postman-api-keys.png" alt="image" zoomable="true" >}}
<br/><br/>
</div>

This API Key must then be saved as an authentication [Secret in Microcks](/documentation/guides/administration/secrets) so that your importer will be able to reference it and supply it to Postman API using the `X-API-Key` header. 

As an administrator, create a new Secret using this template and replacing the token with your own value:

<div align="center">
{{< image src="images/documentation/postman-api-secret.png" alt="image" zoomable="true" >}}
<br/><br/>
</div>

## 2. Share your API

Now you need to retreive the Collection Api linkg. For that, you have to go through the **Share** button and select the **Via API** thumbnail as illustrated in the picture below:

{{< image src="images/documentation/postman-share-api-link.png" alt="image" zoomable="true" >}}

> 🗒️ You can see that it's also possible to generate a new API key from this step if you have skipped step 1 😉

Copy this URL that is unique and represents access to your Collection.


## 3. Create an Importer

Finally, you can then use this URL (ending just before the `?`) and use it directly as an Importer URL when [creating a Scheduled Importer](/documentation/guides/usage/importing-content/#2-import-content-via-importer). 

## Wrap-up

Congrats 🎉 You now know how to connect Microcks to your Postman Workspace in order to get diret access to the Postman Collection shared with your team!
