# microcks.io (Docusaurus)

Docusaurus 3 site for microcks.io, deployed on Netlify.

## Commands
- `npm install` then `npm start` — dev server
- `npm run build` runs, in order:
  1. `prebuild` → `scripts/ensure-descriptions.mjs`: adds a derived `description` to any doc/blog page without one (authored ones are never touched; this rewrites frontmatter, so commit the result).
  2. `docusaurus build` (also generates `llms.txt` / `llms-full.txt`, using the `rootContent` from `docusaurus.config.js`).
  3. `scripts/preload-fonts.mjs`: preloads the critical latin fonts in every page (avoids layout shift on font swap).
  4. `scripts/generate-route-markdown.mjs`: Markdown twins of every route (`build/<route>.md`).
  5. `scripts/validate-machine-content.mjs`: fails the build on missing/broken/non-canonical `llms.txt` links, over-long entries, Markdown twins without the AI-agent directive or with non-absolute links.

Agent-friendliness (score 100/A+ with `npx afdocs check <url> --canonical-origin https://microcks.io`): a hidden `llms-txt-directive` in `src/theme/Root.js`, the main content placed before the sidebar/navbar in the DOM (`src/theme/Layout`, `src/theme/DocRoot/Layout`, restored visually with CSS `order`), and the HTML minifier disabled (`swcHtmlMinimizer: false`) because omitted `</td>`/`</tr>` tags break HTML parsers. Do not write Markdown images directly under an HTML tag without a blank line: they render as literal text.
- `npm test` — unit checks; `npm run check:parity` — compares the live sitemap with the build

## Content
- Docs in `docs/`, blog in `blog/`, home/community data in `src/data/home.js`.
- The one-shot Hugo → Docusaurus migration script was retired at cutover: `docs/` and `blog/` are now the source of truth (the original Hugo content lives in the `microcks/microcks.io` history). Run `npm run optimize-images` after adding images to `static/images`.
- Hugo shortcodes are gone: use plain Markdown images and `<ApiSpec kind="openapi|asyncapi" url="…" />` in `.mdx` files.

## Theming notes
- Colour mode has two states (light/dark), no "system" option.
- Global CSS lives in `src/css/custom.css`; docs sidebar icons in `src/css/sidebar-icons.css` use `mask-size: 100% 100%` (needed for Safari/WebKit).
- The GitHub star counter (`src/components/GithubStar`) falls back to a hard-coded value when the unauthenticated API is rate-limited; update it occasionally.
- The accent blue `#46aaf3` and white-on-blue pairs fail WCAG contrast; kept deliberately for parity with the live site.

## Netlify
- `netlify.toml`, `static/_redirects`, `static/_headers`, and the edge function `netlify/edge-functions/content-negotiation.js` (serves Markdown for `Accept: text/markdown`). `noindex-netlify-host.js` adds `X-Robots-Tag: noindex` on `*.netlify.app` hosts only, so the custom domain is unaffected.
- Analytics (GA, Scarf) load only after cookie consent.

## Cutover checklist (GitHub Pages → Netlify)
1. Deploy preview OK; `npm run check:parity` passes.
2. Verify `/helm/index.yaml`, `/go-client/`, `/testcontainers-go/` and a file in each of `/operator/`, `/compose/`, `/schemas/` (the directories themselves 404, as on the old site).
3. Lower DNS TTL, switch `microcks.io` to Netlify, re-check the above and the sitemap.
4. Submit the new sitemap to Search Console.
5. Confirm the custom domain does not send `X-Robots-Tag` (`curl -sI https://microcks.io/ | grep -i x-robots`).
6. Confirm `editUrl` in `docusaurus.config.js` (docs and blog) points at the final repository name and that "Edit this page" opens the editor. The final repository is `microcks/microcks.io` with default branch `main`, so `editUrl` must become `https://github.com/microcks/microcks.io/edit/main/`.
7. Repository move, in this order and without any release in between: rename the Hugo repository to `microcks/microcks.io-hugo.old` and archive it (triage its open issues and PRs first), transfer this repository to the `microcks` org and rename it `microcks.io`, re-link Netlify to it, then switch DNS.
8. Release scripts: `post-release.sh` in `microcks/microcks` and `microcks/microcks-operator` clone `https://github.com/microcks/microcks.io` (unchanged) and run `git push origin master`; change it to `git push origin main` when the move happens. They publish into `static/helm` and `static/compose`.
9. After the move, run a test release and check that `https://microcks.io/helm/index.yaml` lists the new version and that the release leads can push to the repository.
