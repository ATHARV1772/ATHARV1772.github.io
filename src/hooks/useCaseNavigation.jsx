import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { openCase, closeCase, selectOpenCase } from '../store/caseSlice';
import { projects, projectBySlug } from '../content/projects';
import { pageTitle } from '../content/site';
import { HOME, caseUrl, slugFromUrl } from '../lib/routes';

// Case studies have their own URLs (/work/slug/). Opening from a card pushes a history entry;
// closing undoes it, so Back never reopens a closed sheet. Prev/Next replace the entry.
const CaseNav = createContext(null);
const order = projects.map((p) => p.slug);

/** The project the current address points to, if it is a real one. */
function projectInUrl() {
  const slug = slugFromUrl(location.pathname, location.search);
  return slug && projectBySlug[slug] ? slug : null;
}

export function CaseNavProvider({ children }) {
  const dispatch = useDispatch();
  const store = useStore();
  const open = useSelector(selectOpenCase);
  const pushed = useRef(false);
  const opener = useRef(null);

  const api = useMemo(
    () => ({
      openFromCard(slug, element) {
        opener.current = element;
        dispatch(openCase(slug));
        history.pushState({ project: slug }, '', caseUrl(slug));
        pushed.current = true;
      },
      step(direction) {
        const current = store.getState().caseStudy.open;
        const slug = order[(order.indexOf(current) + direction + order.length) % order.length];
        dispatch(openCase(slug));
        history.replaceState({ project: slug }, '', caseUrl(slug));
      },
      close() {
        if (pushed.current) history.back();
        else {
          // Arrived on a case study's own address: closing leaves the visitor on the home page
          history.replaceState(null, '', HOME);
          dispatch(closeCase());
        }
      },
    }),
    [dispatch, store],
  );

  // Back/Forward, and a shared link that arrives at /work/slug/ (or the older ?project=slug)
  useEffect(() => {
    const sync = () => {
      const slug = projectInUrl();
      if (slug) dispatch(openCase(slug));
      else {
        pushed.current = false;
        dispatch(closeCase());
      }
    };
    window.addEventListener('popstate', sync);
    const start = projectInUrl();
    if (start) dispatch(openCase(start));
    return () => window.removeEventListener('popstate', sync);
  }, [dispatch]);

  // The tab title follows the sheet, so history entries and bookmarks are named after the project.
  // The first run is skipped: the pre-rendered page already carries the right title.
  const titled = useRef(false);
  useEffect(() => {
    if (!titled.current) {
      titled.current = true;
      if (!open) return;
    }
    document.title = pageTitle(open ? projectBySlug[open] : null);
  }, [open]);

  // When the sheet closes, focus goes back to the card that opened it
  const previous = useRef(open);
  useEffect(() => {
    if (previous.current && !open) {
      pushed.current = false;
      opener.current?.focus({ preventScroll: true });
    }
    previous.current = open;
  }, [open]);

  return <CaseNav.Provider value={api}>{children}</CaseNav.Provider>;
}

export const useCaseNav = () => useContext(CaseNav);
export { order as caseOrder };
