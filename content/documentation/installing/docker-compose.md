---
draft: false
title: "Installing with docker-compose"
date: 2019-09-01
publishdate: 2019-09-01
lastmod: 2020-03-26
menu:
  docs:
    parent: installing
    name: Installing with docker-compose
    weight: 30
toc: true
weight: 30 #rem
---

## Localhost installation

For those of you familiar with simple Docker Compose, a <code>docker-compose</code> file is available within GitHub repository and can be used to rapidly test up things. First step is to clone the repository, prepare TLS certificates and then to execute docker-compose with local clone. For easy certificates generations, we've have prepared a sole script that takes care of generating everything in a local `/keystore` folder. Just follow this procedure:

```sh      
$ git clone https://github.com/microcks/microcks.git
$ cd microcks/install/docker-compose
$ ./setup-tls-run.sh
[...]
Starting Microcks using docker-compose ...
------------------------------------------
Stop it with: docker-compose -f microcks.yml stop
Re-launch it with: docker-compose -f microcks.yml start
Clean everything with: docker-compose -f microcks.yml down
------------------------------------------
Go to https://localhost:8080 to use it
Having issues? Check you have changed microcks.yml to your platform

Starting microcks-keycloak        ... done
Starting microcks-mongo           ... done
Starting microcks-postman-runtime ... done
Starting microcks                 ... done
```

> Depending on your operating system, you'll have to first edit the `microcks.yml` file to comment and uncomment the value for `KEYCLOAK_URL` variable. Use the `docker.for.mac.localhost` or `docker.for.win.localhost` values accordingly.

After some minutes and components have been deployed, you should end up with a Spring-boot container, a MongoDB container, a Postman-runtime and a Keycloak container like in the trace below. The default user is <code>admin</code> with <code>123</code> password. The Microcks application is now available on <code>https://localhost:8080</code> URL.

```sh
$ docker ps
CONTAINER ID        IMAGE                                      COMMAND                  CREATED             STATUS              PORTS                    NAMES
6a563e9d87c1        microcks/microcks:latest                  "/bin/sh -c 'exec ..."   6 days ago          Up 33 seconds       0.0.0.0:8080->8080/tcp   microcks
162e99a97a6f        microcks/microcks-postman-runtime:latest   "node app.js"            6 days ago          Up 39 seconds       3000/tcp                 microcks-postman-runtime
b3cb4840597b        mongo:3.3.12                               "/entrypoint.sh mo..."   6 days ago          Up 39 seconds       27017/tcp                microcks-mongo
949e0b9bdac6        jboss/keycloak:3.4.0.Final                 "/opt/jboss/docker..."   6 days ago          Up 38 seconds       0.0.0.0:8180->8080/tcp   microcks-keycloak
```

## Server installation
      
When installing on a shared server that will be accessed from some other places and machines, you'll need to tweak some configuration files before launching the <code>docker-compose</code> command. The properties to setup/update in that case are the URL to access and redirect to Keycloak server.

You'll also need some valid certs, keystore and trustore in the `keycloak` folder for both the Microks and the Keycloak components. You can use this simple useful docker image for generating them:

```sh
$ docker run -v $PWD/keystore:/certs -e SERVER_HOSTNAMES="myserver.example.com" -it nmasse/mkcert:0.1
$ mv ./keystore/server.crt ./keystore/tls.crt
$ mv ./keystore/server.key ./keystore/tls.key
$ mv ./keystore/server.p12 ./keystore/microcks.p12
$ ls keystore/
keystore.jks   microcks.p12   rootCA-key.pem rootCA.pem     tls.crt        tls.key        truststore.jks
```

Here are below the basic commands for doing the setup:

```sh
$ hostname -f
  myserver.example.com
$ cd microcks/install/docker-compose/
$ cp keycloak-realm/microcks-realm-sample.json keycloak-realm/microcks-realm-sample.json.bak
$ apt-get install -y jq docker-compose

$ jq '.applications |= map(if .name == "microcks-app-js" then .redirectUris = [ "https://myserver.example.com:8080/*" ] else . end)' keycloak-realm/microcks-realm-sample.json.bak > keycloak-realm/microcks-realm-sample.json
$ perl -i.bak -pe 's|KEYCLOAK_URL=https://localhost:8543/auth|KEYCLOAK_URL=https://myserver.example.com:8543/auth|' microcks.yml

$ sudo docker-compose -f microcks.yml up -d
```

All this directives are grouped into a single script named <code>setup-microcks-apt.sh</code> you'll find into the <code>install/docker-compose</code> directory. You can use it to setup your single server installation of Microcks. Just run the <code>docker-compose -f microcks.yml up -d</code><br/> command after having used this script.


## Quick Azure installation

We provide this side project [microcks/microcks-azure](https://github.com/microcks/microcks-azure) for easily setting up a demo server on Azure. This project reuse some form of the simple script exposed above, triggered by the Azure template instanciation.
