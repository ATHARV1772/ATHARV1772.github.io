import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { clockText, phaseAt } from '../../src/lib/time';
import reducer, { syncFromDocument, selectScene, selectTheme } from '../../src/store/uiSlice';

// An inline script in index.html paints the theme before React loads; after hydration the store takes over.
// If the two ever disagreed about the time of day, the page would flash from one sky to another.
// These tests run the real script from the template against a fake document, storage and clock.
const template = readFileSync('src/index.html', 'utf8');
const script = template.match(/<script>([\s\S]*?)<\/script>/)[1];

function firstPaint({ hours = 12, minutes = 0, saved = {}, blocked = false } = {}) {
  const root = { dataset: {}, className: '' };
  const localStorage = {
    getItem(key) {
      if (blocked) throw new Error('storage blocked');
      return key in saved ? saved[key] : null;
    },
  };
  class FixedDate {
    getHours() { return hours; }
    getMinutes() { return minutes; }
  }
  vm.runInNewContext(script, { document: { documentElement: root }, localStorage, Date: FixedDate });
  return { ...root.dataset, className: root.className };
}

test('in Auto, the first paint and the store agree on the sky for every minute of the day', () => {
  for (let m = 0; m < 24 * 60; m++) {
    const painted = firstPaint({ hours: Math.floor(m / 60), minutes: m % 60 });
    const state = { ui: reducer(undefined, syncFromDocument({ art: painted.art, mode: painted.mode, minutes: m, motion: true })) };
    assert.equal(painted.scene, selectScene(state), `scene at ${clockText(m)}`);
    assert.equal(painted.theme, selectTheme(state), `theme at ${clockText(m)}`);
  }
});

test('a saved choice wins over the clock', () => {
  const painted = firstPaint({ hours: 12, saved: { art: 'fields', mode: 'night' } });
  assert.deepEqual(painted, { art: 'fields', mode: 'night', scene: 'night', theme: 'night', motion: 'on', className: 'js' });
});

test('golden hour keeps the light page; only night turns it dark', () => {
  assert.equal(firstPaint({ hours: 12, saved: { mode: 'golden' } }).theme, 'day');
  assert.equal(firstPaint({ hours: 17, minutes: 30 }).scene, 'golden');
  assert.equal(firstPaint({ hours: 17, minutes: 30 }).theme, 'day');
});

test('an unknown saved value falls back to the defaults', () => {
  const painted = firstPaint({ hours: 9, saved: { art: 'mars', mode: 'dusk' } });
  assert.equal(painted.art, 'coast');
  assert.equal(painted.mode, 'auto');
  assert.equal(painted.scene, phaseAt(9 * 60));
});

test('with storage blocked (some private windows), the page still paints by the clock', () => {
  const painted = firstPaint({ hours: 22, blocked: true });
  assert.deepEqual(painted, { art: 'coast', mode: 'auto', scene: 'night', theme: 'night', motion: 'on', className: 'js' });
});

test('a paused painting stays paused from the first frame', () => {
  assert.equal(firstPaint({ saved: { motion: 'off' } }).motion, 'off');
  assert.equal(firstPaint({ saved: { motion: 'sideways' } }).motion, 'on');
});
