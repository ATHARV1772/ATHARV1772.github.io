# How the site works

A walk through the code, in the order a request meets it: the build, the first paint, the store, the paintings, motion, the case-study pages and dialog, and the tests.

## 1. Build: from components to HTML pages

`npm run build` runs `build.mjs`, which does four things:

1. **Bundles the browser code.** esbuild bundles `src/main.jsx` (React, Redux, every component and the CSS) into `dist/assets/main-[hash].js` and `.css`. The hash in the name changes whenever the content changes, so browsers can cache the files forever.
2. **Pre-renders the page.** esbuild bundles `src/server.jsx` a second time for Node, as CommonJS (React's server build uses `require`, which an ES module bundle can't call). `build.mjs` loads that bundle and calls `render()`, which runs `renderToString` from `react-dom/server` with a fresh store. The result is the full page as HTML.
3. **Fills the template, once per page.** `server.jsx` also exports `pages()`: the home page and one page per case study. For each, the rendered HTML goes into `src/index.html` in place of `<!--app-->`, and `<head>` gets that page's title, description, canonical URL and share image (`src/lib/meta.js`). The home page is `dist/index.html`; each case study is `dist/work/<slug>/index.html`.
4. **Adds the rest.** A `404.html` (plain HTML from `components/NotFound.jsx`, no JavaScript), a `sitemap.xml`, and everything in `public/`.

All asset URLs are root-relative (`/assets/…`, `/favicon.svg`), so the same files load from `/work/thesis/` as from `/`.

So every page already contains every word and both paintings. Every page also has the same `<body>`: only `<head>` differs. In the browser, `main.jsx` calls `hydrateRoot` on whichever page loaded: React attaches event handlers to the existing HTML instead of building it again.

**Why pre-render?** The first paint needs no JavaScript, search engines and link previews see real content, and the page still reads fine if the script fails. The cost is that the server render and the first browser render must produce identical markup, which shapes the next section.

## 2. First paint: the theme before React

The painting, the day/night mode and the time of day all live as attributes on `<html>`:

| Attribute    | Values                                 | Set by                          |
| ------------ | -------------------------------------- | ------------------------------- |
| `data-art`   | `coast`, `fields`                      | the painting switch             |
| `data-mode`  | `auto`, `day`, `golden`, `night`       | the time-of-day switch          |
| `data-scene` | `golden`, `day`, `night`               | the visitor's clock, or the mode |
| `data-theme` | `day`, `night`                         | derived: only night is dark     |
| `data-motion`| `on`, `off`                            | the pause button in the hero    |

`src/styles/tokens.css` defines every colour as a CSS custom property, with blocks such as `:root[data-art="fields"][data-theme="night"]` overriding them. Every SVG fill in the paintings reads one of these properties, so one attribute change repaints the whole page, paintings included. Each time of day has its own page palette as well as its own sky: day is light and neutral, golden hour is light and warm (apricot and plum by the sea, wheat and sienna in the fields), night is dark. Corners are tokens too: square on the coast, rounded in the fields, and every bordered thing uses them, down to the timeline dots, the tables (drawn in a rounded frame, since a table whose borders collapse ignores `border-radius`) and the boxes inside the SVG diagrams (`rx` set from CSS). Behind the page, a fixed gradient takes the painting's sky colours for the current time of day. The scrollbar uses the same tokens: its thumb is drawn like a skill chip (square on the coast, a pill in the fields, the accent colour under the pointer) and the page's rail carries on the sky gradient. That styling applies only where there is a mouse or trackpad, so phones keep their own auto-hiding indicator; Firefox, which supports only `scrollbar-color`, gets the colours.

A small inline script in `src/index.html` reads the saved choice from `localStorage`, reads the visitor's own clock (golden hour from 5:30 to 7:00 and 16:30 to 19:00, day in between, night after), and sets the attributes before the first paint. Without it, a visitor who chose Night would see a flash of Day.

