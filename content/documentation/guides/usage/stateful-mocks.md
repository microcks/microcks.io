---
draft: false
title: "Configuring stateful mocks"
date: 2024-07-29
publishdate: 2024-07-29
lastmod: 2024-07-29
weight: 4
---

## Overview

Microcks allows to specifiy [dynamic mock content](/documentation/explanations/dynamic-content) using expressions since the early days. Most of the time, those features help in translating the dynamic behaviour of an API and provide meaningful simulations. However, you may need sometime to provide even more realistic behaviour and that's where **stateful mocks** may be of interest.

> 💡 Stateful mocks are available starting with Microcks `1.10.0`. 

In this guide, we'll go through the different concepts that are used and useful when wanting to configure statful mocks with Microcks. We'll illustrate how to use those concepts on a real use-case of a shopping cart, allowing you to persist chosen items in a customer cart.

If you haven't started a Microcks instance yet, you can do so using the following command - maybe replacing `8585` by another port of your choice if this one is not free:

```sh
$ docker run -p 8585:8080 -it --rm quay.io/microcks/microcks-uber:latest
```

Then, you'll need to [import the content](/documentation/guides/usage/importing-content) our [`stateful-cart-openapi.yaml`](../stateful-cart-openapi.yaml) OpenAPI specification to follow-up explanations in next sections.


## 1. Concepts

When configuring staful mocks in Microcks, you'll require or need those useful concepts:

