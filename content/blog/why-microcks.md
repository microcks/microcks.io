---
draft: false
title: Why Microcks?
layout: post
date: 2020-10-12
publishdate: 2020-10-12
lastmod: 2020-10-12
image: "images/blog/why-microcks.png"
categories: [blog]
author: "Laurent Broudoux"
author_title: "MicrocksIO founder"
author_image: "images/blog/bio/lbroudoux.jpeg"
author_twitter: "lbroudoux"
---

Microcks recently reached a key milestone as we officially announced on Aug 11th 2020 the release of [Microcks 1.0.0](https://medium.com/microcksio/microcks-1-0-0-release-5a5d0dbaf212), being our first General Availability (GA) version. With it we deliver the promise of having *one simple, scalable and consolidating tool for all the Enterprise services mocking and test needs* — whatever the type of services or API.

As we received a lot of supportive feedback since August, we think it is a great opportunity to take some time to come back to the reasons why we started Microcks, especially for the newcomers. Surprisingly enough, we explain a lot why mocking and testing are necessary in today’s cloud-native area - see [Mocking made easy with Microcks](https://www.openshift.com/blog/mocking-microservices-made-easy-microcks) - but not spend that much time on why we were not satisfied with existing solutions.

So here’s a little refresher that will give you insights on why we started Microcks ? We’ll develop this through three main concerns.

![microcks-arise](/images/blog/why-microcks.png)

## #1 Business requirements without translation

One huge problem in software development is the translation mismatch we usually face between business requirements and actual product release - you don’t learn anything new here isn’t it ? Business Lines people usually produce some spec documents that are translated into software packages, API contracts and so on. These one are then put into a Git repository and thrown away to the CI/CD pipelines or staging and release process.
