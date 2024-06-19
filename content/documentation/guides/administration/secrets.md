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

This guide will explain you what is the concept of *Secret* in Microcks, how to manage those Secrets and how to use them when defining an [Importer Job](/documentation/guides/usage/importing-content/#2-import-content-via-importer). 

> 🚨 **Prerequisites**
>
> Secrets can only be managed by Microcks `admin` - we mean people having the `admin` role assigned. If you need further information on how to manage users and roles, please check how-to [Manage Users](../users).

## 1. Authentication Secrets

Authentication Secrets (or simply **Secrets**) are managed by a Microcks administrator and **holds credentials for accessing remote resources** such as Git repositories, remote API endpoints or event brokers.

Credentials informations wrapped within a Secret can be of several natude like a User/Password pair, a Token or some X509 certificates.

Secrets are stored within the Microcks database and may be reused by regular users when creating an Importer Job or launching a new test. At that time, regular users are just referring Secret name and don't get access to the detailed.

Secrets management is simply a thumbnail with the **Administration** page that is available from the vertical menu on the left once logged in as administrator.

<div align="center">
{{< figure src="images/documentation/secret-list.png" alt="image" zoomable="true" width="90%" >}}
<br/>
</div>

Let see how to create/update a secret and its properties below.

## 2. Edit Secret properties

Let's imagine you want to create a secret that will hold informations on how to access your corporate [GitLab](https://about.gitlab.com/) instance. Here's the form you'll have to fill below. It may imply authentication method and properties as well as transport encryption information such as the custom certificate to use.

<div align="center">
{{< figure src="images/documentation/secret-edit.png" alt="image" zoomable="true" width="70%" >}}
<br/>
</div>

Authentication may be realized using different methods described below.

| <div style="width: 180px">Authentication Type</div> | Description |
| ------------------- | ----------- |
| `None` | No authentication is actually realized. In this case, the secret may only be useful to hold custom certificate to access private resource. |
| `Basic Authentication` | An HTTP `Basic` authentication is attempted when connecting to remote resource. When selecting this method, form will just ask for a `User` and a `Password`. |
| `Token Authentication` | An HTTP `Bearer` or custtom authentication is attempted with the prvided `Token`. If no Token-Header is specified, the standard `Authentication: Bearer <provided token>` is attempter. If a Token-Header is specified, token is added as the value of this specific header. |

The `CA Certificate` is just here to gather a custom certificate or certificate chain specified in [PEM format](https://en.wikipedia.org/wiki/Privacy-Enhanced_Mail).

Using the form, you may create as much *Secret* as you need for different resources. Regular users of the Microcks instance will just have access to the name and the description of the secrets.


## 3. Adding a Secret to an Import Job

Now that you have created and managed your secrets, they can be reused when defining an Import Job. For doing that, just go and update a job: the second step of the wizard modal is dedicated to security concerns. You may now just add a reference to (thus a usage of) one of your secret.

<div align="center">
{{< figure src="images/documentation/secret-job-edit.png" alt="image" zoomable="true" width="80%" >}}
<br/>
</div>

When Microcks will scheduled and execute this job to check update of artifact resource, it will simply used the referenced secret. Now your job is identified as using a secret with a balck lock 🔒 on the UI:

{{< image src="images/documentation/secret-job-marker.png" alt="image" zoomable="true" >}}
<br/><br/>

Each and every time the scheduled import job will be fired, it will reused the up-to-date informations of the secret to provide the correct token and certificates to the external resource.

## Wrap-up

Following this guide, you have learned how **Authentication Secrets** allows you to hold credentials informations for accessing secured remote resources used by Microcks importers or tests. You should now be confident in the way Microcks access these protected resources, letting regular users just reference the Secret name.
