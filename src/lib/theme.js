import { flushSync } from 'react-dom';

/** Writes the painting, mode, scene and theme onto <html>; CSS custom properties do the rest. */
export function applyTheme({ art, mode, scene, theme }) {
  const d = document.documentElement;
  d.dataset.art = art;
  d.dataset.mode = mode;
  d.dataset.scene = scene;
  d.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = getComputedStyle(document.documentElement).backgroundColor;
}

export const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Runs `change` inside a View Transition that wipes outward from `from` (the pressed button).
 * flushSync makes React commit inside the transition callback so the new frame is captured.
 */
export function wipeFrom(from, change) {
  const r = from.getBoundingClientRect();
  const root = document.documentElement.style;
  root.setProperty('--tx', `${r.left + r.width / 2}px`);
  root.setProperty('--ty', `${r.top + r.height / 2}px`);
  root.setProperty('--tr', `${Math.hypot(Math.max(r.left, innerWidth - r.left), Math.max(r.top, innerHeight - r.top))}px`);
  if (document.startViewTransition && !prefersReducedMotion()) {
    const transition = document.startViewTransition(() => flushSync(change));
    // A second click mid-wipe, or a hidden tab, skips the animation. The change itself still applies,
    // so the rejected `ready` promise is expected; handling it keeps the console clean.
    transition.ready.catch(() => {});
  } else change();
}
