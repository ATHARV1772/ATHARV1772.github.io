import { createSlice } from '@reduxjs/toolkit';

// Which case study is open in the sheet. The URL (?project=slug) is kept in step by hooks/useCaseNavigation.jsx.
const caseSlice = createSlice({
  name: 'caseStudy',
  initialState: { open: null },
  reducers: {
    openCase(state, action) {
      state.open = action.payload;
    },
    closeCase(state) {
      state.open = null;
    },
  },
});

export const { openCase, closeCase } = caseSlice.actions;
export default caseSlice.reducer;
export const selectOpenCase = (s) => s.caseStudy.open;
