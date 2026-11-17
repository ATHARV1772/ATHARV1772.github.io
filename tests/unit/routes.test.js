import { test } from 'node:test';
import assert from 'node:assert/strict';
import { caseUrl, slugFromUrl } from '../../src/lib/routes';
import { headTags, sitemap } from '../../src/lib/meta';
import { projects } from '../../src/content/projects';

test('each case study has its own address, and that address leads back to it', () => {
  for (const p of projects) assert.equal(slugFromUrl(caseUrl(p.slug), ''), p.slug);
});

test('the address works with or without the trailing slash or index.html', () => {
  assert.equal(slugFromUrl('/work/thesis'), 'thesis');
  assert.equal(slugFromUrl('/work/thesis/index.html'), 'thesis');
});

test('links shared before the case studies had pages (?project=slug) still work', () => {
  assert.equal(slugFromUrl('/', '?project=faithbench'), 'faithbench');
});

test('other addresses point to no case study', () => {
  for (const [path, search] of [['/', ''], ['/work/', ''], ['/work/a/b/', ''], ['/about/', ''], ['/', '?q=1']]) {
    assert.equal(slugFromUrl(path, search), null, path + search);
  }
});

test('head tags use absolute URLs and escape the text', () => {
  const html = headTags({ origin: 'https://example.test', path: '/work/a/', title: 'Say "hi" <now> & go', description: 'd', image: '/og/a.png', imageAlt: 'alt' });
  assert.match(html, /<title>Say &quot;hi&quot; &lt;now&gt; &amp; go<\/title>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/example\.test\/work\/a\/">/);
  assert.match(html, /<meta property="og:image" content="https:\/\/example\.test\/og\/a\.png">/);
  assert.doesNotMatch(html, /"[^"]*<now>/, 'no raw angle brackets inside an attribute');
});

test('the sitemap lists every page', () => {
  const xml = sitemap('https://example.test', ['/', '/work/a/']);
  assert.match(xml, /<loc>https:\/\/example\.test\/<\/loc>/);
  assert.match(xml, /<loc>https:\/\/example\.test\/work\/a\/<\/loc>/);
});
