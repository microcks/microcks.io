---
draft: false
title: "Managing Users"
date: 2019-11-18
publishdate: 2019-11-18
lastmod: 2021-08-31
weight: 1
---

## Introduction

Since its inception, Microcks relies on a third party component named [Keycloak](https://www.keycloak.org) for managing security related topics like users identification, users  authentication and habilitations as well as API endpoints protection. Keycloak is also used for providing service accounts authentication and authorization. This topic is detailed in a [dedicated page](../../automating/service-account).

Basic installation of Microcks (through Kubernetes Operator, Helm Chart, OpenShift template or Docker-compose) comes with its own Keycloak instance embedding the definitions of Microcks needed components into what is called a **realm**. Advanced installation of Microcks can reuse an existing Keycloak instance and will require your administrator to create a new dedicated [realm](https://www.keycloak.org/docs/latest/server_admin/index.html#_create-realm). We provide a sample of such a realm configuration that can be imported into your instance [here](https://github.com/microcks/microcks/blob/master/install/docker-compose/keycloak-realm/microcks-realm-sample.json).

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

Microcks realm typically defines 3 application roles that are defined as [client roles](https://www.keycloak.org/docs/latest/server_admin/index.html#client-roles) on the Keycloak side. Theses roles are attached to the `microcks-app` client application.

These roles are:

* `user`: a regular authenticated user of the Microcks application. This is the default role that is automatically attached the first time a user succeed authenticating into the Microcks app,
* `manager`: a user identified as having management roles on the Microcks repository content. Managers should be allowed of adding and removing Services mocks into the repository as well as configuring mocks operation properties. In a near future, this role should be scoped by a classifier allowing to organize services into coherent groups,
* `admin`: a user identified as having administration role on the Microcks instance. Admin should be able to manage users, configure external repositories secrets or realize backup/restore operations.

Whether a connected user has these roles is checked both on the client and the server sides using [Keycloak adapters](https://www.keycloak.org/docs/latest/securing_apps/index.html).

### Technical notes

Whilst checks on the client side is disseminated into the pages code, endpoints authorization on the server side is centralized into the `application.properties` configuration file. This file is usually supplied as a `ConfigMap` into containerized environments.

See an excerpt below:

```properties
keycloak.resource=microcks-app
keycloak.use-resource-role-mappings=true

# Keycloak access configuration properties
keycloak.security-constraints[0].authRoles[0]=admin
keycloak.security-constraints[0].authRoles[1]=manager
keycloak.security-constraints[0].authRoles[2]=user
keycloak.security-constraints[0].securityCollections[0].name=Insecure stuffs
keycloak.security-constraints[0].securityCollections[0].patterns[0]=/api/services
keycloak.security-constraints[0].securityCollections[0].patterns[1]=/api/services/*
keycloak.security-constraints[0].securityCollections[0].patterns[2]=/api/jobs
keycloak.security-constraints[0].securityCollections[0].patterns[3]=/api/jobs/*
keycloak.security-constraints[0].securityCollections[0].patterns[4]=/api/tests
``` 

## Users management

Your can partially manage users directly from the Microcks GUI. "Partially" means that you are able to manage a user's roles within Microcks application but not able to create a new user. This action is reserved to your Identity Provider used through Keycloak configuration or to Keycloak itself if you choose to use it as a provider.

Users can only be managed by Microcks `admin` - we mean people having the `admin` role assigned. Users management is simply a thumbnail with the `Administration` page that is available from the vertical menu on the left once logged in as administrator. In order to be able to retrieve the list of users and operate changes, the user should also have **manage-users** and **manage-clients** role from **realm-management** Keycloak internal client. See [Keycloak documentation](https://www.keycloak.org/docs/latest/server_admin/index.html#_per_realm_admin_permissions) for more on this point.

{{< image src="images/users.png" alt="image" zoomable="true" >}}

### Group membership

From Microcks 1.4.0, you have the ability to segment the role attribution depending on the `master` label you have chosen for organizing your repository. See [Organizing repository](https://microcks.io/documentation/using/advanced/organizing/#rbac-security-segmentation) for details on this feature.

When this feature is enabled, Microcks will create as many groups in Keycloak as we have different values for this `master` label. These groups are organized in a hierarchy so that you'll have groups with such names `/microcks/manager/<label>` those members represents the `manager` of the resources labeled with `<label>` value.

Also, a new **Manage Groups** options appears in the option menu for each user. From this new modal window, you can easily manage group membership for a specified user as shown below: 

{{< image src="images/users-group-management.png" alt="image" zoomable="true" >}}