---
title: Microcks 1.11.1 release 🚀
date: 2025-03-10
image: "images/blog/microcks-1.11.1-feature.png"
author: "Laurent Broudoux"
type: "regular"
description: "Microcks 1.11.1 release 🚀"
draft: false
---

Less than two months after the previous release, we are thrilled to announce this brand-new Microcks version! Please welcome the `1.11.1` release of Microcks, the [CNCF](https://landscape.cncf.io/?selected=microcks)'s open source cloud native tool for API Mocking and Testing, 🙌

As we benefit from an upgraded technical stack with the previous release, this `1.11.1` allowed us to focus on usage and performance optimizations. It received no less than **22 new resolved issues** that concentrate on three different areas:

* The  streamlining of our **AI Copilot features** to allow using it at Scale,
* The tuning of the **Uber distribution container images** to achieve un-precedent startup times that will bring developers joy when used with [Testcontainers](https://microcks.io/documentation/guides/usage/developing-testcontainers/),
* The optimization of our **CI/CD pipeline** to reduce build time, energy consumption, and feedback loop for contributors.

{{< image src="images/blog/microcks-1.11.1-feature.png" alt="microcks-feature" >}}

Kudos to our community 👏, and let’s dive in without further ado.


## AI Copilot at Scale!

AI Copilot is present in Microcks for a few releases but it was more of an an experiment. We’ve worked a lot on making things more robust, enhancing the LLM prompts and response analysis (see issue [#1507](https://github.com/microcks/microcks/issues/1507)) and we now streamline its usage.

We focused on the following user story that is now a breeze with Microcks: 

* As a user, load a raw spec in Microcks (it could be OpenAPI, AsyncAPI, gRPC, or GraphQL): no mocks are available.
* Hit the **AI Copilot** button and Microcks will generate realistic samples for all the operations and response codes. This is done asynchronously and enhances your API definition with ready-to-use mocks!
* Filter and export those samples: as an [APIExamples](https://microcks.io/documentation/references/examples/) artifact or as an [OpenAPI Overlay](https://spec.openapis.org/overlay/v1.0.0.html) artifact for REST APIs,
* Share this artifact with your teammates, partners, or customers,
* Allow them to build rich sandboxes with Microcks and reuse samples for API-drift testing!

Better than a long speech, we recorded a video to demonstrate this:

{{< youtube id="1VtcGGu8Ib0" autoplay="false" >}}

> This feature will lower the entry bar and bring tremendous acceleration in the adoption of mocking! We’re looking forward to hearing from you on this! BTW, it’s also the first time we recorded such a demonstration, let us know if you like it and want more! 🙏

## Faster Uber distribution startup 

The Uber container images received two important optimizations with this `1.11.1` release.

The most significant one is for the **Uber Async Minion** container image which is in charge of asynchronous features support in Microcks. We now distribute a new flavor of this image which uses [GraalVM native compilation](https://www.graalvm.org/latest/reference-manual/native-image/). Just append `-native` to the image name and see the enhancements:

* From 1.4 sec to 140 ms startup time: **10x startup boost!** 
* From 217 MB to 136 MB: a **35% reduction in image size!**

<div align="center">
<blockquote class="bluesky-embed" data-bluesky-uri="at://did:plc:7wu3yjlwkk74od55bj6jxspd/app.bsky.feed.post/3lht7w2e7x22w" data-bluesky-cid="bafyreihc6i5drrpikofscd7uq3vqjqrmg2zhrqnsdig62i7zrygtthjxuq"><p lang="">🚅 @quarkus.io + @graalvm.org are magic 🎩  We applied native compilation to @microcks.io #Async component and got a 10x startup boost! 🔥 

From 1.4 sec down to 140 ms! Just append `-native` to the image name. It&#x27;s gonna be awesome with #testcontainers 🧊<br><br><a href="https://bsky.app/profile/did:plc:7wu3yjlwkk74od55bj6jxspd/post/3lht7w2e7x22w?ref_src=embed">[image or embed]</a></p>&mdash; Laurent Broudoux (<a href="https://bsky.app/profile/did:plc:7wu3yjlwkk74od55bj6jxspd?ref_src=embed">@lbroudoux.bsky.social</a>) <a href="https://bsky.app/profile/did:plc:7wu3yjlwkk74od55bj6jxspd/post/3lht7w2e7x22w?ref_src=embed">February 10, 2025 at 2:13 PM</a></blockquote><script async src="https://embed.bsky.app/static/embed.js" charset="utf-8"></script>
</div>

The main **Uber** container image also improves the startup time by enabling the [Ahead Of Time compilation](https://docs.spring.io/spring-framework/reference/core/aot.html) of the underlying Spring Application. While the image size remains the same, we measured a startup time reduction of roughly **10%—from 2.5 sec to 2.1 sec**.

> These optimizations bring dramatic enhancements to the developer’s experience when using Microcks on your laptop - typically with [Testcontainers](https://microcks.io/documentation/guides/usage/developing-testcontainers/). Remember that the **Uber** container image already comes with the `-native` flavor and very low startup time (~ 300ms), but people who needed [Microcks full features](https://microcks.io/documentation/references/container-images/#microcks-uber) will also be covered with this enhancements on JVM-based flavor.


## Optimized CI/CD pipeline

Even if the CI/CD pipeline optimizations are not directly visible from the end-users point of view, this is a crucial topic that ensures that Microcks contributors can deliver new features faster and with better confidence! 

Those optimizations were executed in two steps. The first one focused on reducing the global build time by optimizing the GitHub runners used in the workflow. We previously used `amd64` only runners and Docker’s[ QEMU](https://www.qemu.org/) emulation support when building `arm64` container images. We had a very long build time and a workflow that was far from optimized on the energy consumption level. 🪫

Thanks to[ GitHub's new Arm64 runners](https://github.blog/news-insights/product-news/arm64-on-github-actions-powering-faster-more-efficient-build-systems/), we have been able to remove this emulation layer and reduce the build time **from 1h15 to less than 27 minutes!** 🔋

{{< image src="images/blog/microcks-1.11.1-arm64-runner.png" alt="Arm64 runner benefits" >}}

The second optimization step targeted the contributor’s workflow. We suffered from inappropriate error reports because some steps of the workflow were triggered even if it was not possible or necessary to execute them.

Contributors now have more precise contribution feedback—no more expected errors—and faster—in **less than 7 minutes!**

{{< image src="images/blog/microcks-1.11.1-ci-optimizations.png" alt="CI pipeline optimizations" >}}

> This topic was also the opportunity to receive the 1st contribution of [Meet Soni](https://github.com/inosmeet) 🙏 one of [Microcks LFX Mentorship program mentees](https://www.linkedin.com/posts/microcks_opensource-activity-7302340683829268480-t1Ye?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAIPBbsBvINQZpsEFVoO75QoZ5wnJTDeh98) 😉


## What’s coming next?

As announced a few weeks ago, Microcks is starting an exciting new phase of its growth by welcoming 7 mentees for the next 3 months in the [LFX Mentorship program](https://www.linkedin.com/posts/microcks_opensource-activity-7302340683829268480-t1Ye?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAIPBbsBvINQZpsEFVoO75QoZ5wnJTDeh98)! Expect a boost on topics like the CLI, the testing workflows, the [Microcks Hub](https://hub.microcks.io), or the documentation!

We will eagerly prioritize items according to community feedback. You can check and collaborate via our list of [issues on GitHub](https://github.com/microcks/microcks/issues) and the project [roadmap](https://github.com/orgs/microcks/projects/1). Please join us to shape the future!

Remember that we are an open community, which means you, too, can jump on board to make Microcks even greater! Come and say hi! on our [GitHub discussion](https://github.com/microcks/microcks/discussions) or [Discord chat](https://microcks.io/discord-invite/) 👻, send some love through [GitHub stars](https://github.com/microcks/microcks) ⭐️ or follow us on [BlueSky](https://bsky.app/profile/microcks.io), [Twitter](https://twitter.com/microcksio), [Mastodon](https://hachyderm.io/@microcksio@mastodon.social), [LinkedIn](https://www.linkedin.com/company/microcks/), and our [YouTube channel](https://www.youtube.com/c/Microcks)!

Thanks for reading and supporting us! ❤️
