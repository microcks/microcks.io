---
draft: false
title: "Importing Services & APIs"
date: 2020-02-26
publishdate: 2020-02-26
lastmod: 2024-05-27
weight: 3
---

## Direct upload

The most simple way of adding new Services or APIs mocks to your Microcks instance is by directly uploading the artifact. From the left vertical navigation bar, just select the **Importers** menu entry and then choose `Upload`. You'll then see a dialog window allowing you to browse your filesystem and pick a new file to upload.

> From Microcks release 1.3.0, you can also specify whether this artifact should be considered as `primary` or `secondary` per the [multi-artifacts support](#multi-artifacts-support).

{{< image src="images/artifacts-upload.png" alt="image" zoomable="true" >}}

Hit the `Upload` green button. An upload followed by an artifact import should occur with notification messages appearing on the top right corner. Newly discovered Services and APIs can be found into the **APIs | Services** repository.

While this method is very convenient for a quick test, you'll have to re-import your artifact file on every new change...

## Scheduled import

Another way of adding new Services or APIs mocks is by scheduling an **Importer Job** into Microcks. Actually we see this as the best way to achieve continuous, iterative and incremental discovery of your Services and APIs mocks and tests. The principle is very simple: you save your artifact file into the Git repository of your choice (public or private) and Microcks will take care of periodically checking if changes have been applied and new mock or services definitions are present in your artifact.

{{< image src="images/artifacts-scheduling.png" alt="image" zoomable="true" >}}

> Though we think that Git repositories (or other version control systems) are the best place to keep such artifacts, Microcks only requires a simple HTTP service. So you may store your artifact on a simple filesystem as long as it is reachable using HTTP.

Still from the left vertical navigation bar, just select the **Importers** menu entry to see the list of existing importers.

Once created, importer jobs can be managed, activated or forced through this screen. You'll see colored marker for each job line:

* `Scanned` means that the job is actually scheduled for next importation run. Otherwise `Inactive`  will be displayed.
* `Imported` means that the job has been successfully imported on previous run. Otherwise `Last import errors` will be displayed with a popup showing the last error,
* `Services` is a shortcut to access the services definitions discovered by this job.

Using the 3-dotted menu, you can easily enable/disable or force the job.

{{< image src="images/importer-status.png" alt="image" zoomable="true" >}}

### Creating a new scheduled import

You may declare a new Importer job by hitting the `Create` button.

A wizard modal then appears as creating an Importer is a 2-step process. The first step is about mandatory basic properties such as the name of your Importer and the repository URL it will use to check for discovering API mocks.

> From Microcks release 1.3.0, you can also specify if this artifact should be considered as `primary` or `secondary` per the [multi-artifacts support](#multi-artifacts-support).

{{< image src="images/importer-step1.png" alt="image" zoomable="true" >}}

The second step is about authentication options for accessing the repository. Depending on the type of repository (public or private) you may need to enable/disable certificate validation as well as manage an authentication process through the usage of a **Secret**. See more on Secrets [here](../../administrating/secrets).

{{< image src="images/importer-step2.png" alt="image" zoomable="true" >}}

Finally the review displays a summary before creating the Importer Job.

{{< image src="images/importer-step3.png" alt="image" zoomable="true" >}}

On first time creation the Job is automatically `Scanned` and `Imported`.


### Configure scheduling interval

The scheduling interval can be globally configured for all the Jobs. It is a global setting and not a per-Job one. This is achieved through the `services.update.interval` property in the `application.properties` configuration file that takes the value of `SERVICES_UPDATE_INTERVAL` environment variable. The value should be set to a valid [CRON expression](https://en.wikipedia.org/wiki/Cron#CRON_expression) ; default is every 2 hours.

```properties
services.update.interval=${SERVICES_UPDATE_INTERVAL:0 0 0/2 * * *}
```

## Error management

As an import can be scheduled and can take a *little* time, it is done asynchronously regarding the human interaction that has triggered it. We choose not to have a blocking process for error management: Microcks importers will try to discover and import services but will die silently in case of any failure. We also think that this also promotes iterative and incremental way of working: you know that your job will gracefully fail if your new samples are not yet complete.

Some of the error messages will be reported through the `Last import errors` status but some not... We try to make the logged information clear regarding these types of error but we recommend you have a look at the **Troubleshooting** section of each specific importer's documentation if the discovered services information isn't sufficiently insightful.

We hope to release in the near future some kind of `linter` that may help with analyzing your artifact to check compliance with recommended practices and conventions.
