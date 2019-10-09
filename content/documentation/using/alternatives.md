---
draft: false
title: "Comparison to alternatives"
date: 2019-09-01
publishdate: 2019-09-01
lastmod: 2019-09-02
menu:
  docs:
    parent: using
    name: Comparison to alternatives
    weight: 10
toc: true
weight: 30 #rem
---

## Microcks vs. SoapUI

### Scope & Audience
			
[SoapUI](http://www.soapui.org) is one of the oldest tool in the area but also one of the most popular. We like SoapUI for being simple to use and of great value because it lets functional experts to easily edit requests and responses samples. Specially when it relates to SOAP WebServices, SoapUI offers wizards, templates and validation that make correct editing of such samples a breeze. That's why we currently rely on SoapUI for providing the contract artifacts as an input to Microcks. The main difference between SoapUI and Microcks is that Microcks has been thought as a platform allowing you to easily centralize and share information about your services. Where SoapUI persists information to file that you have to share and re-load, Microcks just expose all its information through Web UI and API to ease access.

### Mocking

SoapUI supports mocking and we rely also on its mock editor. However when it comes to deploying such mocks to the rest of the world, SoapUI uses a static approach where you have to generate and collect a Java Web Archive for later deploying on an application server. Scaling with this model may quickly become an issue as you may use a big amount of resources to "simply" handle mocks. Microcks provides a more scalable, dynamic approach where mocks are created and updated on-the-fly without any deployment.

### Testing

SoapUI offers first class support for testing. Microcks is also able to reuse the tests assertions you may have defined with SoapUI for your services. Where SoapUI tests may be launched manually, through the `soapui-runner` CLI or a Jenkins plugin, Microcks also offers this means for launching tests on different endpoints. The main difference here is that tests results and all the data exchanged with tested endpoints are recorded and persisted by Microcks. This allow you to get history on results for easily compare tests results on different environments or time frames.

## Microcks vs. Postman

### Scope & Audience

[Postman](http://www.getpostman.com) is the populest tool regarding new API and REST WebServices. We particularly likes its support of Swagger for easily importing an API contract file and then editing samples for different operations. As SoapUI, Postman is easy to use by functional experts because of its form-based UI that offers guidance when editing mocks and tests. As it should be possible to manage SOAP WebServices through Postman, it does not offer any guidance for that protocol and is really dedicated to REST styled services. Microcks currently supports Postman as an input source for information about your REST services.
			
### Mocking
			
Mocking in Postman seems to involve some Software-as-a-Service offering and thus not being available in your own datacenter. Also, the number of mock server calls per month seems to be a billable resource. Being easy to deploy on the Cloud or within your datacenter, Microcks offers much more ability to scale and handle all the API and services, even the most critical to your business. Note also that SOAP mocking support is minimalistic because mock servers should not be able to realize query matching request payload.

### Testing
      
Postman offers first class support for testing and we definitely love the ability to define JavaScript snippets as test script. Microcks is able to reuse these tests definitions and to launch them repeatedly when being into an agile CI/CD process. Contrary to Postman, all the interactions and exchanged data with the tested endpoints will be recorded and persisted to ease later analysis.

## Microcks vs. WireMock

### Scope & Audience
			
[WireMock](http://wiremock.org/) is much more a framework for writing mocks than a frontend tooling. WireMock is indeed targeted to developers that want to rapidly generate mocks for the dependency they should be isolated from. As a consequence, WireMock is not really usable by a functional expert that goal is to deliver samples to be used across projects. Most of the time, it is used to locally redefined - in every project - the set of mocks developers may need from their CI process.
			
### Mocking
			
WireMock allows mocking and deployment of mocks through its Java API. It is nice for producing local, short-lived mocks that are keen to be destroyed just after the tests of local project have failed. On the contrary, Microcks focused on long-lived mocks that are exposed and shared throughout the Enterprise. Those mocks should be defined by functional experts within service owner team in order to be the most representative possible of service behavior.
			
### Testing
			
Tests scripts and assertions in WireMock are written using Java API. Once again, it is targeted to developers and not realy to functional experts. Moreover, WireMock relies on some other tools for getting result reports and persisting this reports in time. With Microcks those test results are directly persisted and remains reachable throurh the UI or API at any time.