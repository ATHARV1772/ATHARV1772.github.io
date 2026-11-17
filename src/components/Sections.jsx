import { Fragment, memo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { skillGroups } from '../content/skills';
import { projects } from '../content/projects';
import { experience, academics } from '../content/history';
import { person } from '../content/site';
import { hoverSkill, togglePin, selectFocus, selectPinned } from '../store/highlightSlice';
import { useScrollDraw } from '../hooks/useScrollDraw';
import { useCaseNav } from '../hooks/useCaseNavigation';
import { caseUrl } from '../lib/routes';

// Where a Core CS skill shows up instead of a project: an exam row in Academics or an entry in Experience
const proofs = [
  ...experience.map((e) => ({ id: e.id, proof: e.proof, label: e.title, href: '#experience', where: 'Experience' })),
  ...academics.filter((a) => a.id).map((a) => ({ id: a.id, proof: a.proof, label: a.name, href: '#academics', where: 'Academics' })),
].filter((item) => item.proof?.length);

/** Hover highlights follow a real mouse only; on a touch screen a tap would leave them stuck on. */
const mouseOnly = (handler) => (e) => e.pointerType === 'mouse' && handler();

/** The answer to "pick one to see where I used it", shown right under the chip that was picked. */
function SkillResult({ skill, label }) {
  const nav = useCaseNav();
  const open = (slug) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    nav.openFromCard(slug, e.currentTarget);
  };
  const items = [
    ...projects.filter((p) => p.skills.includes(skill)).map((p) => <a key={p.slug} href={`${caseUrl(p.slug)}#case-${p.slug}`} onClick={open(p.slug)}>{p.title}</a>),
    ...proofs.filter((item) => item.proof.includes(skill)).map((item) => <Fragment key={item.id}><a href={item.href}>{item.label}</a> <small>({item.where})</small></Fragment>),
  ];
  return <><b>{label}</b> <span aria-hidden="true">→</span> {items.map((item, i) => <Fragment key={i}>{i > 0 && ', '}{item}</Fragment>)}</>;
}

/** One skill chip. memo: hovering a chip re-renders only the chips whose state changes, not all 29. */
const Chip = memo(function Chip({ skill, label, lit, pinned }) {
  const dispatch = useDispatch();
  return (
    <button
      type="button"
      className={`chip${lit ? ' is-lit' : ''}`}
      data-skill={skill}
      aria-pressed={pinned}
      onPointerEnter={mouseOnly(() => dispatch(hoverSkill(skill)))}
      onPointerLeave={mouseOnly(() => dispatch(hoverSkill(null)))}
      onClick={() => dispatch(togglePin(skill))}
    >
      {label}
    </button>
  );
});

export function Skills() {
  const focus = useSelector(selectFocus);
  const pinned = useSelector(selectPinned);
  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <div className="section-head"><h2 id="skills-title">Skills</h2><p>pick one<br />to see where I used it</p></div>
      <div className={`skills${focus.kind ? ' has-focus' : ''}`}>
        {skillGroups.map((group) => (
          <div key={group.title} className={`skill-group${group.wide ? ' wide' : ''}`}>
            <h3>{group.title}</h3>
            <div className="chips">
              {group.chips.map(([key, label]) => <Chip key={key} skill={key} label={label} lit={focus.skills.includes(key)} pinned={pinned === key} />)}
              <p className="skill-result" aria-live="polite">
                {group.chips.some(([key]) => key === pinned) && <SkillResult skill={pinned} label={group.chips.find(([key]) => key === pinned)[1]} />}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Experience() {
  const focus = useSelector(selectFocus);
  const ref = useRef(null);
  useScrollDraw(ref);
  return (
    <section className="section" id="experience" aria-labelledby="exp-title">
      <div className="section-head"><h2 id="exp-title">Experience</h2><p>newest first</p></div>
      <div className="timeline" ref={ref}>
        <span className="progress" aria-hidden="true" />
        {experience.map((e) => (
          <article className={`entry${focus.proofs.includes(e.id) ? ' is-lit' : ''}`} key={e.title}>
            <p className="when">{e.when}</p>
            <div className="what"><h3>{e.title}</h3><p className="org">{e.org}</p><p>{e.text}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Academics() {
  const focus = useSelector(selectFocus);
  return (
    <section className="section" id="academics" aria-labelledby="acad-title">
      <div className="section-head"><h2 id="acad-title">Academics and ranks</h2><p>exams and degrees</p></div>
      <div className="board-wrap"><table className="board">
        <caption className="visually-hidden">Exam ranks and grades</caption>
        <tbody>
          {academics.map((a) => (
            <tr key={a.name} className={[a.top && 'top', focus.proofs.includes(a.id) && 'is-lit'].filter(Boolean).join(' ') || undefined}><th scope="row">{a.name}</th><td>{a.detail}</td><td className="num">{a.value}</td></tr>
          ))}
        </tbody>
      </table></div>
    </section>
  );
}

export function Contact() {
  const [label, setLabel] = useState('Copy email');
  const emailRef = useRef(null);
  const copy = () => {
    const done = () => { setLabel('Copied'); setTimeout(() => setLabel('Copy email'), 1600); };
    // Without clipboard access, select the address so it can be copied by hand
    const fallback = () => {
      const range = document.createRange(), sel = window.getSelection();
      range.selectNodeContents(emailRef.current); sel.removeAllRanges(); sel.addRange(range);
      setLabel('Selected, copy it');
    };
    if (navigator.clipboard) navigator.clipboard.writeText(person.email).then(done, fallback);
    else fallback();
  };
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <h2 id="contact-title">Let’s talk.</h2>
      <div className="email-row">
        <a className="email" href={`mailto:${person.email}`} ref={emailRef}>{person.email}</a>
        <button className="btn" type="button" onClick={copy}>{label}</button>
      </div>
      <div className="contact-links">
        <a className="btn primary" href={person.resume}>Résumé (PDF)</a>
        <a className="btn" href={person.linkedin} rel="me">LinkedIn</a>
        <a className="btn" href={person.github} rel="me">GitHub</a>
      </div>
    </section>
  );
}
