// Emits a clean Markdown twin (<route>.md) of every doc and blog post into build/,
// served by the content-negotiation edge function when a client sends `Accept: text/markdown`.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'build');
const SITE = 'https://microcks.io';

function walk(dir, fn) {
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const p = path.join(dir, e.name);
    e.isDirectory() ? walk(p, fn) : fn(p);
  }
}

const DIRECTIVE = `> For AI agents: the complete documentation index is available at ${SITE}/llms.txt and the full documentation bundle at ${SITE}/llms-full.txt.`;

// Resolve path-relative links/images against the page URL (browser semantics) so the twin is portable; skips code fences
function absolutize(body, route) {
  const base = new URL(`${route.replace(/\/?$/, '/')}`, `${SITE}/`);
  let fenced = false;
  return body.split('\n').map(line => {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
    if (fenced) return line;
    return line.replace(/(!?\[[^\]]*\]\()(?!(?:[a-z][a-z0-9+.-]*:|#|\/|<))([^)\s]+)/gi, (_, pre, url) => {
      const u = new URL(url, base);
      return `${pre}${u.href}`;
    });
  }).join('\n');
}

function clean(body, route) {
  return absolutize(body, route)
    .replace(/^import .*$/gm, '')
    .replace(/<!--\s*truncate\s*-->/g, '')
    .replace(/<ApiSpec[^>]*url="([^"]+)"[^>]*\/>/g, (_, u) => `[API specification](${u})`)
    .replace(/<div class="video-embed"><iframe src="([^"]+)"[^>]*><\/iframe><\/div>/g, '[Video]($1)')
    .replace(/!\[[^\]]*\]\(/g, '![](')
    .replace(/(<img\s[^>]*?src=")\/(?!\/)/g, `$1${SITE}/`)
    .replace(/\]\(\/(?!\/)/g, `](${SITE}/`)
    .trim();
}

function emit(route, data, body) {
  const file = path.join(OUT, `${route.replace(/^\/|\/$/g, '') || 'index'}.md`);
  fs.mkdirSync(path.dirname(file), {recursive: true});
  const title = data.title ? `# ${data.title}\n\n${DIRECTIVE}\n\n` : `${DIRECTIVE}\n\n`;
  fs.writeFileSync(file, `${title}${clean(body, route)}\n`);
}

let count = 0;
emit('/', {title: 'Microcks'}, `Microcks is an open source, cloud native tool for API mocking and testing (OpenAPI, AsyncAPI, gRPC, GraphQL, SOAP), a CNCF incubating project.

Microcks is a Cloud Native Computing Foundation (CNCF) incubating project that leverages API standards to provide a uniform, multi-protocol approach to mocking and testing APIs across your API and microservices lifecycle.

## What you can do with Microcks

- Mock REST, SOAP, GraphQL, gRPC and event-driven APIs directly from OpenAPI, AsyncAPI, Postman collections, SoapUI projects and other API artifacts.
- Run conformance tests of your API implementations against their contracts, from your CI/CD pipelines or from the UI.
- Deploy it anywhere: Docker, Kubernetes with Helm or the Operator, Testcontainers in your integration tests, or the Microcks Hub.

## Where to go next

- [Documentation](/documentation/): installation guides, tutorials, explanations and references
- [Blog](/blog/): release notes and stories from the community
- [Community](/community/): how to chat, contribute and get involved
- [Events and recordings](/events/): meetups, conferences and past recordings
- [LLM index](/llms.txt): the complete documentation index for AI agents
- [OpenAPI description of the Microcks API](/openapi.yaml)`);

const docs = [];
walk(path.join(ROOT, 'docs'), p => {
  if (!/\.mdx?$/.test(p)) return;
  const rel = path.relative(path.join(ROOT, 'docs'), p).split(path.sep).join('/').replace(/\.mdx?$/, '');
  const {data, content} = matter(fs.readFileSync(p, 'utf8'));
  const route = rel === 'index' ? '/documentation' : `/documentation/${rel.replace(/\/index$/, '')}`;
  docs.push({route, data, content});
});
// <DocCardList /> renders the children of a category page: list them explicitly in the Markdown twin
const childList = route => docs
  .filter(d => d.route.startsWith(`${route}/`) && !d.route.slice(route.length + 1).includes('/'))
  .sort((a, b) => (a.data.sidebar_position ?? 1e9) - (b.data.sidebar_position ?? 1e9) || a.route.localeCompare(b.route))
  .map(d => `### [📄️${d.data.title || d.route.split('/').pop()}](${d.route}/)${d.data.description ? `\n\n${d.data.description}` : ''}`)
  .join('\n\n');
for (const {route, data, content} of docs) {
  emit(route, data, content.replace(/<DocCardList\s*\/>/g, () => childList(route)));
  count++;
}
const posts = [];
walk(path.join(ROOT, 'blog'), p => {
  if (!/\.mdx?$/.test(p)) return;
  const {data, content} = matter(fs.readFileSync(p, 'utf8'));
  if (!data.slug) return;
  emit(`/blog/${data.slug}`, data, content);
  posts.push({slug: data.slug, title: data.title || data.slug, date: String(data.date || '').slice(0, 10)});
  count++;
});
// Standalone Markdown pages (src/pages/*.md) are outside the docs/blog plugins
const pagesDir = path.join(ROOT, 'src', 'pages');
for (const f of fs.readdirSync(pagesDir).filter(n => /\.mdx?$/.test(n))) {
  const {data, content} = matter(fs.readFileSync(path.join(pagesDir, f), 'utf8'));
  emit(`/${f.replace(/\.mdx?$/, '')}`, data, content.replace(/^# .*\n+/, ''));
  count++;
}
posts.sort((a, b) => b.date.localeCompare(a.date));
emit('/blog', {title: 'Microcks Blog'}, posts.map(x => `- [${x.title}](/blog/${x.slug}/)${x.date ? ` (${x.date})` : ''}`).join('\n'));
emit('/community', {title: 'Microcks Community'}, `Microcks is a CNCF incubating open source project. Join the community:

- [GitHub](https://github.com/microcks/microcks)
- [Community page](/community/)
- [Documentation](/documentation/)`);
console.log(`Generated ${count} markdown routes in build/`);