**Avoiding hydration mismatches.** The server cannot know the visitor's saved choice or clock, so it renders with defaults (Coast, Auto, no clock). The browser hydrates with the same defaults, so the markup matches. Then an effect in `App.jsx` dispatches `syncFromDocument` with what the inline script already painted, and a 30-second interval keeps the clock moving.

## 3. State: the Redux Toolkit store

`src/store/index.js` combines four slices. Each holds state that more than one component needs:

- **`ui`**: painting, mode, minutes since local midnight on the visitor's device, and whether motion is allowed. The scene and theme are not stored; `selectScene` and `selectTheme` derive them, so they can never disagree with the mode and the clock.
- **`highlight`**: the skill pinned with a click, and whatever skill or project the pointer is over. `selectFocus` is memoised with `createSelector`, so the skills grid and the project cards re-render only when the highlight itself changes. Hovering a project lights its skills; hovering or pinning a skill lights its projects, and a Core CS skill also lights its proof: the GATE row in Academics and the TA entry in Experience. A second click on a pinned chip clears the hover highlight along with the pin: a hovered chip looks the same as a pinned one, so otherwise nothing would change until the mouse moved away.
- **`caseStudy`**: which case study is open, if any.
- **`actionLog`**: the last four user actions, collected with `builder.addMatcher` on action types from the other slices. The "This site" card shows it, next to the live state.

Custom middleware (`persistPreferences`) saves the painting and mode to `localStorage` whenever `setArt` or `setMode` passes through, using the action creators' `.match()` type guards. Components never touch storage themselves.

**Why Redux here rather than `useState` and context?** The same few values are read and written from far-apart parts of the tree (header, hero, project cards, skills, the dialog, the store card). One store with named actions keeps that traceable, and memoised selectors keep re-renders narrow. For a page this size, React context would also work; the store is the clearer choice once four kinds of shared state exist, and it doubles as the sample of Redux work.

## 4. Theme switching with a View Transition

`Switches.jsx` renders both switches from one `SwitchGroup` component: real `<button>`s with `aria-pressed`. A press calls `wipeFrom(button, change)` in `src/lib/theme.js`. That stores the button's centre and the distance to the farthest corner in CSS variables, then runs the change inside `document.startViewTransition`. CSS animates a circle clipped outward from the button, revealing the new theme.

`flushSync` makes React commit the state change inside the transition callback, so the browser captures the new frame. Browsers without View Transitions, and visitors who prefer reduced motion, get the change instantly.

## 5. The paintings

Both paintings are SVG written by hand in `src/components/scenes/`. Both are always in the page; CSS shows the one that matches `data-art`.

- **Palms** come from `src/lib/palm.js`: given a height, lean, bend and a seed, it computes the trunk, its rings and every frond leaflet. Five variants are drawn once in `Sprites.jsx` and placed with `<use>`. CSS custom properties inherit into `<use>` content, so one palm shape takes each scene's colours.
- **Rice seedlings** are one path (`#tuft`), repeated along rows from `src/lib/paddy.js`, which shrinks and spaces them with distance to fake perspective.
- **Vistas** between sections are wide strips of painting (a beach and a city across the water; a river and a village on the hills). They use the same colour tokens as the hero, so they follow the time of day too. `useScrollPan` moves each strip sideways as it scrolls through the viewport, like turning your head across a landscape.

## 6. Motion and performance

