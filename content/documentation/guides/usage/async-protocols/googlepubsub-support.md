---
draft: false
title: "Pub/Sub Mocking & Testing"
date: 2023-02-08
publishdate: 2023-02-08
lastmod: 2024-05-13
weight: 6
---

## Overview

This guide shows you how to use a [Google Pub/Sub](https://cloud.google.com/pubsub/) messaging service with Microcks. Pub/Sub is an asynchronous and scalable messaging service that decouples services producing messages from services processing those messages. Pub/Sub allows services to communicate asynchronously, with latencies on the order of 100 milliseconds.

Microcks supports Google Pub/Sub as a protocol binding for [AsyncAPI](/documentation/references/artifacts/asyncapi-conventions/). That means that Microcks is able to connect to a Google Pub/Sub service for publishing mock messages as soon as it receives a valid [AsyncAPI](https://asyncapi.com) Specification and to connect to any Google Pub/Sub broker provided that Google Cloud Platform to check that flowing messages are compliant to the schema described within your specification.

Let's rock and roll! 🎸

## 1. Setup Pub/Sub service connection

First mandatory step here is to setup Microcks so that it will be able to connect to a Pub/Sub service for sending mock messages. Before doing that, you'll need to ensure you got proper credentials in your cluster.

As accessing Google Pub/Sub is subject to authentication and authorization, the pre-requisite is to create an [IAM Service Account](https://cloud.google.com/iam/docs/service-accounts) in Google platform so that Microcks will reuse this identity to connect to the service. After you [created](https://cloud.google.com/iam/docs/creating-managing-service-accounts) this service account, you'll need to [create and get access to its key file](https://cloud.google.com/iam/docs/creating-managing-service-account-keys#iam-service-account-keys-create-gcloud). Result is typically a JSON file you'll download on your machine.

Let's say you've called it `my-googlecloud-service-account.json`, you'll then need to transfer this file as a `Secret` within your Kubernetes cluster into the namespace where you plan to setup Microcks - here after `microcks`:

```sh
$ kubectl create secret generic my-googlecloud-service-account \
    --from-file=./my-googlecloud-service-account.json -n microcks
```

You also have to ensure that this Service Account has the required permissions for connecting to Pub/Sub, listing and creating topics. This can be done by adding the `roles/pubsub.editor` and `roles/pubsub.publisher` roles to the Service Account. Check the [Pub/Sub permissions and roles](https://cloud.google.com/pubsub/docs/access-control#permissions_and_roles) for more details. Here are below typical `gcloud` commands for that:

```sh
$ gcloud projects add-iam-policy-binding $PROJECT \
    --member=serviceaccount:microcks-pubsub-sa@$PROJECT.iam.gserviceaccount.com \
    --role=roles/pubsub.editor
$ gcloud projects add-iam-policy-binding $PROJECT \
    --member=serviceaccount:microcks-pubsub-sa@$PROJECT.iam.gserviceaccount.com \
    --role=roles/pubsub.publisher
```

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
      googlepubsub:
        project: my-gcp-project-347219
        serviceAccountSecretRef:
          secret: my-googlecloud-service-account
          fileKey: my-googlecloud-service-account.json
```

The `async` feature should of course be enabled and then the important things to notice are located in to the `googlepubsub` block:

* `project` is the project identifier of your Google project where Pub/Sub service is located,
* `serviceAccountSecretRef` is the name + the file key name for the `Secret` holding our Service Account private key we just previoulsy created.

If you have used the [Helm Chart based installation](/documentation/references/configuration/helm-chart-config/) of Microcks, this is the corresponding fragment put in a `Values.yml` file:

```yaml
[...]
features:
  async:
    enabled: true
    [...]
    googlepubsub:
      project: my-gcp-project-347219
      serviceAccountSecretRef:
        secret:  my-googlecloud-service-account
        fileKey: my-googlecloud-service-account.json
```

Actual connection to the Google Pub/Sub service will only be made once Microcks will send mock messages to it. Let see below how to use Pub/Sub binding with AsyncAPI. 

## 2. Use Pub/Sub in AsyncAPI

As Google Pub/Sub is not the default binding into Microcks, you should explicitly add it as a valid binding within your AsyncAPI contract. Here is below a fragment of AsyncAPI specification file that shows the important things to notice when planning to use Google Pub/Sub and Microcks with AsyncAPI. It comes for one sample you can find on our [GitHub repository](https://github.com/microcks/microcks/blob/1.7.x/samples/UserSignedUpAPI-asyncapi-googlepubsub.yml).

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
        googlepubsub:
          topic: projects/my-project/topics/my-topic
      message:
        [...]
        payload:
          [...]
```

You'll notice that we just have to add a `googlepubsub` non empty block within the operation `bindings`. Just define one property (like `topic` for example) and Microcks will detect this binding has been specified. See the full [binding spec](https://github.com/asyncapi/bindings/tree/master/googlepubsub) for details.

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
              headers: |>
                {"my-app-header": 23}
              payload: |>
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

Now it’s time to validate that mock publication of messages on the targeted Pub/Sub is correct. In a real world scenario this mean developing a consuming script or application that connects to the topic where Microcks is publishing messages.

For our `User signed-up API`, we have such a consumer [in one GitHub repository](https://github.com/microcks/api-tooling/blob/main/async-clients/googlepubsub-client/consumer.js). Like in previous Step 1, you'll need a Service Account and its key file so that our consumer will be able to connect to Pub/Sub. This Service Account must have the `roles/pubsub.subscriber` role. If you choose to reuse previously created Service Account, you'll have to issue this additional ommand:

```sh
$ gcloud projects add-iam-policy-binding $PROJECT \
    --member=serviceaccount:microcks-pubsub-sa@$PROJECT.iam.gserviceaccount.com \
    --role=roles/pubsub.subscriber
```

Now, with the Service Account key file at hand - let say in `/Users/me/google-cloud-creds/my-gcp-project-347219/pubsub-service-account.json` folder - you'll have to follow these steps to retrieve it, install dependencies and check the Microcks mocks:

```sh
$ git clone https://github.com/microcks/api-tooling.git
$ cd api-tooling/async-clients/googlepubsub-client
$ npm install

$ node consumer.js my-gcp-project-347219 UsersignedupAPI-0.1.20-user-signedup /Users/me/google-cloud-creds/my-gcp-project-347219/pubsub-service-account.json
Connecting to my-gcp-project-347219 on topic UsersignedupAPI-0.1.20-user-signedup with sub gpubsub-client-echo
{
  "id": "rZxAKnfxbe7yCXAJLENTHtnBI64H2KRN",
  "sendAt": "1675767350743",
  "fullName": "Laurent Broudoux",
  "email": "laurent@microcks.io",
  "age": 41
}
{
  "id": "ApOlHGyEGEkZnDKeQ3CE3oLpqZ7vVL7v",
  "sendAt": "1675767350743",
  "fullName": "John Doe",
  "email": "john@microcks.io",
  "age": 36
}
[...]
```

🎉 Fantastic! We are receiving the two different messages corresponding to the two defined examples each and every 3 seconds that is the default publication frequency. You'll notice that each `id` and `sendAt` properties have different values thanks to the templating notation.

## 4. Run AsyncAPI tests

Now the final step is to perform some tests of the validation features in Microcks. As we will need API implementation for that it’s not as easy as writing HTTP based API implementation, we have some helpful scripts in our `api-tooling` GitHub repository. This scripts are made for working with the `User signed-up API` sample we used so far but feel free to adapt them for your own use.

Imagine that you want to validate messages from a `QA` environment on a dedicated Google Cloud project. As the **QA** project access is secured, you'll need - like described above in Step 1 - to retrieve a Service Account key file with this Service Account having the `roles/pubsub.subscriber` role like described in Step 3.

Still being in the `googlepubsub-client` folder, now use the `producer.js` utility script to publish messages on a `user-signups` topic hosted by a `my-qa-gcp-project-347223` project with local access to your Service Account key file:

```sh
$ node producer.js my-qa-gcp-project-347223 user-signups /Users/me/google-cloud-creds/my-qa-gcp-project-347223/pubsub-service-account.json
Connecting to my-qa-gcp-project-347223 on user-signups
Sending {"id":"jhlch3gv1dexkodt71zet","sendAt":"1675848599703","fullName":"Laurent Broudoux","email":"laurent@microcks.io","age":43}
Sending {"id":"gm6c39oa69nw7dukbpper","sendAt":"1675848602703","fullName":"Laurent Broudoux","email":"laurent@microcks.io","age":43}
[...]
```

Do not interrupt the execution of the script for now.

As the **QA** Pub/Sub access is secured, we will first have to manage a [Secret](/documentation/guides/administration/secrets/) in Microcks to hold these informations. Within Microcks console, first go to the **Administration** section and the **Secrets** tab.

> **Administration** and **Secrets** will only be available to people having the `administrator` role assigned. Please check [this documentation](/documentation/guides/administration/users/) for details.

On this tab, you'll have to create a `Token Authentication` secret with the value being the content of a Service Account key file encrypted in base 64. This Service Account is not necessarily the one you've used previously for producing messages as this one must have the `roles/pubsub.publisher` role. You'll typically get the token value by executing this command:

```sh
$ cat googlecloud-service-account.json | base64 
```

The screenshot below illustrates the creation of such a secret for your `QA PubSub Service Account` with username, and credentials.

{{< image src="images/guides/pubsub-broker-secret.png" alt="image" zoomable="true" >}}

Once saved we can go create a **New Test** within Microcks web console. Use the following elements in the Test form:

* **Test Endpoint**: `googlepubsub://my-qa-gcp-project-347223/user-signups` that is referencing the Google Pub/Sub service and topic endpoint,
* **Runner**: `ASYNC API SCHEMA` for validating against the AsyncAPI specification of the API,
* **Timeout**: Keep the default of 10 seconds,
* **Secret**: This is where you'll select the **QA PubSub Service Account** you previously created.

Launch the test and wait for some seconds and you should get access to the test results as illustrated below:

{{< image src="images/guides/pubsub-test-success.png" alt="image" zoomable="true" >}}

This is fine and we can see that Microcks captured messages and validated them against the payload schema that is embedded into the AsyncAPI specification. In our sample, every property is `required` and message does not allow `additionalProperties` to be define, `sendAt` is of string type.

So now let see what happened if we tweak that a bit... Open the `producer.js` script in your favorite editor to put comments on lines 24 and 25 and to remove comments on lines 26 and 27. It's removing the `fullName` measure and adding an unexpected `displayName` property and it's also changing the type of the `sendAt` property as shown below after having restarted the producer:

```sh
$ node producer.js my-qa-gcp-project-347223 user-signups /Users/me/google-cloud-creds/my-qa-gcp-project-347223/pubsub-service-account.json
Connecting to my-qa-gcp-project-347223 on user-signups
Sending {"id":"2zzo4kf16mxu5e6k8hyecl","sendAt":1675946954300,"displayName":"Laurent Broudoux","email":"laurent@microcks.io","age":43}
Sending {"id":"9ny4r1qu1p5xv37wxufshm","sendAt":1675946957300,"displayName":"Laurent Broudoux","email":"laurent@microcks.io","age":43}
Sending {"id":"uriayo3qh5b1z0y8zd5d7x","sendAt":1675946960301,"displayName":"Laurent Broudoux","email":"laurent@microcks.io","age":43}
[...]
```

Relaunch a new test and you should get results similar to those below:

{{< image src="images/guides/pubsub-test-failure.png" alt="image" zoomable="true" >}}

🥳 We can see that there's now a failure and that's perfect! What does that mean? It means that when your application or devices are sending garbage, Microcks will be able to spot this and inform you that the expected message format is not respected.

> Note that even if the test duration is 10 seconds you may receive more messages that the number of messages sent by the producer during those 10 seconds... 🤔 This is because Pub/Sub subscription that are mandatory for consuming messages have a minimum message retention policy of 10 minutes. Microcks is creating such subscription with the minimum of retention duration (10 minutes) and expiration delay (1 day). So depending on when you launch your test, you may reuse already created subscription that has accumulated messages before your test actually starts.

## Wrap-Up

In this guide we have seen how Microcks can also be used to send mock messages on a Google Pub/Sub managed service connected to the Microcks instance. This helps speeding-up the development of application consuming these messages. We finally ended up demonstrating how Microcks can be used to detect any drifting issues between expected message format and the one effectively used by real-life producers.

Thanks for reading and let you know what you think on our [Discord chat](https://microcks.io/discord-invite) 🐙