---
draft: false
title: "Conformance testing"
date: 2020-12-15
publishdate: 2020-12-15
lastmod: 2025-03-11
weight: 9
---

## Introduction

You may have experienced the frustration of deploying to production, only to discover that an API or service you integrate with has broken its contract. How can we effectively ensure this does not happen?

As introduced in [Main Concepts](/documentation/overview/main-concepts), Microcks can be used for **Contract conformance testing** of API or services under development. You spend a lot of time describing request/response pairs and matching rules: it would be a shame not to use this sample as test cases once development is underway!

On the internet, you can find many different representations of how the different testing techniques relate to one another and should ideally be combined into a robust testing pipeline. At Microcks, we particularly like the Watermelon representation below. Microcks enables you to automate **Automated API Tests** and focus specifically on **Contract conformance testing**.

<br/>
<div align="center">
  <img alt="Ideal Software Testing Pyrami" src="https://miro.medium.com/max/1400/0*f2vFclaitRRo1w2i.jpg" style="max-width: 70%; border-color: #dddddd; border-style: solid !important"/>
</div>
<br/>

The purpose of Microcks tests is precisely to check that the **Interaction Contract** - as represented by an OpenAPI or AsyncAPI specification, a Postman collection or whatever [supported Artifact](/documentation/references/artifacts) - consumer and producer agreed upon is actually respected by the API provider. In other words, to check that an implementation of the API is conformant to its contract.

> 💡 If you want to learn more about this topic and get into the details on **how Microcks is different from other contract-testing or conformance testing solutions**, we've got you covered! We recommend having a read of this two articles: [Microcks and Pact for API contract testing](https://medium.com/@lbroudoux/microcks-and-pact-for-api-contract-testing-3e0e7d4516ca) and [Different levels of API contract testing with Microcks](https://medium.com/@lbroudoux/different-levels-of-api-contract-testing-with-microcks-ccc0847f8c97) 

## Conformance metrics

In order to help you get confidence in your implementations, we developed the **Conformance index** and **Conformance score** metrics that you can see on the top right of each API | Service details page:

<br/>
{{< image src="images/documentation/test-conformance.png" alt="image" zoomable="true" >}}
<br/>

The **Conformance index** is a kind of grade that estimates how your API contract is actually covered by the samples you've attached to it. We compute this index based on the number of samples you've got for each operation, the complexity of the dispatching rules of these operations and so on... It represents the maximum possible conformance score you may achieve if all your tests are successful.

The **Conformance score** is the current score computed during your last test execution. We also added a trend computation to show whether things are going better or worse compared to your history of tests on this API.

Once you have activated [labels filtering](/documentation/guides/administration/organizing-repository/#1-applying-labels) on your repository and have run a few tests, Microcks is also able to give you an aggregated view of your API patrimony in terms of **Conformance Risks**. The tree map below is displayed on the *Dashboard* page and represents risks in terms of average score per group of APIs (depending on the concept you chose, it could be per domain, per application, per team, ...)

<div align="center">
<br/>
{{< figure src="images/documentation/test-conformance-risks.png" alt="image" zoomable="true" width="90%" >}}
<br/>
</div>

This visualization allows you to have a clear understanding of your conformance risks at first glance!

## Tests history and details
/mocks/#mocks-info
The test history for an API/Service is easily accessible from the API | Service [summary page](/documentation/tutorials/getting-started/#viewing-an-api). Microcks keeps a history of all the launched tests on an API/Service version. Successes and failures are kept in a database with a unique identifier and test number to allow you to compare cases of success and failure.

{{< image src="images/documentation/test-history.png" alt="image" zoomable="true" >}}

Specific test details can be visualized: Microcks also records the request and response pairs exchanged with the tested endpoint so that you'll be able to access payload content as well as headers. Failures are tracked, and violated assertions messages are displayed as shown in the screenshot below :

{{< image src="images/documentation/test-details.png" alt="image" zoomable="true" >}}
