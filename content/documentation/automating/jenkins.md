---
draft: false
title: "Integrating Microcks from Jenkins"
date: 2019-09-01
publishdate: 2019-09-01
lastmod: 2021-11-22
weight: 2
---

## Microcks Jenkins plugin

Microcks provides a Jenkins plugin that you may find in its [own GitHub repository](https://github.com/microcks/microcks-jenkins-plugin). This plugin allows your Jenkins builds and jobs to import API specifications into Microcks and to launch tests runner for validating the Service or API you just deployed. See [this page on Tests](../../using/tests/) for more informations on running tests with Microcks.

Using this plugin, it is really easy to keep Microcks in-sync withe your API specifications and integrate tests stages within your Continuous Integration / Deployment / Delivery pipeline. Microcks Jenkins plugin delegates tests realization and assertions checking to Microcks, wait for the end of tests or a configured timeout and just pursue or fail the current job depending on tests results.

### Getting raw plugin

While not being distributed yet as an official Jenkins plugin, Microcks Jenkins plugin is available and can be downloaded from [Central Maven repository](https://repo.maven.apache.org/maven2/io/github/microcks/microcks-jenkins-plugin/). Just get the [HPI file](https://repo.maven.apache.org/maven2/io/github/microcks/microcks-jenkins-plugin/0.3.0/microcks-jenkins-plugin-0.3.0.hpi) and install it on your Jenkins master [your preferred way](https://jenkins.io/doc/book/managing/plugins/).


### Building an OpenShift Jenkins master embedding plugin

A common option for running Jenkins is through OpenShift platform. In that case, you may want to create your own custom Jenkins master container image embedding this plugin. While there's [many ways of building such images](https://github.com/clerixmaxime/custom-jenkins), as Microcks plugin is not yet an official Jenkins plugin, we provide our own OpenShift configuration for that.

Given you have an OpenShift installation running and you're logged on it, just execute that command from terminal:

```sh
$ oc process -f https://raw.githubusercontent.com/microcks/microcks-jenkins-plugin/master/openshift-jenkins-master-bc.yml | oc create -f -
```

This should start a `Build` and then create an `ImageStream` called `microcks-jenkins-master` in your current project. After few minutes, a `microcks-jenkins-master:latest` container image should be available and you may be able to reference it as a bootstrap when creating a new Jenkins Service on OpenShift.

If you already have a Jenkins deployment you want to update, just issue the two following commands:

```sh
$ oc set triggers dc/jenkins --remove --from-image=openshift/jenkins:2
$ oc set triggers dc/jenkins --from-image=microcks-jenkins-master:latest -c jenkins
```

## Setting up Microcks Jenkins plugin

This plugin is using identified [Service Account](../service-account) when connecting to Microcks server. It is also able to manage multiple Microcks installation and hide the technical details from your Jobs using Microcks plugins. As a Jenkins administrator, go to the **Manage Jenkins** page and find the **Microcks** section. You should be able to add and configure as many instance of Microcks installation as you want like in the 2 configured in screenshot below:

{{< image src="images/jenkins-installations.png" alt="image" zoomable="true" >}}

A Microcks installation configuration need 5 parameters:

* A `Name` will be used by your Jobs or Pipelines as a reference of an environment,
* The `API URL` is the endpoint of your Microcks server receiving API calls,
* The `Credentials` to use for authenticating the Service Account and allowing it to retrieve an OAuth token (more on that on [Service Account](/automating/service-account)). These are Credentials that should be registered into Jenkins,
* The `Disable Cert Validation` box you have to check if you have a HTTPS setup with auto-signed certificates.

You should then be able to test the connection to endpoints and save your configuration. Later, your Jobs and Pipelines will just use the installation `Name` to refer it from their build steps.

## Using Microcks Jenkins plugin

Jenkins plugin may be used in 2 ways:

* As a simple `Build Step` using a form to define what service to test,
* As an action defined using Domain Specific Language within a `Pipeline stage`

It provides two different actions or build steps: the `Import API specification files in Microcks` step and the `Launch Microcks Test Runner` step.

### Import API Specification

#### Build step usage

When defining a new project into Jenkins GUI, you may want to add a new `Import API specification files in Microcks` step as shown in the capture below.

{{< image src="images/jenkins-import-step.png" alt="image" zoomable="true" >}}

The parameters that can be set here are:

* The `Server`: this is your running installation of Microcks that is registered into Jenkins (see previous setup step),
* The `Comma separated list of API specification` to import: this is simply a `/my/file/path[:is_primary],/my/file/path2[:is_primary]` expression. You should point to local files in your job workspace (typically those coming from a checkout or clone from source repository) and optionally specify if they should be considered as `main` or `primary` artifact (`true` value) or `secondary` artifact (`false` value).

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

* The `server`: this is your running installation of Microcks that is registered into Jenkins (see previous setup step),
* The `specificationFiles`: this is simply a `/my/file/path[:is_primary],/my/file/path2[:is_primary]` expression.

### Launch Test

#### Build step usage

When defining a new project into Jenkins GUI, you may want to add a new `Launch Microcks Test Runner` step as shown in the capture below.

{{< image src="images/jenkins-build-step.png" alt="image" zoomable="true" >}}

The parameters that can be set here are:

* The `Server`: this is your running installation of Microcks that is registered into Jenkins (see previous setup step),
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
      runnerType: 'POSTMAN', verbose: 'true')
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

* The `server`: this is your running installation of Microcks that is registered into Jenkins (see previous setup step),
* The `serviceId` to launch tests for: this is simply a `service_name:service_version` expression,
* The `testEndpoint` to test: this is a valid endpoint where your service or API implementation has been deployed,
* The `runnerType` to use: this is the test strategy you may want to have regarding endpoint,
* The `verbose` flag: allows to collect detailed logs on Microcks plugin execution,
* The `waitTime` configuration: allows you to override the default time quantity for this tests.
* The `waitUnit` configuration: allows you to override the default time unit for this tests (values in milli, sec or min).

Using Microcks and its Jenkins plugin, you may achieve some clean CI/CD pipelines that ensures your developed API implementation is fully aligned to expectations. See below a visualization of such a pipeline for our `Beer Catalog API` (full project to come soon).

{{< image src="images/jenkins-pipeline-openshift.png" alt="image" zoomable="true" >}}