import { useEffect, useState } from 'react';

/** True while the element is on screen, null until known. `once` keeps it true after the first sighting. */
export function useInView(ref, { once = false, threshold = 0 } = {}) {
  const [inView, setInView] = useState(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) { setInView(true); return undefined; }
    const io = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting && once) io.disconnect();
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, threshold]);
  return inView;
}
