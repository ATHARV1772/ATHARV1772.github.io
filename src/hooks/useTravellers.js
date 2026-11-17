import { useEffect } from 'react';
import { prefersReducedMotion } from '../lib/theme';
import { runOf, retime } from '../lib/travel';

const TRAVELLERS = '.boat, .rower, .train';

/**
 * Keeps a strip's travellers (the boat, the rower, the metro) in sight. Left alone, a boat crossing a painting
 * three times wider than the screen, in a strip that also pans with the scroll, is usually somewhere off to the
 * side when you look. So:
 * - when the strip comes into view, each traveller is placed inside it: towards the right when the strip arrives
 *   from below (scrolling down pans the scenery left, so the pan carries it across), towards the left otherwise;
 * - while the strip stays in view, a traveller that has gone off one edge is moved to just outside the edge it
 *   will come back in from: the right while the page is scrolling down, the left otherwise (they all travel right).
 * Every jump happens out of sight: off screen, or as the strip first appears.
 */
export function useTravellers(frameRef, onScreen) {
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !onScreen || prefersReducedMotion() || !frame.getAnimations) return undefined;
    let lastTop = null;

    const place = (arriving) => {
      const box = frame.getBoundingClientRect();
      if (!box.width) return;
      const scrollingDown = lastTop !== null && box.top < lastTop - 2;
      lastTop = box.top;
      for (const el of frame.querySelectorAll(TRAVELLERS)) {
        const svg = el.ownerSVGElement;
        if (!svg || !el.getClientRects().length) continue; // the other painting's strip is display: none
        const animation = el.getAnimations().find((a) => a.effect && runOf(a).to !== runOf(a).from);
        if (!animation) continue;
        const r = el.getBoundingClientRect();
        let target = null;
        if (arriving) {
          const inView = r.right > box.left + box.width * 0.1 && r.left < box.right - box.width * 0.1;
          const fromBelow = box.top > innerHeight / 2;
          if (!inView) target = box.left + box.width * (fromBelow ? 0.7 : 0.2) - r.width / 2;
        } else if (animation.playState === 'running' && (r.right <= box.left || r.left >= box.right)) {
          target = scrollingDown ? box.right : box.left - r.width;
          if (Math.abs(target - r.left) < 4) target = null; // already waiting at that edge
        }
        if (target === null) continue;
        const scale = svg.getBoundingClientRect().height / svg.viewBox.baseVal.height; // screen px per SVG unit
        const time = retime(runOf(animation), animation.currentTime, (target - r.left) / scale);
        if (time !== null) animation.currentTime = time;
      }
    };

    let raf = requestAnimationFrame(() => { raf = requestAnimationFrame(() => place(true)); });
    // While the page scrolls, check every frame (on a phone the pan can sweep a traveller across the strip in
    // under a second); otherwise a few times a second is plenty for something crossing at walking pace.
    let pending = 0;
    const onScroll = () => { if (!pending) pending = requestAnimationFrame(() => { pending = 0; place(false); }); };
    window.addEventListener('scroll', onScroll, { passive: true });
    const timer = setInterval(() => place(false), 300);
    // Switching the painting swaps in the other strip, whose travellers have not been placed yet
    const swapped = new MutationObserver(() => requestAnimationFrame(() => place(true)));
    swapped.observe(document.documentElement, { attributes: true, attributeFilter: ['data-art'] });
    return () => {
      cancelAnimationFrame(raf); cancelAnimationFrame(pending); clearInterval(timer);
      window.removeEventListener('scroll', onScroll); swapped.disconnect();
    };
  }, [frameRef, onScreen]);
}