- Animations are CSS keyframes on `transform` and `opacity`: waves, the train, the farmer planting, the boats, smoke from the farmhouse.
- `useInView` (an `IntersectionObserver`) adds `.is-still` to a painting when it leaves the screen, which pauses every animation inside it.
- `useScrollPan` listens to scroll only while its vista is on screen, batches work into `requestAnimationFrame`, and writes `transform` straight to the DOM, so scrolling never re-renders React.
- `useScrollDraw` does the same for the Experience timeline: the line grows with the scroll down to a reading line just below the middle of the screen, shrinks on the way back up, and fills each entry's marker as it reaches it.
- `prefers-reduced-motion: reduce` stops all of it: the vistas sit still at their middle position and the timeline is drawn in full.
- A pause button in the painting's corner freezes every animation for anyone who hasn't set that preference (WCAG 2.2.2: moving content that starts on its own needs a way to stop it). The choice is saved and applied before first paint, like the theme.
- Theme switches run inside a View Transition. A second click mid-wipe skips the first animation; that rejection is handled, so the console stays clean.
- The scenery strips, the heaviest part of the page, use `content-visibility: auto`: off screen, the browser skips their style, layout and paint, so a theme switch only recalculates what is on screen. Their height is fixed in CSS, so skipping them never changes the page's length, and jumps and keyboard focus always land exactly.
- Sizes: the HTML is about 50 KB gzipped (most of it is the two paintings), the JavaScript about 90 KB gzipped (React and Redux), the CSS about 10 KB.

## 7. Case studies: pages of their own, opened as a dialog

Each case study has its own address, `/work/<slug>/` (`src/lib/routes.js`). The build writes a real page there, with the project's own title, description and share image (`public/og/<slug>.png`), so a link to one project previews as that project in chat apps and search results.

In the browser, `src/hooks/useCaseNavigation.jsx` turns those addresses into an app-like flow:

