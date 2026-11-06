// @ts-check
import {announcement} from './src/data/home.js';
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Microcks',
  tagline: 'The open source, cloud native tool for API Mocking and Testing',
  favicon: 'images/favicon.png',
  url: 'https://microcks.io',
  baseUrl: '/',
  // Hugo URLs end with a slash and links in the content rely on it.
  trailingSlash: true,
  organizationName: 'microcks',
  projectName: 'microcks.io',

  // Cascade layers are flattened by the faster toolchain and make Infima outrank custom.css; keep them off.
  future: {faster: {swcJsLoader: true, swcJsMinimizer: true, swcHtmlMinimizer: false, lightningCssMinimizer: true, rspackBundler: true, mdxCrossCompilerCache: true, rspackPersistentCache: true, ssgWorkerThreads: true}, v4: {removeLegacyPostBuildHeadAttribute: true, useCssCascadeLayers: false}},
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'warn',

  markdown: {
    // .md is CommonMark (raw HTML safe, no JSX parsing), .mdx is MDX.
    format: 'detect',
    hooks: {onBrokenMarkdownLinks: 'warn'},
  },

  i18n: {defaultLocale: 'en', locales: ['en']},

  headTags: [
    {tagName: 'link', attributes: {rel: 'manifest', href: '/site.webmanifest'}},
    {tagName: 'link', attributes: {rel: 'llmstxt', type: 'text/plain', href: '/llms.txt'}},
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: 'documentation',
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/microcks/microcks.io/edit/main/',
          // Needs git history: enabled on Netlify/CI (or SHOW_LAST_UPDATE=true), skipped for local non-git folders.
          showLastUpdateTime: Boolean(process.env.NETLIFY || process.env.CI || process.env.SHOW_LAST_UPDATE),
        },
        blog: {
          routeBasePath: 'blog',
          path: './blog',
          blogTitle: 'Microcks Blog',
          blogDescription: 'News, release notes and stories from the Microcks community',
          postsPerPage: 6,
          blogSidebarCount: 0,
          showReadingTime: true,
          editUrl: 'https://github.com/microcks/microcks.io/edit/main/',
          feedOptions: {type: ['rss', 'atom'], xslt: true},
          onInlineAuthors: 'warn',
          onInlineTags: 'warn',
          onUntruncatedBlogPosts: 'ignore',
        },
        sitemap: {changefreq: 'weekly', priority: 0.5, filename: 'sitemap.xml', ignorePatterns: ['/search/**', '/search']},
        theme: {customCss: './src/css/custom.css'},
      }),
    ],
  ],

  plugins: [
    [
      'docusaurus-plugin-llms',
      {
        generateLLMsTxt: true,
        generateLLMsFullTxt: true,
        generateMarkdownFiles: false,
        includeBlog: true,
        pathTransformation: {ignorePaths: ['docs'], addPaths: ['documentation']},
        excludeImports: true,
        removeDuplicateHeadings: true,
        description:
          'Microcks is an open source, cloud native tool for API mocking and testing (OpenAPI, AsyncAPI, gRPC, GraphQL, SOAP), a CNCF incubating project.',
        rootContent: `Microcks is a Cloud Native Computing Foundation (CNCF) incubating project that leverages API standards to provide a uniform, multi-protocol approach to mocking and testing APIs across your API and microservices lifecycle.

**Key concepts:**
- **API mocking**: Import OpenAPI, AsyncAPI, gRPC, GraphQL, SOAP/WSDL, Postman or Swagger artifacts and get live mocks with realistic examples in seconds.
- **Contract testing**: Run conformance tests of your implementations against the API contracts, from the UI, the CLI, CI/CD pipelines or Testcontainers.
- **Multi-protocol**: REST, SOAP, GraphQL, gRPC and event-driven APIs (Kafka, MQTT, AMQP, WebSocket and more).
- **Cloud native**: Deploy with Docker Compose, Helm or the Kubernetes Operator; extend with the CLI and client libraries.

**Company:**
- [Website summary](https://microcks.io/index.md)
- [Community](https://microcks.io/community.md)
- [Blog index](https://microcks.io/blog.md)
- [Events and past recordings](https://microcks.io/events.md)
- [Resources and logos](https://microcks.io/resources.md)
- [GitHub](https://github.com/microcks/microcks)`,
        includeOrder: ['documentation/overview/*', 'documentation/tutorials/*', 'documentation/guides/*', 'documentation/explanations/*', 'documentation/references/*'],
      },
    ],
  ],

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      /** @type {import('@easyops-cn/docusaurus-search-local').PluginOptions} */
      ({
        hashed: true,
        indexDocs: true,
        indexBlog: true,
        indexPages: false,
        docsRouteBasePath: 'documentation',
        blogRouteBasePath: 'blog',
        highlightSearchTermsOnTargetPage: true,
        searchBarShortcutHint: true,
        explicitSearchResultPath: true,
      }),
    ],
  ],


  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'images/microcks-logo-blue-name.png',
      metadata: [
        {name: 'keywords', content: 'Microcks, open source, API, microservices, OpenAPI, AsyncAPI, GraphQL, gRPC, Kafka, mocking, testing'},
        {name: 'author', content: 'Microcks'},
      ],
      announcementBar: announcement.enable ? {
        id: 'kubecon-na-2026',
        content: `${announcement.text} <a target="_blank" rel="noopener noreferrer" href="${announcement.link}">${announcement.cta}</a>`,
        backgroundColor: '#63a9ec',
        textColor: '#ffffff',
        isCloseable: true,
      } : undefined,
      colorMode: {defaultMode: 'light', respectPrefersColorScheme: false},
      zoom: {selector: '.markdown img:not([data-zoom-off])', background: {light: 'rgba(255,255,255,0.92)', dark: 'rgba(16,20,24,0.92)'}},
      docs: {sidebar: {hideable: false, autoCollapseCategories: false}},
      navbar: {
        logo: {
          alt: 'Microcks',
          src: 'images/microcks-logo-blue-name.png',
          srcDark: 'images/microcks-logo-white-name.png',
          width: 160,
          height: 51,
        },
        items: [
          {to: '/', label: 'Home', position: 'left', activeBaseRegex: '^/$'},
          {to: '/documentation/', label: 'Docs', position: 'left', activeBasePath: '/documentation'},
          {to: '/blog/', label: 'Blog', position: 'left', activeBasePath: '/blog'},
          {
            label: 'Community',
            position: 'left',
            items: [
              {to: '/community/', label: 'About'},
              {to: '/events/', label: 'Events'},
              {to: '/resources/', label: 'Resources'},
            ],
          },
          {type: 'custom-githubStar', position: 'left', className: 'navbar-github-star'},
          {type: 'search', position: 'right'},
          {
            type: 'html',
            position: 'right',
            value: '<a class="button button--primary navbar-try-button" href="/documentation/overview/try-microcks/">Try Microcks</a>',
          },
        ],
      },
      prism: {
        theme: prismThemes.dracula,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'yaml', 'json', 'java', 'protobuf', 'graphql', 'docker', 'properties', 'groovy', 'powershell', 'diff', 'go', 'javascript', 'typescript', 'csharp', 'python'],
      },
    }),
};

export default config;
