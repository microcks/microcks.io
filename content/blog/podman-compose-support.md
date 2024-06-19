---
title: Podman Compose support in Microcks 
date: 2021-02-25
image: "images/blog/podman-compose-support.png"
author: "Nicolas Masse"
type: "regular"
description: "Podman Compose support in Microcks"
draft: false
---

While [Docker](https://docker.io) is still the #1 option for software packaging and installation on the developer laptop, [Podman](https://podman.io) is gaining traction. Podman advertises itself as a drop-in replacement for Docker. Just put `alias podman=docker` and you would be good to go, they said 😉

Whilst the reality is a bit more nuanced, we made the necessary adjustment to make it as simple. Today it is a pleasure to contribute back this adaptation to the Microcks community! It will allow Podman early and happy adopters - like me - to run Microcks on their laptop in the safest way.

{{< image src="images/blog/podman-compose-support.png" alt="image" zoomable="true" >}}

> Starting as of version `1.2.0` of Microcks, we thus announce the Podman Compose support for quickly getting started with Microcks on your laptop. We still recommend using Kubernetes ☸️ for serious use-cases 😉

## Give it a try!

As explained in the [Installing with podman-compose doc](../../documentation/guides/installation/podman-compose), you should first ensure that you have [Podman](https://podman.io/getting-started/installation) and [Podman Compose](https://github.com/containers/podman-compose) packages installed.

Then it's just a matter of cloning the repository, navigating to correct folder and running our supporting script that runs Podman in **rootless** mode:

```sh
$ git clone https://github.com/microcks/microcks.git
$ cd microcks/install/podman-compose
$ ./run-microcks.sh
Running rootless containers...
Discovered host IP address: 192.168.3.102

Starting Microcks using podman-compose ...
------------------------------------------
Stop it with:  podman-compose -f microcks.yml --transform_policy=identity stop
Re-launch it with:  podman-compose -f microcks.yml --transform_policy=identity start
Clean everything with:  podman-compose -f microcks.yml --transform_policy=identity down
------------------------------------------
Go to https://localhost:8080 - first login with admin/123
Having issues? Check you have changed microcks.yml to your platform

using podman version: podman version 2.1.1
podman run [...]
```

🎉 This will start the required containers and setup an simple environment for your usage.

Open a new browser tab and point to the `http://localhost:8080` endpoint. This will redirect you to the [Keycloak](https://www.keycloak.org/) Single Sign On page for login. Use the following default credentials (**admin**/**123**) to login into the application and start using Microcks.

Want to see what's running? Check the running containers with:

```sh
$ podman ps
CONTAINER ID  IMAGE                                             COMMAND               CREATED         STATUS             PORTS                     NAMES
68faf7825db1  quay.io/microcks/microcks:latest                                        8 seconds ago   Up 7 seconds ago   0.0.0.0:8080->8080/tcp    microcks
71af3326ba9d  docker.io/jboss/keycloak:10.0.1                   -b 0.0.0.0 -Dkeyc...  9 seconds ago   Up 9 seconds ago   0.0.0.0:8180->8080/tcp    microcks-keycloak
5f5ee84c76fd  quay.io/microcks/microcks-postman-runtime:latest  node app.js           10 seconds ago  Up 10 seconds ago  0.0.0.0:3000->3000/tcp    microcks-postman-runtime
d2e8d1066c48  docker.io/library/mongo:3.4.23                    mongod                11 seconds ago  Up 11 seconds ago  0.0.0.0:27017->27017/tcp  microcks-mongo
```

## Want to have more?

Podman adopt a very different architecture from Docker: it involves no daemon at all and can run as a regular user (**rootless** mode) or as root (**rootfull** mode).

If your a Podman user and hapy with it (or if you struggle making it working 😉) come and say hi! on our [Discord chat](https://microcks.io/discord-invite/) 🐙