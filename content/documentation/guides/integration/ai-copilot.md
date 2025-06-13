---
draft: false
title: "Enabling the AI Copilot"
date: 2024-04-30
publishdate: 2024-04-30
lastmod: 2025-03-21
weight: 1
---

## Overview

This guide shows you how to enable the [AI Copilot feature](https://microcks.io/blog/microcks-1.8.0-release/#introducing-ai-copilot) introduced in Microcks `1.8.0. AI Copilot can generate meaningful samples to complete your API specification with mocks when you don't have examples specified or need more examples to make the dataset more representative.


Starting with Microcks version 1.11.1, AI-augmented mocks can also be exported and thus easily shared with teammates.

> The video below shows the AI Copilot in action and how you can quickly generate, export and re-import mocks created using AI.

{{< youtube id="1VtcGGu8Ib0" autoplay="false" >}}

<br/>

At the time of writing, our AI Copilot only supports interacting with LLM via [OpenAI-compatible APIs](https://platform.openai.com/docs/api-reference/introduction). However, the feature was designed to be easily configurable and support other interaction modes in the future.

Let's go through an introduction to configuration properties and how to enable and configure them depending on the Microcks installation method.

## 1. Configuration properties

As mentioned in the [Application Configuration reference](https://microcks.io/documentation/references/configuration/application-config/#ai-copilot), AI Copilot has its own configuration section with properties starting with `ai-copilot`. By default, the AI Copilot feature is disabled, and you'll need to set the `ai-copilot.enabled` property to `true`.

The other important configuration property is the LLM `implementation` you'd like to use. As stated in the overview, today's only available option is `OpenAI`. 

### OpenAI properties

When `openai` is the chosen implementation for the AI Copilot, you'll have access to the following properties:
* `api-key` is mandatory and represents your OpenAPI-compatible LLA API key,
* `api-url` is optional (set to default OpenAI API endpoint) and can be used to target another endpoint,
* `model` is optional. As the time of writing, `gpt-3.5-turbo` is the one used by default,
* `timeout` is optional. It represents the maximum time in seconds Microcks is waiting for an LLM response,
* `maxTokens` is optional. It allows you to limit the number of tokens exchanged with the LLM. The default value is currently `3000`.

## 2. Enable via Docker Desktop Extension

AI Copilot can be enabled via the [Microcks Docker Desktop Extension](/documentation/guides/installation/docker-desktop-extension/) with minimal customization capabilities. Just access the **Settings** panel from the extension main page and then tick the **Enable AI Assistance** checkbox like below. You'll also have to paste your OpenAI API key in the input field, as illustrated in the capture below:

<div align="center">
{{< image src="images/documentation/ai-copilot-settings-dde.png" alt="image" zoomable="true" >}}
<br/><br/>
</div>

Enabling the AI Copilot will require a restart of Microcks. Next time you access the Microcks UI via your browser, you'll get access to the **AI Copilot** buttons.

## 3. Enable via Docker/Podman Compose

AI Copilot can also be enabled using Docker Compose or Podman Compose installation methods. To do so, you must mount two configuration files (`application.properties` and `features.properties`) into the main `microcks` container. You can see an example of how to do that on the [`docker-compose-devmode.yml`](https://github.com/microcks/microcks/blob/master/install/docker-compose/docker-compose-devmode.yml#L34) configuration.

Here's a sample configuration in the `application.properties` file:

```properties
# AI Copilot configuration properties
ai-copilot.enabled=true
ai-copilot.implementation=openai

# OpenAI or OpenAI-comptaible LLM configuration properties
ai-copilot.openai.api-key=<sk-my-openai-api-key>
#ai-copilot.openai.api-url=http://localhost:1234/
ai-copilot.openai.model=gpt-3.5-turbo
ai-copilot.openai.timeout=30
ai-copilot.openai.maxTokens=3000
```

The `features.properties` file must only set a flag to inform the UI that the feature is enabled:

```properties
features.feature.ai-copilot.enabled=true
```

Again, restarting the running container is required to force the files' re-reading and enable the feature.

## 4. Enable via Helm Chart

When deploying Microcks using [its Helm Chart](/documentation/guides/installation/kind-helm), you can enable and configure the AI Copilot using a `values.yaml` file or with `--set` flags on the command line.

Below are the properties that are available for configuration:

```yaml
features:
  # [...]
  # AI Copilot configuration properties
  aiCopilot:
    enabled: true
    implementation: openai

    openai:
      apiKey: <sk-my-openai-api-token>
      timeout: 20
      model: gpt-3.5-turbo
      maxTokens: 2000
```

It is worth noting that the `apiUrl` configuration is not yet available via the Helm Chart method. To track that addition, there's [a GitHub issue](https://github.com/microcks/microcks/issues/1547) opened.

## 5. Enable via Kubernetes Operator

When deploying Microcks using [its Kubernetes Operation](/documentation/guides/installation/kubernetes-operator), you can enable and configure the AI Copilot using the `Microcks` Custom Resource.

Below are the properties that are available for configuration:

```yaml
spec:
  features:
    # [...]
    # AI Copilot configuration properties
    aiCopilot:
      enabled: true
      implementation: openai

      openai:
        apiKey: <sk-my-openai-api-token>
        timeout: 20
        model: gpt-3.5-turbo
        maxTokens: 2000
```

It is worth noting that the `apiUrl` configuration is not yet available via the Kubernetes Operator method. To track that addition, there's [a GitHub issue](https://github.com/microcks/microcks-operator/issues/111) opened.

## Wrap-up

Congrats 🎉 You now know how to connect Microcks to your favourite LLM to enrich your mock dataset! 

As a complementary reading, you can check how to [Boost your API mocking workflow with Ollama and Microcks](https://medium.com/itnext/boost-your-api-mocking-workflow-with-ollama-and-microcks-38e25fe78450) that explores how to use the AI Copilot features locally with the LLM and model of your choice!
