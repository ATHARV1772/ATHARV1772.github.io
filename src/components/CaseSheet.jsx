import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { projects, projectBySlug } from '../content/projects';
import { selectOpenCase } from '../store/caseSlice';
import { useCaseNav, caseOrder } from '../hooks/useCaseNavigation';
import { demoFor } from './demos';

export function CaseStudy({ project, inLibrary = false }) {
  const c = project.case;
  const Demo = !inLibrary && c.demo ? demoFor[c.demo] : null;
  return (
    <article className="case" id={inLibrary ? `case-${project.slug}` : undefined}>
      <p className="meta">{c.meta}</p>
      <h2>{project.title}</h2>
      <p className="lede">{c.lede}</p>
      <ul className="tags">{c.tags.map((t) => <li key={t}>{t}</li>)}</ul>
      {c.metrics && <div className="metrics">{c.metrics.map(([b, s]) => <div className="metric" key={s}><b>{b}</b><span>{s}</span></div>)}</div>}
      {c.score && (
        <table className="score">
          <caption>{c.score.caption}</caption>
          <thead><tr>{c.score.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
          <tbody>{c.score.rows.map((r) => <tr key={r.cells[0]} className={r.mine ? 'mine' : undefined}><th scope="row">{r.cells[0]}</th><td>{r.cells[1]}</td><td>{r.cells[2]}</td></tr>)}</tbody>
        </table>
      )}
      <div className="case-cols">
        {c.sections.map((s) => <div key={s.h}><h3>{s.h}</h3>{s.p.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}</div>)}
      </div>
      {Demo && <Demo />}
    </article>
  );
}

/** The case study opens in a modal <dialog>. Esc, Close, a click outside or Back all close it. */
export default function CaseSheet() {
  const open = useSelector(selectOpenCase);
  const nav = useCaseNav();
  const dialog = useRef(null), body = useRef(null);
  useEffect(() => {
    const d = dialog.current;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    if (open && body.current) body.current.scrollTop = 0;
  }, [open]);
  const project = open ? projectBySlug[open] : null;
  return (
    <dialog className="sheet" id="sheet" ref={dialog} aria-labelledby="sheet-title" onCancel={(e) => { e.preventDefault(); nav.close(); }} onClick={(e) => e.target === dialog.current && nav.close()}>
      <div className="sheet-bar">
        <p className="crumb" id="sheet-title">{project ? `Case study ${caseOrder.indexOf(open) + 1} of ${caseOrder.length}: ${project.title}` : 'Case study'}</p>
        <div className="sheet-nav">
          <button className="btn" type="button" data-step="-1" onClick={() => nav.step(-1)}>← Prev</button>
          <button className="btn" type="button" data-step="1" onClick={() => nav.step(1)}>Next →</button>
          <button className="btn primary" type="button" data-close onClick={() => nav.close()}>Close</button>
        </div>
      </div>
      <div className="sheet-body" ref={body}>{project && <CaseStudy key={project.slug} project={project} />}</div>
    </dialog>
  );
}

/** Without JavaScript, every case study is a normal section at the end of the page (hidden when JS runs). */
export function CaseLibrary() {
  return (
    <section className="case-library" id="case-studies" aria-label="Case studies">
      {projects.map((p) => <CaseStudy key={p.slug} project={p} inLibrary />)}
    </section>
  );
}
