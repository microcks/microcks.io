---
title: "Testing Google Pub/Sub Locally? Microcks Now Supports the Emulator!"
date: 2026-02-01
image: "images/blog/google-pubsub-emulator-usage-dojo-feature.png"
author: "Adam Hicks"
type: "regular"
description: "Testing Google Pub/Sub Locally? Microcks Now Supports the Emulator!"
draft: false
---

{{< image src="images/blog/google-pubsub-emulator-usage-dojo-feature.png" alt="image" zoomable="true" >}}

At Dojo, speed is critical. Not just in how fast our card machines process payments (which is milliseconds, by the way 😉), but in how fast we ship value to our customers.

Our platform relies heavily on an event-driven architecture running on Google Cloud. While this is powerful in production, it creates friction for our "inner loop" development. Developers often have to connect to real cloud resources just to test a single microservice, which means managing complex credentials, spending time waiting for cloud resources to deploy, and incurring cloud costs for every test run.

We want to shift our testing left, enabling our engineers to spin up a transaction flow simulation on their laptop, completely offline. We want to publish mock payment events, verify how services consume them, and iterate instantly without waiting for a cloud deployment.

However, Microcks couldn't be used with the Google Pub/Sub emulator, so I've recently contributed a new feature to Microcks to bridge this gap.

## What is the use case?

The use case is simple: **Local Development without the Cloud**.

