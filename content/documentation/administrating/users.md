---
draft: false
title: "Managing Users"
date: 2019-11-18
publishdate: 2019-11-18
lastmod: 2019-11-19
menu:
  docs:
    parent: administrating
    name: Managing users
    weight: 10
toc: true
weight: 10 #rem
---

## Introduction

Since its inception, Microcks relies on a third party component named [Keycloak](https://www.keycloak.org) for managing security related topics like users identification, users  authentication and habilitations as well as API endpoints protection. Keycloak is also used for providing service accounts authentication and authorization. This topic is detailed in a [dedicated page](../automating/service-account).

Basic installation of Microcks (through Kubernetes Operator, Helm Chart, OpenShift template or Docker-compose) comes with its own Keycloak instance embedding the definitions of Microcks needed component into what is called a realm. Advanced installation of Microcks can reuse an existing Keycloak instance and will require your administrator to create a new dedicated [realm](https://www.keycloak.org/docs/latest/server_admin/index.html#_create-realm). We provide a sample of such a realm configuration that can be imported into your instance [here](https://github.com/microcks/microcks/blob/master/install/docker-compose/keycloak-realm/microcks-realm-sample.json).

Basically, Microcks own components only need the reference of the Keycloak instance endpoint - the URL with `/auth` suffix - into an environment variable called `KEYCLOAK_URL`.

## Authentication

Authentication in Microcks is indeed delegated to the configured Keycloak instance using the [OpenID Connect Authorization Code Flow](https://www.keycloak.org/docs/latest/server_admin/index.html#authorization-code-flow). The Keycloak instance can be used as the direct source of user's Identity or can be used as [a broker for one or more](https://www.keycloak.org/docs/latest/server_admin/index.html#_identity_broker) configured Identity Providers.

> The default installation comes with **no default identity provider** so it's mandatory to configure at least: either some directly managed users (see [User Management](https://www.keycloak.org/docs/latest/server_admin/index.html#_create-new-user)) **OR** one [Identity Provider]((https://www.keycloak.org/docs/latest/server_admin/index.html#_general-idp-config)) attached to the realm Microcks is configured to use.

### Technical notes

On the client side (ie. in the browser), Microcks is using a client application called `microcks-app-js` that is configured to perform redirect to the public endpoint URL of the microcks app.

On the server side, Microcks is using a client application called `microcks-app` for checking and trusting JWT bearers provided by the frontend application API calls.

All this parameters are set within the `application.properties` configuration file. This file is usually supplied as a `ConfigMap` into containerized environments.

See an excerpt below:

```properties
# Keycloak configuration properties
keycloak.auth-server-url=${KEYCLOAK_URL:http://localhost:8180/auth}
keycloak.realm=microcks
keycloak.resource=microcks-app
keycloak.bearer-only=true
keycloak.ssl-required=external
```

## Authorization

Microcks realm typically defines 3 application roles that are defined as [realm roles](https://www.keycloak.org/docs/latest/server_admin/index.html#realm-roles) on the Keycloak side.

These roles are:

* `user`: a regular authenticated user of the Microcks application. This is the default role that is automatically attached the first time a user succeed authenticating into the Microcks app,
* `manager`: a user identified as having management roles on the Microcks repository content. Managers should be allowed of adding and removing Services mocks into the repository as well as configuring mocks operation properties. In a near future, this role should be scoped by a classifier allowing to organize services into coherent groups,
* `admin`: a user identified as having administration role on the Microcks instance. Admin shoulb be able to manage users, configure external repositories secrets or realize backup/restore operations.

Whether a connected user has these roles is checked both on the client and the server sides using [Keycloak adapters](https://www.keycloak.org/docs/latest/securing_apps/index.html).

### Technical notes

Whilst checks on the client side is disseminated into the pages code, endpoints authorization on the server side is centralized into the `application.properties` configuration file. This file is usually supplied as a `ConfigMap` into containerized environments.

See an excerpt below:

```properties
# Keycloak access configuration properties
keycloak.security-constraints[0].authRoles[0]=admin
keycloak.security-constraints[0].authRoles[1]=manager
keycloak.security-constraints[0].authRoles[2]=user
keycloak.security-constraints[0].securityCollections[0].name=Insecure stuffs
keycloak.security-constraints[0].securityCollections[0].patterns[0]=/api/services
keycloak.security-constraints[0].securityCollections[0].patterns[1]=/api/services/count
keycloak.security-constraints[0].securityCollections[0].patterns[2]=/api/jobs
keycloak.security-constraints[0].securityCollections[0].patterns[3]=/api/jobs/count
keycloak.security-constraints[0].securityCollections[0].patterns[4]=/api/tests
``` 

## Users management

Starting with Microcks version `0.8.0`, we add the ability to partially manage users directly from the Microcks GUI. "Partially" means that you are able to manage a user's roles within Microcks application but not able to create a new user. This action is reserved to your Identity Provider used through Keycloak configuration or to Keycloak itself if you choose to use it as a provider.

Users can only be managed by Microcks `admin` - we mean people having the `admin` role assigned. Users management is simply a thumbnail with the `Administration` page that is available from the vertical menu on the left once logged in as administrator. In order to be able to retrieve the list of users and operate changes, the user should also have **manage-users** role from **realm-management** Keycloak internal client. See [Keycloak documentation](https://www.keycloak.org/docs/latest/server_admin/index.html#_per_realm_admin_permissions) for more on this point.

![users](/images/users.png)