import { useSelector } from 'react-redux';
import { selectMinutes } from '../store/uiSlice';
import { clockText } from '../lib/time';

export default function Footer() {
  const minutes = useSelector(selectMinutes);
  return (
    <footer className="site-footer">
      <p>© 2026 Atharv Shinde. Both scenes are painted in code, inspired by Hiroshi Nagai’s City Pop paintings.</p>
      <p>Built with React and Redux Toolkit. {minutes != null && <span>It’s {clockText(minutes)} where you are.</span>}</p>
    </footer>
  );
}
