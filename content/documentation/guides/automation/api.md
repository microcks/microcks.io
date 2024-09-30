---
draft: false
title: "Connecting to Microcks API"
date: 2024-04-30
publishdate: 2024-04-30
lastmod: 2024-09-30
weight: 1
---

## Overview

This guide shows you how to authenticate to and how to use the Microcks API for better automation of tasks. As all the features available in Microcks can be used directly through its [REST API](/documentation/references/apis/open-api), you can extend it we way you want and use it in a pure headless mode.

This guide takes place in **3 steps**:

1️⃣ We will **check your security configuration** and see if authentication is required (it depends on how you deployed Microcks),

2️⃣ If your Microcks is secured, we will **authenticate and retrieve a `token`** to later use for authorizing API calls,

3️⃣ We will **issue a bunch of API calls** and discuss permissions.

> 💡 All the commands of this guide are exposed as `curl` commands, it's then up-to-you to translate them into your language or automation stack of choice. As this is a simple test, we will not bother with certificates validation and add the `-k` flags to the commands. Be sure to use `--cacert` or `--capath` options on real environment with custom certificates.

Let's jump in! 🏂

## 1. Check security configuration

Assuming you're running your Microcks instance at `https://microcks.example.com/api/keycloak/config` and that you're not aware of your security configuration, you may execute this first command in your terminal to get the configuration:

```sh
curl https://microcks.example.com/api/keycloak/config -k
```
```json
{
  "enabled": true,  
  "realm": "microcks",
  "resource": "microcks-app-js",
  "auth-server-url": "https://keycloak.microcks.example.com",
  "ssl-required": "external",
  "public-client": true
}
```

On the above command output, you see that Keycloak and thus authentication are actually enabled. We will use the `auth-server-url` and `realm` for authentication. If it's not the case, then you can skip the end of this step as well as step 2.

Before going further, you need to retrieve a *Service Account* for authenticating to Keycloak. Your Microcks provider or adminsitrator has probably read the explanations on [Service Account](/documentation/explanations/service-account) and will be able to provide this information.

For new comers, don't worry! Microcks comes with a default account named `microcks-serviceaccount` that comes with default installation; with a default credential that is set to `ab54d329-e435-41ae-a900-ec6b3fe15c54`. 😉

## 2. Authenticate to Keycloak

Your Microcks installation is secured, you have your *Service Account* information at hand and you know need to authenticate and retrieve a `token`.

