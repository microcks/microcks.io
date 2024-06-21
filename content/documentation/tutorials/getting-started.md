---
draft: false
title: "Getting started"
date: 2019-09-01
publishdate: 2019-09-01
lastmod: 2024-05-15
weight: 1
---

## Quickstart

In this tutorial, you will discover Microcks mocking features by re-using a simple REST API sample. For that: you will run Microcks on your local machine, then load a sample provided by the Microcks team, explore the web user interface and then interact with an API mock.

The easiest way to get started with Microcks is using [Docker](https://docs.docker.com/get-docker/) or [Podman](https://podman.io/) with our ephemral all-in-one Microcks distribution. 

In your terminal issue the following command - maybe replacing `8585` by another port of your choice if this one is not free:

```sh
$ docker run -p 8585:8080 -it --rm quay.io/microcks/microcks-uber:latest-native 
```

This will pull and spin the `uber` container and setup a simple environment for you to use. You shoud get something like this on your terminal:

```sh
[...]
 .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.1)

14:51:07.473  INFO 1 --- [      main] i.g.microcks.MicrocksApplication         : Starting AOT-processed MicrocksApplication using Java 17.0.10 with PID 1 (/workspace/io.github.microcks.MicrocksApplication started by cnb in /workspace)
14:51:07.473  INFO 1 --- [      main] i.g.microcks.MicrocksApplication         : The following 1 profile is active: "uber"
14:51:07.520  INFO 1 --- [      main] i.g.microcks.config.WebConfiguration     : Starting web application configuration, using profiles: [uber]
14:51:07.520  INFO 1 --- [      main] i.g.microcks.config.WebConfiguration     : Web application fully configured
[...]
14:51:07.637  INFO 1 --- [      main] i.g.m.util.grpc.GrpcServerStarter        : GRPC Server started on port 9090
14:51:07.640  INFO 1 --- [      main] i.g.m.config.AICopilotConfiguration      : AICopilot is disabled
14:51:07.682  INFO 1 --- [      main] i.g.m.config.SecurityConfiguration       : Starting security configuration
14:51:07.682  INFO 1 --- [      main] i.g.m.config.SecurityConfiguration       : Keycloak is disabled, permitting all requests
14:51:07.755  INFO 1 --- [      main] i.g.microcks.MicrocksApplication         : Started MicrocksApplication in 0.296 seconds (process running for 0.303)
```

Open a new browser tab and point to the `http://localhost:8585` endpoint - or other port you choose to access Microcks.

## Using Microcks

Now you are ready to use Microcks for deploying your own services and API mocks! Before that let's have the look at the application home screen and introduce the main concepts. Using the application URL after installation, we should land on this page with two main entry points : **APIs | Services** and **Importers**.
			
{{< image src="images/home-screen.png" alt="image" zoomable="true" >}}
			
As you may have guessed, **APIs | Services** is for browsing your Services and API repository, discovering and accessing documentation, mocks, and tests. **Importers** will help you to populate your repository, allowing you to define Jobs that periodically scan your Git or simple HTTP repositories for new artifacts, parse them and integrate them into your Services and API repository. In fact **Importers** help you discover both new and modified **Services**. Before using your own service definition files, let's load some samples into Microcks for a test ride!

### Loading a Sample

We provide different samples that illustrate the different capabilities of Microcks on different protocols. Samples can be loaded via **Importers** like stated above but also via the **[Microcks Hub](https://hub.microcks.io)** entry in the vertical menu on the left.
				
{{< image src="images/home-microcks-hub.png" alt="image" zoomable="true" >}}

Among the different tiles on this screen, choose the `MicrocksIO Samples API` one that will give your access to the list of available samples. For getting started with Microcks, we're going to explore the `Pastry API - 2.0` that is a simple REST API. Select it from the list of available APIs on the bottom right:

{{< image src="images/home-microcks-hub-samples.png" alt="image" zoomable="true" >}}

On the following screen, click the big blue `Install` button where you will choose the `+ Direct import` method. 

### Viewing an API

When import is done, a new API has been discovered and added to your repository. You should have the result below with the two notifications toast on the top right.

{{< image src="images/home-sample-install.png" alt="image" zoomable="true" >}}

You can then click the green `✓ Go` button - or now visit the **API | Services** menu entry  - to access the `Pastry API - 2.0` details:

{{< image src="images/sample-pastry.png" alt="image" zoomable="true" >}}

You'll be able to access the details, documentation and request/response samples for each operation/resource in the screen below. One important bit of information here is the **Mocks URL** field: this is the endpoint where Microcks automatically deploy a mock for this operation. The table just below shows request/response pairs and a detailed URL with the HTTP verb showing how to invoke this mock.

{{< image src="images/sample-pastry-details.png" alt="image" zoomable="true" >}}

### Interacting with a Mock

At the end of the **Mock URL** line, you'll notice two icons and buttons. The first one allows you to copy the URL to the clipboard so that you can directly use it in a browser for example. The second one allows you to get a `curl` command to interact with the mocked API from the terminal. You can copy the URL for the `Millefeuille` example and give it a try in your terminal:

```sh
$ curl -X GET 'http://localhost:8585/rest/API+Pastry+-+2.0/2.0.0/pastry/Millefeuille' -H 'Accept: application/json'

{"name":"Millefeuille","description":"Delicieux Millefeuille pas calorique du tout","size":"L","price":4.4,"status":"available"}
```

Ta Dam! 🎉

## What's next?

Now that you have basic information on how to setup and use Microcks, you can go further with:

* Importing additional samples from `MicrocksIO Samples API` in the [Microcks Hub](https://hub.microcks.io),
* Continuing your tour with [Getting started with Tests](/documentation/tutorials/getting-started-tests),
* Writing your own artifacts files and creating:
   * your first [OpenAPI mock](/documentation/tutorials/first-rest-mock),
   * your first [GraphQL mock](/documentation/tutorials/first-graphql-mock),
   * your first [gRPC mock](/documentation/tutorials/first-grpc-mock),
   * or your first [AsyncAPI mock with Kafka](/documentation/tutorials/first-asyncapi-mock).