Developers often use tools like [**LocalStack**](https://www.localstack.cloud/) to mock AWS services (like SQS or SNS) locally. We wanted the same seamless experience for Google Pub/Sub.

Previously, Microcks' Google Pub/Sub implementation assumed it was always talking to the real GCP service. It required a Service Account key file and valid authentication to a real Google Cloud project. This is great for integration testing in a staging environment, but for a developer working offline or trying to keep their setup lightweight, it was a blocker.

With this change (introduced in [PR #1851](https://github.com/microcks/microcks/pull/1851), available from [v1.13.1](https://github.com/microcks/microcks/releases/tag/1.13.1)), Microcks can now detect and connect to a local Google Pub/Sub emulator. This allows you to publish mock messages from Microcks directly to the emulator.

## Example Use Case

Let's look at how to set this up. The magic happens by configuring the Microcks Async Minion to recognise the standard `PUBSUB_EMULATOR_HOST` environment variable.

### 1. The Setup

First, you need a `docker-compose.yml` that spins up Microcks (and its Async Minion) alongside the Google Pub/Sub emulator.

*Here is the Docker Compose configuration you can use to get started:*

```yaml
services:
  microcks:
    image: quay.io/microcks/microcks-uber:1.13.1
    ports:
      - "8080:8080"
    environment:
      - ASYNC_MINION_URL=http://microcks-async-minion:8081 # Link to Async Minion
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/api/health"]
      interval: 10s
      timeout: 3s

  microcks-async-minion:
    image: quay.io/microcks/microcks-uber-async-minion:1.13.1
    ports:
      - "8081:8081"
    environment:
      - ASYNC_PROTOCOLS=,GOOGLEPUBSUB # Enable Google Pub/Sub support
      - MICROCKS_HOST_PORT=microcks:8080 # Link to Microcks
      - PUBSUB_EMULATOR_HOST=pubsub-emulator:8681 # Link to Pub/Sub Emulator
    depends_on:
      microcks:
        condition: service_healthy
      pubsub-emulator:
        condition: service_started
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8081/q/health/ready"]
      interval: 10s
      timeout: 3s

  pubsub-emulator:
    image: gcr.io/google.com/cloudsdktool/cloud-sdk:441.0.0-emulators
    command: gcloud beta emulators pubsub start --host-port=0.0.0.0:8681 --project=my-project
    ports:
      - "8681:8681"
```

Running this with `docker compose up` should result in a local Microcks environment that you can access the Web UI at `http://localhost:8080`

### 2. The AsyncAPI Specification

You don't need to change your AsyncAPI specification to support this! That’s the beauty of it. Microcks uses the same contract definition whether you are targeting production GCP or your local emulator.

*Here is the AsyncAPI file we are using for this example:*

```yaml
asyncapi: 3.0.0
id: 'urn:io.microcks.example.hello-microcks'
info:
  title: Hello Microcks API
  version: 1.0.0
  description: Example showing a simple pub/sub message
defaultContentType: application/json
channels:
  helloEvents:
    address: microcks/hello
    description: Topic with Hello events
    bindings:
      googlepubsub:
        schemaSettings:
          encoding: json
          name: projects/my-project/topics/my-topic
    messages:
      hello.message:
        description: A simple Hello event message
        traits:
          - $ref: '#/components/messageTraits/commonHeaders'
        payload:
          type: object
          properties:
            greeting:
              type: string
              const: hello
            fullName:
              type: string
            sentAt:
              type: string
        examples:
          - name: microcks-example
            summary: Hello to Microcks example message
            payload:
              greeting: hello
              fullName: Microcks
              sentAt: '{{now()}}'
            headers:
              version: 1
          - name: random-example
            summary: Example message with random name
            payload:
              greeting: hello
              fullName: '{{randomFirstName()}}'
              sentAt: '{{now()}}'
            headers:
              version: 2

operations:
  receivedHellos:
    action: receive
    channel:
      $ref: '#/channels/helloEvents'
    summary: Receive hellos
    messages:
      - $ref: '#/channels/helloEvents/messages/hello.message'
components:
  messageTraits:
    commonHeaders:
      headers:
        type: object
        properties:
          version:
            type: integer
            minimum: 0
            maximum: 10
```

This spec has two example messages, one with the `fullName` field set to “Microcks” and another with a random name for each message.

## How you can verify it's working

Once you have your stack running, verification is straightforward.

### **Import your API**

Import the AsyncAPI definition above into Microcks using the Web UI uploader at [`http://localhost:8080/#/importers`](http://localhost:8080/#/importers)

### **Check the logs**

If you look at the logs for the `microcks-async-minion` container, you should see that it has detected the emulator configuration and is outputting mock message.

```
...snip...
[io.git.mic.min.asy.pro.GooglePubSubProducerManager] (QuarkusQuartzScheduler_Worker-9) Using Google PubSub emulator at pubsub-emulator:8681
[io.git.mic.min.asy.pro.GooglePubSubProducerManager] (QuarkusQuartzScheduler_Worker-9) Publishing on topic {HelloMicrocksAPI-1.0.0-receivedHellos}, message: {"greeting":"hello","fullName":"Microcks","sentAt":"1767870113823"}
...snip...
```

### Receiving Messages

You can use a local subscriber script to confirm that messages are arriving.

Here is a simple python script that streams messages from the topic

```python
from google.cloud import pubsub_v1
from google.api_core.exceptions import AlreadyExists, NotFound

PROJECT_ID = "my-project"
TOPIC_ID = "HelloMicrocksAPI-1.0.0-receivedHellos"
SUBSCRIPTION_ID = "stream-out-py"

def get_or_create_subscription(project_id, topic_id, subscription_id):
    """
    Creates a subscription if it doesn't exist, then returns the path.
    """

    subscriber = pubsub_v1.SubscriberClient()
    publisher = pubsub_v1.PublisherClient()

    topic_path = publisher.topic_path(project_id, topic_id)
    subscription_path = subscriber.subscription_path(project_id, subscription_id)

    with subscriber:
        try:
            subscriber.create_subscription(
                request={"name": subscription_path, "topic": topic_path},
            )
            print(f"Created new subscription: {subscription_path}")
        except AlreadyExists:
            print(f"Subscription already exists: {subscription_path}")
        except NotFound:
            print(f"Error: The Topic '{topic_id}' does not exist. Please create the topic first.")
            raise

    return subscription_path

def receive_messages(sub_path):
    """Receives messages from the subscription."""

    def callback(message):
        print(f"Received: {message.data.decode('utf-8')}")
        message.ack()

    subscriber = pubsub_v1.SubscriberClient()
    stream = subscriber.subscribe(sub_path, callback=callback)
    print(f"Listening for messages...\n")

    with subscriber:
        stream.result()

if __name__ == "__main__":
    sub_path = get_or_create_subscription(PROJECT_ID, TOPIC_ID, SUBSCRIPTION_ID)
    receive_messages(sub_path)
```

Running this with the environment variable `PUBSUB_EMULATOR_HOST` pointing at our emulator

```python
PUBSUB_EMULATOR_HOST=localhost:8681 python stream.py
```

Will output live message events

```
Created new subscription: projects/my-project/subscriptions/stream-out-py
Listening for messages...

Received: {"greeting":"hello","fullName":"Microcks","sentAt":"1767870122753"}
Received: {"greeting":"hello","fullName":"Josie","sentAt":"1767870122759"}
Received: {"greeting":"hello","fullName":"Microcks","sentAt":"1767870125757"}
Received: {"greeting":"hello","fullName":"Merlin","sentAt":"1767870125762"}
```

🥳

## Summary

This small but mighty change opens up a smoother local development workflow for anyone building event-driven systems with Google Cloud. For us at Dojo, it means faster iterations and happier developers. By supporting the native Pub/Sub emulator, Microcks continues to be the most versatile tool for mocking and testing, no matter where your infrastructure lives, in the cloud or on your machine.

I hope this helps you streamline your testing loops! If you have any questions or feedback, feel free to reach out on GitHub.

Happy Mocking! 🚀
