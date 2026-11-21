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
      {c.links && <p className="case-links">{c.links.map((l) => <a className="btn" key={l.href} href={l.href}>{l.label} <span aria-hidden="true">↗</span></a>)}</p>}
      {c.metrics && <div className="metrics">{c.metrics.map(([b, s]) => <div className="metric" key={s}><b>{b}</b><span>{s}</span></div>)}</div>}
      {c.score && (
        <>
        <div className="score-wrap"><table className="score">
          <caption className="visually-hidden">{c.score.caption}</caption>
          <thead><tr>{c.score.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
          <tbody>{c.score.rows.map((r) => <tr key={r.cells[0]} className={r.mine ? 'mine' : undefined}><th scope="row">{r.cells[0]}</th><td>{r.cells[1]}</td><td>{r.cells[2]}</td></tr>)}</tbody>
        </table></div>
        <p className="score-note" aria-hidden="true">{c.score.caption}</p>
        </>
      )}
      {Demo && <Demo />}
      <div className="case-cols">
        {c.sections.map((s) => <div key={s.h}><h3>{s.h}</h3>{s.p.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}</div>)}
      </div>
    </article>
  );
}

/** Where the visitor is in the case studies: one segment per study, filled up to the open one. Each segment opens its study. */
function CaseTrack({ index, onPick }) {
  return (
    <nav className="sheet-track" aria-label="Case studies">
      <ol>
        {caseOrder.map((slug, i) => {
          const p = projectBySlug[slug];
          const state = i < index ? 'seen' : i === index ? 'current' : 'ahead';
          return (
            <li key={slug} className={state}>
              <button type="button" aria-current={state === 'current' ? 'step' : undefined} onClick={() => onPick(slug)}>
                <span>{p.short ?? p.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
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
  const index = project ? caseOrder.indexOf(open) : -1;
  const count = project ? `${index + 1} of ${caseOrder.length}` : '';
  // The dialog is named in full here because phones hide the label's title part (the heading below repeats it)
  return (
    <dialog className="sheet" id="sheet" ref={dialog} aria-label={project ? `Case study ${count}: ${project.title}` : 'Case study'} onCancel={(e) => { e.preventDefault(); nav.close(); }} onClick={(e) => e.target === dialog.current && nav.close()}>
      <div className="sheet-bar">
        <p className="crumb" id="sheet-title">{project ? <>Case study <span className="crumb-count">{count}</span><span className="crumb-title">: {project.title}</span></> : 'Case study'}</p>
        <div className="sheet-nav">
          <button className="btn" type="button" data-step="-1" onClick={() => nav.step(-1)}>← Prev</button>
          <button className="btn" type="button" data-step="1" onClick={() => nav.step(1)}>Next →</button>
          <button className="btn primary" type="button" data-close onClick={() => nav.close()}>Close</button>
        </div>
      </div>
      {project && <CaseTrack index={index} onPick={(slug) => nav.goTo(slug)} />}
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
