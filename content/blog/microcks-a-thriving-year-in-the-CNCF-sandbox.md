---
title: A Thriving year in the CNCF Sandbox and Its Transformative Impacts
date: 2024-06-24
image: "images/blog/microcks-contributors.png"
author: "Diane Mueller"
type: "featured"
description: "A Thriving year in the CNCF Sandbox and Its Transformative Impacts"
draft: false
Params:
  coauthors:
    - "Yacine Kheddache"
---

In the **ever-evolving landscape** of **open-source software**, achieving **recognition** and **support** from **reputable foundations can be a game-changer** for projects. This was precisely the case for [Microcks](https://microcks.io/), an **innovative API mocking and testing project**. When Microcks joined the [CNCF](https://www.cncf.io/) (Cloud Native Computing Foundation) Sandbox a year ago, opportunities opened. In this blog post, we'll delve into Microcks's exciting journey as it embraced its [CNCF Sandbox](https://landscape.cncf.io/?selected=microcks) status and explore the profound positive impacts the project experienced in its **first year within the foundation**.

<p style="text-align: center;">
{{< image src="images/blog/microcks-contributors.png" alt="Microcks: A Thriving year in the CNCF Sandbox and Its Transformative Impacts">}}
    <em><a href="https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/" target="_blank">KubeCon EU 2024</a> at the Microcks Project Pavilion booth, showcasing core contributors from Red Hat (<a href="https://www.linkedin.com/in/hugoguerrero/" target="_blank">Hugo Guerrero</a>), Google (<a href="https://www.linkedin.com/in/julienbreux/" target="_blank">Julien Breux</a>) and Microcks core maintainers (<a href="https://www.linkedin.com/in/laurentbroudoux/" target="_blank">Laurent Broudoux</a> & <a href="https://www.linkedin.com/in/yacinekheddache/" target="_blank">Yacine Kheddache</a>).</em>
</p>

**Microcks' Integration into the CNCF Sandbox: A Milestone of Success**

Microcks took a **significant step forward** by becoming part of the **CNCF Sandbox**, a space dedicated to nurturing early-stage cloud-native projects. The CNCF, well-known for supporting and promoting cloud-native technologies, provided Microcks with a platform that validated its potential and exposed it to a **vast community of developers**, **enterprises**, and **enthusiasts**. This integration was marked by Microcks' announcement in the blog post titled "[Microcks Joining CNCF Sandbox](https://microcks.io/blog/microcks-joining-cncf-sandbox/)", a testament to our community dedication and ambition.


## The 1-Year Transformation: Positive Impacts on Microcks

**1. Rapid Growth and Adoption**

One of the most visible impacts of Microcks' inclusion in the CNCF Sandbox is its **exponential growth**. This growth is vividly evident in the [ADOPTERS.md](https://github.com/microcks/.github/blob/main/ADOPTERS.md) file on Microcks' GitHub repository. This file is a directory of organizations and projects that have embraced Microcks as part of their development workflow. Over the first year, the **list of adopters expanded significantly**, reflecting **the rising popularity** and **utility of the Microcks project**.

* Public adopters have grown from **1 to 16** in just a year, spanning various verticals and geographies! 🌍🚀😊
* Private adopters (companies who are not yet listed publicly but are in touch with the community) now include **more than 20 organizations**... 🚀🤝😊

>Moving from private to public adopters is a small contribution that makes a big impact. It greatly helps the project gain momentum and credibility. Your support is truly important for our growth! 🌟🙏

As enterprises and developers integrated Microcks into their development lifecycle practices, it became evident that the **CNCF affiliation increased the project's visibility** and **instilled higher trust among our community users**. Being part of the CNCF family inherently brings a sense of credibility and reliability, a factor that likely contributed to Microcks' rapid adoption.

Keep discovering by reading adopters' testimonials:

* [CNAM Partners with Microcks for Automated SOAP Service Mocking](https://microcks.io/blog/cnam-soap-service-mocking/)
* [Extend Microcks with custom libs and code](https://microcks.io/blog/extend-microcks-with-custom-libs/)
* [J.B. Hunt: Mock It till You Make It with Microcks](https://microcks.io/blog/jb-hunt-mock-it-till-you-make-it/)

**2. Embracing the "Shift Left" Paradigm**

Microcks' tenure in the CNCF Sandbox has reinforced the **importance of the "shift left" approach to software development**. The "shift left" [paradigm](https://developer.paypal.com/community/blog/shiftleft-softwareqa/) emphasizes addressing issues as early in the development cycle as possible, reducing the chances of critical problems emerging in later stages. In Microcks’ context, this translates to incorporating API mocking and testing right from the outset of development.

The shift left approach was expertly outlined in the informative article "[Mocking and Contract Testing in Your Inner Loop with Microcks](https://medium.com/itnext/mocking-and-contract-testing-in-your-inner-loop-with-microcks-part-1-easy-environment-setup-dcd0f4355231)". This piece elaborates on how Microcks' inner loop focus empowers developers to mock APIs and run contract tests early in their development cycle. This leads to **swifter identification** and **resolution of issues**, allowing **developers** to **iterate more efficiently** and ultimately **deliver higher-quality** software.

**Metrics for [Testcontainers Microcks’ module](https://testcontainers.com/modules/microcks/) downloads and usage are rapidly increasing**, demonstrating the need and enthusiasm of developers: 🌟

* From 500 downloads in Q4 2023 🚀
* To over **2K downloads in May 2024** 🎉

**The same goes for our popular [Docker Desktop Extension](https://www.docker.com/blog/get-started-with-the-microcks-docker-extension-for-api-mocking-and-testing/)**: listed among the top [extensions every developer must try](https://dzone.com/articles/docker-desktop-extensions-every-developer-must-try) and **installed over 6.4K times**! 🚀🌟😊

⏩ Very easy and straightforward to start with Microcks in **3 mins**, watch: \
[Getting Started with Microcks Docker Desktop Extension](https://youtu.be/E8rjUwznO-Q?si=6R6gwWnp74oNc3XV)

Since day one, the Microcks project has been robust and efficient in managing **all kinds of API use cases** for your outer loop. Based on adopters and community feedback, we now have a lighter and faster version of Microcks named [microcks-uber](https://github.com/microcks/microcks/tree/1.9.x/distro/uber). By packaging our Microcks Java application into a platform-native binary using [GraalVM native](https://www.graalvm.org/latest/reference-manual/native-image/) and [Spring Boot AOT](https://docs.spring.io/spring-boot/docs/current/reference/html/native-image.html) compilation, we've achieved an incredible **startup time of just 300 milliseconds**, consuming very few resources!

We are now the **ultimate tool** to **bridge the gap** between **development on a laptop** and **centralized, highly scalable operations on Kubernetes**. 🚀💻🌐
{{< image src="images/blog/microcks-inner-outer-loop.png" alt="How Microcks fit and unify Inner and Outer Loops for cloud-native Development">}}

See our article regarding: \
“[How Microcks fit and unify Inner and Outer Loops for cloud-native Development](https://www.linkedin.com/pulse/how-microcks-fit-unify-inner-outer-loops-cloud-native-kheddache/)” 💡

**3. Better Together: Eco-System Orientation**

The CNCF Sandbox status brings a **sense of camaraderie** and the opportunity to be part of a **broader ecosystem**. This "better together" **mindset** encourages projects to explore **integrations and collaborations** that enrich the **developer experience**.

Microcks' alignment with the CNCF **ecosystem** is a testament to this ethos. The project isn't just about standalone functionality and fitting into the larger cloud-native landscape. Microcks demonstrates its commitment to creating a **seamless developer experience** within the CNCF ecosystem by promoting compatibility with other **cloud-native technologies**.

Explore our **ecosystem partnerships** by discovering key articles and videos highlighting our **collaborations** with [OpenTelemetry and Grafana Labs](https://microcks.io/blog/observability-for-microcks-at-scale/), [Testcontainers](https://www.youtube.com/watch?v=s0I8ZPOvDKE), [Docker](https://www.docker.com/blog/get-started-with-the-microcks-docker-extension-for-api-mocking-and-testing/), [Backstage](https://microcks.io/blog/backstage-integration-launch/), [Canonical](https://ubuntu.com/blog/microk8s-addon-microcks),[ Red Hat](https://www.linkedin.com/posts/microcks_opensource-community-activity-7163612076710572034-t09-/), [GitLab](https://about.gitlab.com/blog/2023/09/27/microcks-and-gitlab-part-one/), [Solo.io](https://www.linkedin.com/posts/microcks_kubecon-cloudnativecon-cloudnative-activity-7176925670155943937-WE1f/) and more if you [follow us](https://microcks.io/community/) ;-)

## Microcks, by the numbers and key metrics

Microcks maintainers, care about **metrics** and are committed to **continuous improvement**. We're excited to share how we've leveled up our **contributions** and **community engagement** through CNCF metrics. Our diversity of contributors, contributions growth, and GitHub activity have all shown remarkable progress. Dive into the details and explore our journey using the [CNCF DevStats](https://microcks.devstats.cncf.io/), Linux Foundation [Insights](https://insights.lfx.linuxfoundation.org/foundation/cncf/overview/github?project=microcks&routedFrom=Github&bestPractice=false), and some great help from our friends at [Bitergia](https://bitergia.com/), where you can double-check the data or dig deeper into our success story. **Let's celebrate our growth and the power of open-source collaboration!** 🎉

**Worldwide diversity of contributors**, with **notable contributions growth** from **APAC (mainly China)** over the last 12 months: 🌍

{{< image src="images/blog/contribs-geographical-distribution.png" alt="Worldwide diversity of contributors, with notable contributions growth">}}

**More and more contributions** are coming from organizations that **rely on Microcks** and have decided to **participate in project maintenance and evolution** to **secure and invest in their supply chain**. 😊

{{< image src="images/blog/organization-leaderboard-contributors.png" alt="More and more contributions">}}

**Net Newly Attracted Affiliations**: **25 new organizations** with developers **actively participating in the Community**! 🚀

{{< image src="images/blog/microcks-one-year-later-affliations.png" alt="Net Newly Attracted Affiliations">}}

**Git Overview** 🚀 **910 commits** this year vs. **486 commits** last year 📈

{{< image src="images/blog/microcks-910-commits-one-year-later.png" alt="Git Overview">}}

**Attracted New Developers Continue to Rise!** 🌟 The growth has skyrocketed since we joined the CNCF! 😊

{{< image src="images/blog/new-developers-continue-to-rise.png" alt="Attracted New Developers Continue to Rise">}}

## Conclusion

Microcks' **journey within the CNCF Sandbox** has been nothing short of **transformative**. From achieving **remarkable growth** and **adoption** to embracing the **shift left approach** and contributing to a **better-together ecosystem**, the project's trajectory has been infused with energy, innovation, and a collaborative spirit. This one-year period highlighted the inherent advantages of being part of a foundation that champions cloud-native technologies and encourages projects to reach new heights.

As the open-source community continues to evolve, success stories like Microcks remind us of the immense value that foundation affiliations can bring. By fostering an environment of support, collaboration, and growth, foundations like the CNCF provide projects with the tools they need to make a lasting impact on the world of software development. With its remarkable journey thus far, **Microcks is a shining example of how a project's affiliation with the proper foundation can propel it to new heights of success and innovation**.

**Stay tuned** as Microcks gears up to **elevate within the CNCF**! We're excited to announce our plans to submit and launch the qualification process to **become an incubating project** in the foundation during our second year! 👀


