import { test } from 'node:test';
import assert from 'node:assert/strict';
import { projects, projectBySlug } from '../../src/content/projects';
import { skillGroups } from '../../src/content/skills';
import { experience, academics, about } from '../../src/content/history';
import * as site from '../../src/content/site';

// Every word on the page lives in src/content. These tests keep it consistent and honest.
const chips = skillGroups.flatMap((g) => g.chips.map(([id]) => id));
const skillIds = new Set(chips);
const proofItems = [...experience, ...academics].filter((item) => item.proof?.length);

test('skill ids are unique', () => {
  assert.equal(skillIds.size, chips.length);
});

test('every skill a project or a proof names exists as a chip', () => {
  for (const p of projects) for (const s of p.skills) assert.ok(skillIds.has(s), `${p.slug} names unknown skill "${s}"`);
  for (const item of proofItems) for (const s of item.proof) assert.ok(skillIds.has(s), `${item.id} names unknown skill "${s}"`);
});

test('every listed skill is backed by a project or by proof in Academics or Experience', () => {
  for (const id of skillIds) {
    const used = projects.some((p) => p.skills.includes(id)) || proofItems.some((item) => item.proof.includes(id));
    assert.ok(used, `the "${id}" chip lights up nothing`);
  }
});

test('project slugs are unique and safe in a URL', () => {
  assert.equal(Object.keys(projectBySlug).length, projects.length);
  for (const p of projects) assert.match(p.slug, /^[a-z0-9-]+$/);
});

test('every project has what its card, its case study and its own page need', () => {
  const sizes = new Set(['wide', 'side', 'full', 'narrow']);
  const colors = new Set(['c-1', 'c-2', 'c-3', 'c-4', 'c-ink']);
  const titles = new Set();
  for (const p of projects) {
    assert.ok(p.title && p.lead && p.pageTitle, p.slug);
    assert.ok(sizes.has(p.size) && colors.has(p.color), `${p.slug}: size or colour`);
    assert.equal(p.strip.length, 2, `${p.slug}: strip`);
    assert.ok(p.case.lede && p.case.sections.length, `${p.slug}: case study`);
    assert.ok(!titles.has(p.pageTitle), `${p.slug}: page title used twice`);
    titles.add(p.pageTitle);
  }
});

test('work headed for a paper shows the problem, not the method’s results', () => {
  const results = /\d\s?%|\b0\.\d|\bAUROC\b|\bF1\b|\baccuracy\b|\bprecision\b|\brecall\b/i;
  for (const slug of ['thesis', 'adaptfedmlp']) {
    const p = projectBySlug[slug];
    assert.ok(!p.case.score && !p.case.metrics, `${slug} has a results table`);
    assert.doesNotMatch(JSON.stringify(p), results, `${slug} mentions a result`);
    assert.match(p.note, /Paper in preparation/);
  }
});

test('only the public contact details are published', () => {
  const everything = JSON.stringify({ projects, skillGroups, experience, academics, about, site });
  assert.match(site.person.email, /@gmail\.com$/);
  assert.doesNotMatch(everything, /iith\.ac\.in/, 'the institute email stays private');
  assert.doesNotMatch(everything, /\+91|\b\d{5}\s?\d{5}\b/, 'no phone number on the public site');
});
