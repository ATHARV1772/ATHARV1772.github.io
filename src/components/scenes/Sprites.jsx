import { memo } from 'react';
import { palmGeometry } from '../../lib/palm';
import { TUFT } from '../../lib/paddy';

// Shapes drawn once and reused across every painting with <use>: five palms and one rice seedling.
// Each palm is 300 units tall with its base at (0, 0); <Palm> scales and places it.
export const PALM_HEIGHT = 300;
const variants = {
  a: { lean: 42, bend: 22, base: 14, top: 7, frondLen: 86, leaf: 20, fronds: 11, seed: 3 },
  b: { lean: -46, bend: -18, base: 14, top: 7, frondLen: 84, leaf: 20, fronds: 11, seed: 11 },
  c: { lean: 12, bend: 8, base: 13, top: 7, frondLen: 80, leaf: 19, fronds: 11, seed: 21 },
  d: { lean: 96, bend: 52, base: 15, top: 8, frondLen: 88, leaf: 21, fronds: 12, seed: 7 },
  e: { lean: -100, bend: -50, base: 15, top: 8, frondLen: 88, leaf: 21, fronds: 12, seed: 13 },
};

function PalmShape({ id, params }) {
  const g = palmGeometry({ height: PALM_HEIGHT, ...params });
  return (
    <g id={id}>
      <path d={g.trunk} style={{ fill: 'var(--palm-trunk)' }} />
      <path d={g.rings} fill="none" strokeWidth="1.6" style={{ stroke: 'var(--palm-ring)' }} />
      <path d={g.dark} style={{ fill: 'var(--palm-leaf)' }} />
      <path d={g.spines} fill="none" strokeWidth="2.4" strokeLinecap="round" style={{ stroke: 'var(--palm-leaf)' }} />
      <path d={g.lit} style={{ fill: 'var(--palm-hi)' }} />
      {g.nuts.map(([x, y], i) => <circle key={i} cx={Math.round(x)} cy={Math.round(y)} r="5" style={{ fill: 'var(--palm-nut)' }} />)}
    </g>
  );
}

function Sprites() {
  return (
    <svg className="sprites" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        {Object.entries(variants).map(([k, params]) => <PalmShape key={k} id={`palm-${k}`} params={params} />)}
        <path id="tuft" d={TUFT} />
      </defs>
    </svg>
  );
}

// Shared shapes, drawn once: memo keeps them from ever re-rendering
export default memo(Sprites);
