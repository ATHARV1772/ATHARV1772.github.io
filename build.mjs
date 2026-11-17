// Builds the site into dist/:
//   1. bundles the browser code (React, Redux, components, CSS) with esbuild
//   2. renders the page to HTML on Node with react-dom/server, so it works before JS loads
//   3. writes the home page, one page per case study (/work/<slug>/), a 404 page and a sitemap,
//      then copies public/ (favicon, résumé, share images)
// Run: npm run build
import * as esbuild from 'esbuild';
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export async function build({ outdir = 'dist' } = {}) {
  await rm(outdir, { recursive: true, force: true });
  await mkdir(path.join(outdir, 'assets'), { recursive: true });
  const shared = { bundle: true, jsx: 'automatic', define: { 'process.env.NODE_ENV': '"production"' }, logLevel: 'warning' };

  const client = await esbuild.build({
    ...shared,
    entryPoints: ['src/main.jsx'],
    outdir: path.join(outdir, 'assets'),
    entryNames: '[name]-[hash]',
    format: 'esm',
    target: ['es2020'],
    minify: true,
    metafile: true,
  });

  await esbuild.build({ ...shared, entryPoints: ['src/server.jsx'], outfile: '.build/server.cjs', platform: 'node', format: 'cjs', loader: { '.css': 'empty' } });
  const require = createRequire(import.meta.url);
  const server = require(path.resolve('.build/server.cjs'));

  // Root-relative URLs (/assets/...) so the same files work from /work/<slug>/ as from /
  const files = Object.keys(client.metafile.outputs).map((f) => path.basename(f));
  const js = files.find((f) => f.endsWith('.js'));
  const css = files.find((f) => f.endsWith('.css'));
  const template = (await readFile('src/index.html', 'utf8')).replace('<!--css-->', `<link rel="stylesheet" href="/assets/${css}">`);
  const app = server.render(); // one render: every page has the same body, so any of them hydrates

  const pages = server.pages();
  for (const page of pages) {
    const html = template
      .replace('<!--head-->', server.headTags(page))
      .replace('<!--app-->', app)
      .replace('<!--js-->', `<script type="module" src="/assets/${js}"></script>`);
    const dir = path.join(outdir, page.path);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'index.html'), html);
  }

  // GitHub Pages serves 404.html for any address it doesn't have. It needs no JavaScript.
  const notFound = template
    .replace('<!--head-->', '<title>Page not found | Atharv Shinde</title>\n<meta name="robots" content="noindex">')
    .replace('<!--app-->', server.renderNotFound())
    .replace('<!--js-->', '');
  await writeFile(path.join(outdir, '404.html'), notFound);
  await writeFile(path.join(outdir, 'sitemap.xml'), server.sitemap(pages[0].origin, pages.map((p) => p.path)));

  await cp('public', outdir, { recursive: true });
  return { js, css, pages: pages.map((p) => p.path) };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { js, css, pages } = await build();
  console.log(`Built dist/ with ${js}, ${css} and ${pages.length} pages`);
}
