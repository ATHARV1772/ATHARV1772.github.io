import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { nav } from '../content/site';
import { selectMinutes } from '../store/uiSlice';
import { clockText, zoneCode } from '../lib/time';
import { ModeSwitch } from './Switches';

export default function Header() {
  const [open, setOpen] = useState(false);
  const minutes = useSelector(selectMinutes);
  // The zone code is only known in the browser, so it is filled in after hydration
  const [zone, setZone] = useState('');
  useEffect(() => setZone(zoneCode()), []);
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="monogram" href="#top" aria-label="Atharv Shinde, back to top">AS</a>
        <nav className={`nav${open ? ' is-open' : ''}`} id="nav" aria-label="Sections" onClick={(e) => e.target.closest('a') && setOpen(false)}>
          {nav.map((item) => <a key={item.href} className="btn" href={item.href}>{item.label}</a>)}
        </nav>
        <span className="spacer" />
        <ModeSwitch />
        <span className="clock" title="Your local time. Auto picks the sky from it.">{clockText(minutes)}{zone && ` ${zone}`}</span>
        <button className="btn menu-btn" type="button" aria-expanded={open} aria-controls="nav" onClick={() => setOpen((o) => !o)}>Menu</button>
      </div>
    </header>
  );
}
