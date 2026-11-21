import { configureStore } from '@reduxjs/toolkit';
import ui, { setArt, setMode, toggleMotion } from './uiSlice';
import highlight from './highlightSlice';
import caseStudy from './caseSlice';
import actionLog from './actionLogSlice';

// Remembers the painting and a paused animation for the next visit. A time-of-day choice lasts only for this visit
// (sessionStorage), so every new visit opens on Auto and follows the visitor's clock.
const persistPreferences = (store) => (next) => (action) => {
  const result = next(action);
  if (setArt.match(action) || setMode.match(action) || toggleMotion.match(action)) {
    const { art, mode, motion } = store.getState().ui;
    try {
      localStorage.setItem('art', art);
      localStorage.setItem('motion', motion ? 'on' : 'off');
      sessionStorage.setItem('mode', mode);
    } catch {
      /* private mode or blocked storage: the choice just won't be remembered */
    }
  }
  return result;
};

export function makeStore() {
  return configureStore({
    reducer: { ui, highlight, caseStudy, actionLog },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(persistPreferences),
  });
}
