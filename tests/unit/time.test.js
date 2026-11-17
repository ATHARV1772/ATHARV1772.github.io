import { test } from 'node:test';
import assert from 'node:assert/strict';
import { phaseAt, clockText, localMinutes } from '../../src/lib/time';

const at = (h, m = 0) => h * 60 + m;

test('golden hour around sunrise and sunset, day between, night after dark', () => {
  const expected = [
    [at(0), 'night'], [at(5, 29), 'night'], [at(5, 30), 'golden'], [at(6, 59), 'golden'],
    [at(7), 'day'], [at(12), 'day'], [at(16, 29), 'day'], [at(16, 30), 'golden'],
    [at(18, 59), 'golden'], [at(19), 'night'], [at(23, 59), 'night'],
  ];
  for (const [minutes, phase] of expected) assert.equal(phaseAt(minutes), phase, `at ${clockText(minutes)}`);
});

test('before the clock is known (the server render), the scene is day', () => {
  assert.equal(phaseAt(null), 'day');
  assert.equal(phaseAt(undefined), 'day');
});

test('the clock reads as zero-padded 24-hour time', () => {
  assert.equal(clockText(at(7, 5)), '07:05');
  assert.equal(clockText(at(23, 59)), '23:59');
  assert.equal(clockText(0), '00:00');
  assert.equal(clockText(null), '--:--');
});

test('local minutes count from local midnight', () => {
  assert.equal(localMinutes(new Date(2026, 10, 17, 16, 45)), at(16, 45));
  assert.equal(localMinutes(new Date(2026, 10, 17, 0, 0)), 0);
});
