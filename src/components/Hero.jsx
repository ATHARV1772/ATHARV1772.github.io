import { useRef } from 'react';
import { person, credit, credentials } from '../content/site';
import { useInView } from '../hooks/useInView';
import { ArtSwitch } from './Switches';
import CoastScene from './scenes/CoastScene';
import FieldsScene from './scenes/FieldsScene';

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
          <div className="cta">
            <a className="btn primary" href="#work">See the work <span aria-hidden="true">→</span></a>
            <a className="btn" href={`mailto:${person.email}`}>Email me</a>
          </div>
          <div className="floor" aria-hidden="true" />
        </div>
        <div className="cell scene">
          <ArtSwitch />
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
