// Rows of rice seedlings standing in a flooded paddy, in perspective.
// Columns run toward a vanishing point; rows get closer together with distance.
// Returns positions only: each seedling is one shared shape (TUFT) placed with <use>.

/** One seedling, 23 units tall, base at (0, 0): four blades. */
export const TUFT =
  'M-2 0Q-1.8 -13 0 -23Q1.8 -13 2 0Z' +
  'M-1.6 0Q-7 -9 -14 -16Q-4.5 -6 1 0Z' +
  'M1.6 0Q7 -9 14 -16Q4.5 -6 -1 0Z' +
  'M-1 0Q-4 -11 -6 -20Q-1.5 -10 0.8 0Z';

/** `planted(column, y)` decides which spots have a seedling; column numbers grow left to right. */
export function paddyRows({ top = 566, bottom = 800, vpX = 500, vpY = 470, rows = 10, spacing = 70, pathHalf = () => 0, planted = () => true } = {}) {
  const out = [];
  for (let k = 0; k < rows; k++) {
    const y = Math.round(top + (bottom - top) * Math.pow((k + 1) / rows, 1.35));
    const depth = (y - vpY) / (bottom - vpY);
    const t = (y - top) / (bottom - top);
    const s = +(0.35 + 1.75 * Math.pow(t, 1.25)).toFixed(2); // seedlings grow quickly as rows come closer
    const xs = [];
    for (let j = -40; j <= 50; j++) { // wide enough that even the far rows reach both edges
      const x = Math.round(vpX + (j * spacing + 30 - vpX) * depth);
      if (x < -20 || x > 1020) continue;
      if (Math.abs(x - vpX) < pathHalf(y) + 9 * s) continue;
      if (!planted(j, y)) continue;
      xs.push(x);
    }
    out.push({ y, s, xs });
  }
  return out;
}
