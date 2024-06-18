---
draft: false
title: "Using in Jenkins Pipeline"
date: 2021-02-19
publishdate: 2021-02-19
lastmod: 2024-06-10
weight: 6
---

## Overview

This guide illustrates how you can integrate the Microcks Jenkins plugin keep Microcks in-sync withe your API specifications and integrate tests stages within your [Jenkins CI/CD pipelines](https://www.jenkins.io/doc/book/pipeline/). This plugin allows your Jenkins builds and jobs to import API [Artifacts](/documentation/references/artifacts/) into a Microcks instance and to launch new Tests. It uses [Service Account](/documentation/explanations/service-account) and so it's definitely worth the read 😉

The Microcks Jenkins plugin has its [own GitHub repository](https://github.com/microcks/microcks-jenkins-plugin) and its own lifecycle. 

## 1. Download the Jenkins plugin

Microcks Jenkins plugin is available and can be downloaded from [Central Maven repository](https://repo.maven.apache.org/maven2/io/github/microcks/microcks-jenkins-plugin/). Just get the [HPI file](https://repo.maven.apache.org/maven2/io/github/microcks/microcks-jenkins-plugin/0.5.0/microcks-jenkins-plugin-0.5.0.hpi) and install it on your Jenkins master [your preferred way](https://jenkins.io/doc/book/managing/plugins/).

## 2. Setup the Jenkins plugin

This plugin is using identified [Service Account](/documentation/explanations/service-account) when connecting to Microcks API. It is also able to manage multiple Microcks instances and hide the technical details from your Jobs using Microcks plugins.

As a Jenkins administrator, go to the **Manage Jenkins** page and find the **Microcks** section. You should be able to add and configure as many instance of Microcks installation as you want like in the 2 configured in screenshot below:

{{< image src="images/documentation/jenkins-installations.png" alt="image" zoomable="true" >}}

A Microcks installation configuration need 5 parameters:

* A `Name` will be used by your Jobs or Pipelines as a reference of an environment,
* The `API URL` is the endpoint of your Microcks server receiving API calls,
* The `Credentials` to use for authenticating the **Service Account** and allowing it to retrieve an OAuth token. These are `Credentials` that should be registered into Jenkins,
* The `Disable Cert Validation` can be check if you have are using auto-signed certificates for example.

You should then be able to test the connection to endpoints and save your configuration. Later, your Jobs and Pipelines will just use the installation `Name` to refer it from their build steps.

## 3. Using the Jenkins plugin

Jenkins plugin may be used in 2 ways:

* As a simple `Build Step` using a form to define what service to test,
* As an action defined using Domain Specific Language within a `Pipeline stage`

It provides two different actions or build steps: the `Import API specification files in Microcks` step and the `Launch Microcks Test Runner` step.

### Import API

#### Build step usage

When defining a new project into Jenkins GUI, you may want to add a new `Import API specification files in Microcks` step as shown in the capture below.

{{< image src="images/documentation/jenkins-import-step.png" alt="image" zoomable="true" >}}

The parameters that can be set here are:

* The `Server`: this is the `Name` your running isntance of Microcks that is registered into Jenkins (see the [previous setup step](./#2-setup-the-jenkins-plugin)),
* The `Comma separated list of API specification` to import: this is simply a `/my/file/path[:is_primary],/my/file/path2[:is_primary]` expression. You should point to local files in your job workspace, typically those coming from a checkout or clone from source repository). Optionally, you can specify if they should be considered as `main` or `primary` artifact (`true` value) or `secondary` artifact (`false` value). See [Multi-artifacts explanations](/documentation/explanations/multi-artifacts) documentation. Default is `true` so it is considered as primary.

#### DSL plugin usage

When defining a new CI/CD pipeline - even through the Jenkins or OpenShift GUI or through a `Jenkinsfile` within your source repository - you may want to add a specific `microcksImport` within your pipeline script as the example below:

```groovy
node('master') {
  stage ('build') {
    // Clone sources from repo.
    git 'https://github.com/microcks/microcks-cli'
  }
  stage ('importAPISpecs') {
    // Add Microcks import here.
    microcksImport(server: 'microcks-localhost',
      specificationFiles: 'samples/weather-forecast-openapi.yml:true,samples/weather-forecast-postman.json:false')
  }
  stage ('promoteToProd') {
    // ...
  }
  stage ('deployToProd') {
    // ...
  }
}
```

The parameters that can be set here are the same that in `Build Step` usage but take care to cases and typos:

* The `server`: this is the `Name` your running isntance of Microcks that is registered into Jenkins (see the [previous setup step](./#2-setup-the-jenkins-plugin)),
* The `specificationFiles`: this is simply a `/my/file/path[:is_primary],/my/file/path2[:is_primary]` expression.

### Launch Test

#### Build step usage

When defining a new project into Jenkins GUI, you may want to add a new `Launch Microcks Test Runner` step as shown in the capture below.

{{< image src="images/documentation/jenkins-build-step.png" alt="image" zoomable="true" >}}

The parameters that can be set here are:

* The `Server`: this is the `Name` your running isntance of Microcks that is registered into Jenkins (see the [previous setup step](./#2-setup-the-jenkins-plugin)),
* The `Service Identifier` to launch tests for: this is simply a `service_name:service_version` expression,
* The `Test Endpoint` to test: this is a valid endpoint where your service or API implementation has been deployed,
* The `Runner Type` to use: this is the test strategy you may want to have regarding endpoint,
* The `Verbose` flag: allows to collect detailed logs on Microcks plugin execution,
* The `Timeout` configuration: allows you to override default timeout for this tests.

#### DSL plugin usage

When defining a new CI/CD pipeline - even through the Jenkins or OpenShift GUI or through a `Jenkinsfile` within your source repository - you may want to add a specific `microcksTest` within your pipeline script as the example below:

```groovy
node('maven') {
  stage ('build') {
    // ...
  }
  stage ('deployInDev') {
    // ...
  }
  stage ('testInDev') {
    // Add Microcks test here.
    microcksTest(server: 'microcks-minishift',
      serviceId: 'Beer Catalog API:0.9',
      testEndpoint: 'http://beer-catalog-impl-beer-catalog-dev.52.174.149.59.nip.io/api/',
      runnerType: 'POSTMAN', verbose: 'true', waitTime: 5, waitUnit: 'sec')
  }
  stage ('promoteToProd') {
    // ...
  }
  stage ('deployToProd') {
    // ...
  }
}
```

The parameters that can be set here are the same that in `Build Step` usage but take care to cases and typos:

* The `server`: this is the `Name` your running isntance of Microcks that is registered into Jenkins (see the [previous setup step](./#2-setup-the-jenkins-plugin)),
* The `serviceId` to launch tests for: this is simply a `service_name:service_version` expression,
* The `testEndpoint` to test: this is a valid endpoint where your service or API implementation has been deployed,
* The `runnerType` to use: this is the test strategy you may want to have regarding endpoint,
* The `verbose` flag: allows to collect detailed logs on Microcks plugin execution,
* The `waitTime` configuration: allows you to override the default time quantity for this tests.
* The `waitUnit` configuration: allows you to override the default time unit for this tests (values in milli, sec or min).

## Wrap-up

Following this guide, You have learned how to get and use the Microcks GitHub Actions. The GitHub actions reuse the [Microcks CLI](/documentation/guides/automation/cli) and the [Service Account](/documentation/explanations/service-account) and so it's definitely worth the read 😉

Using Microcks and its Jenkins plugin, you may achieve some clean CI/CD pipelines that ensures your developed API implementation is fully aligned to expectations.

The most up-to-date information and reference documentation can be found into the repository [README](https://github.com/microcks/microcks-jenkins-plugin).