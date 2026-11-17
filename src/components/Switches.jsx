import { useDispatch, useSelector, useStore } from 'react-redux';
import { setArt, setMode, selectArt, selectMode, selectScene, selectTheme } from '../store/uiSlice';
import { applyTheme, wipeFrom } from '../lib/theme';

const modes = [
  { id: 'auto', label: 'Auto', title: 'Follows the time on your device', icon: <><circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M8 4.2V8l2.6 1.7" fill="none" stroke="currentColor" strokeWidth="1.8" /></> },
  { id: 'day', label: 'Day', icon: <><circle cx="8" cy="8" r="3.4" fill="currentColor" /><path d="M8 .8v2.4M8 12.8v2.4M.8 8h2.4M12.8 8h2.4M2.9 2.9l1.7 1.7M11.4 11.4l1.7 1.7M2.9 13.1l1.7-1.7M11.4 4.6l1.7-1.7" stroke="currentColor" strokeWidth="1.6" /></> },
  { id: 'golden', label: 'Golden hour', icon: <><path d="M2.6 11a5.4 5.4 0 0 1 10.8 0z" fill="currentColor" /><path d="M.8 13.6h14.4M8 1.4v2.2M2.9 3.9l1.5 1.5M13.1 3.9l-1.5 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></> },
  { id: 'night', label: 'Night', icon: <path d="M10.6 1.4a6.6 6.6 0 1 0 4 10.4A5.6 5.6 0 0 1 10.6 1.4z" fill="currentColor" /> },
];

const arts = [
  { id: 'coast', label: 'Coast', icon: <><circle cx="8" cy="6" r="3.2" fill="currentColor" /><path d="M1 12.5c1.8-1.4 3.2-1.4 5 0s3.2 1.4 5 0 3.2-1.4 4 0" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></> },
  { id: 'fields', label: 'Fields', icon: <><path d="M4 15V8M8 15V4M12 15V8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><path d="M4 10C2 10 1 8.6 1 7c2 0 3 1.4 3 3zM8 7c2 0 3-1.4 3-3-2 0-3 1.4-3 3zM12 10c2 0 3-1.4 3-3-2 0-3 1.4-3 3z" fill="currentColor" /></> },
];

// Shared by both switches: change the store, then paint <html> straight away inside the wipe
function useThemeAction() {
  const dispatch = useDispatch();
  const store = useStore();
  return (button, action) =>
    wipeFrom(button, () => {
      dispatch(action);
      const s = store.getState();
      applyTheme({ art: selectArt(s), mode: selectMode(s), scene: selectScene(s), theme: selectTheme(s) });
    });
}

function SwitchGroup({ className, label, items, value, onPick, attr }) {
  return (
    <div className={className} role="group" aria-label={label}>
      {items.map((item) => (
        <button key={item.id} type="button" {...{ [attr]: item.id }} aria-pressed={value === item.id} title={item.title} onClick={(e) => value !== item.id && onPick(e.currentTarget, item.id)}>
          <svg viewBox="0 0 16 16" aria-hidden="true">{item.icon}</svg>
          <span className="label">{item.label}</span>
        </button>
      ))}
    </div>
  );
}

export function ModeSwitch() {
  const mode = useSelector(selectMode);
  const run = useThemeAction();
  return <SwitchGroup className="mode" attr="data-mode" label="Time of day" items={modes} value={mode} onPick={(btn, id) => run(btn, setMode(id))} />;
}

export function ArtSwitch() {
  const art = useSelector(selectArt);
  const run = useThemeAction();
  return <SwitchGroup className="art-switch" attr="data-art" label="Painting" items={arts} value={art} onPick={(btn, id) => run(btn, setArt(id))} />;
}
