---
draft: false
title: "Getting started with Tests"
date: 2020-10-19
publishdate: 2020-10-19
lastmod: 2024-05-15
weight: 2
---

## Quickstart (continue) with Tests

Now that you have finished the [Getting started](/documentation/tutorials/getting-started) guide, you should have a Microcks installation up-and-running and filled with some samples from the Microcks repository. The goal of this page is to show you how you can use Microcks to achieve **Contract Testing** for your API, either manually from the UI or in an automated way using the Microcks CLI tooling.

If you have not done it in the previous step, you will need to load one of Microcks samples: the `Pastry API - 2.0`. For that, refer to the previous [Getting started](/documentation/tutorials/getting-started).

{{< image src="images/sample-pastry.png" alt="image" zoomable="true" >}}

You'll see that this sample contains a number of different features. It will illustrate:

* Simple `GET` operation mocking and testing, 
* `Path parameters` matching and testing,
* Content negotiation matching and testing.

Now that we have the sample API registered in Microcks, we can deploy an implementation of this API contract. This will be our [System Under Test](https://en.wikipedia.org/wiki/System_under_test).


## Deploying the API implementation

We provide a basic implementation of the `API Pastry - 2.0` in version `2.0.0` API and you may find the source code of it within this [GitHub repository](https://github.com/microcks/api-lifecycle/tree/master/api-pastry-demo/api-implementations/quarkus-api-pastry). The component is available as the following container image: `quay.io/microcks/quarkus-api-pastry:latest`.

Before launching some contract-tests on this implementation, you'll need to run it locally still via [Docker](https://docs.docker.com/get-docker/) or [Podman](https://podman.io/).

Open a new terminal window and run this command to locally launch the implementation:

```sh
$ docker run -i --rm -p 8282:8282 quay.io/microcks/quarkus-api-pastry:latest

WARNING: The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested
__  ____  __  _____   ___  __ ____  ______ 
 --/ __ \/ / / / _ | / _ \/ //_/ / / / __/ 
 -/ /_/ / /_/ / __ |/ , _/ ,< / /_/ /\ \   
--\___\_\____/_/ |_/_/|_/_/|_|\____/___/   
2024-05-15 15:48:46,996 INFO  [io.quarkus] (main) quarkus-api-pastry 1.0.0-SNAPSHOT native (powered by Quarkus 1.7.1.Final) started in 0.421s. Listening on: http://0.0.0.0:8282
2024-05-15 15:48:47,025 INFO  [io.quarkus] (main) Profile prod activated. 
2024-05-15 15:48:47,026 INFO  [io.quarkus] (main) Installed features: [cdi, resteasy, resteasy-jaxb, resteasy-jsonb
```

Now you have everything ready to launch your first test with Microcks!

## Launching a test

Now that our component implementing the API is running, it's time to launch some tests to check if it is actually compliant with the API Contract. This is what we call **Contract Testing**. You can launch and run tests from the UI or from the [`microcks-cli`](/documentation/guides/automation/cli/) tool.

> 💡 
> As our API implement is running into a container bound on port 8282, it will be accessible at `http://localhost:8282` from our machine network. However, from the Microcks container perspective it will be accessible using the `http://host.docker.internal:8282` alias that allow accessing the machine network from inside a container.


### From the UI

You may already have seen it but there's a **NEW TEST...** button on the right hand side of the page detailing the **API Pastry** service. Hitting it leads you to the following form where you will be able to specify a target URL for the test, as well as a Runner — a testing strategy for your new launch:

{{< image src="images/sample-test-form.png" alt="image" zoomable="true" >}}

Just copy/paste the endpoint URL where your `quarkus-api-pastry` implementation can be reached here. Then select the `OPEN_API_SCHEMA` test strategy, and finally, hit the **Launch test !** button. This lead you to the following screen where you will wait for tests to run and finalize (green check marks should appear after some seconds).

{{< image src="images/sample-test-launch.png" alt="image" zoomable="true" >}}

Following the **Full results** link in the above screen will lead you to a screen where you'll have access to all the test details and request/responses content exchanged with the endpoint during the tests. Very handy for troubleshooting or comparing results on different environments!

{{< image src="images/sample-test-result.png" alt="image" zoomable="true" >}}


### From the CLI

Microcks also provides the [`microcks-cli`](/documentation/guides/automation/cli/) tool that can be used to automate the testing. Binary releases for Linux, MacOS or Windows platform are available on the GitHub [releases page](https://github.com/microcks/microcks-cli/releases).

You can downlaod the binary or just use the corresponding container image for a quick ride! Specify the `test` command followed by the API/Service name and version, the test endpoint URL, the runner as well as some connection credentials and it will launch the test for you:

```sh
$ docker run -it quay.io/microcks/microcks-cli:latest microcks-cli test \
        'API Pastry - 2.0:2.0.0' http://host.docker.internal:8282 OPEN_API_SCHEMA \
        --microcksURL=http://host.docker.internal:8585/api/ \
        --keycloakClientId=foo --keycloakClientSecret=bar \
        --insecure --waitFor=6sec

MicrocksClient got status for test "6644db75269ded17868d654c" - success: true, inProgress: true 
MicrocksTester waiting for 2 seconds before checking again or exiting.
Full TestResult details are available here: http://host.docker.internal:8585/#/tests/6644db75269ded17868d654c
```

The above URL will give you accees to the detailed report as we did via the UI.

You've just finished the Getting Started tour. Ta Dam! 🎉 You can now stop the Microcks and API implementation running containers in your terminal.

## What's next?

Now that you have basic information on how to use Microcks for mocking and testing, you can go further with:

* Writing your own artifacts files and creating:
   * your first [OpenAPI mock](/documentation/tutorials/first-rest-mock),
   * your first [GraphQL mock](/documentation/tutorials/first-graphql-mock),
   * your first [gRPC mock](/documentation/tutorials/first-grpc-mock),
   * or your first [AsyncAPI mock with Kafka](/documentation/tutorials/first-asyncapi-mock).
