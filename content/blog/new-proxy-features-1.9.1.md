---
title: Introducing new Proxy features in Microcks 1.9.1
date: 2024-05-13
image: "images/blog/new-proxy-features-1.9.1-feature.png"
author: "Nikolay Afanasyev"
type: "regular"
description: "Introducing new Proxy features in Microcks 1.9.1"
draft: false
---

We all know about the many benefits of Microcks, which makes it an excellent tool for the software development process. When I first started using it, everything went smoothly. However, there is no limit to QA's expectations 😊

Recently, a quality assurance specialist approached me with a request: "The mocks work fine, but we need to implement a new testing scenario. Every third or random response should be a mock-up, while the rest should be from the actual service..."


To achieve this, we could use an external load balancer, for example. Additionally, we would need a new configuration point for the balancer, its behavior, and so on... This is not the Samurai way 😊

{{< image src="images/blog/new-proxy-features-1.9.1-feature.png" alt="new-proxy-features-1.9.1-feature" >}}

Luckily, Microcks is an open-source project with an active community. After discussing the [issue](https://github.com/microcks/microcks/issues/1100) with Laurent, we created two dispatchers to provide simple and advanced proxy logic available for REST, SOAP, and GraphQL protocols.

Those two new dispatchers - to be released in the `1.9.1` version of Microcks - are called `PROXY` and `PROXY_FALLBACK`. While `PROXY` acts exactly as its name suggests, you’ll see that `PROXY_FALLBACK` handles a bit more logic and allows handling advanced use cases. Let’s dive into the explanations!

## The new PROXY behaviors

The simple `PROXY` dispatcher simply changes the base URL of the Microcks and makes a call to the real backend service.

{{< image src="images/blog/new-proxy-features-1.9.1-proxy.png" alt="new-proxy-features-1.9.1-proxy" >}}

Enabling the `PROXY` dispatcher is a per-operation setting. That means that within the same API, you may have some operations that use regular mocks and others that just delegate API calls to a real backend system. Your client still calls the Microcks endpoints though - allowing you a smooth transition from mocked inexistent operation to ready-ones on a real implementation. 

The advanced `PROXY_FALLBACK` dispatcher works similarly to the [`FALLBACK` dispatcher](https://microcks.io/documentation/explanations/dispatching/#fallback-dispatcher), but with one key difference: when no matching response is found within the Microcks’ dataset, instead of returning a fallback response, it changes the base URL of the request and makes a call to the real service.

{{< image src="images/blog/new-proxy-features-1.9.1-proxy-fallback.png" alt="new-proxy-features-1.9.1-proxy-fallback" >}}

Here again, enabling this proxy mechanism is a per-operation setting that allows you to mix different behaviors in the same Microcks API endpoints. Hence, you can use regular mocks, or try to proxy a request when nothing is found on the Microcks’ side or always proxy to the real backend.

## How do we enable them?

Dispatcher configuration in Microcks is a per-operation setting, so enabling `PROXY` or `PROXY_FALLBACK` must be done at the operation level. There are many ways to set up this part in Microcks - overriding the inferred default dispatching mechanism, you can: use the UI, use the API, use a Metadata artifact, or use API specification extensions like we did just below. 

#### `PROXY`

To enable the `PROXY` dispatching, we only need to specify `PROXY` as the `dispatcher` and the base URL of the actual service as the  `dispatcherRules`:

```yaml
x-microcks-operation:
  dispatcher: PROXY
  dispatcherRules: http://external.net/myService/v1
```

#### `PROXY_FALLBACK`

The configuration of the `PROXY_FALLBACK` dispatcher is similar to that of the `FALLBACK` dispatcher. However, instead of the `fallback` key and its value which refers to the response name, we have the `proxyUrl` key with the base URL of the actual service as its value:

```yaml
x-microcks-operation:
  dispatcher: PROXY_FALLBACK
  dispatcherRules: |
    {
      "dispatcher": "URI_PARTS",
      "dispatcherRules": "name",
      "proxyUrl": "http://external.net/myService/v1/"
    }
```

## Myriad of opportunities!

So, now we have two more ways to customize Microcks' behavior. Why would we need this?

We can now set up Microcks' URL for our client application and switch between mocking and calling the actual backend service by turning on/off the proxy dispatcher in the Microcks UI without any changes to the client application configuration.

And if we need some kind of automated, exotic logic, we can use the power of the [`SCRIPT` dispatcher](https://microcks.io/documentation/explanations/dispatching/#script-dispatcher), which the `PROXY_FALLBACK` dispatcher wraps. This is the approach I took to implement the behavior that the QA engineer requested.

```yaml
x-microcks-operation:
  dispatcher: PROXY_FALLBACK
  dispatcherRules: |
    {
      "dispatcher": "SCRIPT",
      "dispatcherRules": "if (new Random().nextInt(3) == 0) { return 'mock'; }",
      "proxyUrl": "http://external.net/myService/v1/"
    }
```

I really hope this new feature will be helpful. Based on my own experience, I would say that the contribution process is easy and comfortable. The journey from an idea to the finished feature has been a pleasant experience for me. So If you have any ideas on making Microcks more powerful, please feel free to share your thoughts with the community!
