---
draft: false
title: "External Secrets"
date: 2019-11-18
publishdate: 2019-11-18
lastmod: 2019-11-19
weight: 2
---

## Introduction

Starting with Microcks version `0.7.0`, we add the ability to manage some forms of `Secrets` in order to access private HTTP(S) repositories su as Git ones.

Secrets can only be managed by Microcks `administrator` - we mean people having the `administrator` role assigned. If you need further information on how to manage users and roles, please check [here](./users). Secrets management is simply a thumbnail with the `Administration` page that is available from the vertical menu on the left once logged in as administrator.

## Authentication secrets

Secrets are displayed in a list and simply classified using a name and a description. You may use this screen to create, edit or delete secrets. Secrets are then bound to usages - today, only import jobs are using secrets.

{{< image src="images/secret-list.png" alt="image" zoomable="true" >}}

Let see how to create/update a secret and its properties below.

## Secret properties 

Now imagine I want to create a secret that will hold informations on how to access my corporate GitLab instance. Here's the form you'll have to fill below. It may imply authentication method and properties as well as transport encryption information such as the custom certificate to use.

{{< image src="images/secret-edit.png" alt="image" zoomable="true" >}}

Authentication may be realized using different methods described below.

| Authentication Type | Description |
| ------------------- | ----------- |
| `None` | No authentication is actually realized. In this case, the secret may only be useful to hold custom certificate to access private resource. |
| `Basic Authentication` | An HTTP `Basic` authentication is attempted when connecting to remote resource. When selecting this method, form will just ask for a `User` and a `Password`. |
| `Token Authentication` | An HTTP `Bearer` or custtom authentication is attempted with the prvided `Token`. If no Token-Header is specified, the standard `Authentication: Bearer <provided token>` is attempter. If a Token-Header is specified, token is added as the value of this specific header. |

The `CA Certificate` is just here to gather a custom certificate or certifcate chain specified in PEM format.

## Adding secret to an import job

Now that you have created and managed a secret, you can add it to your Import Job. For doing that, just go and update a job: the second step of the wizard modal is dedicated to security concerns. You may now just add a reference to (thus a usage of) one of your secret.

{{< image src="images/secret-job-edit.png" alt="image" zoomable="true" >}}

When Microcks will scheduled and execute this job to check update of artifact resource, it will simply used the referenced secret. Now your job is identifier as using a secret on the UI:

{{< image src="images/secret-job-marker.png" alt="image" zoomable="true" >}}
