import React from 'react';
import { CARS } from '../../data/cars';

const Landing = ({ onScrollDown }) => (
  <section id="landing" className="section landing">
    <p className="landing-eyebrow">Car Enthusiast &nbsp;·&nbsp; Speed Junkie &nbsp;·&nbsp; Sai Charan Reddy</p>

    <h1 className="landing-name">
      Built for Speed,<br />
      <span style={{ color: 'var(--magenta)', WebkitTextFillColor: 'var(--magenta)' }}>
        Driven by Passion.
      </span>
    </h1>

    <p className="landing-tagline">
      Four cars. Four stories. One obsession with <span>machines that move</span>.
    </p>

    <div className="landing-cars-preview">
      {CARS.map((car, i) => (
        <button
          key={car.id}
          className="preview-chip"
          onClick={() => onScrollDown(i + 1)}
        >
          {car.name}
        </button>
      ))}
    </div>

    <div className="landing-scroll-cue" onClick={() => onScrollDown(1)}>
      <span>Scroll</span>
      <span className="scroll-chevron" />
    </div>
  </section>
);

export default Landing;
