---
draft: false
title: "On Minikube with Helm"
date: 2024-04-30
publishdate: 2024-04-30
lastmod: 2024-06-13
weight: 5
---

## Overview 

This guide will walk you through the different steps of running a full Microcks installation on your laptop using [Minikube](https://minikube.sigs.k8s.io/). Step #4 is actually optional and may only be of interest if you'd like to use the Asynchronous features of Microcks.

The installation notes were run on an Apple MacBook M2, but those steps would sensibly be the same on any Linux machine. 

Let's go 🚀

## 1. Preparation

As being on a Mac, people usually use [brew](https://brew.sh) to install `minikube`. However, it is also available from several different package managers out there. You can also check the [Getting Started](https://minikube.sigs.k8s.io/docs/start/) guide to access direct binary downloads. Obviously, you'll also need the [`kubectl`](https://kubernetes.io/docs/tasks/tools/#kubectl) utility to interact with your cluster. 

```sh
brew install minikube
minikube version
```

```sh
minikube version: v1.32.0
commit: 8220a6eb95f0a4d75f7f2d7b14cef975f050512d
```

We use the basic, default configuration of `minikube` coming with the `docker` driver:

```sh
minikube config view
- driver: docker
```

## 2. Start and configure a cluster

We're now going to start a Kube cluster. Start your `minikube` cluster with the defaults.

> The default locale of commands below is French, but you'll easily translate to your own language thanks to the nice emojis at the beginning of lines 😉

```sh
minikube start
```

```sh

😄  minikube v1.32.0 sur Darwin 14.1.2 (arm64)
🎉  minikube 1.33.1 est disponible ! Téléchargez-le ici : https://github.com/kubernetes/minikube/releases/tag/v1.33.1
💡  Pour désactiver cette notification, exécutez : 'minikube config set WantUpdateNotification false'

✨  Utilisation du pilote docker basé sur le profil existant
👍  Démarrage du noeud de plan de contrôle minikube dans le cluster minikube
🚜  Extraction de l'image de base...
🔄  Redémarrage du docker container existant pour "minikube" ...
🐳  Préparation de Kubernetes v1.28.3 sur Docker 24.0.7...
🔗  Configuration de bridge CNI (Container Networking Interface)...
🔎  Vérification des composants Kubernetes...
💡  Après que le module est activé, veuiller exécuter "minikube tunnel" et vos ressources ingress seront disponibles à "127.0.0.1"
    ▪ Utilisation de l'image registry.k8s.io/ingress-nginx/kube-webhook-certgen:v20231011-8b53cabe0
    ▪ Utilisation de l'image registry.k8s.io/ingress-nginx/kube-webhook-certgen:v20231011-8b53cabe0
    ▪ Utilisation de l'image gcr.io/k8s-minikube/storage-provisioner:v5
    ▪ Utilisation de l'image registry.k8s.io/ingress-nginx/controller:v1.9.4
    ▪ Utilisation de l'image docker.io/kubernetesui/dashboard:v2.7.0
    ▪ Utilisation de l'image docker.io/kubernetesui/metrics-scraper:v1.0.8
🔎  Vérification du module ingress...
💡  Certaines fonctionnalités du tableau de bord nécessitent le module metrics-server. Pour activer toutes les fonctionnalités, veuillez exécuter :

	minikube addons enable metrics-server	


🌟  Modules activés: storage-provisioner, default-storageclass, dashboard, ingress
🏄  Terminé ! kubectl est maintenant configuré pour utiliser "minikube" cluster et espace de noms "default" par défaut.
```

You need to enable the `ingress` add-on if not already set by default: 

```sh
minikube addons enable ingress

💡  ingress est un addon maintenu par Kubernetes. Pour toute question, contactez minikube sur GitHub.
Vous pouvez consulter la liste des mainteneurs de minikube sur : https://github.com/kubernetes/minikube/blob/master/OWNERS
💡  Après que le module est activé, veuiller exécuter "minikube tunnel" et vos ressources ingress seront disponibles à "127.0.0.1"
    ▪ Utilisation de l'image registry.k8s.io/ingress-nginx/controller:v1.9.4
    ▪ Utilisation de l'image registry.k8s.io/ingress-nginx/kube-webhook-certgen:v20231011-8b53cabe0
    ▪ Utilisation de l'image registry.k8s.io/ingress-nginx/kube-webhook-certgen:v20231011-8b53cabe0
🔎  Vérification du module ingress...
🌟  Le module 'ingress' est activé
```

You can check the connection to the cluster and that Ingresses are OK by running the following command:

```sh
kubectl get pods -n ingress-nginx
```
```sh

NAME                                       READY   STATUS      RESTARTS   AGE
ingress-nginx-admission-create-dz95x       0/1     Completed   0          26m
ingress-nginx-admission-patch-5bjwv        0/1     Completed   1          26m
ingress-nginx-controller-b6894599f-pml9s   1/1     Running     0          26m
```

## 3. Install Microcks with default options

We're now going to install Microcks with basic options. We'll do that using the Helm Chart, so you'll also need the [`helm`](https://helm.sh) binary. You can use `brew install helm` on Mac for that.

Then, we'll need to prepare the `/etc/hosts` file to access Microcks using an Ingress. Add the line containing the `microcks.m.minikube.local` address. You need to declare 2 hostnames for both Microcks and Keycloak.

```sh
cat /etc/hosts
```
```sh
 
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

Now, create a new namespace and do the install in this namespace:

```sh
kubectl create namespace microcks
helm repo add microcks https://microcks.io/helm
helm install microcks microcks/microcks --namespace microcks --set microcks.url=microcks.m.minikube.local --set keycloak.url=keycloak.m.minikube.local --set keycloak.privateUrl=http://microcks-keycloak.microcks.svc.cluster.local:8080
```
```sh

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
kubectl get pods -n microcks
```
```sh

NAME                                            READY   STATUS    RESTARTS   AGE
microcks-865b66d867-httf7                       1/1     Running   0          56s
microcks-keycloak-5bd7866b5f-9kr8k              1/1     Running   0          56s
microcks-keycloak-postgresql-6cfc7bf6c4-qb9rv   1/1     Running   0          56s
microcks-mongodb-d584889cf-wnzzb                1/1     Running   0          56s
microcks-postman-runtime-5cbc478db7-rzprn       1/1     Running   0          56s

```sh
kubectl get ingresses -n microcks
```
```sh

NAME                CLASS   HOSTS                             ADDRESS        PORTS     AGE
microcks            nginx   microcks.m.minikube.local         192.168.49.2   80, 443   2m4s
microcks-grpc       nginx   microcks-grpc.m.minikube.local    192.168.49.2   80, 443   2m4s
microcks-keycloak   nginx   keycloak.m.minikube.local         192.168.49.2   80, 443   2m4s
```

To access the ingress from your browser, you'll need to start the networking tunneling service of Minikube - it may ask for `sudo` permission depending on when you opened your latest session:

```sh
minikube tunnel
```
```sh

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

## 4. Install Microcks with asynchronous options

In this section, we're installing Microcks completely and enabling the asynchronous protocol feature. This requires deploying additional pods and a Kafka cluster. Microcks can install and manage its own cluster using the [Strimzi](https://strimzi.io) project.

To be able to expose the Kafka cluster to the outside of Minikube, you’ll need to enable SSL passthrough on nginx. This requires updating the default ingress controller deployment:

```sh
kubectl patch -n ingress-nginx deployment/ingress-nginx-controller --type='json' \
    -p '[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--enable-ssl-passthrough"}]'
```

Then, you'll also have to update your entry in the  `/etc/hosts` file so that we can access Microcks Kafka broker using an Ingress. Add the line containing `microcks-kafka.kafka.m.minikube.local` and `microcks-kafka-0.kafka.m.minikube.local` hosts:

```sh
cat /etc/hosts
 
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

You'll still need to have the `minikube tunnel` services up and running like in the previous section. Next, you have to install the latest version of the Strimzi operator:

```sh
kubectl apply -f 'https://strimzi.io/install/latest?namespace=microcks' -n microcks
```

Now, you can install Microcks using the Helm chart and enable the asynchronous features:

```sh
helm install microcks microcks/microcks --namespace microcks --set microcks.url=microcks.m.minikube.local --set keycloak.url=keycloak.m.minikube.local --set keycloak.privateUrl=http://microcks-keycloak.microcks.svc.cluster.local:8080 --set features.async.enabled=true --set features.async.kafka.url=kafka.m.minikube.local
```
```sh

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
kc get pods -n microcks
```
```sh

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

Now connect to the Kafka broker pod to check that a topic has been correctly created and that you can consume messages from there:

```sh
  kubectl -n microcks exec microcks-kafka-kafka-0 -it -- /bin/sh\
```
```sh
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

And finally, from your Mac host, you can install the [`kcat`](https://github.com/edenhill/kcat) utility to consume messages as well. You'll need to refer to the `ca.crt` certificate you previously extracted from there:

```sh
kcat -b microcks-kafka.kafka.m.minikube.local:443 -X security.protocol=SSL -X ssl.ca.location=ca.crt -t UsersignedupAPI-0.1.1-user-signedup
```
```sh

% Auto-selecting Consumer mode (use -P or -C to override)
{"id": "FrncZaUsQFWPlcKSm4onTrw3o0sXhMkJ", "sendAt": "1703600745149", "fullName": "Laurent Broudoux", "email": "laurent@microcks.io", "age": 41}
{"id":"EFcTdsrMuxKJiJUUikJnnSZWaKxltfJ0","sendAt":"1703600745275","fullName":"John Doe","email":"john@microcks.io","age":36}
{"id": "Kxqp7P75cM07SwasVcK3MIsLp5oWUD52", "sendAt": "1703600755112", "fullName": "Laurent Broudoux", "email": "laurent@microcks.io", "age": 41}
{"id":"p2c3SbFoGflV4DzjsyA8cLqCsCZQ96fC","sendAt":"1703600755117","fullName":"John Doe","email":"john@microcks.io","age":36}
[...]
% Reached end of topic UsersignedupAPI-0.1.1-user-signedup [0] at offset 106
^C%  
```

## 5. Delete everything and stop the cluster

Deleting the microcks Helm release from your cluster is straightforward. Then you can finally stop your Minikube cluster to save some resources!

```sh
helm delete microcks -n microcks
```
```sh

release "microcks" uninstalled
```
```sh
minikube stop
```
```sh

✋  Nœud d'arrêt "minikube" ...
🛑  Mise hors tension du profil "minikube" via SSH…
🛑  1 nœud arrêté.
```

## Wrap-up

You've been through this guide and learned how to install Microcks on a Kubernetes cluster using Helm. Congrats! 🎉

If you'd like to learn more about all the available installation parameters, you can check our [Helm Chart Parameters](/documentation/references/configuration/helm-chart-config) reference documentation.

Happy learning!
