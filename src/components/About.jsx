import { about } from '../content/history';
import Vista from './Vista';
import CoastBand from './scenes/CoastBand';
import FieldsBand from './scenes/FieldsBand';

export default function About() {
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="section-head"><h2 id="about-title">About</h2><p>the short version</p></div>
      <div className="about-text">
        <p className="big">{about.big}</p>
        <div>{about.paragraphs.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}</div>
      </div>
      <ol className="metro" aria-label="Where I have studied and worked">
        {about.stops.map((s) => (
          <li key={s.code} className={`stop${s.here ? ' is-here' : ''}`}>
            <span className="code">{s.code}</span><span className="city">{s.city}</span><span className="years">{s.years}</span><span className="did">{s.did}</span>
            {s.here && <span className="here">You are here</span>}
          </li>
        ))}
      </ol>
      <Vista className="band-vista" coast={<CoastBand />} fields={<FieldsBand />} />
    </section>
  );
}
