import Palm from './scenes/Palm';

// Scenery between sections. Each strip is 2400 x 300 and pans as you scroll (components/Vista.jsx).
// Every colour is a custom property, so the strips follow the same time of day as the hero:
// golden hour, day or night (styles/tokens.css). Palms inherit the scene's palm colours.

function rng(seed) {
  let t = seed >>> 0;
  return () => { t += 0x6d2b79f5; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; };
}
const v = (name) => ({ fill: `var(${name})` });
const stopOf = (name) => ({ stopColor: `var(${name})` });
const stars = (seed, count, maxY) => { const r = rng(seed); return Array.from({ length: count }, () => [Math.round(r() * 2400), Math.round(8 + r() * maxY), r() > 0.8 ? 1.6 : 1]); };

/* ---------------- Coast: the beach ---------------- */
const beachPalms = [[90, 296, 250, 'd'], [230, 300, 210, 'a'], [1130, 298, 236, 'e'], [1960, 300, 226, 'a'], [2140, 298, 190, 'c']];
const spray = (() => { const r = rng(4); return Array.from({ length: 70 }, () => [700 + r() * 380, 118 + r() * 40, 1 + r() * 2.6]); })();
const beachStars = stars(21, 50, 150);

export function CoastBeach() {
  return (
    <svg className="vista-art vista-coast" viewBox="0 0 2400 300" width="2400" height="300" preserveAspectRatio="xMinYMid slice">
      <defs>
        <linearGradient id="vb-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={stopOf('--sky1')} /><stop offset=".6" style={stopOf('--sky2')} /><stop offset="1" style={stopOf('--sky3')} /></linearGradient>
        <linearGradient id="vb-wave" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={stopOf('--wave')} /><stop offset="1" style={stopOf('--sea')} /></linearGradient>
        <linearGradient id="vb-sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={stopOf('--deck')} /><stop offset="1" style={stopOf('--slab-2')} /></linearGradient>
        <linearGradient id="vb-sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={stopOf('--sun1')} /><stop offset="1" style={stopOf('--sun2')} /></linearGradient>
      </defs>
      <rect width="2400" height="214" fill="url(#vb-sky)" />
      <g style={{ opacity: 'var(--moon-op)' }} fill="#FFF6E0">
        {beachStars.map(([x, y, r]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />)}
        <circle cx="1820" cy="62" r="22" fill="#F7F0DC" /><circle cx="1828" cy="56" r="5" fill="#E8DFC4" />
      </g>
      {/* Golden hour: the sun sits on the horizon; the sea band covers its lower half */}
      <circle cx="1480" cy="196" r="58" fill="url(#vb-sun)" style={{ opacity: 'var(--sun-op)' }} />
      <g style={{ opacity: 'var(--cloud-op)' }}>
        <g style={v('--cloud')}><path d="M140 176 a18 18 0 0 1 22 -18 a24 24 0 0 1 44 -6 a20 20 0 0 1 36 14 a14 14 0 0 1 14 10 Z" /><path d="M1460 120 a20 20 0 0 1 24 -20 a28 28 0 0 1 50 -8 a22 22 0 0 1 40 16 a16 16 0 0 1 16 12 Z" /><path d="M2210 178 a14 14 0 0 1 18 -14 a20 20 0 0 1 36 -4 a16 16 0 0 1 28 12 Z" /></g>
        <g style={v('--cloud-shade')}><rect x="140" y="174" width="116" height="3" /><rect x="1460" y="118" width="130" height="3" /><rect x="2210" y="176" width="86" height="3" /></g>
      </g>
      <path className="birds" d="M600 70 q7 -7 14 0 q7 -7 14 0 M640 52 q5 -5 10 0 q5 -5 10 0 M1700 90 q6 -6 12 0 q6 -6 12 0" fill="none" strokeWidth="2" strokeLinecap="round" style={{ stroke: 'var(--birds)', opacity: 'var(--birds-op)' }} />
      <rect y="186" width="2400" height="30" style={v('--sea')} />
      <path d="M0 196 H2400" strokeWidth="2" opacity=".6" style={{ stroke: 'var(--sea-line)' }} />
      <path d="M1440 202 H1520 M1452 208 H1508 M1464 213 H1496" strokeWidth="2.5" strokeLinecap="round" style={{ stroke: 'var(--sun1)', opacity: 'var(--sun-op)' }} />
      {/* The breaking wave: swell, curling lip, foam and spray */}
      <g className="swell">
        <path d="M380 216 C560 214 650 150 820 134 C930 124 1010 150 1060 184 C1100 208 1180 214 1560 216 Z" fill="url(#vb-wave)" />
        <path d="M820 134 C930 124 1010 150 1060 184 C1020 166 990 160 960 162 C930 140 880 136 820 134 Z" style={v('--reflect')} />
        <path d="M760 142 C840 126 930 128 1000 160" fill="none" strokeWidth="5" strokeLinecap="round" style={{ stroke: 'var(--ripple)' }} />
        <path d="M380 216 C600 210 700 206 820 200 C900 196 1000 204 1100 208 C1300 214 1450 214 1560 216 Z" opacity=".85" style={v('--ripple')} />
        <g className="spray" style={v('--ripple')}>{spray.map(([x, y, r], i) => <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={r.toFixed(1)} />)}</g>
        <path d="M1700 216 C1820 214 1880 186 1960 180 C2020 176 2060 192 2090 208 C2140 214 2220 215 2300 216 Z" fill="url(#vb-wave)" />
        <path d="M1940 184 C1990 176 2040 182 2072 198" fill="none" strokeWidth="3.5" strokeLinecap="round" style={{ stroke: 'var(--ripple)' }} />
      </g>
      <rect y="214" width="2400" height="86" fill="url(#vb-sand)" />
      <path d="M0 216 C400 222 800 214 1200 220 C1600 226 2000 216 2400 220 V214 H0 Z" opacity=".75" style={v('--coping')} />
      {/* Long shadows from the palms, gone after dark */}
      <g fill="#5A2E3E" style={{ opacity: 'var(--shadow-op)' }}>{beachPalms.map(([x, y]) => <polygon key={x} points={`${x - 4},${y} ${x + 6},${y} ${x + 300},${y - 8} ${x + 290},${y - 14}`} />)}</g>
      {/* A lifeguard hut on stilts and a flowering hedge */}
      <g>
        <path d="M1588 300 L1600 236 M1652 300 L1640 236 M1596 262 H1644" strokeWidth="5" style={{ stroke: 'var(--coping)' }} />
        <rect x="1584" y="214" width="72" height="26" style={v('--slab')} />
        <rect x="1600" y="221" width="40" height="11" style={v('--glass')} />
        <polygon points="1576,216 1620,196 1664,216" style={v('--hut-roof')} />
        <polygon points="1640,302 1700,288 1760,300" fill="#5A2E3E" style={{ opacity: 'var(--shadow-op)' }} />
      </g>
      <g><ellipse cx="2330" cy="270" rx="110" ry="46" style={v('--palm-leaf')} /><g style={{ opacity: 'var(--flower-op)' }}>{Array.from({ length: 40 }, (_, i) => <circle key={i} cx={2240 + (i * 37) % 180} cy={238 + ((i * 23) % 60)} r="5" fill={i % 3 ? '#E3405A' : '#FF8FB0'} />)}</g></g>
      {beachPalms.map(([x, y, h, variant]) => <Palm key={x} variant={variant} x={x} y={y} height={h} />)}
    </svg>
  );
}

/* ---------------- Coast: a city across the water ---------------- */
const towers = (() => {
  const r = rng(12), list = [];
  let x = 240;
  while (x < 2260) {
    const w = 46 + Math.floor(r() * 70), h = 50 + Math.floor(r() * 130);
    list.push([x, w, h, r()]);
    x += w + 6 + Math.floor(r() * 26);
  }
  return list;
})();
const BASE = 196;
const reflections = towers.map(([x, w, , k]) => {
  let d = '';
  const cx = x + w / 2;
  for (let y = BASE + 6, i = 0; y < 296; y += 7, i++) {
    const len = Math.max(4, (w * 0.7) * (1 - i / 16) * (0.6 + ((k * 7 + i) % 1) * 0.4));
    d += `M${(cx - len / 2).toFixed(1)} ${y}h${len.toFixed(1)}`;
  }
  return d;
}).join('');
const cityStars = stars(33, 60, 120);
const towerFill = ['--tower-a', '--tower-b', '--tower-c'];

export function CoastCity() {
  return (
    <svg className="vista-art vista-coast" viewBox="0 0 2400 300" width="2400" height="300" preserveAspectRatio="xMinYMid slice">
      <defs>
        <linearGradient id="vc-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={stopOf('--sky1')} /><stop offset=".55" style={stopOf('--sky2')} /><stop offset="1" style={stopOf('--sky3')} /></linearGradient>
        <linearGradient id="vc-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={stopOf('--city-water1')} /><stop offset="1" style={stopOf('--city-water2')} /></linearGradient>
        <linearGradient id="vc-sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={stopOf('--sun1')} /><stop offset="1" style={stopOf('--sun2')} /></linearGradient>
        <pattern id="vc-win" width="14" height="16" patternUnits="userSpaceOnUse"><rect x="3" y="4" width="4" height="5" style={v('--win-a')} /><rect x="9" y="4" width="3" height="5" opacity=".55" style={v('--win-b')} /><rect x="3" y="11" width="4" height="4" opacity=".35" style={v('--win-b')} /></pattern>
      </defs>
      <rect width="2400" height={BASE} fill="url(#vc-sky)" />
      <g style={{ opacity: 'var(--moon-op)' }} fill="#FFF6E0">
        {cityStars.map(([x, y, r]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />)}
        <circle cx="2040" cy="58" r="24" fill="#FFF3D6" />
      </g>
      <circle cx="1560" cy="168" r="62" fill="url(#vc-sun)" style={{ opacity: 'var(--sun-op)' }} />
      <path d="M200 196 L380 150 L560 172 L760 140 L960 176 L1300 150 L1600 170 L1900 146 L2200 168 L2400 160 V196 H200 Z" style={v('--city-hill')} />
      {towers.map(([x, w, h], i) => (
        <g key={x}><rect x={x} y={BASE - h} width={w} height={h} style={v(towerFill[i % 3])} /><rect x={x + 4} y={BASE - h + 8} width={w - 8} height={h - 14} fill="url(#vc-win)" style={{ opacity: 'var(--win-op)' }} /></g>
      ))}
      <rect y={BASE} width="2400" height={300 - BASE} fill="url(#vc-water)" />
      <path className="shimmer" d={reflections} strokeWidth="2.6" strokeLinecap="round" style={{ stroke: 'var(--city-shine)' }} />
      <g transform="translate(1200 0)"><g className="boat">
        <path d="M0 252 H70 L60 264 H10 Z" style={v('--boat')} /><rect x="24" y="242" width="22" height="10" style={v('--boat')} />
        <g style={{ opacity: 'var(--lights-op)' }} fill="#FFE9A8"><circle cx="30" cy="247" r="2" /><circle cx="40" cy="247" r="2" /></g>
        <path d="M8 268 H64" strokeWidth="2" opacity=".6" style={{ stroke: 'var(--city-shine)' }} />
      </g></g>
      <Palm variant="a" x={70} y={300} height={250} />
      <Palm variant="c" x={150} y={300} height={190} />
      <Palm variant="b" x={2330} y={300} height={230} />
    </svg>
  );
}

/* ---------------- Fields: the river ---------------- */
const egrets = [[380, 238], [620, 252], [1500, 244], [1780, 236], [2050, 254]];
const riverStars = stars(45, 50, 100);
const riverFlies = [[260, 262, 0], [700, 276, -1.3], [1180, 258, -2.2], [1620, 270, -0.6], [2140, 264, -1.8]];

export function FieldsRiver() {
  return (
    <svg className="vista-art vista-fields" viewBox="0 0 2400 300" width="2400" height="300" preserveAspectRatio="xMinYMid slice">
      <defs>
        <linearGradient id="vr-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={stopOf('--sky1')} /><stop offset=".6" style={stopOf('--sky2')} /><stop offset="1" style={stopOf('--sky3')} /></linearGradient>
        <linearGradient id="vr-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={stopOf('--sky3')} /><stop offset="1" style={stopOf('--sky2')} /></linearGradient>
        <linearGradient id="vr-sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={stopOf('--sun1')} /><stop offset="1" style={stopOf('--sun2')} /></linearGradient>
      </defs>
      <rect width="2400" height="150" fill="url(#vr-sky)" />
      <g style={{ opacity: 'var(--moon-op)' }} fill="#FFF6E0">
        {riverStars.map(([x, y, r]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />)}
        <circle cx="1240" cy="52" r="18" fill="#F7F0DC" />
      </g>
      <circle cx="1720" cy="128" r="40" fill="url(#vr-sun)" style={{ opacity: 'var(--sun-op)' }} />
      <g style={{ opacity: 'var(--cloud-op)' }}>
        <g style={v('--cloud')}><path d="M300 90 a18 18 0 0 1 22 -18 a24 24 0 0 1 44 -6 a20 20 0 0 1 36 14 a14 14 0 0 1 14 10 Z" /><path d="M1300 70 a20 20 0 0 1 24 -20 a28 28 0 0 1 50 -8 a22 22 0 0 1 40 16 a16 16 0 0 1 16 12 Z" /><path d="M2000 96 a14 14 0 0 1 18 -14 a20 20 0 0 1 36 -4 a16 16 0 0 1 28 12 Z" /></g>
      </g>
      <path d="M0 132 C240 108 420 118 620 126 C860 136 1000 100 1240 104 C1480 108 1640 132 1880 124 C2100 116 2260 106 2400 112 V160 H0 Z" style={v('--hill-far')} />
      <path d="M0 150 C300 136 600 140 900 146 C1200 152 1500 138 1800 142 C2100 146 2250 140 2400 144 V170 H0 Z" style={v('--hill-mid')} />
      <rect y="160" width="2400" height="22" style={v('--field-1')} />
      <rect y="166" width="2400" height="1.6" style={v('--riser')} />
      <rect y="174" width="2400" height="1.6" style={v('--riser')} />
      {/* The river mirrors the sky, with banks of grass */}
      <path d="M0 196 C300 182 600 190 900 186 C1200 182 1500 194 1800 188 C2100 182 2250 190 2400 186 V236 C2200 240 2000 230 1800 236 C1500 244 1200 230 900 236 C600 242 300 232 0 238 Z" fill="url(#vr-water)" />
      <path d="M1222 204 H1258 M1228 212 H1252 M1234 220 H1246" strokeWidth="2.5" strokeLinecap="round" stroke="#FFF6E0" style={{ opacity: 'var(--moon-op)' }} />
      <path d="M1700 202 H1740 M1706 210 H1734 M1712 218 H1728" strokeWidth="2.5" strokeLinecap="round" style={{ stroke: 'var(--sun1)', opacity: 'var(--sun-op)' }} />
      <path d="M0 196 C300 182 600 190 900 186 C1200 182 1500 194 1800 188 C2100 182 2250 190 2400 186" fill="none" strokeWidth="5" style={{ stroke: 'var(--leaf)' }} />
      <path d="M0 238 C300 232 600 242 900 236 C1200 230 1500 244 1800 236 C2000 230 2200 240 2400 236" fill="none" strokeWidth="6" style={{ stroke: 'var(--leaf)' }} />
      <path d="M200 212 H340 M760 206 H900 M1300 218 H1460 M1900 210 H2060" strokeWidth="3" strokeLinecap="round" opacity=".55" style={{ stroke: 'var(--cloud)' }} />
      <path d="M0 240 C400 236 800 246 1200 240 C1600 234 2000 244 2400 240 V300 H0 Z" style={v('--field-2')} />
      <g className="sway">{Array.from({ length: 48 }, (_, i) => <path key={i} d={`M${i * 50 + 10} 300 l6 -26 M${i * 50 + 18} 300 v-30 M${i * 50 + 26} 300 l-6 -26`} strokeWidth="2.4" strokeLinecap="round" style={{ stroke: 'var(--field-tex)' }} />)}</g>
      <g style={{ opacity: 'var(--egret-op)' }}>{egrets.map(([x, y]) => <g key={x}><path d={`M${x} ${y} q8 -14 0 -22 q-2 -4 4 -6`} fill="none" strokeWidth="4" strokeLinecap="round" style={{ stroke: 'var(--egret)' }} /><ellipse cx={x + 6} cy={y - 4} rx="10" ry="6" style={v('--egret')} /><path d={`M${x + 4} ${y + 2} v10 M${x + 9} ${y + 2} v10`} strokeWidth="1.4" style={{ stroke: 'var(--trunk)' }} /></g>)}</g>
      {[150, 520, 1080, 1640, 2280].map((x, i) => <Palm key={x} variant="c" x={x} y={186} height={110 + (i % 2) * 24} flip={i % 2 === 1} />)}
      {/* A boatman rowing downstream */}
      <g transform="translate(900 0)"><g className="rower">
        <path d="M-60 216 H40 L28 228 H-48 Z" style={v('--trunk')} />
        <path d="M-58 216 H38" strokeWidth="3" style={{ stroke: 'var(--earth)' }} />
        <path d="M2 216 V194" strokeWidth="6" strokeLinecap="round" style={{ stroke: 'var(--farmer-pants)' }} />
        <path d="M2 196 Q-2 184 2 176 Q8 184 4 196 Z" style={v('--farmer-shirt')} />
        <circle cx="3" cy="172" r="4.5" style={v('--farmer-skin')} />
        <path d="M-9 171 L3 162 L15 171 Q3 174 -9 171 Z" style={v('--farmer-hat')} />
        <g transform="translate(6 182)"><g className="oar"><path d="M0 0 L-32 54" strokeWidth="3" strokeLinecap="round" style={{ stroke: 'var(--trunk)' }} /><path d="M-36 50 l-4 10 l8 2 z" style={v('--trunk')} /></g></g>
        <path d="M-56 232 H34" strokeWidth="2" opacity=".5" style={{ stroke: 'var(--cloud)' }} />
      </g></g>
      <g style={{ opacity: 'var(--lights-op)' }} fill="#FFE58A">{riverFlies.map(([x, y, d]) => <g key={x} className="ff" style={{ animationDelay: `${d}s` }}><circle cx={x} cy={y} r="7" opacity=".25" /><circle cx={x} cy={y} r="2.4" /></g>)}</g>
    </svg>
  );
}

/* ---------------- Fields: the village on the hills ---------------- */
const houses = [[420, 168, 1], [470, 176, 0], [1180, 160, 1], [1236, 170, 1], [1290, 164, 0], [1900, 172, 1], [1950, 180, 1]];
const villageStars = stars(57, 60, 130);
const villageFlies = [[180, 262, 0], [520, 280, -1.2], [960, 256, -2.1], [1340, 276, -0.7], [1740, 262, -1.6], [2200, 280, -2.6]];

// A small house in the same oblique view as the farmhouse in the hero: front gable, side wall, and the roof plane over it
function House({ x, y, lit }) {
  return (
    <g>
      <polygon points={`${x + 32},${y} ${x + 46},${y - 5} ${x + 46},${y + 15} ${x + 32},${y + 20}`} style={v('--wall')} />
      <polygon points={`${x + 32},${y} ${x + 46},${y - 5} ${x + 46},${y + 15} ${x + 32},${y + 20}`} fill="#000" opacity=".2" />
      <rect x={x} y={y} width="32" height="20" style={v('--wall')} />
      <polygon points={`${x - 4},${y + 2} ${x + 16},${y - 12} ${x + 36},${y + 2}`} style={v('--roof')} />
      <polygon points={`${x + 16},${y - 12} ${x + 30},${y - 17} ${x + 50},${y - 3} ${x + 36},${y + 2}`} style={v('--roof')} />
      <polygon points={`${x + 16},${y - 12} ${x + 30},${y - 17} ${x + 50},${y - 3} ${x + 36},${y + 2}`} fill="#000" opacity=".18" />
      <rect x={x + 6} y={y + 6} width="7" height="7" style={v('--window')} />
      {lit ? <rect x={x + 6} y={y + 6} width="7" height="7" fill="#FFC66B" style={{ opacity: 'var(--lights-op)' }} /> : null}
      <rect x={x + 18} y={y + 8} width="7" height="12" style={v('--trunk')} />
      {lit ? <path className="smoke" d={`M${x + 24} ${y - 13} q-6 -10 0 -18 q6 -8 0 -16`} fill="none" strokeWidth="3" strokeLinecap="round" opacity=".55" style={{ stroke: 'var(--cloud)' }} /> : null}
    </g>
  );
}

export function FieldsVillage() {
  return (
    <svg className="vista-art vista-fields" viewBox="0 0 2400 300" width="2400" height="300" preserveAspectRatio="xMinYMid slice">
      <defs>
        <linearGradient id="vv-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={stopOf('--sky1')} /><stop offset=".6" style={stopOf('--sky2')} /><stop offset="1" style={stopOf('--sky3')} /></linearGradient>
        <linearGradient id="vv-sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={stopOf('--sun1')} /><stop offset="1" style={stopOf('--sun2')} /></linearGradient>
      </defs>
      <rect width="2400" height="230" fill="url(#vv-sky)" />
      <g style={{ opacity: 'var(--moon-op)' }} fill="#FFF6E0">
        {villageStars.map(([x, y, r]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />)}
        <circle cx="760" cy="56" r="20" fill="#F7F0DC" /><circle cx="767" cy="51" r="4.5" fill="#E8DFC4" />
      </g>
      <circle cx="1560" cy="150" r="46" fill="url(#vv-sun)" style={{ opacity: 'var(--sun-op)' }} />
      <g style={{ opacity: 'var(--cloud-op)' }}>
        <g style={v('--cloud')}><path d="M240 96 a18 18 0 0 1 22 -18 a24 24 0 0 1 44 -6 a20 20 0 0 1 36 14 a14 14 0 0 1 14 10 Z" /><path d="M1960 70 a20 20 0 0 1 24 -20 a28 28 0 0 1 50 -8 a22 22 0 0 1 40 16 a16 16 0 0 1 16 12 Z" /></g>
      </g>
      <path className="birds homeward" d="M600 80 q8 -8 16 0 q8 -8 16 0 M650 64 q6 -6 12 0 q6 -6 12 0 M690 90 q7 -7 14 0 q7 -7 14 0 M1900 60 q6 -6 12 0 q6 -6 12 0" fill="none" strokeWidth="2.2" strokeLinecap="round" style={{ stroke: 'var(--tree)', opacity: 'var(--plane-op)' }} />
      <path d="M0 150 C200 110 360 100 520 120 C700 142 820 96 1000 92 C1180 88 1300 130 1480 128 C1660 126 1780 90 1980 96 C2160 102 2280 130 2400 120 V240 H0 Z" style={v('--hill-far')} />
      <path d="M0 186 C240 160 420 150 640 166 C860 182 1000 150 1240 148 C1480 146 1620 176 1860 170 C2080 164 2240 150 2400 156 V250 H0 Z" style={v('--hill-mid')} />
      <g fill="none" strokeWidth="2" opacity=".5" style={{ stroke: 'var(--field-tex)' }}>{[0, 1, 2].map((i) => <path key={i} d={`M0 ${200 + i * 12} C240 ${176 + i * 12} 420 ${166 + i * 12} 640 ${182 + i * 12} C860 ${198 + i * 12} 1000 ${166 + i * 12} 1240 ${164 + i * 12} C1480 ${162 + i * 12} 1620 ${192 + i * 12} 1860 ${186 + i * 12} C2080 ${180 + i * 12} 2240 ${166 + i * 12} 2400 ${172 + i * 12}`} />)}</g>
      {houses.map(([x, y, lit]) => <House key={x} x={x} y={y} lit={lit} />)}
      <rect y="230" width="2400" height="70" style={v('--field-3')} />
      <rect y="230" width="2400" height="2" opacity=".7" style={v('--bund')} />
      <g className="sway s3">{Array.from({ length: 60 }, (_, i) => <path key={i} d={`M${i * 40 + 6} 300 l5 -22 M${i * 40 + 13} 300 v-26 M${i * 40 + 20} 300 l-5 -22`} strokeWidth="2.4" strokeLinecap="round" style={{ stroke: 'var(--field-tex)' }} />)}</g>
      {[260, 820, 1420, 2120].map((x, i) => <Palm key={x} variant={i % 2 ? 'a' : 'c'} x={x} y={236} height={120 + (i % 2) * 30} flip={i % 2 === 0} />)}
      <g style={{ opacity: 'var(--lights-op)' }} fill="#FFE58A">{villageFlies.map(([x, y, d]) => <g key={x} className="ff" style={{ animationDelay: `${d}s` }}><circle cx={x} cy={y} r="7" opacity=".25" /><circle cx={x} cy={y} r="2.4" /></g>)}</g>
    </svg>
  );
}
