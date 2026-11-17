import { useDispatch, useSelector } from 'react-redux';
import { projects } from '../content/projects';
import { hoverProject, selectFocus } from '../store/highlightSlice';
import { useCaseNav } from '../hooks/useCaseNavigation';
import { vizFor } from './viz';
import { caseUrl } from '../lib/routes';

function ProjectCard({ project, linked }) {
  const dispatch = useDispatch();
  const nav = useCaseNav();
  const Viz = vizFor[project.viz];
  const open = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // new tab or window: let the link work
    e.preventDefault();
    nav.openFromCard(project.slug, e.currentTarget);
  };
  return (
    <article
      className={`card ${project.size} ${project.color}${linked ? ' is-linked' : ''}`}
      data-project={project.slug}
      onMouseEnter={() => dispatch(hoverProject(project.slug))}
      onMouseLeave={() => dispatch(hoverProject(null))}
      onFocus={(e) => e.target.matches(':focus-visible') && dispatch(hoverProject(project.slug))}
      onBlur={() => dispatch(hoverProject(null))}
    >
      <p className="strip"><span>{project.strip[0]}</span><span>{project.strip[1]}</span></p>
      <div className="card-in">
        <h3><a className="card-link" href={`${caseUrl(project.slug)}#case-${project.slug}`} onClick={open}>{project.title}</a></h3>
        <p className="lead">{project.lead}</p>
        {Viz && <Viz />}
        {project.note && <p className="note">{project.note}</p>}
      </div>
      <div className="card-foot">
        <ul className="tags">{project.tags.map((t) => <li key={t}>{t}</li>)}</ul>
        <span className="btn" aria-hidden="true">Open case →</span>
      </div>
    </article>
  );
}

export default function Work() {
  const focus = useSelector(selectFocus);
  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="section-head"><h2 id="work-title">Selected work</h2><p>{projects.length} projects<br />open one for the full story</p></div>
      <div className={`bento${focus.kind === 'skill' ? ' has-focus' : ''}`}>
        {projects.map((p) => <ProjectCard key={p.slug} project={p} linked={focus.projects.includes(p.slug)} />)}
      </div>
    </section>
  );
}
