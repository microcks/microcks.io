---
title: "Import API to microcks with gitlab user token"
draft: false
layout: post
date: 2021-10-01
publishdate: 2021-10-01
lastmod: 2021-10-01
image: "/images/blog/import-api-to-microcks-with-gitlab-user-token.png"
categories: [blog]
author: "Romain Gil"
author_title: "Community member"
author_image: "/images/blog/bio/rgil.png"
---

Microcks can easily import OpenAPI files from a Gitlab repository. However, you need more configuration for a secured repository.

The OpenApi file must be retrieved by it's RAW URL : https://<your_gitlab_server>/<your_path_to_your_repo>/-/raw/<branch>/<file>. This URL could not be called with any type of Gitlab token.

The URL to use with an access token is : https://<your_gitlab_server>/api/v4/projects/<project_id>/repository/files/<your_path_to_your_repo>%2F<file>/raw?ref=<branch>

This post will explain how to generate this access token and how to connect Microcks to a secured Gitlab repository.

Tested with Gitlab 13.x.
## Summary

To allow Microcks to read a raw file from a secured Gitlab repository, you have to create an access token.

Follow those few steps to do so:

1. Create a repository access token
2. Declare the access token to microcks
3. Get the repository ID
4. Get the OpenAPI file's RAW URL
5. Importation example
6. Conclusion

## Create a repository access token

### Go to your Gitlab repository UI

You can create the gitlab repository access token by using the "Access Tokens" choice in the settings of your Gitlab repository.

![setting_access_token](/images/blog/import-api-with-gitlab-private-repo-setting_access_token.jpg)

### Create the access token

You have to configure the token of the gitlab repository like this:

![token](/images/blog/import-api-with-gitlab-private-repo-token.jpg)

## Declare the access token to microcks

To add your access token to microcks, use an administrator account, which authorize the access to administration settings.

![add_token_microcks](/images/blog/import-api-with-gitlab-private-repo-add_token_microcks.jpg)

## Get the project ID

You can find the project id on the home page of your repository on the Gitlab UI interface.

![project_ID](/images/blog/import-api-with-gitlab-private-repo-project_ID.jpg)

## Get the OpenAPI file's RAW URL

The OpenAPI file's RAW URL looks like this:

https://<GITLAB_URL>/api/v4/projects/<ID_PROJECT>/repository/files/<PATH>%2F<FILE_NAME>/raw?ref=<PROJECT_BRANCH>

A file within a directory needs the character '/' to be encoded with '%2F' on the <PATH> string.

## Importation exemple

### Configure repository's url

![import_exemple](/images/blog/import-api-with-gitlab-private-repo-import_exemple.jpg)

### Select Token

![select_token](/images/blog/import-api-with-gitlab-private-repo-select_token.jpg)
