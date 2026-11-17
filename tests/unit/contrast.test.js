import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// The site promises WCAG AA text contrast in every palette. This reads the real tokens.css,
// applies its cascade for each painting and time of day, and measures every text colour pair used.
const css = readFileSync('src/styles/tokens.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const blocks = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selectors, body]) => ({
  selectors: selectors.split(',').map((s) => s.trim()),
  decls: [...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+)/g)].map(([, name, value]) => [name, value.trim()]),
}));

/** Specificity of a ":root[data-x="y"]..." selector if it applies to these attributes, else -1. */
function specificity(selector, attrs) {
  const conditions = [...selector.matchAll(/\[data-(\w+)="(\w+)"\]/g)];
  if (selector.replace(/\[data-\w+="\w+"\]/g, '') !== ':root') return -1;
  return conditions.every(([, key, value]) => attrs[key] === value) ? 1 + conditions.length : -1;
}

function tokensFor(attrs) {
  const won = {};
  for (const block of blocks) {
    const spec = Math.max(...block.selectors.map((s) => specificity(s, attrs)));
    if (spec < 0) continue;
    for (const [name, value] of block.decls) if (!won[name] || spec >= won[name].spec) won[name] = { value, spec };
  }
  const resolve = (value) => value.replace(/var\((--[\w-]+)\)/g, (_, name) => resolve(won[name].value));
  return Object.fromEntries(Object.entries(won).map(([name, { value }]) => [name, resolve(value)]));
}

function luminance(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// [text, background]: every pairing the stylesheets use for text
const pairs = [
  ['--ink', '--paper'], ['--ink', '--card'], ['--ink-2', '--paper'], ['--ink-2', '--card'],
  ['--muted', '--paper'], ['--muted', '--card'], ['--paper', '--ink'],
  ['--on-accent', '--accent'], ['--on-accent', '--accent-2'], ['--on-accent', '--accent-3'], ['--on-accent', '--accent-4'],
  ['--accent-2-ink', '--card'],
];

for (const art of ['coast', 'fields']) {
  for (const scene of ['day', 'golden', 'night']) {
    const theme = scene === 'night' ? 'night' : 'day';
    test(`text contrast is at least 4.5:1 in ${art}, ${scene}`, () => {
      const tokens = tokensFor({ art, scene, theme });
      for (const [text, background] of pairs) {
        const ratio = contrast(tokens[text], tokens[background]);
        assert.ok(ratio >= 4.5, `${text} on ${background}: ${ratio.toFixed(2)}:1 (${tokens[text]} on ${tokens[background]})`);
      }
    });
  }
}

test('focus rings and icons stand out from the page at 3:1 or better', () => {
  for (const art of ['coast', 'fields']) {
    for (const theme of ['day', 'night']) {
      const tokens = tokensFor({ art, scene: theme, theme });
      for (const ring of ['--accent-ink', '--accent-2-ink']) {
        const ratio = contrast(tokens[ring], tokens['--paper']);
        assert.ok(ratio >= 3, `${ring} on --paper in ${art} ${theme}: ${ratio.toFixed(2)}:1`);
      }
    }
  }
});
