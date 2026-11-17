import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paddyRows } from '../../src/lib/paddy';
import { palmGeometry } from '../../src/lib/palm';

// The paintings are computed, not drawn by hand, and rendered twice: once on Node at build time
// and once in the browser during hydration. Both renders must produce the same numbers.

test('the same seed draws the same palm, so server and browser markup match', () => {
  assert.deepEqual(palmGeometry({ seed: 3, height: 280 }), palmGeometry({ seed: 3, height: 280 }));
  assert.notDeepEqual(palmGeometry({ seed: 3 }), palmGeometry({ seed: 4 }));
});

test('paddy rows come out the same every time', () => {
  assert.deepEqual(paddyRows(), paddyRows());
});

test('rows recede: further rows are smaller and closer together', () => {
  const rows = paddyRows();
  for (let k = 1; k < rows.length; k++) {
    assert.ok(rows[k].y > rows[k - 1].y && rows[k].s > rows[k - 1].s, `row ${k} is nearer than row ${k - 1}`);
  }
  const gaps = rows.slice(1).map((r, k) => r.y - rows[k].y);
  assert.ok(gaps.at(-1) > gaps[0], 'rows spread out toward the viewer');
});

test('seedlings stand only where planted() allows: the field ends at the farmer', () => {
  const all = paddyRows();
  const part = paddyRows({ planted: (column) => column <= 13 });
  assert.ok(part.some((row, k) => row.xs.length < all[k].xs.length), 'something is left unplanted');
  part.forEach((row, k) => assert.deepEqual(row.xs, all[k].xs.slice(0, row.xs.length), `row ${k} is planted from the left`));
  assert.ok(paddyRows({ planted: () => false }).every((row) => row.xs.length === 0));
});

test('seedlings stay inside the painting', () => {
  for (const row of paddyRows()) for (const x of row.xs) assert.ok(x >= -20 && x <= 1020);
});
