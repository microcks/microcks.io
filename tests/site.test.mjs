import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {markdownPathname} from '../netlify/edge-functions/content-negotiation.js';
import {latestSpecVersion, pinSpec, publishPost, updateHome, blogSlug} from '../scripts/announce-release.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');

test('markdown negotiation maps routes to .md twins', () => {
  assert.equal(markdownPathname('/'), '/index.md');
  assert.equal(markdownPathname('/documentation/'), '/documentation.md');
  assert.equal(markdownPathname('/blog/some-post/'), '/blog/some-post.md');
  assert.equal(markdownPathname('/images/a.png'), null);
  assert.equal(markdownPathname('/helm/index.yaml'), '/helm/index.yaml.md');
});

test('legacy redirects are declared', () => {
  const r = fs.readFileSync(path.join(ROOT, 'static/_redirects'), 'utf8');
  for (const rule of ['/docs/*', '/discord-invite', '/author/:slug', '/tags/*']) assert.ok(r.includes(rule), rule);
});

test('stable distribution paths are shipped as static files', () => {
  for (const p of ['static/helm', 'static/operator', 'static/compose', 'static/schemas', 'static/go-client/index.html']) {
    assert.ok(fs.existsSync(path.join(ROOT, p)), p);
  }
});

test('Discord invite is only defined in static/_redirects', () => {
  const offenders = [];
  const walk = d => fs.readdirSync(d, {withFileTypes: true}).forEach(e => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) return walk(p);
    if (/\.(mdx?|js|mjs)$/.test(p) && /discord\.(gg|com\/invite)/.test(fs.readFileSync(p, 'utf8'))) offenders.push(path.relative(ROOT, p));
  });
  ['src', 'docs', 'blog'].forEach(d => walk(path.join(ROOT, d)));
  assert.deepEqual(offenders, [], 'link to https://microcks.io/discord-invite instead');
});

test('announce-release picks the latest spec and never downgrades a pin', () => {
  const files = ['microcks-openapi-v1.9.yaml', 'microcks-openapi-v1.16.yaml', 'microcks-openapi-v1.15.yaml', 'microcks-asyncapi-v1.10.yaml'];
  assert.equal(latestSpecVersion(files, 'openapi'), '1.16');
  assert.equal(latestSpecVersion(files, 'asyncapi'), '1.10');
  assert.equal(pinSpec('/api/microcks-openapi-v1.15.yaml 200', 'openapi', '1.16'), '/api/microcks-openapi-v1.16.yaml 200');
  assert.equal(pinSpec('/api/microcks-openapi-v1.15.yaml 200', 'openapi', '1.9'), '/api/microcks-openapi-v1.15.yaml 200');
});

test('announce-release publishes a draft post and links it from the home page', () => {
  const post = "---\ntitle: T\nslug: microcks-1.16.0-release\ndate: '2026-11-01'\ndraft: true\n---\n\nBody\n";
  const published = publishPost(post, '2026-12-01');
  assert.ok(!published.includes('draft'));
  assert.ok(published.includes("date: '2026-12-01'"));
  assert.equal(publishPost(published, '2027-01-01'), published);
  assert.equal(blogSlug('blog/microcks-1.16.0-release.md', post), 'microcks-1.16.0-release');

  const home = fs.readFileSync(path.join(ROOT, 'src/data/home.js'), 'utf8');
  const withBlog = updateHome(home, '1.16.0', 'microcks-1.16.0-release');
  assert.match(withBlog, /LATEST_RELEASE = '1\.16\.0'/);
  assert.match(withBlog, /releaseLink: '\/blog\/microcks-1\.16\.0-release\/'/);
  assert.match(updateHome(withBlog, '1.16.0', null), /releaseLink: `https:\/\/github\.com\/microcks\/microcks\/releases\/tag\/\$\{LATEST_RELEASE\}`/);
});
