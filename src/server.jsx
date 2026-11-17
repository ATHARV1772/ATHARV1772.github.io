import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { makeStore } from './store';
import App from './App';
import NotFound from './components/NotFound';
import { projects } from './content/projects';
import { meta, pageTitle } from './content/site';
import { caseUrl } from './lib/routes';
export { headTags, sitemap } from './lib/meta';

/**
 * Used only at build time: renders the whole page to HTML with the store's default state.
 * Every page gets the same markup, so the browser can hydrate any of them; only <head> differs.
 */
export function render() {
  const store = makeStore();
  return renderToString(
    <Provider store={store}>
      <App />
    </Provider>,
  );
}

/** The 404 page: plain HTML that needs no JavaScript. */
export const renderNotFound = () => renderToStaticMarkup(<NotFound />);

/** Every page the build writes: the home page, then one per case study. */
export function pages() {
  const home = { path: '/', title: meta.title, description: meta.description, image: meta.image, imageAlt: meta.imageAlt };
  const cases = projects.map((p) => ({
    path: caseUrl(p.slug),
    title: pageTitle(p),
    description: p.case.lede,
    image: `/og/${p.slug}.png`,
    imageAlt: `${p.title}. ${p.case.lede}`,
    type: 'article',
  }));
  return [home, ...cases].map((page) => ({ origin: meta.origin, ...page }));
}
