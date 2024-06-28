---
draft: false
title: Microcks 1.8.0 release 🚀
date: 2023-10-17
image: "images/blog/microcks-1.8.0-feature.png"
author: "Laurent Broudoux"
type: "regular"
description: "Microcks 1.8.0 release 🚀"
draft: false
---

As the seasons transition, we are excited to unveil the `1.8.0` release of Microcks, the [CNCF](https://landscape.cncf.io/?selected=microcks)'s open-source cloud-native tool for API Mocking and Testing, right on the cusp of winter! ❄️ 🚀

With **47** resolved issues and **5** external PR **(from new contributors)** - This new release brings you a wave of new features, including **AI Copilot**, support for **HAR artifacts**, **OAuth2** secured endpoint testing, Microcks super light **Uber image**, **Testcontainers** official module, two developer-friendly buttons for easy interactions (`Copy as curl command` and `Add to your CI/CD`), and an enhanced contextual help.

{{< image src="images/blog/microcks-1.8.0-feature.png" alt="microcks-feature" zoomable="true" >}}

Without further ado, let's review the latest updates for each of our key highlights.


## Open to the community!

This new `1.8.0` release is the first one since the project [entered the Cloud Native Computing Foundation](https://microcks.io/blog/microcks-joining-cncf-sandbox/) just before the Summer. As a new Sandbox project, we’ve gone through our onboarding process and worked hard to set the bar high regarding Open Source & Community best practices! As a result, this release of Microcks is the first where the trademark and source code copyright entirely belong to the CNCF.

This trademark update makes the contributions and governance guarantees transparent and aligned with the world's best practices. Yet another strong confirmation of the Microcks community to drive this fantastic project the open source way! In addition, we introduced with this release:

* Open Source Security Foundation best practice assessment: see [our current assessment](https://www.bestpractices.dev/en/projects/7513),
* Open Quality metrics with Sonar Cloud: see [our current status](https://github.com/microcks/microcks#sonarcloud-quality-metrics),
* Open Contribution guidelines: see [our guideline](https://github.com/microcks/.github/blob/main/CONTRIBUTING.md),
* An explicit Security policy: see [our policy](https://github.com/microcks/.github/blob/main/SECURITY.md),
* Our Community Code of Conduct: see [our code](https://github.com/microcks/.github/blob/main/CODE_OF_CONDUCT.md).

We’re looking forward to growing our vibrant community as a radically transparent, diverse, inclusive and harassment-free space for collaborating on the future of cloud-native API testing! ☁️


## Open to streamlined usages!

This `1.8.0` release also brings its batch of functional improvements to ease your life working in this multi-protocol API ecosystem. Because working with API can happen in a number of situations, workflows and in a rich ecosystem of solutions, we worked hard to have Microcks being relevant and easier to use in those situations.


### Introducing AI Copilot

Adding samples to an existing OpenAPI specification or Postman Collection - so that Microcks can handle mocks for you - can sometimes be tedious or boring. Microcks now make life easier, integrating generative AI for this! Simply tap the "AI Copilot" button, and we'll promptly produce compliant and contextually relevant samples for REST, GraphQL, and AsyncAPI!

<div style="display: flex; justify-content: center;">
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">🚨 Exciting <a href="https://twitter.com/hashtag/AI?src=hash&amp;ref_src=twsrc%5Etfw">#AI</a> features are coming to Microcks! 🧠<br><br>Watch our early prototype in action! See how to boost your <a href="https://twitter.com/hashtag/API?src=hash&amp;ref_src=twsrc%5Etfw">#API</a> development lifecycle with our AI Copilot on API <a href="https://twitter.com/hashtag/mocking?src=hash&amp;ref_src=twsrc%5Etfw">#mocking</a> and <a href="https://twitter.com/hashtag/testing?src=hash&amp;ref_src=twsrc%5Etfw">#testing</a> workflows! <a href="https://t.co/Zeoc07qaBB">pic.twitter.com/Zeoc07qaBB</a></p>&mdash; Microcks (@microcksio) <a href="https://twitter.com/microcksio/status/1676584280728715267?ref_src=twsrc%5Etfw">July 5, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

> This feature leverages [OpenAI](https://platform.openai.com/docs/api-reference/introduction) GPT models API underhood as a first implementation. We designed it to be adaptable and ready for other AI engines in the future. Check [this issue](https://github.com/microcks/microcks/issues/872) for more information.


### Support for HAR artifacts

We heard many people capture live traffic to re-inject this data into their OpenAPI or Postman Collection files and reuse them as mock definitions. During this process, they curate the recording list and have to develop/automate the transformation of their captured data to other formats. We want to ease their pain and propose a more straightforward way using [HTTP Archive Format (HAR)](https://w3c.github.io/web-performance/specs/HAR/Overview.html).

Lots of proxy tooling already use this format as an export format (mitmproxy, Chromium-based browsers, Postman, Insomnia, Proxyman, Fiddler, Gatling, Selenium, GitLab HAR recorder, etc.), so it is easy to integrate with most existing recording solutions.

That way, we think we’ve got Linux philosophy as it’s best, supporting the following flow:

1. Let specialized tooling do the capture/recording and exporting of traffic using HAR format.
2. Optionally curate the recorded content to remove noise and inappropriate data
3. Integrate the resulting HAR into Microcks to reuse the captures as mock sources.

> Using HAR in Microcks as a primary or secondary artifact is pretty straightforward. You only have to add a specific comment to your file to tell Microcks the name and version of the API it relates to. Check [our documentation](https://microcks.io/documentation/references/artifacts/har-conventions/). 


### Test OAuth2 secured endpoints

Testing a secured API endpoint can be tedious as it often involves retrieving and managing an access token for the target endpoint. Luckily, if you secure your API endpoint using OAuth2, Microcks can now handle this burden!

We’ve introduced the support of OAuth2 [Client Credentials Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-credentials-flow), [Refresh Token Rotation](https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation) and [Resource Owner Password Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/resource-owner-password-flow) so that you have to provide your OAuth client information to Microcks, and it will handle the authorization flow for you - taking care of transmitting the retrieved token to your API or services under test.

> This feature is now enabled via the Microcks UI, API, command line tool `microcks-cli`, and the different CI/CD integration. Check [our documentation](https://microcks.io/documentation/references/test-endpoints/#oauth2).


### User experience enhancements

A simple button can bring considerable usability improvement! We scratched our heads and delivered four noticeable enhancements to Microcks’ UI:

* We now have a “Copy as curl command” button to ease playing with mocks,
* We added an “Add to your CI/CD” button that generates the code to paste into your CI/CD pipeline. It works for GitHub Actions, GitLab CI, Jenkins pipelines, Tekton pipelines and our own CLI,
* We added contextual help when launching a new test from the Microcks UI. It’s now way easier to figure out the correct syntax for AsyncAPI or to set the suitable security options,
* We augmented and curated the online “Help Box” which displays help on the most common features.

> See those features in action in the screenshots below. Click on screenshots to access the whole image and get details.

<div class="swiper single-slider">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      {{< image src="images/blog/microcks-1.8.0-copy-curl.png" >}}
    </div>
    <div class="swiper-slide">
      {{< image src="images/blog/microcks-1.8.0-add-to-ci.png" >}}
    </div>
    <div class="swiper-slide">
      {{< image src="images/blog/microcks-1.8.0-test-help.png" >}}
    </div>
    <div class="swiper-slide">
      {{< image src="images/blog/microcks-1.8.0-help-modal.png" >}}
    </div>
  </div>
  <div class="swiper-pagination"></div>
</div>

## Open to Shift-Left eXperiences!

We've been looking at integrating Microcks into [Inner Loop of Shift-Left scenarios](https://www.linkedin.com/pulse/how-microcks-fit-unify-inner-outer-loops-cloud-native-kheddache) for a long time. Fast bootstrap time and very light weight are critical to achieve this and provide a smooth developer’s experience. Unfortunately, we were not able to do that with previous versions of Microcks. 


### Welcome Uber image

Things have changed this Summer, and we’re pleased to announce a new dedicated container image called `microcks-uber`! `microcks-uber` can be considered a stripped-down distribution of Microcks, following the same lifecycle but providing the essential services in a single container. How to run `microcks-uber`? It is as simple as running this command line:

```sh
docker run -p 8585:8080 -it quay.io/microcks/microcks-uber:1.8.0
```

Putting together this new container image has also brought a lot of enhancement to regular Microcks container images. We have some wonderful achievements out there: 

* We decreased the size of the image by **30MB** (that's close to **12%**)
* We reduced the number of CVEs by **18** (that's close to **35%**)
* The startup time of the container is now **2.2 sec** instead of 2.7 sec on my machine (that's close to **20%**)
* The memory consumption has also decreased as we're loading way fewer classes in Heap and Metaspace

> As the Uber distribution of Microcks is perfectly well-adapted for a quick evaluation, we don’t recommend running it in production! It doesn’t embed the authorization/authentication features provided by Keycloak and the performance guarantees offered by an external MongoDB instance. The original purpose of this Uber distribution is for use with testing libraries like  [Testcontainers](https://testcontainers.com/). 


### Welcome Testcontainers 🧊

A direct illustration of the benefits of `microcks-uber` is its usage from the trendy [Testcontainers](https://testcontainers.com/) library! Microcks now provides official modules for [Testcontainers](https://testcontainers.com/) via a partnership with [AtomicJar](https://atomicjar.com/), the company behind this fantastic library! You can find information on the official module on [Testcontainers Microcks page](https://testcontainers.com/modules/microcks/).

How does it feel to use Microcks from Testcontainers? Well, it is pretty straightforward! From your unit tests, you have to start a `MicrocksContainer, and you have a ready-to-use ephemeral instance of Microcks for mocking your dependencies or contract-testing your API:


```js
const microcks = await new MicrocksContainer().start();
```

As of today, we provide support for the following languages:

* Java ☕️ - See our [GitHub repository](https://github.com/microcks/microcks-testcontainers-java) - See our demo application for [Spring Boot](https://github.com/microcks/api-lifecycle/blob/master/shift-left-demo/spring-boot-order-service/README.md) 🍃 and for [Quarkus](https://github.com/microcks/api-lifecycle/blob/master/shift-left-demo/quarkus-order-service/README.md).
* NodeJS - See our [GitHub repository](https://github.com/microcks/microcks-testcontainers-node)
* Go is coming soon, and we will be happy to have community contributions for Python and other libraries 😎 You want to become a Microcks maintainer? Just join us on GitHub 🙌


## Open to contributions!

Community contributions are essential to us and do not come only from feature requests, bug issues, and open discussions. What a pleasure to see people relaying our messages, integrating Microcks in a demonstration, inviting us to events, or even talking about Microcks!

We’d like to thank the following awesome people:



* [Josh Long](https://twitter.com/starbuxman) 🙏 for this fantastic [Coffee + Software Livestream](https://www.youtube.com/live/4ObZu9Gh9Xk?feature=shared&t=435) we’ve recorded together at Devoxx Belgium; and a big shout out to [Sebi](https://twitter.com/sebi2706) 🙏 for connecting people! 
* [Mathieu Amblard](https://www.linkedin.com/in/mathieu-amblard/) 🙏 for its contribution to our [Testcontainers Java module](https://github.com/microcks/microcks-testcontainers-java/issues/18) regarding a JSON serialization issue,
* [Apoorva Srinivas](https://www.linkedin.com/in/appadoo-apoorva-srinivas-481367207) 🙏 for its fix of [Absolute URL location override](https://github.com/microcks/microcks/pull/938) issue,
* [Erik Pragt](https://www.linkedin.com/in/erikpragt/) 🙏 for [Replacing JavaFaker with fresher DataFaker](https://github.com/microcks/microcks/pull/940) contribution. It’s great to keep updated libraries!
* [Ritesh Shergill](https://www.linkedin.com/in/ritesh-shergill-a86a5115/) 🙏 for his excellent article [Mock API Testing with Microcks: Rock your API world with Real world tests](https://medium.com/@riteshshergill/mock-api-testing-with-microcks-rock-your-api-world-with-real-world-tests-af8b5df2ea6a), proposing a walkthrough on Microcks,
* And a special shout out to [Ludovic Pourrat](https://www.linkedin.com/in/ludovic-pourrat/) 🙏 for its ApiDays London on [Why API Metrics matter in APIOps?](https://www.apidays.global/london/) Ludovic explains how Lombard Odier injects production performance metrics into Microcks to better simulate API real-life behavior. He also explains how our Conformance metrics become one of their lead indicators or API health! 💪


## What’s coming next?

As usual, we will eagerly to prioritize items according to community feedback.You can check and collaborate via our list of [issues on GitHub](https://github.com/microcks/microcks/issues) and the project [roadmap](https://github.com/orgs/microcks/projects/1)

Remember that we are an open community, which means you, too, can jump on board to make Microcks even greater! Come and say hi! on our [GitHub discussion](https://github.com/microcks/microcks/discussions) or [Discord chat](https://microcks.io/discord-invite/) 🐙, send some love through [GitHub stars](https://github.com/microcks/microcks) ⭐️ or follow us on [Twitter](https://twitter.com/microcksio), [Mastodon](https://hachyderm.io/@microcksio@mastodon.social), [LinkedIn](https://www.linkedin.com/company/microcks/) and our [YouTube channel](https://www.youtube.com/c/Microcks)!

Thanks for reading and supporting us! ❤️
