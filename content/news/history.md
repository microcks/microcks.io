---
title: "Historical Microcks release notes"
layout: tweets-columns
categories: [releases]
---

## Older Releases

### Microcks core

#### 1.1.0 on 10 Nov 2020

We are thrilled to announce the Microcks release **1.1.0**! Here are below the major points of this release:

* The support of [Apache Kafka](https://kafka.apache.org) for testing Event-driven APIs through [AsyncAPI](https://asyncapi.com) schema validation,
* Some OpenAPI and SOAP mocking enhancements regarding tricky edge cases,
* A [Getting Started with Tests](https://microcks.io/documentation/getting-started-tests/) quick start guide,
* The move from [Gitter](https://gitter.im/microcks/microcks) chat rooms in favor of [Zulip](https://microcksio.zulipchat.com/) for community discussions and support.

Check out our [release notes](https://microcks.io/blog/microcks-1.1.0-release/)!

You can also check [GitHub milestone](https://github.com/microcks/microcks/milestone/11?closed=1) for the full list of closed issues.

#### 1.0.0 on 11 Aug 2020

We are very pleased to announce the Microcks release **1.0.0**!

* The major announcement is the support of [AsyncAPI](https://asyncapi.com) for Event-driven APIs,
* A lot of security enhancements including major components versions bump, better Keycloak reuse and container images systematic scanning.

Check out our [release notes](https://microcks.io/blog/microcks-1.0.0-release/)!

You can also check [GitHub milestone](https://github.com/microcks/microcks/milestone/10?closed=1) for the full list of closed issues.

#### 0.9.2 on 19 May 2020

Version **0.9.2** is a minor bug-fix release embedding a fix for a regression that occurs since **0.9.0** release - and fix was expressly needed by one of our community members ;-)

[Issue #220](https://github.com/microcks/microcks/issues/220) make it possible again to retrieve APIs or WebServices contracts using Microcks API. Please check [details](https://github.com/microcks/microcks/issues/220).

#### 0.9.1 on 5 May 2020

Version **0.9.1** is a minor bug-fix release for some features included into **0.9.0**. More specifically, it fixes:

* The evaluation of request params for dynamic mock response generation,
* The conservation of overriden properties during successive imports,
* Some JavaScript errors in the UI that may slowdown on large services repository.

Please check [GitHub milestone](https://github.com/microcks/microcks/milestone/9?closed=1) for the list of enhancement and issues.

#### 0.9.0 on 20 Apr 2020

We are delighted to announce the Microcks release **0.9.0** that introduces a tremendous amount of enhancements and new features.

Big thanks to our growing community for all the work done, the raised issues and the collected feedback during the last 5 months to make it possible.

Among the many novelties, it embeds: 

* Easier installation experience with availability on Helm Hub and OperatorHub.io,
* Better security with TLS everywhere and Red Hat Universal Base Images,
* Richer management and content organization features,
* Dynamic mocking support,
* Testing integration using #tekton pipelines.

Check out our [release notes](https://microcks.io/blog/microcks-0.9.0-release/) and stay tuned for more to come around!
#### 0.8.0 on 27 Nov 2019

We just release version **0.8.0** of Microcks core! This release holds something like **40** issues fix!

Among some other stuffs, we now have:

* Support for media type negociation on REST mocks,
* Support of CORS policy for REST mocks,
* Support of `PATCH` and `OPTIONS` operations on REST mocks,
* Multi-format support for OpenAPI v3 examples,
* Addition of users management from the Microcks UI,
* Addition of custom JSON body dispatcher,
* Many UI improvements like embedded help, about modal and easier importer creation flow,
* Fix of HTTPS with custom certificates support for accessing private repositories.

Please check [GitHub milestone](https://github.com/microcks/microcks/milestone/6?closed=1) for the list of enhancement and issues.