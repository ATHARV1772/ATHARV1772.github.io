import { createSlice, createSelector } from '@reduxjs/toolkit';
import { projects } from '../content/projects';
import { experience, academics } from '../content/history';

// Skills and projects light each other up. Hovering is temporary; a click pins a skill.
const highlightSlice = createSlice({
  name: 'highlight',
  initialState: { pinned: null, hoverSkill: null, hoverProject: null },
  reducers: {
    togglePin(state, action) {
      if (state.pinned === action.payload) {
        // A second click unpins. The mouse is usually still on the chip, and a hovered chip looks the same as a
        // pinned one, so the hover highlight goes too; otherwise nothing would change until the mouse moved away.
        state.pinned = null;
        state.hoverSkill = null;
      } else {
        state.pinned = action.payload;
      }
    },
    hoverSkill(state, action) {
      state.hoverSkill = action.payload;
    },
    hoverProject(state, action) {
      state.hoverProject = action.payload;
    },
  },
});

export const { togglePin, hoverSkill, hoverProject } = highlightSlice.actions;
export default highlightSlice.reducer;

const skillsOf = Object.fromEntries(projects.map((p) => [p.slug, p.skills]));
const proofItems = [...experience, ...academics].filter((item) => item.proof && item.proof.length);

// What is lit right now: a hovered skill wins, then a pinned skill, then a hovered project.
// Memoised so components only re-render when the highlight state itself changes.
export const selectFocus = createSelector([(s) => s.highlight], ({ pinned, hoverSkill: hs, hoverProject: hp }) => {
  const skill = hs || pinned;
  if (skill) {
    return {
      kind: 'skill',
      skills: [skill],
      projects: projects.filter((p) => p.skills.includes(skill)).map((p) => p.slug),
      proofs: proofItems.filter((item) => item.proof.includes(skill)).map((item) => item.id),
    };
  }
  if (hp) return { kind: 'project', skills: skillsOf[hp] || [], projects: [hp], proofs: [] };
  return { kind: null, skills: [], projects: [], proofs: [] };
});
export const selectPinned = (s) => s.highlight.pinned;
