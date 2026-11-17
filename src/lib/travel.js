// The travellers in the scenery strips (the boat, the rower, the metro, the birds) each run a looping, linear
// translateX animation across a painting much wider than the screen. These helpers read that run and work out
// where in it to jump so a traveller lands at a chosen spot.

/** The run of a CSS animation that slides along x: start and end offsets (user units) and length (ms). */
export function runOf(animation) {
  const frames = animation.effect.getKeyframes();
  const x = (frame) => {
    // Chrome reports translateX(-1300px) back as translate(-1300px)
    const m = /translateX?\((-?[\d.]+)(?:px)?[,)]/.exec(frame.transform || '');
    return m ? parseFloat(m[1]) : 0;
  };
  return { from: x(frames[0]), to: x(frames[frames.length - 1]), duration: Number(animation.effect.getTiming().duration) || 0 };
}

/**
 * The animation time (ms) that moves the traveller `dx` user units from where it is at `currentTime`,
 * or null when that spot lies outside its run (better to leave it than to jump somewhere unexpected).
 */
export function retime({ from, to, duration }, currentTime, dx) {
  const span = to - from;
  if (!duration || !span) return null;
  const t = ((Number(currentTime) % duration) + duration) % duration;
  const phase = t / duration + dx / span;
  if (phase < 0 || phase > 1) return null;
  return phase * duration;
}
