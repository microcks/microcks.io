#!/usr/bin/env node
// Announce a Microcks release on the website: bump the version shown on the home page, pin the
// latest published OpenAPI/AsyncAPI descriptions and publish the prepared blog post.
// Usage: node scripts/announce-release.mjs --version 1.16.0 [--blog blog/microcks-1.16.0-release.md] [--date 2026-12-01]
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const UPSTREAM = 'microcks/microcks';
const SPEC_FILES = ['static/_redirects', 'docs/references/apis/open-api.mdx', 'docs/references/apis/async-api.mdx'];
const HOME_FILE = 'src/data/home.js';

export function assertVersion(version) {
  if (!/^\d+\.\d+\.\d+$/.test(version ?? '')) throw new Error(`Invalid version "${version}", expected X.Y.Z`);
  return version;
}

const compareVersions = (a, b) => {
  const [pa, pb] = [a, b].map(v => v.split('.').map(Number));
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d) return d;
  }
  return 0;
};

/** Highest spec version among upstream file names such as microcks-openapi-v1.15.yaml. */
export function latestSpecVersion(fileNames, kind) {
  const re = new RegExp(`^microcks-${kind}-v(\\d+(?:\\.\\d+)*)\\.ya?ml$`);
  const versions = fileNames.map(n => re.exec(n)?.[1]).filter(Boolean);
  return versions.sort(compareVersions).pop() ?? null;
}

/** Pin a newer spec version, never downgrade an existing pin. */
export function pinSpec(text, kind, version) {
  const re = new RegExp(`(microcks-${kind}-v)(\\d+(?:\\.\\d+)*)(\\.ya?ml)`, 'g');
  return text.replace(re, (all, pre, current, post) => (compareVersions(version, current) > 0 ? `${pre}${version}${post}` : all));
}

export function blogSlug(file, markdown) {
  const fromFrontMatter = /^slug:\s*['"]?([^'"\s]+)['"]?\s*$/m.exec(frontMatter(markdown) ?? '')?.[1];
  if (fromFrontMatter) return fromFrontMatter;
  return path.basename(file).replace(/\.mdx?$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

function frontMatter(markdown) {
  return /^---\n([\s\S]*?)\n---/.exec(markdown)?.[1];
}

/** Remove `draft: true` and set the announcement date in the front matter. */
export function publishPost(markdown, date) {
  const fm = frontMatter(markdown);
  if (fm === undefined) throw new Error('Blog post has no front matter');
  if (!/^draft:\s*true\s*$/m.test(fm)) return markdown;
  let updated = fm.replace(/^draft:\s*true\s*\n?/m, '').replace(/\n+$/, '');
  updated = /^date:/m.test(updated) ? updated.replace(/^date:.*$/m, `date: '${date}'`) : `${updated}\ndate: '${date}'`;
  return markdown.replace(fm, updated);
}

/** Set LATEST_RELEASE and point the hero link to the blog post when there is one, to GitHub otherwise. */
export function updateHome(source, version, slug) {
  const link = slug ? `'/blog/${slug}/'` : '`https://github.com/microcks/microcks/releases/tag/${LATEST_RELEASE}`';
  const next = source
    .replace(/^export const LATEST_RELEASE = '[^']*';/m, `export const LATEST_RELEASE = '${version}';`)
    .replace(/^(\s*releaseLink:\s*).*,$/m, `$1${link},`);
  if (next === source && !source.includes(`'${version}'`)) throw new Error('Could not update src/data/home.js');
  return next;
}

async function github(endpoint) {
  const headers = {Accept: 'application/vnd.github+json'};
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com/repos/${UPSTREAM}/${endpoint}`, {headers});
  if (!res.ok) throw new Error(`GitHub API ${res.status} for ${endpoint}`);
  return res.json();
}

function edit(file, transform) {
  const full = path.join(ROOT, file);
  const before = fs.readFileSync(full, 'utf8');
  const after = transform(before);
  if (after === before) return false;
  fs.writeFileSync(full, after);
  return true;
}

async function main() {
  const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]]] : acc), []));
  const version = assertVersion(args.version);
  const date = args.date ?? new Date().toISOString().slice(0, 10);
  const report = [];

  await github(`releases/tags/${version}`); // fails when the GitHub release does not exist
  const apiFiles = (await github(`contents/api?ref=${version}`)).map(f => f.name);

  let slug = null;
  if (args.blog) {
    const blogFile = args.blog;
    if (!fs.existsSync(path.join(ROOT, blogFile))) throw new Error(`Blog post not found: ${blogFile}`);
    slug = blogSlug(blogFile, fs.readFileSync(path.join(ROOT, blogFile), 'utf8'));
    report.push(`blog post ${blogFile}: ${edit(blogFile, md => publishPost(md, date)) ? `published on ${date}` : 'already published, left as is'}`);
  }

  report.push(`${HOME_FILE}: ${edit(HOME_FILE, src => updateHome(src, version, slug)) ? `${version}, link to ${slug ? `blog /blog/${slug}/` : 'the GitHub release'}` : 'already up to date'}`);

  for (const kind of ['openapi', 'asyncapi']) {
    const latest = latestSpecVersion(apiFiles, kind);
    if (!latest) {
      report.push(`${kind}: no spec file found upstream at ${version}, left as is`);
      continue;
    }
    const changed = SPEC_FILES.filter(f => edit(f, text => pinSpec(text, kind, latest)));
    report.push(`${kind}: latest upstream v${latest}, ${changed.length ? `updated ${changed.join(', ')}` : 'already pinned'}`);
  }

  console.log(report.map(l => `- ${l}`).join('\n'));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => {
    console.error(`announce-release: ${err.message}`);
    process.exit(1);
  });
}
