---
draft: false
title: "Postman Conventions"
date: 2024-05-27
publishdate: 2024-05-27
lastmod: 2024-05-27
weight: 6
---

## Conventions

In order to be correctly imported and understood by Microcks, your [Postman Collection](https://www.postman.com/collection/) should follow a little set of reasonable conventions and best practices.

* Your Postman collection may contain one or more API definitions. However, because it's a best practice to consider each API as an autonomous and isolated software asset, we'd recommend managing only one API definition per Postman collection and not mixing requests related to different APIs within the same Collection,
* Your Postman collection description should hold a custom property named `version` that allows tracking of API version. It is a good practice to change this version identifier for each API interface versioned changes. As of writing, Postman does not allow editing of such custom property although the Collection v2 format allow them. By convention, we allow setting it through the collection description using this syntax: `version=1.0 - Here is now the full description of my collection...`.

We recommend having a look at our sample Postman collection for [Test API](https://raw.githubusercontent.com/microcks/microcks/master/samples/PetstoreAPI-collection.json) to fully understand and see in action those conventions.

## Illustration

### Collection initialisation

Collection initialization is done through *Import* of an existing resource into Postman. A best practice being using a "contract first" approach for API definition and management, you'll typically choose to *Import File* or *Import From Link* referencing a Swagger or OpenAPI contract definition.

The screenshot below shows how to create a new collection from a Swagger file. We are using here the [Test API](https://raw.githubusercontent.com/lbroudoux/apicurio-test/master/apis/test-api.json) Swagger file.

<div align="center">
{{< figure src="images/documentation/postman-import.png" zoomable="true" >}}
</div>

After successful import and collection creation, you should get the following result into Postman: a valid Collection with a list of default requests created for your API paths and verbs. Elements of this list will be called `Operations` within Microcks. Here's the result for our `Test API`:

<div align="center">
{{< figure src="images/documentation/postman-operations.png" zoomable="true" >}}
</div>

### Defining Examples

As stated by Postman documentation :

> ❝ *Developers can mock a request and response in Postman before sending the actual request or setting up a single endpoint to return the response. Establishing an example during the earliest phase of API development requires clear communication between team members, aligns their expectations, and means developers and testers can get started more quickly.* ❞

The next step is now to create a bunch of examples for each of the requests/operations of your Collection as explained by the [Postman documentation](https://learning.postman.com/docs/sending-requests/response-data/examples/). You'll give each example a meaningful name regarding the use-case it supposed to represent. Do not forget to save your example!

### Defining Test Scripts

> 💡 This is an optional step that is only required if you also want to use Microcks to test your Service or API implementation as the development process progresses.

Postman allows to attach some test scripts defined in JavaScript to a request or `Operation`. Postman only allows you to attach scripts to the request level and not to examples. Such scripts should be written so that they can be applied to the different examples but Microcks offers some way to ease that. For a global view of tests in Postman and their capabilities, we recommend reading the [Introduction to Scripts](https://learning.postman.com/docs/tests-and-scripts/write-scripts/intro-to-scripts/).
			
As an illustration to how Microcks use Postman and offers, let's imagine we are still using the [Test API](https://raw.githubusercontent.com/lbroudoux/apicurio-test/master/apis/test-api.json) we mentioned above. There's an `Operation` allowing to retrieve an order using its unique identifier. We have followed the previous section and have defined 2 examples for the corresponding request in Collection. Now we want to write a test that ensure that when API is invoked, the returned `order` has the `id` we specified into URI. We will write a test script that way:

<div align="center">
{{< figure src="images/documentation/postman-script.png" zoomable="true" >}}
</div>

You will notice the usage of following JavaScript code: `var expectedId = globals["id"];`. What does that mean? IN fact, `globals` is an array of variables managed by the Postman runtime. Usually, you have to pre-populate this array using *Pre-request script*. When running this test in Microcks, such pre-request initialization is automatically performed for you! Every variable used within your request definition (URI parameters or query string parameters) are injected into the `globals` context so that you can directly used them within your script.

The execution of Postman tests using Microcks follows this flow:

* For each example defined for a request, collect URI and query string parameters as key/value pairs,
* Inject each pair within `globals` JavaScript array,
* Invoke request attached script with the `globals` injected into runtime context,
* Collect the results within `tests` array to detect success or failure.

Here is another example of such a generic script that validates the received JSON content:

<div align="center">
{{< image src="images/documentation/postman-script-validation.png" alt="image" zoomable="true" >}}
</div>

This script validates that all the JSON `order` objects returned in response all have the `status` that is requested using the query parameter `status` value. Otherwise, a `Valid response` assertion failure is thrown and stored into the tests array.
