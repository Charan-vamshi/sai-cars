import React, { useRef, useState, useEffect, useCallback } from 'react';
import BackgroundCanvas             from './components/3d/BackgroundCanvas';
import { setCursorPos }             from './components/3d/BackgroundScene';
import Navbar                       from './components/ui/Navbar';
import Landing                      from './components/ui/Landing';
import CarPage                      from './components/ui/CarPage';
import useSpeedLines                from './components/ui/useSpeedLines';
import { CARS }                     from './data/cars';

// Total sections: 1 landing + 4 cars
const TOTAL = 1 + CARS.length;

function App() {
  const [activeIdx, setActiveIdx]       = useState(0);
  const [speedActive, setSpeedActive]   = useState(false);
  const sectionRefs                     = useRef([]); // one ref per section
  const triggerSpeed                    = useSpeedLines();
  const scrolling                       = useRef(false);

  // Populate refs array (called on each render by the ref callbacks below)
  if (sectionRefs.current.length !== TOTAL) {
    sectionRefs.current = Array(TOTAL).fill(null);
  }

  // Smooth-scroll to a section index and fire the speed-line effect
  const scrollToSection = useCallback((index, forward = true) => {
    if (scrolling.current) return;
    const el = sectionRefs.current[index];
    if (!el) return;

    scrolling.current = true;
    setSpeedActive(true);
    triggerSpeed(forward);

    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setSpeedActive(false);
    }, 120); // small delay so speed lines appear before scroll starts

    setTimeout(() => { scrolling.current = false; }, 1000);
  }, [triggerSpeed]);

  // Track active section using IntersectionObserver
  useEffect(() => {
    const observers = [];
    sectionRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIdx(i); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Keyboard navigation (ArrowDown / ArrowUp)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowDown' && activeIdx < TOTAL - 1) scrollToSection(activeIdx + 1, true);
      if (e.key === 'ArrowUp'   && activeIdx > 0)         scrollToSection(activeIdx - 1, false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIdx, scrollToSection]);

  // Global cursor → particle parallax (writes to module-level var, zero renders)
  useEffect(() => {
    const onMove = (e) => {
      // Normalise to -1 → +1 range
      setCursorPos(
        (e.clientX / window.innerWidth)  * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1,
      );
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <>
      {/* Persistent 3D background — always behind everything */}
      <BackgroundCanvas speedActive={speedActive} />

      {/* Overlay UI */}
      <div className="app-shell">
        <Navbar
          activeIndex={activeIdx}
          onNavClick={(i) => scrollToSection(i, i > activeIdx)}
        />

        {/* Landing */}
        <div ref={(el) => (sectionRefs.current[0] = el)}>
          <Landing onScrollDown={(i) => scrollToSection(i, true)} />
        </div>

        {/* Car pages */}
        {CARS.map((car, i) => (
          <div key={car.id} ref={(el) => (sectionRefs.current[i + 1] = el)}>
            <CarPage
              car={car}
              onNext={() => {
                if (i + 2 < TOTAL) scrollToSection(i + 2, true);
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
