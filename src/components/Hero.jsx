import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMotion, toggleMotion } from '../store/uiSlice';
import { person, credit, credentials } from '../content/site';
import { useInView } from '../hooks/useInView';
import { ArtSwitch } from './Switches';
import CoastScene from './scenes/CoastScene';
import FieldsScene from './scenes/FieldsScene';

/** WCAG 2.2.2: moving pictures that run on their own need a way to stop them. Hidden when the system already asks for reduced motion. */
function MotionToggle() {
  const dispatch = useDispatch();
  const motion = useSelector(selectMotion);
  return (
    <button className="motion-toggle" type="button" onClick={() => dispatch(toggleMotion())}>
      <svg viewBox="0 0 16 16" aria-hidden="true">{motion ? <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor" /> : <path d="M4.5 2.5l9 5.5-9 5.5z" fill="currentColor" />}</svg>
      <span className="label">{motion ? 'Pause animation' : 'Play animation'}</span>
    </button>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const onScreen = useInView(ref);
  return (
    <>
      {/* Both paintings are in the page; CSS shows the one that matches data-art. Off screen, their loops pause. */}
      <section className={`hero${onScreen === false ? ' is-still' : ''}`} id="top" aria-labelledby="hero-title" ref={ref}>
        <div className="cell intro">
          <p className="name" aria-hidden="true">Atharv<br />Shinde</p>
          <p className="role">{person.role}</p>
          <h1 id="hero-title"><span className="visually-hidden">{person.name}: </span>{person.headline}</h1>
          <p className="hero-line">{person.intro}</p>
          <div className="cta">
            <a className="btn primary" href="#work">See the work <span aria-hidden="true">→</span></a>
            <a className="btn" href={`mailto:${person.email}`}>Email me</a>
            <a className="btn" href={person.resume}>Résumé (PDF)</a>
          </div>
          <div className="floor" aria-hidden="true" />
        </div>
        <div className="cell scene">
          <ArtSwitch />
          <MotionToggle />
          <CoastScene />
          <FieldsScene />
          <p className="credit">{credit}</p>
        </div>
      </section>
      <ul className="creds" aria-label="Credentials">
        {credentials.map((c) => <li key={c.big}><b>{c.big}</b>{c.small}</li>)}
      </ul>
    </>
  );
}
