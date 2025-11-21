---
draft: false
title: "Importing Services & APIs"
date: 2020-02-26
publishdate: 2020-02-26
lastmod: 2024-06-07
weight: 1
---

## Overview

This guide will show you and discuss the different options for importing Services and APIs into Microcks. There are basically two different ways of putting new content into Microcks:
1. Pushing content to Microcks via Upload,
2. Having Microcks pulling content via Importer.

We will consider the pros and cons of the different methods.

## 1. Import content via Upload

### Via the UI

The simplest and fastest way to add new Services or API mocks is to use the UI Quick Import. Click the **Quick Import** button in the top-right corner of the screen, or simply drag-and-drop a file anywhere on the UI — either action will start the upload and import flow. A dialog will appear where you can adjust options and confirm the upload.

<div align="center">
{{< figure src="images/documentation/artifacts-upload.png" width="80%" >}}
</div>

> 💡 You can also specify whether this artifact should be considered as `primary` or `secondary` per the [Multi Artifacts support](/documentation/explanations/multi-artifacts). In the case of a `secondary` artifact, you may check the *Secondary Artifact*  box.

After choosing your artifacts, click the green `Upload` button to send them to Microcks. Notification messages will appear in the top-right corner to inform you of the process. Newly discovered Services and APIs can be found in the **APIs | Services** repository.

While this method is very convenient for a quick test, you'll have to re-import your artifact file on every new change. To watch the changes of local files you can check out the [Microcks CLI Import](https://github.com/microcks/microcks-cli/blob/master/documentation/cmd/import.md)

### Via the API

The same thing can be done via Microcks' own API. Be sure to start reading the [Connecting to Microcks API](/documentation/guides/automation/api) guide first, and to retrieve a `token` by running the authentication flow. The *Service Account* you use for this operation is required to have the `manager` role, which is not the case with the default one, as explained in [Inspecting default Service Account](/documentation/explanations/service-account/#inspecting-default-service-account).

Once you have the `$TOKEN` issued for the correct account, uploading a new Artifact is just a matter of executing this `curl` command:

```sh
# Uploading a local artifact.
curl 'https://microcks.example.com/api/artifact/upload?mainArtifact=true' -H "Authorization: Bearer $TOKEN" -F 'file=@samples/films.graphql' -k
```

### Configure dependency resolution

Direct upload is straightforward and quick to realize, but comes with one caveat: it does not allow you to automatically resolve dependencies. For example, if your artifact file uses external references with relative paths, Microcks is not able to resolve these external references by default.

As a workaround to this limitation, and since Microcks `1.10.1`, we introduced a new `default-artifacts-repository.url` property that takes the value of `DEFAULT_ARTIFACTS_REPOSITORY_URL` environment variable when defined. It can be set to either an HTTP endpoint (starting with `http[s]://`) or a file endpoint (starting with `file://`). This default repository for artifacts will be used as the default location for Microcks to resolve relative dependencies.

```properties
default-artifacts-repository.url=${DEFAULT_ARTIFACTS_REPOSITORY_URL:#{null}}
```

> 💡 For local development purposes, this is super convenient to use a very small HTTP server running on your laptop or a common folder mounted into Microcks container as the default artifacts repository.


## 2. Import content via Importer

Another way of adding new Services or APIs mocks is by scheduling an **Importer Job** into Microcks. We think it's actually the best way to achieve continuous, iterative and incremental discovery of your Services and APIs. The principle is very simple: you save your artifact file into the Git repository of your choice (public or private), and Microcks will take care of periodically checking if changes have been applied and new mock or service definitions are present in your artifact. The nice thing about using Importer is that external files referenced in the target artifact will be automatically resolved for you. 

<div align="center">
{{< figure src="images/documentation/artifacts-scheduling.png" width="80%" >}}
</div>

> 💡 Though we think that Git repositories (or other version control systems) are the best place to keep such artifacts, Microcks only requires a simple HTTP service. So you may store your artifact on a simple filesystem as long as it is reachable using HTTP.

Still from the left vertical navigation bar, just select the **Importers** menu entry to see the list of existing importers.

### Creating a new scheduled import

You may declare a new Importer job by hitting the `Create` button.

A wizard modal then appears, as creating an Importer is a three-step process. The first step concerns mandatory basic properties such as the name of your Importer and the repository URL it will use to check for discovering API mocks.

<div align="center">
{{< figure src="images/importer-step1.png" width="90%" >}}
</div>

> 💡 You can also specify whether this artifact should be considered as `primary` or `secondary` per the [Multi Artifacts support](/documentation/explanations/multi-artifacts). In the case of a `secondary` artifact, you may check the *Just merge examples into existing API | Service definition*  box.

The second step concerns authentication options for accessing the repository. Depending on the type of repository (public or private), you may need to enable/disable certificate validation and manage an authentication process through the usage of a **Secret**. For more info, check the guide on [External Secrets](/documentation/guides/administration/secrets).

<div align="center">
{{< figure src="images/importer-step2.png" width="90%" >}}
</div>

Finally, the review displays a summary before creating the Importer Job.

<div align="center">
{{< figure src="images/importer-step3.png" width="90%" >}}
</div>

### Managing scheduled importers

At creation time, the importer job is automatically `Scanned` and `Imported`.

Once created, importer jobs can be managed, activated or forced through this screen. You'll see a colored marker for each job line:

* `Scanned` means that the job is actually scheduled for the next importation run. Otherwise, `Inactive`  will be displayed.
* `Imported` means that the job has been successfully imported on a previous run. Otherwise, `Last import errors` will be displayed with a popup showing the last error,
* `Services` is a shortcut to access the services definitions discovered by this job.

Using the 3-dotted menu, you can easily enable/disable or force the job.

<div align="center">
{{< figure src="images/importer-status.png" width="90%" >}}
</div>

### Configure scheduling interval

The scheduling interval can be globally configured for all Jobs. It is a global setting and not a per-job one. This is achieved through the `services.update.interval` property in the `application.properties` configuration file, which takes the value of the `SERVICES_UPDATE_INTERVAL` environment variable. The value should be set to a valid [CRON expression](https://spring.io/blog/2020/11/10/new-in-spring-5-3-improved-cron-expressions); the default is every 2 hours.

```properties
services.update.interval=${SERVICES_UPDATE_INTERVAL:0 0 0/2 * * *}
```

## Wrap-up

Importing new content into Microcks can be done in several ways: UI, CLI or API. 

While pushing local content is very convenient for immediate definition and local development updates, setting up an importer job is the best way to achieve continuous, iterative and incremental discovery of your Services and APIs.

Making Microcks pull your artifacts also allows advanced resolution of dependencies, which can be mandatory when your OpenAPI or AsyncAPI artifacts are using `$ref`.

As an import can be scheduled and can take a *little* time, it is done asynchronously regarding the human interaction that has triggered it. We choose not to have a blocking process for error management: Microcks importers will try to discover and import services, but will die silently in case of any failure. We also think that this also promotes an iterative and incremental way of working: you know that your job will gracefully fail if your new samples are not yet complete.

Some of the error messages will be reported through the `Last import errors` status, but some will not... To help you in checking your artifacts for compliance with recommended practices and conventions, we're developing the [Microcks Linter Ruleset](https://github.com/microcks/microcks-spectral-ruleset).
