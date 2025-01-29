---
####################### Banner #########################
banner:
  title : "The open source, cloud native tool for API Mocking and Testing"
  image : "images/cncf-sandbox-horizontal-color.svg"
  atom : "images/atom.svg"
  #content : "A **dynamic**, **interconnected ecosystem** to help crafting **customized**, **multi-protocol universal** API **value chain**, powered by **cloud-native automation & standards** #APIOps"
  #content : "Microcks leverages API standards to provide uniform and multi-protocol approach, empowering your API and microservices lifecycle. It strengthen your ecosystem for crafting customized and versatile API value chain. #APIDevOps"
  #content : "Microcks leverages **API standards** to provide a **uniform and multi-protocol approach**, empowering your API and microservices lifecycle. Powered by **cloud-native automation**, it interconnects your API **value chain** ecosystem. #APIDevOps"
  content : "Microcks leverages **API standards** to provide a **uniform and multi-protocol approach**, empowering your API and microservices lifecycle. It strengthens your **ecosystem** to create an adaptable API **value chain** #APIDevOps"
  button:
    enable : true
    #label : "Microcks is a Cloud Native Computing Sandbox project 🚀"
    label : "♻️ 1.11.0 has just been released! 🚀"
    #link : "https://microcks.io/blog/microcks-joining-cncf-sandbox/"
    getstarted: ./documentation/tutorials/getting-started/
    link : "blog/microcks-1.11.0-release/"

################### Screenshot ########################
screenshot:
  enable : true
  title : "Microcks covers “ALL” Kind of API 👇"
  image : "images/microcks-all-kind-of-api.svg"

##################### Feature ##########################
feature:
  enable : true
  title: Microcks rule them all! <br/> See how our [Adopters](https://github.com/microcks/.github/blob/main/ADOPTERS.md) benefit from it.
  #title: Microcks is fully [community-driven](https://github.com/microcks/microcks/graphs/contributors) <br/> Check our [Adopters](https://github.com/microcks/.github/blob/main/ADOPTERS.md) file

########################## Clients Logo Slider #########################
clients_logo_slider:
  enable : true
  #title: "The best customer experiences are built with Bigspring"
  logos:
  - "images/adopters/bitso.png"
  - "images/adopters/bnp-paribas.png"
  - "images/adopters/deloitte.png"
  - "images/adopters/bancopan.png"
  - "images/adopters/jb-hunt.png"
  - "images/adopters/michelin.png"
  - "images/adopters/nordic-semiconductor.png"
  - "images/adopters/la-poste-groupe.png"
  - "images/adopters/opt-nc.png"
  - "images/adopters/traefiklabs.png"
  - "images/adopters/bump.png"
  - "images/adopters/sesam-vitale.png"
  - "images/adopters/catena-clearing.png"
  - "images/adopters/societe-generale.png"
  - "images/adopters/akwatype.png"
  - "images/adopters/assurance-maladie.png"
  - "images/adopters/onem.png"
  - "images/adopters/codecentric.png"
  - "images/adopters/api-quality.png"
  - "images/adopters/inetum.png"

######################### Intro Video #####################
#intro_video:
#  enable: true
#  title: "Getting Started in 3 minutes 🔥"
#  content: "Effortlessly set up and deploy Microcks in your existing [Docker environment](https://www.docker.com/blog/#get-started-with-the-microcks-docker-extension-for-api-mocking-and-testing/), eliminating the need for extensive #configurations 🚀"
#  video_url: "https://www.youtube.com/embed/E8rjUwznO-Q"
#  video_thumbnail: "images/community/Docker-desktop-youtube.png"

######################### Service #####################
service:
  enable : true
  service_item:
    # service item loop
    - title : "Multiple Specifications & Protocols"
      images:
      - "images/microcks-multiple-specifications-protocols.png"
      content : "Effortlessly **manage all** synchronous and event-driven **APIs** by leveraging OpenAPI, AsyncAPI, gRPC/Protobuf, GraphQL schemas and even SOAP. Microcks offers **a single**, **comprehensive tool** to handle everything, boosting **productivity** and cutting **costs**."
      button:
        enable : true
        label : "👉 Lombard Odier's Success Story with Microcks"
        link : "blog/lombard-odier-revolutionizing-api-strategy/"
        
    # service item loop
    - title : "Smart Dynamic Mocking"
      images:
      - "images/microcks-smart-dynamic-mocking.png"
      content : "Microcks offers **customizable mocking**: re-use, generate **realistic** examples or **transform** mock data and responses on the fly. Effectively **simulate** your application or microservices **dependencies** to accelerate API development."
      button:
        enable : true
        label : "👉 J.B. Hunt: Mock It till You Make It with Microcks"
        link : "blog/jb-hunt-mock-it-till-you-make-it/"
        
    # service item loop
    - title : "Testing  Automation"
      images:
      - "images/microcks-testing-automation.png"
      content : "Guarantee that your APIs meet their commitments. Perform **provider and consumer contract testing** on live implementations against various specification **versions**. Microcks saves time by auto-generating code snippets for seamless integration and automating checks within **CI/CD** pipelines."
      button:
        enable : true
        label : "👉 Getting started with Tests"
        link : "documentation/tutorials/getting-started-tests/"
        
    # service item loop
    - title : "Flexible Deployment"
      images:
      - "images/microcks-anywhere.png"
      content : "Thanks to its lightweight, containerized architecture, Microcks can be deployed **anywhere** on-premises, in the cloud, or on developers' laptops. Tailor the environment to your needs for **seamless integration**, boosting agility and lowering infrastructure barriers."
      button:
        enable : true
        label : "👉 Check our installation's How-To Guides"
        link : "documentation/guides/installation/"
        
################### tools_intregrate ########################
tools_intregrate_sponsor:
  enable : true
  title : "Sponsored by"
  content: "These great organizations are already sponsoring Microcks. Want to become a sponsor? Join our [Open collective](https://opencollective.com/microcks) or [Contact us](https://github.com/microcks/microcks/blob/master/MAINTAINERS.md) for more info."
  # dirty hack with a 1x1px png transparent image, but it work
  image : "images/1x1-00000000"
  #image : "images/sponsor/sponsors-join-us.png"
  
  tools:
  - "images/sponsor/Postman.png"

tools_intregrate_support:
  enable : true
  title : "Supported by"
  content: "The following companies support us by letting us use their products for free. Interested in supporting us too? [Contact us](https://github.com/microcks/microcks/blob/master/MAINTAINERS.md) for more info."
  # dirty hack with a 1x1px png transparent image, but it work
  image : "images/1x1-00000000"
  
  tools:
  - "images/support/SonarCloud.png"
  - "images/support/restream.png"
  - "images/support/commonroom.png"
---
