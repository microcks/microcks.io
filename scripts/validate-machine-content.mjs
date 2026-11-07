// Post-build check of the machine-readable outputs (llms.txt, llms-full.txt, route Markdown twins).
import fs from 'node:fs';
import path from 'node:path';

const BUILD = path.resolve(import.meta.dirname, '..', 'build');
const ORIGIN = 'https://microcks.io';
const errors = [];

for (const f of ['llms.txt', 'llms-full.txt', 'index.md']) {
  if (!fs.existsSync(path.join(BUILD, f))) errors.push(`Missing build/${f}`);
}

const llmsPath = path.join(BUILD, 'llms.txt');
if (fs.existsSync(llmsPath)) {
  const llms = fs.readFileSync(llmsPath, 'utf8');
  // Paths served by a Netlify 200 rewrite (e.g. the proxied OpenAPI description) have no file in build/.
  const redirectsPath = path.join(BUILD, '_redirects');
  const rewritten = new Set(
    fs.existsSync(redirectsPath)
      ? fs.readFileSync(redirectsPath, 'utf8').split('\n')
          .map(l => l.trim().split(/\s+/))
          .filter(p => p.length >= 3 && !p[0].startsWith('#') && p[p.length - 1] === '200')
          .map(p => p[0])
      : [],
  );
  const exists = rel => {
    if (rewritten.has('/' + rel.replace(/[?#].*$/, '').replace(/^\//, ''))) return true;
    const clean = rel.replace(/[?#].*$/, '').replace(/^\/|\/$/g, '');
    return [`${clean}.md`, path.join(clean, 'index.html'), clean].some(c => {
      const p = path.join(BUILD, c);
      return c && fs.existsSync(p) && fs.statSync(p).isFile();
    });
  };
  const links = [...llms.matchAll(/\]\(([^)]+)\)/g)].map(m => m[1]);
  for (const link of links) {
    if (!link.startsWith(ORIGIN)) {
      if (link.startsWith('/')) errors.push(`llms.txt internal link must use ${ORIGIN}: ${link}`);
      continue;
    }
    const rel = link.slice(ORIGIN.length) || '/';
    if (rel !== '/' && !exists(rel)) errors.push(`Broken llms.txt link: ${link}`);
  }
  const long = llms.split('\n').filter(l => /^- \[/.test(l) && l.length > 400);
  if (long.length) errors.push(`${long.length} llms.txt entries have overly long descriptions`);
}

const walkMd = d => fs.readdirSync(d, {withFileTypes: true}).flatMap(e => {
  const p = path.join(d, e.name);
  return e.isDirectory() ? walkMd(p) : p.endsWith('.md') ? [p] : [];
});
for (const f of walkMd(BUILD)) {
  const md = fs.readFileSync(f, 'utf8');
  const rel = path.relative(BUILD, f);
  if (!/^# .*\n\n> For AI agents:/.test(md)) errors.push(`${rel}: missing AI-agent directive after H1`);
  const body = md.replace(/^(```|~~~)[\s\S]*?^\1/gm, '');
  if (/!?\[[^\]]*\]\((?![a-z][a-z0-9+.-]*:|#|<)[^)]/i.test(body)) errors.push(`${rel}: non-absolute link`);
}

if (errors.length) {
  console.error(`validate-machine-content failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log('validate-machine-content: OK');
