---
draft: false
title: "MQTT Mocking & Testing"
date: 2021-02-14
publishdate: 2021-02-15
lastmod: 2024-05-13
weight: 3
---

## Overview

This guide shows you how to use the [Message Queuing Telemetry Transport (MQTT)](https://mqtt.org/) protocol with Microcks. MQTT is a standard messaging protocol for the Internet of Things (IoT). It is used today in a wide variety of industries, such as automotive, manufacturing, telecommunications, oil and gas, etc.

Microcks supports MQTT as a protocol binding for [AsyncAPI](/documentation/references/artifacts/asyncapi-conventions/). That means that Microcks is able to connect to a MQTT broker for publishing mock messages as soon as it receives a valid [AsyncAPI](https://asyncapi.com) Specification and to connect to any MQTT broker in your organization to check that flowing messages are compliant to the schema described within your specification.

Let's start! 🚀

## 1. Setup MQTT broker connection

First mandatory step here is to setup Microcks so that it will be able to connect to a MQTT broker for sending mock messages. Microcks has been tested successfully with [ActiveMQ Artemis](https://activemq.apache.org/components/artemis/) as well as [Eclipse Mosquitto](https://mosquitto.org/) with MQTT protocol version `3.1.1`. Both can be deployed as containerized workload on your Kubernetes cluster. Microcks does not provide any installation scripts or procedures ; please refer to projects or related products documentation.

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
      mqtt:
        url: mqtt-broker.app.example.com:1883
        username: microcks
        password: microcks
```

The `async` feature should of course be enabled and then the important things to notice are located in to the `mqtt` block:

* `url` is the hostname + port where broker can be reached by Microcks,
* `username` is simply the user to use for authenticating the connection,
* `password` represents this user credentials.

> For now, Microcks does not support connecting to a broker secured using TLS. This is tracked in a [RFE here](https://github.com/microcks/microcks/issues/316) and will be implemented in a near future.

If you have used the [Helm Chart based installation](/documentation/references/configuration/helm-chart-config/) of Microcks, this is the corresponding fragment put in a `Values.yml` file:

```yaml
[...]
features:
  async:
    enabled: true
    [...]
    mqtt:
      url: mqtt-broker.app.example.com:1883
      username: microcks
      password: microcks
```

Actual connection to the MQTT broker will only be made once Microcks will send mock messages to it. Let see below how to use MQTT binding with AsyncAPI. 

## 2. Use MQTT in AsyncAPI

As MQTT is not the default binding into Microcks, you should explicitly add it as a valid binding within your AsyncAPI contract. Here is below a fragment of AsyncAPI specification file that shows the important things to notice when planning to use Avro and Microcks with AsyncAPI. It comes for one sample you can find on our [GitHub repository](https://github.com/microcks/microcks/blob/master/webapp/src/test/resources/io/github/microcks/util/asyncapi/streetlights-asyncapi.yaml).

```yaml
asyncapi: '2.0.0'
id: 'urn:io.microcks.example.streetlights'
[...]
channels:
  smartylighting/streetlights/event/lighting/measured:
    [...]
    subscribe:
      [...]
      bindings:
        mqtt:
          qos: 0
          retain: false
```

You'll notice that we just have to add a `mqtt` non empty block within the operation `bindings`. Just define one or property (like `qos` for example) and Microcks will detect this binding has been specified.

As usual, as Microcks internal mechanics are based on examples, you will also have to attach examples to your AsyncAPI specification.

In our example we have used references to a shared message structure that is also holding examples. We have defined 3 virtual devices that are sending their lumens measure and the corresponding date, still coming from our [GitHub repository](https://github.com/microcks/microcks/blob/master/webapp/src/test/resources/io/github/microcks/util/asyncapi/streetlights-asyncapi.yaml).

```yaml
asyncapi: '2.0.0'
id: 'urn:io.microcks.example.streetlights'
[...]
defaultContentType: application/json
channels:
  smartylighting/streetlights/event/lighting/measured:
    [...]
    subscribe:
      [...]
      bindings:
        mqtt:
          qos: 0
          retain: false
      message:
        $ref: '#/components/messages/lightMeasured'
components:
  messages:
    lightMeasured:
      [...]
      traits:
        - $ref: '#/components/messageTraits/commonHeaders'
      payload:
        $ref: '#/components/schemas/lightMeasuredPayload'
      examples:
        - dev0:
            summary: Example for Device 0
            headers: |-
              {"my-app-header": 14}
            payload: |-
              {"streetlightId":"dev0", "lumens":1000, "sentAt":"{{now(yyyy-MM-dd'T'HH:mm:SS'Z')}}"}
        - dev1:
            summary: Example for Device 1
            headers:
              my-app-header: 14
            payload:
              streetlightId: dev1
              lumens: 1100
              sentAt: "{{now(yyyy-MM-dd'T'HH:mm:SS'Z')}}"
        - dev2:
            summary: Example for Device 2
            headers:
              my-app-header: 14
            payload:
              streetlightId: dev2
              lumens: 1200
              sentAt: "{{now(yyyy-MM-dd'T'HH:mm:SS'Z')}}"
``` 

If you're now yet accustomed to it, you may wonder what it this `{{now(yyyy-MM-dd'T'HH:mm:SS'Z')}}` notation? These are just [Templating functions](/documentation/references/templates/) that allow generation of dynamic content! 😉

Now simply import your AsyncAPI file into Microcks either using a **Direct upload** import or by defining a **Importer Job**. Both methods are described in [this page](/documentation/guides/usage/importing-content/).

## 3. Validate your mocks

Now it’s time to validate that mock publication of messages on the connected broker is correct. In a real world scenario this mean developing a consuming script or application that connects to the topic where Microcks is publishing messages.

For our `Streetlights API`, we have such a consumer [in one GitHub repository](https://github.com/microcks/api-tooling/blob/main/async-clients/mqttjs-client/consumer.js).

Follow the following steps to retrieve it, install dependencies and check the Microcks mocks:

```sh
$ git clone https://github.com/microcks/api-tooling.git
$ cd api-tooling/async-clients/mqttjs-client
$ npm install

$ node consumer.js mqtt://mqtt-broker.app.example.com:1883 StreetlightsAPI_1.0.0_smartylighting-streetlights-event-lighting-measured microcks microcks
Connecting to mqtt://mqtt-broker.app.example.com:1883 on topic StreetlightsAPI_1.0.0_smartylighting-streetlights-event-lighting-measured
{
  "streetlightId": "dev0",
  "lumens": 1000,
  "sentAt": "2021-02-14T10:01:783Z"
}
{
  "streetlightId": "dev1",
  "lumens": 1100,
  "sentAt": "2021-02-14T10:01:784Z"
}
{
  "streetlightId": "dev2",
  "lumens": 1200,
  "sentAt": "2021-02-14T10:01:785Z"
}
```

🎉 Fantastic! We are receiving the three different messages corresponding to the three defined devices each and every 3 seconds that is the default publication frequency. You'll notice that each `sentAt` property has a different value thanks to the templating notation.

> Note: this simple `consumer.js` script is also able to handled TLS connections to your MQTT broker. It was omitted here for sake of simplicity but you can also use commands like: `node consumer.js mqtts://artemis-my-acceptor-0-svc-rte-microcks.apps.example.com:443 StreetlightsAPI_1.0.0_smartylighting-streetlights-event-lighting-measured admin mypassword broker.crt`


## 4. Run AsyncAPI tests

Now the final step is to perform some test of the validation features in Microcks. As we will need API implementation for that it’s not as easy as writing HTTP based API implementation, we have some helpful scripts in our `api-tooling` GitHub repository. This scripts are made for working with the `Streetlights API` sample we used so far but feel free to adapt them for your own use.

Imagine that you want to validate messages from a `QA` environment with dedicated MQTT broker. Still being in the `mqttjs-client` folder, now use the `producer.js` utility script to publish messages on a `streetlights-event-lighting-measured` topic:

```sh
$ node producer.js mqtts://mqtt-broker-qa.app.example.com:443 streetlights-event-lighting-measured qa-user qa-password broker-qa.crt       
Connecting to mqtts://mqtt-broker-qa.app.example.com:443 on topic streetlights-event-lighting-measured
{
  streetlightId: 'devX',
  lumens: 900,
  sentAt: '2021-02-15T09:06:42.744Z'
}
{
  streetlightId: 'devX',
  lumens: 900,
  sentAt: '2021-02-15T09:06:45.750Z'
}
[...]
```

Do not interrupt the execution of the script for now.

If the **QA** broker access is secured - let's say with credentials and custom certificates - we will first have to manage a [Secret](/documentation/guides/administration/secrets/) in Microcks to hold these informations. Within Microcks console, first go to the **Administration** section and the **Secrets** tab.

> **Administration** and **Secrets** will only be available to people having the `administrator` role assigned. Please check [this documentation](/documentation/guides/administration/users/) for details.

The screenshot below illustrates the creation of such a secret for your `QA MQTT Broker` with username, credentials and custom certificates using the [PEM format](https://en.wikipedia.org/wiki/Privacy-Enhanced_Mail).

{{< image src="images/guides/mqtt-broker-secret.png" alt="image" zoomable="true" >}}

Once saved we can go create a **New Test** within Microcks web console. Use the following elements in the Test form:

* **Test Endpoint**: `mqtt://mqtt-broker-qa.app.example.com:443/streetlights-event-lighting-measured` that is referencing the MQTT broker endpoint,
* **Runner**: `ASYNC API SCHEMA` for validating against the AsyncAPI specification of the API,
* **Timeout**: Keep the default of 10 seconds,
* **Secret**: This is where you'll select the **QA MQTT Broker** you previously created.

Launch the test and wait for some seconds and you should get access to the test results as illustrated below:

{{< image src="images/guides/mqtt-test-success.png" alt="image" zoomable="true" >}}

This is fine and we can see that Microcks captured messages and validate them against the payload schema that is embedded into the AsyncAPI specification. In our sample, every property is `required` and message does not allow `additionalProperties` to be defined.

So now let see what happened if we tweak that a bit... Open the `producer.js` script in your favorite editor to put comments on line 35 and to remove comments from line 36. It's removing the `lumens` measure and adding an unexpected `location` property as shown below after having restarted the producer:

```sh
$ node producer.js mqtts://mqtt-broker-qa.app.example.com:443 streetlights-event-lighting-measured qa-user qa-password broker-qa.crt
Connecting to mqtts://mqtt-broker-qa.app.example.com:443 on topic streetlights-event-lighting-measured
{
  streetlightId: 'devX',
  location: '47.8509682604982, 0.11136576784773598',
  sentAt: '2021-02-15T10:04:49.669Z'
}
{
  streetlightId: 'devX',
  location: '47.8509682604982, 0.11136576784773598',
  sentAt: '2021-02-15T10:04:52.676Z'
}
[...]
```

Relaunch a new test and you should get results similar to those below:

{{< image src="images/guides/mqtt-test-failure.png" alt="image" zoomable="true" >}}

🥳 We can see that there's now a failure and that's perfect! What does that mean? It means that when your application or devices are sending garbage, Microcks will be able to spot this and inform you that the expected message format is not respected.

## Wrap-Up

In this guide we have seen how Microcks can also be used to send mock messages on a MQTT Broker connected to the Microcks instance. This helps speeding-up the development of application consuming these messages. We finally ended up demonstrating how Microcks can be used to detect any drifting issues between expected message format and the one effectively used by real-life producers.

Thanks for reading and let you know what you think on our [Discord chat](https://microcks.io/discord-invite) 🐙