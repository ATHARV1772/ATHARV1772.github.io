import { memo } from 'react';
import Palm from './Palm';
import Farmer from './Farmer';
import { paddyRows } from '../../lib/paddy';

// The paddy painting: hills and a farm on the horizon, green rice in the middle distance,
// and a flooded paddy in front that mirrors the sky, planted in rows, with a bund path leading in.
const PATH_TOP = 566, PATH_BOTTOM = 800;
const pathHalf = (y) => 6 + 66 * ((y - PATH_TOP) / (PATH_BOTTOM - PATH_TOP));
const FARMER_Y = 662;
// Planting is half done: columns up to FRONTIER are planted, the farmer is working down the next one
// (its near end is done), and everything to the right is still bare water mirroring the sky.
const FRONTIER = 13;
const planted = (j, y) => j <= FRONTIER || (j === FRONTIER + 1 && y > FARMER_Y + 6);
const rows = paddyRows({ top: PATH_TOP, bottom: PATH_BOTTOM, vpX: 500, vpY: 470, rows: 11, spacing: 56, pathHalf, planted });
const behind = rows.filter((r) => r.y < FARMER_Y), front = rows.filter((r) => r.y >= FARMER_Y);

const stars = [[40, 70, 1.4], [110, 150, 1.1], [160, 40, 1.2], [230, 110, 1.5], [300, 40, 1.1], [350, 190, 1], [410, 90, 1.3], [470, 30, 1.1], [530, 140, 1.4], [600, 60, 1.2], [640, 220, 1], [780, 50, 1.3], [820, 170, 1.1], [870, 90, 1.4], [930, 40, 1.1], [960, 200, 1.2], [60, 240, 1], [560, 260, 1]];
const fireflies = [[120, 600, 0], [214, 700, -1.1], [350, 640, -2.2], [424, 744, -0.6], [600, 600, -1.7], [700, 712, -2.6], [784, 640, -0.3], [860, 756, -1.4], [932, 610, -2.9], [260, 770, -0.9]];
const bands = [[446, 461, 'var(--field-1)'], [461, 480, 'var(--field-2)'], [480, 504, 'var(--field-1)'], [504, 532, 'var(--field-2)'], [532, 566, 'var(--field-3)']];

// One row of seedlings and their reflections; rows sway one after another, like a wave coming in
function Row({ row, i }) {
  return (
    <g className="sway" style={{ animationDelay: `${-(i * 0.32).toFixed(2)}s`, fill: 'var(--seedling)' }}>
      <g opacity=".3">{row.xs.map((x) => <use key={x} href="#tuft" transform={`translate(${x} ${row.y + 1}) scale(${row.s} ${-row.s / 2})`} />)}</g>
      {row.xs.map((x) => <use key={x} href="#tuft" transform={`translate(${x} ${row.y}) scale(${row.s})`} />)}
    </g>
  );
}

