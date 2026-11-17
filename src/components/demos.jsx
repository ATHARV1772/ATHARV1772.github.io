import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../lib/theme';
import { StoreViz } from './viz';
import { ArtSwitch, ModeSwitch } from './Switches';

const unsafeSteps = ['A reads ₹500', 'B reads ₹500', 'A checks 500 ≥ 400', 'B checks 500 ≥ 400', 'A writes ₹100', 'B writes ₹100'];
const safeSteps = ['A locks the row, reads ₹500', 'B waits for the lock', 'A checks 500 ≥ 400', 'B is still waiting', 'A writes ₹100, unlocks', 'B reads ₹100: refused'];

export function RaceDemo() {
  const [locked, setLocked] = useState(false);
  return (
    <div className="demo">
      <div className="panel-head">Try it <small>the race every payments app has to survive</small></div>
      <div className="demo-body">
        <p className="demo-sub">Two ₹400 transfers reach a ₹500 balance at the same moment. Without a lock, both pass the balance check.</p>
        <button className="switch" type="button" aria-pressed={locked} onClick={() => setLocked((l) => !l)}><span className="track" aria-hidden="true"><i /></span>Row lock</button>
        <div className="steps">{(locked ? safeSteps : unsafeSteps).map((s) => <span key={s}>{s}</span>)}</div>
        <p className={`out${locked ? ' ok' : ''}`} aria-live="polite">{locked ? 'Second transfer refused. Balance stays correct.' : '₹800 left a ₹500 account. Double spend.'}</p>
      </div>
    </div>
  );
}

const faithAnswers = [
  { id: 's1', text: 'The tower was finished in 1889.', verdict: 'Supported. The source says it was completed in 1889.' },
  { id: 's2', text: 'It stands roughly 330 metres high.', verdict: 'Supported. The source gives its height as about 330 metres.' },
  { id: null, text: 'It was designed by Gustave Eiffel’s company.', verdict: 'Flagged. It’s true, but nothing in the source says who designed the tower.' },
];
const faithIntro = 'Two sentences are backed by the source. The third is true, but nothing in the source says it, so it gets flagged.';

export function FaithDemo() {
  const [picked, setPicked] = useState(-1);
  const linked = picked >= 0 ? faithAnswers[picked].id : null;
  return (
    <div className="demo">
      <div className="panel-head">Try it <small>select a sentence</small></div>
      <div className="demo-body">
        <div className="faith-demo">
          <div><p className="label">Source</p><p className="faith-source"><span className={linked === 's1' ? 'is-linked' : undefined}>The Eiffel Tower was completed in 1889.</span> <span className={linked === 's2' ? 'is-linked' : undefined}>It is about 330 metres tall.</span></p></div>
          <div><p className="label">Answer</p><ul className="faith-answer">
            {faithAnswers.map((a, i) => (
              <li key={a.text}><button type="button" data-verdict={a.id ? 'ok' : 'flag'} aria-pressed={picked === i} onClick={() => setPicked((p) => (p === i ? -1 : i))}>{a.text}</button></li>
            ))}
          </ul></div>
        </div>
        <p className="faith-verdict" aria-live="polite">{picked >= 0 ? faithAnswers[picked].verdict : faithIntro}</p>
      </div>
    </div>
  );
}

// One federated round: updates travel in, the global model merges them, the result travels back out
const clients = [[260, 58, 'Epidural', 24], [400.76, 160.27, 'Subdural', 200.27], [346.99, 325.73, 'Subarachnoid', 365.73], [173.01, 325.73, 'Intraventricular', 365.73], [119.24, 160.27, 'Intraparenchymal', 200.27]];
const centre = { x: 260, y: 206 };
const ROUND = 2400;

export function FedDemo() {
  const [playing, setPlaying] = useState(false);
  const [round, setRound] = useState(50);
  const dots = useRef([]), server = useRef(null), elapsed = useRef(0);
  useEffect(() => { if (!prefersReducedMotion()) setPlaying(true); }, []);
  useEffect(() => {
    if (!playing) return undefined;
    let raf = 0, last = null;
    const frame = (now) => {
      if (last !== null) elapsed.current += now - last;
      last = now;
      const ms = elapsed.current, k = Math.floor(ms / ROUND), t = (ms % ROUND) / ROUND, merging = t >= 0.42 && t < 0.55;
      setRound((r) => (r === (k % 50) + 1 ? r : (k % 50) + 1));
      server.current?.classList.toggle('merging', merging);
      clients.forEach(([x, y], i) => {
        const d = dots.current[i];
        if (!d) return;
        if (merging) { d.style.opacity = '0'; return; }
        const inbound = t < 0.42, f = inbound ? t / 0.42 : (t - 0.55) / 0.45;
        const a = inbound ? { x, y } : centre, b = inbound ? centre : { x, y };
        d.setAttribute('cx', (a.x + (b.x - a.x) * f).toFixed(1));
        d.setAttribute('cy', (a.y + (b.y - a.y) * f).toFixed(1));
        d.setAttribute('class', inbound ? 'pulse-in' : 'pulse-out');
        d.style.opacity = '1';
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [playing]);
  return (
    <div className="demo">
      <div className="panel-head">Watch it <small>one federated round at a time</small></div>
      <div className="demo-body">
        <svg className="fed" viewBox="0 0 520 414" role="img" aria-label="Five clients send updates to a global model and get the combined model back, round after round.">
          <g className="links">{clients.map(([x, y]) => <line key={x} x1={x} y1={y} x2={centre.x} y2={centre.y} />)}</g>
          <g className="pulses">{clients.map(([x], i) => <circle key={x} r="6" style={{ opacity: 0 }} ref={(el) => { dots.current[i] = el; }} />)}</g>
          <g>
            {clients.map(([x, y, name, ty]) => <g key={name}><circle className="client" cx={x} cy={y} r="22" /><text x={x} y={ty}>{name}</text></g>)}
            <rect className="server" x="206" y="178" width="108" height="56" ref={server} />
            <text className="server-label" x="260" y="211">Global model</text>
          </g>
        </svg>
        <p className="fed-bar"><span className="fed-round">{playing || round !== 50 ? `Round ${round} of 50` : '50 rounds'}</span><button className="btn fed-toggle" type="button" onClick={() => setPlaying((p) => !p)}>{playing ? 'Pause' : 'Play'}</button></p>
      </div>
    </div>
  );
}

export function StoreDemo() {
  return (
    <div className="demo">
      <div className="panel-head">Try it <small>the store behind this page</small></div>
      <div className="demo-body">
        <p className="demo-sub">These are the same controls as on the page. Each one dispatches an action; the state and the log below update from the store.</p>
        <div className="store-controls"><ArtSwitch /><ModeSwitch /></div>
        <StoreViz large />
      </div>
    </div>
  );
}

export const demoFor = { race: RaceDemo, faith: FaithDemo, fed: FedDemo, store: StoreDemo };
