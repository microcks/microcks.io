---
draft: false
title: "Getting started"
date: 2019-09-01
publishdate: 2019-09-01
lastmod: 2023-06-21
menu:
  docs:
    parent: using
    name: Getting started
    weight: 1
toc: true
weight: 30 #rem
---

## Quickstart

The easiest way to get started is using [Docker Compose](https://docs.docker.com/compose/) to start with minimal requirements. Make sure you have [Docker installed](https://docs.docker.com/get-docker/) on your system.

In your terminal issue the following commands:

1. Clone this repository.

   ```sh
   git clone https://github.com/microcks/microcks.git --depth 10
   ```

2. Change to the install folder

   ```sh
   cd microcks/install/docker-compose
   ```

3. Spin up the containers

   ```sh
   docker-compose up -d
   ```

This will start the necessary containers and setup a simple environment for you to use.

Open a new browser tab and point to the `http://localhost:8080` endpoint. This will redirect you to the [Keycloak](https://www.keycloak.org/) Single Sign On page for login. Use the following default credentials to login into the application:

* **Username:** `admin`
* **Password:** `microcks123`

## Using Microcks

Now you are ready to use Microcks for deploying your own services and API mocks! Before that let's have the look at the application home screen and introduce the main concepts. Using the application URL after installation, we should land on this page with two main entry points : <b>APIs | Services</b> and <b>Importers</b>.
			
<img src="/images/home-screen.png" class="img-responsive"/>
			
As you may have guessed, <b>APIs | Services</b> is for browsing your [micro]-services and API repository, discovering and accessing documentation, mocks, and tests. <b>Importers</b> will help you to populate your repository, allowing you to define Jobs that periodically scan your Git or Subversion repositories for new definition files, parse them and integrate them into your [micro]-services and API repository. Indeed <b>Importers</b> help you discover both new and modified <b>Services</b>. Before using your own service definition files, let's load some samples into Microcks for a test ride!

### Loading samples

We provide different samples that illustrate different ways of creating service definitions. The first two are definition files created using SoapUI and demonstrating SOAP and REST services. The third one is a definition file built using Postman and demonstrating the famous Petstore API. The fourth one is an OpenAPI v3 specification file and presents the advantages of holding both the contract specification and request/response examples. The last one is an AsyncAPI v2 specification file - [AsyncAPI](https://www.asyncapi.com/) being a new specification format dedicated to asychronous and event-oriented APIs. Using the <b>Importers</b> entry point from home screen or left navigation bar, use the Importers management page to add 5 new jobs. For each, you will be asked a name and a repository URL. Use the information below:

* Hello SOAP Service : `https://raw.githubusercontent.com/microcks/microcks/master/samples/HelloService-soapui-project.xml`
* Hello REST API : `https://raw.githubusercontent.com/microcks/microcks/master/samples/HelloAPI-soapui-project.xml`
* Petstore API : `https://raw.githubusercontent.com/microcks/microcks/master/samples/PetstoreAPI-collection.json`
* Pastry API : `https://raw.githubusercontent.com/microcks/microcks/master/samples/APIPastry-openapi.yaml`
* User signed-up API : `https://raw.githubusercontent.com/microcks/microcks/master/samples/UserSignedUpAPI-asyncapi.yml`
				

Now that you have created your Jobs, they are automatically <code>Activated</code> (this make them eligible to a periodically check) and <code>Imported</code> (this causes an immediate forced refresh).  After some moments and a page refresh, you should see the status of Jobs changed as in screenshot below:
			
<img src="/images/sample-jobs.png" class="img-responsive"/>

### Viewing services

Once sample jobs have been loaded, new services have been discovered and added to your repository, you can now visit the <b>API | Services</b> entry point from top navigation bar or home screen. You should see 5 new services with basic information on version and operations/resources handled by these services.
			
![sample-services](/images/sample-services.png)

### Viewing details

Now choosing the <b>Petstore API</b> REST API, you'll be able to access the details, documentation and request/response samples for each operation/resource in the screen below. One important bit of information here is the <b>Mocks URL</b> field: this is the endpoint where Microcks automatically deploy a mock for this operation. The table just below shows request/response pairs and a detailed URL with the HTTP verb showing how to invoke this mock.

![sample-details](/images/sample-details.png)
			
Using this URL, you can call the exposed mock for <b>Petstore API</b> using the following curl command:

```
$ curl "http://microcks.192.168.64.7.nip.io/rest/Petstore+API/1.0/pet/findByStatus?status=available&user_key=70f735676ec46351c6699c4bb767878a"
```

And you should receive the following response:

```json
[{"id":190192062,"category":{"id":0,"name":"string"},"name":"doggie","photoUrls":["string"],"tags":[{"id":0,"name":"string"}],"status":"available"},{"id":190192063,"category":{"id":0,"name":"string"},"name":"doggie","photoUrls":["string"],"tags":[{"id":0,"name":"string"}],"status":"available"},{"id":190192285,"category":{"id":0,"name":"string"},"name":"doggie","photoUrls":["string"],"tags":[{"id":0,"name":"string"}],"status":"available"},{"id":190192654,"category":{"id":0,"name":"string"},"name":"doggie","photoUrls":["string"],"tags":[{"id":0,"name":"string"}],"status":"available"},{"id":190192671,"category":{"id":0,"name":"string"},"name":"doggie","photoUrls":["string"],"tags":[{"id":0,"name":"string"}],"status":"available"},{"id":190192727,"category":{"id":0,"name":"string"},"name":"doggie","photoUrls":["string"],"tags":[{"id":0,"name":"string"}],"status":"available"},{"id":190192736,"category":{"id":0,"name":"string"},"name":"doggie","photoUrls":["string"],"tags":[{"id":0,"name":"string"}],"status":"available"},{"id":190192768,"category":{"id":0,"name":"string"},"name":"doggie","photoUrls":["string"],"tags":[{"id":0,"name":"string"}],"status":"available"},{"id":190192878,"category":{"id":0,"name":"string"},"name":"doggie","photoUrls":["string"],"tags":[{"id":0,"name":"string"}],"status":"available"},{"id":190192907,"category":{"id":0,"name":"string"},"name":"doggie","photoUrls":["string"],"tags":[{"id":0,"name":"string"}],"status":"available"},{"id":190193000,"category":{"id":0,"name":"string"},"name":"doggie","photoUrls":["string"],"tags":[{"id":0,"name":"string"}],"status":"available"},{"id":-98125093,"category":{"id":-517488397,"name":"EJvNbK"},"name":"LuEfMZATrHz","photoUrls":["XCXOVVkaxa","gNwYqHEmC","nvCvphDeuqztysUBNed","W","vmrxRIViyXqumolLIeoB","JRqHVxk","tCUGbegVHoXajm","UiHppQn"],"tags":[{"id":727599428,"name":"RemggEDzxPljbrlktdWf"},{"id":1987753751,"name":"zWqdKAGHMmhPPlomljaNtuvm"},{"id":1251632392,"name":"BAgtgtKOxZGdsS"},{"id":-1813025208,"name":"OkKxtfAkCMEICbbQDVPi"},{"id":-730110346,"name":"WshDF"},{"id":2100951153,"name":"yxUFSknQEleIAQCoocl"},{"id":-2135188117,"name":"M"},{"id":1352243140,"name":"koKHsjysHXW"},{"id":1696778814,"name":"KaihiyarcZkIzkkquWPZ"},{"id":659492963,"name":"xqIzulcBPzWMyUpQwQK"},{"id":-2118372841,"name":"naYFGuHmqDqOpfHH"}],"status":"available"},{"id":8739826599258110549,"category":{"id":0,"name":"string"},"name":"doggie","photoUrls":["string"],"tags":[{"id":0,"name":"string"}],"status":"available"}]
```

Ta Dam!

## Installing Microcks

If you require a more complex installation, Microcks may be installed in many ways depending your preferred environment. Basically, it can be installed on Kubernetes, on OpenShift, using Docker-Compose or directly using binary and source of Microcks.
	
### Installing with Kubernetes Operator

We provide an Operator that is distributed through [OperatorHub.io](https://operatorhub.io/operator/microcks) for easy install and management of Microcks as a Kubernetes-native application.

Have a look on this [page](/documentation/installing/operator) for more information.

### Installing on Kubernetes with Helm

We provide a Helm 3 `Chart` for using with [Helm](https://helm.sh/) Packet Manager. This is definitely the preferred way of installing apps on Kubernetes.

Have a look on this [page](/documentation/installing/kubernetes) for more information.
			
### Installing using Docker Compose

Docker Compose is really easy for a laptop or single demonstration server. You'll find instructions on how to use Docker Compose for installation [here](/documentation/installing/docker-compose).

## What's next?

Now that you have basic information on how to setup and use Microcks, you can go further with:

* Continuing your tour with [Getting started with Tests](/documentation/getting-started-tests),
* Enabling the [Asynchronous related features on Docker-Compose](/documentation/installing/docker-compose#enabling-asynchronous-api-features),
* Understanding how Microcks [compares with alternatives](/documentation/using/alternatives),
* Creating your definition files using [OpenAPI](/documentation/using/openapi), [AsyncAPI](/documentation/using/asyncapi), [SoapUI](/documentation/using/soapui), [Postman](/documentation/using/postman) or [GRPC](/documentation/using/grpc), 
* Using [exposed mocks](/documentation/using/mocks) and using variables,
* Executing your [tests on endpoints](/documentation/using/tests) where your services and API are deployed,
* Using [advanced features](/documentation/using/advanced) of Microcks and admin stuff.
