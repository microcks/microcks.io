---
title: BNP Paribas' IT Journey with Microcks
date: 2025-05-26
image: "images/blog/bnp-journey-with-microcks-feature.png"
author: "Nadji Berraf"
type: "regular"
description: "BNP Paribas' IT Journey with Microcks"
draft: false
Params:
  coauthors:
    - "Yacine Kheddache"
---

As the world of finance undergoes **rapid digital transformation**, the need for **innovation** that aligns with **sustainable practices** has never been greater. At [BNP Paribas](https://personal-finance.bnpparibas/app/uploads/sites/4/2024/04/20240414_pres_instit_bnppf_externe_en-1.pdf), one of the world's leading banking institutions, we are proud to be at the [forefront](https://group.bnpparibas/en/our-commitments/innovation/open-innovation) of this [movement](https://group.bnpparibas/en/our-commitments/transitions/energy-efficiency).

Our French Retail Banking entity (BCEF) is driving this change, with [Microcks](https://microcks.io/), a Cloud Native Computing Foundation (CNCF) [Sandbox project](https://microcks.io/blog/microcks-a-thriving-year-in-the-cncf-sandbox/), playing an instrumental role.

{{< image src="images/blog/bnp-journey-with-microcks-feature.png" alt="image BNP Paribas' IT Journey with Microcks">}}

In this post, we share our strategic and confident implementation of Microcks to mock internal APIs and **offload mainframe core banking services**. This approach has accelerated our development and validation processes and led to **substantial financial savings** and **sustainability gains**. This post explores how BNP Paribas leads the charge in greening the cloud.

## **Innovating Within a Legacy System**

Like many large financial institutions, BNP Paribas operates in a **complex infrastructure** and highly **regulated environment**, including legacy systems such as mainframes. These mainframes are the backbone of our **core banking services**, processing millions of daily transactions. While our environment is reliable and secure, it presents challenges regarding agility, scalability, and cost-effectiveness in a cloud-first world.

**Nadji Berraf** - Head of Software Expertise Center & Cloud Leader at BNPP:
> Developing and validating new features or services on these mainframes can be time-consuming and resource-intensive. Each test or development cycle consumes significant computational power and storage, fueling costs, and energy consumption.

To address these challenges, we needed a solution that would enable us to **speed up** our development processes while **reducing** the **environmental impact** and **operational costs**.

## **How BNP Paribas Leverages Microcks**

Microcks is an open source project designed to create mock or simulated versions of APIs and microservices. These mocks allow developers to test their code against realistic scenarios without accessing the production backend services. 

**Patrick Jacob** - Chapter Lead Automation Lab (BCEF IT – Center of Excellence for Software & Design Authority):
> As a [CNCF Sandbox project](https://landscape.cncf.io/?selected=microcks), Microcks is cloud native, making it ideal for modern IT infrastructures using Kubernetes that prioritize scalability, flexibility, and environmental sustainability.

<p>
    {{< image src="images/blog/bnp-microcks deployment architecture.png" alt="image BNP Microcks deployment architecture at BNP Paribas">}}
</p>
<p style="text-align: center;">
    <em>Microcks deployment architecture at BNP Paribas.</em>
</p>

Six units have access to Microcks (operational units of the French IT department):

✅ **32 squads** driving innovation

✅ **29 applications** seamlessly integrated

✅ **356 mocks** & **1628 API operations** ensuring reliability

### **1. Offloading Mainframe Core Banking Services**

We use Microcks to **offload traffic from our mainframe** by **mocking the banking services** that are exposed via REST/HTTP APIs.

Previously, our developers and testers had to interact directly with the mainframe to validate API integrations or test new features. This process was slow and placed unnecessary strain on the mainframe.

<p>
    {{< image src="images/blog/bnp-core-banking-mocking-with-microcks.png" alt="image BNP Core Banking API Mocking with Microcks">}}
</p>
<p style="text-align: center;">
    <em>Core Banking API Mocking with Microcks.</em>
</p>

With Microcks, we can **create realistic mocks of our core banking services** and allow our developers to build and test integrations without accessing the mainframe. This approach **speeds up the development process** and **frees up mainframe resource**s.

### **2. Accelerating Development and Validation**

Time-to-market is crucial in the financial industry, where being the first to launch a new feature or service can provide a significant competitive advantage. The traditional development and validation processes, especially those dependent on legacy systems, can be slow.

Microcks enables us to simulate dynamic API endpoints, allowing our developers to test their code against realistic scenarios without waiting for backend services to become available. This parallel development approach **reduces bottlenecks, speeds up the release cycle, **and** thoroughly tests new features before deployment.**

### **3. Performing Heavy Benchmarks with Simulated Latency**

Benchmarking and stress testing are essential to ensure that our systems can handle high loads and unexpected spikes in demand. However, conducting these tests directly on the mainframe can be complex and costly.

Microcks allows us to **simulate production-like** conditions, **including introducing [latency in API responses](https://microcks.io/documentation/guides/usage/delays/)**. Replicating mainframe behavior in a controlled environment ensures robust and reliable applications while **correctly sizing production infrastructure** resources.

### **4. Driving Sustainability with Reduced Energy Consumption**

Sustainability is at the core of BNP Paribas' IT strategy. By offloading API requests from the mainframe and utilizing mocked services, we have **significantly reduced the computational load** on our legacy systems.

This reduction in mainframe usage not only **cuts operational costs** but also significantly **decreases energy consumption**, contributing to a **reduction in carbon footprint** and supporting the organization's sustainability and green IT goals.

## **Overcoming Challenges on the Path to Success**

Implementing new technology within a large, established organization like BNP Paribas is challenging. However, the benefits of adopting Microcks far outweighed any initial hurdles.

<p>
    {{< image src="images/blog/bnp-how-microcks-fits-in-pipelines.png" alt="image BNP How Microcks fits in BNP Paribas CI/CD pipelines">}}
</p>
<p style="text-align: center;">
    <em>How Microcks fits in BNP Paribas CI/CD pipelines.</em>
</p>

### **1. Integrating with Existing Systems**

Although Microcks works seamlessly with modern systems, we needed to carefully plan to ensure compatibility with our highly secure and controlled on-premises private cloud. So, one of our first challenges involved integrating Microcks with our existing infrastructure.

By **collaborating closely with the Microcks community** and leveraging the project's **extensive documentation**, we successfully integrated Microcks into our environment.

### **2. Ensuring Realistic Mocking**

Another challenge was ensuring that the mocked APIs were realistic enough to be helpful. We needed to replicate the behavior of our core banking services accurately, including handling edge cases and unexpected inputs. Microcks' support for **dynamic and stateful mocks proved invaluable**, allowing us to create **highly realistic simulations** that meet our exacting standards.

### **3. Educating the Team**

Adopting a new tool requires buy-in from our development and testing teams. We invested in training and workshops based on [Microcks documentation](https://microcks.io/documentation/) to ensure our teams were comfortable using Microcks and fully understood its benefits. This investment paid off as our **teams quickly recognized the advantages of mocked services** over dedicated platforms for every test.

## **Realized Benefits: Financial Savings and Sustainability Gains**

Adopting Microcks has brought several tangible benefits to BNP Paribas.

### **1. Significant Cost Savings**

We have **substantially saved costs by reducing our reliance on mainframe systems** for development and testing. Mainframe operations are expensive, and by offloading a significant portion of this workload to Microcks, we have **considerably reduced our operational costs**.

### **2. Accelerated Development Cycles**

Microcks has enabled us to **accelerate and helped cut our development and testing cycles by two-thirds**. This agility and the **ability to deploy mock sandboxes everywhere,** ready to use, have allowed us to quickly bring new features to market, providing us with a **competitive edge in the fast-paced financial industry**.

### **3. Enhanced Sustainability**

One of the most significant benefits of adopting Microcks is **reducing energy consumption**. By minimizing the use of mainframe resources, we have **significantly reduced our carbon footprint**, directly contributing to our **sustainability goals**. This reduction supports our broader corporate environmental responsibility strategy and **reinforces BNP Paribas’s position as a leader in sustainable IT practices**.

By early 2025, **32 squads** had onboarded, with 10 squads relying on Microcks daily. Over **500 developers and testers** actively optimized APIs using the platform.

**Proven at scale** with real-world usage:

✅ Over **2.5 million API calls** per week

## **Conclusion: A Success Story in Sustainable IT**

BNP Paribas' journey with Microcks is a **testament to the power of innovative technology** in driving **business success and sustainability**. By leveraging Microcks to mock internal APIs, offload mainframe services, and simulate production-like conditions, we have **accelerated** our development processes and achieved **significant financial savings** and **sustainability gains**.

As a Cloud Native Computing Foundation project, Microcks continues to play a pivotal role in our IT strategy, helping us meet our goals of agility, cost-efficiency, and environmental responsibility. This initiative demonstrates how the **financial industry can embrace cloud native technologies** to achieve a greener, more **sustainable future**.

Our experience with Microcks offers valuable insights and inspiration for organizations looking to balance innovation with sustainability. By adopting similar strategies, businesses can reduce their environmental impact while enhancing their competitive edge in the digital age.

Microcks is more than just a tool; it is a **key enabler of BNP Paribas' sustainable IT journey**, a journey that others in the financial world can learn from and follow!
