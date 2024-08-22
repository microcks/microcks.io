---
title: Mocking OpenID Connect redirect
date: 2024-04-24
image: "images/blog/mocking-oidc-redirect-fetaure.png"
author: "Laurent Broudoux"
type: "regular"
description: "Mocking OpenID Connect redirect"
draft: false
---

A few days ago, I worked on a new prototype to see what it means to use Microcks to mock [OpenID Connect](https://openid.net/developers/how-connect-works/) authentication flows. As [Zero-trust security model](https://www.fortinet.com/resources/cyberglossary/what-is-the-zero-trust-network-security-model) is now the norm in this cloud and distributed computing era, developers must integrate this from the beginning of their application development. However, **accessing an Identity Provider (IDP) is not always convenient** depending on your working situation - thinking of remote access, disconnected place, stateful provider inconsistencies, etc. Hence, there is an opportunity for light mocks that work locally, at the network level! 

{{< image src="images/blog/mocking-oidc-redirect-fetaure.png" alt="mocking-oidc-redirect-feature" >}}

While describing those mocks, I thought about the redirection part of the authentication flows. You may know: the typical situation where the client provides some state and a redirect URL to the IDP and where the IDP should send an `HTTP Redirect` to the location, with state and a new token or authorization code. Describing this may be quite complex as it typically involves behavior transcription. However, I found what I think is a nice and elegant situation to describe and mock thanks to Microcks advanced features 😉

So, to tackle this problem of describing an OIDC redirection, we have to use three advanced features of Microcks. The first one has already been released and is available; the two others will be released in `1.9.1`, coming mid-May.  For reference, and if you want to learn more about them, we’ve used:
* No content response support: [\#944](https://github.com/microcks/microcks/issues/944)
* Response headers templating: [\#1097](https://github.com/microcks/microcks/issues/1097)
* Response with headers only: [\#1142](https://github.com/microcks/microcks/issues/1142)

## Start with OpenAPI

To start my prototype, I have initialized an OpenAPI specification based on [GitHub Authorization flow for OAuth apps](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps). It describes the different query parameters and the response with the `302` HTTP response code.  You’ll see in the snippet below that each parameter contain an example named `generic`￼and that my specification also contains specific ￼`x-microcks` attributes and notations like `{{}}` expressions. We’ll dive into their explanations just after! 

```yaml
paths:
  /login/oauth/authorize:
    get:
      parameters:
        - name: response_type
          in: query
          description: Expected response type
          schema:
            type: string
          examples:
            generic:
              value: code
        - name: client_id
          in: query
          description: The client identifier for the OAuth 2.0 client that the token was issued to.
          schema:
            type: string
          examples:
            generic:
              value: GHCLIENT
        - name: scope
          in: query
          description: String containing a plus-separated list of scope values
          schema:
            type: string
          examples:
            generic:
              value: openid+user:email
        - name: state
          in: query
          description: Client state that should appear in redirect directive
          schema:
            type: string
          examples:
            generic:
              value: e956e017-5e13-4c9d-b83b-6dd6337a6a86
        - name: redirect_uri
          in: query
          description: Redirect to this URI after successful authorization
          schema:
            type: string
            format: uri
          examples:
            generic:
              value: http://localhost:8080/Login/githubLoginSuccess
      x-microcks-operation:
        dispatcher: FALLBACK
        dispatcherRules: |-
          {
            "dispatcher": "URI_PARAMS",
            "dispatcherRules": "response_type",
            "fallback": "generic"
          }
      responses:
        '302':
          description: Redirect
          x-microcks-refs: 
            - generic
          headers:
            'Location':
              schema:
        	    type: string
			  examples:
                generic:
                  value: "{{ request.params[redirect_uri] }}?state={{ request.params[state] }}&code={{ uuid() }}"
```

1️⃣ Let’s begin with explanations on the `x-microcks-refs` attribute with the `302` response. 

Microcks mocks are based on request/response pairs collected within API artifacts. However, in this situation where the `302` response has no content, we cannot directly associate a response example with request elements. The `x-microcks-refs` covers this situation and explicitly tells that we have a request/response pair where elements matching the `generic` request will be associated with a `302` response.  We have a request/response pair!

2️⃣ Now, let’s check the `x-microcks-operation` attribute within the operation definition. 

Microcks mocks use [dispatchers and dispatching rules](https://microcks.io/documentation/explanations/dispatching/) to identify a request/response pair - and so the response to return - by analyzing incoming request elements. Microcks is inferring the dispatcher to use when not specified by checking all the request elements. In our case, we don’t want that as we always want to return the `302` response we named￼`generic.` So for that, we define a custom dispatcher as a `FALLBACK` that will, when failing, return the `generic` response. The root dispatcher `URI_PARAMS` will never match here, and we will always have a `302` response.

3️⃣ Finally, explore the templating features using the `{{}}` notations for the location header on the last line.

Microcks can use [templates](https://microcks.io/documentation/references/templates/) for mock responses content and now header values!  
* `request.params[redirect_uri]` will be evaluated and replaced by the value of the `redirect_uri` query parameter of the incoming request. Allowing to navigate to the target location,
* `request.params[state]` will be evaluated and replaced by the value of `state` query parameter of the incoming request. Allowing you to transfer state back to the target location,
* `uuid()` will be evaluated as a function and replaced by the value of a new [Universally Unique IDentifier](https://en.wikipedia.org/wiki/Universally_unique_identifier). 

Easy, no? 😜

## Test our mock

Loading this OpenAPI specification file into Microcks will give you a local endpoint ready to receive requests and use our mock response. My base URL is `http://localhost:8080/rest/GitHub+OIDC/1.1.4` as I mimic this OIDC on GitHub OIDC API. Let’s try it out with a CURL command:

```shell
$ curl -X GET 'http://localhost:8080/rest/GitHub+OIDC/1.1.4/login/oauth/authorize?response_type=code&client_id=GHCLIENT&scope=openid+user:email&redirect_uri=http://localhost:8080/Login/githubLoginSuccess&state=e956e017-5e13-4c9d-b83b-6dd6337a6a86' -v
==== OUTPUT ====
[...]
> 
< HTTP/1.1 302 
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE
< Access-Control-Max-Age: 3600
< Access-Control-Allow-Headers: host, user-agent, accept
< Location: http://localhost:8080/Login/githubLoginSuccess?state=e956e017-5e13-4c9d-b83b-6dd6337a6a86&code=5bd0c5f6-bf26-4892-a10a-a4cbcb0cc17f
< X-Content-Type-Options: nosniff
< X-XSS-Protection: 0
< Cache-Control: no-cache, no-store, max-age=0, must-revalidate
< Pragma: no-cache
< Expires: 0
< Content-Length: 0
< Date: Mon, 22 Apr 2024 09:58:00 GMT
< 
* Connection #0 to host localhost left intact
```

Yep! That works well! And each and every time I send new requests, I’ll receive a new `code` in the `Location` header of my `302` response! 🎉

## Thinking about it 💭

Technical prowess is always admirable, but what I like the most about the final result of **this enhanced OpenAPI spec is that it brilliantly illustrates the power of examples**! Not only do examples allow the API consumer to grasp the real, contextual meaning of information, but **they also allow understanding of part of the API behavior when expressed using Microcks features!** In this OIDC case, it’s clear that the redirection is not just textual documentation lying somewhere on a website. It’s something that becomes part of the API specification, which may avoid inconsistency and speed up the onboarding of new consumers discovering the API. And BTW, it will allow this consumer to test it out in real life using Microcks mocks quickly!

What if you don’t like putting specific extensions in your OpenAPI specification or mixing concerns? We’ve got you covered! Because Microcks supports a multi-artifacts definition of mocks, you can actually **split those specific notations into another OpenAPI file which will be treated as an overlay**. That’s what we’ve done with this OIDC sample, available on this [GitHub repository](https://github.com/microcks/microcks-quickstarters/tree/main/oidc/github.com).

Thanks for reading and do not hesitate to reach out if you want to help push this OIDC prototype further.
