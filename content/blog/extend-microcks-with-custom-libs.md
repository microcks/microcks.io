---
title: Extend Microcks with custom libs and code
date: 2024-01-24
image: "images/blog/cnam-extend-microcks-with-custom-libs-feature.png"
author: "Sebastien Fraigneau"
type: "regular"
description: "Extend Microcks with custom libs and code"
draft: false
---

With the recent Microcks `1.8.1` version, there’s an abundance of exciting enhancements, from improved OpenAPI references support to optimizations for seamless usage via [Testcontainers](https://testcontainers.com/modules/microcks/). But, in my humble opinion, a standout feature demands your attention. Introduced in `1.8.0` (see [#897](https://github.com/microcks/microcks/issues/897)) and now completed with `1.8.1` (see [#966](https://github.com/microcks/microcks/issues/966)), Microcks brings forth a game-changer: extensibility. Discover how to tailor and customize behaviors with your code or library, elevating your Microcks experience to heights!

{{< image src="images/blog/cnam-extend-microcks-with-custom-libs-feature.png" alt="image">}}

Defining and helping to ship this feature was the first contribution [the CNAM](https://assurance-maladie.ameli.fr/qui-sommes-nous) - the French National Healthcare System - initiated with the Microcks community. 

> As adopters with **a huge patrimony of mocks**, we needed a way to **customize some behaviors in a very scalable way.** 

Collaborating with the Microcks maintainers was an enriching experience that led to this post and a second one that will unveil more details on how we use the solution.

This post is written as a walkthrough, to expose Microcks extension capabilities and demonstrate them using some samples. By the end of this tour, you should be able to apply your customizations and figure out the possibilities it offers. We will also share some thoughts on whether engaging with structural customizations may be appropriate (or not). 

Without waiting, let’s go ahead!


## Extension capabilities

At the core of Microcks’ mocking engine are [Dispatchers](https://microcks.io/documentation/explanations/dispatching/). They are the pieces of logic that allow to match incoming requests and find the appropriate response. Dispatchers are generally deduced from your API artifacts, but they can be configured explicitly.

The `SCRIPT` dispatcher is the most versatile and powerful to integrate custom dispatching logic in Microcks. The scripts can be written in [Groovy](https://www.groovy-lang.org/) propose a very familiar syntax to Javascript users and come with an impressive number of built-in util features (JSON & XML, URL fetching, etc). However, implementing advanced processing logic and duplicating it on several APIs and versions can be cumbersome when done in pure Groovy with simple scripts!

That’s where our first extension capability comes into play, allowing you to easily reuse your own or third-party libraries across all your mocks. The use cases below have never been so easy thanks to this new capability:

* Parse and **analyze some custom headers** or message envelopes, 
* **Gather external data to enrich** your response with dynamic content,
* **Reuse rich datasets or decision engines** for smarter responses,
* **Apply custom security validation**.

As a complement in `1.8.1`, an extension endpoint has also been added to the Asynchronous part of Microcks on what is called the [async-minion](https://microcks.io/documentation/explanations/deployment-options/#complete-logical-architecture). You now can integrate Java libs as well to customize behavior. The first covered use-case is security mechanism customization when accessing external brokers like Kafka. Others will soon come (like supporting [different JMS implementations](https://github.com/microcks/microcks/issues/879) for example).


### Exploring the demo repository

We have set up a specific GitHub repository to illustrate those extension endpoints and capabilities. The [https://github.com/microcks/api-lifecycle/](https://github.com/microcks/api-lifecycle/tree/master/acme-lib) repository now contains an `acme-lib` folder holding all the resources you need to understand and play with Microcks extensions. Let’s have a look at this repository:


```sh
$ tree
=== OUTPUT ===
.
|____Dockerfile.acme
|____Dockerfile.acme.minion
|____README.md
|____config
| |____features.properties
| |____application.properties
|____docker-compose-acme.yml
|____docker-compose-acme-async.yml
|____docker-compose-mount.yml
|____docker-compose-mount-async.yml
|____podman-compose-mount.yml
|____lib
| |____acme-lib-0.0.1-SNAPSHOT.jar
|____src
| |____main
| | |____java
| | | |____org
| | | | |____acme
| | | | | |____lib
| | | | | | |____CustomAuthenticateCallbackHandler.java
| | | | | | |____Greeting.java
| | |____groovy
| | | |____org
| | | | |____acme
| | | | | |____lib
| | | | | | |____GroovyGreeting.groovy
```

As a starting point, you may check the `src/main/java` or `src/main/groovy` folders where is living our sample utilities:

* [`org.acme.lib.Greeting.java`](https://github.com/microcks/api-lifecycle/blob/master/acme-lib/src/main/java/org/acme/lib/Greeting.java) is just a Java class that holds a greeting logic in a `greet()` method,
* [`org.acme.lib.GroovyGreeting.groovy`](https://github.com/microcks/api-lifecycle/blob/master/acme-lib/src/main/groovy/org/acme/lib/GroovyGreeting.groovy) is a Groovy class that holds a greeting logic in a `greet()` method,
* [`org.acme.lib.CustomAuthenticateCallbackHandler.java`](https://github.com/microcks/api-lifecycle/blob/master/acme-lib/src/main/java/org/acme/lib/CustomAuthenticateCallbackHandler.java) is a Java Authentication callback handler that may be used in an OAuth authentication flow.

To simplify things, those resources have been compiled and packaged into a JAR file in the `lib` folder.

This repository also contains several `Dockerfile` or `docker-compose` files that will be used to illustrate the extension of Microcks using this library. Some `docker-compose` files will also use the properties files from the `config` folder.


## Main component extension

Let’s start with Microcks’ main component extension for reusing our library from the `SCRIPT` dispatcher.


### Simple docker-compose mount

The first way of doing things is very convenient when you’re having a local evaluation of Microcks using the [Docker-compose installation](https://microcks.io/documentation/guides/installation/docker-compose/). The local `lib` folder is simply mounted within the image `/deployments/lib` directory and additional `JAVA_*` environment variables are set to load all the JARs found at this location.

See it in action by starting this configuration:


```sh
docker-compose -f docker-compose-mount.yml up -d
```

You should have two containers running (`microcks` and `microcks-db`) at that point. You can use the application by opening your browser to [http://localhost:8080](http://localhost:8080) - or change the port in the compose file if already used. 

For a simple illustration, you may use one of [Microcks samples](https://microcks.io/documentation/tutorials/getting-started/#loading-a-sample) such as the `Pastry API`. Once loaded, you’ll need to edit the properties of the `GET /pastries` operation to access the [section allowing you to configure the dispatching rules](https://microcks.io/documentation/guides/usage/custom-dispatchers). Choose the `SCRIPT` dispatcher from the list and paste this simple script as new DIspatcher rules:

```groovy
def java = new org.acme.lib.Greeting();
def groovy = new org.acme.lib.GroovyGreeting();

log.info java.greet("World")
log.info groovy.greet("My Dear")

return "pastries_json"
```

This Groovy script will just illustrate the reuse of both the Java and Groovy classes - printing greeting information to the Microcks logs.

Once you have saved your changes, you can invoke the Microcks mock using a command like this one.

```sh
curl -X GET 'http://localhost:8080/rest/API+Pastry+-+2.0/2.0.0/pastry' -H 'Accept: application/json'
```

You may then inspect the logs of the running `microcks` container and see this kind of log traces:

```sh
08:47:26.491 DEBUG 1 --- [80-exec-10] i.github.microcks.web.RestController     : Found a valid operation GET /pastry with rules: def java = new org.acme.lib.Greeting();
def groovy = new org.acme.lib.GroovyGreeting();

log.info java.greet("World")
log.info groovy.greet("My Dear")

return "pastries_json"
08:47:27.272  INFO 1 --- [80-exec-10] i.g.m.util.script.ScriptEngineBinder     : Hello World!
08:47:27.279  INFO 1 --- [80-exec-10] i.g.m.util.script.ScriptEngineBinder     : Groovy My Dear!
08:47:27.279 DEBUG 1 --- [80-exec-10] i.github.microcks.web.RestController     : Dispatch criteria for finding response is pastries_json
```

Hooray! It works!  🎉 It demonstrates that Microcks can load arbitrary Java libraries and run them within your dispatching script. This sample is very basic but thanks to the huge Java ecosystem and Microcks features like request [context injection and response templating](https://microcks.io/documentation/references/templates/#context-expression), you have many possibilities!

You can now safely stop the containers:

```sh
docker-compose -f docker-compose-mount.yml down
```

> In the same way, you may want to use [Podman](https://microcks.io/documentation/guides/installation/podman-compose/) to run the microcks container with external libs. See it in action by starting this configuration:

```sh
podman pod create --name=pod_microcks --infra=true --share=net
podman-compose --in-pod microcks -f "podman-compose-mount.yml" up -d
```


### Building a custom image

Once happy with your library integration test, the next natural step would be to package everything as a custom immutable container image. That way, you can safely deploy it to your Kubernetes environments or even provide it to your developers using Microcks via the Testcontainers module. 

For this, start writing this simple Dockerfile, extending the Microcks official image:

```dockerfile
FROM quay.io/microcks/microcks:1.8.1

# Copy libraries jar files
COPY lib /deployments/lib

ENV JAVA_OPTIONS=-Dloader.path=/deployments/lib
ENV JAVA_MAIN_CLASS=org.springframework.boot.loader.PropertiesLauncher
ENV JAVA_APP_JAR=app.jar
```

We have simply reproduced what was done through the docker-compose previously: copying all the JAR files from `lib` and then setting JAVA environment variables. You may build your image with the ``acme/microcks-ext:nightly`` tag.

``` sh
docker build -f Dockerfile.acme -t acme/microcks-ext:nightly .
```

For a local test of your image, you can now run the `docker-compose-acme.yml` configuration:

```sh
docker-compose -f docker-compose-acme.yml up -d
```

If you have run the previous “Simple docker-compose mount” step, you don’t have anything to change as you’re reusing the same database. Otherwise, load the `Pastry API` sample and apply the configuration of the previous section.

Invoke your mock operations with the previous command as well and check the results in the logs:

```sh
08:39:01.062 DEBUG 1 --- [080-exec-6] i.github.microcks.web.RestController     : Found a valid operation GET /pastry with rules: def java = new org.acme.lib.Greeting();
def groovy = new org.acme.lib.GroovyGreeting();

log.info java.greet("World")
log.info groovy.greet("My Dear")

return "pastries_json"
08:39:01.433  INFO 1 --- [080-exec-6] i.g.m.util.script.ScriptEngineBinder     : Hello World!
08:39:01.437  INFO 1 --- [080-exec-6] i.g.m.util.script.ScriptEngineBinder     : Groovy My Dear!
08:39:01.438 DEBUG 1 --- [080-exec-6] i.github.microcks.web.RestController     : Dispatch criteria for finding response is pastries_json
```

Fantastic! 🚀 You now have a Microcks distribution customized with your extension available for all the mock services you will deploy!

You can now safely stop the containers:

```sh
docker-compose -f docker-compose-acme.yml down
```

> In a real Enterprise environment, it would be better to directly fetch the versioned library from an Enterprise Artifact repository like a Maven-compatible one. This would allow you to have reproducible builds of your custom image. It’s usually just a matter of adding a `curl` command to your Dockerfile:

```dockerfile
[...]
RUN curl -f "${REPOSITORY_URL}"/${libname}/${version}/${libname}-${version}.jar -o ${LIBDIR}/${libname}-${version}.jar
[...]
```

## Async Minion extension

In this second part, we are exploring the extension capabilities of the async-minion component. It is an optional component that deals with all the Async API-related features in Microcks. We will extend it with a custom authentication callback handler for connecting to a Kafka broker.

### Simple docker-compose mount

Here again, a very convenient way to start up is to use the [Docker-compose installation](https://microcks.io/documentation/guides/installation/docker-compose/). Contrary to the main component, the image `/deployments/lib` directory is already used for its purpose. So here, we will mount the local `lib` folder into `/deployments/lib-ext`. We must also to set an additional `JAVA_CLASSPATH` environment variable referencing this location.

See it in action by starting this configuration:

```sh
docker-compose -f docker-compose-mount-async.yml up -d
```

In this configuration, we will have four containers running - with additional `microcks-async-minion` and `microcks-kafka` corresponding to a Kafka broker:

```sh
$ docker ps
=== OUTPUT ===
CONTAINER ID   IMAGE                                            COMMAND                  CREATED         STATUS         PORTS                                                                       NAMES
5d314d3bf8b0   quay.io/microcks/microcks-async-minion:nightly   "/deployments/run-ja…"   5 seconds ago   Up 1 second    8080/tcp, 0.0.0.0:8081->8081/tcp                                            microcks-async-minion
052dd9777229   quay.io/microcks/microcks:nightly                "/deployments/run-ja…"   6 seconds ago   Up 5 seconds   0.0.0.0:8080->8080/tcp, 8778/tcp, 0.0.0.0:9090->9090/tcp, 9779/tcp          microcks
5ec66cc0910d   mongo:3.6.23                                     "docker-entrypoint.s…"   6 seconds ago   Up 5 seconds   27017/tcp                                                                   microcks-db
ca98a4b0ed9e   vectorized/redpanda:v22.2.2                      "/entrypoint.sh redp…"   6 seconds ago   Up 5 seconds   8081-8082/tcp, 0.0.0.0:9092->9092/tcp, 9644/tcp, 0.0.0.0:19092->19092/tcp   microcks-kafka
```

In this extension use case, our custom callback handler class ([`org.acme.lib.CustomAuthenticateCallbackHandler.java`](https://github.com/microcks/api-lifecycle/blob/master/acme-lib/src/main/java/org/acme/lib/CustomAuthenticateCallbackHandler.java)) is directly included in the async-minion configuration file. You may check [this line](https://github.com/microcks/api-lifecycle/blob/master/acme-lib/config/application.properties#L26) of the `application.properties` local file. 

Our callback handler implementation just adds a `Handling the callback...` log message when being invoked. You may then inspect the logs of the running `microcks-async-minion` container and see this kind of log trace:

```sh
2024-01-09 12:46:08,568 INFO  [io.sma.rea.mes.kafka] (main) SRMSG18229: Configured topics for channel 'microcks-services-updates': [microcks-services-updates]
Handling the callback...
2024-01-09 12:46:08,641 INFO  [org.apa.kaf.com.sec.oau.int.exp.ExpiringCredentialRefreshingLogin] (smallrye-kafka-consumer-thread-0) Successfully logged in.
```

Cool! 😎 We got it working here again! It demonstrates that Microcks async-minion can load arbitrary Java libraries and include them in the runtime. This sample is still basic but it happens to many more complex use cases, including specific broker implementations or future customization on mock messages sending or contract-testing process.

You can now safely stop the containers:

```sh
docker-compose -f docker-compose-mount-async.yml down
```

### Building a custom image

Finally, you may want to package a custom immutable container image for easily distributing this extended async-minion component. 

For this, start writing this simple Dockerfile, extending the Microcks official image. Notice that here, we can reuse the `/deployments/lib` location as we’re not going to replace existing libs but augment them with our `acme-lib-0.0.1-SNAPSHOT.jar` file.

```dockerfile
FROM quay.io/microcks/microcks-async-minion:1.8.1

# Copy libraries jar files
COPY lib /deployments/lib

ENV JAVA_CLASSPATH=/deployments/*:/deployments/lib/*
```

We have also set the `JAVA_CLASSPATH` to force the discovery of this new JAR file. You may then build your image with the ``acme/microcks-async-minion-ext:nightly`` tag.

``` sh
docker build -f Dockerfile.acme.minion -t acme/microcks-async-minion-ext:nightly .
```

For a local test of your image, you can now run the `docker-compose-acme-async.yml` configuration:

``` sh
docker-compose -f docker-compose-acme-async.yml up -d
```

If you have run the previous “Simple docker-compose mount” step, you know how our custom callback handler is misconfigured and what is supposed to do 😉

Check the results in the async-minion component logs:

```sh
2024-01-09 09:09:22,399 INFO  [io.sma.rea.mes.kafka] (main) SRMSG18229: Configured topics for channel 'microcks-services-updates': [microcks-services-updates]
Handling the callback...
2024-01-09 09:09:22,566 INFO  [org.apa.kaf.com.sec.oau.int.exp.ExpiringCredentialRefreshingLogin] (smallrye-kafka-consumer-thread-0) Successfully logged in.
```

It’s packed! 📦 You know how to extend and package a customized Microcks distribution fully! The new container images you produced can easily be reused via our Kubernetes Helm charts or Operator.

You can now safely stop the containers:

``` sh
docker-compose -f docker-compose-acme-async.yml down
```

## Wrap-up

In this post, we walked through a new feature of Microcks `1.8.1` that brings extension capabilities. You’ve learned how to integrate private or third-party Java libraries to customize the behavior of Microcks during mock invocation or when integrating with external brokers.

**These capabilities pave the way for advanced use cases like the processing of common message structures or the dynamic enrichments of datasets to produce the smartest mocks.** We’ll certainly have the opportunity to delve into more details of what we’ve done at [the CNAM](https://assurance-maladie.ameli.fr/qui-sommes-nous) in a future blog post 😉

As a final note, I’d like to add some caution when proceeding with extensions. Remember that mocks must have two important characteristics: they must be **quick to set up** and **easy to understand**. They play an important role in easing the communication between providers and consumers and building a shared knowledge of a Service interface and behavior. Going into very complex customization - you know: this dream of a universal, dynamic, automated approach for everything - can make you lose sight of these goals!

So stay lightweight, with easy-to-explain, clearly scoped extensions, and do not hesitate to ask for help from the Microcks community!

 
