---
draft: false
title: "External Dependencies"
date: 2023-10-26
publishdate: 2023-10-26
lastmod: 2023-10-26
weight: 20 #rem
---

## Introduction

Microcks is able to run Groovy scripts contained in your API mocks. Your scripts may need external dependencies that are not present in Microcks.
In the next section, you will find two approaches depending on whether you are using docker-compose or pure Kubernetes installation to provide such dependencies for your scripts.

## Docker-compose method

> The solution is similar for Podman-compose

1. Put your Jar files into a dedicated folder (i.e. ./lib)
2. Add the following lines into your compose file for the Microcks container:
```yaml
   volumes:
      - ./lib:/deployments/lib
    environment:
      - JAVA_OPTIONS=-Dloader.path=/deployments/lib
      - JAVA_MAIN_CLASS=org.springframework.boot.loader.PropertiesLauncher
      - JAVA_APP_JAR=app.jar
```
3. Restart and see the Jar files appended to the application classpath.
4. You can directly use the Java or Groovy classes from your Jar in a SCRIPT

## Pure Kubernetes method

1. Put your Jar files into a dedicated folder (i.e. ./lib)
2. Create a new Docker file that extends the Microcks provided image and embeds your libs
```bash
FROM quay.io/microcks/microcks-uber:latest

# Copy libraries jar files
COPY lib /deployments/lib

ENV JAVA_OPTIONS=-Dloader.path=/deployments/lib
ENV JAVA_MAIN_CLASS=org.springframework.boot.loader.PropertiesLauncher
ENV JAVA_APP_JAR=app.jar
```
3. Build, tag and push your docker image in your registry of choice
4. Reference this docker image in either values.yml for Helm or MicrocksInstall CR for Operator
5. Redeploy and see the Jar files appended to the application classpath on pod startup
6. You can directly use the Java or Groovy classes from your Jar in a SCRIPT

