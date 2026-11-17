import { configureStore } from '@reduxjs/toolkit';
import ui, { setArt, setMode } from './uiSlice';
import highlight from './highlightSlice';
import caseStudy from './caseSlice';
import actionLog from './actionLogSlice';

// Remembers the painting and the day/night choice for the next visit
const persistPreferences = (store) => (next) => (action) => {
  const result = next(action);
  if (setArt.match(action) || setMode.match(action)) {
    const { art, mode } = store.getState().ui;
    try {
      localStorage.setItem('art', art);
      localStorage.setItem('mode', mode);
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