function FieldsScene() {
  return (
    <svg className="scene-fields" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice" role="img" aria-labelledby="scene-title-f">
      <title id="scene-title-f">Flat painting of paddy fields: a flooded field planted in rows mirrors the sky, a farmer plants seedlings, and green rice ripples in the wind below hills and a farmhouse. Its sky follows the time of day where you are.</title>
      <defs>
        <linearGradient id="f-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={{ stopColor: 'var(--sky1)' }} /><stop offset=".6" style={{ stopColor: 'var(--sky2)' }} /><stop offset="1" style={{ stopColor: 'var(--sky3)' }} /></linearGradient>
        <linearGradient id="f-sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={{ stopColor: 'var(--sun1)' }} /><stop offset="1" style={{ stopColor: 'var(--sun2)' }} /></linearGradient>
        <linearGradient id="f-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={{ stopColor: 'var(--sky3)' }} /><stop offset="1" style={{ stopColor: 'var(--sky2)' }} /></linearGradient>
        <linearGradient id="f-gust" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFFFFF" stopOpacity="0" /><stop offset=".5" stopColor="#FFFFFF" stopOpacity=".55" /><stop offset="1" stopColor="#FFFFFF" stopOpacity="0" /></linearGradient>
        <pattern id="f-rice-s" width="14" height="8" patternUnits="userSpaceOnUse"><path d="M3 7.5 L4.5 2.5 L6 7.5 M10 4 L11 0.5 L12 4" fill="none" strokeWidth="1.2" strokeLinejoin="round" style={{ stroke: 'var(--field-tex)' }} /></pattern>
        <pattern id="f-rice-m" width="22" height="13" patternUnits="userSpaceOnUse"><path d="M3 12 L6 4 M7.5 12 V2 M12 12 L9 4 M16 6.5 L18 1 M19 6.5 L18.5 0.5" fill="none" strokeWidth="1.6" strokeLinecap="round" style={{ stroke: 'var(--field-tex)' }} /></pattern>
        <clipPath id="f-cl-mid"><rect x="0" y="446" width="1000" height="120" /></clipPath>
      </defs>

      <rect width="1000" height="452" fill="url(#f-sky)" />
      <g style={{ opacity: 'var(--moon-op)' }} fill="#FFF6E0">
        {stars.map(([x, y, r]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />)}
        <path d="M200 52 L202.5 61.5 L212 64 L202.5 66.5 L200 76 L197.5 66.5 L188 64 L197.5 61.5 Z" />
        <circle cx="700" cy="120" r="22" fill="#F7F0DC" /><circle cx="708" cy="114" r="5" fill="#E8DFC4" /><circle cx="692" cy="128" r="3.5" fill="#E8DFC4" />
      </g>
      <circle cx="470" cy="352" r="56" fill="url(#f-sun)" style={{ opacity: 'var(--sun-op)' }} />
      <g style={{ opacity: 'var(--cloud-op)' }}>
        <path d="M698 338 a40 40 0 0 1 36 -48 a52 52 0 0 1 70 -54 a58 58 0 0 1 104 26 a40 40 0 0 1 48 52 a28 28 0 0 1 12 24 Z" style={{ fill: 'var(--cloud-shade)' }} />
        <path d="M690 330 a40 40 0 0 1 36 -48 a52 52 0 0 1 70 -54 a58 58 0 0 1 104 26 a40 40 0 0 1 48 52 a28 28 0 0 1 12 24 Z" style={{ fill: 'var(--cloud)' }} />
        <path d="M126 196 a24 24 0 0 1 28 -26 a32 32 0 0 1 58 -10 a26 26 0 0 1 46 18 a20 20 0 0 1 20 18 Z" style={{ fill: 'var(--cloud-shade)' }} />
        <path d="M120 190 a24 24 0 0 1 28 -26 a32 32 0 0 1 58 -10 a26 26 0 0 1 46 18 a20 20 0 0 1 20 18 Z" style={{ fill: 'var(--cloud)' }} />
      </g>
      <path className="birds" d="M560 196 q7 -7 14 0 q7 -7 14 0 M600 178 q5 -5 10 0 q5 -5 10 0 M630 204 q6 -6 12 0 q6 -6 12 0" fill="none" stroke="#24324F" strokeWidth="2" strokeLinecap="round" style={{ opacity: 'var(--plane-op)' }} />

      <path d="M0 372 C90 340 170 318 250 330 C330 342 380 368 450 362 C520 356 560 316 640 306 C720 296 790 330 860 334 C920 338 960 322 1000 318 V470 H0 Z" style={{ fill: 'var(--hill-far)' }} />
      <path d="M0 420 C120 398 220 394 330 408 C430 420 520 404 620 398 C730 392 860 410 1000 402 V470 H0 Z" style={{ fill: 'var(--hill-mid)' }} />

      {/* Horizon: trees, three palms and a farmhouse drawn in one consistent oblique view */}
      <g style={{ fill: 'var(--tree)' }}>
        <circle cx="30" cy="436" r="13" /><circle cx="54" cy="432" r="16" /><circle cx="80" cy="438" r="11" /><circle cx="196" cy="434" r="14" /><circle cx="222" cy="440" r="10" />
        <circle cx="418" cy="438" r="12" /><circle cx="442" cy="434" r="15" /><circle cx="590" cy="438" r="12" /><circle cx="612" cy="434" r="14" />
        <circle cx="830" cy="434" r="15" /><circle cx="856" cy="439" r="11" /><circle cx="948" cy="436" r="14" /><circle cx="974" cy="432" r="16" />
      </g>
      <Palm variant="c" x={132} y={448} height={92} />
      <Palm variant="c" x={702} y={448} height={110} flip />
      <Palm variant="c" x={906} y={448} height={84} />
      <g className="farmhouse">
        <polygon points="276,433 305,407 334,433" style={{ fill: 'var(--roof)' }} />
        <polygon points="281,431 305,411.5 329,431 329,450 281,450" style={{ fill: 'var(--wall)' }} />
        <polygon points="329,431 353,423 353,442 329,450" style={{ fill: 'var(--wall)' }} />
        <polygon points="329,431 353,423 353,442 329,450" fill="#000" opacity=".2" />
        <polygon points="305,407 329,399 358,425 334,433" style={{ fill: 'var(--roof)' }} />
        <polygon points="305,407 329,399 358,425 334,433" fill="#000" opacity=".18" />
        <rect x="287" y="435" width="9" height="8" style={{ fill: 'var(--window)' }} />
        <rect x="303" y="438" width="10" height="12" style={{ fill: 'var(--trunk)' }} />
        <polygon points="336,434 346,430.7 346,438.7 336,442" style={{ fill: 'var(--window)' }} />
      </g>

      {/* Middle distance: green rice in strips, rippling, with a gust of light running across */}
      {bands.map(([a, b, fill]) => <rect key={a} x="0" y={a} width="1000" height={b - a} style={{ fill }} />)}
      <g clipPath="url(#f-cl-mid)">
        <g className="sway"><rect x="-40" y="446" width="1080" height="34" fill="url(#f-rice-s)" opacity=".55" /></g>
        <g className="sway s2"><rect x="-40" y="480" width="1080" height="86" fill="url(#f-rice-m)" opacity=".55" /></g>
        <g style={{ opacity: 'var(--gust-op)' }}><rect className="gust" x="-460" y="446" width="380" height="120" fill="url(#f-gust)" /><rect className="gust g2" x="-460" y="446" width="300" height="120" fill="url(#f-gust)" /></g>
      </g>
      <g style={{ fill: 'var(--riser)' }}><rect y="460" width="1000" height="1.6" /><rect y="479" width="1000" height="2" /><rect y="503" width="1000" height="2.6" /><rect y="531" width="1000" height="3.2" /></g>

      {/* Foreground: the flooded paddy */}
      <rect x="0" y="566" width="1000" height="234" fill="url(#f-water)" />
      <path d="M40 600 H260 M640 590 H900 M120 650 H330 M700 676 H960" strokeWidth="3" strokeLinecap="round" opacity=".35" style={{ stroke: 'var(--cloud)' }} />
      <g style={{ opacity: 'var(--moon-op)' }} stroke="#FFF6E0" strokeWidth="2.5" strokeLinecap="round"><path d="M684 590 H716 M690 600 H710 M680 616 H720 M692 628 H708" /></g>
      <rect x="0" y="561" width="1000" height="6" style={{ fill: 'var(--riser)' }} />
      <rect x="0" y="560" width="1000" height="1.6" style={{ fill: 'var(--bund)' }} />
      <polygon points="488,566 512,566 600,800 400,800" style={{ fill: 'var(--field-2)' }} />
      <polygon points="494,566 506,566 572,800 428,800" style={{ fill: 'var(--earth)' }} />
      <path d="M498 600 h5 M494 640 h9 M489 690 h14 M482 750 h20 M512 720 h12" strokeWidth="2.4" strokeLinecap="round" opacity=".35" style={{ stroke: 'var(--riser)' }} />

      {behind.map((row, i) => <Row key={row.y} row={row} i={i} />)}
      <Farmer x={676} y={FARMER_Y} scale={1.25} />
      {front.map((row, i) => <Row key={row.y} row={row} i={i + behind.length} />)}

      <g style={{ opacity: 'var(--lights-op)' }} fill="#FFE58A">
        {fireflies.map(([x, y, d]) => (
          <g key={`${x}-${y}`} className="ff" style={{ animationDelay: `${d}s` }}><circle cx={x} cy={y} r="7" opacity=".25" /><circle cx={x} cy={y} r="2.4" /></g>
        ))}
      </g>
    </svg>
  );
}

// A static drawing: memo keeps it from re-rendering when its parent does (the hero re-renders as it enters or leaves the screen)
export default memo(FieldsScene);
