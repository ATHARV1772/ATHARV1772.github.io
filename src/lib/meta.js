// The <head> tags that name a page for browsers, search engines and link previews.
// Used at build time only: build.mjs writes one page per entry from pages().

const escape = (text) =>
  String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** `path` and `image` are root-relative ("/work/thesis/", "/og/thesis.png"); `origin` makes them absolute. */
export function headTags({ origin, path, title, description, image, imageAlt, type = 'website' }) {
  const url = origin + path;
  return [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}">`,
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="${type}">`,
    `<meta property="og:site_name" content="Atharv Shinde">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:title" content="${escape(title)}">`,
    `<meta property="og:description" content="${escape(description)}">`,
    `<meta property="og:image" content="${origin}${image}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="${escape(imageAlt)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
  ].join('\n');
}

/** sitemap.xml listing every page, for search engines. */
export function sitemap(origin, paths) {
  const urls = paths.map((p) => `  <url><loc>${origin}${p}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
