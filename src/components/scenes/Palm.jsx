import { PALM_HEIGHT } from './Sprites';

/** Places one of the five palm shapes (see Sprites.jsx): base at (x, y), `height` tall, optionally mirrored. */
export default function Palm({ variant = 'a', x, y, height = PALM_HEIGHT, flip = false }) {
  const k = +(height / PALM_HEIGHT).toFixed(3);
  return <use href={`#palm-${variant}`} transform={`translate(${x} ${y}) scale(${flip ? -k : k} ${k})`} />;
}
