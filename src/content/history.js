export const experience = [
  {
    id: 'ta',
    proof: ['c', 'cpp', 'dsa', 'coa'],
    when: 'Jul 2025 – now',
    title: 'Teaching Assistant',
    org: 'IIT Hyderabad',
    text: 'I run lab sessions for Computer Architecture, Algorithms, and Advanced Data Structures and Algorithms, grade, coordinate exams, and help students get unstuck.',
  },
  {
    id: 'mastercard',
    proof: [],
    when: 'May – Jul 2023',
    title: 'SDE Intern',
    org: 'Mastercard, Pune',
    text: 'I worked on the Individual Data Access Portal, the web app Mastercard users worldwide use to see their personal data. I wrote Selenium (Java) tests for its interface, chased down failing network requests, added REST API checks to the QA pipeline, and kept the compliance documents in order.',
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
  big: 'Electronics first, then software.',
  paragraphs: [
    'Kolhapur for school, Pune for an electronics degree, Hyderabad for computer science. What ties it together: I like finding where things break, whether that’s a web portal’s tests at Mastercard, a payments app in a security war game, or an evaluation that catches what standard metrics miss.',
    'Away from the keyboard, I paint. The two scenes on this page, a coast and a paddy field, are paintings done in code, inspired by Hiroshi Nagai’s City Pop work.',
  ],
  stops: [
    { code: 'KLH', city: 'Kolhapur', years: 'Until 2020', did: 'School and junior college' },
    { code: 'PNQ', city: 'Pune', years: '2020 – 2024', did: 'B.Tech E&TC at COEP, Mastercard internship' },
    { code: 'HYD', city: 'Hyderabad', years: '2025 – now', did: 'M.Tech CSE at IIT Hyderabad', here: true },
  ],
};
