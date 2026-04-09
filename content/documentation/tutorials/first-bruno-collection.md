---
draft: false
title: "Your 1st Bruno Collection Mock"
date: 2026-04-09
publishdate: 2026-04-09
lastmod: 2026-04-09
weight: 8
---

## Overview

[Bruno](https://www.usebruno.com/) is a fast and git-friendly API client that aims to revolutionize the Postman experience. Unlike traditional API clients that store collections in proprietary cloud formats, Bruno keeps everything simple and version-controlled using plain text files.

This tutorial demonstrates how to use Bruno collections with Microcks to mock and test your APIs. Bruno collections can be used as a source of truth for your API contracts, enabling Microcks to generate realistic mocks directly from your existing Bruno setup.

## Why Bruno + Microcks?

Combining Bruno with Microcks offers several advantages:

- **Git-friendly**: Bruno stores collections in a flat folder structure with `.bru` files, making it easy to version control and collaborate using Git
- **Offline-first**: No cloud dependencies - your collections live locally on your filesystem
- **Consistency**: Use the same collections for manual testing (Bruno) and automated mocking/testing (Microcks)
- **Speed**: Bruno is lightweight and fast, with no sync delays

## 1. Setup Microcks

For this tutorial, you'll need a running Microcks instance. The simplest way to get started is using Docker:

```bash
docker run -p 8585:8080 -p 9393:8081 --name microcks \
  -e ASYNC_MINION_URL=http://localhost:8081 \
  quay.io/microcks/microcks:latest
```

Wait for Microcks to start, then navigate to `http://localhost:8585`.

## 2. Install Bruno

If you haven't already, download and install Bruno from [https://www.usebruno.com/downloads](https://www.usebruno.com/downloads). Bruno is available for macOS, Linux, and Windows.

## 3. Create a Simple Bruno Collection

Let's create a simple collection for a "Books API". Open Bruno and create a new collection named "Books API":

### 3.1 Add a GET Request

Create a new request within your collection:

- **Method**: GET
- **URL**: `{{baseUrl}}/books`
- **Name**: Get All Books

Add a response example directly in Bruno. In the response section, add:

```json
[
  {
    "id": "1",
    "title": "The Pragmatic Programmer",
    "author": "David Thomas",
    "year": 1999
  },
  {
    "id": "2",
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "year": 2008
  }
]
```

### 3.2 Add a POST Request

Add another request for creating books:

- **Method**: POST
- **URL**: `{{baseUrl}}/books`
- **Name**: Create Book`

In the **Body** tab, select **JSON** and add:

```json
{
  "title": "Clean Architecture",
  "author": "Robert C. Martin",
  "year": 2017
}
```

Add a response example with status `201 Created`:

```json
{
  "id": "3",
  "title": "Clean Architecture",
  "author": "Robert C. Martin",
  "year": 2017
}
```

## 4. Export Collection for Microcks

Bruno stores collections in a folder structure like this:

```
books-api/
├── collections/
│   └── books-api/
│       ├── get-books.bru
│       ├── post-books.bru
│       └── bruno.json
└── environments/
    └── local.bru
```

To export your collection for Microcks:

1. Right-click on your collection in Bruno
2. Select **Export** or **Save as Collection File**
3. Choose a location and save as a `.zip` or individual `.bru` files

Alternatively, you can directly use the folder structure with Git and import it into Microcks.

## 5. Import into Microcks

Microcks supports importing Bruno collections through the web UI or CLI:

### 5.1 Via Web UI

1. Go to your Microcks instance at `http://localhost:8585`
2. Navigate to **Importers** in the left sidebar
3. Click **Upload** and select your Bruno collection files
4. Microcks will parse the `.bru` files and create mocks

### 5.2 Via CLI

You can also use the Microcks CLI for automation:

```bash
microcks import ./path/to/bruno-collection/
```

## 6. Using the Generated Mocks

Once imported, Microcks will:

1. Parse all requests and responses from your `.bru` files
2. Create mock endpoints for each operation
3. Generate example responses based on your Bruno examples

For our Books API, Microcks will create:

- `GET /books` → Returns the list of books
- `POST /books` → Creates a new book and returns the created resource

### Test the Mocks

Try accessing the mocks with curl:

```bash
curl http://localhost:8585/rest/Books+API/1.0.0/books -s | jq
```

You should see the response examples you defined in Bruno.

## 7. Advanced: Dynamic Responses with Bruno + Microcks

Bruno collections support variables and scripting. While Bruno scripts are not directly executed by Microcks, you can enhance your mocks by:

1. **Using dynamic expressions**: Add Microcks templating expressions in your response examples
2. **Secondary artifacts**: Import a secondary artifact with custom logic

Example with dynamic content:

In your Bruno `.bru` file response, you can use Microcks expressions:

```json
{
  "id": "{{ uuid() }}",
  "title": "{{ request.body/title }}",
  "createdAt": "{{ now() }}"
}
```

## 8. Best Practices

When using Bruno with Microcks:

- **Keep examples realistic**: Microcks will use your Bruno examples as-is, so make them representative of real data
- **Use consistent naming**: Follow a consistent naming convention for your requests
- **Leverage environments**: Use Bruno environments to manage different base URLs
- **Version your collections**: Store your `.bru` files in Git for proper versioning
- **Document as you go**: Add descriptions to requests and collections for better documentation

## Wrap-Up

In this tutorial, we've seen how Bruno collections can be used with Microcks to create a seamless API development workflow. By keeping your collections in a git-friendly format with Bruno, you get the best of both worlds:

- Fast, offline-first API development with Bruno
- Automated mocking and testing with Microcks

> 💡 Bruno support in Microcks is an evolving feature. If you encounter any issues or have suggestions, please open an issue on [GitHub](https://github.com/microcks/microcks/issues).

Happy mocking! 📚