* The `SCRIPT` dispatcher will be mandatory as it will hold your persistence logic (see the [Script explanations](/documentation/explanations/dispatching/#script-dispatcher)),
* The `store` is a an implicit service that is available within scripts. It allows you to persist state within a simple Key/Value store. Key and values are simple strings you may process and manage the way you want. Check the some examples in [common use-cases](/documentation/explanations/dispatching/#common-use-cases) for scripts,
* The `requestContext` is a request scoped context that allows passing content to [response templates](/documentation/references/templates),
* Finally, the templating [Context Expressions](/documentation/references/templates/#context-expression) can be very useful to reuse persisted (or computed) information to mock responses!

> 🚨 One important thing to notice when using **stateful capabilities** in Microcks is that state is not persisted forever. The values you'll register in the `store` are subsject to a Time-To-Live period. This duration is customizable with a default value of 10 seconds.

> 🚨 A second important thing to notice when using **stateful capabilities** in Microcks is that the `store` is scoped to an API. This means that it is shared between the different operations of the same API but not available to other APIs. You cannot write in a store within an API context and read from the same store from another API.

We'll use all those concepts together with our [`stateful-cart-openapi.yaml`](../stateful-cart-openapi.yaml) specification. Please use this OpenAPI file as a reference for the next sections. In each in every section, we'll put the light on the specification details that allow enabling statefulness in mocks.


## 2. Retrieving state

In our shopping cart use-case, the first operation to consider is `GET /cart` that application must use to get the status of a specific customer cart. In our sample, the customer identifier is provided as a request header named `customerId`. We want to use Microcks' stateful store to retrieve the cart items stored under a key `<customierId>-items` and compute the cart total price.

Using a `SCRIPT` dispatcher, we can write the following [Groovy](https://groovy-lang.org/) script to do so:

```groovy
// Retrieve customer id and associated items if any.
def customerId = mockRequest.getRequestHeaders().get("customerId", "null")
def items = store.get(customerId + "-items")

// If items exist, convert them into objects and compute total price.
if (items != null) {
  def cartItems = new groovy.json.JsonSlurper().parseText(items)
  def totalPrice = 0.0
  for (item in cartItems) {
    totalPrice += item.price * item.quantity
  }

  // Fill context with store iteams and computed price.
  requestContext.items = items
  requestContext.totalPrice = totalPrice
} else {
  // No items: fill context with empty and 0.0 price.
  requestContext.items = []
  requestContext.totalPrice = 0.0
}
return "Cart"
```

We simply used the `store.get(key)` function here to read a previously persisted state. You see that this script returns a single result that is the name of the response to use: `Cart`. A generic cart representation is actually specified within the [`stateful-cart-openapi.yaml`](../stateful-cart-openapi.yaml) OpenAPI specification. It uses [template expressions](/documentation/references/templates) to retrieve information either from the incoming `request` or from the current `requestContext`:

```yaml
[...]
responses:
  200:
    content:
      application/json:
        schema:
          [...]
        examples:
          Cart:
            value: |-
              {
                "customerId": "{{request.headers[customerid]}}",
                "items": {{ items }},
                "totalPrice": {{ totalPrice }}
              }
[...]
```

As a first test, you may check the initial state of our cart by issuing the following request to the mock endpoints provided by Microcks:

```sh
# Check johndoes's cart
$ curl -X GET 'http://localhost:8585/rest/Cart+API/1.0.0/cart' -H 'Accept: application/json' -H 'customerId: johndoe'

{
  "customerId": "johndoe",
  "items": [],
  "totalPrice": 0
}
```

You've used a stateful mock in Microcks, congrats! 🎉 Ok, you didn't notice any change at the moment as we didn't persist anything but that's for the next section 😉

## 3. Persisting state

We're now going to persist some state within the `PUT /cart/items` operation that application must use to add new items into the cart. When sending a new item description (a `productId`, a `quantity` and a unit `price`), we're going to add to this item to customer cart so that the status will be updaetd using the previous operation.

We can write the following [Groovy](https://groovy-lang.org/) script to do so:

```groovy
// Retrieve customer id and associated items if any.
def customerId = mockRequest.getRequestHeaders().get("customerId", "null")
def items = store.get(customerId + "-items")
def cartItems = []

// If items exist, convert them in objects.
if (items != null) {
  cartItems = new groovy.json.JsonSlurper().parseText(items)
}

// Parse request input and add a new object in cart items.
def item = new groovy.json.JsonSlurper().parseText(mockRequest.requestContent)
cartItems.add([productId: item.productId, quantity: item.quantity, price: item.price])

// Store customier items for 60 seconds.
store.put(customerId + "-items", groovy.json.JsonOutput.toJson(cartItems), 60)
return "One item"
```

Here, we've use the `store.put(key, value, ttl)` function, recording our state for 60 seconds. Also, we included some logic to parse JSON text to objects and converts them back to text as the persisted value is a regular character string. The script returns one single output that is the name of the response representation to use: `One item`. This representation is included in this operation OpenAPI specification and directly uses `{{ }}` expressions to just output the incoming request informations:

```yaml
[...]
responses:
  201:
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/Item'
        examples:
          One item:
            value: |-
              {
                "productId": "{{request.body/productId}}",
                "quantity": {{request.body/quantity}},
                "price": {{request.body/price}}
              }
[...]
```

We may now fully test that we're able to save a state by adding items and then read it back when asking for the full cart status. Let's do this using the 2 commands on Microcks' endpoints below:

```sh
# Add a millefeuille to the cart for user johndoe
$ curl -X PUT 'http://localhost:8585/rest/Cart+API/1.0.0/cart/items' -d '{"productId":"Millefeuille","quantity":2,"price":4.0}' -H 'Content-Type: application/json' -H 'customerId: johndoe'

{
  "productId": "Millefeuille",
  "quantity": 2,
  "price": 4.0
}

# Check johndoes's cart
$ curl -X GET 'http://localhost:8585/rest/Cart+API/1.0.0/cart' -H 'Accept: application/json' -H 'customerId: johndoe'

{
  "customerId": "johndoe",
  "items": [
    {
      "productId": "Millefeuille",
      "quantity": 2,
      "price": 4
    }
  ],
  "totalPrice": 8
}
```

Ho ho ho! We now have super-smart mocks that persist and retreive state but also integrates computed elements in the response! Just with a few lines of Groovy scripts! 🕺

## 4. Removing state

The final thing to explore in this guide is how to remove some state information from the `store`. We'll consider for that the `POST /cart/empty` operation that can be triggered to remove all the items within a shopping cart. 

Let's check the following [Groovy](https://groovy-lang.org/) snippet to do this:

```groovy
def customerId = mockRequest.getRequestHeaders().get("customerId", "null")
def items = store.delete(customerId + "-items")
return "Cart"
```

Pretty easy, no? It's just a matter of callling the `store.delete(key)` function. Here again, the script returns a single `Cart` response that is the generic rerpesentation of an empty shopping chart for current user:

```yaml
[...]
responses:
  200:
    content:
      application/json:
        schema:
          [...]
        examples:
          Cart:
            value: |-
              {
                "customerId": "{{request.headers[customerid]}}",
                "items": [],
                "totalPrice": 0.0
              }
[...]
```

As a final test, we may now check that we are able to add items to a cart, retrieve this cart items, delete all the items from the cart and check that we finally read an empty cart status. Let's go!

```sh
# Add a Baba au Rhum
curl -X PUT 'http://localhost:8585/rest/Cart+API/1.0.0/cart/items' -d '{"productId":"Baba Rhum","quantity":1,"price":4.1}' -H 'Content-Type: application/json' -H 'customerId: johndoe'

# Check johndoes's cart
$ curl -X GET 'http://localhost:8585/rest/Cart+API/1.0.0/cart' -H 'Accept: application/json' -H 'customerId: johndoe'

{
  "customerId": "johndoe",
  "items": [
    {
      "productId": "Millefeuille",
      "quantity": 2,
      "price": 4
    },
    {
      "productId": "Baba Rhum",
      "quantity": 1,
      "price": 4.1
    }
  ],
  "totalPrice": 12.1
}

# Empty johndoe's cart
$ curl -X POST 'http://localhost:8585/rest/Cart+API/1.0.0/cart/empty' -H 'Accept: application/json' -H 'customerId: johndoe'

{
  "customerId": "johndoe",
  "items": [],
  "totalPrice": 0
}

# Check johndoes's cart
$ curl -X GET 'http://localhost:8585/rest/Cart+API/1.0.0/cart' -H 'Accept: application/json' -H 'customerId: johndoe'

{
  "customerId": "johndoe",
  "items": [],
  "totalPrice": 0
}
```


## Wrap-up

Starting with `1.10.0` release, Microcks mocks can now become **stateful**. Automaticaly turning mocks into stateful simulations is impossible as there are numerous design guidelines that need to be considered, and after all, the world is definitely not only CRUD 😉

At Microcks we took the approach to put this power in user's hand, providing powerful primitives like scripts, `store`, `requestContext` and [template expressions](/documentation/references/templates) to manage persistence where it makes sense for your simulations.

You've seen these different primitives - `store.get()`, `store.put()`, `store.delete()` functions - in action during this how-to guide. Remember that the things you've learned here are not restricted to REST APIs but are also applicable to other API types like GraphQL, gRPC and SOAP!

Happy mocking! 🤡