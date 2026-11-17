import { createSlice } from '@reduxjs/toolkit';

// The "This site" card shows the last few actions the store handled.
// Hover and clock actions fire constantly, so they are left out of the log.
const LOGGED = /^(ui\/setArt|ui\/setMode|ui\/toggleMotion|highlight\/togglePin|caseStudy\/)/;

const actionLogSlice = createSlice({
  name: 'actionLog',
  initialState: { entries: [], count: 0 },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => LOGGED.test(action.type),
      (state, action) => {
        state.count += 1;
        const payload = action.payload === undefined ? '' : JSON.stringify(action.payload);
        state.entries = [{ id: state.count, type: action.type, payload }, ...state.entries].slice(0, 4);
      },
    );
  },
});

export default actionLogSlice.reducer;
export const selectActionLog = (s) => s.actionLog.entries;
