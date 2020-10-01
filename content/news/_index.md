---
title: "News about Microcks"
layout: tweets-columns
categories: [releases]
lastmod: 2020-10-01
---

## Fresh Releases

### Microcks core

#### 1.0.0 on 11 Aug 2020

We are very pleased to announce the Microcks release **1.0.0**!

* The major announcement is the support of [AsyncAPI](https://asyncapi.com) for Event-driven APIs,
* A lot of security enhancements including major components versions bump, better Keycloak reuse and container images systematic scanning. 

Check out our [Medium release notes](https://medium.com/microcksio/microcks-1-0-0-release-5a5d0dbaf212)!

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

Check out our [Medium release notes](https://medium.com/microcksio/microcks-0-9-0-release-ae43c9a0061) and stay tuned for more to come around!

[Look at the History for older release notes](./history)

### Microcks extensions

#### microcks-jenkins-plugin 0.3.0 on 18 Sep 2020

The **0.3.0** release mainly brings support for `AsyncAPI` testing feature but also some other enhancements:

* It adds the `ASYNC_API_SCHEMA` option for the `runner` argument of the `test`command,
* It adds the `Secret Name` parameter allowing to reference a Microcks secret holding authentication parameters for the tested endpoint,
* It aligns the configuration on CLI configuration, removing the `Keycloak URL` parameters. Making the config simpler,
* It makes the configuration more robust by taking care od adding an `/api` prefix on Microcks URL if missing,
* It fixes the persistence of some Build Step attributes when using the graphical editor.

Please check [GitHub milestone](https://github.com/microcks/microcks-jenkins-plugin/milestone/1?closed=1) for the list of enhancement and issues.

#### microcks-cli 0.3.0 on 17 Sep 2020

This **0.3.0** release brings support for `AsyncAPI` testing feature:

* It adds the `ASYNC_API_SCHEMA` option for the `runner` argument of the `test`command,
* It adds the `--secretName` feature flag for the `test` command allowing to reference a Microcks secret holding authentication parameters for the tested endpoint,
* Container image for `microcks-cli` is now hosted on [here](https://quay.io/repository/microcks/microcks-cli?tab=tags) Quay.io

Have a look at [GitHub milestone](https://github.com/microcks/microcks-cli/milestone/2?closed=1) for the list of enhancement and issues.

#### microcks-cli 0.2.0 on 14 Aug 2019

This **0.2.0** release simplify CLI usage by removing unecessary `keycloakURL` parameter and add support for:

* Operation headers override,
* HTTPS with unsecure mode or custom certificates,
* Verbose flag for debugging.

Please check [GitHub milestone](https://github.com/microcks/microcks-cli/milestone/1?closed=1) for the list of enhancement and issues.