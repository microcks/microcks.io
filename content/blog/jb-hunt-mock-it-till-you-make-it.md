---
title: "J.B. Hunt: Mock It till You Make It with Microcks"
date: 2023-04-04
image: "images/blog/jb-hunt-mock-it-till-you-make-it-feature.png"
author: "Carol Gschwend"
type: "regular"
description: "J.B. Hunt: Mock It till You Make It with Microcks"
draft: false
---

Collaboration in the enterprise has many challenges which can become pitfalls and roadblocks that threaten to slow agile software development to a complete standstill. Here, I’ll share how [Microcks](https://microcks.io) helped the Engineering and Technology team overcome obstacles and accelerate development and delivery at [J.B. Hunt Transport Services, Inc](https://www.jbhunt.com/).

{{< image src="images/blog/jb-hunt-mock-it-till-you-make-it-feature.png" alt="image" zoomable="true" >}}

At J.B. Hunt, it’s common for multiple software engineering teams to work in parallel across domains and products to deliver new features for our award-winning [J.B. Hunt 360°®](https://www.jbhunt.com/our-technology/j-b-hunt-360) platform. Each team, or squad, is a small group of self-organizing cross-functional individuals working together to deliver a part of the product solution. Squads face collaboration challenges throughout this journey in communicating expectations, goals, implementation changes, and removing blockers. The greatest potential for roadblocks arises when one squad’s development work is dependent on another squad’s changes at [our API](https://developer.jbhunt.com/connect-360) (Application Programming Interface), microservice, and infrastructure layers.

Delays in the delivery of microservices or APIs are a common challenge for developers. In many cases, the wait time can range from a few weeks to several months. This not only affects feedback cycles and user acceptance testing, but also impacts roadmaps and budgets. These delays can cause frustration and slow down the development process, making it important for organizations to find ways to mitigate them.

> **What's the problem?**  
> Delays in the delivery of microservices or APIs are a common challenge for developers. In many cases, the wait time can range from a few weeks to several months. This not only affects feedback cycles and user acceptance testing, but also impacts roadmaps and budgets. These delays can cause frustration and slow down the development process, making it important for organizations to find ways to mitigate them.

## Are We There Yet?

This is often the scenario frontend web and mobile developers face while waiting for a complete backend architecture. Illustrated below is one such project, which was designed, developed, and delivered in 2022 to equip Carriers, those who manage a truck or fleet of trucks (tractors/trailers), with the ability to create and manage automation rules. The project enables automated fleet management tasks; for instance, Carriers can create a rule assigning a driver to all loads matching a set of defined attributes. The frontend work was dependent on developing a new API and the backend architecture, which included several [Kafka](https://kafka.apache.org)-centric microservices and components.

{{< image src="images/blog/jb-hunt-mock-it-image-01.png" alt="image" zoomable="true" >}}

As a common practice, many developers use some type of mocking or stubbing strategy, allowing them to code against a mock response. Some mocking practices work well in isolation for a single developer but fall short in meeting enterprise demands when multiple applications and developers need to be served the same response. The web and mobile squads experienced this issue while trying to work in parallel with API and backend development. We wanted both UIs to consume the same mock response so any contract changes would be available at once to both applications. The solution needed to serve mocks across the enterprise, so we turned to our internal API Special Interest Group (SIG), a self-forming team of experts passionate about the development and use of APIs at J.B. Hunt.

## We’re Gonna Need a Bigger Boat

The SIG supports an API-first strategy while advocating for an improved developer experience. Aligned with J.B. Hunt’s preference for open-source projects and a goal to better equip developers, the SIG partnered with engineering teams, security, and SRE (Site Reliability Engineering) members to deploy Microcks and make it available to developers in non-production environments.

Microcks is a scalable and dynamic solution where mocks are created and updated on the fly separate from any deployment. This feature lets developers quickly expose and maintain versioned and self-documenting mock API endpoints long before the real API is ready. And since Microcks is Kubernetes native and relies on Keycloak for [security](https://microcks.io/documentation/guides/administration/users/) aspects, it aligns with our cloud-based [Google Kubernetes Engine](https://cloud.google.com/customers/jb-hunt) and [Keycloak](https://www.keycloak.org/) integrated infrastructure.

> **Why Microcks?**  
> Microcks is a scalable and dynamic solution where mocks are created and updated on the fly separate from any deployment. This feature lets developers quickly expose and maintain versioned and self-documenting mock API endpoints long before the real API is ready. And since Microcks is Kubernetes native and relies on Keycloak for [security](https://microcks.io/documentation/guides/administration/users/) aspects, it aligns with our cloud-based [Google Kubernetes Engine](https://cloud.google.com/customers/jb-hunt) and [Keycloak](https://www.keycloak.org/) integrated infrastructure.

The deployment process was simple; however, given J.B. Hunt’s infrastructural layout, Microcks needed extra configuration properties to work properly. Because Microcks is open source, we were able to propose a change to the deployment configurations. The Microcks primary architect welcomed the discussions, accepted the configuration change, and [incorporated](https://github.com/microcks/microcks/pull/671) it into the code base. The update not only enabled J.B. Hunt to make Microcks securely available within J.B. Hunt’s development clusters, but also resolved an open [issue](https://github.com/microcks/microcks/issues/528) raised in December 2021 that prevented other organizations with similar infrastructure from using Microcks in their clusters. 

## Smooth Sailing at Mach-Speed

Now, any developer at J.B. Hunt can instantly create mock endpoints simply by adding example request/response pairs to an [OpenAPI specification](https://spec.openapis.org/) and clicking the import to Microcks option. All dependent teams can continue previously blocked development work by calling the mock endpoints the tool exposes.

{{< image src="images/blog/jb-hunt-mock-it-image-02.png" alt="image" zoomable="true" >}}

## You Have Arrived at Your Destination. We Made It!

Once dependent work is complete, teams easily swap out the Microcks endpoint for the actual implementation of the OpenAPI specification.

{{< image src="images/blog/jb-hunt-mock-it-image-03.png" alt="image" zoomable="true" >}}

The developers of the project mentioned above **saved at least 7 months using Microcks**. They were not only able to work concurrently but also captured the exact business requirements specified by the product owner in the form of example request/response pairs. These persistent mocks can now be utilized in sandbox environments if needed.

> **Accelerating development**  
> The developers of the project mentioned above **saved at least 7 months using Microcks**. They were not only able to work concurrently but also captured the exact business requirements specified by the product owner in the form of example request/response pairs. These persistent mocks can now be utilized in sandbox environments if needed.

## Staying On the Right Track

There is more we can do with Microcks now that the solution has been delivered. The OpenAPI specification can be leveraged for automated contract testing against both the mocks and the implementation during the CI/CD (continuous integration and continuous delivery) processes. Any contract breaking change introduced to either the OpenAPI specification or the implementation can trigger alerts configured to warn, stop, and rollback unexpected regressions. 

We are just beginning to explore the ways Microcks can help us with other types of API contracts like [AsyncAPI](https://www.asyncapi.com). But that will be another journey 😉

Check out the [Scheduling Standards Consortium](https://www.freightapis.org/) (SSC) to learn how [J.B. Hunt is collaborating](https://www.jbhunt.com/our-company/newsroom/2022/12/convoy-jb-hunt-uber-freight-join-forces-api-standards-across-freight-shipments) with Convoy and Uber Freight to define an API standard to drive efficiency
in the supply chain industry.
