// Checks the built site in dist/ before it is published. Run after `npm run build`: npm run test:dist
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { projects } from '../../src/content/projects.js';
import { meta } from '../../src/content/site.js';

const dist = 'dist';
const pages = ['/', ...projects.map((p) => `/work/${p.slug}/`)];
const html = Object.fromEntries(pages.map((page) => [page, readFileSync(path.join(dist, page, 'index.html'), 'utf8')]));
const all = (text, re) => [...text.matchAll(re)].map((m) => m[1]);
const one = (text, re) => (text.match(re) || [])[1];
const bodyOf = (text) => text.slice(text.indexOf('<body>'));

/** The file a root-relative URL is served from, as GitHub Pages resolves it. */
function fileFor(url) {
  const clean = decodeURI(url.split(/[?#]/)[0]);
  return path.join(dist, clean.endsWith('/') ? clean + 'index.html' : clean);
}

/** Every file in dist/, recursively. */
function filesIn(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? filesIn(full) : [full];
  });
}

test('every page has its own title, description and address', () => {
  const titles = new Set();
  for (const page of pages) {
    const title = one(html[page], /<title>([^<]+)<\/title>/);
    assert.ok(title && !titles.has(title), `${page}: missing or repeated title`);
    titles.add(title);
    assert.ok(one(html[page], /<meta name="description" content="([^"]+)">/), `${page}: description`);
    assert.equal(one(html[page], /<link rel="canonical" href="([^"]+)">/), meta.origin + page);
    assert.equal(one(html[page], /<meta property="og:url" content="([^"]+)">/), meta.origin + page);
  }
});

test('every share image named in a page exists', () => {
  for (const page of pages) {
    const image = one(html[page], /<meta property="og:image" content="([^"]+)">/);
    assert.ok(image?.startsWith(meta.origin + '/'), `${page}: og:image must be absolute`);
    assert.ok(existsSync(fileFor(image.slice(meta.origin.length))), `${page}: ${image} is not in dist/`);
  }
});

test('each page has one h1 and no repeated ids', () => {
  for (const page of [...pages, '/404.html']) {
    const text = page.endsWith('.html') ? readFileSync(path.join(dist, page), 'utf8') : html[page];
    assert.equal(all(text, /<h1[\s>]()/g).length, 1, `${page}: h1 count`);
    const ids = all(text, /\sid="([^"]+)"/g);
    const repeated = ids.filter((id, i) => ids.indexOf(id) !== i);
    assert.deepEqual(repeated, [], `${page}: repeated ids`);
  }
});

test('in-page links point to elements that exist', () => {
  const page = html['/'];
  const ids = new Set(all(page, /\sid="([^"]+)"/g));
  for (const href of all(page, /\shref="#([^"]+)"/g)) assert.ok(ids.has(href), `#${href} has no target`);
});

test('case-study pages carry the same body as the home page, so any of them hydrates', () => {
  for (const page of pages.slice(1)) assert.equal(bodyOf(html[page]), bodyOf(html['/']), page);
});

test('every local link, script, stylesheet and icon resolves to a file', () => {
  for (const page of [...pages, '/404.html']) {
    const text = page.endsWith('.html') ? readFileSync(path.join(dist, page), 'utf8') : html[page];
    const urls = all(text, /\s(?:href|src)="(\/(?!\/)[^"]*)"/g);
    assert.ok(urls.length > 3, `${page}: expected local links`);
    for (const url of urls) assert.ok(existsSync(fileFor(url)), `${page} links to ${url}, which is not in dist/`);
    assert.doesNotMatch(text, /\s(?:href|src)="(?!\/|#|https?:|mailto:)/, `${page}: relative URLs break on /work/<slug>/ pages`);
  }
});

test('the sitemap lists every page, and robots.txt points to it', () => {
  const sitemap = readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
  assert.deepEqual(all(sitemap, /<loc>([^<]+)<\/loc>/g), pages.map((p) => meta.origin + p));
  assert.match(readFileSync(path.join(dist, 'robots.txt'), 'utf8'), /Sitemap: https:\/\/atharv1772\.github\.io\/sitemap\.xml/);
});

test('the 404 page needs no JavaScript and stays out of search results', () => {
  const page = readFileSync(path.join(dist, '404.html'), 'utf8');
  assert.doesNotMatch(page, /<script type="module"/);
  assert.match(page, /<meta name="robots" content="noindex">/);
});

test('nothing published carries private contact details', () => {
  for (const file of filesIn(dist).filter((f) => /\.(html|js|css|xml|txt|svg|json)$/.test(f))) {
    const text = readFileSync(file, 'utf8');
    assert.doesNotMatch(text, /iith\.ac\.in/, file);
    assert.doesNotMatch(text, /\+91[\s-]?\d/, file);
  }
});
