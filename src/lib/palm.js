// Coconut palm geometry from a few numbers. Deterministic (seeded), so the server
// and the browser draw exactly the same palm and hydration matches.

function rng(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
const r1 = (n) => Math.round(n * 10) / 10;
const pt = (p) => `${r1(p[0])} ${r1(p[1])}`;

function quad(p0, p1, p2) {
  const at = (t) => [
    (1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0],
    (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1],
  ];
  const tangent = (t) => {
    const dx = 2 * (1 - t) * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
    const dy = 2 * (1 - t) * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
    const l = Math.hypot(dx, dy) || 1;
    return [dx / l, dy / l];
  };
  return { at, tangent };
}

/**
 * Base of the trunk is at (0, 0); the crown sits at (lean, -height).
 * Returns path strings for the trunk, its rings, the shaded and lit leaflets, the frond spines and the coconuts.
 */
export function palmGeometry({ height = 300, lean = 40, bend = 30, base = 16, top = 8, fronds = 11, frondLen = 120, leaf = 26, seed = 1 } = {}) {
  const rand = rng(seed);
  const trunkCurve = quad([0, 0], [lean * 0.45 + bend, -height * 0.55], [lean, -height]);

  // Trunk: offset the curve both ways by a tapering half-width
  const left = [], right = [];
  const N = 28;
  for (let i = 0; i <= N; i++) {
    const t = i / N, p = trunkCurve.at(t), d = trunkCurve.tangent(t), w = (base + (top - base) * t) / 2;
    left.push([p[0] - d[1] * w, p[1] + d[0] * w]);
    right.push([p[0] + d[1] * w, p[1] - d[0] * w]);
  }
  const trunk = 'M' + left.map(pt).join('L') + 'L' + right.reverse().map(pt).join('L') + 'Z';

  // Rings: short slanted strokes across the trunk
  let rings = '';
  const ringCount = Math.max(6, Math.floor(height / 11));
  for (let i = 1; i < ringCount; i++) {
    const t = i / ringCount, p = trunkCurve.at(t), d = trunkCurve.tangent(t), w = (base + (top - base) * t) / 2;
    rings += `M${pt([p[0] - d[1] * w, p[1] + d[0] * w])}L${pt([p[0] + d[1] * w * 0.6, p[1] - d[0] * w * 0.6 + 2.5])}`;
  }

  // Fronds fan out over the top and droop at the sides; two more hang below the crown
  const crown = trunkCurve.at(1);
  const angles = [];
  for (let i = 0; i < fronds; i++) angles.push(-Math.PI + (Math.PI * (i + 0.5)) / fronds + (rand() - 0.5) * 0.22);
  angles.push(Math.PI * 0.8, Math.PI * 0.2);

  let dark = '', lit = '', spines = '';
  for (const a of angles) {
    const hanging = a > 0;
    const L = frondLen * (0.82 + rand() * 0.3) * (hanging ? 0.75 : 1);
    const side = Math.cos(a);
    const droop = hanging ? L * 0.35 : L * (0.15 + 0.55 * side * side);
    const tip = [crown[0] + Math.cos(a) * L, crown[1] + Math.sin(a) * L + droop];
    const mid = [crown[0] + Math.cos(a) * L * 0.55, crown[1] + Math.sin(a) * L * 0.55 - L * 0.22];
    const spine = quad(crown, mid, tip);
    spines += `M${pt(crown)}Q${pt(mid)} ${pt(tip)}`;
    for (let k = 1; k <= 12; k++) {
      const t = 0.06 + (k / 12) * 0.9;
      const p = spine.at(t), d = spine.tangent(t);
      const len = leaf * Math.pow(Math.sin(Math.PI * Math.min(t * 1.08, 1)), 0.7) * (1 - 0.3 * t);
      for (const s of [1, -1]) {
        // Rotate the spine direction about 70 degrees to each side, then let gravity pull the leaflet down
        const ca = Math.cos(1.2 * s), sa = Math.sin(1.2 * s);
        let vx = d[0] * ca - d[1] * sa, vy = d[0] * sa + d[1] * ca + 0.75;
        const vl = Math.hypot(vx, vy) || 1;
        vx /= vl; vy /= vl;
        const tipL = [p[0] + vx * len, p[1] + vy * len];
        const b1 = [p[0] - d[0] * 2.2, p[1] - d[1] * 2.2], b2 = [p[0] + d[0] * 2.2, p[1] + d[1] * 2.2];
        const tri = `M${pt(b1)}L${pt(tipL)}L${pt(b2)}Z`;
        // Leaflets pointing up catch the light; the rest stay in shade
        if (vy < 0.55) lit += tri; else dark += tri;
      }
    }
  }

  const nuts = [[-6, 6], [5, 8], [-1, 13]].map(([dx, dy]) => [crown[0] + dx, crown[1] + dy]);
  return { trunk, rings, dark, lit, spines, nuts, crown };
}
