---
draft: false
title: "Application Configuration"
date: 2024-04-29
publishdate: 2024-04-29
lastmod: 2024-06-13
weight: 1
---

## Overview

## Webapp component

### application.properties

#### Components connection

```properties
tests-callback.url=${TEST_CALLBACK_URL:http://localhost:8080}
postman-runner.url=${POSTMAN_RUNNER_URL:http://localhost:3000}
async-minion.url=${ASYNC_MINION_URL:http://localhost:8081}
```

#### Kafka connection

```properties
# Kafka configuration properties
spring.kafka.producer.bootstrap-servers=${KAFKA_BOOTSTRAP_SERVER:localhost:9092}
spring.kafka.producer.key-serializer=org.apache.kafka.common.serialization.StringSerializer
spring.kafka.producer.value-serializer=io.github.microcks.event.ServiceViewChangeEventSerializer
```

#### AI Copilot

```properties
# AI Copilot configuration properties
ai-copilot.enabled=false
ai-copilot.implementation=openai
ai-copilot.openai.api-key=sk-my-openai-api-key
#ai-copilot.openai.api-url=http://localhost:1234/
ai-copilot.openai.timeout=30
ai-copilot.openai.maxTokens=3000
#ai-copilot.openai.model=gpt-4-turbo-preview
```

### features.properties

#### Repository filtering

| Sub-Property | Description |
| ---------- | ----------------- |
| `enabled` | A boolean flag that turns on the feature. `true` or `false` |
| `label-key` | The label key to use for first level filtering in Services list page. |
| `label-label` | The display label of the first level filtering key in Services list page.|
| `label-list` | A comma separated list of label keys you want to display in Services list page. |

For example:

```properties
features.feature.repository-filter.enabled=true
features.feature.repository-filter.label-key=domain
features.feature.repository-filter.label-label=Domain
features.feature.repository-filter.label-list=domain,status
```

## Async Minion component

### application.properties

#### Components connection

```properties
# Access to Microcks API server.
io.github.microcks.minion.async.client.MicrocksAPIConnector/mp-rest/url=http://localhost:8080
microcks.serviceaccount=microcks-serviceaccount
microcks.serviceaccount.credentials=ab54d329-e435-41ae-a900-ec6b3fe15c54

# Access to Keycloak URL if you override the one coming from Microcks config
#keycloak.auth.url=http://localhost:8180
```

#### Kafka connection

```properties
# Access to Kafka broker.
kafka.bootstrap.servers=localhost:9092

# For Apicurio registry
#kafka.schema.registry.url=http://localhost:8888
#kafka.schema.registry.confluent=false

# For Confluent registry
#kafka.schema.registry.url=http://localhost:8889
kafka.schema.registry.confluent=true
kafka.schema.registry.username=
kafka.schema.registry.credentials.source=USER_INFO
```

#### Optional brokers

```properties
# Access to NATS broker.
nats.server=localhost:4222
nats.username=microcks
nats.password=microcks

# Access to MQTT broker.
mqtt.server=localhost:1883
mqtt.username=microcks
mqtt.password=microcks

# Access to RabbitMQ broker.
amqp.server=localhost:5672
amqp.username=microcks
amqp.password=microcks

# Access to Google PubSub.
googlepubsub.project=my-project
googlepubsub.service-account-location=/deployments/config/googlecloud-service-account.json

# Access to Amazon SQS
amazonsqs.region=eu-west-3
amazonsqs.credentials-type=env-variable
amazonsqs.credentials-profile-name=microcks-sqs-admin
amazonsqs.credentials-profile-location=/deployments/config/amazon-sqs/aws.profile
#amazonsqs.endpoint-override=http://localhost:4566

# Access to Amazon SNS
amazonsns.region=eu-west-3
amazonsns.credentials-type=env-variable
amazonsns.credentials-profile-name=microcks-sns-admin
amazonsns.credentials-profile-location=/deployments/config/amazon-sns/aws.profile
#amazonsns.endpoint-override=http://localhost:4566
```


> 🪄 **To Be Created**
>
> This is a new documentation page that has to be written as part of our [Refactoring Effort](https://github.com/microcks/microcks.io/issues/81).
> 
> **Goal of this page**
> * List all application configuration props