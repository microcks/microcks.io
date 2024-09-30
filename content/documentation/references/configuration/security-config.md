---
draft: false
title: "Security Configuration"
date: 2024-04-29
publishdate: 2024-04-29
lastmod: 2024-09-30
weight: 2
---

## Overview

This page aims to give you a comprehensive reference on the configuration properties used within Microcks. These informations are the ideal companion of
the [Architecture & Deployment Options](/documentation/explanations/deployment-options) explanations and will be crucial for people who want to review
the different security related capabilities of a deployment.

## Network

### Using proxy for egress connections

You can force the main Webapp component to use a corporate proxy for egress using the `application.properties` file. No rpoxy is configured by default:

```properties
network.proxyHost=${PROXY_HOST:}
network.proxyPort=${PROXY_PORT:}
network.proxyUsername=${PROXY_USERNAME:}
network.proxyPassword=${PROXY_PASSWORD:}
network.nonProxyHosts=${PROXY_EXCLUDE:localhost|127.0.0.1|*.svc.cluster.local}
```

> 💡 As the Async Minion component is not expected to access remote resources, it is not expected to connect to a proxy.

## Identity Management

Since its inception, Microcks relies on a third party component named [Keycloak](https://www.keycloak.org) for managing security related topics like users identification, users authentication and permissions as well as API endpoints protection. Keycloak is also used for providing **Service Accounts** authentication and authorization. This topic is detailed in a [dedicated page](/documentation/explanations/service-account).

Basic installation of Microcks comes with its own Keycloak instance embedding the definitions of Microcks needed components into what is called a **realm**. Advanced installation of Microcks can reuse an existing Keycloak instance and will require your administrator to create a new dedicated [realm](https://www.keycloak.org/docs/latest/server_admin/index.html#_create-realm). We provide a sample of such a realm configuration that can be imported into your instance here in [Microcks realm full configuration](https://github.com/microcks/microcks/raw/master/install/keycloak-microcks-realm-full.json)

Basically, Microcks components need the reference of the Keycloak instance endpoint into an environment variable called `KEYCLOAK_URL`.

### Authentication

User Authentication in Microcks is delegated to the configured Keycloak instance using the [OpenID Connect Authorization Code Flow](https://www.keycloak.org/docs/latest/server_admin/index.html#authorization-code-flow). The Keycloak instance can be used as the direct source of user's Identity or can be used as [a broker for one or more](https://www.keycloak.org/docs/latest/server_admin/index.html#_identity_broker) configured Identity Providers.

> The default installation and realm settings comes with the **internal identity provider** with 3 default users: `user`, `manager` and `admin` that have the same `microcks123` password. Up to you to configure one [Identity Provider](https://www.keycloak.org/docs/latest/server_admin/index.html#_general-idp-config) attached to the realm Microcks is using.

The **realm** Microcks is using is an installation parameter that defaults to `microcks`. You can adapt it to either realm you want. See [Reusing an existing Keycloak](#reusing-an-existing-keycloak) section below.

On the client side (ie. in the browser), Microcks is using a client application called `microcks-app-js` that is configured to perform redirect to the public endpoint URL of the microcks app.

On the server side, Microcks is using a client application called `microcks-app` for checking and trusting JWT bearers provided by the frontend application API calls.

These parameters are set withing the `application.properties` configuration file. See and example below:

```properties
# Keycloak configuration properties
keycloak.auth-server-url=${KEYCLOAK_URL:http://localhost:8180}
keycloak.realm=microcks
keycloak.resource=microcks-app
keycloak.bearer-only=true
keycloak.ssl-required=external

# Spring Security adapter configuration properties
spring.security.oauth2.client.registration.keycloak.client-id=microcks-app
spring.security.oauth2.client.registration.keycloak.authorization-grant-type=authorization_code

# Keycloak access configuration properties
sso.public-url=${KEYCLOAK_PUBLIC_URL:${keycloak.auth-server-url}}
```

### Roles and Permissions

Microcks **realm** typically defines 3 application roles that are defined as [client roles](https://www.keycloak.org/docs/latest/server_admin/index.html#client-roles) on the Keycloak side. Theses roles are attached to the `microcks-app` client application.

These roles are:

* `user`: a regular authenticated user of the Microcks application. This is the default role that is automatically attached the first time a user succeed authenticating into the Microcks app,
* `manager`: a user identified as having management roles on the Microcks repository content. Managers have the permissions of adding and removing API & Services into the repository as well as configuring mocks operation properties
* `admin`: a user identified as having administration role on the Microcks instance. Admin have the `manager` persmission and are able to manage users, configure external repositories secrets or realize backup/restore operations.

Whether a connected user has these roles is checked both on the client and the server sides using [Keycloak adapters](https://www.keycloak.org/docs/latest/securing_apps/index.html).

#### Groups segmentation

As an optional security feature, you have the ability to segment the repository management persmissions depending on a `master` label you have chosen for organizing your repository. See [Organizing repository](/documentation/guides/administration/organizing-repository/) for introduction on `master` label.

For example, if you defined the `domain` label as the master with `customer`, `finance` and `sales` values, you'll be able to define users with the `manager` role **only** for the APIs & Services that have been labeled accordingly. Sarah may be defined as a `manager` for `domain=customer` and `domain=finance` services, while John may be defined as the `manager` for `domain=sales` APIs & services.

When this feature is enabled, Microcks will create as many groups in Keycloak as we have different values for this `master` label. These groups are organized in a hierarchy so that you'll have groups with such names `/microcks/manager/<label>` those members represents the `manager` of the resources labeled with `<label>` value.

This feature is enabled into the `features.properties` configuration file with following properties:

| Sub-Property | Description |
| ---------- | ----------------- |
| `enabled` | A boolean flag that turns on the feature. `true` or `false` |
| `artifact-import-allowed-roles` | A comma separated list of roles that you may restrict import of artifacts to. |

For example:

```properties
# features.properties
features.feature.repository-tenancy.enabled=true
features.feature.repository-tenancy.artifact-import-allowed-roles=admin,manager,manager-any
```

> 🗒️ The `manager-any` is not actually a role, it's a notation meaning *"A user that belong to any management group even if not endorsing the global manager role"*.


### Reusing an existing Keycloak

Microcks Helm Chart and Operator can be configured to reuse an already existing Keycloak instance for your organization.

First, you have to prepare your Keycloak instance to host and secure future Microcks deployment. Basically you have 2 options for this:

* **Create a new realm** using [Keycloak documentation](https://www.keycloak.org/docs/latest/server_admin/#proc-creating-a-realm_server_administration_guide) and choosing [Microcks realm full configuration](https://github.com/microcks/microcks/raw/master/install/keycloak-microcks-realm-full.json) as the file to import during creation,
* OR **Re-use an existing realm**, completing its definition with [Microcks realm addons configuration](https://github.com/microcks/microcks/blob/master/install/keycloak-microcks-realm-addons.json) by simply importing this file within realm configuration.

> 💡 You might want to change the `redirectUris` in the Microcks realm configuration file to the corresponding URI of the Microcks application, by default it is pointing to localhost.

Importing one or another of the Microcks realm configuration file will bring all the necessary clients, roles, groups and scope mappings. If you created a new realm, the Microcks configuration also brings default users you may later delete when configuring your [own identity provider in Keycloak](https://www.keycloak.org/docs/latest/server_admin/#_identity_broker).

Then, you actually have to deploy the Microcks instance configured for using external Keycloak. Depending whether you've used Helm or Operator to install Microcks, you'll have to customize your `values.yml` file or the `MicrocksInstall` custom resource but the properties have the same names in both installation methods:

```yaml
keycloak:
  install: false
  realm: my-own-realm
  url: keycloak.example.com:443
  privateUrl: http://keycloak.namespace.svc.cluster.local:8080      # Recommended
  serviceAccount: microcks-serviceaccount
  serviceAccountCredentials: ab54d329-e435-41ae-a900-ec6b3fe15c54   # Change recommended
```

The `privateUrl` is optional and will allow to prevent trusting requests from `webapp` component to Keycloak to go through a public address and network. In a Kubernetes deployment, you'll typically put there the cluster internal `Service` name.

The `serviceAccountCredentials` should typically be changed as this is the default value that comes with your realm setup. For an introduction on the purpose of service accounts in Microcks, check [Service Accounts](/documentation/explanations/service-account).

### Handling proxies for Keycloak access

Depending on your network configuration, authentication of request with Keycloak can be a bit tricky as Keycloak requires some [specific load-balancer or proxy settings](https://www.keycloak.org/server/reverseproxy). Typically, you way need to configure specific address ranges for proxies if you're not using the usual private IPv4 blocks.

This can be done specifying additional `extraProperties` into the `microcks` part of your configuration - either within `spec.microcks` path if you're using the Operator `MicrocksInstall` custom resource or from direct `microcks` path in `values.yml` when using the Helm chart. The configuration below typically declare a new IP range to treat as proxy in order to propertly forward proxy headers to the application code:

```yml
extraProperties:
  server:
    tomcat:
      remoteip:
        internal-proxies: 172.16.0.0/12
```

This configuration will initiaze a new `application-extra.properties` in the appropiate `ConfigMap`, allowing you to extend the `application.properties` with your
customizations.

### OAuth2/JWT configuration 

OAuth2/JWT detailed configuration is hosted in the `application.properties` file on the main Webapp component. We're using [Spring Security OAuth2](https://docs.spring.io/spring-security/reference/servlet/oauth2/login/core.html) configuration mechanism. If a `privateUrl` option is provided to access Keycloak, the `jwk-set-uri` property must
also be set to use the private url [to fetch the certificates from an internal network endpoint](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html#oauth2resourceserver-jwt-jwkseturi).

```properties
# Spring Security adapter configuration properties
[..]
spring.security.oauth2.client.registration.keycloak.scope=openid,profile
spring.security.oauth2.client.provider.keycloak.issuer-uri=${KEYCLOAK_URL}/realms/${keycloak.realm}
spring.security.oauth2.client.provider.keycloak.user-name-attribute=preferred_username
spring.security.oauth2.resourceserver.jwt.issuer-uri=${sso.public-url}/realms/${keycloak.realm}

# Uncomment this line if using a privateUrl to connect to Keycloak.
#spring.security.oauth2.resourceserver.jwt.jwk-set-uri=${KEYCLOAK_URL}/realms/${keycloak.realm}/protocol/openid-connect/certs
```

## Kafka

### Reusing an existing secured Kafka

Microcks Helm Chart and Operator can be configured to reuse an already existing Kafka broker instance for your organization.

As of today, Microcks supports connecting to SASL using JAAS and Mutual TLS secured Kafka brokers. For an introduction on these, please check [Authentication Methods](https://docs.confluent.io/platform/current/kafka/overview-authentication-methods.html).

For SASL using JAAS, you'll have to configure additional properties for accessing cluster CA cert and depending on SASL mechanism. The `truststoreSecrefRef` is actually a reference to a Kubernetes `Secret` that should be created first and reachable from Microcks instance:

```yaml
features:
  async:
    kafka:
      authentication:
        type: SASL_SSL            # SASL using JAAS authentication
        truststoreType: PKCS12    # JKS also possible.
        truststoreSecretRef:
          secret: my-kafka-cluster-ca-cert   # Name of Kubernetes secret holding cluster ca cert.
          storeKey: ca.p12                   # Truststore ca cert entry in Secret.
          passwordKey: ca.password           # Truststore password entry in Secret.
        saslMechanism: SCRAM-SHA-512
        saslJaasConfig: org.apache.kafka.common.security.scram.ScramLoginModule required username="scram-user" password="tDtDCT3pYKE5";
```

For mutual TLS, you'll have to configuration additional properties for accessing the client certificate. The `keystoreSecretRef` is actually a reference to a Kubernetes `Secret` that should be created first and reachable from Microcks instance:

```yaml
features:
  async:
    kafka:
      authentication:
        type: SSL                 # Mutual TLS authentication
        truststoreType: PKCS12    # JKS also possible.
        truststoreSecretRef:
          secret: my-kafka-cluster-ca-cert   # Name of Kubernetes secret holding cluster ca cert.
          storeKey: ca.p12                   # Truststore ca cert entry in Secret.
          passwordKey: ca.password           # Truststore password entry in Secret.
        keystoreType: PKCS12      # JKS also possible.
        keystoreSecretRef:
          secret: my-mtls-user        # Name of Kubernetes secret holding user client cert.
          storeKey: user.p12          # Keystore client cert entry in Secret.
          passwordKey: user.password  # Keystore password entry in Secret.
```

> 💡 We recommend having a in-depth look at the [Helm Chart README](https://github.com/microcks/microcks/tree/master/install/kubernetes) and the [Operator README](https://github.com/microcks/microcks-ansible-operator) to get the most up-to-date informations on detailed configuration.
