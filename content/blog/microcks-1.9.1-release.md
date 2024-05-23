---
title: Microcks 1.9.1 release 🚀
date: 2024-05-23
image: "images/blog/microcks-1.9.1-feature.png"
author: "Laurent Broudoux"
type: "regular"
description: "Microcks 1.9.1 release 🚀"
draft: false
---

Just two months after the previous release, we are thrilled to announce this brand-new Microcks version! Please welcome the `1.9.1` release of Microcks, the Open-source cloud-native tool for API Mocking and Testing 🙌

With no less than 30 newly resolved issues, this release is special as it is the first to have so many issues directly contributed by community users! **25 evolutions out of 30 directly come from them!** Kudos to our community 👏, and see greetings along the notes below.

{{< image src="images/blog/microcks-1.9.1-feature.png" alt="microcks-feature" >}}

## New Proxy features

Aside from the numerous enhancements we'll discuss just after, this release's main new feature is the addition of Proxy behavior, which [Nikolay Afanasyev](https://github.com/Afanas10101111) introduced in [this blog post](https://microcks.io/blog/new-proxy-features-1.9.1/).

As stated in this post, `1.9.1` comes with two new dispatchers called `PROXY` and `PROXY_FALLBACK`. While `PROXY` is a simple passthrough to an external backend service, `PROXY_FALLBACK` handles a bit more logic and allows to call the external backend service only if Microcks doesn’t find a matching mock response at first.

> One great thing is that this new proxy logic has been implemented consistently for REST, SOAP and GraphQL APIs in Microcks. Check the full blog post for [more details](https://microcks.io/blog/new-proxy-features-1.9.1/). Thanks again, [Nikolay](https://github.com/Afanas10101111)! 🙏

## Noticeable enhancements

Below is a list of noticeable enhancements and shootouts to people who contributed them without order or preference.

### Templating of responses’ headers

This enhancement lets you specify response header values using Microcks specific `{{ }}` template notation. The `{{ }}` notation is a placeholder that can be replaced with dynamic values. You can use it to return random values (think of a UUID as a transaction or correlation identifier) or request-based values. It was, for example, used to implement [OpenID Connect mocks](https://microcks.io/blog/mocking-oidc-redirect/).

```yaml
headers:
  'Location':
    schema:
      type: string
   examples:
     generic:
       value: "{{ request.params[redirect_uri] }}?state={{ request.params[state] }}&code={{ uuid() }}"
```

> Check [#1097](https://github.com/microcks/microcks/issues/1097) for more details on this, and thanks again to [Nikolay](https://github.com/Afanas10101111) 🙏 for the initial discussion and Pull Request.


### JSON pointers extended usage

This enhancement allows you to reference arrays or array elements in mock responses - still using the `{{ }}` notation placeholder. Arrays or their elements will be directly serialized as JSON and integrated as such into the response body. For example, you can use this template:

```json
{
  "allBooks": {{ request.body/books }},
  "firstBook": {{ request.body/0 }}
}
```

to get results like:

```json
{
  "allBooks": [{ "title":"Title 1", "author":"Jane Doe" },{ "title":"Title 2", "author":"John Doe" }],
  "firstBook": { "title":"Title 1", "author":"Jane Doe" }
}
```

> Check [#1139](https://github.com/microcks/microcks/pull/1139) for more details on this, and thank [Andreas Zöllner](https://github.com/azplanlos) 🙏 for proposing and writing this enhancement.


### Object query parameters support

This enhancement adds support for serializing an object's properties as request parameters. It follows the serialization rules for `style: form` parameters with `explode: true`, which translates in OpenAPI by having a query parameter of `object` type.

So typically, you may define a `GET /users?name=Alex&age=44` endpoint where the query parameter is a `User` object. How cool! 😎 

> Check [#1143](https://github.com/microcks/microcks/issues/1143) for more details, and thanks to [Samuel Antoine](https://github.com/Snorkell) 🙏 for proposing and writing this enhancement.


### Webapp enhancements and linting

While functional, the Microcks web app undoubtedly needs more love and enhancements as it is not the expertise field of original maintainers 😉 Thanks to community contribution, we’re now in better shape and have people still seeking improvements.

We have some noticeable improvements here:
* Selecting/deselecting operations when launching a test can now be done with a single checkbox,
* Broken unit tests have been removed from the codebase,
* Broken links to documentation have been fixed,
* Linting of application and refactoring for better standard respect has been applied,
* Analyses on how we could move to fresher dependencies or frameworks are coming.

> Check [#1153](https://github.com/microcks/microcks/issues/1153), [#1163](https://github.com/microcks/microcks/issues/1163), [#1166](https://github.com/microcks/microcks/issues/1166) and [#1171](https://github.com/microcks/microcks/issues/1171) contributions by [Siarhei Saroka](https://github.com/soGit) 🙏 for more details. 


### More Tests

Contributing to an Open Source project is not only a matter of writing code. Starting with documentation and adding new tests is a great way to get hands-on experience. As Microcks becomes a critical tool for many organizations, increasing the coverage of our test suite is essential. 

We moved from [36.8% coverage on January 1st to 48.4%](https://sonarcloud.io/project/activity?graph=coverage&id=microcks_microcks) as of today! This is great progress for a code base of nearly 12K lines of code, and we can still get even better!

> Check [#1128](https://github.com/microcks/microcks/issues/1128), [#1130](https://github.com/microcks/microcks/issues/1130) and [#1150](https://github.com/microcks/microcks/issues/1150) for awesome contributions on tests by [Matheus Cruz](https://github.com/mcruzdev) 🙏


## Documentation refactoring effort

We also want to take the opportunity of this release notes post to announce a significant refactoring effort on documentation. As stated above, Microcks has become critical and attracts more and more newcomers. The documentation needs to be reorganized to better assist with onboarding and help users find what they’re looking for.

We came up with a new approach to the documentation structure exposed [in this GitHub thread](https://github.com/microcks/microcks.io/issues/81). Our main goal is to clarify the categorization of information between Tutorials, Guides, Explanations, and Reference materials. We want to make it easier and faster for newcomers to find valuable information depending on where they are in their learning process. We also want to make it easier for community users to contribute new content easily. 

For all of that, we need your help! So, if you are or would love to be a Tech Writer and want to contribute to this cool Open Source project, please join us and share your recipes and experiences to improve our documentation!


## What’s coming next?

As usual, we will eagerly prioritize items according to community feedback. You can check and collaborate via our list of [issues on GitHub](https://github.com/microcks/microcks/issues) and the project [roadmap](https://github.com/orgs/microcks/projects/1).

Remember that we are an open community, which means you, too, can jump on board to make Microcks even greater! Come and say hi! on our [GitHub discussion](https://github.com/microcks/microcks/discussions) or [Discord chat](https://microcks.io/discord-invite/) 👻, send some love through [GitHub stars](https://github.com/microcks/microcks) ⭐️ or follow us on [Twitter](https://twitter.com/microcksio), [Mastodon](https://hachyderm.io/@microcksio@mastodon.social), [LinkedIn](https://www.linkedin.com/company/microcks/), and our [YouTube channel](https://www.youtube.com/c/Microcks)!

Thanks for reading and supporting us! ❤️