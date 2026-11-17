import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { syncFromDocument, tick, selectArt, selectMode, selectScene, selectTheme, selectMotion } from './store/uiSlice';
import { localMinutes } from './lib/time';
import { applyTheme } from './lib/theme';
import { CaseNavProvider } from './hooks/useCaseNavigation';
import Header from './components/Header';
import Hero from './components/Hero';
import Work from './components/Work';
import { Skills, Experience, Academics, Contact } from './components/Sections';
import About from './components/About';
import Footer from './components/Footer';
import CaseSheet, { CaseLibrary } from './components/CaseSheet';
import Vista from './components/Vista';
import Sprites from './components/scenes/Sprites';
import { CoastBeach, CoastCity, FieldsRiver, FieldsVillage } from './components/vistas';

/**
 * Keeps <html> in step with the store. It renders nothing, so when the theme or the clock changes,
 * only this component and the few that display those values re-render, never the page or the paintings.
 */
function ThemeSync() {
  const dispatch = useDispatch();
  const art = useSelector(selectArt), mode = useSelector(selectMode), scene = useSelector(selectScene), theme = useSelector(selectTheme);
  const motion = useSelector(selectMotion);

  // After hydration: adopt what the inline script in index.html already painted, then keep the clock running
  useEffect(() => {
    const d = document.documentElement;
    dispatch(syncFromDocument({ art: d.dataset.art, mode: d.dataset.mode, minutes: localMinutes(), motion: d.dataset.motion !== 'off' }));
    const id = setInterval(() => dispatch(tick(localMinutes())), 30000);
    return () => clearInterval(id);
  }, [dispatch]);

  // Any change to the painting, mode or clock repaints <html>
  useEffect(() => {
    if (document.documentElement.dataset.mode) applyTheme({ art, mode, scene, theme });
  }, [art, mode, scene, theme]);

  // The pause button freezes every animation through one attribute (see styles/motion.css)
  useEffect(() => {
    if (document.documentElement.dataset.mode) document.documentElement.dataset.motion = motion ? 'on' : 'off';
  }, [motion]);

  return null;
}

/** The page. It reads nothing from the store itself, so it renders once. */
export default function App() {
  return (
    <CaseNavProvider>
      <ThemeSync />
      <Sprites />
      <a className="skip" href="#main">Skip to content</a>
      <div className="frame">
        <Header />
        <main id="main">
          <Hero />
          <Work />
          <Vista coast={<CoastBeach />} fields={<FieldsRiver />} label={null} />
          <Skills />
          <Experience />
          <Vista coast={<CoastCity />} fields={<FieldsVillage />} label={null} />
          <Academics />
          <About />
          <Contact />
          <CaseLibrary />
        </main>
        <Footer />
      </div>
      <CaseSheet />
    </CaseNavProvider>
  );
}
