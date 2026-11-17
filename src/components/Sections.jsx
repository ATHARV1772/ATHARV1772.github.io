import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { skillGroups } from '../content/skills';
import { experience, academics } from '../content/history';
import { person } from '../content/site';
import { hoverSkill, togglePin, selectFocus, selectPinned } from '../store/highlightSlice';
import { useInView } from '../hooks/useInView';

export function Skills() {
  const dispatch = useDispatch();
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
              {group.chips.map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={`chip${focus.skills.includes(key) ? ' is-lit' : ''}`}
                  data-skill={key}
                  aria-pressed={pinned === key}
                  onMouseEnter={() => dispatch(hoverSkill(key))}
                  onMouseLeave={() => dispatch(hoverSkill(null))}
                  onClick={() => dispatch(togglePin(key))}
                >
                  {label}
                </button>
              ))}
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
  const drawn = useInView(ref, { once: true, threshold: 0.25 });
  return (
    <section className="section" id="experience" aria-labelledby="exp-title">
      <div className="section-head"><h2 id="exp-title">Experience</h2><p>newest first</p></div>
      <div className={`timeline${drawn ? ' is-drawn' : ''}`} ref={ref}>
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
      <table className="board">
        <caption className="visually-hidden">Exam ranks and grades</caption>
        <tbody>
          {academics.map((a) => (
            <tr key={a.name} className={[a.top && 'top', focus.proofs.includes(a.id) && 'is-lit'].filter(Boolean).join(' ') || undefined}><th scope="row">{a.name}</th><td>{a.detail}</td><td className="num">{a.value}</td></tr>
          ))}
        </tbody>
      </table>
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
