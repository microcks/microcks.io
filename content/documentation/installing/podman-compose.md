---
draft: false
title: "Installing with podman-compose"
date: 2021-02-25
publishdate: 2021-02-25
lastmod: 2023-06-21
menu:
  docs:
    parent: installing
    name: Installing with podman-compose
    weight: 31
toc: true
weight: 30 #rem
---

[Podman Compose](https://github.com/containers/podman-compose) is a tool for easily testing and running multi-container applications. [Microcks](https://microcks.io/) offers a simple way to set up the minimal required containers to have a functional environment on your local computer. This procedure has been successfully tested with Podman `2.1.1` onto [Fedora 33+](https://getfedora.org/) and should be OK on [CentOS Stream 8+](https://www.centos.org/centos-stream/) and [RHEL 8+](https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux) distributions too.

## Usage

To get started, make sure you first have the [Podman](https://podman.io/getting-started/installation) and the [Podman Compose](https://github.com/containers/podman-compose) packages installed on your system.

Then, in your terminal issue the following commands:

1. Clone this repository.

   ```sh
   git clone https://github.com/microcks/microcks.git --depth 10
   ```

2. Change to the install folder

   ```sh
   cd microcks/install/podman-compose
   ```

3. Spin up the containers in [rootless mode](https://github.com/containers/podman/blob/master/docs/tutorials/rootless_tutorial.md) using our utility script:

   ```sh
   $ ./run-microcks.sh

   On macos, need to get the userid and groupid from postman machine.
   Assuming this machine is named 'podman-machine-default'. Change name in script otherwise.

   Starting Microcks using podman-compose ...
   ------------------------------------------
   Stop it with: podman-compose -f microcks.yml --podman-run-args='--userns=keep-id:uid=501,gid=1000' stop
   Re-launch it with: podman-compose -f microcks.yml --podman-run-args='--userns=keep-id:uid=501,gid=1000' start
   Clean everything with: podman-compose -f microcks.yml --podman-run-args='--userns=keep-id:uid=501,gid=1000' down
   ------------------------------------------
   Go to https://localhost:8080 - first login with admin/microcks123
   Having issues? Check you have changed microcks.yml to your platform

   podman-compose -f microcks.yml --podman-run-args='--userns=keep-id:uid=501,gid=1000' up -d
   ```

This will start the required containers and setup a simple environment for your usage.

Open a new browser tab and point to the `http://localhost:8080` endpoint. This will redirect you to the [Keycloak](https://www.keycloak.org/) Single Sign On page for login. Use the following default credentials to login into the application:

* **Username:** admin
* **Password:** microcks123

You will be redirected to the main dashboard page. You can now start [using Microcks](https://microcks.io/documentation/getting-started/#using-microcks).


### Enabling Asynchronous API features

Support for Asynchronous API features of Microcks are not enabled by default. If you feel your local machine has enough resources to afford it, you can enable them using a slightly different command line.

In your terminal use the following command instead:

   ```sh
   $ ./run-microcks.sh async

   On macos, need to get the userid and groupid from postman machine.
   Assuming this machine is named 'podman-machine-default'. Change name in script otherwise.

   Starting Microcks using podman-compose ...
   ------------------------------------------
   Stop it with: podman-compose -f microcks.yml -f microcks-template-async-addon.yml --podman-run-args='--userns=keep-id:uid=501,gid=1000' stop
   Re-launch it with: podman-compose -f microcks.yml -f microcks-template-async-addon.yml --podman-run-args='--userns=keep-id:uid=501,gid=1000' start
   Clean everything with: podman-compose -f microcks.yml -f microcks-template-async-addon.yml --podman-run-args='--userns=keep-id:uid=501,gid=1000' down
   ------------------------------------------
   Go to https://localhost:8080 - first login with admin/microcks123
   Having issues? Check you have changed microcks.yml to your platform

   podman-compose -f microcks.yml -f microcks-template-async-addon.yml --podman-run-args='--userns=keep-id:uid=501,gid=1000' up -d
   ```

Podman compose is now launching additional containers, namely `zookeeper`, `kafka` and the `microcks-async-minion`.

You may want to check our [blog post](../../../blog/async-features-with-docker-compose) for a detailed walkthrough on starting Async features on docker-compose (Podman compose is very similar).

### Un-authenticated mode

A "keycloakless" version of docker compose is available thanks to: 

   ```sh
   $ ./run-microcks.sh dev
   ```

This configuration enabled Asynchronous API features in a very lightweight mode using [Red Panda broker](https://redpanda.com/) instead of full-blown Apache Kafka distribution.