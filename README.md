# Microcks Website

Welcome to the Microcks website repository! This repository contains the source code for the official Microcks website, built with [Docusaurus 3](https://docusaurus.io/) and deployed on [Netlify](https://www.netlify.com/).

## About Microcks

Open source cloud-native tool for API Mocking and Testing. Microcks leverages API standards to provide a uniform and multi-protocol approach, empowering your API and microservices lifecycle. It strengthens your ecosystem to create an adaptable API value chain #APIDevOps

To learn more about Microcks and its features, visit the [Microcks website](https://microcks.io/).

## Getting started
Requires Node.js 20 (see `.nvmrc`).

- `npm install` then `npm start` — dev server
- `npm run build` runs, in order:
  1. `prebuild` → `scripts/ensure-descriptions.mjs`: adds a derived `description` to any doc/blog page without one (authored ones are never touched; this rewrites frontmatter, so commit the result).
  2. `docusaurus build` (also generates `llms.txt` / `llms-full.txt`, using the `rootContent` from `docusaurus.config.js`).
  3. `scripts/preload-fonts.mjs`: preloads the critical latin fonts in every page (avoids layout shift on font swap).
  4. `scripts/generate-route-markdown.mjs`: Markdown twins of every route (`build/<route>.md`).
  5. `scripts/validate-machine-content.mjs`: fails the build on missing/broken/non-canonical `llms.txt` links, over-long entries, Markdown twins without the AI-agent directive or with non-absolute links.
- `npm test` — unit checks; `npm run check:parity` — compares the live sitemap with the build

## Content
- Docs in `docs/`, blog in `blog/`, home/community data in `src/data/home.js`. See [GUIDELINES.md](GUIDELINES.md) for the writing rules.
- `docs/` and `blog/` are the source of truth. The original Hugo site lives in the archived [`microcks/microcks.io-hugo.old`](https://github.com/microcks/microcks.io-hugo.old) repository.
- Run `npm run optimize-images` after adding images to `static/images`.
- Hugo shortcodes are gone: use plain Markdown images and `<ApiSpec kind="openapi|asyncapi" url="…" />` in `.mdx` files.

## Agent-friendliness
Score 100/A+ with `npx afdocs check <url> --canonical-origin https://microcks.io`: a hidden `llms-txt-directive` in `src/theme/Root.js`, the main content placed before the sidebar/navbar in the DOM (`src/theme/Layout`, `src/theme/DocRoot/Layout`, restored visually with CSS `order`), and the HTML minifier disabled (`swcHtmlMinimizer: false`) because omitted `</td>`/`</tr>` tags break HTML parsers. Do not write Markdown images directly under an HTML tag without a blank line: they render as literal text.

## Theming notes
- Colour mode has two states (light/dark), no "system" option.
- Global CSS lives in `src/css/custom.css`; docs sidebar icons in `src/css/sidebar-icons.css` use `mask-size: 100% 100%` (needed for Safari/WebKit).
- The GitHub star counter (`src/components/GithubStar`) falls back to a hard-coded value when the unauthenticated API is rate-limited; update it occasionally.
- The accent blue `#46aaf3` and white-on-blue pairs fail WCAG contrast; kept deliberately for parity with the live site.

## Netlify
- `netlify.toml`, `static/_redirects`, `static/_headers`, and the edge function `netlify/edge-functions/content-negotiation.js` (serves Markdown for `Accept: text/markdown`). `noindex-netlify-host.js` adds `X-Robots-Tag: noindex` on `*.netlify.app` hosts only, so the custom domain is unaffected.
- Analytics (GA, Scarf) load only after cookie consent.

## Releases
The release scripts (`post-release.sh` in `microcks/microcks` and `microcks/microcks-operator`) clone this repository, publish the release artifacts into `static/helm`, `static/compose` and `static/operator`, and push to `main`. They need push rights on this repository. After a release, check that `https://microcks.io/helm/index.yaml` lists the new version.

## CI and automation
- **Build and Test**: `npm run build` and `npm test` on every pull request and push to `main`.
- **Spell Check**: `misspell` on `docs/`, `blog/` and `src/pages/`; add accepted words to `.wordlist.txt`.
- **Microcks Website Link Check**: weekly (and on demand), internal and external links on a fresh build; broken links are reported in the "External Link Check Report" issue. Exclusions live in `.lycheeignore`.
- **Dependabot**: weekly updates for npm and GitHub Actions.
- Pull requests also get a Netlify deploy preview.

## Contributing and community
Read the [Documentation Guidelines](GUIDELINES.md) and the [Contribution Guidelines](CONTRIBUTING.md). See also [GOVERNANCE](GOVERNANCE.md), [MAINTAINERS](MAINTAINERS.md), [AI-POLICY](AI-POLICY.md) and the [Code of Conduct](CODE_OF_CONDUCT.md). Questions or need assistance? Reach out to us: https://microcks.io/community/

> By the community, for the community. 🙌

Thank you for helping us improve Microcks! Every contribution counts 💙

## License
[Apache License 2.0](LICENSE)