- **Open from a card:** dispatch `openCase`, then `history.pushState` the project's address, so the case study can be shared and Back closes it.
- **Prev and Next:** `history.replaceState`, so stepping through five case studies doesn't leave five history entries.
- **Close (button, Esc or a click outside):** `history.back()` if the sheet pushed an entry; otherwise (the visitor arrived on the case study's own page) replace the address with `/`. A `popstate` listener keeps the store in step with Back and Forward.
- **Arriving on `/work/<slug>/`:** the page is the home page plus that project's `<head>`; after hydration the sheet opens on that project. Links shared before the pages existed (`/?project=slug`) open it the same way.
- **Tab title:** follows the sheet, so history entries and bookmarks carry the project's name.
- **Focus:** the sheet is a modal `<dialog>` opened with `showModal()`, which traps focus. On close, focus returns to the card that opened it.
- **Without JavaScript:** every case study is also rendered as a normal section at the end of the page (`CaseLibrary`), and the card links point to `/work/<slug>/#case-<slug>`, so they still work.
- **Unknown addresses:** GitHub Pages serves `404.html`, which links back to the home page and the work.

## 8. Accessibility

- Landmarks, one `<h1>`, a skip link, and visible focus rings on every control.
- Both switches and the skill chips are buttons with `aria-pressed`; the menu button sets `aria-expanded`.
- The paintings have text alternatives; decorative vistas are hidden from screen readers.
- Demo results are announced through `aria-live` regions.
- Text meets WCAG AA contrast in every palette: both paintings, at every time of day. `tests/unit/contrast.test.js` measures it from `tokens.css` on every push.
- No sideways scrolling from 320 px wide.

## 9. Tests

Two suites, both on Node's built-in runner (`node:test`), so there is no test framework to install.

**Unit tests (`npm test`, before the build).** `scripts/run-tests.mjs` bundles each file in `tests/unit/` with esbuild (the source uses JSX and extensionless imports) and runs it. npm packages stay external, so the tests use the real Redux Toolkit.

- `store.test.js`: reducers reject unknown values; scene and theme are derived from mode and clock; hovering and pinning light the right projects and proofs, and a second click clears a pin at once; `selectFocus` keeps its identity when the clock ticks, so the cards don't re-render; the action log keeps the last four user actions; the middleware saves preferences and survives blocked storage.
- `first-paint.test.js`: runs the real inline script from `index.html` in a `vm` sandbox with a fake clock and storage, for every minute of the day, and checks it paints the same scene and theme the store derives after hydration. Without this, the two copies of the time windows could drift apart and the page would flash.
- `contrast.test.js`: parses `tokens.css`, applies its cascade for each painting and time of day, and checks every text colour pair at 4.5:1 or better.
- `content.test.js`: every skill chip is backed by a project or a proof, ids and slugs are unique, the projects headed for papers show no results, and no private contact details appear.
- `routes.test.js` and `paintings.test.js`: case-study addresses round-trip; `<head>` tags are escaped; palms and paddy rows come out identical on every run (the server and the browser must draw the same numbers).

**Built-site checks (`npm run test:dist`, after the build).** `tests/dist/site.test.mjs` reads `dist/`: every page has a unique title and the right canonical URL, every share image exists, each page has one `h1` and no repeated ids, every local link and asset resolves to a file, the case-study pages carry the home page's exact `<body>` (so they hydrate), the sitemap is complete, and nothing published contains private contact details.

CI runs both, around the build; any failure stops the deploy.

## 10. Choices a reviewer might question

- **Redux Toolkit, not Zustand or Jotai.** The shared state is small, and Zustand would also work. Redux Toolkit is here because named actions, the action log and the persistence middleware make every change traceable, and because Redux is what many production React codebases run on; the site doubles as a sample of it. `createSlice` keeps each slice to a few lines.
- **A 70-line build script, not Next.js or Astro.** The site needs static HTML pages that hydrate, and nothing else: no server, no data fetching, six pages. `build.mjs` pre-renders every page with `react-dom/server`, the same static output a framework would ship, with esbuild as the only build dependency. If the site grew a blog or a CMS, Astro would be the move.
- **Global CSS with design tokens, not Tailwind or CSS Modules.** The theme engine works by changing four attributes on `<html>` and letting custom properties cascade into every rule and every SVG fill, across six palettes. That is what global tokens are for; utility classes would repeat each colour per palette. Specificity stays flat, and there are five `!important`s, each an override that must win (hidden, visually hidden, reduced motion, and paused animations off screen or by the pause button).
- **Native `<dialog>`, not Radix or Headless UI.** `showModal()` already traps focus, closes on Esc, makes the page behind it inert and exposes the dialog role. What the platform doesn't do, returning focus to the card and keeping history in step, is about 60 lines in `useCaseNavigation.jsx`.
- **Scroll effects outside React.** `useScrollPan` and `useScrollDraw` write a transform or one CSS variable inside `requestAnimationFrame`; no scroll position ever goes into React state. The hero and the vistas re-render only when they enter or leave the screen (to pause their animation), and the paintings inside them are memoised, so nothing is redrawn.
- **Re-renders kept local.** `App` reads nothing from the store; a `ThemeSync` component that renders nothing does, so a theme switch or a clock tick re-renders only the switches, the clock and the store card. Project cards, skill chips, card diagrams and both paintings are wrapped in `React.memo`, so a hover re-renders only the card or chip whose highlight changed. Hover state does live in Redux on purpose: it is what lets a skill in one section light a project in another, and the store card does not re-render on hover (hover actions change neither the fields it shows nor its log).
- **Measured, not assumed.** On Chromium with the CPU slowed 4×, using the browser's Event Timing API: a time-of-day click took 150 to 230 ms before these changes and 80 to 140 ms after (the "good" threshold for responsiveness is 200 ms). Sweeping the mouse across every skill chip, and scrolling the whole page, produced no long tasks. Opening a case study, pressing Back and opening another in the same moment, twelve times in a row, never threw an error or left the sheet out of step with the address bar.

## 11. Known limits

- The page has about 2,400 elements, most of them inside the two paintings (every rice seedling and palm frond is drawn). Lighthouse flags pages above 1,400. Drawing the far rows of seedlings as one pattern would cut it.


- Fonts load from Google Fonts. Self-hosting them would remove two third-party connections from the first load.
- About 90 KB of JavaScript is a lot for a page that is mostly text. The React and Redux part is the point of the sample; a content-only site would ship less.
- Browser-level checks (dialog history, keyboard order, overflow at each width, no hydration warnings) were run with Playwright during development. They are not in CI, because that would mean downloading a browser on every push.
- A case-study page without JavaScript shows the home page with that case study at the end; the card links jump straight to it, but a visitor typing the address lands at the top.
