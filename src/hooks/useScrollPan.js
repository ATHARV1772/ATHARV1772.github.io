import { useEffect } from 'react';
import { prefersReducedMotion } from '../lib/theme';

/**
 * Pans a wide painting sideways as its frame scrolls through the viewport, like turning your head.
 * Writes the transform straight to the DOM in requestAnimationFrame (no React re-render per frame)
 * and only listens to scroll while the frame is on screen.
 */
export function useScrollPan(frameRef, trackRef) {
  useEffect(() => {
    const frame = frameRef.current, track = trackRef.current;
    if (!frame || !track) return undefined;
    if (prefersReducedMotion()) {
      track.style.transform = `translate3d(${-(track.scrollWidth - frame.clientWidth) / 2}px, 0, 0)`;
      return undefined;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = frame.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (innerHeight - rect.top) / (innerHeight + rect.height)));
      const travel = Math.max(0, track.scrollWidth - frame.clientWidth);
      track.style.transform = `translate3d(${(-progress * travel).toFixed(1)}px, 0, 0)`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll); update(); }
      else { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); }
    });
    io.observe(frame);
    update();
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, [frameRef, trackRef]);
}
