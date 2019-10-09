---
draft: false
title: "Installing on OpenShift"
date: 2019-09-01
publishdate: 2019-09-01
lastmod: 2019-09-02
menu:
  docs:
    parent: installing
    name: Installing on OpenShift
    weight: 30
toc: true
weight: 20 #rem
categories: [installing]
---

## Installing on OpenShift

### Instructions

The easiest way of installing Microcks for production use in most secured conditions is to do it on OpenShift. OpenShift in version 3.6 or greater is required. It is assumed that you have some kind of OpenShift cluster instance running and available. This instance can take several forms depending on your environment and needs:

* Full blown OpenShift cluster at your site, see how to [Install OpenShift at your site](https://docs.openshift.com/container-platform/3.6/install_config/index.html),
* Red Hat Container Development Kit on your laptop, see how to [Get Started with CDK](http://developers.redhat.com/products/cdk/get-started/),
* Lightweight Minishift on your laptop, see [Minishift project page](https://github.com/minishift/minishift).

> When running on OpenShift, take care that you did not have the <code>anyuid</code> capability enabled. This prevents Microcks from using OpenShift internal Identity Provider. <code>anyuid</code> addon is enabled by default on Red Hat CDK. You may want to turn it off by executing <code>oc adm policy remove-scc-from-group anyuid system:authenticated</code> as this is a bad practice.

Then you have to ensure that Microcks templates for OpenShift are added and available into your Cluster. Templates come in 2 flavors: ephemeral or persistent. In persistent mode, template will claim a persistent volume during instanciation, such a volume should be available to your team / project on OpenShift cluster. Add the templates, by using these commands :

```
$ oc create -f https://raw.githubusercontent.com/microcks/microcks/master/install/openshift/openshift-ephemeral-full-template.yml -n openshift
$ oc create -f https://raw.githubusercontent.com/microcks/microcks/master/install/openshift/openshift-persistent-full-template.yml -n openshift
```

Once this is done can now create a new project and instanciate the template of your choice ; either using the OpenShift web console or the command line. You will need to fill up some parameters during creation such as:

* the hostname for routes serving Microcks and embedded Keycloak (typically <code>component_name-project-app_domain</code>),</li>
* the URL for joining OpenShift Master,
* a name for an OAuth Client that will be created apart the app creation.

Typically, you'll got this kind of commands for a local Minishift instance:

```
$ oc new-project microcks --display-name="Microcks"
$ oc new-app --template=microcks-persistent \
   --param=APP_ROUTE_HOSTNAME=microcks-microcks.192.168.99.100.nip.io \
   --param=KEYCLOAK_ROUTE_HOSTNAME=keycloak-microcks.192.168.99.100.nip.io \
   --param=OPENSHIFT_MASTER=https://192.168.99.100:8443 \
   --param=OPENSHIFT_OAUTH_CLIENT_NAME=microcks-client
```

After some minutes and components have been deployed, you should end up with a Spring-boot Pod, a MongoDB Pod, a Postman-runtime Pod, a Keycloak Pod and a PostgreSQL Pod like in the screenshot below.<br/>

<img src="/images/running-pods.png" class="img-responsive"/>

Now you can retrieve the URL of the created route using <code>oc get routes</code> command and navigate to this URL to get started with Microcks. Depending on your environment, URL should be something like <code>http://microcks-microcks.192.168.99.100.nip.io</code>. By default, Microcks integrates with OpenShift identity provider through the use of Keycloak but you may configure some other providers later.
