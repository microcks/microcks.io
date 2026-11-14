// Content of the landing page and community page, ported from the Hugo front matter.
// Bump LATEST_RELEASE on each Microcks release.
export const LATEST_RELEASE = '1.15.0';

export const hero = {
  title: 'The open source, cloud native tool for API Mocking and Testing',
  content:
    'Microcks leverages **API standards** to provide a **uniform and multi-protocol approach**, empowering your API and microservices lifecycle. It strengthens your **ecosystem** to create an adaptable API **value chain** #APIDevOps',
  releaseLabel: `${LATEST_RELEASE} has just been released! 🚀`,
  releaseLink: `https://github.com/microcks/microcks/releases/tag/${LATEST_RELEASE}`,
  getStartedLink: '/documentation/tutorials/getting-started/',
};

export const adopters = {
  title: 'Microcks rule them all! <br/> See how our [Adopters](https://github.com/microcks/.github/blob/main/ADOPTERS.md) benefit from it.',
  logos: [
    ['bitso', 'Bitso'], ['bnp-paribas', 'BNP Paribas'], ['deloitte', 'Deloitte'], ['bancopan', 'Banco Pan'],
    ['amway', 'Amway'], ['jb-hunt', 'J.B. Hunt'], ['michelin', 'Michelin'], ['nordic-semiconductor', 'Nordic Semiconductor'],
    ['la-poste-groupe', 'La Poste Groupe'], ['opt-nc', 'OPT-NC'], ['traefiklabs', 'Traefik Labs'], ['bump', 'Bump'],
    ['sesam-vitale', 'Sesam Vitale'], ['catena-clearing', 'Catena Clearing'], ['societe-generale', 'Société Générale'],
    ['akwatype', 'Akwatype'], ['assurance-maladie', 'Assurance Maladie'], ['onem', 'ONEM'], ['codecentric', 'codecentric'],
    ['api-quality', 'API Quality'], ['inetum', 'Inetum'],
  ].map(([file, name]) => ({src: `/images/adopters/${file}.png`, name})),
};

export const services = [
  {
    title: 'Multiple Specifications & Protocols',
    image: '/images/microcks-multiple-specifications-protocols.png',
    content:
      'Effortlessly **manage all** synchronous and event-driven **APIs** by leveraging OpenAPI, AsyncAPI, gRPC/Protobuf, GraphQL schemas and even SOAP. Microcks offers **a single**, **comprehensive tool** to handle everything, boosting **productivity** and cutting **costs**.',
    label: "Lombard Odier's Success Story with Microcks",
    link: '/blog/lombard-odier-revolutionizing-api-strategy/',
  },
  {
    title: 'Smart Dynamic Mocking',
    image: '/images/microcks-smart-dynamic-mocking.png',
    content:
      'Microcks offers **customizable mocking**: re-use, generate **realistic** examples or **transform** mock data and responses on the fly. Effectively **simulate** your application or microservices **dependencies** to accelerate API development.',
    label: 'J.B. Hunt: Mock It till You Make It with Microcks',
    link: '/blog/jb-hunt-mock-it-till-you-make-it/',
  },
  {
    title: 'Testing Automation',
    image: '/images/microcks-testing-automation.png',
    content:
      'Guarantee that your APIs meet their commitments. Perform **provider and consumer contract testing** on live implementations against various specification **versions**. Microcks saves time by auto-generating code snippets for seamless integration and automating checks within **CI/CD** pipelines.',
    label: 'Getting started with Tests',
    link: '/documentation/tutorials/getting-started-tests/',
  },
  {
    title: 'Flexible Deployment',
    image: '/images/microcks-anywhere.png',
    content:
      "Thanks to its lightweight, containerized architecture, Microcks can be deployed **anywhere** on-premises, in the cloud, or on developers' laptops. Tailor the environment to your needs for **seamless integration**, boosting agility and lowering infrastructure barriers.",
    label: "Check our installation's How-To Guides",
    link: '/documentation/guides/installation/',
  },
];

export const sponsors = {
  title: 'Sponsored by',
  content:
    'These great organizations are already sponsoring Microcks. Want to become a sponsor? Join our [Open collective](https://opencollective.com/microcks) or [Contact us](https://github.com/microcks/microcks/blob/master/MAINTAINERS.md) for more info.',
  logos: [{src: '/images/sponsor/Postman.png', name: 'Postman'}],
};

