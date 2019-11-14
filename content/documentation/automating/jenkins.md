---
draft: false
title: "Integrating Microcks from Jenkins"
date: 2019-09-01
publishdate: 2019-09-01
lastmod: 2019-09-02
menu:
  docs:
    parent: automating
    name: Integrating Microcks from Jenkins
    weight: 20
toc: true
weight: 20 #rem
categories: [automating]
---

## Microcks Jenkins plugin
      
Microcks provides a Jenkins plugin that you may find here: <a href="https://github.com/microcks/microcks-jenkins-plugin">microcks-jenkins-plugin</a>. This plugin allows your Jenkins builds and jobs to delegate the tests of microservices or API you just deployed to Microcks server. See <a href="../../using/tests/">this page on Tests</a> for more informations on running tests with Microcks.
      
Using this plugin, it is really easy to integrate tests stages within your Continuous Integration / Deployment / Delivery pipeline. Microcks Jenkins plugin delegates tests realization and assertions checking to Microcks, wait for the end of tests or a configured timeout and just pursue or fail the current job depending on tests results.
			
### Getting raw plugin
      
While not being distributed yet as an official Jenkins plugin, Microcks Jenkins plugin is available and can be downloaded from [Central Maven repository](http://central.maven.org/maven2/io/github/microcks/microcks-jenkins-plugin/). Just get the [HPI file](http://central.maven.org/maven2/io/github/microcks/microcks-jenkins-plugin/0.2.0/microcks-jenkins-plugin-0.2.0.hpi) and install it on your Jenkins master [your preferred way](https://jenkins.io/doc/book/managing/plugins/).
            
Pick up the version corresponding to your Microcks installation :

* [0.2.0 version](http://central.maven.org/maven2/io/github/microcks/microcks-jenkins-plugin/0.2.0/microcks-jenkins-plugin-0.2.0.hpi) from Microcks `0.7.0` or greater
* [0.1.1 version](http://central.maven.org/maven2/io/github/microcks/microcks-jenkins-plugin/0.1.1/microcks-jenkins-plugin-0.1.1.hpi) from Microcks version before `0.7.0`
			

### Building an OpenShift Jenkins master embedding plugin
			
A common option for running Jenkins is through OpenShift platform. In that case, you may want to create your own custom Jenkins master container image embedding this plugin. While there's [many ways of building such images](https://github.com/clerixmaxime/custom-jenkins), as Microcks plugin is not yet an official Jenkins plugin, we provide our own OpenShift configuration for that.
			
Given you have an OpenShift installation running and you're logged on it, just execute that command from terminal:

```
$ oc process -f https://raw.githubusercontent.com/microcks/microcks-jenkins-plugin/master/openshift-jenkins-master-bc.yml | oc create -f -
```

This should start a `Build` and then create an `ImageStream` called `microcks-jenkins-master` in your current project. After few minutes, a `microcks-jenkins-master:latest` container image should be available and you may be able to reference it as a bootstrap when creating a new Jenkins Service on OpenShift.
			
## Setting up Microcks Jenkins plugin

Since the version `0.2.0`, this plugin is using identified **Service Accounts** when connecting to Microcks server. It is also able to manage multiple Microcks installation and hide the technical details from your Jobs using Microcks plugins. As a Jenkins administrator, go to the **Manage Jenkins** page and find the **Microcks** section. You should be able to add and configure as many instance of Microcks installation as you want like in the 2 configured in screenshot below:

![jenkins-installations](/images/jenkins-installations.png)
			
A Microcks installation configuration need 5 parameters:
* A `Name` will be used by your Jobs or Pipelines as a reference of an environment,
* The `API URL` is the endpoint of your Microcks server receiving API calls,
* The `Keycloak URL` is the endpoint of the Keycloak associated with your Microcks server. You should set it the full URL including the realm name your instance is attached,
* The `Credentials` to use for authenticating the Service Account and allowing it to retrieve an OAuth token (more on that on [service-account](/automating/service-account)). These are Crederentials that should be registered into Jenkins,
* The `Disable Cert Validation` box you have to check if you have a HTTPS setup with auto-signed certificates.
			
You should then be able to test the connection to endpoints and save your configuration. Later, your Jobs and Pipelines will just use the installation `Name` to refer it from their build steps.
			
## Using Microcks Jenkins plugin
			
Jenkins plugins may be used in 2 ways:

* As a simple `Build Step` using a form to define what service to test,
* As an action defined using Domain Specific Language within a `Pipeline stage`
        
### Simple build step usage
			
When defining a new project into Jenkins GUI, you may want to add a new `Launch Microcks Test Runner` step as shown in the capture below.
			
![jenkins-build-step](/images/jenkins-build-step.png" class="img-responsive"/>
			
The parameters that can be set here are:

* The `Server`: this is your running installation of Microcks that is registered into Jenkins (see previous setup step),
* The `Service Identifier` to launch tests for: this is simply a `service_name:service_version` expression,
* The `Test Endpoint` to test: this is a valid endpoint where your service or API implementation has been deployed,
* The `Runner Type` to use: this is the test strategy you may want to have regarding endpoint,
* The `Verbose` flag: allows to collect detailed logs on Microcks plugin execution,
* The `Timeout` configuration: allows you to override default timeout for this tests.
			
### DSL plugin usage
			
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
    microcksTest(server: 'minishiftMicrocks',
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
			
![jenkins-pipeline-openshift](/images/jenkins-pipeline-openshift.png)
