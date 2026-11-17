import { createSlice } from '@reduxjs/toolkit';
import { phaseAt } from '../lib/time';

// Painting, time-of-day mode and the visitor's clock. The server renders with these defaults;
// the browser syncs to the real values (set before first paint by the script in index.html)
// right after hydration, so server and client markup match.
const initialState = { art: 'coast', mode: 'auto', minutes: null, motion: true };

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setArt(state, action) {
      state.art = action.payload === 'fields' ? 'fields' : 'coast';
    },
    setMode(state, action) {
      state.mode = ['auto', 'day', 'golden', 'night'].includes(action.payload) ? action.payload : 'auto';
    },
    tick(state, action) {
      state.minutes = action.payload;
    },
    syncFromDocument(state, action) {
      const { art, mode, minutes, motion } = action.payload;
      state.art = art === 'fields' ? 'fields' : 'coast';
      state.mode = ['auto', 'day', 'golden', 'night'].includes(mode) ? mode : 'auto';
      state.minutes = minutes;
      state.motion = motion;
    },
  },
});

export const { setArt, setMode, tick, syncFromDocument } = uiSlice.actions;
export default uiSlice.reducer;

// Selectors: the scene and the light/dark theme are derived, never stored
export const selectArt = (s) => s.ui.art;
export const selectMode = (s) => s.ui.mode;
export const selectMinutes = (s) => s.ui.minutes;
export const selectMotion = (s) => s.ui.motion;
export const selectScene = (s) => (s.ui.mode === 'auto' ? phaseAt(s.ui.minutes) : s.ui.mode);
// Golden hour keeps the light page; only night switches the page to dark
export const selectTheme = (s) => (selectScene(s) === 'night' ? 'night' : 'day');
