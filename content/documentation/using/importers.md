---
draft: false
title: "Importing Services & APIs"
date: 2020-02-26
publishdate: 2020-02-26
lastmod: 2020-08-04
menu:
  docs:
    parent: using
    name: Importing Services & APIs
    weight: 5
toc: true
weight: 30 #rem
---

## Introduction

Once you get your Microcks instance up and running, the next step is to start adding some Services or APIs into its internal repository. We've seen in this [Getting Started](../../getting-started/#loading-samples) section how to quickly load samples into the repository. This page will drive you through the complete explanations of supported formats and import mechanisms present into Microcks.

## Supported formats

As previously introduced, Microcks *"turns out your API contract into live mocks in seconds"* - the noticeable part of these sentence being **API contract**. The cool things here is that is does not require you to produce another document: it is able to reuse existing **artifacts** that you may gather Microcks with. In order to be usable by Microcks, such artifacts should hold syntactical contracts but also full samples on how your Service is expected to work - and this is only possible by embedding complete pairs of requests and responses.

Microcks supports the following editing tools and export/import formats as **artifacts** formats:

![artifacts-formats](/images/artifacts-formats.png)

We provide built-in parsers and importers for the following formats:

* [SoapUI projects](https://www.soapui.org/soapui-projects/soapui-projects.html) files starting with the version 5.1 or SoapUI. See our [documentation](../soapui/) on some conventions you should follow for this project structure,
* [Postman collections](https://learning.postman.com/docs/postman/collections/data-formats/) files with v1.0 or v2.x file format. See our [documentation](../postman/) on some conventions you should follow for this collection structure,
* [Apicurio Studio](https://apicurio-studio.readme.io/docs/integrate-microcks-for-mocking-your-api) direct integration when working on OpenAPI 3.x API specifications,
* [OpenAPI v3.x](http://spec.openapis.org/oas/v3.0.3) files whether using the YAML of JSON format. See our [documentation](../openapi/) on some conventions you should follow for this specification,
* [AsyncAPI v2.x](https://www.asyncapi.com/docs/specifications/2.0.0) files whether using the YAML or JSON format. See our [documentation](../asyncapi/) on some conventions you should follow for this specification, 


> People very often ask *"Why the Swagger format - aka OpenApi 2.0 - isn't supported by Microcks?"*. This is because Swagger is incomplete for specifying mocks as it does not allow full specifications of examples. Sure, the Swagger spec allows you to illustrate responses with samples but it does not allow you to do so with request or request parameters (whether in path, query or headers). And if some tools - like Swagger UI - seems to compose sample requests, they're only doing this using schema information with random generated values...

If you own a bunch of Swagger specifications, you won't be able to directly import them into Microcks - see the above note on the reason why. Thus, you will need to have an extra step and use a wrapper tool (Postman or SoapUI) for adding complete requests / responses pairs that will be used as the basis of your API real-life mocks.

![artifacts-swagger-adaptations](/images/artifacts-swagger-adaptations.png)

> Please notice that the same issue and workaround may apply to some others API specification formats like [WADL](https://www.w3.org/Submission/wadl/) or [RAML](https://raml.org/). They've got really good importers for Postman or SoapUI that offers you a very easy way to complete your syntactic specification with some real life samples that can make the genesis for useful mocks ;-)

## Direct upload

The first way of adding new Services or APIs mocks to your Microcks instance is by realizing a direct upload of the artifact. From the left vertical navigation bar, just select the **Importers** menu entry and then choose `Upload`. You'll then see a dialog window allowing you to browse your filesystem and pick a new file to upload.

![artifacts-upload](/images/artifacts-upload.png)

Hit the `Upload` green button. Upload and then artifact import should then occur with notification messages appearing on the top right corner. Newly discovered Services and APIs can be found into the **APIs | Services** repository.

While this method is very convenient for quick test, we'll have to re-import your artifact file on every new change...

## Scheduled import

Another way of adding new Services or APIs mocks is by scheduling an **Importer Job** into Microcks. Actually we see it as the best way to achieve continuous, iterative and incremental discovery of your Services and APIs mocks and tests. The principle is very simple: you'll save your artifact file into the Git repository of your choice (public or private) and Microcks will take care of periodically checking if changes have been applied and new mock or services definitions are present into your artifact.
 
![artifacts-scheduling](/images/artifacts-scheduling.png)

> Though we think that Git repository (or version control system) are the best place to keep such artifacts, Microcks only require simple HTTP service indeed. So you may store your artifact on a simple filesystem as long as it is reachable using HTTP.

Still from the left vertical navigation bar, just select the **Importers** menu entry and then see the list of already existing importers.

Once created, importer jobs can be managed, activated or forced through this screen. You'll see colored marker for each job line:

* `Scanned` means that the job is actually scheduled for next importation run. Otherwise `Inactive`  will be displayed.
* `Imported` means that the job has been successfully imported on previous run. Otherwise `Last import errors` will be displayed with a popup showing the last error,
* `Services` is a shortcut to access the services definitions discovered by this job.

Using the 3-dotted menu, you can easily enable/disable of force the job.

![importer-status](/images/importer-status.png)

### Creating a new scheduled import

You may declare a new Importer job hitting the `Create` button.

A wizard modal then appears as creating an Importer is a 2-steps process. First step is about mandatory basic properties such as the name of your Importer and the repository URL it will use to check for discovering API mocks.

![importer-step1](/images/importer-step1.png)

Second step is about authentication options for accessing the repository. Depending on the type of repository (public or private) you may need to enable/disable certificate validation as well as manage an authentication process through the usage of a **Secret**. See more on Secrets [here](../../administrating/secrets).

![importer-step3](/images/importer-step2.png)

Finally the review displays a summary before effective creation of the Importer Job.

![importer-step3](/images/importer-step3.png)

On first time creation the Job is automatically `Scanned` and `Imported`.


### Configure scheduling interval

Scheduling interval can be globally configured for all the Jobs. It is a global setting and not a per-Job one. This is achieved through the `services.update.interval` property into the `application.properties` configuration file that takes the value of `SERVICES_UPDATE_INTERVAL` environment variable. The value should be set to a valid [CRON expression](https://en.wikipedia.org/wiki/Cron#CRON_expression) ; default is every 2 hours.

```properties
services.update.interval=${SERVICES_UPDATE_INTERVAL:0 0 0/2 * * *}
```

## Errors management

As import can be scheduled and take some *little* time, it is done asynchronously regarding the human interaction that has triggered it. We then did choose not having a blocking process regarding errors management: Microcks importers will try to discover and import services but will die silently in case of any failure. We also think that this also promotes iterative and incremental way of working: you know that your job will not roughly fail if your new samples are not yet complete.

Some of the error messages will be reported through the `Last import errors` status but some not... We try making the logged information clearer regarding this type of errors but we incite you to have a look at the **Trouble shooting** section of each specific importer documentation if the discovered services information do not match with your expectations.

We hope releasing in near future some kind of `linter` that may help with analyzing your artifact to check compliance with recommended practices and conventions.