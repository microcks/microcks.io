---
draft: false
title: "With Docker Compose"
date: 2024-04-30
publishdate: 2024-04-30
lastmod: 2024-05-24
weight: 2
---

This guide shows you how to install and run Microcks using Docker Compose.

[Docker Compose](https://docs.docker.com/compose/) is a tool for easily testing and running multi-container applications. [Microcks](https://microcks.io/) offers a simple way to set up the minimal required containers to have a functional environment on your local computer.

## Usage

To get started, make sure you have [Docker installed](https://docs.docker.com/get-docker/) on your system.

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
docker compose up -d
```

This will start the required containers and setup a simple environment for you to use.

Open a new browser tab and point to the `http://localhost:8080` endpoint. This will redirect you to the [Keycloak](https://www.keycloak.org/) sign-in page for login. Use the following default credentials to login into the application:

* **Username:** `admin`
* **Password:** `microcks123`

You will be redirected to the main dashboard page.

## Enabling Asynchronous API features

Support for Asynchronous API features of Microcks are not enabled by default into the `docker-compose.yml` file. If you feel your local machine has enough resources to afford it, you can enable them using a slightly different command line.

In your terminal use the following command instead:

```sh
docker compose -f docker-compose.yml -f docker-compose-async-addon.yml up -d
```

Docker compose is now launching additional containers, namely `zookeeper`, `kafka` and the `microcks-async-minion`. The above command should produce the following output:

```sh
Creating network "docker-compose_default" with the default driver
Creating microcks-zookeeper       ... done
Creating microcks-db              ... done
Creating microcks-sso             ... done
Creating microcks-postman-runtime ... done
Creating microcks                 ... done
Creating microcks-kafka           ... done
Creating microcks-async-minion    ... done
```

You may want to check our [blog post](/blog/async-features-with-docker-compose) for a detailed walkthrough on starting Async features on docker-compose.

If you're feeling lucky regarding your machine, you can even add the [Kafdrop](https://github.com/obsidiandynamics/kafdrop) utility to visualize and troubleshoot Kafka messages with this command:

```sh
docker compose -f docker-compose.yml -f docker-compose-async-addon.yml -f kafdrop-addon.yml up -d
```

## Development mode

A development oriented mode, without the Keycloak service is also available thanks to: 

```sh
docker compose -f docker-compose-devmode.yml up -d
```

This configuration enabled Asynchronous API features in a very lightweight mode using [Red Panda broker](https://redpanda.com/) instead of full-blown Apache Kafka distribution.

## Wrap-up

You just installed Microcks on your local machine using Docker Compose and terminal commands. Congrats! 🎉

You have discover that Microcks provides a bunch of default profiles to use different capabilities of Microcks depending on your working situation. Advanced profiles are using local configuration files mounted from the `/config` directory. You can refer to the [Application Configuration Reference](/documentation/references/configuration/application-config) to get the full list of configuration options.