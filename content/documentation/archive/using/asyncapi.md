---
draft: false
title: "AsyncAPI Mocking and Testing"
date: 2020-08-01
publishdate: 2020-08-05
lastmod: 2024-05-27
weight: 7
---

## Using AsyncAPI extensions

Microcks proposes custom AsyncAPI extensions to specify mocks organizational or behavioral elements that cannot be deduced directly from AsyncAPI document.

At the `info` level of your AsyncAPI document, you can add labels specifications that will be used in [organizing the Microcks repository](https://microcks.io/documentation/using/organizing/). See below illustration and the use of `x-microcks` extension:

```yaml
asyncapi: '2.1.0'
info:
  title: User signed-up API
  version: 0.1.1
  description: This service is in charge of processing user signups
  x-microcks:
    labels:
      domain: authentication
      status: GA
      team: Team B
[...]
```

At the `operation` level of your AsyncAPI document, we could add frequency that is the interval of time in seconds between 2 publications of mock messages.. Let's give an example for OpenAPI using the `x-microcks-operation` extension:

```yaml
[...]
channels:
  user/signedup:
    subscribe:
      x-microcks-operation:
        frequency: 30
      message:
        $ref: '#/components/messages/UserSignedUp'
[...]
```

In AsyncAPI v3.x, `operation` are now differentiated from `channels`. Our extension is still called `x-microcks-operation` and should live at the operation level like illustrated below:

```yaml
[...]
channels:
  user-signedup:
    messages:
      userSignedUp:
        $ref: '#/components/messages/userSignedUp'
operations:
  publishUserSignedUps:
    action: 'send'
    channel:
      $ref: '#/channels/user-signedup'
    messages:
      - $ref: '#/channels/user-signedup/messages/userSignedUp'
    x-microcks-operation:
      frequency: 30
[...]
```

Once `labels` and `frequency` are defined that way, they will overwrite the different customizations you may have done through UI or API during the next import of the AsyncAPI document.