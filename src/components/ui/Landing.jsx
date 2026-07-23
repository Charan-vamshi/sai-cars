import React from 'react';
import { CARS } from '../../data/cars';

const Landing = ({ onScrollDown }) => (
  <>
    {/* Skip-to-content for keyboard/screen reader users */}
    <a
      href="#car-tigor"
      className="skip-link"
      aria-label="Skip to main content"
    >
      Skip to content
    </a>

    <section
      id="landing"
      className="section landing"
      aria-label="Hero — Sai Charan Reddy car showcase"
    >
      <p className="landing-eyebrow">
        Car Enthusiast &nbsp;·&nbsp; Speed Junkie &nbsp;·&nbsp; Sai Charan Reddy
      </p>

      <h1 className="landing-name">
        Built for Speed,<br />
        <span style={{ color: 'var(--magenta)', WebkitTextFillColor: 'var(--magenta)' }}>
          Driven by Passion.
        </span>
      </h1>

      <p className="landing-tagline">
        Four cars. Four stories. One obsession with <span>machines that move</span>.
      </p>

      <div
        className="landing-cars-preview"
        role="list"
        aria-label="Jump to car section"
      >
        {CARS.map((car, i) => (
          <button
            key={car.id}
            className="preview-chip"
            onClick={() => onScrollDown(i + 1)}
            aria-label={`Jump to ${car.name} section`}
            role="listitem"
          >
            {car.name}
          </button>
        ))}
      </div>

      <div
        className="landing-scroll-cue"
        onClick={() => onScrollDown(1)}
        role="button"
        tabIndex={0}
        aria-label="Scroll to first car"
        onKeyDown={(e) => e.key === 'Enter' && onScrollDown(1)}
      >
        <span>Scroll</span>
        <span className="scroll-chevron" aria-hidden="true" />
      </div>

      {/* Keyboard nav hint */}
      <p className="keyboard-hint" aria-hidden="true">
        Use <kbd>↑</kbd> <kbd>↓</kbd> arrow keys to navigate
      </p>
    </section>
  </>
);

export default Landing;
