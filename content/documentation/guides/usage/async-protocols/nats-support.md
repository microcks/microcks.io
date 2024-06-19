---
draft: false
title: "NATS Mocking & Testing"
date: 2023-01-30
publishdate: 2023-01-30
lastmod: 2024-05-13
weight: 5
---

## Overview

This guide shows you how to use a [NATS](https://nats.io/) protocol with Microcks. NATS is a Cloud Native, Open Source and High-performance Messaging technology.  It is a single technology that enables applications to securely communicate across any combination of cloud vendors, on-premise, edge, web and mobile, and devices. Client APIs are provided in over 40 languages and frameworks and you can check out the [full list of clients](https://nats.io/download/).

Microcks supports NATS as a protocol binding for [AsyncAPI](/documentation/references/artifacts/asyncapi-conventions/). That means that Microcks is able to connect to a NATS broker for publishing mock messages as soon as it receives a valid [AsyncAPI](https://asyncapi.com) Specification and to connect to any NATS broker in your organization to check that flowing messages are compliant to the schema described within your specification.

Let's go! 🚀

## 1. Setup NATS broker connection

First mandatory step here is to setup Microcks so that it will be able to connect to a NATS broker for sending mock messages. Microcks has been tested successfully with NATS version `2.9.8`. It can be deployed as containerized workload on your Kubernetes cluster. Microcks does not provide any installation scripts or procedures ; please refer to projects or related products documentation.

If you have used the [Operator based installation](/documentation/references/configuration/operator-config/) of Microcks, you'll need to add some extra properties to your `MicrocksInstall` custom resource. The fragment below shows the important ones:

```yaml
apiVersion: microcks.github.io/v1alpha1
kind: MicrocksInstall
metadata:
  name: microcks
spec:
  [...]
  features:
    async:
      enabled: true
      [...]
      nats:
        url: nats-broker.app.example.com:4222
        username: microcks
        password: microcks
```

The `async` feature should of course be enabled and then the important things to notice are located in to the `nats` block:

* `url` is the hostname + port where broker can be reached by Microcks,
* `username` is simply the user to use for authenticating the connection,
* `password` represents this user credentials.

If you have used the [Helm Chart based installation](/documentation/references/configuration/helm-chart-config/) of Microcks, this is the corresponding fragment put in a `Values.yml` file:

```yaml
[...]
features:
  async:
    enabled: true
    [...]
    nats:
      url: nats-broker.app.example.com:4222
      username: microcks
      password: microcks
```

Actual connection to the NATS broker will only be made once Microcks will send mock messages to it. Let see below how to use NATS binding with AsyncAPI. 

## 2. Use NATS in AsyncAPI

As NATS is not the default binding into Microcks, you should explicitly add it as a valid binding within your AsyncAPI contract. Here is below a fragment of AsyncAPI specification file that shows the important things to notice when planning to use NATS and Microcks with AsyncAPI. It comes for one sample you can find on our [GitHub repository](https://github.com/microcks/microcks/blob/1.7.x/samples/UserSignedUpAPI-asyncapi-nats.yml).

```yaml
asyncapi: '2.0.0'
id: 'urn:io.microcks.example.user-signedup'
[...]
channels:
  user/signedup:
    [...]
    subscribe:
      [...]
      bindings:
        nats:
          queue: my-nats-queue
      message:
        [...]
        payload:
          [...]
```

You'll notice that we just have to add a `nats` non empty block within the operation `bindings`. Just define one  property (like `queue` for example) and Microcks will detect this binding has been specified. See the full [binding spec](https://github.com/asyncapi/bindings/tree/master/nats) for details.

As usual, as Microcks internal mechanics are based on examples, you will also have to attach examples to your AsyncAPI specification.

```yaml
asyncapi: '2.0.0'
id: 'urn:io.microcks.example.user-signedup'
[...]
channels:
  user/signedup:
    [...]
    subscribe:
      [...]
      message:
        [...]
        examples:
          - laurent:
              summary: Example for Laurent user
              headers: |-
                {"my-app-header": 23}
              payload: |-
                {"id": "{{randomString(32)}}", "sendAt": "{{now()}}", "fullName": "Laurent Broudoux", "email": "laurent@microcks.io", "age": 41}
          - john:
              summary: Example for John Doe user
              headers:
                my-app-header: 24
              payload:
                id: '{{randomString(32)}}'
                sendAt: '{{now()}}'
                fullName: John Doe
                email: john@microcks.io
                age: 36
```

If you're now yet accustomed to it, you may wonder what it this `{{randomFullName()}}` notation? These are just [Templating functions](/documentation/references/templates/) that allow generation of dynamic content! 😉

Now simply import your AsyncAPI file into Microcks either using a **Direct upload** import or by defining a **Importer Job**. Both methods are described in [this page](/documentation/guides/usage/importing-content/).

## 3. Validate your mocks

Now it’s time to validate that mock publication of messages on the connected broker is correct. In a real world scenario this mean developing a consuming script or application that connects to the topic where Microcks is publishing messages.

For our `User signed-up API`, we have such a consumer [in one GitHub repository](https://github.com/microcks/api-tooling/blob/main/async-clients/natsjs-client/consumer.js).

Follow the following steps to retrieve it, install dependencies and check the Microcks mocks:

```sh
$ git clone https://github.com/microcks/api-tooling.git
$ cd api-tooling/async-clients/natsjs-client
$ npm install

$ node consumer.js nats-broker.app.example.com:4222 UsersignedupAPI-0.1.30-user/signedup microcks microcks
Connecting to nats-broker.app.example.com:4222 on topic UsersignedupAPI-0.1.30-user/signedup
{
  "id": "eyN7TbotUwN6RTPD4mRwwStS8gBA7tI6",
  "sendAt": "1675085731224",
  "fullName": "Laurent Broudoux",
  "email": "laurent@microcks.io",
  "age": 41
}
{
  "id": "IsjSzI7o910s30QXrJGeAfqgGEsPw9uO",
  "sendAt": "1675085731227",
  "fullName": "John Doe",
  "email": "john@microcks.io",
  "age": 36
}
[...]
```

🎉 Fantastic! We are receiving the two different messages corresponding to the two defined examples each and every 3 seconds that is the default publication frequency. You'll notice that each `id` and `sendAt` properties have different value sthanks to the templating notation.

## 4. Run AsyncAPI tests

Now the final step is to perform some test of the validation features in Microcks. As we will need API implementation for that it’s not as easy as writing HTTP based API implementation, we have some helpful scripts in our `api-tooling` GitHub repository. This scripts are made for working with the `User signed-up API` sample we used so far but feel free to adapt them for your own use.

Imagine that you want to validate messages from a `QA` environment with dedicated NATS broker. Still being in the `natsjs-client` folder, now use the `producer.js` utility script to publish messages on a `user-signedups` queue:

```sh
$ node producer.js nats-broker-qa.app.example.com:4222 user-signedups qa-user qa-password
Connecting to nats-broker-qa.app.example.com:4222 on topic user-signedups
Sending {"id":"itq382xi2usbz41nwel888","sendAt":"1675089667454","fullName":"Laurent Broudoux","email":"laurent@microcks.io","age":41}
Sending {"id":"qfb0fn4yrff06ylrge5fh75","sendAt":"1675089670454","fullName":"Laurent Broudoux","email":"laurent@microcks.io","age":41}
[...]
```

Do not interrupt the execution of the script for now.

If the **QA** broker access is secured - let's say with credentials and custom certificates - we will first have to manage a [Secret](/documentation/guides/administration/secrets/) in Microcks to hold these informations. Within Microcks console, first go to the **Administration** section and the **Secrets** tab.

> **Administration** and **Secrets** will only be available to people having the `administrator` role assigned. Please check [this documentation](/documentation/guides/administration/users/) for details.

The screenshot below illustrates the creation of such a secret for your `QA NATS Broker` with username, and credentials.

{{< image src="images/guides/nats-broker-secret.png" alt="image" zoomable="true" >}}

Once saved we can go create a **New Test** within Microcks web console. Use the following elements in the Test form:

* **Test Endpoint**: `nats://nats-broker-qa.app.example.com:4222/user-signedups` that is referencing the NATS broker endpoint,
* **Runner**: `ASYNC API SCHEMA` for validating against the AsyncAPI specification of the API,
* **Timeout**: Keep the default of 10 seconds,
* **Secret**: This is where you'll select the **QA NATS Broker** you previously created.

Launch the test and wait for some seconds and you should get access to the test results as illustrated below:

{{< image src="images/guides/nats-test-success.png" alt="image" zoomable="true" >}}

This is fine and we can see that Microcks captured messages and validated them against the payload schema that is embedded into the AsyncAPI specification. In our sample, every property is `required` and message does not allow `additionalProperties` to be present, `sendAt` is of string type.

So now let see what happened if we tweak that a bit... Open the `producer.js` script in your favorite editor to put comments on lines 28 and 29 and to remove comments on lines 30 and 31. It's removing the `fullName` measure and adding an unexpected `displayName` property and it's also changing the type of the `sendAt` property as shown below after having restarted the producer:

```sh
$ node producer.js nats-broker-qa.app.example.com:4222 user-signedups qa-user qa-password
Connecting to nats-broker-qa.app.example.com:4222 on topic user-signedups
Sending {"id":"9x12cp2u40f01avend41ryw","sendAt":1675092166658,"displayName":"Laurent Broudoux","email":"laurent@microcks.io","age":41}
Sending {"id":"han9zjhmqhkzkl76epz4xm","sendAt":1675092169659,"displayName":"Laurent Broudoux","email":"laurent@microcks.io","age":41}
Sending {"id":"kdmsl91ydtn7xf99jzy8","sendAt":1675092172660,"displayName":"Laurent Broudoux","email":"laurent@microcks.io","age":41}
[...]
```

Relaunch a new test and you should get results similar to those below:

{{< image src="images/guides/nats-test-failure.png" alt="image" zoomable="true" >}}

🥳 We can see that there's now a failure and that's perfect! What does that mean? It means that when your application or devices are sending garbage, Microcks will be able to spot this and inform you that the expected message format is not respected.

## Wrap-Up

In this guide we have seen how Microcks can also be used to send mock messages on a Google PubSub service connected to the Microcks instance. This helps speeding-up the development of application consuming these messages. We finally ended up demonstrating how Microcks can be used to detect any drifting issues between expected message format and the one effectively used by real-life producers.

Thanks for reading and let you know what you think on our [Discord chat](https://microcks.io/discord-invite) 🐙