import { useRef } from 'react';
import { useScrollPan } from '../hooks/useScrollPan';
import { useInView } from '../hooks/useInView';

/**
 * A strip of painting wider than the page. As it scrolls through the viewport it pans sideways,
 * so moving down the page feels like turning your head across a landscape.
 * Both paintings' strips are rendered; CSS shows the one for the current data-art.
 */
export default function Vista({ coast, fields, className = '', label }) {
  const frame = useRef(null), track = useRef(null);
  useScrollPan(frame, track);
  const onScreen = useInView(frame);
  return (
    <div className={`vista ${className}${onScreen === false ? ' is-still' : ''}`} ref={frame} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <div className="vista-track" ref={track}>
        {coast}
        {fields}
      </div>
    </div>
  );
}
