---
draft: false
title: "Postman usage for Microcks"
date: 2019-09-01
publishdate: 2019-09-01
lastmod: 2023-02-23
weight: 8
---

## Retrieve Collection workspace API link

Another option available since version `1.7.0` of Microcks is to directly access your Collection defined into a Postman Workspace through its Collection API link. For that, you have to go through the **Share** button and select the **Via API** thumbnail as illustrated in the picture below:

{{< image src="images/postman-share-api-link.png" alt="image" zoomable="true" >}}

You can then copy this URL (ending just before the `?`) and use it directly as an importer URL when [creating your scheduled import](http://localhost:1313/documentation/using/importers/#scheduled-import). Obviously you'll need an API Access Key so that Microcks will be able to authenticate while fetching your Collection. In order to do that, you'll need to generate an API Key from Postman workspace as illustrated below:

{{< image src="images/postman-api-keys.png" alt="image" zoomable="true" >}}

This API Key must then be saved as an authentication [Secret in Microcks](/documentation/administrating/secrets/) so that your importer will be able to reference it and supply it to Postman API using the `X-API-Key` header. Here's below the definition of such a secret in Microcks:

{{< image src="images/postman-api-secret.png" alt="image" zoomable="true" >}}

