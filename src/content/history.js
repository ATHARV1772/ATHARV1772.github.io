export const experience = [
  {
    id: 'ta',
    proof: ['c', 'cpp', 'dsa', 'coa'],
    used: ['C', 'C++', 'Data structures and algorithms', 'Computer architecture'],
    when: 'Jul 2025 – now',
    title: 'Teaching Assistant',
    org: 'IIT Hyderabad',
    text: 'I run lab sessions for Computer Architecture, Algorithms, and Advanced Data Structures and Algorithms. I also grade assignments, coordinate and grade exams, and help students get unstuck.',
  },
  {
    id: 'mastercard',
    proof: [],
    used: ['Java', 'Selenium', 'REST APIs', 'QA automation'],
    when: 'May – Jul 2023',
    title: 'SDE Intern',
    org: 'Mastercard, Pune',
    text: 'I worked on the Individual Data Access Portal, a web app deployed worldwide where users view their personal data. I wrote Selenium (Java) tests for its interface, chased down failing network requests, added REST API checks to the QA pipeline, and kept the compliance documents in order.',
  },
];

export const academics = [
  { id: 'gate', proof: ['c', 'dsa', 'os', 'dbms', 'cn', 'coa'], top: true, name: 'GATE CS 2025', detail: 'Graduate Aptitude Test in Engineering, score 797 of 1000', value: 'AIR 351' },
  { name: 'MHT-CET 2020', detail: 'Maharashtra engineering entrance', value: '99.804%ile' },
  { name: 'M.Tech CSE', detail: 'IIT Hyderabad, 2025–27', value: '8.35 CGPA' },
  { name: 'B.Tech E&TC', detail: 'College of Engineering Pune, 2020–24', value: '8.21 CGPA' },
  { name: 'Class XII', detail: 'Vivekanand Junior College, Kolhapur, 2020', value: '91.08%' },
  { name: 'Class X', detail: 'St. Xavier’s High School, Kolhapur, 2018', value: '90.80%' },
];

export const about = {
  big: 'Find the breaking point. Engineer it out.',
  paragraphs: [
    'My engineering foundation is in electronics; my execution is in machine learning and distributed systems. My hardware background taught me to build from the lowest layer up—a first-principles philosophy I now apply across the entire computational stack.',
    'I do not just train models; I engineer the architectures that sustain them. Whether I am developing semi-supervised federated learning pipelines for medical imaging, building evaluation frameworks that expose LLM hallucinations (FaithBench), or securing a peer-to-peer payments app against active attacks (TransactiWar), my goal is to find the structural breaking points and mathematically engineer them out.',
    'This rigorous, data-driven approach extends directly to the frontend. I am a traditional acrylic painter, but the landscapes on this site are entirely engineered in code. There are no static images; they are constructed from raw SVG mathematics, CSS variables, and frame-synced animation. It is where visual design meets the exact same structural precision I demand from my machine learning models.',
  ],
  stops: [
    { code: 'KLH', city: 'Kolhapur', years: 'Until 2020', did: 'School and junior college' },
    { code: 'PNQ', city: 'Pune', years: '2020 – 2024', did: 'B.Tech E&TC at COEP, Mastercard internship' },
    { code: 'HYD', city: 'Hyderabad', years: '2025 – now', did: 'M.Tech CSE at IIT Hyderabad', here: true },
  ],
};