The authentication of *Service Account* implements the simple [OAuth 2.0 Client Credentials Grant](https://oauth.net/2/grant-types/client-credentials/) so that its convenient for machine-to-machine interaction scenarios. This grant requires that our service account name and credentials being first encode in Base64:

```sh
# encode account:credentials as base 64
$ echo "microcks-serviceaccount:ab54d329-e435-41ae-a900-ec6b3fe15c54" | base64
bWljcm9ja3Mtc2VydmljZWFjY291bnQ6YWI1NGQzMjktZTQzNS00MWFlLWE5MDAtZWM2YjNmZTE1YzU0Cg=
```

Then you can issue a `POST` comamnd to the `auth-server-url` and `realm` previously retrieved, reusing this Base64 string in a basic authorization header and specifying the client credentials grant type:

```sh
# authenticate and retrieve an access_token from Keycloak
curl -X POST https://keycloak.microcks.example.com/realms/microcks/protocol/openid-connect/token \
  -H 'Content-Type: application/x-www-form-urlencoded' -H 'Accept: application/json' \
  -H 'Authorization: Basic bWljcm9ja3Mtc2VydmljZWFjY291bnQ6YWI1NGQzMjktZTQzNS00MWFlLWE5MDAtZWM2YjNmZTE1YzU0Cg=' \
  -d 'grant_type=client_credentials' -k
```
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJnTVY5OUNfdHRCcDNnSy0tUklaYkY5TDJUWkdpTWZUSWQwaXNrXzh4TElZIn0.eyJleHAiOjE3MTcwNzA0MTQsImlhdCI6MTcxNzA3MDExNCwianRpIjoiM2YyYWZkMjgtMzQ3Ny00NjJiLWIzYmEtNDljZTE3NGQwMTViIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MTgwL3JlYWxtcy9taWNyb2NrcyIsImF1ZCI6WyJtaWNyb2Nrcy1hcHAiLCJhY2NvdW50Il0sInN1YiI6IjY5OGZhMzM5LTk5NjEtNDA0ZC1iMjUwLTRhMzQ5MzY2ZDQ2ZCIsInR5cCI6IkJlYXJlciIsImF6cCI6Im1pY3JvY2tzLXNlcnZpY2VhY2NvdW50IiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwiZGVmYXVsdC1yb2xlcy1taWNyb2NrcyJdfSwicmVzb3VyY2VfYWNjZXNzIjp7Im1pY3JvY2tzLWFwcCI6eyJyb2xlcyI6WyJ1c2VyIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJjbGllbnRIb3N0IjoiMTcyLjE3LjAuMSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LW1pY3JvY2tzLXNlcnZpY2VhY2NvdW50IiwiY2xpZW50QWRkcmVzcyI6IjE3Mi4xNy4wLjEiLCJjbGllbnRfaWQiOiJtaWNyb2Nrcy1zZXJ2aWNlYWNjb3VudCJ9.FgWaKrZthEEK4pAyd9n8mMxCfErCzXN8l8QUaAI9-VYfwfy1qXAqpqtL8rTtOf4MiAV0P7ntz1firmv6GfaInHD9FMbysXOtp6RVB3Jj0ITNqsR-Guw6lYZIKg5ECtqLw3x5cISaq00VGTIOpZDGVn8GRM-a6XQHvfRJzPqgZXELWIhxCzmBor2Sv8m35E_jNQT-cMNrd7XPdRfFYcYqxQgOmez1N9uHg0kajWJEHKFu1TFaa1HT2vaFB6QgNnJusiEIVEltK7FG42SC1QXH9LmUJC9FK7jRTqJx43VMLOCT4xnwsimVq6vlYr_TCsrCB7HqSZUQqeer9cddRnsfag",
  "expires_in": 300,
  "refresh_expires_in": 0,
  "token_type": "Bearer",
  "not-before-policy": 0,
  "scope": "email profile"
}
```

The important things here is the `access_token` property of the authentication response that you need to extract and keep at hand.

## 3. Connect to Microcks API

If you retrieved an `access_token` in the previous step, you can store into a `TOKEN` environment variable like this:

```sh
export TOKEN=eyJhbGciOiJSUzI1NiIsIn...
```

If you skipped the step 2 because you're using an unauthenticated instance of Microcks then you can set `TOKEN` to any value you want like below.

```sh
export TOKEN=foobar
```

Now that the `TOKEN` is set you can issue commands to Microcks API, providing it as the `Authorization` header value.

For example, you can check the content of your API | Services repository like this:

```sh
curl https://microcks.example.com/api/services/map -H "Authorization: Bearer $TOKEN" -k
```
```json
{
  "REST": 23,
  "GENERIC_REST": 1,
  "GRAPHQL": 3,
  "EVENT": 13,
  "SOAP_HTTP": 2,
  "GRPC": 3
}
```

You can also access the list of API | Services, requesting for first item like this:
```sh
curl 'https://microcks.example.com/api/services?page=0&size=1' -H "Authorization: Bearer $TOKEN" -k
```
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

And you can also get access to the details of this specific API, reusing its `id` with following API call:

```sh
curl 'https://microcks.example.com/api/services/65fc52b9512f6013cb7e9781?messages=true' -H "Authorization: Bearer $TOKEN" -k
```

Imagine you followed the [Importing Services & APIs guide](/documentation/guides/usage/importing-content) previously and you have created a scheduled importer, then you can access the list of importer jobs:

```sh
curl 'https://microcks.example.com/api/jobs?page=0&size=1' -H "Authorization: Bearer $TOKEN" -k
```
```json
[
  {
    "id":"6470b31415d8e3652a787bad",
    "name":"API Pastries Collection",
    "repositoryUrl":"https://raw.githubusercontent.com/microcks/api-lifecycle/master/contract-testing-demo/apipastries-postman-collection.json",
    "mainArtifact":false,
    "repositoryDisableSSLValidation":false,
    "createdDate":1685107476336,
    "lastImportDate":1695721275198,
    "active":false,
    "etag":"\"28fddf9e35d01cb283c334440a461e4054c6f27f993962c6b27759d5db3a11ee\"",
    "metadata":{
      "createdOn":1685107476336,
      "lastUpdate":1695721281109,
      "labels":{}
    },
    "serviceRefs":[
      {"serviceId":"65031293f2de8546d2ddc07e","name":"API Pastries","version":"0.0.1"}
    ]
  }
]
```

However, some of the API calls are restrictied to certain permissions. For example, if you try to activate the above importer job using the following API call:

```sh
curl 'https://microcks.example.com/api/jobs/6470b31415d8e3652a787bad/start' -H "Authorization: Bearer $TOKEN" -k -v
```

You'll get the following error response:

```sh
< HTTP/1.1 403 
< WWW-Authenticate: Bearer error="insufficient_scope", error_description="The request requires higher privileges than provided by the access token.", error_uri="https://tools.ietf.org/html/rfc6750#section-3.1"
```

This is expected as *Service Account* are endorsing roles. By default the `microcks-serviceaccount` only endorse the `user` role and cannot perform advanced operations like creating or activating importer jobs.

## Wrap-up

Walking this guide, you have learned how to connect to the Microcks API, going through authentication first if your installation has enabled it. Microcks proposes to authenticate via *Service Account* and using [OAuth 2.0 Client Credentials Grant](https://oauth.net/2/grant-types/client-credentials/) to retrieve a valid token. This authentication mechanism is the foundation that is used with all other means to interact with Microcks' API: the [CLI](/documentation/guides/automation/cli), the [GitHub Actions](/documentation/guides/automation/github-actions), the [Jenkins plugin](/documentation/guides/automation/jenkins), etc.

You may follow-up this guide with consulting the reference about [Microcks' REST API](/documentation/references/apis/open-api) or learning more about [Service Accounts](/documentation/explanations/service-account).