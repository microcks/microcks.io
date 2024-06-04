---
title: CNAM Partners with Microcks for Automated SOAP Service Mocking
date: 2024-06-03
image: "images/blog/cnam-accelerating-healthcare.png"
author: "Sebastien Fraigneau"
type: "regular"
description: "CNAM Partners with Microcks for Automated SOAP Service Mocking"
draft: false
---

With over 2,500 employees, the Caisse Nationale de l’Assurance Maladie [CNAM](https://www.assurance-maladie.ameli.fr/) is the operational "headquarters" of France's compulsory health insurance system. We play a pivotal role in ensuring access to **healthcare for all French citizens**, overseeing and funding health insurance coverage for employees and their families. 

{{< image src="images/blog/cnam-accelerating-healthcare.png" alt="image cnam accelerating healthcare">}}

Additionally, we coordinate with and assist the local organizations within our network, which consists of **164 entities deployed nationally**, regionally, and locally throughout France. We rely on [SOAP](https://nordicapis.com/apis-101-what-is-soap-simple-object-access-protocol/) (Simple Object Access Protocol) for our historical and mission-critical legacy systems to facilitate seamless information exchange among these organizations.

<p>
    {{< image src="images/blog/reseau-cnam.jpg" alt="image reseau cnam">}}
</p>
<p style="text-align: center;">
    <em>Source (🇫🇷): <a href="https://www.assurance-maladie.ameli.fr/qui-sommes-nous/organisation/reseau-proximite" target="_blank">https://www.assurance-maladie.ameli.fr/qui-sommes-nous/organisation/reseau-proximite</a></em>
</p>

At CNAM, we manage **hundreds of services** that process a significant data flow daily, with each potentially relying on others. In our development and testing phases, we depend on **thousands of simulations** representing different versions of each service. Throughout all project phases, multiple individuals or groups utilize these simulations, contributing to our extensive use of datasets. This poses **challenges** in maintaining and accelerating testing, validation, interoperability, and conformance at scale.


## APIs and web services at CNAM

With a diverse ecosystem of healthcare organizations and systems, **interoperability is critical** to ensuring that data can be exchanged and understood across different platforms. APIs provide standardized interfaces that allow disparate systems to communicate and share data effectively and securely, regardless of the underlying technology stack.

By exposing functionalities through APIs, CNAM can **automate** various processes and workflows, increasing efficiency and reducing manual effort. This **automation streamlines** administrative tasks, reduces errors, and frees up resources to focus on more critical aspects of healthcare delivery.

CNAM relies on **SOAP** for its legacy systems, which are **mission-critical** for its operations. APIs and web services enable the integration of these legacy systems with modern applications and technologies, ensuring that CNAM can **leverage its existing infrastructure while embracing innovation**.

As CNAM's network continues to evolve and grow, APIs provide **scalability** and **flexibility** to adapt to changing requirements and accommodate new technologies and services. This agility allows CNAM to **respond quickly to emerging healthcare challenges and opportunities**.


## Benefits of the Solution

CNAM previously used a homemade mocking solution, which was statically built and required consumers to provide business examples and behavior. This approach consumes many infrastructure resources and generates drift, disparities, and non-reusable assets between organizations within the ecosystem.

> During our research for an API mocking and testing solution, we discovered Microcks and immediately embraced its open-source, community-driven, and very innovative approach to managing all kinds of APIs using the same facilities, including SOAP, which is mandatory for our systems.

> We also realized the power and advantages of moving from a consumer to a provider-driven approach. We recognized many of our pains of being 100% consumer-driven for all our business datasets and examples in [the article from Laurent Broudoux](https://medium.com/@lbroudoux/microcks-and-pact-for-api-contract-testing-3e0e7d4516ca). It has completely changed our mindset and the way we are now using mocking and sandboxes in our development lifecycle.

At CNAM, we have chosen **Microcks to accelerate and automate** the simulation (mocking) of our _**450 SOAP services and more than 100 Oracle Tuxedo processing and transaction systems exposed via SOAP**_. Our usage of Microcks replaces the existing internal solution and offers several benefits tailored to our needs.

1. **Accelerated and Automated Simulation**: Microcks **accelerates** and **automates** the simulation (mocking) of CNAM's extensive suite services and data processing systems. This streamlines our internal processes and reduces manual effort, leading to faster development cycles.

2. **Reuse of Existing Datasets**: By leveraging Microcks, we can **reuse existing datasets**, eliminating the need to recreate mocks for each service. This not only saves time but also ensures **consistency** across different testing scenarios.

3. **Fully Automated Sandboxes as a Service**: Microcks empowers us to provide fully **automated sandboxes** to all consumers, **accelerating** development and testing workflows.

4. **Self-Service Mock Generation**: With Microcks, we enable **self-service** mock generation for API consumers, **empowering developers** to iterate quickly and test their applications effectively.

<p>
    {{< image src="images/blog/cnam-mock-admin-web-app.png" alt="image cnam mock admin web app">}}
</p>
<p style="text-align: center;">
    <em>CNAM Mock admin web application workflow.</em>
</p>

> Using the Mock Admin application based on Microcks has significantly streamlined our testing processes. Its intuitive interface and flexibility allowed us to create customized mocks to simulate complex and mission-critical scenarios, crucial for our automated tests with the [INS and SNGI](https://gnius.esante.gouv.fr/en/regulations/regulation-profiles/french-national-ehealth-id-ins) databases. Microcks has demonstrated exceptional reliability and performance, enhancing the quality of our tests and allowing us to detect anomalies early in our development and validation process.
>\
\
> *Laurent Fontaine*, **Application Owner** at *CNAM*

The datasets imported in Microcks are formatted as CSV files, containing various information such as letters, words, phrases, numbers, tables, or regular expressions (regex).

<p>
    {{< image src="images/blog/csv-formatted-cnam-dataset.png" alt="image csv formatted cnam dataset">}}
</p>
<p style="text-align: center;">
    <em>CSV-formatted CNAM dataset and Microcks dynamic custom dispatch.</em>
</p>

This structure demonstrates that the first column acts as a discriminator value, the last column specifies the response name, and the remaining columns inject mock data into the response context.

Overall, Microcks' **self-service** and **on-demand** capabilities enable us to **speed up** complex development and validation processes, ensuring efficient and reliable healthcare services for all stakeholders (including non-technical associates using XLS and CSV files to provide business examples). Additionally, it **reduces infrastructure size and consumption, aligning with our sustainability objectives**.

Finally, we're extensively leveraging Microcks' **extensibility and custom libraries** in the API dispatching process. This has been detailed in a technical blog post titled:\
"[Extend Microcks with custom libs and code](https://microcks.io/blog/extend-microcks-with-custom-libs/)".

> By leveraging existing datasets and libraries, we seamlessly integrate business and functional behavior validation into Microcks mocks, enabling dynamic generation. This not only enhances efficiency and accuracy but also significantly reduces time to market and improves delivery timelines.


## Next objective: test automation

Initially, we primarily used Microcks for mocking services, but now we are working to expand its usage to include comprehensive testing capabilities. This transition will significantly advance our **testing strategy**, allowing us to achieve greater efficiency, reliability, and agility in the CNAM software development lifecycle.

With Microcks' support for **non-regression tests** and **validation**, we can ensure that any changes or updates to our APIs do not introduce regressions or break existing functionality. By automating these tests within our existing **CI/CD pipeline**, we will be able to identify and address issues **early** in the development process, **minimizing the risk** of introducing bugs or defects into production environments.

Automated testing **reduces manual quality assurance effort** and enables **faster feedback loops**, allowing developers to iterate more **quickly** and **confidently** to improve overall development velocity. 

<p>
    {{< image src="images/blog/cnam-automation-tests-pipeline.png" alt="image cnam automation tests pipeline">}}
</p>
<p style="text-align: center;">
    <em>CNAM Mock admin web application to Microcks’ automation tests pipeline.</em>
</p>

This step is essential for our progress, **paving the way for additional opportunities** to enrich our development lifecycle with Microcks now that the solution is in production.


## Contributing to Open-Source

At CNAM, we are vested in **contributing** to the open-source Microcks community upstream for several compelling reasons.

Firstly, in alignment with the French and European governments' open-source directive and its emphasis on **digital sovereignty**, We recognize the **strategic importance** of **investing in** and **actively participating in open-source projects**. By contributing to Microcks, CNAM not only strengthens its own digital sovereignty but also contributes to the broader ecosystem of open-source solutions, which are **essential for the success of our mission and objectives**.

By actively participating in Microcks' development and enhancement, we can contribute to the project's direction, tailor its features and functionalities to suit CNAM's needs better and guarantee the **longevity** and **sustainability of our supply chain**. This ensures that **Microcks** remains a **dependable** and **effective** tool in our software development processes.

Moreover, by participating in an open-source project like Microcks, CNAM employees can enhance their **skills**, collaborate with a diverse **community of developers**, and **contribute to advancing technology** in their field. This can lead to increased job satisfaction, professional growth, and a **sense of pride in contributing to a project that positively impacts both CNAM** and the **broader software development community**.

