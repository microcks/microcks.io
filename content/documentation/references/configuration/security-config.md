---
draft: false
title: "Security Configuration"
date: 2024-04-29
publishdate: 2024-04-29
lastmod: 2024-05-16
weight: 2
---

## Keycloak

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
  privateUrl: http://keycloak.namespace.svc.cluster.local:8080/auth  # Optional
  serviceAccount: microcks-serviceaccount
  serviceAccountCredentials: ab54d329-e435-41ae-a900-ec6b3fe15c54    # Change recommended
```

The `privateUrl` is optional and will allow to prevent trusting requests from `webapp` component to Keycloak to go through a public address and network. In a Kubernetes deployment, you'll typically put there the cluster internal `Service` name.

The `serviceAccountCredentials` should typically be changed as this is the default value that comes with your realm setup. For an introduction on the purpose of service accounts in Microcks, check [Service Accounts](/documentation/explanations/service-account).

### Handling proxies for Keycloak access

Depending on your network configuration, authentication of request with Keycloak can be a bit tricky as Keycloak requires some [specific load-balancer or proxy settings](https://www.keycloak.org/docs/latest/server_installation/index.html#_setting-up-a-load-balancer-or-proxy). Typically, you way need to configure specific address ranges for proxies if you're not using the usual private IPv4 blocks.

This can be done specifying additional `extraProperties` into the `microcks` part of your configuration - either within `spec.microcks` path if you're using the Operator `MicrocksInstall` custom resource or from direct `microcks` path in `values.yml` when using the Helm chart. The configuration below typically declare a new IP range to treat as proxy in order to propertly forward proxy headers to the application code:

```yml
extraProperties:
  server:
    tomcat:
      remoteip:
        internal-proxies: 172.16.0.0/12
```


## Kafka

### Resuing an existing secured Kafka

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

> We recommend having a in-depth look at the [Helm Chart README](https://github.com/microcks/microcks/tree/master/install/kubernetes) and the [Operator README](https://github.com/microcks/microcks-ansible-operator) to get the most up-to-date informations on detailed configuration.




> 🪄 **To Be Created**
>
> This is a new documentation page that has to be written as part of our [Refactoring Effort](https://github.com/microcks/microcks.io/issues/81).
> 
> **Goal of this page**
> * Comprehensive reference of Security related configuration in Microcks
> * Should include: Keycloak realm settings, User management and RBAC, repository organisation