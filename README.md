# Microcks Website

Welcome to the Microcks website repository! This repository contains the source code for the official Microcks website.

## About Microcks

Open source cloud-native tool for API Mocking and Testing. Microcks leverages API standards to provide a uniform and multi-protocol approach, empowering your API and microservices lifecycle. It strengthens your ecosystem to create an adaptable API value chain #APIDevOps

To learn more about Microcks and its features, visit the [Microcks website](https://microcks.io/).

## Contributing

We welcome contributions from the community to improve the Microcks website. Your contributions are valuable to us, whether they fix bugs, add new features, or improve documentation.

For more detailed information on how to contribute, please take a look at our [Contribution Guidelines](https://github.com/microcks/.github/blob/main/CONTRIBUTING.md) and the [Documentation Guidelines](https://github.com/yada/microcks.io/blob/master/GUIDELINES.md).

We appreciate your interest in contributing to the Microcks website! If you have any questions or need assistance, feel free to reach out to us: https://microcks.io/community/

## Hugo version and publication checks

The website requires Hugo 0.165.0 Extended. This version is pinned in `.hugo-version`, the GitHub Actions build, and the Netlify configuration.

Before publishing the generated website, verify the local Hugo installation and run an isolated production build:

```sh
hugo version
./deploy.sh --check
```

The version output must include `v0.165.0+extended`. The check command builds into a temporary directory and does not modify the `public` submodule or publish anything.

Maintainers can then publish through `./deploy.sh`, which verifies the Hugo version and that the `public` submodule is initialized before changing or pushing generated files.

> By the community, for the community. 🙌

Thank you for helping us improve Microcks! Every contribution counts 💙
