---
draft: false
title: "Adding external dependencies"
date: 2023-10-26
publishdate: 2023-10-26
lastmod: 2025-01-17
weight: 20 #rem
---

## Overview

This guide is a walkthrough, that exposes Microcks extension capabilities and explain how to leverage them. By the end of this tour, you should be able to apply your customizations and figure out the possibilities it offers.

> 💡 This guide is actually an adaptation of the excellent [CNAM](https://assurance-maladie.ameli.fr/qui-sommes-nous)'s blog post here: [Extend Microcks with custom libs and code](/blog/extend-microcks-with-custom-libs/) that provides comprehensive samples on how to apply the below principles.

This guide is organized in 3 different steps you'll have to follow to test and produce a robust extended version of Microcks:

1. **Identify the extension use-case** and the component you'll need to extend,
2. **Locally extend and test** your additions of container image,
3. **Build a final custom image** embedding your additons for easy distribution.

Let's jump in! 🪂

## 1. Identify use-cases

At time of writing, there are 2 extension points may be used to extend the built-in features of Microcks:

1️⃣ The [`SCRIPT` dispatcher](/documentation/explanations/dispatching/#script-dispatcher) that runs Groovy scripts may need additional dependencies, allowing you to easily reuse your own or third-party libraries across all your mocks. Think about:
  * Parsing and analyzing some custom headers or message envelopes,
  * Gathering external data to enrich your response with dynamic content,
  * Reusing rich datasets or decision engines for smarter responses,
  * Applying custom security validation.

2️⃣ The Async Minion component can require additional security mechanism customization when accessing external brokers like Kafka or supporting different JMS implementations.

Based on your knowledge of [Microcks Architecture and Deployment Options](/documentation/explanations/deployment-options), you may have guessed that use-cases:

* from 1️⃣ will require extending the *main WebApp component*;
* whereas use-cases from 2️⃣ will require extending the *Async Minion component*.

## 2. Locally extend container images

The first step is very convenient when you’re having a local evaluation of Microcks using the [Docker Compose installation](/documentation/guides/installation/docker-compose). A local `lib` folder can be simply mounted within the image `/deployments/lib` directory and additional `JAVA_*` environment variables are set to load all the JARs found at this location.

> 🗒️ It's worth noting that even if we mentioned Docker Compose above, the solution is similar for Podman Compose.

### For Webapp component

1. Put your Jar files into a dedicated folder (i.e. `./lib`)
2. Add the following lines into your compose file for the Microcks container:

```yaml
    volumes:
      - ./lib:/deployments/lib
    environment:
      - JAVA_OPTIONS=-Dloader.path=/deployments/lib
      - JAVA_MAIN_CLASS=org.springframework.boot.loader.launch.PropertiesLauncher
      - JAVA_APP_JAR=app.jar
```

3. Restart and see the Jar files appended to the application classpath.
4. You can directly use the Java or Groovy classes from your Jar in a `SCRIPT`

### For Async Minion component

The things are very similar here excepted that the mount point in the Async Minion container is `/deployments/lib-ext` (`/deployments/lib` is used for internal purpose).

```yaml
    volumes:
      - "./config:/deployments/config"
      - "./lib:/deployments/lib-ext"
    environment:
      - QUARKUS_PROFILE=docker-compose
      - JAVA_CLASSPATH=/deployments/*:/deployments/lib/*:/deployments/lib-ext/*
```

## 3. Build custom container images

Once happy with your library integration test, the next natural step would be to package everything as a custom immutable container image. That way, you can safely deploy it to your Kubernetes environments or even provide it to your developers using Microcks via [our Testcontainers module](/documentation/guides/usage/developing-testcontainers).

### For Webapp component

For this, start writing this simple Dockerfile, extending the Microcks official image:

```dockerfile
FROM quay.io/microcks/microcks:latest

# Copy libraries jar files
COPY lib /deployments/lib

ENV JAVA_OPTIONS=-Dloader.path=/deployments/lib
ENV JAVA_MAIN_CLASS=org.springframework.boot.loader.launch.PropertiesLauncher
ENV JAVA_APP_JAR=app.jar
```

> 💡 In a real Enterprise environment, it would be better to directly fetch the versioned library from an Enterprise Artifact repository like a Maven-compatible one. This would allow you to have reproducible builds of your custom image. It’s usually just a matter of adding a curl command to your Dockerfile:
> ```dockerfile
> RUN curl -f "${REPOSITORY_URL}"/${libname}/${version}/${libname}-${version}.jar -o ${LIBDIR}/${libname}-${version}.jar
> ```

### For Async Minion component

For this, start writing this simple `Dockerfile`, extending the Microcks Async Minoing official image. Notice that here, we can reuse the `/deployments/lib` location as we’re not going to replace existing libs but augment them with our own ones:

```dockerfile
FROM quay.io/microcks/microcks-async-minion:latest

# Copy libraries jar files
COPY lib /deployments/lib

ENV JAVA_CLASSPATH=/deployments/*:/deployments/lib/*
```

We have set the `JAVA_CLASSPATH` to force the discovery of the new JAR files. 

## Wrap-up

With this guide, you’ve learned how to integrate private or third-party Java libraries to customize the behavior of Microcks during mock invocation or when integrating with external brokers. 🎉

These capabilities pave the way for advanced use cases like the processing of common message structures or the dynamic enrichments of datasets to produce the smartest mocks.
