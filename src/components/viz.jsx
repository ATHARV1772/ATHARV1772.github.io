import { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectArt, selectMode, selectScene, selectTheme } from '../store/uiSlice';
import { selectActionLog } from '../store/actionLogSlice';

// Small visuals inside the project cards. None of them reveal method or results for the papers in progress.

export const FaithChips = memo(function FaithChips() {
  return (
    <div className="viz chips-viz">
      <p className="source"><b>Source</b>The Eiffel Tower was completed in 1889. It is about 330 metres tall.</p>
      <p className="ok">The tower was finished in 1889.</p>
      <p className="ok">It stands about 330 metres high.</p>
      <p className="flag">It was designed by Eiffel’s company.</p>
    </div>
  );
});

// The thesis setting: hospitals keep their scans, only model updates travel
export const FederatedMap = memo(function FederatedMap() {
  const sites = [0, 1, 2];
  return (
    <div className="viz fedmap">
      <svg viewBox="0 0 520 210" role="img" aria-label="Three hospitals keep their scans; only model updates travel to and from one shared captioning model.">
        {sites.map((i) => {
          const y = 18 + i * 64;
          return (
            <g key={i}>
              <rect className="box" x="8" y={y} width="164" height="48" />
              <rect className="xray" x="18" y={y + 9} width="24" height="30" />
              <path className="ribs" d={`M24 ${y + 17}h12M23 ${y + 23}h14M24 ${y + 29}h12`} />
              <text x="52" y={y + 21}>Hospital {String.fromCharCode(65 + i)}</text>
              <text className="dim" x="52" y={y + 37}>scans stay here</text>
              <path className="flow" d={`M174 ${y + 24} C236 ${y + 24} 246 105 318 105`} />
            </g>
          );
        })}
        <rect className="model" x="320" y="72" width="132" height="66" />
        <text className="model-label" x="386" y="101" textAnchor="middle">one shared</text>
        <text className="model-label" x="386" y="119" textAnchor="middle">captioning model</text>
        <path className="out" d="M452 105 H508" />
        <text x="486" y="92" textAnchor="middle">report</text>
      </svg>
      <div className="redacted" role="img" aria-label="A generated report, blacked out until the paper is published">
        <p><b>Findings</b><span className="bar" style={{ width: '62%' }} /><span className="bar" style={{ width: '28%' }} /><span className="bar" style={{ width: '44%' }} /></p>
        <p><b>Impression</b><span className="bar" style={{ width: '36%' }} /><span className="bar" style={{ width: '52%' }} /></p>
        <p className="stamp">Redacted until publication</p>
      </div>
    </div>
  );
});

// AdaptFedMLP's setting: five hospitals, five bleed types, each hospital labels one
export const LabelMatrix = memo(function LabelMatrix() {
  const types = ['EDH', 'IPH', 'IVH', 'SAH', 'SDH'];
  return (
    <div className="viz">
      <div className="matrix-wrap"><table className="label-matrix">
        <caption className="visually-hidden">Each hospital labels one bleed type; the other four are unknown.</caption>
        <thead><tr><th scope="col"><span className="visually-hidden">Hospital</span></th>{types.map((t) => <th key={t} scope="col">{t}</th>)}</tr></thead>
        <tbody>
          {types.map((_, row) => (
            <tr key={row}>
              <th scope="row">H{row + 1}</th>
              {types.map((t, col) => <td key={t} className={row === col ? 'known' : 'unknown'}>{row === col ? <><span aria-hidden="true">✓</span><span className="visually-hidden">labelled</span></> : '?'}</td>)}
            </tr>
          ))}
        </tbody>
      </table></div>
      <p className="matrix-note" aria-hidden="true">Each hospital labels one bleed type; the other four are unknown.</p>
    </div>
  );
});

export const RaceViz = memo(function RaceViz() {
  return (
    <div className="viz viz-race">
      <svg viewBox="0 0 460 120" aria-hidden="true"><text x="0" y="28">A sends <tspan className="rupee">₹</tspan>400</text><text x="0" y="100">B sends <tspan className="rupee">₹</tspan>400</text><path className="ln" d="M98 24 C140 24 150 52 186 56" /><path className="ln" d="M98 96 C140 96 150 70 186 66" /><rect className="box" x="188" y="38" width="96" height="46" /><text className="big" x="236" y="68" textAnchor="middle"><tspan className="rupee">₹</tspan>500</text><path className="bad" d="M286 54 C318 50 326 28 352 26" /><path className="good" d="M286 68 C318 72 326 94 352 96" /><text x="360" y="22">no lock:</text><text x="360" y="38"><tspan className="rupee">₹</tspan>800 leaves</text><text x="360" y="94">with a lock:</text><text x="360" y="110">B is refused</text></svg>
    </div>
  );
});

// Live view of the Redux store: the same state the painting switch and the clock write to
export function StoreViz({ large = false }) {
  const art = useSelector(selectArt), mode = useSelector(selectMode), scene = useSelector(selectScene), theme = useSelector(selectTheme);
  const log = useSelector(selectActionLog);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const state = mounted
    ? `ui: {\n  painting: "${art}",\n  mode: "${mode}",\n  scene: "${scene}",\n  theme: "${theme}"\n}`
    : 'ui: { … }';
  return (
    <div className={`viz store-viz${large ? ' large' : ''}`}>
      <pre aria-label="Current Redux state">{state}</pre>
      <ol className="action-log" aria-label="Last actions dispatched" aria-live="polite">
        {log.length === 0 ? <li className="empty">No actions yet. Switch the painting or the time of day.</li> : log.map((e) => <li key={e.id}><b>{e.type}</b>{e.payload && ` ${e.payload}`}</li>)}
      </ol>
    </div>
  );
}

export const vizFor = { 'faith-chips': FaithChips, 'federated-map': FederatedMap, 'label-matrix': LabelMatrix, race: RaceViz, store: StoreViz };
