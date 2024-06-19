---
title: Microcks 0.9.0 release 🚀
date: 2020-05-17
image: "images/blog/microcks-0.9.0-enterprise-grade.png"
author: "Laurent Broudoux"
type: "regular"
description: "Microcks 0.9.0 release 🚀"
draft: false
---

I am delighted to announce Microcks release 0.9.0 — the Open source Kubernetes native tool for API Mocking and Testing. This new version introduces a tremendous amount of enhancements and new features.

Big thanks to our growing community for all the work done, the raised issues and the collected feedback during the last 5 months to make it possible.

This release was the preparation to become more Enterprise-grade, and we are glad that Microcks is in production in more and more medium to large organisations. They use it to manage different use cases and sort out some business critical APIs life cycle management and development pains.

{{< image src="images/blog/microcks-0.9.0-enterprise-grade.png" alt="image" zoomable="true" >}}

So we worked a lot on installation and managements features but also on some noticeable enhancements on existing core features.
Let’s do a quick review on what’s new in this release!

## Installation experience

First contact with a new solution comes usually from the installion process itself and we care about user experience to make your life easier ;-)

Microcks is now available on Helm Hub and has its own Chart repo. So installing Microcks via Helm is just 2 commands:

```sh
$ helm repo add microcks https://microcks.io/helm
$ helm install microcks microcks/microcks —-version 0.9.0 --set microcks.url=microcks.$(minikube ip).nip.io,keycloak.url=keycloak.$(minikube ip).nip.io
```

> More details here: https://hub.helm.sh/charts/microcks/microcks

Microcks Operator is available on [OperatorHub.io](https://operatorhub.io/operator/microcks) and has been upgraded to version `0.3.0` and now managed the **Seamless Upgrade** as defined by the capability model:

{{< image src="images/blog/microcks-0.9.0-operators.png" alt="image" zoomable="true" >}}

While this version is still tagged as Alpha (till we reach the Full Lifecycle capability level at least), it is already in production on many Kubernetes clusters and has been reported as rock solid by community users.

> More details here : https://operatorhub.io/operator/microcks

OpenShift Templates have been created for OpenShift 4.x, upgrading some components and removing `cluster-admin` privileges that were mandatory so far.

> It’s now easier to install it in your own project without requiring security operations at the cluster level.

Whether your are using Helm or Operator to install Microcks, we have introduced some new and useful options : reusing existing Keycloak or MongoDB instances, reusing secrets for credentials, reusing TLS certificates for ingress security.

> These options let you reuse already existing and shared services that you may have provisioned with your favorites options, allowing a better integration with your Enterprise ecosystem.

As security matters and it is one our top priority : TLS is now the default for each setup method — we’ll generate auto-signed certificates for you if none provided. On the packaging side, we also released a new container image that is now based on [Red Hat Universal Base Image](https://developers.redhat.com/products/rhel/ubi/).

> This led to a lightweight image — we reduced the size from 240 MB to 160 MB — and much more secure as the UBI has a reduced attack surface and is very frequently updated and patched.

## Management features

As an administrator you’ll need effective way to manage users and repository access rights.

Most of the features were already existing but not documented nor easily accessible, so we fixed that. You’ll find documentation on:

* How to [manage your users](/documentation/guides/administration/users/) assigning them application roles,
* How to [define secrets for your Enterprise repository](/documentation/guides/administration/secrets/) such as Git ones,
* How to [snapshot and restore your repository](/documentation/guides/administration/snapshots/) content.

As a repository content manager, we add new features regarding repository organization. With this new release, you’ll now be able to assign `labels` to your API or services. This offer you a lot of flexibility to categorize and organize your repository the way you would like.

{{< image src="images/blog/microcks-0.9.0-labels.jpeg" alt="image" zoomable="true" >}}

Labels can also be used on the main repository page allowing you to filter and display the most important labels when browsing repository content.

> Full details are documented here: https://microcks.io/documentation/guides/administration/organizing-repository/

## Mocking enhancements

The mocking engine of Microcks did receive some enhancements too!

The more noticeable being now the ability to generate dynamic response content. We still do think and stick to the idea that non generated samples are of real value… but this was a recurrent community request and we finally listened and change our mind a bit ;-)

So now, you can use variables references and functions to describe dynamic results that helps to simulate real expected behavior, for example:

```json
{
  "id": "{{ randomString(64) }}",
  "date": "{{ now(dd/MM/yyyy) }}",
  "message": "Hello {{ request.body/name }}"
}
```

Upon invocation, the mock engine will use this template and interpret the expressions between double-mustaches (`{{` and `}}`).

> See full details documented here: https://microcks.io/documentation/references/templates/

We also added some nice documentation enhancements like [Content-type negociation](https://microcks.io/documentation/tutorials/getting-started/#viewing-an-api), [Parameters constraints](/documentation/guides/usage/mocks-constraints/) and [Custom dispatching rules](/documentation/explanations/dispatching/).

## Testing enhancements

We also introduce [Tekton](https://tekton.dev/) support for bringing Microcks to this great new Kubernetes-native CI/CD tooling. We do provide Tekton tasks and pipeline samples that allow you to integrate `Microcks Tests` steps with-in your pipelines.

Here an OpenShift 4.x example:

{{< image src="images/blog/microcks-0.9.0-pipeline.png" alt="image" zoomable="true" >}}

We also bring the capability of overriding headers during tests for better integration with tested endpoint environment.

## What’s coming next?

So you have seen there’s definitely a lot of enhancements in this `0.9.0` new release!

That’s just a start as we are going to tackle some big topics for the `1.0.0` release and will love your feedback and comments on our roadmap priorization:

* Support of [AsyncAPI](https://www.asyncapi.com/) standard for the mocking of event-driven API,
* Refinement of Role Based Access Control model to allow segmentation and delegation of management of different repository parts,
* Launch our API Mock Hub dedicated public market place to promote Microcks ecosystem, use cases, ready to use mocks and partners.

So stay tuned!