export const supporters = {
  title: 'Supported by',
  content:
    'The following companies support us by letting us use their products for free. Interested in supporting us too? [Contact us](https://github.com/microcks/microcks/blob/master/MAINTAINERS.md) for more info.',
  logos: [
    {src: '/images/support/SonarCloud.png', name: 'SonarCloud'},
    {src: '/images/support/restream.png', name: 'Restream'},
    {src: '/images/support/commonroom.png', name: 'Common Room'},
    {src: '/images/support/jetbrains.png', name: 'JetBrains'},
  ],
};

export const community = {
  banner: {
    title: 'For the Community, By the Community 🙌',
    image: '/images/community/maintainers.png',
    content:
      'Your **contributions**, **feedback**, and **ideas** are invaluable as we continue to enhance the [Microcks](https://github.com/microcks) **project** & **ecosystem**. Together, we can make API mocking and testing more **accessible and efficient for developers** worldwide.',
    label: 'Join us on GitHub',
    link: 'https://github.com/microcks',
  },
  blocks: [
    {
      title: 'We are available on [Discord](https://microcks.io/discord-invite)',
      image: '/images/community/Discord.png',
      content: "[Join us and connect](https://microcks.io/discord-invite) with fellow enthusiasts.<br>Let's build an even **stronger community together**!",
    },
    {
      title: 'Follow us on social',
      image: '/images/community/social.png',
      content:
        '**Stay tuned**! Follow us on [LinkedIn](https://www.linkedin.com/company/microcks/), [BlueSky](https://bsky.app/profile/microcks.io), [X](https://x.com/microcksio), [Mastodon](https://mastodon.social/@microcksio) and our [YouTube](https://www.youtube.com/c/Microcks) channel!',
    },
    {
      title: 'We ❤️ open source!',
      image: '/images/community/opensource.png',
      content:
        '**Join** the Microcks [Adopters](https://github.com/microcks/.github/blob/main/ADOPTERS.md) lists, **report** [issues](https://github.com/microcks/microcks/issues), **suggest** [roadmap](https://github.com/orgs/microcks/projects/1) improvements, **curate** [documents](/documentation/), **give** GitHub [stars](https://github.com/microcks/microcks) and [sponsorship](https://opencollective.com/microcks) or even **make** code [contributions](https://github.com/microcks/.github/blob/main/CONTRIBUTING.md).',
    },
    {
      title: 'Events and records',
      image: '/images/community/events.png',
      content: '**Learn** more about Microcks and our next [events](/events/), review or watch our [past recordings talks](/events/) ...',
    },
    {
      title: 'Community call',
      image: '/images/community/call.png',
      content:
        'Microcks hosts **two monthly community meetings**, tailored for different time zones. Here’s how to [join and participate](https://github.com/microcks/community/blob/main/JOIN-OUR-MEETINGS.md). We look forward to **seeing you** there! 🙌 Previous meetings are on the [YouTube](https://www.youtube.com/c/Microcks) channel.',
    },
    {
      title: 'Logos and assets',
      image: '/images/community/logo.png',
      content:
        'Here are a few [resources](/resources/) in case you want to **show off your support** for Microcks, **integrate** Microcks, or want to **link back** to us. Please feel **free to borrow** these!',
    },
  ],
};

export const socials = [
  {name: 'GitHub', href: 'https://github.com/microcks', icon: 'github'},
  {name: 'Discord', href: 'https://microcks.io/discord-invite', icon: 'discord'},
  {name: 'LinkedIn', href: 'https://www.linkedin.com/company/microcks/', icon: 'linkedin'},
  {name: 'Bluesky', href: 'https://bsky.app/profile/microcks.io', icon: 'bluesky'},
  {name: 'X', href: 'https://twitter.com/microcksio', icon: 'x'},
  {name: 'Mastodon', href: 'https://mastodon.social/@microcksio', icon: 'mastodon'},
  {name: 'YouTube', href: 'https://www.youtube.com/c/Microcks', icon: 'youtube'},
];
