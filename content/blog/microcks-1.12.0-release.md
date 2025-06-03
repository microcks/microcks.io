---
title: Microcks 1.12.0 release 🚀
date: 2025-06-03
image: "images/blog/microcks-1.12.0-feature.png"
author: "Laurent Broudoux"
type: "regular"
description: "Microcks 1.12.0 release 🚀"
draft: false
---

We are thrilled to announce today the `1.12.0` release of Microcks, the [CNCF](https://landscape.cncf.io/?selected=microcks)'s open source cloud native tool for API Mocking and Testing! 🚀

This release received no less than **51 new resolved issues**. Kudos to all the people 👏 who helped along the way by writing code, commenting on issues, or writing posts. You’ll see that this release focuses on two big topics:

* The addition of Model Context Protocol (MCP) as a first-class citizen in Microcks. It allows all **your existing mocks to be available as MCP-enabled endpoints**. 
* A huge refresh of the frontend stack we were using - we made a **giant leap from Angular 8 to Angular 19**.

{{< image src="images/blog/microcks-1.12.0-feature.png" alt="microcks-feature" >}}

Let’s do a review of what’s new on each one of our highlights without delay.


## MCP-enabled mocks for all your APIs!

You know that API and AI are closely related and that tomorrow—and even today—LLMs and AI agents will be among the top consumers of your APIs. It becomes crucial to be able to check how AI Agents will reuse your API as tools!

Starting with version `1.12.0`, **Microcks automatically translates your API mocks into [Model Context Protocol](https://modelcontextprotocol.io/) (or MCP) aware endpoints!** A new MCP Server section in the mock properties gives you access to MCP-compatible endpoints to integrate your mocks with your favorite tool.

{{< image src="images/documentation/mcp-endpoints.png" alt="mcp properties" >}}

As you can see in the capture above, Microcks provides two different kinds of endpoints and transports:

* HTTP SSE Endpoint as defined in the [2024-11-05](https://modelcontextprotocol.io/specification/2024-11-05/basic/transports#http-with-sse) version of the protocol,
* HTTP Streamable Endpoint as defined in the [2025-03-26](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http) version of the protocol.

Depending on the tool you’re using—we tested [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector), [Postman](https://learning.postman.com/docs/postman-ai-agent-builder/overview/), [Claude](https://claude.ai/) or [Cherry Studio](https://www.cherry-ai.com/)—you’ll need one or the other endpoint based on how it supports MCP.

The best thing is that, thanks to Microcks' homogeneous support for all API styles and protocols, **this is available for OpenAPI and GraphQL APIs as well as gRPC services!**

> Check [our documentation](https://microcks.io/documentation/explanations/mcp-endpoints/) with links to [our video demonstrations](https://www.youtube.com/@Microcks/search?query=mcp) and test it while it’s hot! 🔥 We’re looking forward to hearing from you!


## Frontend stack refresh

As introduced in this [GitHub Discussion](https://github.com/orgs/microcks/discussions/1458), we have known that Microcks UI was at risk for many years now. We depended on the [PatternFly](https://www.patternfly.org/) design system's [Angular](https://angular.dev/) library, which was subsequently discontinued by the community in favor of a React Implementation.

This put us in a bad situation because many of pulled transitive dependencies from those foundations are now outdated with a lot of CVEs, as illustrated by the security vulnerabilities report of the frontend part:

{{< image src="images/blog/microcks-1.12.0-cve-before.png" alt="CVE before 1.12" >}}

Having open discussions always brings fresh ideas and new perspectives! And as I was much more attracted by a complete rewrite, at first, I found the feedback of the community appealing: 

* Angular was not that bad and dead and Angular 19 was a very different beast,
* Existing Patternfly Look and Feel experience was still quite good - the only complaint being it was missing a dark theme 🎨,
* Our architecture hypothesis from 2005 (pure SPA architecture, no SSR, no real need for SEO) was confirmed.

As a consequence, we adapted our strategy and **decided to stick with Angular - processing to a major upgrade - and to update and [vendor](https://slaptijack.com/programming/what-is-vendoring.html) the Patternfly library** to be able to control our future usage of it!

This leads us to major upgrades and tasks like:

* A Typescript upgrade (from version `3.5` to `5.7`),
* An Angular upgrade (from version `8` to `19`),
* The adoption of the [Vite](https://vite.dev/) build tool,
* The [vendoring](https://slaptijack.com/programming/what-is-vendoring.html) of needed [Patternfly NG](https://github.com/patternfly/patternfly-ng) components,
* Upgrade of very old libraries like `d3` or `c3`,
* The replacement of the wizard component reusing the one from Material Angular Theme (🙏 thanks to [@soGit](https://github.com/soGit) for that), 

Most importantly, **the number of vulnerabilities has dramatically dropped from 103 to 6**, and I'm confident we can even reduce it by vendoring Patternfly CSS (only the NG component has been vendored at the moment). **And this was our driver number 1 in engaging this refactoring!**

What does that mean to all the re-design opportunities and contribution ease we foresee by opening the debate here in this thread? Does it mean we're closing the topics and waiting until the next big maintenance issue to start everything again? Certainly not.

First, we'd be in a better position to welcome incremental enhancements! I think we have a lot on our plates:

* The current UI is too square. Would you like more rounded buttons?
* Are you allergic to light themes, and would you prefer a dark theme?
* Layout and fonts are too "classical" or too much enterprisey?

With the [vendoring process](https://slaptijack.com/programming/what-is-vendoring.html), we would have everything at hand to integrate incremental changes to make it look more modern and sexy to users. Please, use your best designing skills and propose new wireframes or Figma arts so that we can study things and build a look & feel theme that represents and supports the Microcks brand! Consistency is key in this kind of change integration.


## Community amplification 📣

We extend our heartfelt thanks to the community for amplifying Microcks' presence in recent events.

At **KubeCon + CloudNativeCon Europe 2025**, Microcks was featured in two insightful sessions:

* [From 0 to Production-Grade With Kubernetes Native Development](https://youtu.be/07RnkzSc6Jg?si=6Kf8zjDFvuGWzNQP) 🍿 by [Thomas Vitale](https://www.linkedin.com/in/vitalethomas/) and [Kevin Dubois](https://www.linkedin.com/in/kevindubois/) highlights* Microcks' role in enhancing the developer experience with Kubernetes-native Java applications.
* [Platform Engineering Loves Security: Shift Down To Your Platform, Not Left To Your Developers!](https://youtu.be/Es3DBj2UgIE?si=tuh_Ek_so8OcnwUu) 🍿 by [Maxime Coquerel](https://www.linkedin.com/in/maximecoquerel/) & [Mathieu Benoit](https://www.linkedin.com/in/mathieubenoitqc/) emphasized the importance of integrating security and quality assurance into the platform layer, a strategy that aligns with Microcks' approach within the API lifecycle.

Additionally, we were honored to present at the **[Dapr Community Call](https://www.youtube.com/live/pbla9IjikvM?si=2l1_PtmbJEo6Su7A)** 🍿 on May 14th, where we provided a teaser of the integration value between Microcks and Dapr.

Our collaboration culminated in a comprehensive session at **[Spring I/O 2025](https://2025.springio.net/)** 🍃 in Barcelona, where we discussed simplifying cloud native app testing across environments using Microcks and Dapr. Stay tuned for the [recording](https://www.youtube.com/@SpringIOConference).

We are grateful for the community's support and enthusiasm, which continues to drive Microcks' evolution in the cloud native ecosystem.


## What’s coming next?

As we conclude the [LFX Mentorship Program](https://lfx.linuxfoundation.org/tools/mentorship/) Term 1, we extend our heartfelt thanks to all our [mentees](https://www.linkedin.com/posts/microcks_opensource-activity-7302340683829268480-t1Ye?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAIPBbsBvINQZpsEFVoO75QoZ5wnJTDeh98). Your dedication, enthusiasm, and valuable contributions have significantly enriched the Microcks community. We hope this experience has been as rewarding for you as it has been for us.

We will eagerly prioritize items according to community feedback. You can check and collaborate via our list of [issues on GitHub](https://github.com/microcks/microcks/issues) and the project [roadmap](https://github.com/orgs/microcks/projects/1). Please join us to shape the future!

Remember that we are an open community, which means you, too, can jump on board to make Microcks even greater! Come and say hi! on our [GitHub discussion](https://github.com/microcks/microcks/discussions) or [Discord chat](https://microcks.io/discord-invite/) 👻, send some love through [GitHub stars](https://github.com/microcks/microcks) ⭐️ or follow us on [BlueSky](https://bsky.app/profile/microcks.io), [Twitter](https://twitter.com/microcksio), [Mastodon](https://hachyderm.io/@microcksio@mastodon.social), [LinkedIn](https://www.linkedin.com/company/microcks/), and our [YouTube channel](https://www.youtube.com/c/Microcks)!

Thanks for reading and supporting us! ❤️
