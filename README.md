# atharv1772.github.io

Portfolio of Atharv Shinde, M.Tech CSE at IIT Hyderabad: https://atharv1772.github.io

The site is also a frontend sample. It is a React app with a Redux Toolkit store, pre-rendered to plain HTML at build time, with two paintings (a coast and a paddy field, inspired by Hiroshi Nagai's City Pop work) drawn in hand-written SVG.

## Run it

Needs Node 20 or newer.

```bash
npm install
npm test             # unit tests: store, time of day, first paint, contrast, content, routes, paintings, travellers
npm run build        # writes the finished site to dist/
npm run test:dist    # checks the built pages: links, titles, share images, ids, private data
npm run preview      # serves dist/ at http://localhost:8000 (needs Python 3)
```

Every push to `main` runs the unit tests, builds the site, checks the built pages and deploys them through GitHub Actions (`.github/workflows/deploy.yml`). A failing check stops the deploy, so the live site is never replaced by a broken build. One-time setup: repository Settings, Pages, Source: GitHub Actions.

## What's where

```
src/
  content/       every word on the page, as plain data (projects, skills, history, links, page titles)
  components/    React components; scenes/ holds the two paintings and the shared palm sprites
  store/         Redux Toolkit slices: ui, highlight, caseStudy, actionLog
  hooks/         case-study navigation with real URLs, scroll panning, the scroll-drawn timeline, in-view detection,
                 keeping the strips' travellers (boat, rower, metro) in sight
  lib/           palm geometry, paddy rows, the visitor's local time, routes, <head> tags
  styles/        tokens.css (every colour, per painting and time of day), site.css (base and sections),
                 cards.css, vistas.css, motion.css, highlight.css, pages.css
  index.html     page shell; its inline script sets the theme before first paint
  main.jsx       browser entry: hydrates the pre-rendered HTML
  server.jsx     build-time entry: renders the pages to HTML
tests/
  unit/          run before the build (npm test)
  dist/          run on the built site (npm run test:dist)
public/          copied as is: favicon, résumé, share images (og.png and og/<project>.png), robots.txt
scripts/         the unit test runner
build.mjs        the whole build: esbuild bundles, react-dom/server pre-renders, one page per case study
docs/ARCHITECTURE.md   how the parts fit together and why
```

To change text, edit the files in `src/content/`; components only decide how things look. To update the résumé, replace `public/resume.pdf`.

## Decisions and trade-offs

**React and Redux, pre-rendered.** Several parts of the page share state: the painting switch, the time of day (Auto, Day, Golden hour, Night), the visitor's clock, skill-to-project highlighting and the open case study. A Redux Toolkit store keeps that state in one place, and the "This site" card shows the store live. Rendering the page to HTML at build time means the first paint needs no JavaScript and the page still reads fine with JavaScript off.

**A real address for every case study.** Each project has its own page at `/work/<slug>/`, with its own title, description and share image, so a link to one project previews as that project. In the browser the same address opens the case study as a sheet over the home page, and Back closes it.

**One theme system for everything.** Every colour, including every fill in both paintings, is a CSS custom property. Each time of day has its own page palette as well as its own sky: Day is light, Golden hour warm, Night dark. Switching the painting or the time of day changes four attributes on `<html>`, and CSS repaints the page. A small inline script sets those attributes before first paint, so there is no flash of the wrong theme; a test runs that script for every minute of the day to prove it agrees with the store.

**Motion that knows when to stop.** Animations are CSS keyframes on `transform` and `opacity`. Each painting pauses while it is off screen (`IntersectionObserver`), the scroll-linked panning writes to the DOM inside `requestAnimationFrame` without re-rendering React, and everything stops for visitors who ask their system for reduced motion.

**Cheap interactions.** Store subscriptions sit in the components that show the data, heavy pieces are memoised, and off-screen scenery skips rendering with `content-visibility`. Measured with the CPU slowed 4×: a theme switch takes 80 to 140 ms (it took 150 to 230 ms before), and hover and scroll produce no long tasks.

**Accessible by default.** Real buttons with `aria-pressed`, a modal `<dialog>` for case studies (Esc, Back and Close all work, and focus returns to the card), a skip link, visible focus rings, a pause button for the paintings' animation, text alternatives for the paintings, and WCAG AA text contrast in every palette, measured by a test.

**Choices a reviewer might question** (Redux rather than Zustand, a build script rather than Next.js, global tokens rather than Tailwind, the native `<dialog>` rather than Radix) are argued in `docs/ARCHITECTURE.md`, section 10.

**Tests without a test framework.** The tests use Node's built-in runner (`node:test`); esbuild, already the bundler, compiles them. Nothing extra to install.

## Checked before publishing

On every push, in CI:

- Store: reducers, derived selectors, memoisation, the action log, saved preferences (and blocked storage)
- First paint: the inline theme script agrees with the store for all 1,440 minutes of the day
- Contrast: every text colour pair meets WCAG AA in both paintings at every time of day
- Paintings: the same seed draws the same palm on the server and in the browser, so hydration matches
- Content: every skill is backed by a project or a proof; papers in preparation show no results; no private contact details
- Built pages: unique titles and canonical URLs, existing share images, one `h1`, no repeated ids, no broken local links, sitemap complete

By hand with Playwright during development (needs a browser, so not in CI):

- No sideways scrolling from 320 px to 1920 px, in both paintings
- No console errors and no hydration mismatches, on the home page and on every case-study page
- Keyboard: every control reachable; case studies open, close and step with the keyboard
- Back and Forward open and close case studies; shared `/work/<slug>/` and older `?project=` links open the right one
- Reduced motion: no animation runs
