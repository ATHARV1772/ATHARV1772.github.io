// Every case study has its own address, /work/<slug>/. The build writes a real page there
// (see build.mjs), and in the browser the same address opens the case study as a sheet over
// the home page. Links shared before this change used ?project=<slug>; they still work.

export const HOME = '/';

export const caseUrl = (slug) => `/work/${slug}/`;

/** The slug a URL points to (it may not be a real project; the caller checks), or null. */
export function slugFromUrl(pathname = HOME, search = '') {
  const match = /^\/work\/([a-z0-9-]+)\/?(?:index\.html)?$/.exec(pathname);
  if (match) return match[1];
  return new URLSearchParams(search).get('project');
}
