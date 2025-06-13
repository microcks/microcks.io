---
draft: false
title: "Accessing secured Resources"
date: 2019-11-18
publishdate: 2019-11-18
lastmod: 2024-06-13
weight: 3
---

## Overview

Quickly after your initial experience with Microcks, you'll realize that **it needs to access some of your private resources** for smooth integration in your lifecycle. Typically:
* Loading [Artifacts](/documentation/overview/main-concepts/#artifacts) may require accessing secured external resources such as Git repositories,
* Launching [tests](/documentation/tutorials/getting-started-tests) may require accessing protected HTTPS endpoints or internal message brokers.

This guide will explain the concept of *Secret* in Microcks, how to manage those Secrets and how to use them when defining an [Importer Job](/documentation/guides/usage/importing-content/#2-import-content-via-importer). 

> 🚨 **Prerequisites**
>
> Secrets can only be managed by Microcks `admin`, we mean people with the `admin` role assigned. If you need further information on how to manage users and roles, please check the how-to [Manage Users](../users).

## 1. Authentication Secrets

Authentication Secrets (or simply **Secrets**) are managed by a Microcks administrator and **hold credentials for accessing remote resources** such as Git repositories, remote API endpoints or event brokers.

Credential information wrapped within a Secret can be of several natures, such as a User/Password pair, a Token or some X509 certificates.

Secrets are stored within the Microcks database and may be reused by regular users when creating an Importer Job or launching a new test. At that time, regular users refer to the Secret name only and don't get access to the detailed information.

Secrets management is simply a thumbnail of the **Administration** page, which is available from the vertical menu on the left once you are logged in as an administrator.

<div align="center">
{{< figure src="images/documentation/secret-list.png" alt="image" zoomable="true" width="90%" >}}
<br/>
</div>

Let's see how to create/update a secret and its properties below.

## 2. Edit Secret properties

Let's imagine you want to create a secret that will hold information on how to access your corporate [GitLab](https://about.gitlab.com/) instance. Here's the form you'll have to fill out below. It may imply authentication method and properties, as well as transport encryption information such as the custom certificate to use.

<div align="center">
{{< figure src="images/documentation/secret-edit.png" alt="image" zoomable="true" width="70%" >}}
<br/>
</div>

Authentication may be realized using different methods described below.

| <div style="width: 180px">Authentication Type</div> | Description |
| ------------------- | ----------- |
| `None` | No authentication is actually realized. In this case, the secret may only be useful to hold a custom certificate to access a private resource. |
| `Basic Authentication` | An HTTP `Basic` authentication is attempted when connecting to a remote resource. When selecting this method, the form will just ask for a `User` and a `Password`. |
| `Token Authentication` | An HTTP `Bearer` or custom authentication is attempted with the provided `Token`. If no Token-Header is specified, the standard `Authentication: Bearer <provided token>` is attempted. If a Token-Header is specified, the token is added as the value of this specific header. |

The `CA Certificate` is just here to gather a custom certificate or certificate chain specified in [PEM format](https://en.wikipedia.org/wiki/Privacy-Enhanced_Mail).

Using the form, you may create as many *Secrets* as you need for different resources. Regular users of the Microcks instance will just have access to the secrets' names and descriptions.


## 3. Adding a Secret to an Import Job

Now that you have created and managed your secrets, they can be reused when defining an Import Job. To do that, just update a job: the second step of the wizard modal is dedicated to security concerns. You may now add a reference to (thus a usage of) one of your secrets.

<div align="center">
{{< figure src="images/documentation/secret-job-edit.png" alt="image" zoomable="true" width="80%" >}}
<br/>
</div>

When Microcks schedules and executes this job to check the update of the artifact resource, it will simply use the referenced secret. Now your job is identified as using a secret with a black lock 🔒 on the UI:

{{< image src="images/documentation/secret-job-marker.png" alt="image" zoomable="true" >}}
<br/><br/>

Each time the scheduled import job is fired, it reuses the up-to-date secret information to provide the correct token and certificates to the external resource.

## Wrap-up

Following this guide, you have learned how **Authentication Secrets** allows you to hold credentials information for accessing secured remote resources used by Microcks importers or tests. You should now be confident in the way Microcks accesses these protected resources, letting regular users just reference the Secret name.
