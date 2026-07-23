import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => (
  <section className="section-hero">
    <motion.h1
      className="hero-title neon-text-cyan"
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      Creative
      <br />
      <span className="neon-text-magenta">Developer</span>
    </motion.h1>

    <motion.p
      className="hero-subtitle"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 1.1, ease: 'easeOut' }}
    >
      Scroll to explore my interactive 3D universe — built with React&nbsp;Three&nbsp;Fiber.
    </motion.p>
  </section>
);

export default HeroSection;
