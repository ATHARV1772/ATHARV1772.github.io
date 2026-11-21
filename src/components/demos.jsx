import { useEffect, useRef, useState } from 'react';
import { StoreViz } from './viz';
import { ArtSwitch, ModeSwitch } from './Switches';

/** Draws ₹ in the system font: the web fonts keep it in a second file that would cost every visitor ~100 KB. */
const rupees = (text) => text.split('₹').flatMap((part, i) => (i ? [<span key={i} className="rupee">₹</span>, part] : [part]));

// Spend it twice (TransactiWar). A transfer reads the balance, checks it, then writes what it computed. Without a row
// lock, a second transfer that reads before the first one writes sees the old balance too, so both pass the check.
const START = 500, AMOUNT = 400, STEP = 500; // ms between read, check and write
const freshAccount = () => ({ balance: START, sent: 0, holder: null, waiting: [], log: [], started: [], done: [] });

export function SpendTwiceGame() {
  const [locked, setLocked] = useState(false);
  const account = useRef(freshAccount()), timers = useRef([]);
  const [view, setView] = useState(account.current);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const publish = () => setView({ ...account.current, log: [...account.current.log] });
  const say = (who, text) => { account.current.log.push({ who, text }); publish(); };
  const later = (fn) => timers.current.push(setTimeout(fn, STEP));
  const finish = (who) => {
    const a = account.current;
    a.done = [...a.done, who];
    if (a.holder === who) {
      a.holder = a.waiting.shift() ?? null;
      if (a.holder) read(a.holder);
    }
    publish();
  };
  function read(who) {
    const a = account.current, seen = a.balance, lock = a.holder === who;
    say(who, `${who} ${lock ? 'locks the row, reads' : 'reads'} ₹${seen}`);
    later(() => {
      if (seen < AMOUNT) { say(who, `${who} sees ₹${seen}: refused`); finish(who); return; }
      say(who, `${who} checks ${seen} ≥ ${AMOUNT}: OK`);
      later(() => {
        a.balance = seen - AMOUNT;
        a.sent += AMOUNT;
        say(who, `${who} writes ₹${a.balance}${lock ? ', unlocks' : ''}`);
        finish(who);
      });
    });
  }
  const send = (who) => {
    const a = account.current;
    if (a.started.includes(who)) return;
    a.started = [...a.started, who];
    if (locked && a.holder) { a.waiting.push(who); say(who, `${who} waits for the lock`); return; }
    if (locked) a.holder = who;
    read(who);
  };
  const reset = () => { timers.current.forEach(clearTimeout); timers.current = []; account.current = freshAccount(); publish(); };
  const running = view.started.length > view.done.length, finished = view.done.length === 2;
  let message = `₹${START} in the account. Two ₹${AMOUNT} transfers should never both go through. Make them.`, tone = ' calm';
  if (running) message = 'Running…';
  else if (view.started.length === 1) message = 'One went through. Now send the other.';
  else if (finished && view.sent > START) tone = '', message = `Both transfers read ₹${START} before either wrote, so both passed the check: ₹${view.sent} left a ₹${START} account. Now turn on the row lock and try again.`;
  else if (finished && locked) { tone = ' ok'; message = `With the row lock, the second transfer can only read the balance after the first has written it, so it sees ₹${START - AMOUNT} and is refused. However fast you click, the balance holds. Our app did this.`; }
  else if (finished) message = `The first transfer had already written ₹${START - AMOUNT} when the second read the balance, so it was refused. Send both within a second.`;
  return (
    <div className="demo">
      <div className="panel-head">Try it <small>spend it twice</small></div>
      <div className="demo-body">
        <div className="twice-controls">
          <button className="btn primary" type="button" aria-disabled={view.started.includes('A')} onClick={() => send('A')}>{rupees(`Send ₹${AMOUNT} (A)`)}</button>
          <button className="btn primary" type="button" aria-disabled={view.started.includes('B')} onClick={() => send('B')}>{rupees(`Send ₹${AMOUNT} (B)`)}</button>
          <button className="btn" type="button" disabled={!view.started.length || running} onClick={reset}>Reset</button>
        </div>
        <button className="switch" type="button" aria-pressed={locked} disabled={running} onClick={() => { reset(); setLocked((l) => !l); }}><span className="track" aria-hidden="true"><i /></span>Row lock</button>
        <p className="twice-meter"><span>{rupees(`Balance ₹${view.balance}`)}</span><span>{rupees(`Sent ₹${view.sent}`)}</span></p>
        {view.log.length > 0 && <ol className="twice-log">{view.log.map((l, i) => <li key={i} className={l.who === 'B' ? 'b' : 'a'} style={{ gridRow: i + 1 }}>{rupees(l.text)}</li>)}</ol>}
        <p className={`out${tone}`} aria-live="polite">{rupees(message)}</p>
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
// Missing isn't negative (AdaptFedMLP). Each hospital labels one bleed type, though a scan can show any of them.
// BCE reads every unlabelled type as "no bleed"; FedMLP's partial-class loss counts only the labels a hospital gave.
// An illustration with five made-up scans: it counts labels, not losses.
const BLEEDS = ['EDH', 'IPH', 'IVH', 'SAH', 'SDH'];
const SCANS = [
  { at: 1, shows: ['IPH', 'SDH'] },
  { at: 3, shows: ['IVH', 'SAH'] },
  { at: 0, shows: ['SDH'] },
  { at: 4, shows: ['IPH', 'SAH', 'SDH'] },
  { at: 2, shows: [] },
];
const listed = (xs) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
const tally = BLEEDS.map((b, i) => {
  const own = SCANS.filter((s) => s.at === i), other = SCANS.filter((s) => s.at !== i);
  const yes = own.filter((s) => s.shows.includes(b)).length;
  return { b, yes, ownNo: own.length - yes, bceNo: SCANS.length - yes, wrong: other.filter((s) => s.shows.includes(b)).length };
});
const totals = tally.reduce((t, r) => ({ yes: t.yes + r.yes, ownNo: t.ownNo + r.ownNo, bceNo: t.bceNo + r.bceNo, wrong: t.wrong + r.wrong }), { yes: 0, ownNo: 0, bceNo: 0, wrong: 0 });

export function MissingLabelGame() {
  const [n, setN] = useState(0);
  const [marked, setMarked] = useState([]);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState({ caught: 0, wrong: 0 });
  const head = <div className="panel-head">Try it <small>missing isn’t negative</small></div>;
  const restart = () => { setN(0); setMarked([]); setChecked(false); setScore({ caught: 0, wrong: 0 }); };
  if (n === SCANS.length) {
    return (
      <div className="demo">
        {head}
        <div className="demo-body">
          <p className="miss-where">What the model was told across the five scans</p>
          <div className="score-wrap"><table className="score miss-tally">
            <thead><tr><th scope="col">Bleed</th><th scope="col">BCE: yes</th><th scope="col">BCE: no</th><th scope="col">Wrong “no”</th><th scope="col">Partial-class: yes, no</th></tr></thead>
            <tbody>{tally.map((r) => <tr key={r.b}><th scope="row">{r.b}</th><td>{r.yes}</td><td>{r.bceNo}</td><td>{r.wrong}</td><td>{r.yes}, {r.ownNo}</td></tr>)}</tbody>
          </table></div>
          <p className="out calm" aria-live="polite">BCE told the model “no” {totals.bceNo} times, and {totals.wrong} of those were wrong: the bleed was on the scan. The partial-class loss used only the {totals.yes + totals.ownNo} labels the hospitals gave, and none was wrong. You caught {score.caught} of {totals.wrong}{score.wrong ? `, with ${score.wrong} false alarm${score.wrong > 1 ? 's' : ''}` : ''}.</p>
          <p className="miss-note">An illustration with five made-up scans, not results. FedMLP’s real loss also weights rare bleed types; this shows only which labels count.</p>
          <div className="miss-actions"><button className="btn" type="button" onClick={restart}>Play again</button></div>
        </div>
      </div>
    );
  }
  const scan = SCANS[n], own = BLEEDS[scan.at], hospital = scan.at + 1;
  const falseNo = BLEEDS.filter((b) => b !== own && scan.shows.includes(b));
  const caught = marked.filter((b) => falseNo.includes(b)), wrong = marked.filter((b) => !falseNo.includes(b));
  const check = () => { setChecked(true); setScore((s) => ({ caught: s.caught + caught.length, wrong: s.wrong + wrong.length })); };
  const next = () => { setN((i) => i + 1); setMarked([]); setChecked(false); };
  const toggle = (b) => setMarked((m) => (m.includes(b) ? m.filter((x) => x !== b) : [...m, b]));
  const cell = (b, text, cls) => <span key={b} className={cls}><span className="visually-hidden">{b}: </span>{text}</span>;
  const ownCell = cell(own, scan.shows.includes(own) ? 'yes' : 'no', 'given');
  const row = (label, cells) => <div className="miss-row"><p>{label}</p><div className="miss-cells">{cells}</div></div>;
  let feedback = 'Tap every blank where BCE’s “no” would be false, then check.';
  if (checked) {
    feedback = falseNo.length
      ? `You caught ${caught.length} of ${falseNo.length}. The scan shows ${listed(falseNo)}, but Hospital ${hospital} only labels ${own}, so BCE tells the model this patient has no ${listed(falseNo)}.`
      : 'Nothing to catch: no unlabelled bleed is on this scan, so every “no” BCE adds is true.';
    if (wrong.length) feedback += ` ${listed(wrong)} ${wrong.length > 1 ? 'aren’t' : 'isn’t'} on the scan, so BCE’s “no” there is right.`;
  }
  return (
    <div className="demo">
      {head}
      <div className="demo-body">
        <p className="demo-sub">Each hospital labels one bleed type, though a scan can show any of them. BCE treats every unlabelled type as “no bleed”.</p>
        <p className="miss-where">Scan {n + 1} of {SCANS.length}: Hospital {hospital}, which labels only {own}</p>
        <div className="miss-cells miss-names" aria-hidden="true">{BLEEDS.map((b) => <span key={b}>{b}</span>)}</div>
        {row('On the scan', BLEEDS.map((b) => (scan.shows.includes(b) ? cell(b, 'seen', 'seen') : cell(b, '–', 'faint'))))}
        {row(`Hospital ${hospital}’s labels`, BLEEDS.map((b) => (b === own ? ownCell : (
          <button key={b} type="button" aria-label={`${b}, not labelled`} aria-pressed={marked.includes(b)} disabled={checked} onClick={() => toggle(b)}>{marked.includes(b) ? '✗' : '?'}</button>
        ))))}
        {checked && row('BCE reads', BLEEDS.map((b) => (b === own ? ownCell : cell(b, 'no', scan.shows.includes(b) ? 'wrong' : undefined))))}
        {checked && row('FedMLP’s partial-class loss reads', BLEEDS.map((b) => (b === own ? ownCell : cell(b, '–', 'ignored'))))}
        <div className="miss-actions"><button className="btn primary" type="button" onClick={checked ? next : check}>{!checked ? 'Check' : n + 1 < SCANS.length ? 'Next scan' : 'See what the model was told'}</button></div>
        <p className={`out${!checked ? ' calm' : falseNo.length ? '' : ' ok'}`} aria-live="polite">{feedback}</p>
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

export const demoFor = { race: SpendTwiceGame, faith: FaithDemo, labels: MissingLabelGame, store: StoreDemo };
