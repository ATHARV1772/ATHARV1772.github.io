import Palm from './Palm';

// The pool painting. Every colour is a custom property set per time of day (styles/tokens.css).
const stars = [[40, 60, 1.4], [90, 140, 1.1], [130, 40, 1.2], [170, 210, 1], [210, 96, 1.5], [250, 30, 1.1], [290, 170, 1.2], [330, 70, 1.3], [370, 240, 1], [400, 130, 1.4], [430, 30, 1], [470, 190, 1.1], [520, 80, 1.5], [560, 250, 1], [590, 30, 1.2], [700, 60, 1.3], [720, 200, 1.1], [760, 30, 1], [790, 140, 1.4], [830, 80, 1.1], [860, 230, 1], [890, 40, 1.3], [920, 150, 1.2], [950, 90, 1], [980, 240, 1.1], [20, 260, 1], [60, 320, 1], [260, 300, 1], [480, 300, 1], [940, 320, 1]];

export default function CoastScene() {
  return (
    <svg className="scene-coast" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice" role="img" aria-labelledby="scene-title">
      <title id="scene-title">Flat painting of a pool, palm trees and a modern two-storey house by the sea. Its sky follows the time of day where you are.</title>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={{ stopColor: 'var(--sky1)' }} /><stop offset=".55" style={{ stopColor: 'var(--sky2)' }} /><stop offset="1" style={{ stopColor: 'var(--sky3)' }} /></linearGradient>
        <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={{ stopColor: 'var(--sun1)' }} /><stop offset="1" style={{ stopColor: 'var(--sun2)' }} /></linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={{ stopColor: 'var(--pool1)' }} /><stop offset="1" style={{ stopColor: 'var(--pool2)' }} /></linearGradient>
        <radialGradient id="poollight"><stop offset="0" stopColor="#F4FFFF" /><stop offset=".35" stopColor="#9DF6FF" stopOpacity=".9" /><stop offset="1" stopColor="#44EAFF" stopOpacity="0" /></radialGradient>
        <linearGradient id="refl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFD891" stopOpacity=".85" /><stop offset="1" stopColor="#FFD891" stopOpacity="0" /></linearGradient>
        <mask id="stripes"><rect width="1000" height="800" fill="#fff" /><rect y="356" width="1000" height="5" fill="#000" /><rect y="374" width="1000" height="7" fill="#000" /><rect y="394" width="1000" height="9" fill="#000" /><rect y="415" width="1000" height="11" fill="#000" /></mask>
        <mask id="broken"><rect width="1000" height="800" fill="#fff" /><path d="M500 640 H1000 M500 652 H1000 M500 666 H1000 M500 682 H1000" stroke="#000" strokeWidth="3" /></mask>
        <clipPath id="pool"><polygon points="0,652 1000,612 1000,800 0,800" /></clipPath>
        <path id="cloud-a" d="M20 330 a40 40 0 0 1 40 -40 a44 44 0 0 1 80 -18 a36 36 0 0 1 62 22 a30 30 0 0 1 40 36 Z" />
        <path id="cloud-b" d="M400 262 a26 26 0 0 1 30 -28 a34 34 0 0 1 62 -12 a28 28 0 0 1 50 18 a22 22 0 0 1 22 22 Z" />
        <pattern id="waves-far" width="300" height="18" patternUnits="userSpaceOnUse"><path d="M10 5 H70 M118 13 H160 M196 5 H252 M238 13 H286" fill="none" strokeWidth="2" strokeLinecap="round" style={{ stroke: 'var(--sea-line)' }} /></pattern>
        <pattern id="pool-waves" width="160" height="46" patternUnits="userSpaceOnUse"><path d="M6 12 q14 -6 28 0 t28 0 M92 34 q12 -5 24 0 t24 0" fill="none" strokeWidth="2.2" strokeLinecap="round" style={{ stroke: 'var(--ripple)' }} /></pattern>
        <pattern id="waves-near" width="300" height="22" patternUnits="userSpaceOnUse"><path d="M24 7 H120 M166 16 H232 M250 7 H292 M8 16 H40" fill="none" strokeWidth="2.5" strokeLinecap="round" style={{ stroke: 'var(--sea-line)' }} /></pattern>
      </defs>

      <rect width="1000" height="440" fill="url(#sky)" />
      <g style={{ opacity: 'var(--moon-op)' }} fill="#FFF6E0">
        {stars.map(([x, y, r]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />)}
        <path d="M380 40 L382.5 49.5 L392 52 L382.5 54.5 L380 64 L377.5 54.5 L368 52 L377.5 49.5 Z" />
        <circle cx="640" cy="120" r="24" fill="#F7F0DC" /><circle cx="649" cy="113" r="5.5" fill="#E8DFC4" /><circle cx="631" cy="129" r="4" fill="#E8DFC4" />
      </g>
      <circle cx="500" cy="350" r="130" fill="url(#sun)" mask="url(#stripes)" style={{ opacity: 'var(--sun-op)' }} />
      <g style={{ opacity: 'var(--cloud-op)' }}>
        <use href="#cloud-a" x="150" y="9" style={{ fill: 'var(--cloud-shade)' }} /><use href="#cloud-a" x="150" style={{ fill: 'var(--cloud)' }} />
        <use href="#cloud-b" x="330" y="-3" style={{ fill: 'var(--cloud-shade)' }} /><use href="#cloud-b" x="330" y="-10" style={{ fill: 'var(--cloud)' }} />
      </g>
      <g style={{ opacity: 'var(--plane-op)' }} fill="#FFFFFF">
        <path d="M540 168 L722 116" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity=".8" />
        <g transform="translate(736 112) rotate(-16)"><path d="M-14 0 L12 -1.8 Q17 0 12 1.8 Z" /><path d="M-2 0 L-8 -10 L-4 -10 L5 0 Z" /><path d="M-2 0 L-8 10 L-4 10 L5 0 Z" /><path d="M-12 0 L-15 -5 L-12.5 -5 L-8 0 Z" /></g>
      </g>

      {/* The sea: two rows of wave streaks scroll forever, one pattern period at a time */}
      <rect y="430" width="1000" height="44" style={{ fill: 'var(--sea)' }} />
      <g transform="translate(0 432)" opacity=".5"><rect className="wave-run" width="1300" height="18" fill="url(#waves-far)" /></g>
      <g transform="translate(0 450)" opacity=".55"><rect className="wave-run near" width="1300" height="22" fill="url(#waves-near)" /></g>
      <path d="M622 440 H658 M616 448 H664 M626 456 H654 M620 464 H660" stroke="#FFF6E0" strokeWidth="2.5" style={{ opacity: 'var(--moon-op)' }} />
      <rect y="472" width="1000" height="330" style={{ fill: 'var(--deck)' }} />

      {/* A palm behind the house */}
      <Palm variant="b" x={934} y={476} height={250} />

      {/* The house: roof slab, upper floor with a glass band, a cantilevered floor slab, glass ground floor, a stair core */}
      <g className="house" transform="translate(-44 0)">
        <rect x="556" y="556" width="396" height="12" fill="#000" opacity=".14" />
        <rect x="600" y="482" width="300" height="72" style={{ fill: 'var(--glass)' }} />
        <g style={{ opacity: 'var(--lights-op)' }}>
          <rect x="610" y="482" width="45" height="72" fill="#FFE6B0" />
          <rect x="720" y="482" width="45" height="72" fill="#FFE6B0" />
          <rect x="775" y="482" width="45" height="72" fill="#E89E48" />
          <rect x="830" y="482" width="45" height="72" fill="#FFE6B0" />
          <path d="M688 554 V522" stroke="#5A3F1E" strokeWidth="2.5" /><path d="M678 522 H698 L693 511 H683 Z" fill="#5A3F1E" />
          <path d="M852 554 h14 l2 -12 h-18 z M859 542 c-8 -10 -12 -18 -10 -26 c5 6 8 14 10 26 c2 -12 6 -22 13 -28 c0 9 -5 18 -13 28" fill="#5A3F1E" />
        </g>
        <path d="M655 482 V554 M710 482 V554 M765 482 V554 M820 482 V554 M875 482 V554" strokeWidth="3" style={{ stroke: 'var(--mullion)' }} />
        <rect x="900" y="400" width="46" height="156" style={{ fill: 'var(--slab-2)' }} />
        <rect x="916" y="418" width="14" height="122" style={{ fill: 'var(--glass)' }} />
        <rect x="916" y="418" width="14" height="122" fill="#FFE6B0" style={{ opacity: 'var(--lights-op)' }} />
        <rect x="566" y="482" width="10" height="74" style={{ fill: 'var(--slab)' }} />
        <rect x="590" y="552" width="356" height="6" style={{ fill: 'var(--slab-2)' }} />
        <rect x="548" y="466" width="398" height="16" style={{ fill: 'var(--slab)' }} />
        <rect x="548" y="482" width="352" height="5" fill="#000" opacity=".16" />
        <rect x="560" y="400" width="340" height="66" style={{ fill: 'var(--slab)' }} />
        <rect x="576" y="414" width="312" height="38" style={{ fill: 'var(--glass)' }} />
        <g style={{ opacity: 'var(--lights-op)' }}><rect x="628" y="414" width="52" height="38" fill="#FFE6B0" /><rect x="784" y="414" width="52" height="38" fill="#FFE6B0" /></g>
        <path d="M628 414 V452 M680 414 V452 M732 414 V452 M784 414 V452 M836 414 V452" strokeWidth="3" style={{ stroke: 'var(--mullion)' }} />
        <rect x="548" y="388" width="398" height="12" style={{ fill: 'var(--slab)' }} />
        <rect x="560" y="400" width="386" height="4" fill="#000" opacity=".12" />
        <g fill="#FFF0C4" style={{ opacity: 'var(--lights-op)' }}>{[580, 640, 700, 760, 820, 880].map((x) => <circle key={x} cx={x} cy="485" r="1.8" />)}</g>
      </g>

      {/* Lounger on the deck */}
      <path d="M478 586 V594 M530 586 V594" strokeWidth="3" style={{ stroke: 'var(--palm-trunk)' }} />
      <rect x="472" y="580" width="66" height="6" style={{ fill: 'var(--slab)' }} />
      <path d="M532 580 L554 558 L560 562 L540 586 Z" style={{ fill: 'var(--slab)' }} />
      <rect x="482" y="580" width="34" height="3" fill="#FF6B8B" />

      {/* The pool */}
      <polygon points="0,640 1000,600 1000,612 0,652" style={{ fill: 'var(--coping)' }} />
      <polygon points="0,652 1000,612 1000,800 0,800" fill="url(#water)" />
      <g clipPath="url(#pool)" style={{ opacity: 'var(--lights-op)' }}>
        <ellipse cx="300" cy="740" rx="80" ry="26" fill="url(#poollight)" />
        <ellipse cx="700" cy="720" rx="80" ry="26" fill="url(#poollight)" />
        <g mask="url(#broken)" transform="translate(-44 0)">
          <rect x="610" y="612" width="45" height="80" fill="url(#refl)" />
          <rect x="720" y="612" width="45" height="80" fill="url(#refl)" />
          <rect x="830" y="612" width="45" height="80" fill="url(#refl)" />
          <rect x="775" y="612" width="45" height="60" fill="url(#refl)" opacity=".55" />
        </g>
      </g>
      <g clipPath="url(#pool)" opacity=".4"><rect className="pool-run" x="-160" y="600" width="1340" height="200" fill="url(#pool-waves)" /></g>
      <path className="ripple-drift" d="M90 720 q26 -7 52 0 t52 0 M420 690 q22 -6 44 0 t44 0 M620 762 q26 -7 52 0 t52 0 M240 780 q30 -8 60 0 t60 0 M820 700 q22 -6 44 0 t44 0" fill="none" strokeWidth="3" strokeLinecap="round" opacity=".75" style={{ stroke: 'var(--ripple)' }} />

      {/* Two palms in the foreground, rooted below the frame */}
      <Palm variant="a" x={70} y={868} height={500} />
      <Palm variant="d" x={196} y={840} height={590} />
    </svg>
  );
}
