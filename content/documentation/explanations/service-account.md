---
draft: false
title: "Service accounts"
date: 2019-09-01
publishdate: 2019-09-01
lastmod: 2024-06-03
weight: 15
---

## Introduction

Microcks is using [OpenId Connect](https://openid.net/connect/) and [OAuth 2.0 bearer tokens](https://oauth.net/2/bearer-tokens/) to secure its frontend and API access. While this is very convenient for interactive users, it may be unpracticable for machine-to-machine authentication when you want to interact with Microcks from a robot, CI/CD pipeline or simple CLI tool. For that, we decided to implement the simple [OAuth 2.0 Client Credentials Grant](https://oauth.net/2/grant-types/client-credentials/) in addition of other grants. This authentication is implemented using *Service Accounts* clients defined into the Realm configuration in Keycloak.

Microcks comes with a default account named `microcks-serviceaccount` that comes with default installation but you are free to create as many account as you may have robots users.

## Inspecting default Service Account

Let's start inspecting the properties of the default *Service Account* to check its anatomy 😉 Start connecting as an administrator to the Keycloak instance your Microcks instance is running.

Just issue the following unauthenticated API call to Microcks to get the Keycloak URL and the name of realm you're using:

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

{{< image src="images/documentation/service-account-clients.png" alt="image" zoomable="true" >}}

Getting to the details of the `Service Account`, you can check that it is `Enabled`, that it should conform to the `openid-connect` Client Protocol with a `confidential` Access Type. Finally, it should also be able to do a `Direct Access Grant` and act as a `Service Account`. See below the settings of default account: 

{{< image src="images/documentation/service-account-settings.png" alt="image" zoomable="true" >}}

So one crucial thing for `Service Account` is their associated `Credentials` because because clients will have to know it for initating the flow. Credetnials are available in the `Credentials` thumb like shown below:

{{< image src="images/documentation/service-account-credentials.png" alt="image" zoomable="true" >}}

Finally, in order to operate correctly, *Service Account* should have role assigned. The default account comes with the `user` role defined into the main `microcks-app` OpenId client that matches to the main Microcks component:

{{< image src="images/documentation/service-account-roles.png" alt="image" zoomable="true" >}}

> 🚨 If you want to use the *Service Account* from pipelines in order to perform advanced operations like importing new Artifacts, or triggering scheduled imports, you have to give it more privileges as the default account has just the `user` role.
>
> On the role page in Keycloack, click on the **Assign role** button, filter roles by clients and pick the `microcks-app` > `manager` role.

## Using Service Account

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
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJnTVY5OUNfdHRCcDNnSy0tUklaYkY5TDJUWkdpTWZUSWQwaXNrXzh4TElZIn0.eyJleHAiOjE3MTcwNzA0MTQsImlhdCI6MTcxNzA3MDExNCwianRpIjoiM2YyYWZkMjgtMzQ3Ny00NjJiLWIzYmEtNDljZTE3NGQwMTViIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MTgwL3JlYWxtcy9taWNyb2NrcyIsImF1ZCI6WyJtaWNyb2Nrcy1hcHAiLCJhY2NvdW50Il0sInN1YiI6IjY5OGZhMzM5LTk5NjEtNDA0ZC1iMjUwLTRhMzQ5MzY2ZDQ2ZCIsInR5cCI6IkJlYXJlciIsImF6cCI6Im1pY3JvY2tzLXNlcnZpY2VhY2NvdW50IiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwiZGVmYXVsdC1yb2xlcy1taWNyb2NrcyJdfSwicmVzb3VyY2VfYWNjZXNzIjp7Im1pY3JvY2tzLWFwcCI6eyJyb2xlcyI6WyJ1c2VyIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJjbGllbnRIb3N0IjoiMTcyLjE3LjAuMSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LW1pY3JvY2tzLXNlcnZpY2VhY2NvdW50IiwiY2xpZW50QWRkcmVzcyI6IjE3Mi4xNy4wLjEiLCJjbGllbnRfaWQiOiJtaWNyb2Nrcy1zZXJ2aWNlYWNjb3VudCJ9.FgWaKrZthEEK4pAyd9n8mMxCfErCzXN8l8QUaAI9-VYfwfy1qXAqpqtL8rTtOf4MiAV0P7ntz1firmv6GfaInHD9FMbysXOtp6RVB3Jj0ITNqsR-Guw6lYZIKg5ECtqLw3x5cISaq00VGTIOpZDGVn8GRM-a6XQHvfRJzPqgZXELWIhxCzmBor2Sv8m35E_jNQT-cMNrd7XPdRfFYcYqxQgOmez1N9uHg0kajWJEHKFu1TFaa1HT2vaFB6QgNnJusiEIVEltK7FG42SC1QXH9LmUJC9FK7jRTqJx43VMLOCT4xnwsimVq6vlYr_TCsrCB7HqSZUQqeer9cddRnsfag",
  "expires_in": 300,
  "refresh_expires_in": 0,
  "token_type": "Bearer",
  "not-before-policy": 0,
  "scope": "email profile"
}

