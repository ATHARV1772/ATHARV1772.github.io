// Projects shown as cards in "Selected work" and as case studies in the sheet.
// Order and size: this site (the frontend sample) and TransactiWar, the thesis across the full width, then AdaptFedMLP and FaithBench.
// Paired cards are sized so they end at about the same height.
// The thesis and AdaptFedMLP are headed for papers: problem only, no method, no numbers.
// pageTitle names the project's own page (/work/slug/) in tabs, search results and link previews.

export const projects = [
  {
    slug: 'site',
    pageTitle: 'How this site is built',
    title: 'This site',
    size: 'wide',
    color: 'c-ink',
    strip: ['Frontend', 'Nov 2026'],
    lead: 'React and Redux Toolkit, pre-rendered so it arrives as plain HTML. Both paintings are hand-written SVG, and the switch, the clock and this card all read one store.',
    viz: 'store',
    tags: ['React', 'Redux Toolkit', 'SVG'],
    skills: ['js', 'react', 'redux', 'html', 'css', 'svg', 'node', 'a11y'],
    case: {
      meta: 'Personal project, November 2026',
      lede: 'A portfolio that doubles as the frontend sample: React components, a Redux store, pre-rendering on Node, and two paintings drawn in code.',
      tags: ['React 19', 'Redux Toolkit', 'esbuild', 'SVG', 'CSS custom properties'],
      sections: [
        { h: 'How it’s built', p: ['Every section is a React component that renders content kept in plain data files. A Redux Toolkit store holds the state that several parts of the page share: which painting is up, the time of day, which skill or project is highlighted, and which case study is open.', 'At build time Node renders the whole page to HTML with react-dom/server, so the first paint needs no JavaScript; React then hydrates it. esbuild bundles the app, and on every push GitHub Actions runs the tests, builds the pages, checks them and deploys.'] },
        { h: 'The paintings', p: ['Both scenes are SVG written by hand, and every colour in them is a CSS custom property. Switching the painting or the time of day changes a few attributes on the page root, and the browser repaints everything. The palms are generated from a handful of numbers, the same function drawing every frond.', 'The sea, the rice, the farmer and the train move with CSS animations; the scenery between sections pans with your scroll through requestAnimationFrame. All of it pauses off screen and stops for anyone who has asked their system for reduced motion.'] },
        { h: 'Checks', p: ['Keyboard access with visible focus, WCAG AA text contrast in every palette (a test measures it on each push), no sideways scrolling from 320 px up, a working page without JavaScript, and a page of its own for every case study.'] },
      ],
      demo: 'store',
    },
  },
  {
    slug: 'transactiwar',
    pageTitle: 'TransactiWar: a payments app built for a security war game',
    title: 'TransactiWar',
    size: 'side',
    color: 'c-1',
    strip: ['Network security, team of five', 'Feb–Apr 2026'],
    lead: 'We built a payments web app, then other teams spent a week trying to break into it. They filed 16 attack reports. None of them got any data out.',
    viz: 'race',
    tags: ['PHP', 'MySQL', 'Docker', 'OWASP'],
    skills: ['php', 'mysql', 'docker', 'html', 'css', 'websec', 'cn'],
    case: {
      meta: 'Network Security course, IIT Hyderabad, February to April 2026, team of five',
      lede: 'A peer-to-peer payments web app, built by a team of five and hardened for a week-long war game in which teams attacked each other’s apps.',
      tags: ['PHP', 'MySQL', 'Docker', 'Apache', 'OWASP Top 10'],
      metrics: [
        ['16', 'attack reports filed against our app'],
        ['0', 'of them got any data out'],
        ['9', 'rate limiters, from login to uploads'],
        ['TLS 1.3', 'only, with HSTS and a strict CSP'],
      ],
      sections: [
        { h: 'What we built', p: ['Accounts, transfers and profiles in PHP and MySQL, in Docker behind Apache. The defences: parameterized queries, CSRF tokens, output encoding backed by a Content Security Policy, Argon2id password hashing, one-time nonces so a transfer can’t be replayed, and row locks so two transfers can’t spend the same balance.'] },
        { h: 'The war game', p: ['For a week in March, other teams attacked our app while we attacked theirs. None of the 16 reports against us got any data out. The closest call was SSL stripping, which worked only because HSTS can’t protect a bare IP address, a limit of the exercise setup. On offence, we took over another team’s admin account: their login had no rate limit, trusted a spoofable X-Forwarded-For header, and still used admin:admin.'] },
      ],
      demo: 'race',
    },
  },
  {
    slug: 'thesis',
    pageTitle: 'Federated captioning of medical images, an M.Tech thesis',
    title: 'Federated captioning of medical images',
    size: 'full',
    color: 'c-4',
    strip: ['M.Tech thesis', 'May 2026–now'],
    lead: 'Hospitals can’t share patient scans, and most scans never get a written report. My thesis asks whether one model can still learn to write those reports, trained across hospitals without a single scan leaving the building.',
    viz: 'federated-map',
    note: 'Paper in preparation. Method and results stay off this page until it’s out.',
    tags: ['Federated learning', 'Vision + language', 'PyTorch'],
    skills: ['python', 'pytorch', 'hf', 'federated', 'semi', 'vlm'],
    case: {
      meta: 'M.Tech thesis, IIT Hyderabad, May 2026 to now',
      lede: 'Training one chest X-ray captioning model across hospitals that can’t share scans, when most of their images have no reports.',
      tags: ['PyTorch', 'Hugging Face', 'Federated learning', 'Semi-supervised learning'],
      sections: [
        { h: 'The problem', p: ['Captioning models for medical images need many scans paired with written reports. Hospitals can’t pool their scans, and most scans were never written up. Federated learning keeps every scan where it is and moves only model updates; semi-supervised learning is meant to get value from the scans with no report. Making the two work together for writing text, rather than picking a label, is still largely open.'] },
        { h: 'Where it stands', p: ['I’m writing this up for publication, so the method and the results stay off this page for now. I’m happy to talk through the problem and the setup in person.'] },
      ],
      demo: null,
    },
  },
  {
    slug: 'adaptfedmlp',
    pageTitle: 'AdaptFedMLP: brain-bleed labels split across hospitals',
    title: 'AdaptFedMLP',
    size: 'narrow',
    color: 'c-2',
    strip: ['Federated learning', 'Jan–Oct 2026'],
    lead: 'Five hospitals, five kinds of brain bleed, and each hospital has labelled only one kind. I reproduced a MICCAI 2024 method built for exactly this, and I’m writing up what comes next.',
    viz: 'label-matrix',
    note: 'Paper in preparation.',
    tags: ['PyTorch', 'Federated'],
    skills: ['python', 'pytorch', 'numpy', 'sklearn', 'federated'],
    case: {
      meta: 'Visual Computing and Representation Learning courses, IIT Hyderabad, January to October 2026',
      lede: 'Classifying brain bleeds across five simulated hospitals, where each hospital labels only one of the five bleed types.',
      tags: ['PyTorch', 'NumPy', 'scikit-learn', 'Federated learning'],
      sections: [
        { h: 'The problem', p: ['A brain CT scan can show five kinds of bleeding, often more than one at once. Here each hospital has labelled only one kind, so every scan carries one known label and four unknowns. Plain federated averaging reads the unknowns as “no bleed” and learns very little. FedMLP (Sun et al., MICCAI 2024) was designed for exactly this setting.'] },
        { h: 'What I did', p: ['I reproduced FedMLP from the paper and its released code on brain CT data split across five simulated hospitals, then worked on an extension of it.'] },
        { h: 'Where it stands', p: ['The extension is going into a paper, so its method and numbers aren’t public yet.'] },
      ],
      demo: 'fed',
    },
  },
  {
    slug: 'faithbench',
    pageTitle: 'FaithBench: does an LLM’s answer come from its source?',
    title: 'FaithBench',
    size: 'wide',
    color: 'c-3',
    strip: ['LLM evaluation', 'Jul–Aug 2026'],
    lead: 'Does an LLM’s answer actually come from its source? I built a checker that says so sentence by sentence, without training a new model.',
    viz: 'faith-chips',
    tags: ['NLI', 'Hugging Face'],
    skills: ['python', 'pytorch', 'hf', 'sklearn', 'nli', 'stats'],
    case: {
      meta: 'Independent project, July to August 2026',
      lede: 'Checking whether an LLM’s answer actually comes from its source, without training a new model.',
      tags: ['Hugging Face', 'PyTorch', 'NLI', 'Bootstrap CIs'],
      score: {
        caption: 'AUROC on RAGTruth, the benchmark the fine-tuned models trained on, and on HaluEval, which no method saw.',
        head: ['Method', 'RAGTruth', 'HaluEval'],
        rows: [
          { mine: true, cells: ['Mine: sentence-level NLI, no training', '0.714', '0.816'] },
          { cells: ['Mine, plus a learned aggregator', '0.737', '0.810'] },
          { cells: ['Fine-tuned DeBERTa-base', '0.798', '0.379'] },
          { cells: ['LettuceDetect-large (published)', '0.840', '0.776'] },
        ],
      },
      sections: [
        { h: 'What I built', p: ['I split each answer into sentences and ask an NLI model, DeBERTa-v3-large, whether the source backs each one up. The source goes in as overlapping chunks, an idea adapted from SummaC (TACL 2022); feeding it in whole dropped AUROC from 0.77 to 0.63 on a test subset. Then I put it up against word-overlap baselines, a learned aggregator, fine-tuning and a published detector, with bootstrap confidence intervals.'] },
        { h: 'What happened', p: ['On RAGTruth the fine-tuned models win, as they should on data like their training set. On HaluEval, which none of them saw, my training-free checker wins and the fine-tuned DeBERTa drops below chance. It had learned RAGTruth, not faithfulness.'] },
      ],
      demo: 'faith',
    },
  },
];

export const projectBySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));
