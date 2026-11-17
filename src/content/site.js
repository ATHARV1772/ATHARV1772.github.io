// Everything a visitor reads lives in src/content. Components only decide how it looks.

export const person = {
  name: 'Atharv Shinde',
  role: 'Software engineer / M.Tech CSE, IIT Hyderabad',
  headline: 'Building resilient systems from the bare metal up.',
  email: 'atharv1772@gmail.com',
  linkedin: 'https://www.linkedin.com/in/atharv-shinde-b96305217/',
  github: 'https://github.com/ATHARV1772',
  resume: '/resume.pdf',
};

export const nav = [
  { href: '#work', label: 'Work' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#academics', label: 'Academics' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export const credentials = [
  { big: 'M.Tech CSE', small: 'IIT Hyderabad, 2025–27' },
  { big: 'B.Tech E&TC', small: 'COEP Pune, 2020–24' },
  { big: 'SDE Intern', small: 'Mastercard, 2023' },
  { big: 'AIR 351', small: 'GATE CS 2025' },
];

export const credit = 'Inspired by Hiroshi Nagai. Painted in code.';

// What search engines and link previews show. Each case study gets its own page (see build.mjs).
export const meta = {
  origin: 'https://atharv1772.github.io',
  title: 'Atharv Shinde, software engineer',
  description: 'Atharv Shinde: M.Tech CSE at IIT Hyderabad, former software engineering intern at Mastercard. Frontend in React, web security, federated learning and LLM evaluation.',
  image: '/og.png',
  imageAlt: 'Atharv Shinde, software engineer, beside a flat painting of palm trees and a modern house by the sea.',
};

/** The tab title for the home page, or for a case study when one is given. */
export const pageTitle = (project) => (project ? `${project.pageTitle} | ${person.name}` : meta.title);
