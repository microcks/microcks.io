---
draft: false
title: Install Microcks on AWS for a test drive 🧪
layout: post
date: 2020-06-26
publishdate: 2020-06-26
lastmod: 2020-06-26
image: "images/blog/microcks-on-aws.png"
categories: [blog]
---

Whilst we recommend installing Microcks on Kubernetes for easy management and enhanced capabilities, it can also be deployed onto a regular Virtual Machine. This post details how you can setup Microcks onto an AWS EC2 instance if you’re familiar with this environment and want a quick test drive. It takes something like 6–7 minutes to complete from end-to-end. It’s an illustration of official setup documentation.

![microcks-on-aws](/images/blog/microcks-on-aws.png)

This will give you a Microcks installation on an AWS EC2 instance running Ubuntu 18.04 LTS :
* all-in-one install : Microcks, Keycloak and MongoDB on the same box,
* local storage mounted through Docker volumes,
* self-signed certificates for rapid testing.