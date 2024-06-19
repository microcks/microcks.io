---
draft: false
title: "RabbitMQ Mocking & Testing"
date: 2022-11-22
publishdate: 2022-11-22
lastmod: 2024-05-13
weight: 4
---

## Overview

This guide shows you how to use the [RabbitMQ](https://www.rabbitmq.com/) protocol with Microcks. RabbitMQ is one of the most popular open source message broker that is supporting different protocols and more specifically [AMQP 0.9.1](https://www.rabbitmq.com/resources/specs/amqp0-9-1.pdf), RabbitMQ was originally developed for.

Microcks supports RabbitMQ/AMQP as a protocol binding for [AsyncAPI](/documentation/references/artifacts/asyncapi-conventions/). That means that Microcks is able to connect to a RabbitMQ broker for publishing mock messages as soon as it receives a valid [AsyncAPI](https://asyncapi.com) Specification and to connect to any RabbitMQ broker in your organization to check that flowing messages are compliant to the schema described within your specification.

Let's start! 🚀

## 1. Setup RabbitMQ broker connection

First mandatory step here is to setup Microcks so that it will be able to connect to a RabbitMQ broker for sending mock messages. Microcks has been tested successfully with RabbitMQ version `3.9.13`. It can be deployed as containerized workload on your Kubernetes cluster. Microcks does not provide any installation scripts or procedures ; please refer to projects or related products documentation.

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
      amqp:
        url: rabbitmq-broker.app.example.com:5672
        username: microcks
        password: microcks
```

The `async` feature should of course be enabled and then the important things to notice are located in to the `amqp` block:

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
    amqp:
      url: rabbitmq-broker.app.example.com:5672
      username: microcks
      password: microcks
```

Actual connection to the RabbitMQ broker will only be made once Microcks will send mock messages to it. Let see below how to use AMQP binding with AsyncAPI. 

## 2. Use RabbitMQ in AsyncAPI

As AMQP is not the default binding into Microcks, you should explicitly add it as a valid binding within your AsyncAPI contract. Here is below a fragment of AsyncAPI specification file that shows the important things to notice when planning to use AMQP and Microcks with AsyncAPI. It comes for one sample you can find on our [GitHub repository](https://github.com/microcks/api-lifecycle/blob/master/account-service-demo-amqp/account-service-asyncapi-1.1.0.yml).

```yaml
asyncapi: '2.1.0'
info:
  title: Account Service
  [...]
channels:
  user/signedup:
    bindings:
      amqp:
        is: routingKey
        exchange:
          name: signedup-exchange
          type: topic
          durable: true
          autoDelete: false
          vhost: /
        bindingVersion: 0.2.0
    subscribe:
      message:
        $ref: '#/components/messages/UserSignedUp'
[...]    
```

You'll notice that we just have to add a `amqp` non empty block within the channel `bindings`. An `amqp` is either a a `queue` or `routingKey`. When choosing a `routingKey` you're in fact describing an exchange that should be further typed as `topic`, `direct`, `fanout` or `headers`. See the full [binding spec](https://github.com/asyncapi/bindings/tree/master/amqp) for details.

As usual, as Microcks internal mechanics are based on examples, you will also have to attach examples to your AsyncAPI specification.

```yaml
asyncapi: '2.1.0'
info:
  title: Account Service
  [...]
channels:
  user/signedup:
    bindings:
      amqp:
        is: routingKey
        exchange:
          name: signedup-exchange
          type: topic
          durable: true
          autoDelete: false
          vhost: /
        bindingVersion: 0.2.0
    subscribe:
      message:
        $ref: '#/components/messages/UserSignedUp'
components:
  messages:
    UserSignedUp:
      payload:
        [...]
      examples:
        - name: Laurent
          payload:
            displayName: Laurent Broudoux
            email: laurent@microcks.io
        - name: Random
          payload:
            displayName: '{{randomFullName()}}'
            email: '{{randomEmail()}}'
```

If you're now yet accustomed to it, you may wonder what it this `{{randomFullName()}}` notation? These are just [Templating functions](/documentation/references/templates/) that allow generation of dynamic content! 😉

Now simply import your AsyncAPI file into Microcks either using a **Direct upload** import or by defining a **Importer Job**. Both methods are described in [this page](/documentation/guides/usage/importing-content/).

## 3. Validate your mocks

Now it’s time to validate that mock publication of messages on the connected broker is correct. In a real world scenario this mean developing a consuming script or application that connects to the topic where Microcks is publishing messages.

For our `Account Service`, we have such a consumer [in one GitHub repository](https://github.com/microcks/api-tooling/blob/main/async-clients/amqpjs-client/consumer.js).

Follow the following steps to retrieve it, install dependencies and check the Microcks mocks:

```sh
$ git clone https://github.com/microcks/api-tooling.git
$ cd api-tooling/async-clients/amqpjs-client
$ npm install

$ node consumer.js amqp://<user>:<password>@rabbitmq-broker.app.example.com:5672 AccountService-1.1.0-user/signedup
Connecting to amqp://<user>:<password>@rabbitmq-broker.app.example.com:5672 on topic AccountService-1.1.0-user/signedup
{
  "displayName": "Laurent Broudoux",
  "email": "laurent@microcks.io"
}
{
  "displayName": "Marcela Langworth",
  "email": "abel.kulas@example.com"
}
[...]
```

🎉 Fantastic! We are receiving the two different messages corresponding to the two defined examples each and every 3 seconds that is the default publication frequency. You'll notice that each `displayName` and `email` properties have a different value thanks to the templating notation.


## 4. Run AsyncAPI tests

Now the final step is to perform some test of the validation features in Microcks. As we will need API implementation for that it’s not as easy as writing HTTP based API implementation, we have some helpful scripts in our `api-tooling` GitHub repository. This scripts are made for working with the `Account Service` sample we used so far but feel free to adapt them for your own use.

Imagine that you want to validate messages from a `QA` environment with dedicated RabbitMQ broker. Still being in the `amqpjs-client` folder, now use the `producer.js` utility script to publish messages on a `signedup-exchange` topic. Our producer takes care of creating a non-durable exchange of type topic on RabbitMQ broker:

```sh
$ node producer.js amqp://<user>:<password>@rabbitmq-qa-broker.app.example.com:5672 signedup-exchange topic
Connecting to amqp://<user>:<password>@rabbitmq-qa-broker.app.example.com:5672 on destination signedup-exchange
Publishing {"displayName":"John Doe","email":"john@doe.com"}
Publishing {"displayName":"John Doe","email":"john@doe.com"}
Publishing {"displayName":"John Doe","email":"john@doe.com"}
[...]
```

Do not interrupt the execution of the script for now.

If the **QA** broker access is secured - let's say with credentials and custom certificates - we will first have to manage a [Secret](/documentation/guides/administration/secrets/) in Microcks to hold these informations. Within Microcks console, first go to the **Administration** section and the **Secrets** tab.

> **Administration** and **Secrets** will only be available to people having the `administrator` role assigned. Please check [this documentation](/documentation/guides/administration/users/) for details.

The screenshot below illustrates the creation of such a secret for your `QA RabbitMQ Broker` with username and password.

{{< image src="images/guides/amqp-broker-secret.png" alt="image" zoomable="true" >}}

Once saved we can go create a **New Test** within Microcks web console. Use the following elements in the Test form:

* **Test Endpoint**: `amqp://rabbitmq-qa-broker.app.example.com:5672/t/signedup-exchange` that is referencing the AMQP broker endpoint,
* **Operation**: `SUBSCRIBE user/signedup`
* **Runner**: `ASYNC API SCHEMA` for validating against the AsyncAPI specification of the API,
* **Timeout**: Keep the default of 10 seconds,
* **Secret**: This is where you'll select the **QA RabbitMQ Broker** you previously created.

Launch the test and wait for some seconds and you should get access to the test results as illustrated below:

{{< image src="images/guides/amqp-test-success.png" alt="image" zoomable="true" >}}

> You may have noticed the `/t/` path element in Test endpoint used above. You may be aware that RabbitMQ is supporting different kinds of Exchnages and `/t/` is here to tell Microcks it should consider a topic. As an exercice, you can reuse our `producer.js` script above and replace with `fanout`, `direct` or `headers`. Respectively, you'll have to replace `/t/` with `/f/`, `/d/` and `/h/` to tell Microcks the expected type of Exchange.

This is fine and we can see that Microcks captured messages and validated them against the payload schema that is embedded into the AsyncAPI specification. In our sample, every property is `required` and message does not allow `additionalProperties` to be defined.

So now let see what happened if we tweak that a bit... Open the `producer.js` script in your favorite editor to put comments on line 21 and to remove comments from line 22. It's removing the `displayName` property and adding an unexpected `name` property as shown below after having restarted the producer:

```sh
$ node producer.js amqp://<user>:<password>@rabbitmq-qa-broker.app.example.com:5672 signedup-exchange topic
Connecting to amqp://<user>:<password>@rabbitmq-qa-broker.app.example.com:5672 on destination signedup-exchange
Publishing {"name":"John Doe","email":"john@doe.com"}
Publishing {"name":"John Doe","email":"john@doe.com"}
Publishing {"name":"John Doe","email":"john@doe.com"}
[...]
```

Relaunch a new test and you should get results similar to those below:

{{< image src="images/guides/amqp-test-failure.png" alt="image" zoomable="true" >}}

🥳 We can see that there's now a failure and that's perfect! What does that mean? It means that when your application is sending garbage, Microcks will be able to spot this and inform you that the expected message format is not respected.

## Wrap-Up

In this guide we have seen how Microcks can also be used to send mock messages on a RabbitMQ Broker connected to the Microcks instance. This helps speeding-up the development of application consuming these messages. We finally ended up demonstrating how Microcks can be used to detect any drifting issues between expected message format and the one effectively used by real-life producers.

Thanks for reading and let you know what you think on our [Discord chat](https://microcks.io/discord-invite) 🐙