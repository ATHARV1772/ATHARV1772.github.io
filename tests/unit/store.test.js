import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeStore } from '../../src/store';
import { setArt, setMode, tick, selectScene, selectTheme } from '../../src/store/uiSlice';
import { togglePin, hoverSkill, hoverProject, selectFocus } from '../../src/store/highlightSlice';
import { openCase, closeCase, selectOpenCase } from '../../src/store/caseSlice';
import { selectActionLog } from '../../src/store/actionLogSlice';

const at = (h, m = 0) => h * 60 + m;

/** Puts a stand-in for the browser's localStorage on globalThis for one test, and returns a function that removes it. */
function withStorage(storage) {
  const before = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true, writable: true });
  return () => {
    if (before) Object.defineProperty(globalThis, 'localStorage', before);
    else delete globalThis.localStorage;
  };
}

test('the painting and the mode accept only known values', () => {
  const store = makeStore();
  store.dispatch(setArt('fields'));
  assert.equal(store.getState().ui.art, 'fields');
  store.dispatch(setArt('mars'));
  assert.equal(store.getState().ui.art, 'coast');
  store.dispatch(setMode('golden'));
  assert.equal(store.getState().ui.mode, 'golden');
  store.dispatch(setMode('dusk'));
  assert.equal(store.getState().ui.mode, 'auto');
});

test('scene and theme are derived: Auto follows the clock, a chosen mode overrides it', () => {
  const store = makeStore();
  const sky = () => [selectScene(store.getState()), selectTheme(store.getState())];
  store.dispatch(tick(at(18)));
  assert.deepEqual(sky(), ['golden', 'day']);
  store.dispatch(tick(at(21)));
  assert.deepEqual(sky(), ['night', 'night']);
  store.dispatch(setMode('day'));
  assert.deepEqual(sky(), ['day', 'day']);
  store.dispatch(setMode('golden'));
  assert.deepEqual(sky(), ['golden', 'day']);
});

test('hovering a skill lights the projects that used it', () => {
  const store = makeStore();
  store.dispatch(hoverSkill('react'));
  assert.deepEqual(selectFocus(store.getState()), { kind: 'skill', skills: ['react'], projects: ['site'], proofs: [] });
});

test('a Core CS skill lights its proof in Academics and Experience', () => {
  const store = makeStore();
  const focusOn = (skill) => {
    store.dispatch(hoverSkill(skill));
    const { projects, proofs } = selectFocus(store.getState());
    return { projects, proofs };
  };
  assert.deepEqual(focusOn('cpp'), { projects: [], proofs: ['ta'] });
  assert.deepEqual(focusOn('cn'), { projects: ['transactiwar'], proofs: ['gate'] });
  assert.deepEqual(focusOn('dsa'), { projects: [], proofs: ['ta', 'gate'] });
});

test('a hovered skill wins over the pinned one, and a second click unpins', () => {
  const store = makeStore();
  const skills = () => selectFocus(store.getState()).skills;
  store.dispatch(togglePin('python'));
  store.dispatch(hoverSkill('react'));
  assert.deepEqual(skills(), ['react']);
  store.dispatch(hoverSkill(null));
  assert.deepEqual(skills(), ['python']);
  store.dispatch(togglePin('python'));
  assert.equal(selectFocus(store.getState()).kind, null);
});

test('hovering a project lights its skills', () => {
  const store = makeStore();
  store.dispatch(hoverProject('faithbench'));
  const focus = selectFocus(store.getState());
  assert.equal(focus.kind, 'project');
  assert.ok(focus.skills.includes('nli'));
});

test('the clock ticking does not change the highlight, so the cards do not re-render', () => {
  const store = makeStore();
  store.dispatch(hoverSkill('css'));
  const before = selectFocus(store.getState());
  store.dispatch(tick(at(10, 30)));
  assert.equal(selectFocus(store.getState()), before);
});

test('the action log keeps the last four user actions and skips hover and clock noise', () => {
  const store = makeStore();
  store.dispatch(hoverSkill('react'));
  store.dispatch(tick(at(9)));
  store.dispatch(setArt('fields'));
  store.dispatch(setMode('night'));
  store.dispatch(togglePin('react'));
  store.dispatch(openCase('thesis'));
  store.dispatch(closeCase());
  const log = selectActionLog(store.getState());
  assert.deepEqual(log.map((e) => e.type), ['caseStudy/closeCase', 'caseStudy/openCase', 'highlight/togglePin', 'ui/setMode']);
  assert.equal(log[1].payload, '"thesis"');
  assert.equal(store.getState().actionLog.count, 5);
});

test('opening and closing a case study', () => {
  const store = makeStore();
  store.dispatch(openCase('adaptfedmlp'));
  assert.equal(selectOpenCase(store.getState()), 'adaptfedmlp');
  store.dispatch(closeCase());
  assert.equal(selectOpenCase(store.getState()), null);
});

test('the painting and the mode are remembered for the next visit', () => {
  const saved = new Map();
  let writes = 0;
  const restore = withStorage({ setItem: (k, v) => { writes += 1; saved.set(k, v); }, getItem: (k) => saved.get(k) ?? null });
  try {
    const store = makeStore();
    store.dispatch(setArt('fields'));
    store.dispatch(setMode('night'));
    assert.deepEqual(Object.fromEntries(saved), { art: 'fields', mode: 'night' });
    const count = writes;
    store.dispatch(tick(at(12)));
    store.dispatch(hoverSkill('react'));
    assert.equal(writes, count, 'only the two preference actions write to storage');
  } finally {
    restore();
  }
});

test('blocked storage does not break the switches', () => {
  const restore = withStorage({ setItem() { throw new Error('blocked'); }, getItem: () => null });
  try {
    const store = makeStore();
    store.dispatch(setArt('fields'));
    assert.equal(store.getState().ui.art, 'fields');
  } finally {
    restore();
  }
});
