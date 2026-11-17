import { person } from '../content/site';

/** GitHub Pages shows this for any address the site doesn't have. Plain HTML, no JavaScript. */
export default function NotFound() {
  return (
    <div className="frame">
      <main id="main" className="lost">
        <a className="monogram" href="/" aria-label={`${person.name}, home page`}>AS</a>
        <h1>There’s no page at this address</h1>
        <p>The link may be old or mistyped. Everything on the site starts from the home page.</p>
        <p className="lost-links">
          <a className="btn primary" href="/">Home page</a>
          <a className="btn" href="/#work">Selected work</a>
          <a className="btn" href={person.resume}>Résumé (PDF)</a>
        </p>
      </main>
    </div>
  );
}
