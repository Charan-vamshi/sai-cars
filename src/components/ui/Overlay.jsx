import React from 'react';
import { Scroll } from '@react-three/drei';
import HeroSection from './HeroSection';
import ProjectsSection from './ProjectsSection';
import ContactSection from './ContactSection';
import Navbar from './Navbar';

const Overlay = ({ formSuccess, setFormSuccess, theme, setTheme }) => {
  return (
    <Scroll html style={{ width: '100%' }}>
      {/* Navbar is sticky at top — sits outside scroll flow via fixed position in CSS */}
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ width: '100vw', pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <HeroSection />
          <ProjectsSection />
          <ContactSection formSuccess={formSuccess} setFormSuccess={setFormSuccess} />
          {/* Spacer so scroll doesn't overshoot */}
          <div style={{ height: '10vh' }} />
        </div>
      </div>
    </Scroll>
  );
};

export default Overlay;
