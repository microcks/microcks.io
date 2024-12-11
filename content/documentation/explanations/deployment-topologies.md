---
draft: false
title: "Deployment topologies"
date: 2024-05-16
publishdate: 2024-12-10
lastmod: 2024-12-10
weight: 1
---

## Introduction

We often get the question from people who are adopting Microcks on the deployment toplogy: **Where to deploy it and which personas to target?** Microcks is modular and flexible, and it runs in many different ways, and having many options can make it unclear to novice users where to begin and how to get started.

In this article we share our experience on different tolopologies - or patterns - we've seen adopted depending on organization maturity and priorities. Even if those patterns are presented in an ordered way, there's no rule of thumb and you may choose to go the other way around if it makes sense.

> 💡 There may be some other topologies we have missed here.<br/>
> Please share them with the community if they help you be successful!

## 1. Global centralized instance

The first deployment topology that people often start with is the one of the *Globaly shared, centralized instance*. In this topology, Microcks is deployed on a centralized infrastructure and can be accessed by many different teams. It allows discovering and sharing the same API mocks, sourced by one or many Git repositories. It can also be used to run tests on deployed API endpoints.

<div align="center">
{{< figure src="images/documentation/deployment-topologies-global.png" width="60%" >}}
</div>

In such a topology, Microcks is always up-and-running and should be dimensioned to host and important number of users and APIs, with secured access, RBAC and segregation features turned on. As datasets and response times are instance-scoped settings, they cannot be customized for different use-cases.

#### Benefits
✅ Easy to start with - just one deployment!<br/>
✅ Acts immediately as a natural catalog for all teams API<br/>
✅ Centralizes both mocks and tests with multi-versions and history<br/>

#### Concerns
🤔 Security and RBAC configuration<br/>
🤔 Needs proper dimensioning<br/>
🤔 Too many APIs? Maybe the private ones are not "that important"...<br/>
❌ Different mock datasets for different use-cases<br/>
❌ Different API response times for different use-cases<br/><br/>

## 2. Local instances

As a developer, you may want to use Microcks directly on your laptop during your development iterations and within your unit tests with the help of [Testcontainers](https://testcontainers.com). Running it directly in your IDE is also possible via [DevContainers](https://containers.dev). This eases the pain in managing dependencies and gives you fast feedback.

<div align="center">
{{< figure src="images/documentation/deployment-topologies-local.png" width="50%" >}}
</div>

In such a topology, Microcks instances are considered *"Ephemeral"* and thus don't keep history. They can be configured with custom datasets but with the risk of drifting. Frequent synchronization needs to happen to avoid this.

#### Benefits
✅ Directly run in IDE or unit tests!<br/>
✅ Super fast iterations thanks to Shift-left<br/>
✅ Only the API you're working on or the ones you need<br/>
✅ Project specific configuration: datasets, response times<br/>

#### Concerns
🤔 No history!<br/>
🤔 How to measure improvements?<br/>
🤔 How to be sure non-regression tests are also included?<br/>
🤔 Needs frequent sync to avoid drifts<br/>
❌ Limited connection to central infrastructure (eg: some message brokers)<br/><br/>

## 3. Process-scoped instances

As an intermediate solution, we see more and more adopters deploying Microcks for scoped use-cased in an *"Ephemeral"* way. The goal is to provide a temporary environment with mocked dependencies for: development teams, performance testing campaign, Quality Assurance needs, training, partner onboarding,.. This approach can also be coined **Sandbox-as-a-service**: a way to provide testing environments on demand. It is typically integrated, orchestrated and controlled by workflows such as long-running CI/CD pipeline or provisioning processes.

<div align="center">
{{< figure src="images/documentation/deployment-topologies-process.png" width="80%" >}}
</div>

Those instances are considered *"Ephemeral"* or temporary, but it could be: minutes, days or even months. They allow fine-grained configuration and customization as they're dedicated to one single use case or project/team. Depending on the use-case, you may pay great attention to management automation and what's where Microcks [Kubernetes Operator](https://github.com/microcks/microcks-operator) can make sense in a [GitOps](https://www.redhat.com/topics/devops/what-is-gitops) approach.

#### Benefits
✅ "Ephemeral": saves money vs comprehensive environments<br/>
✅ Only the API you need (eg. your dependencies)<br/>
✅ Project specific configuration: datasets, response times<br/>
✅ Project specific access control<br/>

#### Concerns
🤔 No history!<br/>
🤔 No global or consolidated vision<br/>
🤔 Automation of the provisioning process<br/><br/>

## 4. Regional instances

Final pattern to take in consideration, is the one of *Regional and scoped instances*. This one can be used from start in the case of a scoped-test adoption of Microcks: it presents more or less the same characteristices of the *Globaly shared, centralized instance* but you decide to restrict it to a specific scope in your organization. It could be for a functional domain, for an application, or whatever makes sense in a governance point-of-view. A regional instance will hold all the API mocks and tests - for both public and private APIs - and will be the reference to measure quality, improvements and to source some other catalogs.

<div align="center">
{{< figure src="images/documentation/deployment-topologies-regional.png" width="80%" >}}
</div>

As this pattern can be used in standalone mode, we think it's best to consider those instances as contributors to a consolidated vision of the available APIs. Hence, you will eventually have to consider some promotion or release process.

#### Benefits
✅ All the APIs of the region/division: public & private<br/>
✅ All the history on what has changed, what has been tested<br/>
✅ Ideal for building a comprehensive catalog of the region<br/>
✅ Easy to manage Role based access control and delegation<br/>

#### Concerns
🤔 Only the APIs of the region: makes global discovery hard<br/>
❌ Different mock datasets for different use-cases<br/>
❌ Different API response times for different use-cases<br/><br/>

## Microcks at scale

Do you have to choose between one and the other topologies? Yes, you definitely have to define priorities to ensure a smooth and incremental adoption. But, ultimately, all of those topologies can play nicely together to handle different situations and stages of your Software Development Life-Cycle.

We see users with great maturity confirming [How Microcks fit and unify Inner and Outer Loops for cloud-native development](https://www.linkedin.com/pulse/how-microcks-fit-unify-inner-outer-loops-cloud-native-kheddache/). They deploy it using many topologies in order to have the **same tool using the same sources-of-truth** throughout the whole lifecyle. That's what we call: *Microcks at scale*! 🚀

The schema below represents our vision on how those deployment topologies can be combined to serve the [different personas](/documentation/overview/what-is-microcks/).

<div align="center">
{{< figure src="images/documentation/deployment-topologies-all-together.png" width="100%" >}}
</div>

From left to right:
* It all starts with *Local Instances* integrated into **Developers** Inner Loop flow. It eases their life in external dependencies management and provides them immediate feedback using contract-testing right in their unit tests,
* Then, *Regional Instances* may be fed with the promoted API artifacts coming for design iterations. API artifacts contribute to the comprehensive catalog of this BU/domain/application. **API Owners** can use those instances to launch contract-tests on deployed API endpoints and track quality metrics and improvements over time,
* Temporary *Process-scoped Instances* can be easily provisioned, on-demand, using the regional instances as natural references catalogs. They allow applying different settings (access-control, datasets, response time,...) depending on the projet or use-case needs. **Platform Engineers** can fully automate this provisionning, in a reproducible way, saving costs vs maintaining comprehensive environments,
* Finally, *Globaly shared, centralized instance* can serves as the consolidated catalog of the public APIs in the organization, offering access to the corresponding mocks to enhance discoverability and tracking of promoted APIs. **Enterprise Architects** and **API consumers** will find it useful as the centralized source-of-truth for all the organization APIs.