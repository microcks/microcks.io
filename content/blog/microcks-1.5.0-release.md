---
title: Microcks 1.5.0 release 🚀
date: 2022-01-18
image: "images/blog/microcks-1.5.0-feature.png"
author: "Laurent Broudoux"
type: "regular"
description: "Microcks 1.5.0 release 🚀"
draft: false
---

We are excited to announce the 1.5.0 release of Microcks - the Open source Kubernetes-native tool for API Mocking and Testing. Just three months have passed after the previous iteration, and our supporters in the community helped us push up a new release with significant features once again. Thanks a lot to all of them 👏

In line with [our mantra](https://microcks.io/blog/why-microcks/), this release is the evidence of our vision of a unique tool with a consistent approach for speeding up the delivery and governing the lifecycle of **ALL kinds of APIs**. As a result, in Microcks `1.5.0`, we now support [GraphQL](https://graphql.org) API technology.

Adding GraphQL allows Microcks to complete the picture and become the only and ultimate tool that supports all the different **standards** of APIs: REST, SOAP, gRPC, Graph, and Events based on various **protocols**. Moreover, we integrate with de-facto standards for API **Dev Tooling** and **CI/CD** pipelines - offering integration whatever your delivery process or tooling! 

{{< image src="images/blog/microcks-1.5.0-feature.png" alt="image" zoomable="true" >}}

We also love ❤️ and value the community, and we try to serve it by listening and implementing feedback and enhancement ideas. This new release carries a lot of them regarding better lightweight and faster bootstrap experience of Microcks for different use-cases.

Let’s review what’s new on each one of our key highlights.

## GraphQL support

Various reports on API, like [Postman’s State of the API Report](https://www.postman.com/state-of-api/) in 2021, spotted GraphQL as one of the most exciting technologies to consider for APIs. GraphQL is an open-source data query language that is an excellent complement to REST APIs when it comes to offering flexibility to clients that can fetch exactly the data they need.

At Microcks, we identified the importance of GraphQL and are sure it’s a perfect fit for Microcks model and features 😉.  It is also another opportunity to demonstrate one of the beauties of the great “[Multi-artifacts support](https://microcks.io/blog/microcks-1.3.0-release/#endless-possibilities-with-multi-artifacts-support)” feature we introduced back in Microcks `1.3.0`. It allows us to unlock virtually any new protocols integration spotlessly and smoothly 💥

We are big supporters of the **[contract-first approach](https://microcks.io/blog/why-microcks/)** and rely on it. You will first need a GraphQL Schema - expressed using the [Schema Definition Language](https://graphql.org/learn/schema/) - to import the operations’ definition of your API into Microcks. Because the schema doesn’t support the notion of examples - contrary to [OpenAPI](https://www.openapis.org/) and [AsyncAPI](https://asyncapi.com) specifications - you will need to rely on a [Postman Collection](https://www.postman.com/collection/) that holds your mock dataset as examples.

{{< image src="images/blog/microcks-1.5.0-graphql-artifacts.png" alt="image" zoomable="true" >}}

> Check out our [GraphQL usage for Microcks](https://microcks.io/documentation/references/artifacts/graphql-conventions/) documentation that illustrates how GraphQL Schema specifications and Postman Collection can be combined and used together. You’ll see that defining mocks and tests are as easy as describing requests and responses expectations using JSON. Microcks will implement all the specificities of GraphQL fetching undercover.

> If you are a hands-on person and need a more detailed walkthrough of available features, we recommend you also read our “[GraphQL features in Microcks: what to expect?](https://microcks.io/blog/graphql-features-what-to-expect/)” blog post. It illustrates the mocking and testing specificities we introduced to support GraphQL queries semantics. 

## Better and lightweight developer experience

One significant advantage of Microcks is its versatility. Of course, it can be installed as an “always up-and-running” central instance shared with different teams, but we also notice many other different uses throughout the community feedback. People use it on their development laptops, as ephemeral instances popped by the CI/CD pipelines or other “Mock as a Service” automations. Unfortunately for these use cases, the deployment of Microcks - especially with the [asynchronous features turned on](https://microcks.io/blog/async-features-with-docker-compose/) - gets a bit greedy with resources.

For this reason, we decided to enhance things up and make the deployment of Microcks a breeze on developers’ laptops and constrained environments concerned by bootstrap time or resource consumption. Let’s see what we got with the previous `1.4.1` version of Microcks:

```sh
$ docker-compose -f docker-compose.yml -f docker-compose-async-addon.yml up -d
[...]

$ docker stats --format "table {{.Container}}\t{{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
CONTAINER      NAME                       CPU %     MEM USAGE / LIMIT
3687d032ecad   microcks-async-minion      1.82%     266.2MiB / 6.789GiB
5ab9aaf5bed2   microcks                   0.67%     325.1MiB / 6.789GiB
45e11517bac7   microcks-kafka             3.67%     404.1MiB / 6.789GiB
cc5a005ea7ff   microcks-sso               4.31%     698.9MiB / 6.789GiB
75dc0105b97d   microcks-db                0.95%     137.1MiB / 6.789GiB
7f5da24afe45   microcks-zookeeper         0.53%     104.4MiB / 6.789GiB
2b9b5479d734   microcks-postman-runtime   0.00%     41.52MiB / 6.789GiB
```

All the popped-up containers (7!) were using a total of `1975 MiB` of memory. On our two-year-old MacBook Pro machine, the bootstrap time was about `40 seconds` to access the UI and `45 seconds` to have a first mock message published on a Kafka topic.

We identified two potential enhancements to make this experience leaner. First, we made the infrastructure lighter by removing Keycloak in _developer mode_, where users typically want administrative privileges. Then, we made the async components lighter by replacing the [Strimzi Kafka](https://strimzi.io) cluster with a [Red Panda](https://vectorized.io/redpanda) broker that provides Kafka-compatible interfaces. 

Let now see the results using the new 1.5.0 `docker-compose-devmode.yml` file:

```sh
$ docker-compose -f docker-compose-devmode.yml up -d
[...]

$ docker stats --format "table {{.Container}}\t{{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
CONTAINER      NAME                       CPU %     MEM USAGE / LIMIT
832548c518d3   microcks-async-minion      2.06%     243.2MiB / 6.789GiB
6641782436b5   microcks                   0.52%     311.8MiB / 6.789GiB
2a95a07f1de8   microcks-postman-runtime   0.00%     38.16MiB / 6.789GiB
f99c91ff63f5   microcks-kafka             24.74%    136.1MiB / 6.789GiB
5dee5cea1a6c   microcks-db                0.78%     132.8MiB / 6.789GiB
```

We now pop only five containers using a total of `860 MiB` of memory. On the same MacBook Pro machine, the bootstrap time is now about `12 seconds` to access the UI and `15 seconds` to have a first mock message published on a Kafka topic.

> Wow! We saved around `1 GiB` memory - more than `50%` less - and reduced the startup time by three on the same machine! Not too bad 😉 Of course, we’re open to any further enhancements in the future, and we hope this better experience will open up the doors to many new use-cases!

## More enhancements

### Faster startup on Kubernetes

With the latest version of Microcks, people experienced issues starting the main [pod](https://kubernetes.io/docs/concepts/workloads/pods/) on Kubernetes in constrained environments. The container could take a long time booting up and cause Kubernetes to kill and restart the container many times. Depending on your cluster default resources allocation, it can take some time to have a healthy Microcks pod.

We investigated those issues with the community and identified enhancement topics:

* The first ones were about the JVM ergonomics that haven’t been updated with the upgrade to Java 11. With new settings, the JVM is now fully aware that it runs in a container and in Kubernetes so that it can accurately auto-tune the various `-X` startup flags,
* The second one was defining a dedicated `startupProbe` in our Kubernetes manifest to avoid pod restarts on bootstrap without penalizing failure detections when the pod has started.

> These enhancements have been applied to both our [Helm Chart](https://microcks.io/documentation/references/configuration/helm-chart-config/) and [Operator](https://microcks.io/documentation/references/configuration/operator-config/) manifests. We noticed a speed-up of `30%` of the bootstrap time when we applied the enhanced version on our test clusters using the default resources constraints. The new probe avoids unintentional restarts in very constrained environments and, hence, Kubernetes scheduler saturation. We planned to publish a detailed blog post on our findings and results, so stay tuned 😉

### Security updates

Security is undoubtedly one of our primary concerns as we know organizations use Microcks in enterprise contexts. The first task on this topic was to ensure the Log4Shell CVEs do not impact Microcks. Microcks is not using log4j directly, but we wanted to ensure that any other transitive dependencies do not include and activate it. So we ran different test suites for the Log4Shell vulnerabilities and made sure it was a no-subject for us.

This release also brings a lot of enhancements:

* We updated the Jackson Library to the newest release eliminating several CVEs. See issue [#53](https://github.com/microcks/microcks/issues/535)
* We updated the Spring Boot framework to the latest `2.6` release with numerous dependency upgrades. See issue [#536](https://github.com/microcks/microcks/issues/536),
* We updated base container images to remove any known vulnerabilities at the date. See issues [#517](https://github.com/microcks/microcks/issues/517) and [#518](https://github.com/microcks/microcks/issues/518). You can also check our security scanning reports on [Quay.io](https://quay.io/organization/microcks) 😇

### Performance tweaks

As part of our investigations on Kubernetes startup time and frameworks upgrades, we also had an extensive work session checking the performance of Microcks. Moreover, community users report using Microcks to mock dependencies in performance testing scenarios. So they don’t want to point it out as a bottleneck!

> Thanks to [Miguel Chico Espin](https://www.linkedin.com/in/miguel-%C3%A1ngel-chico-esp%C3%ADn-aab31b57/) 🙏 for helping us with performance figures. You can follow our discussion on issue [#540](https://github.com/microcks/microcks/issues/540). Miguel also suggested he was able to disable some analytics for better throughput. That’s what we did in [#541](https://github.com/microcks/microcks/issues/541). Finally, as performance tweaking without observability is like going blind, we added [Prometheus](https://prometheus.io) metrics export to our components. See issue [#411](https://github.com/microcks/microcks/issues/411).

## Community

Community contributions are essential to us and do not come only from feature requests, bug issues, and open discussions. What a pleasure to see people relaying our messages, integrating Microcks in a demonstration, inviting us to events, or even talking about Microcks!

We’d like to thank the following awesome people:

* [john873950](https://github.com/john873950) 🙏 that contributed enhancements to our Helm Chart allowing us to add annotations or change Service type,
* [Madiha Rehman](https://www.linkedin.com/in/madihar/) 🙏 that found bugs regarding artifacts upload size and the use of special characters (see [#525](https://github.com/microcks/microcks/issues/525)) in mock URLs (see [#529](https://github.com/microcks/microcks/issues/529)),
* [AsyncAPI Conf](https://conference.asyncapi.com/) 🙏 team for inviting us to talk at their latest event about AsyncAPI (of course!), [CloudEvents](https://cloudevents.io), and Microcks. The recording is available on [YouTube](https://www.youtube.com/watch?v=3EeMHhbwyOQ&t=19925s).

## What’s coming next?

As usual, we will be eager to prioritize items accordingly to community feedback: you can check and collaborate via our list of [issues on GitHub](https://github.com/microcks/microcks/issues). 

Remember that we are an open community, and it means that you too can jump on board to make Microcks even greater! Come and say hi! on our [Discord chat](https://microcks.io/discord-invite/) 🐙, simply send some love through [GitHub stars](https://github.com/microcks/microcks) ⭐️ or follow us on [Twitter](https://twitter.com/microcksio) and [LinkedIn](https://www.linkedin.com/company/microcks/).

Thanks for reading and supporting us! May the beginning of 2022 keep you safe and healthy. ❤️  
