---
draft: false
title: "Getting started with Tests"
date: 2020-10-19
publishdate: 2020-10-19
lastmod: 2021-11-25
weight: 2
---

## Getting started (continue) with Tests

Now that you have finished the [Getting started](/documentation/getting-started) guide, you should have a Microcks installation up-and-running and filled with some samples from the Microcks repository. The goal of this page is to show you how you can use Microcks to achieve **Contract Testing** for your API, either manually from the UI or in an automated way using the CLI tooling.

If you have not done it in the previous step, you will need to load one of Microcks samples: the **Pastry API**. For that, just create a new <b>Importer</b> with the **Pastry API** name and this URL : `https://raw.githubusercontent.com/microcks/microcks/master/samples/APIPastry-openapi.yaml`

Once loaded, Microcks will discover the **API Pastry - 2.0** in version **2.0.0**. You will be able to browse the operations/resources and associated request/response samples of this service.

{{< image src="images/sample-pastry-details.png" alt="image" zoomable="true" >}}

You'll see that this sample contains a number of different features. It will illustrate:

* Simple `GET` operation mocking and testing, 
* `Path parameters` matching and testing,
* [Content negotiation](./using/advanced/#content-negocation-in-rest-mocks) matching and testing.

Now that we have the sample API registered in Microcks, we can deploy an implementation of this API contract. This will be our [System Under Test](https://en.wikipedia.org/wiki/System_under_test).


## Deploying the API Pastry implementation

We provide a basic implementation of the **API Pastry - 2.0** in version **2.0.0** API and you may find the source code of it within this [GitHub repository](https://github.com/microcks/api-lifecycle/tree/master/api-pastry-demo/api-implementations/quarkus-api-pastry). The component is available as the following container image: `quay.io/microcks/quarkus-api-pastry:latest`.

Follow the instructions based on the platform you used for deploying Microcks (Kubernetes or docker-compose).

### On Kubernetes

On Kubernetes, we recommend creating a dedicated `namespace` for holding the component. You can reuse our manifests to easily create a `Deployment` and associated `Service` as well as an `Ingress` that will allow you to expose the application outside the cluster. You'll need to edit this `Ingress` to fix the URL to suit your cluster settings.

```sh
$ kubectl create ns api-pastry
namespace/api-pastry created

$ kubectl create -f https://raw.githubusercontent.com/microcks/api-lifecycle/master/api-pastry-demo/api-implementations/quarkus-api-pastry/deployment.yml -n api-pastry
deployment.apps/quarkus-api-pastry created
service/quarkus-api-pastry created

$ kubectl create -f https://raw.githubusercontent.com/microcks/api-lifecycle/master/api-pastry-demo/api-implementations/quarkus-api-pastry/ingress.yml -n api-pastry
ingress.networking.k8s.io/quarkus-api-pastry created

$ kubectl edit ingress/quarkus-api-pastry -n api-pastry
ingress.extensions/quarkus-api-pastry edited
```

You can easily retrieve the URL of the ingress using the following command:

```sh
$ kubectl get ingress/quarkus-api-pastry -n api-pastry -o json | jq '.spec.rules[0].host'
"quarkus-api-pastry.192.168.64.8.nip.io"
```

### If you used docker-compose

On docker-compose, locally, you'll just have to open a new terminal window and run this command to locally launch the component:

```sh
$ docker run -i --rm -p 8282:8282 quay.io/microcks/quarkus-api-pastry:latest
__  ____  __  _____   ___  __ ____  ______ 
 --/ __ \/ / / / _ | / _ \/ //_/ / / / __/ 
 -/ /_/ / /_/ / __ |/ , _/ ,< / /_/ /\ \   
--\___\_\____/_/ |_/_/|_/_/|_|\____/___/   
2020-10-19 14:49:37,134 INFO  [io.quarkus] (main) quarkus-api-pastry 1.0.0-SNAPSHOT native (powered by Quarkus 1.7.1.Final) started in 0.104s. Listening on: http://0.0.0.0:8282
2020-10-19 14:49:37,135 INFO  [io.quarkus] (main) Profile prod activated. 
2020-10-19 14:49:37,135 INFO  [io.quarkus] (main) Installed features: [cdi, resteasy, resteasy-jaxb, resteasy-jsonb]
```

Depending on you system and docker version, the application endpoint will be reachable at `http://docker.for.mac.localhost:8282` or `http://docker.for.win.localhost:8282` or `http://localhost:8282` from you host network. However you'll have to use `http://host.docker.internal:8282` as the test endpoint when launching a step in next step.

> If you still encounter issues joining this container from Microcks main one, you may use the command `docker run -i --name pastry --network=docker-compose_default --rm -p 8282:8282 quay.io/microcks/quarkus-api-pastry:latest` to force the implementation to join the network that was created by the Microcks docker-compose. After that, you'll have to use `http://pastry:8282` as the test endpoint.

## Launching a test

Now that our component implementing the API is running, it's time to launch some tests to check if it is actually compliant with the API Contract. This is what we call **Contract Testing**. You can launch and run tests from the UI or from the [`microcks-cli`](../automating/cli/) tool.

### From the UI

You may already have seen it but there's a **NEW TEST...** button on the right hand side of the page detailing the **API Pastry** service. Hitting it leads you to the following form where you will be able to specify a target URL for the test, as well as a Runner — a testing strategy for your new launch:

{{< image src="images/sample-test-form.png" alt="image" zoomable="true" >}}

Just copy/paste the endpoint URL where your `quarkus-api-pastry` deployment can be reached here - either the Kubernetes Ingress URL or the local docker-compose one. Then select the `OPEN_API_SCHEMA` test strategy (read here for more on [tests runners](../using/tests/#test-runner)). And finally, hit the **Launch test !** button. This lead you to the following screen where you will wait for tests to run and finalize (green check marks should appear after some seconds).

{{< image src="images/sample-test-launch.png" alt="image" zoomable="true" >}}

Following the **Full results** link in the above screen will lead you to a screen where you'll have access to all the test details and request/responses content exchanged with the endpoint during the tests. Very handy for troubleshooting or comparing results on different environments!

{{< image src="images/sample-test-result.png" alt="image" zoomable="true" >}}


### From the CLI

Microcks also provides the [`microcks-cli`](../automating/cli/) tool that can be used to automate the testing. Binary releases for Linux, MacOS or Windows platform are available on the GitHub [releases page](https://github.com/microcks/microcks-cli/releases). Just download the binary corresponding to your system and put the binary into the `PATH` somewhere.

You can also use the corresponding container image for a quick ride! Just specify the `test` command followed by the API/Service name and version, the test endpoint URL, the runner as well as some connection credentials and it will launch the test for you:

```sh
$ docker run -it quay.io/microcks/microcks-cli:latest microcks-cli test \
        'API Pastry - 2.0:2.0.0' http://quarkus-api-pastry.192.168.64.8.nip.io OPEN_API_SCHEMA \
        --microcksURL=https://microcks.192.168.64.8.nip.io/api/ \
        --keycloakClientId=microcks-serviceaccount \
        --keycloakClientSecret=ab54d329-e435-41ae-a900-ec6b3fe15c54 \
        --insecure --waitFor=6sec
MicrocksClient got status for test "5f8eb1a5c696bd71fcdcb6ad" - success: false, inProgress: true 
MicrocksTester waiting for 2 seconds before checking again or exiting.
MicrocksClient got status for test "5f8eb1a5c696bd71fcdcb6ad" - success: true, inProgress: false 
```

> Of course, you will have to replace the test endpoint URL as well as the Microcks URL with the ones from your platform (e.g. `http://docker.for.mac.localhost:8282`, `http://docker.for.win.localhost:8282` for the API Pastry, `https://docker.for.mac.localhost:8080` or `https://docker.for.win.localhost:8080` for Microcks when using docker-compose)

## What's next?

Now that you have basic information on how to use Microcks for mocking and testing, you can go further with:

* Understanding how Microcks [compare to alternatives](/documentation/using/alternatives),
* Creating your definition files using [OpenAPI](/documentation/using/openapi), [AsyncAPI](/documentation/using/asyncapi), [SoapUI](/documentation/using/soapui) or [Postman](/documentation/using/postman),
* Using [exposed mocks](/documentation/using/mocks) and using variables,
* Executing your [tests on endpoints](/documentation/using/tests) where your services and API are deployed,
* Using [advanced features]((/documentation/using/advanced)) of Microcks and admin stuffs.
