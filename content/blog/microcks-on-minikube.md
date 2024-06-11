---
title: Microcks on Minikube 🧊
date: 2023-12-27
image: "/images/blog/microcks-on-minikube-feature.png"
author: "Laurent Broudoux"
type: "regular"
description: "Microcks on Minikube 🧊"
draft: false
---

As we close the year, it's a good time for some housekeeping! On this occasion, I found some installation notes that could be worth transforming into proper blog posts or documentation. I went through my notes on **installing Microcks on Minikube** and decided to refresh them. It also needed to be completed with detailed information that we usually take for granted and forget to mention - such as network and Ingress configuration.

{{< image src="images/blog/microcks-on-minikube-feature.png" >}}

This installation notes were ran on my Apple Mac book M2 but those steps would sensibly be the same on any Linux machine. Let's go 🚀

## Preparation

As a Mac user, I used [brew](https://brew.sh) to install `minikube`. However, it is also available from several different package managers out there. You can also check the [Getting Started](https://minikube.sigs.k8s.io/docs/start/) guide to access direct binary downloads. Obviously, you'll also need the [`kubectl`](https://kubernetes.io/docs/tasks/tools/#kubectl) utility to interact with your cluster. 

```sh
$ brew install minikube

$ minikube version
minikube version: v1.29.0
commit: ddac20b4b34a9c8c857fc602203b6ba2679794d3
```

We use the basic, default configuration of `minikube` coming with the `docker` driver:

```sh
$ minikube config view
- driver: docker
```

## Start and configure a cluster

We're now going to start a Kube cluster. Start your `minikube` cluster with the defaults.

> My default locale is french, but you'll easily translate to your own language thanks to the nice emojis on the beginning of lines 😉

```sh
$ minikube start
--- OUTPUT ---
😄  minikube v1.29.0 sur Darwin 14.1.2 (arm64)
✨  Utilisation du pilote docker basé sur le profil existant
👍  Démarrage du noeud de plan de contrôle minikube dans le cluster minikube
🚜  Extraction de l'image de base...
🤷  docker "minikube" container est manquant, il va être recréé.
🔥  Création de docker container (CPUs=4, Memory=6144Mo) ...
🐳  Préparation de Kubernetes v1.26.1 sur Docker 20.10.23...
🔗  Configuration de bridge CNI (Container Networking Interface)...
🔎  Vérification des composants Kubernetes...
    ▪ Utilisation de l'image gcr.io/k8s-minikube/storage-provisioner:v5
    ▪ Utilisation de l'image docker.io/kubernetesui/dashboard:v2.7.0
💡  Après que le module est activé, veuiller exécuter "minikube tunnel" et vos ressources ingress seront disponibles à "127.0.0.1"
    ▪ Utilisation de l'image docker.io/kubernetesui/metrics-scraper:v1.0.8
    ▪ Utilisation de l'image registry.k8s.io/ingress-nginx/controller:v1.5.1
    ▪ Utilisation de l'image registry.k8s.io/ingress-nginx/kube-webhook-certgen:v20220916-gd32f8c343
    ▪ Utilisation de l'image registry.k8s.io/ingress-nginx/kube-webhook-certgen:v20220916-gd32f8c343
🔎  Vérification du module ingress...
💡  Certaines fonctionnalités du tableau de bord nécessitent le module metrics-server. Pour activer toutes les fonctionnalités, veuillez exécuter :

	minikube addons enable metrics-server	


🌟  Modules activés: storage-provisioner, default-storageclass, dashboard, ingress
🏄  Terminé ! kubectl est maintenant configuré pour utiliser "minikube" cluster et espace de noms "default" par défaut.
```

You need to enable the `ingress` add-on if not already set by default: 

```sh
$ minikube addons enable ingress
--- OUTPUT ---
💡  ingress est un addon maintenu par Kubernetes. Pour toute question, contactez minikube sur GitHub.
Vous pouvez consulter la liste des mainteneurs de minikube sur : https://github.com/kubernetes/minikube/blob/master/OWNERS
💡  Après que le module est activé, veuiller exécuter "minikube tunnel" et vos ressources ingress seront disponibles à "127.0.0.1"
    ▪ Utilisation de l'image registry.k8s.io/ingress-nginx/controller:v1.5.1
    ▪ Utilisation de l'image registry.k8s.io/ingress-nginx/kube-webhook-certgen:v20220916-gd32f8c343
    ▪ Utilisation de l'image registry.k8s.io/ingress-nginx/kube-webhook-certgen:v20220916-gd32f8c343
🔎  Vérification du module ingress...
🌟  Le module 'ingress' est activé
```

You can check connection to the cluster and that Ingresses are OK running the following command:

```sh
$ kubectl get pods -n ingress-nginx
--- OUTPUT ---
NAME                                       READY   STATUS      RESTARTS   AGE
ingress-nginx-admission-create-dz95x       0/1     Completed   0          26m
ingress-nginx-admission-patch-5bjwv        0/1     Completed   1          26m
ingress-nginx-controller-b6894599f-pml9s   1/1     Running     0          26m
```

## Install Microcks with default options

We're now going to install Microcks with basic options. We'll do that using the Helm Chart so you'll also need the [`helm`](https://helm.sh) binary. You can use `brew install helm` on Mac for that.

Then, we'll need to prepare the `/etc/hosts` file to access Microcks using an Ingress. Add the line containing `microcks.m.minikube.local` address. You need to declare 2 host names for both Microcks and Keycloak.

```sh
$ cat /etc/hosts
--- OUTPUT --- 
##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1 microcks.m.minikube.local keycloak.m.minikube.local
255.255.255.255 broadcasthost
::1 localhost
```

Now create a new namespace and do the install in this namespace:

```sh
$ kubectl create namespace microcks

$ helm repo add microcks https://microcks.io/helm

$ helm install microcks microcks/microcks --namespace microcks --set microcks.url=microcks.m.minikube.local --set keycloak.url=keycloak.m.minikube.local --set keycloak.privateUrl=http://microcks-keycloak.microcks.svc.cluster.local:8080
--- OUTPUT ---
NAME: microcks
LAST DEPLOYED: Tue Dec 19 15:23:23 2023
NAMESPACE: microcks
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
Thank you for installing microcks.

Your release is named microcks.

To learn more about the release, try:

  $ helm status microcks
  $ helm get microcks

Microcks is available at https://microcks.m.minikube.local.

GRPC mock service is available at "microcks-grpc.m.minikube.local".
It has been exposed using TLS passthrough on the Ingress controller, you should extract the certificate for your client using:

  $ kubectl get secret microcks-microcks-grpc-secret -n microcks -o jsonpath='{.data.tls\.crt}' | base64 -d > tls.crt
Keycloak has been deployed on https://keycloak.m.minikube.local to protect user access.
You may want to configure an Identity Provider or add some users for your Microcks installation by login in using the
username and password found into 'microcks-keycloak-admin' secret.
```

Wait for the images to be pulled, pods to be started and ingresses to be there:

```sh
$ kubectl get pods -n microcks
--- OUTPUT ---
NAME                                            READY   STATUS    RESTARTS   AGE
microcks-865b66d867-httf7                       1/1     Running   0          56s
microcks-keycloak-5bd7866b5f-9kr8k              1/1     Running   0          56s
microcks-keycloak-postgresql-6cfc7bf6c4-qb9rv   1/1     Running   0          56s
microcks-mongodb-d584889cf-wnzzb                1/1     Running   0          56s
microcks-postman-runtime-5cbc478db7-rzprn       1/1     Running   0          56s

$ kubectl get ingresses -n microcks
--- OUTPUT ---
NAME                CLASS   HOSTS                             ADDRESS        PORTS     AGE
microcks            nginx   microcks.m.minikube.local         192.168.49.2   80, 443   2m4s
microcks-grpc       nginx   microcks-grpc.m.minikube.local    192.168.49.2   80, 443   2m4s
microcks-keycloak   nginx   keycloak.m.minikube.local         192.168.49.2   80, 443   2m4s
```

To access the ingress from your browser, you'll need to start the networking tunneling service of Minikube - it may ask for `sudo` permission depending on when you did open your latest session:

```sh
$ minikube tunnel
--- OUTPUT ---
✅  Tunnel démarré avec succès

📌  REMARQUE : veuillez ne pas fermer ce terminal car ce processus doit rester actif pour que le tunnel soit accessible...

❗  Le service/ingress microcks nécessite l'exposition des ports privilégiés : [80 443]
🔑  sudo permission will be asked for it.
🏃  Tunnel de démarrage pour le service microcks-keycloak.
❗  Le service/ingress microcks-grpc nécessite l'exposition des ports privilégiés : [80 443]
🏃  Tunnel de démarrage pour le service microcks.
🔑  sudo permission will be asked for it.
🏃  Tunnel de démarrage pour le service microcks-grpc.
❗  Le service/ingress microcks-keycloak nécessite l'exposition des ports privilégiés : [80 443]
🔑  sudo permission will be asked for it.
🏃  Tunnel de démarrage pour le service microcks-keycloak.
```

Start opening `https://keycloak.m.minikube.local` in your browser to validate the self-signed certificate. Once done, you can visit `https://microcks.m.minikube.local` in your browser, validate the self-signed certificate and start playing around with Microcks!

The default user/password is `admin/microcks123`

## Install Microcks with asynchronous options

In this section, we're doing a complete install of Microcks, enabling the asynchronous protcols features. This requires deploying additional pods and a Kafka cluster. Microcks install can install and manage its own cluster using the [Strimzi](https://strimzi.io) project.

To be able to expose the Kafka cluster to the outside of Minikube, you’ll need to enable SSL passthrough on nginx. This require updating the default ingress controller deployment:

```sh
$ kubectl patch -n ingress-nginx deployment/ingress-nginx-controller --type='json' \
    -p '[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--enable-ssl-passthrough"}]'
```

Then, you'll also have to update your  `/etc/hosts` file so that we’ll can access Microcks Kafka broker using an Ingress. Add the line containing `microcks-kafka.kafka.m.minikube.local` and `microcks-kafka-0.kafka.m.minikube.local` hosts:

```sh
$ cat /etc/hosts
--- OUTPUT --- 
##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1 microcks.m.minikube.local keycloak.m.minikube.local microcks-kafka.kafka.m.minikube.local microcks-kafka-0.kafka.m.minikube.local
255.255.255.255 broadcasthost
::1 localhost
```

You'll still need to have the `minikube tunnel` services up-and-running like in the previous section. Next, you have to install the latest version of Strimzi operator:

```sh
$ kubectl apply -f 'https://strimzi.io/install/latest?namespace=microcks' -n microcks
```

Now, you can install Microcks using the Helm chart and enable the asynchronous features:

```sh
$ helm install microcks microcks/microcks --namespace microcks --set microcks.url=microcks.m.minikube.local --set keycloak.url=keycloak.m.minikube.local --set keycloak.privateUrl=http://microcks-keycloak.microcks.svc.cluster.local:8080 --set features.async.enabled=true --set features.async.kafka.url=kafka.m.minikube.local
--- OUTPUT ---
NAME: microcks
LAST DEPLOYED: Tue Dec 26 15:07:35 2023
NAMESPACE: microcks
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
Thank you for installing microcks.

Your release is named microcks.

To learn more about the release, try:

  $ helm status microcks
  $ helm get microcks

Microcks is available at https://microcks.m.minikube.local.

GRPC mock service is available at "microcks-grpc.m.minikube.local".
It has been exposed using TLS passthrough on the Ingress controller, you should extract the certificate for your client using:

  $ kubectl get secret microcks-microcks-grpc-secret -n microcks -o jsonpath='{.data.tls\.crt}' | base64 -d > tls.crt
Keycloak has been deployed on https://keycloak.m.minikube.local to protect user access.
You may want to configure an Identity Provider or add some users for your Microcks installation by login in using the
username and password found into 'microcks-keycloak-admin' secret.

Kafka broker has been deployed on microcks-kafka.kafka.m.minikube.local.
It has been exposed using TLS passthrough on the Ingress controller, you should extract the certificate for your client using:

  $ kubectl get secret microcks-kafka-cluster-ca-cert -n microcks -o jsonpath='{.data.ca\.crt}' | base64 -d > ca.crt
```

Watch and check the pods you should get in the namespace (this can take a bit longer if you pull Kafka images for the first time):

```sh
$ kc get pods -n microcks
--- OUTPUT ---
NAME                                             READY   STATUS    RESTARTS       AGE
microcks-5fbf679987-kzctj                        1/1     Running   1 (116s ago)   4m32s
microcks-async-minion-ddfc99cf5-lcs7s            1/1     Running   5 (101s ago)   4m32s
microcks-kafka-entity-operator-5755ff865-f4ktn   2/2     Running   1 (114s ago)   2m37s
microcks-kafka-kafka-0                           1/1     Running   0              3m
microcks-kafka-zookeeper-0                       1/1     Running   0              4m29s
microcks-keycloak-589f68fb76-xdn5w               1/1     Running   1 (4m9s ago)   4m32s
microcks-keycloak-postgresql-6cfc7bf6c4-4mc79    1/1     Running   0              4m32s
microcks-mongodb-d584889cf-m74mc                 1/1     Running   0              4m32s
microcks-postman-runtime-5d859fcdc4-zttkv        1/1     Running   0              4m32s
strimzi-cluster-operator-75d7f76545-k9scj        1/1     Running   0              6m40s
```

Now you can extract the Kafka cluster certificate using `kubectl get secret microcks-kafka-cluster-ca-cert -n microcks -o jsonpath='{.data.ca\.crt}' | base64 -d > ca.crt` and apply the checks found at [Async Features with Docker Compose](https://microcks.io/blog/async-features-with-docker-compose/).

Start with loading the [User signed-up API](https://microcks.io/blog/async-features-with-docker-compose/#load-a-sample-and-check-up) sample within your Microcks instance - remember that you have to validate the self-signed certificates like in the basic install first.

Now connect to the Kafka broker pod to check a topic has been correctly created and that you can consume messages from there:

```sh
$ kubectl -n microcks exec microcks-kafka-kafka-0 -it -- /bin/sh
--- INPUT ---
sh-4.4$ cd bin
sh-4.4$ ./kafka-topics.sh --bootstrap-server localhost:9092 --list
UsersignedupAPI-0.1.1-user-signedup
__consumer_offsets
microcks-services-updates

sh-4.4$ ./kafka-console-consumer.sh --bootstrap-server microcks-kafka-kafka-bootstrap:9092 --topic UsersignedupAPI-0.1.1-user-signedup
{"id": "sinHVoQvNdA3Bhl4fi57IVI15390WBkn", "sendAt": "1703599175911", "fullName": "Laurent Broudoux", "email": "laurent@microcks.io", "age": 41}
{"id":"650YIRQaB2OsG52txubYAEJfdFB3jOzh","sendAt":"1703599175914","fullName":"John Doe","email":"john@microcks.io","age":36}
{"id": "QWimzV9X1BRgIodOWoDdsP9EKtFSniDW", "sendAt": "1703599185914", "fullName": "Laurent Broudoux", "email": "laurent@microcks.io", "age": 41}
{"id":"ivMQIz7J7IXqps5yqcaVo6qvuByhviVk","sendAt":"1703599185921","fullName":"John Doe","email":"john@microcks.io","age":36}
{"id": "hEUfxuQRHHZkt9zFzMl5ti9DOIp12vpd", "sendAt": "1703599195914", "fullName": "Laurent Broudoux", "email": "laurent@microcks.io", "age": 41}
{"id":"OggnbfXX67QbfeMGXOTiOGT2BuqEPCPL","sendAt":"1703599195926","fullName":"John Doe","email":"john@microcks.io","age":36}
^CProcessed a total of 6 messages
sh-4.4$ exit
exit
command terminated with exit code 130
```

And finally, from your Mac host, you can install the [`kcat`](https://github.com/edenhill/kcat) utility to consume messages as well. You'll need to refer the `ca.crt` certificate you previsouly extracted from there:

```sh
$ kcat -b microcks-kafka.kafka.m.minikube.local:443 -X security.protocol=SSL -X ssl.ca.location=ca.crt -t UsersignedupAPI-0.1.1-user-signedup
--- OUTPUT ---
% Auto-selecting Consumer mode (use -P or -C to override)
{"id": "FrncZaUsQFWPlcKSm4onTrw3o0sXhMkJ", "sendAt": "1703600745149", "fullName": "Laurent Broudoux", "email": "laurent@microcks.io", "age": 41}
{"id":"EFcTdsrMuxKJiJUUikJnnSZWaKxltfJ0","sendAt":"1703600745275","fullName":"John Doe","email":"john@microcks.io","age":36}
{"id": "Kxqp7P75cM07SwasVcK3MIsLp5oWUD52", "sendAt": "1703600755112", "fullName": "Laurent Broudoux", "email": "laurent@microcks.io", "age": 41}
{"id":"p2c3SbFoGflV4DzjsyA8cLqCsCZQ96fC","sendAt":"1703600755117","fullName":"John Doe","email":"john@microcks.io","age":36}
[...]
% Reached end of topic UsersignedupAPI-0.1.1-user-signedup [0] at offset 106
^C%  
```

## Delete everything and stop the cluster

Deleting the microcks Helm release from your cluster is straightforward. Then you can finally stop your Minikube cluster to save some resources!

```sh
$ helm delete microcks -n microcks
--- OUTPUT ---
release "microcks" uninstalled

$ minikube stop
--- OUTPUT ---
✋  Nœud d'arrêt "minikube" ...
🛑  Mise hors tension du profil "minikube" via SSH…
🛑  1 nœud arrêté.
```

Happy testing!
