---
title: Microcks’ hub and marketplace!
date: 2022-05-12
image: "images/blog/microcks-hub-announcement-feature.png"
author: "Laurent Broudoux"
type: "regular"
description: "Microcks’ hub and marketplace!"
draft: false
---

We are very proud to announce the launch of Microcks’ **community hub** and **free marketplace** 👉 **[hub.microcks.io](https://hub.microcks.io/)**! This has been discussed and requested many times within our community and here we are 🙌 

The goal of this new community website is to **collect, curate and share API Mocks & Test suites** for being installed and used within any Microcks instance in a single click.

{{< image src="images/blog/microcks-hub-announcement-feature.png" alt="image" zoomable="true" >}}

> If like us you like craft beers, let’s do the analogy between this announcement 👉 freely sharing API Mocks and Test suites and a brew bar!!! Close to where you live with daily free fresh, juicy, and hoppy craft beers on tap 🤩 This is exactly what Microcks Hub is providing for API development and you can enjoy it without moderation 🎉

Let’s do a review of how it works without delay.

# What is it and why is it important?

[hub.microcks.io](https://hub.microcks.io/) allows API owners aka any companies, developers, standardization organizations, regulatory committees, and product managers to easily distribute their public open API specifications in the form of ready-to-use mocks and test suites for Microcks.

{{< image src="images/blog/microcks-hub-announcement-hub.png" alt="image" zoomable="true" >}}

Microcks users (API consumers here) can directly access [hub.microcks.io](https://hub.microcks.io/) to retrieve these API artifacts. One single click, command line or API call makes them actionable to cover and speedup many useful use-cases:

* Discover and develop with APIs,
* Create sandboxes for your developers,
* Promote your APIs and animate and grow your API consumers community,
* Evaluate the impacts of an API version upgrade without deploying the new version or new product,
* Assess consumer and partners implementation and ensure quality assurance using an API Test and Certification Kit,

Last but not least, as - in our humble opinion - a producer's goal is to make API consumption smooth and easier, you can now dramatically help yourself to keep your promise to your consumer and improve it more responsibly  😇


# Let’s give me a real example


## OpenBanking.org.uk use-case

As an example, you can have a look at the [OpenBanking.org.uk](https://www.openbanking.org.uk/) initiative and API specifications: [https://standards.openbanking.org.uk/](https://standards.openbanking.org.uk/)

{{< image src="images/blog/microcks-hub-announcement-openbanking.png" alt="image" zoomable="true" >}}

We find it being a perfect illustration of  the API Test and Certification use-case. Let’s describe this use case in more detail: As a Bank or Fintech startup, I want to provide a set of APIs that respect the OpenBanking.org.uk standards. 

Of course, I can get the swagger definitions of the standard from the developer portal but how can I assess that my development team has fully understood and implemented the standard correctly, what is my level of compliance?

This is where Microcks and our new [hub.microcks.io](https://hub.microcks.io) come to the rescue! As the OpenBanking.org.uk API owner, I can just reference my [OpenAPI](https://www.openapis.org/) specs and [Postman Collection](https://www.postman.com/collection/) using lightweight metadata so that Microcks users will be able to use it to ensure their implementation is compliant with the standard. 

For Microcks users, it just involves 3 single steps:

1. [Setup](https://microcks.io/documentation/guides/installation/) (if not done already 🥇) a private internal Microcks instance,
2. Browse [hub.microcks.io](https://hub.microcks.io) to discover the API you’re interested in and import the corresponding assets that creates mocks and test suite into your instance,

{{< image src="images/blog/microcks-hub-announcement-oba.png" alt="image" zoomable="true" >}}

{{< image src="images/blog/microcks-hub-announcement-oba-install.png" alt="image" zoomable="true" >}}

3. From Microcks, launch tests on your implementation to check conformance. As the hub wraps different kinds of artifacts, you can validate: contract syntactic rules checking OpenAPI schema conformance,
**OR**
business behavior rules using [Postman Collection](https://microcks.io/documentation/references/artifacts/postman-conventions/) test scripts.

It has neither been as easy to do Open Banking nor to follow the standard and regulatory requirements as using Microcks and the community API Mocks and Test suites 🚀 We love and are happy to support #fintech #startups 😘

## Another use case from HashiCorp

Terraform Enterprise is [HashiCorp](https://www.hashicorp.com/)'s self-hosted distribution of Terraform Cloud. It offers enterprises a private instance of the Terraform Cloud application, with no resource limits and with additional enterprise-grade architectural features like audit logging and SAML single sign-on…

We have been in touch with some companies who are using [Terraform Enterprise](https://www.hashicorp.com/products/terraform) in production and rely on Terraform Enterprise API for their business. The issue is for each new Terraform Enterprise release or upgrade HashiCorp's customers need to install the new version and re-test all their tooling (Terraform Enterprise API consumer tools in this case). This is time-consuming, costly, and not efficient from an automation perspective… 

So we work hand in hand with our friends from HashiCorp to provide full Mocks and Test suites for Microcks and to share it on [hub.microcks.io](https://hub.microcks.io/package/terraform.io/api/terraform-enterprise.2.0):


{{< image src="images/blog/microcks-hub-announcement-terraform.png" alt="image" zoomable="true" >}}

So now, any Terraform Enterprise customers can easily create a sandbox and test all their existing tooling on the latest release or pre-release and modify their consumer code accordingly. Last but not the least, they can integrate Microcks in their [existing CI/CD pipeline](https://microcks.io/documentation/guides/automation/) to fully automate this tedious process 👍

Terraform Enterprise mocks repository is available here: [https://github.com/nehrman/terraform-enterprise](https://github.com/nehrman/terraform-enterprise)

> Kudos [Nicolas Ehrman](https://fr.linkedin.com/in/nicolas-ehrman-629b8910) and the HashiCorp community for this contribution 👏

# How does it work?

Microcks leverages standard specifications and formats like [Swagger](https://microcks.io/documentation/references/artifacts/swagger-conventions/) (aka OpenAPI v2), [OpenAPI v3](https://microcks.io/documentation/references/artifacts/openapi-conventions/), [AsyncAPI](https://microcks.io/documentation/references/artifacts/asyncapi-conventions/), [Postman Collection](https://microcks.io/documentation/references/artifacts/postman-conventions/), [GRPC/Protobuf files](https://microcks.io/documentation/references/artifacts/grpc-conventions/), [GraphQL](https://microcks.io/documentation/references/artifacts/graphql-conventions/), legacy [SoapUI](https://microcks.io/documentation/references/artifacts/soapui-conventions/),... Adding them to the Hub is just a matter of adding some metadata using a manifest.

To define these metadata, we’re introducing two concepts :

* The API Package is the top-level concept that allows you to wrap together a set of related APIs. The package can be related to an Open source project, a commercial product, or an industrial standard and it must belong to a specific business category.

* The API Versions are simply the versioned APIs that are members of the package. The Hub will keep the history of different versions you’ll release through your package. An API Version links to your API artifacts through the property of the contract as illustrated in the schema below.

The [community-mocks repository](https://github.com/microcks/community-mocks) holds initial contributions and examples, as well as the validation materials (JSON schemas) for the metadata contributors have to provide.

{{< image src="images/blog/microcks-hub-ammouncement-mocks.png" alt="image" zoomable="true" >}}

> Please check this document for further details: [https://hub.microcks.io/doc/package-api-mocks](https://hub.microcks.io/doc/package-api-mocks) 

# How to contribute an API package

All the up to date information to contribute and publish your API on the Microcks hub is available here: [https://hub.microcks.io/doc/how-to-contribute](https://hub.microcks.io/doc/how-to-contribute)

> BTW, in case you ask ⁉️ [hub.microcks.io](https://hub.microcks.io/) is not an alternative or competitor of [Postman Public Workspace](https://www.postman.com/postman/workspace/postman-public-workspace/overview). We really like the fact you can discover and play with APIs using Postman Workspaces and many Microcks users are using [Postman Collections](https://microcks.io/documentation/references/artifacts/postman-conventions/). But Enterprises need to develop effective production APIs and this is where Microcks and Postman make perfect sense together 🤝 

The Microcks Hub contribution can be seen as a complementary step that will allow to scale your API usage. It will allow to integrate your API adoption into every possible usage scenario required by your user (on-premises or cloud-based or off-line, on-demand mocking, conformance testing, etc)

# Enthusiastic?

We hope this walkthrough has made you enthusiastic about this new killer feature and API producers and consumers will join the community like [FIWARE](https://www.fiware.org/) Foundation, [OpenBanking.org.uk](https://www.openbanking.org.uk/), [Stet.eu](https://www.stet.eu/), [HashiCorp](https://www.hashicorp.com/), and more to come: stay tuned 📢

Remember that we are an open community, and it means that you too can jump on board to make Microcks even greater! Come and say hi! on our [Github discussion](https://github.com/microcks/microcks/discussions) or [Discord chat](https://microcks.io/discord-invite/) 🐙, simply send some love through [GitHub stars](https://github.com/microcks/microcks) ⭐️ or follow us on [Twitter](https://twitter.com/microcksio), [LinkedIn](https://www.linkedin.com/company/microcks/), and our brand new [YouTube channel](https://www.youtube.com/c/Microcks)!

Thanks for reading and supporting us! 
