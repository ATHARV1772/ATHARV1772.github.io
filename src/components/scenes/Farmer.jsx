// A small rice farmer transplanting seedlings. Feet at (0, 0), facing right, about 70 units tall.
// The upper body bends from the hip in a loop (CSS: .farmer-bend), and rings spread where the
// seedling goes in (.farmer-ripple), on the unplanted side of the field.
export default function Farmer({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g>
        <g className="farmer-ripple" style={{ stroke: 'var(--bund)' }} fill="none" strokeWidth="1.4">
          <ellipse cx="30" cy="0" rx="10" ry="2.6" />
          <ellipse cx="30" cy="0" rx="18" ry="4.4" opacity=".6" />
        </g>
        <ellipse cx="0" cy="0" rx="14" ry="3" fill="none" strokeWidth="1.2" opacity=".55" style={{ stroke: 'var(--bund)' }} />
        <path d="M-6.5 -2 V-26 H-1 V-2 Z M1 -2 V-26 H6.5 V-2 Z" style={{ fill: 'var(--farmer-pants)' }} />
        <g transform="translate(0 -26)">
          <g className="farmer-bend">
            <path d="M-8 0 L-7 -24 Q0 -28 7 -24 L8 0 Z" style={{ fill: 'var(--farmer-shirt)' }} />
            <path d="M-7 -24 Q0 -28 7 -24 L7.4 -16 Q0 -19 -7.4 -16 Z" fill="#000" opacity=".08" />
            <path d="M5 -22 Q12 -14 13 -2" fill="none" strokeWidth="3.4" strokeLinecap="round" style={{ stroke: 'var(--farmer-skin)' }} />
            <path d="M-5 -22 Q-8 -12 -2 -6" fill="none" strokeWidth="3.4" strokeLinecap="round" style={{ stroke: 'var(--farmer-skin)' }} />
            <path d="M-3 -6 l-3 -9 M-1.5 -6 l0 -10 M0 -6 l3 -9" fill="none" strokeWidth="1.4" strokeLinecap="round" style={{ stroke: 'var(--seedling)' }} />
            <circle cx="1" cy="-30" r="5" style={{ fill: 'var(--farmer-skin)' }} />
            <path d="M-14 -31 L1 -43 L16 -31 Q1 -27 -14 -31 Z" style={{ fill: 'var(--farmer-hat)' }} />
            <path d="M1 -43 L16 -31 Q8 -29 1 -29 Z" fill="#000" opacity=".14" />
          </g>
        </g>
      </g>
    </g>
  );
}
