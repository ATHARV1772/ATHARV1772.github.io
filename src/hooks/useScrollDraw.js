import { useEffect } from 'react';
import { prefersReducedMotion } from '../lib/theme';

/**
 * Draws the Experience timeline as you scroll: the line grows down to a reading line a little below
 * the middle of the screen, and shrinks again on the way back up, so it works every time and on any
 * screen size. Writes a CSS variable (--drawn, 0 to 1) and marks the entries the line has reached,
 * straight to the DOM in requestAnimationFrame, and only listens to scroll while the timeline is on screen.
 * Without JavaScript --drawn is unset and CSS shows the whole line.
 */
export function useScrollDraw(ref) {
  useEffect(() => {
    const timeline = ref.current;
    if (!timeline) return undefined;
    const entries = [...timeline.querySelectorAll('.entry')];
    // Each entry's square marker sits about 30px below the top of the entry. Read every position first,
    // then write, so one frame never forces a second layout.
    const mark = (drawnPx) => {
      const reached = entries.map((entry) => drawnPx >= entry.offsetTop + 30);
      entries.forEach((entry, i) => entry.toggleAttribute('data-reached', reached[i]));
    };
    if (prefersReducedMotion()) {
      timeline.style.setProperty('--drawn', '1');
      mark(Infinity);
      return undefined;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = timeline.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (innerHeight * 0.6 - rect.top) / rect.height));
      mark(progress * rect.height);
      timeline.style.setProperty('--drawn', progress.toFixed(4));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll); }
      else { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); }
      update(); // also on the way out, so a fast scroll past leaves the line fully drawn or fully back
    });
    io.observe(timeline);
    update();
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, [ref]);
}
