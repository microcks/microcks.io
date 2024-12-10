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

> 💡 There maybe some other topologies we miss here - please share them with the community if they help you being sucessful! 

## 1. Global centralized instance

The first deployment topology that people often start with is the one of the *Globally shared, centralized instance*. In this topology, Microcks is deployed on a centralized infrastructure and can be accessed by many different teams. It allows discovering and sharing the same API mocks, sourced by one or many Git repositories. It can also be used to run tests on deployed API endpoints.

<div align="center">
{{< figure src="images/documentation/deployment-topologies-global.png" width="70%" >}}
</div>

In such a topology, Microcks is always up-and-running, should be dimensioned to host and important number of users and APIs, with secured access, RBAC and segregation features turned on.

#### Benefits
✅ Easy to start with - just one deployment!<br/>
✅ Acts immediately as a natural catalog for all teams API<br/>
✅ Centralizes both mocks and tests with multi-versions and history<br/>

#### Concerns
🤔 Security and RBAC configuration<br/>
🤔 Needs proper dimensioning<br/>
🤔 Too many APIs? Maybe the private ones are not "that important"...<br/>
❌ Different mock datasets for different use-cases<br/>
❌ Different API response times for different use-cases<br/>

## 2. Local instances

Bla bla bla

<div align="center">
{{< figure src="images/documentation/deployment-topologies-local.png" width="50%" >}}
</div>

#### Benefits
✅ Directly run in IDE or unit tests!<br/>
✅ Super fast iterations thanks to Shift-left<br/>
✅ Only the API you're working on or the ones you need<br/>
✅ Project specific configuration: datasets, response times<br/>

#### Concerns
🤔 No history!<br/>
🤔 How to measure improvements?<br/>
🤔 How to be sure non-regression tests are also included?<br/>
❌ Limited connection to central infrastructure (eg: some message brokers)<br/>

## 3. Process-scoped instances

Bla bla bla

<div align="center">
{{< figure src="images/documentation/deployment-topologies-process.png" width="80%" >}}
</div>

#### Benefits

#### Concerns

## 4. Regional instances

Bla bla bla

<div align="center">
{{< figure src="images/documentation/deployment-topologies-regional.png" width="80%" >}}
</div>

#### Benefits

#### Concerns

## Microcks at scale

Bla bla bla

<div align="center">
{{< figure src="images/documentation/deployment-topologies-all-together.png" width="100%" >}}
</div>