# finally, you can reuse this access_token as the bearer to call Microcks APIs
$ curl https://microcks.example.com/api/services -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJnTVY5OUNfdHRCcDNnSy0tUklaYkY5TDJUWkdpTWZUSWQwaXNrXzh4TElZIn0.eyJleHAiOjE3MTcwNzA0MTQsImlhdCI6MTcxNzA3MDExNCwianRpIjoiM2YyYWZkMjgtMzQ3Ny00NjJiLWIzYmEtNDljZTE3NGQwMTViIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MTgwL3JlYWxtcy9taWNyb2NrcyIsImF1ZCI6WyJtaWNyb2Nrcy1hcHAiLCJhY2NvdW50Il0sInN1YiI6IjY5OGZhMzM5LTk5NjEtNDA0ZC1iMjUwLTRhMzQ5MzY2ZDQ2ZCIsInR5cCI6IkJlYXJlciIsImF6cCI6Im1pY3JvY2tzLXNlcnZpY2VhY2NvdW50IiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwiZGVmYXVsdC1yb2xlcy1taWNyb2NrcyJdfSwicmVzb3VyY2VfYWNjZXNzIjp7Im1pY3JvY2tzLWFwcCI6eyJyb2xlcyI6WyJ1c2VyIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJjbGllbnRIb3N0IjoiMTcyLjE3LjAuMSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LW1pY3JvY2tzLXNlcnZpY2VhY2NvdW50IiwiY2xpZW50QWRkcmVzcyI6IjE3Mi4xNy4wLjEiLCJjbGllbnRfaWQiOiJtaWNyb2Nrcy1zZXJ2aWNlYWNjb3VudCJ9.FgWaKrZthEEK4pAyd9n8mMxCfErCzXN8l8QUaAI9-VYfwfy1qXAqpqtL8rTtOf4MiAV0P7ntz1firmv6GfaInHD9FMbysXOtp6RVB3Jj0ITNqsR-Guw6lYZIKg5ECtqLw3x5cISaq00VGTIOpZDGVn8GRM-a6XQHvfRJzPqgZXELWIhxCzmBor2Sv8m35E_jNQT-cMNrd7XPdRfFYcYqxQgOmez1N9uHg0kajWJEHKFu1TFaa1HT2vaFB6QgNnJusiEIVEltK7FG42SC1QXH9LmUJC9FK7jRTqJx43VMLOCT4xnwsimVq6vlYr_TCsrCB7HqSZUQqeer9cddRnsfag' -k -s | jq .
```
To finally get the result of an API call:
```json
[
  {
    "id": "65fc52b9512f6013cb7e9781",
    "name": "API Pastry - 2.0",
    "version": "2.0.0",
    "type": "REST",
    "metadata": {
      "createdOn": 1711035065536,
      "lastUpdate": 1714377633653,
      "labels": {
        "domain": "pastry"
      }
    },
    "sourceArtifact": "https://raw.githubusercontent.com/microcks/microcks/master/samples/APIPastry-openapi.yaml",
    "operations": [
      {
        "name": "GET /pastry",
        "method": "GET",
        "resourcePaths": [
          "/pastry"
        ]
      },
      {
        "name": "GET /pastry/{name}",
        "method": "GET",
        "dispatcher": "URI_PARTS",
        "dispatcherRules": "name",
        "defaultDelay": 0,
        "resourcePaths": [
          "/pastry/Eclair%20Cafe",
          "/pastry/Millefeuille"
        ],
        "parameterConstraints": [
          {
            "name": "TraceID",
            "in": "header",
            "required": false,
            "recopy": true
          }
        ]
      },
      {
        "name": "PATCH /pastry/{name}",
        "method": "PATCH",
        "dispatcher": "URI_PARTS",
        "dispatcherRules": "name",
        "resourcePaths": [
          "/pastry/Eclair%20Cafe"
        ]
      }
    ]
  }
]
```