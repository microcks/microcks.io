---
draft: false
title: "Installing with podman-compose"
date: 2021-02-25
publishdate: 2021-02-25
lastmod: 2021-02-25
menu:
  docs:
    parent: installing
    name: Installing with podman-compose
    weight: 31
toc: true
weight: 30 #rem
---

# 

[Podman Compose](https://github.com/containers/podman-compose) is a tool for easily testing and running multi-container applications. [Microcks](https://microcks.io/) offers a simple way to set up the minimal required containers to have a functional environment on your local computer. This procedure has been successfully tested with Podman `2.1.1` onto [Fedora 33+](https://getfedora.org/) and should be OK on [CentOS Stream 8+](https://www.centos.org/centos-stream/) and [RHEL 8+](https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux) distributions too.

## Usage

To get started, make sure you first have the [Podman](https://podman.io/getting-started/installation) and the [Podman Compose](https://github.com/containers/podman-compose) packages installed on your system.

Then, in your terminal issue the following commands:

1. Clone this repository.

   ```sh
   git clone https://github.com/microcks/microcks.git
   ```

2. Change to the install folder

   ```sh
   cd microcks/install/podman-compose
   ```

3. Spin up the containers in [rootless mode](https://github.com/containers/podman/blob/master/docs/tutorials/rootless_tutorial.md) using our utility script:

   ```sh
   $ ./run-microcks.sh
   Running rootless containers...
   Discovered host IP address: 192.168.3.102
   
   Starting Microcks using podman-compose ...
   ------------------------------------------
   Stop it with:  podman-compose -f microcks.yml stop
   Re-launch it with:  podman-compose -f microcks.yml start
   Clean everything with:  podman-compose -f microcks.yml down
   ------------------------------------------
   Go to https://localhost:8080 - first login with admin/123
   Having issues? Check you have changed microcks.yml to your platform
   
   using podman version: podman version 2.1.1
   podman run [...]
   ```

This will start the required containers and setup a simple environment for your usage.

Open a new browser tab and point to the `http://localhost:8080` endpoint. This will redirect you to the [Keycloak](https://www.keycloak.org/) Single Sign On page for login. Use the following default credentials to login into the application:

* **Username:** admin
* **Password:** 123

You will be redirected to the main dashboard page. You can now start [using Microcks](https://microcks.io/documentation/getting-started/#using-microcks).

## Rootless or rootfull?

While the **rootless** mode looks very appealing it does not come as a free lunch.

In particular, in the **rootless** mode:

* containers have no IP address and no DNS aliases
* port redirection is done in userspace (**rootfull** mode uses `iptables` which is faster)
* the overlay storage is done in userspace with `fuse` (which is slower than the traditional `overlayfs` mount)

So, unless you need high performances or a specific network setup, you can use the **rootless** mode.

For the Podman support in Microcks, we aim to support both **rootless** and **rootfull** mode.

If you'd like to give a try to the **rootfull** mode, you'll have to enable the `dnsalias` plugin in the default `podman` network:

```sh
sudo podman network rm podman
sudo podman network create --subnet 10.88.0.0/16 podman
```

Once done you just need to run the same `run-microcks.sh` script with `sudo`.
