---
title: Async Features with Docker Compose
date: 2021-08-30
image: "images/blog/async-features-with-docker-compose.png"
author: "Laurent Broudoux"
type: "regular"
description: "Async Features with Docker Compose"
draft: false
---

For some weeks now, many users from the Microcks community were asking for playing with [AsyncAPI](https://asyncapi.com) related features without having to setup a Minikube or a full [Kubernetes](https://kubernetes.io) instance. And [Docker-Compose](https://docs.docker.com/compose/) is the perfect match for that! We were at first reluctant as it is an additional configuration to support... but developers experience FTW! 💪

{{< image src="images/blog/async-features-with-docker-compose.png" alt="image" zoomable="true" >}}

This blog post is a detailed walkthrough on how to use Asynchronous related features with Docker-Compose using the new set of compose files shipped in Microcks `master` branch. This configuration has also entered our [Installation documentation](https://microcks.io/documentation/guides/installation/docker-compose/#enabling-asynchronous-api-features).

So all you need from now is `docker` and `docker-compose` on your machine. Ready? Let's go!

## Start-up Microcks with Async features

Go to a temporary folder and remove previously downloaded `latest` images in case you made any other attempt to use Microcks in the past:

```sh
$ cd ~/Development/temp
$ docker rmi quay.io/microcks/microcks:latest quay.io/microcks/microcks-async-minion:latest quay.io/microcks/microcks-postman-runtime:latest
```

Then, clone a fresh copy of Microcks Git repository:

```sh
$ git clone https://github.com/microcks/microcks
Cloning into 'microcks'...
remote: Enumerating objects: 10546, done.
remote: Counting objects: 100% (1802/1802), done.
remote: Compressing objects: 100% (790/790), done.
remote: Total 10546 (delta 810), reused 1573 (delta 678), pack-reused 8744
Receiving objects: 100% (10546/10546), 2.68 MiB | 23.28 MiB/s, done.
Resolving deltas: 100% (5347/5347), done.
```

Go to the `docker-compose` installation folder and launch docker-compose with `async-addon`:

```sh
$ cd microcks/install/docker-compose
$ docker-compose -f docker-compose.yml -f docker-compose-async-addon.yml up -d
Creating network "docker-compose_default" with the default driver
Pulling postman (quay.io/microcks/microcks-postman-runtime:latest)...
latest: Pulling from microcks/microcks-postman-runtime
cbdbe7a5bc2a: Already exists
95feee427958: Already exists
4123295e9f39: Already exists
a59140832df1: Already exists
6504409a8831: Pull complete
9ce8afff0d5c: Pull complete
03f83af2527a: Pull complete
f208b202f815: Pull complete
Digest: sha256:dc95b935d95a65910b2905853f87befb47fc200ecb6a74a1f719a7f391a40e47
Status: Downloaded newer image for quay.io/microcks/microcks-postman-runtime:latest
Pulling app (quay.io/microcks/microcks:latest)...
latest: Pulling from microcks/microcks
158b4527561f: Pull complete
a3ba00ce78fe: Pull complete
e98e956a2ed9: Pull complete
5a89d95041e3: Pull complete
abfab39b5884: Pull complete
69b0a8a97d13: Pull complete
15d01b436c7a: Pull complete
824a05dec27f: Pull complete
Digest: sha256:65421add5646f597548319040bdf89b87028b3176ef00d9e16c4555dce4f9106
Status: Downloaded newer image for quay.io/microcks/microcks:latest
Pulling async-minion (quay.io/microcks/microcks-async-minion:latest)...
latest: Pulling from microcks/microcks-async-minion
b26afdf22be4: Already exists
218f593046ab: Already exists
e339d8c442c9: Pull complete
a1d53dd9b348: Pull complete
383dfd0d63fc: Pull complete
Digest: sha256:3ae2f6596e8c40fda9ff7cee5d43ee4d1e2c062794696af1ea3374a1d6c35ce6
Status: Downloaded newer image for quay.io/microcks/microcks-async-minion:latest
Creating microcks-zookeeper       ... done
Creating microcks-postman-runtime ... done
Creating microcks-db              ... done
Creating microcks-sso             ... done
Creating microcks-kafka           ... done
Creating microcks                 ... done
Creating microcks-async-minion    ... done
```

> Note that as are we're using `latest` tagged images here, the `sha256` of this ones may vary. 

After some minutes, check everything is running. Microcks app is bound on `localhost:8080`, Keycloak is bound on `localhost:18080`and Kafka broker is bound on `localhost:9092`:

```sh
$ docker ps
CONTAINER ID   IMAGE                                              COMMAND                  CREATED              STATUS              PORTS                                                                                                      NAMES
3779d9672ea1   quay.io/microcks/microcks-async-minion:latest      "/deployments/run-ja…"   About a minute ago   Up 38 seconds       8080/tcp                                                                                                   microcks-async-minion
c2d7f3e10215   quay.io/microcks/microcks:latest                   "/deployments/run-ja…"   About a minute ago   Up About a minute   0.0.0.0:8080->8080/tcp, :::8080->8080/tcp, 8778/tcp, 0.0.0.0:9090->9090/tcp, :::9090->9090/tcp, 9779/tcp   microcks
7e1f2d2c5305   strimzi/kafka:0.17.0-kafka-2.4.0                   "sh -c 'bin/kafka-se…"   About a minute ago   Up About a minute   0.0.0.0:9092->9092/tcp, :::9092->9092/tcp, 0.0.0.0:19092->19092/tcp, :::19092->19092/tcp                   microcks-kafka
a9b150c73ba2   jboss/keycloak:14.0.0                              "/opt/jboss/tools/do…"   About a minute ago   Up About a minute   8443/tcp, 0.0.0.0:18080->8080/tcp, :::18080->8080/tcp                                                      microcks-sso
05b0c649ee87   mongo:3.4.23                                       "docker-entrypoint.s…"   About a minute ago   Up About a minute   27017/tcp                                                                                                  microcks-db
ebb420d41691   strimzi/kafka:0.17.0-kafka-2.4.0                   "sh -c 'bin/zookeepe…"   About a minute ago   Up About a minute   0.0.0.0:2181->2181/tcp, :::2181->2181/tcp                                                                  microcks-zookeeper
85b842e3e537   quay.io/microcks/microcks-postman-runtime:latest   "docker-entrypoint.s…"   About a minute ago   Up About a minute   3000/tcp
```

> Note the different container identifiers as we'll use them later on to check their logs and execute some commands to check everything is running fine.

## Load a sample and check-up

Now, follow the [Getting Started](https://microcks.io/documentation/tutorials/getting-started/) guide. First access Microcks on `localhost:8080` from your browser and use `admin/microcks123` to log in. Then got to the **Importers** and add a new importer on `https://raw.githubusercontent.com/microcks/microcks/master/samples/UserSignedUpAPI-asyncapi.yml` URL as specified in [Loading samples](https://microcks.io/documentation/tutorials/getting-started/#loading-a-sample) section.

You should have following result:

{{< image src="images/blog/async-features-with-docker-compose-importers.png" alt="image" zoomable="true" >}}

Check the relevant logs on `microcks` container:

```
$ docker logs c2d7f3e10215
...
12:49:09.245 DEBUG 1 --- [080-exec-9] io.github.microcks.web.JobController     : Creating new job: io.github.microcks.domain.ImportJob@2c6712c7
12:49:09.404 DEBUG 1 --- [080-exec-6] io.github.microcks.web.JobController     : Getting job list for page 0 and size 20
12:49:09.408 DEBUG 1 --- [80-exec-10] .s.UserInfoHandlerMethodArgumentResolver : Creating a new UserInfo to resolve public org.springframework.http.ResponseEntity io.github.microcks.web.JobController.activateJob(java.lang.String,io.github.microcks.security.UserInfo) argument
12:49:09.408 DEBUG 1 --- [80-exec-10] .s.UserInfoHandlerMethodArgumentResolver : Found a KeycloakSecurityContext to map to UserInfo
12:49:09.409 DEBUG 1 --- [80-exec-10] i.g.m.s.KeycloakTokenToUserInfoMapper    : Current user is: UserInfo{name='null', username='admin', givenName='null', familyName='null', email='null', roles=[manager, admin, user], groups=[]}
12:49:09.410 DEBUG 1 --- [80-exec-10] io.github.microcks.web.JobController     : Activating job with id 612cd3c5c34e2146a8bd5b4d
12:49:09.460 DEBUG 1 --- [080-exec-1] .s.UserInfoHandlerMethodArgumentResolver : Creating a new UserInfo to resolve public org.springframework.http.ResponseEntity io.github.microcks.web.JobController.startJob(java.lang.String,io.github.microcks.security.UserInfo) argument
12:49:09.460 DEBUG 1 --- [080-exec-1] .s.UserInfoHandlerMethodArgumentResolver : Found a KeycloakSecurityContext to map to UserInfo
12:49:09.460 DEBUG 1 --- [080-exec-1] i.g.m.s.KeycloakTokenToUserInfoMapper    : Current user is: UserInfo{name='null', username='admin', givenName='null', familyName='null', email='null', roles=[manager, admin, user], groups=[]}
12:49:09.460 DEBUG 1 --- [080-exec-1] io.github.microcks.web.JobController     : Starting job with id 612cd3c5c34e2146a8bd5b4d
12:49:09.463  INFO 1 --- [080-exec-1] i.github.microcks.service.JobService     : Starting import for job 'User signed-up API'
12:49:09.464  INFO 1 --- [080-exec-1] i.g.microcks.service.ServiceService      : Importing service definitions from https://raw.githubusercontent.com/microcks/microcks/master/samples/UserSignedUpAPI-asyncapi.yml
12:49:10.092  INFO 1 --- [080-exec-1] i.g.m.u.MockRepositoryImporterFactory    : Found an asyncapi: 2 pragma in file so assuming it's an AsyncAPI spec to import
12:49:10.193 DEBUG 1 --- [080-exec-1] i.g.microcks.service.ServiceService      : Service [User signed-up API, 0.1.1] exists ? true
12:49:10.342 DEBUG 1 --- [080-exec-1] i.g.microcks.service.ServiceService      : Service change event has been published
12:49:10.342  INFO 1 --- [080-exec-1] i.g.microcks.service.ServiceService      : Having imported 1 services definitions into repository
12:49:10.344 DEBUG 1 --- [    task-1] i.g.m.l.ServiceChangeEventPublisher      : Received a ServiceChangeEvent on 612ca95fb327764983693ef1
12:49:10.345  INFO 1 --- [080-exec-1] i.github.microcks.service.JobService     : Import of job 'User signed-up API' done
12:49:10.357 DEBUG 1 --- [    task-1] i.g.microcks.service.MessageService      : Found 2 event(s) for operation 612ca95fb327764983693ef1-SUBSCRIBE user/signedup
12:49:11.124 DEBUG 1 --- [    task-1] i.g.m.l.ServiceChangeEventPublisher      : Processing of ServiceChangeEvent done !
```

As stated in the logs, a new API **User signed-up API, 0.1.1** has been discovered and is now available within Microcks repository. You can check this browsing the **API | Services** and discover your API details:

{{< image src="images/blog/async-features-with-docker-compose-asyncapi.png" alt="image" zoomable="true" >}}

From now, you should start having messages on the Kafka broker. Check the relevant logs on `microcks-async-minion` container:

```sh
$ docker logs 3779d9672ea1
2021-08-30 12:49:11,234 INFO  [io.git.mic.min.asy.AsyncMockDefinitionUpdater] (vert.x-eventloop-thread-0) Received a new change event [CREATED] for '612ca95fb327764983693ef1', at 1630327750357
2021-08-30 12:49:11,236 INFO  [io.git.mic.min.asy.AsyncMockDefinitionUpdater] (vert.x-eventloop-thread-0) Found 'SUBSCRIBE user/signedup' as a candidate for async message mocking
2021-08-30 12:49:11,267 INFO  [io.git.mic.min.asy.SchemaRegistry] (vert.x-eventloop-thread-0) Updating schema registry for 'User signed-up API - 0.1.1' with 1 entries
2021-08-30 12:49:11,424 INFO  [io.git.mic.min.asy.pro.ProducerManager] (QuarkusQuartzScheduler_Worker-25) Producing async mock messages for frequency: 10
2021-08-30 12:49:12,424 INFO  [io.git.mic.min.asy.pro.ProducerManager] (QuarkusQuartzScheduler_Worker-6) Producing async mock messages for frequency: 3
2021-08-30 12:49:12,425 INFO  [io.git.mic.min.asy.pro.KafkaProducerManager] (QuarkusQuartzScheduler_Worker-6) Publishing on topic {UsersignedupAPI-0.1.1-user-signedup}, message: {"id": "b2R4e1OTjLfp7R4JWDoSQxQvVj92O9IH", "sendAt": "1630327752425", "fullName": "Laurent Broudoux", "email": "laurent@microcks.io", "age": 41} 
2021-08-30 12:49:12,429 INFO  [io.git.mic.min.asy.pro.KafkaProducerManager] (QuarkusQuartzScheduler_Worker-6) Publishing on topic {UsersignedupAPI-0.1.1-user-signedup}, message: {"id":"OvnmDw3rO5LW7LmyZhj40Li9OKzN7htz","sendAt":"1630327752429","fullName":"John Doe","email":"john@microcks.io","age":36} 
2021-08-30 12:49:15,423 INFO  [io.git.mic.min.asy.pro.ProducerManager] (QuarkusQuartzScheduler_Worker-2) Producing async mock messages for frequency: 3
2021-08-30 12:49:15,424 INFO  [io.git.mic.min.asy.pro.KafkaProducerManager] (QuarkusQuartzScheduler_Worker-2) Publishing on topic {UsersignedupAPI-0.1.1-user-signedup}, message: {"id": "G5c5UerJHQP2JLKlBQiJS8eudx6KmFGN", "sendAt": "1630327755424", "fullName": "Laurent Broudoux", "email": "laurent@microcks.io", "age": 41} 
2021-08-30 12:49:15,426 INFO  [io.git.mic.min.asy.pro.KafkaProducerManager] (QuarkusQuartzScheduler_Worker-2) Publishing on topic {UsersignedupAPI-0.1.1-user-signedup}, message: {"id":"u6BZ8l1u1LZG3hQH7TtJdWzQDXzq5z54","sendAt":"1630327755426","fullName":"John Doe","email":"john@microcks.io","age":36}
```

Check the Kafka topic for messages, directly from your machine shell using `kafkacat` utility and `9092` advertised port:

```sh
$ kafkacat -b localhost:9092 -t UsersignedupAPI-0.1.1-user-signedup -o end
% Auto-selecting Consumer mode (use -P or -C to override)
% Reached end of topic UsersignedupAPI-0.1.1-user-signedup [0] at offset 356
{"id": "vcGIcN5mwytIFqtdaEljCRfDrDHg0u3u", "sendAt": "1630327965424", "fullName": "Laurent Broudoux", "email": "laurent@microcks.io", "age": 41}
{"id":"4m8ZDXMdFTWNR3AmnkT6u3HjXWnwPUEW","sendAt":"1630327965450","fullName":"John Doe","email":"john@microcks.io","age":36}
% Reached end of topic UsersignedupAPI-0.1.1-user-signedup [0] at offset 358
{"id": "eUVHsjv0VKPtxI7QxOnoEZ3ock6mek3k", "sendAt": "1630327968424", "fullName": "Laurent Broudoux", "email": "laurent@microcks.io", "age": 41}
{"id":"pzKlqOwucJnO6nVqmOrh7AAT9SFuoflD","sendAt":"1630327968429","fullName":"John Doe","email":"john@microcks.io","age":36}
```

Yes! 😉 

You can also connect to the running `microcks-kafka` container to use the built-in Kafka tools. This time, you access the broker using the `kafka:19092` address:

```sh
$ docker exec -it 7e1f2d2c5305 /bin/sh
sh-4.2$ cd bin/
sh-4.2$ ./kafka-topics.sh --bootstrap-server kafka:19092 --list
UsersignedupAPI-0.1.1-user-signedup
__consumer_offsets
microcks-services-updates

sh-4.2$ ./kafka-console-consumer.sh --bootstrap-server kafka:19092 --topic UsersignedupAPI-0.1.1-user-signedup
{"id": "T1smkgqMAmyb2UVKXDAYKw5Vtx8KD9up", "sendAt": "1630328127425", "fullName": "Laurent Broudoux", "email": "laurent@microcks.io", "age": 41}
{"id":"NvKLRGG91NsyoK9dj9CGlk2D8NrqaZuC","sendAt":"1630328127429","fullName":"John Doe","email":"john@microcks.io","age":36}
{"id": "f85zgAtDzvku7Uztp58UDfTokvePJxlg", "sendAt": "1630328130425", "fullName": "Laurent Broudoux", "email": "laurent@microcks.io", "age": 41}
{"id":"YbJA2ZeOKVaw0qNbMgMOi3TE3pPtwFM7","sendAt":"1630328130429","fullName":"John Doe","email":"john@microcks.io","age":36}
^CProcessed a total of 4 messages

sh-4.2$ exit
exit
```

That's it! 🎉

## Removing everything

Happy with your Microcks discovery? You can turn off everything and free resources executing this command:

```sh
$ docker-compose -f docker-compose.yml -f docker-compose-async-addon.yml down
Stopping microcks-async-minion    ... done
Stopping microcks                 ... done
Stopping microcks-kafka           ... done
Stopping microcks-sso             ... done
Stopping microcks-db              ... done
Stopping microcks-zookeeper       ... done
Stopping microcks-postman-runtime ... done
Removing microcks-async-minion    ... done
Removing microcks                 ... done
Removing microcks-kafka           ... done
Removing microcks-sso             ... done
Removing microcks-db              ... done
Removing microcks-zookeeper       ... done
Removing microcks-postman-runtime ... done
Removing network docker-compose_default
```

## Join Microcks community!

Come and say hi! on our [Discord chat](https://microcks.io/discord-invite/) 🐙, simply send some love through [GitHub stars](https://github.com/microcks/microcks) ⭐️ or follow us on [Twitter](https://twitter.com/microcksio) and [LinkedIn](https://www.linkedin.com/company/microcks/).

Thanks for reading and supporting us!