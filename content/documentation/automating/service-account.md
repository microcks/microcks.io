---
draft: false
title: "Microcks Service Accounts"
date: 2019-09-01
publishdate: 2019-09-01
lastmod: 2023-07-17
weight: 1
---

## Microcks Service Accounts

### Introduction

Microcks is using [OpenId Connect](https://openid.net/connect/) and [OAuth 2.0 bearer tokens](https://oauth.net/2/bearer-tokens/) to secure its frontend and API access. While this is very convenient for interactive users, it may be unpracticable for machine-to-machine authentication when you want to interact with Microcks from a robot, CI/CD pipeline or simple CLI tool. For that, we decided to implement the simple [OAuth 2.0 Client Credentials Grant](https://oauth.net/2/grant-types/client-credentials/) in addition of other grants. This authentication is implemented using *Service Accounts* clients defined into the Realm configuration in Keycloak.

Microcks comes with a default account named `microcks-serviceaccount` that comes with default installation but you are free to create as many account as you may have robots users.

### Inspecting default Service Account

Let's start inspecting the properties of the default Service Account to check its anatomy ;-) Start connecting as an administrator to the Keycloak instance your Microcks instance is running.

> Hint: just issue the following unauthenticated API call to Microcks to get the Keycloak URL and the name of realm you're using:

```sh
$ curl https://microcks.example.com/api/keycloak/config -s -k | jq .
{
  "realm": "microcks",
  "resource": "microcks-app-js",
  "auth-server-url": "https://keycloak.microcks.example.com",
  "ssl-required": "external",
  "public-client": true
}
```

Authenticate as administrator into the Keycloak administration console and browse the realm Microcks is using. You should have the list of defined `Applications` or `Clients` defined on this realm and see the default `microcks-serviceaccount` as in below screenshot:

{{< image src="images/service-account-clients.png" alt="image" zoomable="true" >}}

Getting to the details of the `Service Account`, you can check that it is `Enabled`, that it should conform to the `openid-connect` Client Protocol with a `confidential` Access Type. Finally, it should also be able to do a `Direct Access Grant` and act as a `Service Account`. See below the settings of default account: 

{{< image src="images/service-account-settings.png" alt="image" zoomable="true" >}}

So one crucial thing for `Service Account` is their associated `Credentials` because because clients will have to know it for initating the flow. Credetnials are available in the `Credentials` thumb like shown below:

{{< image src="images/service-account-credentials.png" alt="image" zoomable="true" >}}

Finally, in order to operate correctly, Service Account should have role assigned. The default account comes with the `user` role defined into the main `microcks-app` OpenId client that matches to the main Microcks component:

{{< image src="images/service-account-roles.png" alt="image" zoomable="true" >}}

> If you want to use the `Service Account` for DevOps pipelines, with the [Microcks Cli](./cli.md) for example, you have to give it more priviledges.  
> On the role page in Keycloack, click on the **Assign role** button, filter roles by clients and pick the __*microcks-app* manager__ role.

### Using Service Account

In Microcks, the default `microcks-serviceaccount` is used by internal components when communicating with the main Microcks webapp that is holding API. So be careful before changing its credentials and do not delete it!

However, you can create as many other `Service Accounts` as you may have CI/CD pipelines, CLI users or integration with your own solutions.

As a sum-up, here's some basic commands showing you how to use this service account once defined:

```sh
# account:credentials should be first encoded as base 64
$ echo "microcks-serviceaccount:ab54d329-e435-41ae-a900-ec6b3fe15c54" | base64
bWljcm9ja3Mtc2VydmljZWFjY291bnQ6YWI1NGQzMjktZTQzNS00MWFlLWE5MDAtZWM2YjNmZTE1YzU0Cg=

# then you issue a POST command to authenticate and retrieve an access_token from Keycloak
# the grant_type used is client_credentials
$ curl -X POST https://keycloak.microcks.example.com/realms/microcks/protocol/openid-connect/token -H 'Content-Type: application/x-www-form-urlencoded' -H 'Accept: application/json' -H 'Authorization: Basic bWljcm9ja3Mtc2VydmljZWFjY291bnQ6YWI1NGQzMjktZTQzNS00MWFlLWE5MDAtZWM2YjNmZTE1YzU0Cg=' -d 'grant_type=client_credentials' -k -s | jq . 
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJFdlRzbVZhQ3dya3p6LTBlYTJhVDBmTHV1dzJfal9zNnNjOW9zVUN3Q1JnIn0.eyJleHAiOjE2MDAwNzc5NDYsImlhdCI6MTYwMDA3NzY0NiwianRpIjoiNjNjZGRjM2YtODBmMi00NmM0LThlOTQtM2RjNjg5MjU1NmE3IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MTgwL2F1dGgvcmVhbG1zL21pY3JvY2tzIiwiYXVkIjpbIm1pY3JvY2tzLWFwcCIsImFjY291bnQiXSwic3ViIjoiYzNhMzYyNjctMjQxOC00MTg1LWJiMTktODI4MjFiNDZkOWQzIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibWljcm9ja3Mtc2VydmljZWFjY291bnQiLCJzZXNzaW9uX3N0YXRlIjoiMWFmNGI2MjEtNGM2OS00OWQwLWExOTktYmIzMTRkY2RmY2NkIiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyJdfSwicmVzb3VyY2VfYWNjZXNzIjp7Im1pY3JvY2tzLWFwcCI6eyJyb2xlcyI6WyJ1c2VyIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJjbGllbnRJZCI6Im1pY3JvY2tzLXNlcnZpY2VhY2NvdW50IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJjbGllbnRIb3N0IjoiMTI3LjAuMC4xIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LW1pY3JvY2tzLXNlcnZpY2VhY2NvdW50IiwiY2xpZW50QWRkcmVzcyI6IjEyNy4wLjAuMSJ9.T6dSjW_tFdIFaQPECXaui_iBO_pemf7n7kLaG6D30gyq6TOPe0D3kzyXXVl2_MXGtAjxD1Yc_CCtbHZKJOS-NHG_qmdiuOdMgLJnqot2zRirvpcsAvX1kDVugAlx1r5RDfLKuokDvN3paVFvO00HTKGzm5P59rIQRCx6neEzq_eAeU-0-l962OidjVsq8r77q0sVpusHQuFiaYPrcNGiVbyL08--fYyxq97yovRInj2WOsFjhyrVPjpYJBCgbC5eLUNFh2WH6T9HecegsEfqXR_7CNPN2TjMQZdo2zkuzcKGiHHVId7ntIzupPLc95N487Jwd0Y3WHSdbMdVPptTeA",
  "expires_in": 300,
  "refresh_expires_in": 1800,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI1Y2UyOGQyOC05ODY4LTQxNzEtYjRkZi02OGE2NmQ4ZTE5NDIifQ.eyJleHAiOjE2MDAwNzk0NDYsImlhdCI6MTYwMDA3NzY0NiwianRpIjoiM2EwODM0YzQtZjI4Yi00ZmIxLWI1YjEtMzFkNzE0ODVmZjBkIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MTgwL2F1dGgvcmVhbG1zL21pY3JvY2tzIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo4MTgwL2F1dGgvcmVhbG1zL21pY3JvY2tzIiwic3ViIjoiYzNhMzYyNjctMjQxOC00MTg1LWJiMTktODI4MjFiNDZkOWQzIiwidHlwIjoiUmVmcmVzaCIsImF6cCI6Im1pY3JvY2tzLXNlcnZpY2VhY2NvdW50Iiwic2Vzc2lvbl9zdGF0ZSI6IjFhZjRiNjIxLTRjNjktNDlkMC1hMTk5LWJiMzE0ZGNkZmNjZCIsInNjb3BlIjoiZW1haWwgcHJvZmlsZSJ9.xOaUJyq4GLAtHd-GeSr7JKG4HfLn9LU5r6coGO-DjyA",
  "token_type": "bearer",
  "not-before-policy": 0,
  "session_state": "1af4b621-4c69-49d0-a199-bb314dcdfccd",
  "scope": "email profile"
}

# finally, you can reuse this access_token as the bearer to call Microcks APIs
$ curl https://microcks.example.com/api/services -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJFdlRzbVZhQ3dya3p6LTBlYTJhVDBmTHV1dzJfal9zNnNjOW9zVUN3Q1JnIn0.eyJleHAiOjE2MDAwNzc5NDYsImlhdCI6MTYwMDA3NzY0NiwianRpIjoiNjNjZGRjM2YtODBmMi00NmM0LThlOTQtM2RjNjg5MjU1NmE3IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MTgwL2F1dGgvcmVhbG1zL21pY3JvY2tzIiwiYXVkIjpbIm1pY3JvY2tzLWFwcCIsImFjY291bnQiXSwic3ViIjoiYzNhMzYyNjctMjQxOC00MTg1LWJiMTktODI4MjFiNDZkOWQzIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibWljcm9ja3Mtc2VydmljZWFjY291bnQiLCJzZXNzaW9uX3N0YXRlIjoiMWFmNGI2MjEtNGM2OS00OWQwLWExOTktYmIzMTRkY2RmY2NkIiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyJdfSwicmVzb3VyY2VfYWNjZXNzIjp7Im1pY3JvY2tzLWFwcCI6eyJyb2xlcyI6WyJ1c2VyIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJjbGllbnRJZCI6Im1pY3JvY2tzLXNlcnZpY2VhY2NvdW50IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJjbGllbnRIb3N0IjoiMTI3LjAuMC4xIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LW1pY3JvY2tzLXNlcnZpY2VhY2NvdW50IiwiY2xpZW50QWRkcmVzcyI6IjEyNy4wLjAuMSJ9.T6dSjW_tFdIFaQPECXaui_iBO_pemf7n7kLaG6D30gyq6TOPe0D3kzyXXVl2_MXGtAjxD1Yc_CCtbHZKJOS-NHG_qmdiuOdMgLJnqot2zRirvpcsAvX1kDVugAlx1r5RDfLKuokDvN3paVFvO00HTKGzm5P59rIQRCx6neEzq_eAeU-0-l962OidjVsq8r77q0sVpusHQuFiaYPrcNGiVbyL08--fYyxq97yovRInj2WOsFjhyrVPjpYJBCgbC5eLUNFh2WH6T9HecegsEfqXR_7CNPN2TjMQZdo2zkuzcKGiHHVId7ntIzupPLc95N487Jwd0Y3WHSdbMdVPptTeA' -k -s | jq .
[
  {
    "id": "5ddc0abd448ff8ba296c13b3",
    "name": "API Pastry",
    "version": "1.0.0",
    "type": "REST",
    "metadata": {
      "createdOn": 1574701757816,
      "lastUpdate": 1599316976801,
      "labels": {
        "domain": "pastry",
        "status": "deprecated"
      }
    },
    "operations": [
      {
        "name": "GET /pastry/:name",
        "method": "GET",
        "dispatcher": "URI_PARTS",
        "dispatcherRules": "name",
        "resourcePaths": [
          "/pastry/Eclair%20Cafe",
          "/pastry/Millefeuille"
        ]
      },
      {
        "name": "GET /pastry",
        "method": "GET",
        "resourcePaths": [
          "/pastry"
        ]
      }
    ]
  }
]
```