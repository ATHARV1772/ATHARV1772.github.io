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
    text: 'I worked on the Individual Data Access Portal, a web app deployed worldwide where users view their personal data. I wrote Selenium (Java) tests for its interface, debugged failing network requests, added REST API checks to the QA pipeline, and maintained the compliance documentation.',
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
    'I studied electronics before computer science, and it left me with a habit of looking underneath abstractions. Most of my work now is in machine learning, with some web development and security.',
    'On the machine learning side, I train federated models for medical imaging, where hospitals can’t share their scans. I also built a checker that catches LLM hallucinations. On the security side, I helped harden a payments app for a week-long war game.',
    'Away from my laptop, I paint in acrylics. The two scenes on this page are what that looks like in code: hand-written SVG, coloured with CSS variables and lit by your local time. There are no image files.',
  ],
  stops: [
    { code: 'KLH', city: 'Kolhapur', years: 'Until 2020', did: 'School and junior college' },
    { code: 'PNQ', city: 'Pune', years: '2020 – 2024', did: 'B.Tech E&TC at COEP, Mastercard internship' },
    { code: 'HYD', city: 'Hyderabad', years: '2025 – now', did: 'M.Tech CSE at IIT Hyderabad', here: true },
  ],
};
