---
draft: false
title: "Kafka, Avro & Schema Registry"
date: 2021-02-10
publishdate: 2021-02-12
lastmod: 2024-05-13
weight: 2
---

## Overview

This guide shows you how to use Microcks for mocking and testing [Avro](https://avro.apache.org) encoding on top of [Apache Kafka](https://kafka.apache.org). You'll see how Microcks can speed-up the sharing of Avro schema to consumers using a Schema Registry and we will check how Microcks can detect drifts between expected Avro format and the one really used.

Microcks supports Avro as an encoding format for mocking and testing asynchronous and event-driven APIs through [AsyncAPI](/documentation/references/artifacts/asyncapi-conventions/). When it comes to serializing Avro data to a Kafka topic, you usually have 2 options :

* The *"old-fashioned one"* that is about putting raw Avro binary representation of the message payload,
* The *"modern one"* that is about putting the Schema ID + the Avro binary representation of the message payload (see [Schema Registry: A quick introduction](https://www.confluent.io/blog/kafka-connect-tutorial-transfer-avro-schemas-across-schema-registry-clusters/)).

This guide presents the 2 options that we will call `RAW` or `REGISTRY`. Microcks is by default configured to manage the `RAW` options so that it does not require any external dependency to get you starting. If you want to stick with this option, we first step below is obviously optional.

## 1. Setup Schema Registry

Microcks has been successfully tested with both [Confluent Schema Registry](https://github.com/confluentinc/schema-registry) and [Apicurio Registry](https://www.apicur.io/registry/). Both can be deployed as containerized workload on your Kubernetes cluster. Microcks does not provide any installation scripts or procedures ; please refer to projects or related products documentation.

When connected to a Schema Registry, Microcks is pushing the Avro Schema to the registry at the same time it is pushing Avro encoded mock messages to the Kafka topic. That way, Event consumers may retrieve Avro Schema from the registry to be able to deserialize messages.

{{< image src="images/guides/avro-kafka-mocking.png" alt="image" zoomable="true" >}}

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
      defaultAvroEncoding: REGISTRY
      kafka:
        [...]
        schemaRegistry:
          url: https://schema-registry.apps.example.com
          confluent: true
          username: microcks
          credentialsSource: USER_INFO
```

The important things to notice are:

* `defaultAvroEncoding` should be set to `REGISTRY` (this is indeed a workaround until AsyncAPI adds support for specifying the serialization details at the Binding level. See [this issue](https://github.com/asyncapi/bindings/issues/41) for more.)
* `schemaRegistry` block should now be specified with correct `url`. The `confluent` mode allows to tell Microcks that the registry is the Confluent one OR to turn on the Confluent compatibility mode if you're using an [Apicurio Registry](https://www.apicur.io/registry/). `username` and `creadentialsSource` are only used if using a secured Confluent registry.

If you have used the [Helm Chart based installation](/documentation/references/configuration/helm-chart-config/) of Microcks, this is the corresponding fragment put in a `Values.yml` file:

```yaml
[...]
features:
  async:
    enabled: true
    [...]
    defaultAvroEncoding: REGISTRY
    kafka:
      [...]
      schemaRegistry:
        url: https://schema-registry.apps.example.com
        confluent: true
        username: microcks
        credentialsSource: USER_INFO
```

Actual connection to the Schema Registry will only be made once Microcks will send Avro messages to Kafka. Let see below how to use Avro encoding with AsyncAPI. 

## 2. Use Avro in AsyncAPI

AsyncAPI allows to reference Avro schema used for serializing / deserializing messages on a Kafka topic. The flexible notation of AsyncAPI allow to do that in 3 different ways:

* Using the *embedded notation*: that means that Avro schema is defined inline within the message `payload` property,
* Using *remote reference*: that means that schema is specified using absolute remote endpoint like `$ref: 'https://schemas.example.com/user'` within the message `payload` property,
* Using *local reference*: that means that schema is specified using relative reference like `$ref: './user-signedup.avsc#/User'` within the message `payload` property.

Here is below a fragment of AsyncAPI specification file that shows the important things to notice when planning to use Avro and Microcks with AsyncAPI. It comes for one sample you can find on [our GitHub repository](https://github.com/microcks/microcks/blob/master/webapp/src/test/resources/io/github/microcks/util/asyncapi/user-signedup-avro-ref-asyncapi.yaml).

```yaml
asyncapi: '2.0.0'
id: 'urn:io.microcks.example.user-signedup'
[...]
channels:
  user/signedup:
    [...]
    subscribe:
      [...]
      contentType: avro/binary
      schemaFormat: application/vnd.apache.avro+json;version=1.9.0
      payload:
        $ref: './user-signedup.avsc#/User'
```

You'll notice that it is of importance that `contentType` and `schemaFormat` property should be defined according to the Avro format. In this GitHub repository same folder, you'll also find the `user-signedup.avsc` file defining the `User` record type like below:

```json
{
  "namespace": "microcks.avro",
  "type": "record",
  "name": "User",
  "fields": [
    {"name": "fullName", "type": "string"},
    {"name": "email",  "type": "string"},
    {"name": "age", "type": "int"}
  ]
}
```

As we use references, our full specification is now spanning multiple files so you'll not be able to simply upload one file for API import into Microcks. You will have to define a full **Importer Job** as described [here](/documentation/guides/usage/importing-content/#2-import-content-via-importer). During the import of the AsyncAPI contract file within Microcks, local references will be resolved and files downloaded and integrated within Microcks own repository. The capture below illustrates in the **Contracts** section that there are now two files: an AsyncAPI and an Avro schema one.

{{< image src="images/guides/avro-kafka-properties.png" alt="image" zoomable="true" >}}

Finally, as Microcks internal mechanics are based on examples, you will also have to attach examples to your AsyncAPI specification. But: how to specify examples for a binary encoding such as Avro? No problem! Simply use JSON or YAML as illustrated in the fragment below, still coming from [our GitHub repository](https://github.com/microcks/microcks/blob/master/webapp/src/test/resources/io/github/microcks/util/asyncapi/user-signedup-avro-ref-asyncapi.yaml).

```yaml 
asyncapi: '2.0.0'
id: 'urn:io.microcks.example.user-signedup'
[...]
channels:
  user/signedup:
    [...]
    subscribe:
      [...]
      examples:
        - laurent:
            payload: |-
              {"fullName": "Laurent Broudoux", "email": "laurent@microcks.io", "age": 41}
        - john:
            payload:
              fullName: John Doe
              email: john@microcks.io
              age: 36
```

## 3. Validate your mocks

Now it's time to validate that mock publication of Avro messages is correct.

### With Schema Registry

When using the `REGISTRY` encoding options with a deployed Schema Registry, things are pretty simple as you can interact with registry either from GUI or CLI. Let's check that Microcks has correctly published the schema for our sample topic. See below the results we have with our sample:

```sh
$ curl https://schema-registry.apps.example.com -s -k | jq . 
[
  "UsersignedupAvroAPI_0.1.2_user-signedup-microcks.avro.User"
]
$ curl https://schema-registry.apps.example.com/subjects/UsersignedupAvroAPI_0.1.2_user-signedup-microcks.avro.User/versions -s -k | jq .
[
  1
]
$ curl https://schema-registry.apps.example.com/subjects/UsersignedupAvroAPI_0.1.2_user-signedup-microcks.avro.User/versions/1 -s -k | jq .
{
  "subject": "UsersignedupAvroAPI_0.1.2_user-signedup-microcks.avro.User",
  "version": 1,
  "id": 1,
  "schema": "{\"type\":\"record\",\"name\":\"User\",\"namespace\":\"microcks.avro\",\"fields\":[{\"name\":\"fullName\",\"type\":\"string\"},{\"name\":\"email\",\"type\":\"string\"},{\"name\":\"age\",\"type\":\"int\"}]}"
}
```

Very nice! We can also use the [`kafkacat` CLI tool](https://github.com/edenhill/kafkacat) to ensure that a topic consumer will be able to deserialize messages using the schema stored into registry.

```sh
$ kafkacat -b microcks-kafka-bootstrap-microcks.apps.example.com:9092 -t UsersignedupAvroAPI_0.1.2_user-signedup -s value=avro -r https://schema-registry.apps.example.com -o end
% Auto-selecting Consumer mode (use -P or -C to override)
% Reached end of topic UsersignedupAvroAPI_0.1.2_user-signedup [0] at offset 114
{"fullName": "Laurent Broudoux", "email": "laurent@microcks.io", "age": 41}
{"fullName": "John Doe", "email": "john@microcks.io", "age": 36}
% Reached end of topic UsersignedupAvroAPI_0.1.2_user-signedup [0] at offset 116
```

🎉 Super!

### Without Schema Registry

Without Schema Registry, things may be more complicated as you have to develop a consuming script or application that should have the Avro Schema locally available to be able to deserialize the message content.

For our `User signedup Avro API` sample, we have such a consumer [in one GitHub repository](https://github.com/microcks/api-tooling/blob/main/async-clients/kafkajs-client/avro-consumer.js).

Follow the following steps to retrieve it, install dependencies and check the Microcks mocks:

```sh
$ git clone https://github.com/microcks/api-tooling.git
$ cd api-tooling/async-clients/kafkajs-client
$ npm install

$ node avro-consumer.js microcks-kafka-bootstrap-microcks.apps.example.com:9092 UsersignedupAvroAPI_0.1.2_user-signedup              
Connecting to microcks-kafka-bootstrap-microcks.apps.example.com:9092 on topic UsersignedupAvroAPI_0.1.2_user-signedup
{"level":"INFO","timestamp":"2021-02-11T20:30:48.672Z","logger":"kafkajs","message":"[Consumer] Starting","groupId":"kafkajs-client"}
{"level":"INFO","timestamp":"2021-02-11T20:30:48.708Z","logger":"kafkajs","message":"[Runner] Consumer has joined the group","groupId":"kafkajs-client","memberId":"my-app-7feb2099-1701-4a8a-9eff-50aeed60d65d","leaderId":"my-app-7feb2099-1701-4a8a-9eff-50aeed60d65d","isLeader":true,"memberAssignment":{"UsersignedupAvroAPI_0.1.2_user-signedup":[0]},"groupProtocol":"RoundRobinAssigner","duration":36}
{
  "fullName": "Laurent Broudoux",
  "email": "laurent@microcks.io",
  "age": 41
}
{
  "fullName": "John Doe",
  "email": "john@microcks.io",
  "age": 36
}
```

> Note: this simple `avro-consumer.js` script is also able to handle TLS connections to your Kafka broker. It was omitted here for sake of simplicity but you can put the name of the CRT file as the 3rd argument of the command.

## 4. Run AsyncAPI tests

Now the last step for being fully accustomed to Avro on Kafka support in Microcks is to perform some tests. As we will need API implementation for that it's not as easy as writing HTTP based API implementation, we have some helpful scripts in our `api-tooling` GitHub repository. This scripts are made for working with the `User signedup Avro API` sample we used so far but feel free to adapt them for your own use.

So the first thing for this section, will be to retrieve the scripts and install dependencies if you have not already do that in previous section. Follow below instructions:

```sh
$ git clone https://github.com/microcks/api-tooling.git
$ cd api-tooling/async-clients/kafkajs-client
$ npm install
```

### With Schema Registry

When using a Schema Registry with the `REGISTRY` encoding configured into Microcks, the following schema illustrates Microcks interactions with broker and registry. Here, we are not necessarily using the broker and registry Microcks is using for mocking but we are able to reuse *any Kafka broker* and *any Schema Registry* available within your organization - typically this will depend on the environment you want to launch tests upon.

{{< image src="images/guides/avro-kafka-testing.png" alt="image" zoomable="true" >}}

That said, imagine that you want to validate messages from a **QA** environment with dedicated broker and registry. Start by using our utility script to produce some messages on an `user-registration` arbitrary topic. This script is using a local Avro schema to do the binary encoding and it is also publishing this schema into the connected QA Schema Registry:

```sh
$ node avro-with-registry-producer.js kafka-broker-qa.apps.example.com:9092 user-registration https://schema-registry-qa.apps.example.com
Connecting to kafka-broker-qa.apps.example.com:9092 on topic user-registration, using registry https://schema-registry-qa.apps.example.com
{"level":"ERROR","timestamp":"2021-02-11T21:07:09.962Z","logger":"kafkajs","message":"[Connection] Response Metadata(key: 3, version: 5)","broker":"kafka-broker-qa.apps.example.com:9092","clientId":"my-app","error":"There is no leader for this topic-partition as we are in the middle of a leadership election","correlationId":1,"size":108}
[
  {
    topicName: 'user-registration',
    partition: 0,
    errorCode: 0,
    baseOffset: '0',
    logAppendTime: '-1',
    logStartOffset: '0'
  }
]
[...]
```

Do not interrupt the execution of the script and go create a **New Test** within Microcks web console. Use the following elements in the Test form:

* **Test Endpoint**: `kafka://kafka-broker-qa.apps.example.com:9092/user-registration?registryUrl=https://schema-registry-qa.apps.example.com` and note this new `registryUrl` parameter to tell Microcks where to get the Avro schema used for writing 😉,
* **Runner**: `ASYNC API SCHEMA` for validating against the AsyncAPI specification of the API.

> Whilst Test Endpoint and Schema Registry may be secured with custom TLS certificates or username/password, we skipped this from this guide for seek of simplicity but Microcks is handling this through [Secrets](/documentation/guides/administration/secrets/) or additional `registryUsername` and `registryCredentialsSource` [parameters](/documentation/references/test-endpoints/#event-based-apis).

Launch the test and wait for some seconds and you should get access to the test results as illustrated below:

{{< image src="images/guides/avro-kafka-test-success.png" alt="image" zoomable="true" >}}

This is fine and we can see that the type is `avro/binary` and the message content is nicely displayed using JSON but what in case of a failure? What are we able to demonstrate using Microcks validation? Next to the script lies actually two Avro schemas: 

* `user-signedup.avsc` is correct and matches the one that is referenced into the AsyncAPI specification,
* `user-signedup-bad.avsc` represented an evolution and does not match the one from the AsyncAPI specification.

Well let see now if we tweak a little bit the `avro-with-registry-producer.js` script... Open it in your favorite editor to put comments on lines 48 and 56 and to remove comments on lines 45 and 55. Relaunch it and relaunch a new test...

{{< image src="images/guides/avro-kafka-test-failure.png" alt="image" zoomable="true" >}}

🎉 We can see that there's now a failure and that's perfect! What does that mean? It means that when your application is using a different and incompatible schema from the one in the AsyncAPI contract, Microcks raises an error and spot the breaking change! The `fullName` required property was expected as stated in the AsyncAPI file but cannot be found in incoming message... thus your tested application producing message is sending garbage indeed 😉 

### Without Schema Registry

Now looking at the `RAW` encoding option and what we can deduce from tests. To simulate an existing application, we will now use the `avro-producer.js` script that is also using the local `user-signedup.avsc` Avro schema to do the binary encoding:

```sh
$ node avro-producer.js kafka-broker-qa.apps.example.com:9092 user-registration
Connecting to kafka-broker-qa.apps.example.com:9092 on topic user-registration
{"level":"ERROR","timestamp":"2021-02-11T21:37:28.266Z","logger":"kafkajs","message":"[Connection] Response Metadata(key: 3, version: 5)","broker":"kafka-broker-qa.apps.example.com:9092","clientId":"my-app","error":"There is no leader for this topic-partition as we are in the middle of a leadership election","correlationId":1,"size":96}
[
  {
    topicName: 'user-registration',
    partition: 0,
    errorCode: 0,
    baseOffset: '0',
    logAppendTime: '-1',
    logStartOffset: '0'
  }
]
[...]
```

Do not interrupt the execution of the script and go create a **New Test** within Microcks web console. Use the following elements in the Test form:

* **Test Endpoint**: `kafka://kafka-broker-qa.apps.example.com:9092/user-registration` simply,
* **Runner**: `ASYNC API SCHEMA` for validating against the AsyncAPI specification of the API.

Launch the test and wait for some seconds and you should get access to the test results as illustrated below:

{{< image src="images/guides/avro-kafla-test-sucsess-raw.png" alt="image" zoomable="true" >}}

You can see here that we just have the string representation of the binary message that was sent. Using `RAW` encoding we cannot be sure that what we read has any sense regarding the semantic meaning of the API contract.

If you want to play with this idea, start making change to the Avro schema used by the producer and add more properties of different types. As the schema referenced with the AsyncAPI contract is very basic we'll always be able to read.

But start removing properties and just send single bytes, you'll see validation failure happened. In `RAW` mode, validation is very shallow: we cannot detect schema incompatibilities as we do not have the schema used for writing. So Microcks can just check, the binary Avro we can read with given schema and as long as you send more bytes than expected: it works 😞

## Wrap-Up

In this guide we have seen how Microcks can also be used to simulate Avro messages on top of Kafka. We have also checked how it can connect to Schema Registry such as the one from Confluent in order to speed-up and make reliable the process of propagating Avro schema updates to API events consumers. We finally ended up demonstrating how Microcks can be used to detect any drifting issues between expected Avro schema and the one effectively used by real-life producers. 

Take care: Microcks will detect if they send garbage! 🗑