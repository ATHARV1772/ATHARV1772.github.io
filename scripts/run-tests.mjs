// Runs the unit tests in tests/unit with Node's built-in test runner (no test framework to install).
// The source is written for a bundler (JSX, imports without file extensions), so esbuild bundles
// each test file first. npm packages stay external and load from node_modules as usual.
// Run: npm test
import * as esbuild from 'esbuild';
import { readdir, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const dir = 'tests/unit';
const out = '.build/tests';
const files = (await readdir(dir)).filter((f) => /\.test\.jsx?$/.test(f)).sort();

await rm(out, { recursive: true, force: true });
await esbuild.build({
  entryPoints: files.map((f) => path.join(dir, f)),
  outdir: out,
  outExtension: { '.js': '.mjs' },
  bundle: true,
  platform: 'node',
  format: 'esm',
  jsx: 'automatic',
  packages: 'external',
  loader: { '.css': 'empty' },
  logLevel: 'warning',
});

const bundled = files.map((f) => path.join(out, f.replace(/\.jsx?$/, '.mjs')));
const run = spawnSync(process.execPath, ['--test', '--test-reporter=spec', ...bundled], { stdio: 'inherit' });
process.exit(run.status ?? 1);
