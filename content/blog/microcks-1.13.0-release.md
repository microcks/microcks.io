---
title: Microcks 1.13.0 release 🚀
date: 2025-11-04
image: "images/blog/microcks-1.13.0-feature.png"
author: "Laurent Broudoux"
type: "regular"
description: "Microcks 1.13.0 release 🚀"
draft: false
---

We are excited to announce today the `1.13.0` release of Microcks, the [CNCF](https://landscape.cncf.io/?selected=microcks)'s open-source cloud-native tool for API Mocking and Testing! 🚀

This release brings exciting new features and enhancements that focus on improving the developer experience, debugging, and overall usability. We've listened to your feedback and are proud to deliver a version that makes working with Microcks even more intuitive and powerful.

As we recently celebrated [10 years of Microcks](https://www.linkedin.com/pulse/celebrating-10-years-microcks-journey-vision-open-source-kheddache-zopje/) and the ascent achieved, and as usability is the main theme, we found it natural to illustrate this release with a summit and a quiet, dark yet highly visible night. Here are the related highlights:

* A new **Dark UI theme**, **Drag & Drop** zones, and **Quick imports** let you bend Microcks to your own preferences, style, and workflow!
* Observability everywhere with the addition of **Live Traces** in the mocking engine - makes the tuning and debugging experience a breeze!
* The integration of a **JavaScript engine** that lets you implement your own mock matching logic in a super user-friendly way - for both standard, *uber*, and native-compiled distributions of Microcks!

{{< image src="images/blog/microcks-1.13.0-feature.png" alt="microcks-feature" >}}

This new release is also the **largest so far, with over 80 resolved issues and 12 contributors!** Kudos to all of them 👏 and see the greetings in the notes below.

Let’s start with the most noticeable enhancements from a user perspective!


## Dark theme and UI enhancements

For those who prefer a more subdued interface, we're excited to introduce a brand-new **dark theme!** This highly requested feature offers a comfortable viewing experience, particularly during extended coding sessions, and aligns with the aesthetics of modern development environments. Hit the top-right corner moon or sun icon, and you’ll switch the UI from light to dark theme:

{{< image src="images/blog/microcks-1.13.0-dark-theme.png" alt="Microcks dark theme" >}}

> Thanks a lot to [Apoorva64](https://github.com/Apoorva64) 🙏 for refactoring our stylesheets and introducing CSS variables that ease building this theme. By the way, we’re still looking for seasoned UI artist suggestions and help to polish it! 🎨

To streamline the workflow of importing local files to Microcks, we have also updated the entire application to enable drag-and-drop functionality. Just drag files from your desktop or file explorer on the UI, and you’ll see it change like below:

{{< image src="images/blog/microcks-1.13.0-dnd.png" alt="Drag-n-drop zone" >}}

Releasing your drag now directly opens up a **Quick Import** dialog prefilled with file information:

{{< image src="images/blog/microcks-1.13.0-quick-import.png" alt="quick import dialog" >}}


This **Quick Import** is also directly available from the top-right corner of the menu bar and also allows you to tell Microcks to directly download remote artifacts:

{{< image src="images/blog/microcks-1.13.0-quick-import-download.png" alt="quick download dialog" >}}

Importing your API definitions and mock data is now faster and more intuitive, reducing the setup time and letting you get to testing quicker!

> Thanks again to [Apoorva64](https://github.com/Apoorva64) 🙏 for bringing these nice ideas and contributing it!


## Observability with Live Traces

When working with Microcks, users often faced the challenge of understanding why a request was matched (or not matched) and of debugging issues during dispatching. It can be sometimes difficult to understand the reasoning behind request/response matching or simply get access to the logs and identify the relevant parts.

Debugging and tuning your API mocks and tests just got a whole lot easier with the introduction of **Live Traces**. This powerful new feature provides real-time insights into how your mocks are being processed, allowing you to identify and resolve issues quickly. You can now see the exact flow of requests and responses, understand dispatcher decisions, and pinpoint any discrepancy in the logic. 

A new **Live Traces** foldable panel is now available within each operation's details. You need to **Connect** first, and as soon as the mock endpoint is hit, you’ll receive new Trace details as illustrated below:

{{< image src="images/blog/microcks-1.13.0-live-traces.png" alt="live traces panel" >}}


A **Trace** can be expanded to review the full details of the request matching decision process:

{{< image src="images/blog/microcks-1.13.0-live-traces-details.png" alt="live traces details" >}}

Ever wondered which user or application was calling which mock endpoints within a specific orchestration? We got you covered as well! As the mocking engine is now instrumented, whatever the mock protocol, you can now visualize and collect the traces from a user perspective using the new **Live Traces** page from the left menu bar:

{{< image src="images/blog/microcks-1.13.0-live-traces-graph.png" alt="live traces graph" >}}

The **Live Traces** feature is implemented by leveraging the [OpenTelemetry](https://opentelemetry.io/) model of distributed traces and spans. Actually, the entire Microcks engine has been reconfigured to contribute additional spans and events to provide all the details needed to follow and track the requests. As a consequence, this also means that these extra details are exported and made visible in your favorite OpenTelemetry stack and dashboards! 

> Thanks again to [Apoorva64](https://github.com/Apoorva64) 🙏 for designing and implementing this! Your support for debugging and making it work with an external OTEL collector in the days before the release was much appreciated! 


## New JavaScript engine integration

The existing <code>[SCRIPT dispatcher](https://microcks.io/documentation/explanations/dispatching/#script-dispatcher)</code> is a super flexible way of adding smartness to your dispatching logic and simulating complex business behavior. Over the years, we heard about people [extending scripting with libs](https://microcks.io/blog/extend-microcks-with-custom-libs/), performing complex computations for more dynamic responses. We also implemented [the stateful mocks features](https://microcks.io/documentation/guides/usage/stateful-mocks/) on top of it and made recent [huge performance improvements](https://github.com/microcks/microcks/issues/1543). However, we had an issue. The `SCRIPT` dispatcher is not working on our new [native-compiled container images we provided since Microcks 1.9](https://microcks.io/blog/microcks-1.9.0-release/#reduced-bootstrap-time-with-graalvm). What at first seems anecdotic, now becomes "a problem" because of the success of these images 😉 and more globally of the *uber *distribution **(more than 60k fresh downloads just on October 2025 🚀 )**

We started explorations on this topic during the Spring, investigating what can be done to solve this issue, and it appears that Groovy would never be able to play well in native mode… 

Thanks to [Andrea Peruffo](https://www.linkedin.com/in/andrea-peruffo-32269178/) 🙏, we discovered [QuickJs4J](https://github.com/roastedroot/quickjs4j) that brings the lightweight QuickJS JavaScript engine to both the JVM and the native-compiled worlds. By running code in a sandbox, QuickJs4J ensures memory safety, prevents system access, and offers portability and native-image friendliness. We decided to give it a try, and Andrea successfully implemented a solid integration!

You can now use our new JavaScript `JS` engine in all Microcks distributions! From the standard, full-featured one running on a JVM to the lightweight, *uber* distribution running as a native-compiled binary and starting in 200ms! **Moreover**, with the addition of JavaScript, **Microcks now supports a truly mainstream scripting language.**

See how expressive a `JS` dispatching script can be:

```js
const testCase = mockRequest.getRequestHeader("testcase")[0];
log.info("testCase: " + testCase);
if (testCase !== undefined) {
  switch (testCase) {
     case "1":
        return "negative amount";
     case "2":
        return "null amount";
     case "3":
        return "positive amount";
     case "4":
        return "standard amount";
  }
}
return "standard amount";
```

And how easy it can be to manipulate persistent information to implement stateful mocks on Microcks:

```js
const foo = store.get("foo");
const bar = store.put("bar", "barValue");
store.delete("baz");
```

> Check out [our updated documentation on JavaScript scripting](https://microcks.io/documentation/explanations/dispatching/#javascript-scripting) in Microcks to get you started! There’s no plan to discontinue the existing `SCRIPT` dispatcher, but we encourage you to rename your dispatcher to the new `GROOVY` for better clarity. Thanks again to [andreaTP](https://github.com/andreaTP) 🙏 for this great contribution! 

However, we know that integrating yet another engine would not solve all the usability issues we had with scripting. We heard how painful it could be to tune and troubleshoot this script. And then, we decided to combine our new **Live Traces** feature with the script editing experience! 

When editing a `JS` (or a `GROOVY`)  script from the Microcks UI, you can now rely on embedded Live Traces to give you immediate feedback on whether your script is working correctly or not! Just save your script and hit the **Try it now!** play-style button you’ll find on available responses. The Microcks UI then immediately acts as a mock consumer, and you should see a new **Trace** appear below!

{{< image src="images/blog/microcks-1.13.0-js-try.png" alt="JS editor try it" >}}

And the nice thing is that all the `log.info()` statements from the script are directly embedded into the **Trace** details! What if your script doesn’t compile or misbehaves? We got you covered here, displaying the corresponding Trace in red with failure details and complete stacktrace: 

{{< image src="images/blog/microcks-1.13.0-js-error.png" alt="JS editor error" >}}

> **Tuning and troubleshooting custom scripts in Microcks has never been so easy!** 🔥


## Other improvements

As mentioned in the introduction, this release is the largest in Microcks' history in terms of features and contributions. There are many improvements worth noting as well! Here’s a non-exhaustive list:

* Support of complex dependency resolution on Protobuf imports - see [#449](https://github.com/microcks/microcks/issues/449),
* Support of `mongodb+srv://` protocol for connecting to MongoDB Atlas - see [#1791](https://github.com/microcks/microcks/issues/1791),
* Support of AWS IRSA and pod identity for connecting to SQS and SNS - see [#1789](https://github.com/microcks/microcks/issues/1789) and [#1790](https://github.com/microcks/microcks/issues/1790),
* Support of `2025-06-18` protocol for MCP endpoints - see [#1724](https://github.com/microcks/microcks/issues/1724),
* New delay strategies to allow random latency simulation - see [#1591](https://github.com/microcks/microcks/issues/1591) and thanks to [SebastienDegodez](https://github.com/SebastienDegodez) 🙏 for the contribution,
* Add `formData` definition support in OpenAPI - see [#1688](https://github.com/microcks/microcks/issues/1668) and thanks to [varkart](https://github.com/varkart) 🙏 for the contribution, 
* Add export of samples in `APIExamples` format - see [#1639](https://github.com/microcks/microcks/issues/1639),
* Support of defaults when evaluating null or blank values in templates - see [#1667](https://github.com/microcks/microcks/issues/1667),
* Add `cookie` definition support in OpenAPI - see [#1626](https://github.com/microcks/microcks/issues/1626)

> For the comprehensive list of changes and enhancements, please be sure to check [the milestone details on GitHub](https://github.com/microcks/microcks/milestone/54?closed=1).


## What’s coming next?

As we conclude this huge release, we extend our heartfelt thanks to all the contributors and adopters. Your dedication, enthusiasm, and valuable contributions have significantly enriched the Microcks project. 

Let’s continue moving forward with joy and fun, pushing Microcks to new summits! You can check and collaborate on our GitHub[ issues](https://github.com/microcks/microcks/issues) list and the project [roadmap](https://github.com/orgs/microcks/projects/1). Please join us to shape the future!

Remember that we are an open community, which means you, too, can jump on board to make Microcks even greater! Come and say hi! on our [GitHub discussion](https://github.com/microcks/microcks/discussions) or [Discord chat](https://microcks.io/discord-invite/) 👻, send some love through [GitHub stars](https://github.com/microcks/microcks) ⭐️ or follow us on [BlueSky](https://bsky.app/profile/microcks.io), [X](https://x.com/microcksio), [Mastodon](https://hachyderm.io/@microcksio@mastodon.social), [LinkedIn](https://www.linkedin.com/company/microcks/), and our [YouTube channel](https://www.youtube.com/c/Microcks)!

Thanks for reading and supporting us! ❤️
