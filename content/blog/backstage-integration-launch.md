---
title: Microcks' Backstage integration to centralize all your APIs in a software catalog 🧩
date: 2023-05-12
image: "images/blog/backstage-integration-feature.png"
author: "Laurent Broudoux"
type: "regular"
description: "Microcks' Backstage integration to centralize all your APIs in a software catalog 🧩"
draft: false
---

Identifying and managing software assets has always been a challenge! It became more and more difficult these years with the blast of multi-cloud deployments and practices like microservices. Fortunately, [Backstage](https://backstage.io/) comes to the rescue and tends to become a standard for developer portals. Today, we are excited to announce an **integration between Microcks and Backstage** to ease the management of API related assets.

{{< image src="images/blog/backstage-integration-feature.png" alt="image" zoomable="true" >}}

Contributed to the [CNCF](https://www.cncf.io/) by Spotify, Backstage is, according to their website: 
> _“an open platform for building developer portals. Powered by a centralized software catalog, Backstage restores order to your microservices and infrastructure and enables your product teams to ship high-quality code quickly — without compromising autonomy.”_

We find Microcks and Backstage to be very **aligned on the goals to provide a uniform approach**, embracing the diversity of technical stacks and infrastructures to create a streamlined end-to-end experience and empower developers. As Microcks specializes in  all kinds of API, Backstage really provides a global framework for all kinds of software assets  so both fit very well in terms of strategy.


## What exactly is the Microcks plugin for Backstage?

At the very core of Backstage is the [software catalog](https://backstage.io/docs/features/software-catalog/) that keeps track of ownership and metadata for all the software pieces in your ecosystem (services, website, libraries, databases, …). This catalog manages the lifecycle of entities describing those pieces. The most obvious type of entity we can find there is the [`Component`](https://backstage.io/docs/features/software-catalog/system-model#component); but it also brings the [`API`](https://backstage.io/docs/features/software-catalog/system-model#api) entity type that can be used to gather metadata about [OpenAPI](https://spec.openapis.org/), [AsyncAPI](https://asyncapi.com) or [gRPC](https://grpc.io).

In Backstage, an `API` is somewhat very minimalistic and needs a specific metadata descriptor to be ingested and managed. That’s where Microcks can help you by providing comprehensive information about your API to Backstage and avoiding the burden of maintaining an extra file! Microcks and Backstage share this focus on the API contract for conveying API documentation. We already have all this metadata at hand in Microcks in the artifacts we’re using, no need to duplicate it!

Hence, the Microcks plugin for Backstage is in charge of connecting to one or many Microcks instances, discovering APIs and synchronizing them into the Backstage catalog. The capture below illustrates how APIs from Microcks are synchronized into Backstage.

{{< image src="images/blog/backstage-interation-discovery-and-import.png" alt="Discovery and import of APIs" zoomable="true" >}}

Metadata on an API is very lightweight in Backstage. As it turns out to be used as a developer portal, some additional information may be of interest! Basic information like specification contracts and organizational classifiers are obviously synchronized but we also add useful links so that developers can easily access the mock sandbox of the API as well as its conformance test results. 

{{< image src="images/blog/backstage-interation-api-properties-mapping.png" alt="API properties mapping" zoomable="true" >}}

This is the first release and integration: a Discovery oriented plugin, but Backstage offers many more capabilities. [Let us know](https://github.com/microcks/microcks-backstage-provider/issues) what you’d like to see in the future!


## How do I set up the Microcks plugin for Backstage?

Nothing is easier! Well, sort of… 😉 First, you can find the Microcks plugin in the list of [available plugins](https://backstage.io/plugins) on the Backstage website as shown below:

{{< image src="images/blog/backstage-integration-plugins.png" alt="Backstage plugins" zoomable="true" >}}

Then you can visit our [GitHub repository](https://github.com/microcks/microcks-backstage-provider) to get access to full documentation and setup instructions. For those of you who already played with Backstage plugins, you’ll see that we stick with standards.

Add the `microcks-backstage-provider` plugin to your Backstage application with this command:

```sh
yarn add --cwd packages/backend @microcks/microcks-backstage-provider@^0.0.2
```

Then, simply edit your `app-config.yml` file to declare one or more Microcks named providers with their synchronization configuration. See this sample below for a provider named `dev` :

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
          # supports cron, ISO duration, "human duration" as used in code
          frequency: { minutes: 2 }
          # supports ISO duration, "human duration" as used in code
          timeout: { minutes: 1 }
```

You finally have to add the main `MicrocksApiEntityProvider` class to the list of available entity providers in your application and that’s it! 🎉


## Join us and contribute to the Microcks community

As stated above, this is our first integration and we’re excited about the possibilities ahead to create top-notch API developer portals. [Let us know](https://github.com/microcks/microcks-backstage-provider/issues) what you’d like to see in the future!

Keep in mind that we are an open community, so you are welcome to join us in making Microcks even better! Come introduce yourself in our [Github discussion](https://github.com/microcks/microcks/discussions) or [Discord chat](https://microcks.io/discord-invite/) 🐙, show your support by giving us [GitHub stars](https://github.com/microcks/microcks) ⭐️ or follow us on [Twitter](https://twitter.com/microcksio), [Mastodon](https://mastodon.social/@microcksio), [LinkedIn](https://www.linkedin.com/company/microcks/), and our [YouTube channel](https://www.youtube.com/c/Microcks)!

Thank you for reading and for your support!
