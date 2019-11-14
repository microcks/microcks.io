---
draft: false
title: "Using Microcks from Tekton"
date: 2019-11-11
publishdate: 2019-11-11
lastmod: 2019-11-11
menu:
  docs:
    parent: automating
    name: Using Microcks from Tekton
    weight: 40
toc: true
weight: 40 #rem
categories: [automating]
---

## Microcks Tekton

The [Tekton](https://tekton.dev/) Pipelines project provides Kubernetes-style resources for declaring CI/CD-style pipelines. Microcks makes use of its [CLI](../cli) undercover and provides some `Tasks` and exemple `Pipelines` with the `/tekton` folder of [this repository](https://github.com/microcks/microcks-cli/tree/master/tekton). It also makes usage of Microcks [Service Account](../service-account) so it's defintely worth the read ;-)

## Tekton Task

The [`microcks-test-task.yaml`](https://github.com/microcks/microcks-cli/blob/master/tekton/microcks-test-task.yaml) resource holds a sample of a Tekton Task for testing with Microcks. You may remove default values for parameters or put your own here.

```yaml
apiVersion: tekton.dev/v1alpha1
kind: Task
metadata:
  name: microcks-test
spec:
  inputs:
    params:
      - name: apiNameAndVersion
        type: string
        description: "<apiName:apiVersion>: Service to test reference. Exemple: 'Beer Catalog API:0.9'"
        default: "Beer Catalog API:0.9"
      - name: testEndpoint
        type: string
        description: "URL where is deployed implementation to test"
      - name: runner
        type: string
        description: "Test strategy (one of: HTTP, SOAP, SOAP_UI, POSTMAN, OPEN_API_SCHEMA)"
        default: HTTP
      - name: microcksURL
        type: string
        description: "Microcks instance API endpoint"
      - name: keycloakClientId
        type: string
        description: "Keycloak Realm Service Account ClientId"
        default: microcks-serviceaccount
      - name: keycloakClientSecret
        type: string
        description: "Keycloak Realm Service Account ClientSecret"
        default: 7deb71e8-8c80-4376-95ad-00a399ee3ca1
      - name: waitFor
        type: string
        description: "Time to wait for test to finish (int + one of: milli, sec, min)"
        default: 5sec
      - name: operationsHeaders
        type: string
        description: "JSON that override some operations headers for the tests to launch"
        default: ""
  steps:
    - name: microcks-test
      image: microcks/microcks-cli:latest
      command:
        - /usr/bin/bash
      args:
        - '-c'
        - >-
          microcks-cli test '$(inputs.params.apiNameAndVersion)' $(inputs.params.testEndpoint) $(inputs.params.runner) \
            --microcksURL=$(inputs.params.microcksURL) --waitFor=$(inputs.params.waitFor) \
            --keycloakClientId=$(inputs.params.keycloakClientId) --keycloakClientSecret=$(inputs.params.keycloakClientSecret) \
            --insecure --operationsHeaders='$(inputs.params.operationsHeaders)'
```

You can just create this task within your namespace with:

```
$ kubectl apply -f microcks-test-task.yaml -n microcks-tekton
```

In case you have your Microcks installation between behind a TLS Ingress with custom certificate authority, you may have a look at the [`microcks-test-customcerts-task.yaml`](https://github.com/microcks/microcks-cli/blob/master/tekton/microcks-test-customcerts-task.yaml) that refer to an existing secret for retrieving this certificate.

You should have previously created your secret using something like this:

```
$ kubectl create secret generic microcks-test-customcerts-secret --from-file=ca.crt=ca.crt
```

### Executing a Task

Running a task can be done either by creating a `TaskRun` resource of through the [`tkn` CLI tool](https://github.com/tektoncd/cli). Both methods should provide the values for parameters of the `microcks-test`task. Here below an example on running such a task:

```yaml
apiVersion: tekton.dev/v1alpha1
kind: TaskRun
metadata:
  name: microcks-test-taskrun-beer-catalog
spec:
  taskRef:
    name: microcks-test
  inputs:
    params:
      - name: apiNameAndVersion
        value: "Beer Catalog API:0.9"
      - name: testEndpoint
        value: http://beer-catalog-impl-beer-catalog-dev.apps.144.76.24.92.nip.io/api/
      - name: runner
        value: POSTMAN
      - name: microcksURL
        value: http://microcks.apps.144.76.24.92.nip.io/api/
      - name: waitFor
        value: 12sec
      - name: keycloakClientId
        value: microcks-serviceaccount
      - name: keycloakClientSecret
        value: 34a49089-7566-45a0-88a6-112b297fd803
      - name: operationsHeaders
        value: |-
          {
            "globals": [
              {"name": "x-api-key", "values": "my-values"}
            ],
            "GET /beer": [
              {"name": "x-trace-id", "values": "xcvbnsdfghjklm"}
            ]
          }
```

Once you have adapted the parameter values to your own environment, you can just create the resource into your namespace:

```
$ kubectl apply -f microcks-test-taskrun.yaml -n microcks-tekton
```

The `tkn` CLI tool is very convenient for getting the logs of a Task run:

```
$ tkn taskrun logs  microcks-test-taskrun-beer-catalog
[microcks-test] MicrocksClient got status for test "5dcd11fc9b625c0001b0e185" - success: false, inProgress: true 
[microcks-test] MicrocksTester waiting for 2 seconds before checking again or exiting.
[microcks-test] MicrocksClient got status for test "5dcd11fc9b625c0001b0e185" - success: false, inProgress: true 
[microcks-test] MicrocksTester waiting for 2 seconds before checking again or exiting.
[microcks-test] MicrocksClient got status for test "5dcd11fc9b625c0001b0e185" - success: true, inProgress: false 
```


## Tekton Pipeline

A `Pipeline` defines a list of `Tasks` to execute in order. The same variable substitution you used in `TaskRun` is also available here and you may create a specific pipeline like this: 

```yaml
apiVersion: tekton.dev/v1alpha1
kind: Pipeline
metadata:
  name: microcks-pipeline-beer-catalog
spec:
  tasks:
    - name: microcks-test-beer-catalog
      taskRef:
        name: microcks-test
      params:
        - name: apiNameAndVersion
          value: "Beer Catalog API:0.9"
        - name: testEndpoint
          value: http://beer-catalog-impl-beer-catalog-dev.apps.144.76.24.92.nip.io/api/
        - name: runner
          value: POSTMAN
        - name: microcksURL
          value: http://microcks.apps.144.76.24.92.nip.io/api/
        - name: waitFor
          value: 12sec
        - name: keycloakClientId
          value: microcks-serviceaccount
        - name: keycloakClientSecret
          value: 34a49089-7566-45a0-88a6-112b297fd803
        - name: operationsHeaders
          value: |-
            {
              "globals": [
                {"name": "x-api-key", "values": "my-values"}
              ],
              "GET /beer": [
                {"name": "x-trace-id", "values": "xcvbnsdfghjklm"}
              ]
            }
    - name: echo-hello-world
      taskRef:
        name: echo-hello-world
      runAfter:
        - microcks-test-beer-catalog
```

Once you have adapted the parameter values to your own environment, you can just create the resource into your namespace:

```
$ kubectl apply -f microcks-test-pipeline-beer-catalog.yaml -n microcks-tekton
```

### Executing a Pipeline

`Pipeline` can be executed through a new `PipelineRun` resource creation or using the `tkn` CLI tool. This time we're using the CLI tool to start a new pipeline:

```
$ tkn pipeline start microcks-pipeline-beer-catalog
Pipelinerun started: microcks-pipeline-beer-catalog-run-9b9lk
Showing logs...
[microcks-test-beer-catalog : microcks-test] MicrocksClient got status for test "5dcd3ee91466840001b5aa0b" - success: false, inProgress: true 
[microcks-test-beer-catalog : microcks-test] MicrocksTester waiting for 2 seconds before checking again or exiting.
[microcks-test-beer-catalog : microcks-test] MicrocksClient got status for test "5dcd3ee91466840001b5aa0b" - success: false, inProgress: true 
[microcks-test-beer-catalog : microcks-test] MicrocksTester waiting for 2 seconds before checking again or exiting.
[microcks-test-beer-catalog : microcks-test] MicrocksClient got status for test "5dcd3ee91466840001b5aa0b" - success: true, inProgress: false 

[echo-hello-world : echo] hello world
```

`tkn` can also be used later to retrieve the logs for the pipeline execution:

```
$ tkn pipeline logs microcks-pipeline-beer-catalog
? Select pipelinerun : microcks-pipeline-beer-catalog-run-9b9lk started 17 hours ago
[microcks-test-beer-catalog : microcks-test] MicrocksClient got status for test "5dcd3ee91466840001b5aa0b" - success: false, inProgress: true 
[microcks-test-beer-catalog : microcks-test] MicrocksTester waiting for 2 seconds before checking again or exiting.
[microcks-test-beer-catalog : microcks-test] MicrocksClient got status for test "5dcd3ee91466840001b5aa0b" - success: false, inProgress: true 
[microcks-test-beer-catalog : microcks-test] MicrocksTester waiting for 2 seconds before checking again or exiting.
[microcks-test-beer-catalog : microcks-test] MicrocksClient got status for test "5dcd3ee91466840001b5aa0b" - success: true, inProgress: false 

[echo-hello-world : echo] hello world
```

Using the **OpenShift Pipelines** implementation of Tekton, you may easily get all this information at hands within the Developer Console of your OpenShift cluster. Here's belo a capture of our pipeline execution:

![tekton-pipeline-run](/images/tekton-pipeline-run.png)

With the view to access the logs of this execution:

![tekton-pipeline-logs](/images/tekton-pipeline-logs.png)