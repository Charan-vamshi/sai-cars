import React from 'react';
import { CARS } from '../../data/cars';

const Navbar = ({ activeIndex, onNavClick }) => (
  <nav className="navbar" role="navigation" aria-label="Section navigation">
    <a href="#landing" className="navbar-logo" aria-label="Go to landing page">
      SCR
    </a>

    <div className="navbar-dots" role="list" aria-label="Page sections">
      {/* Landing dot */}
      <div className="nav-dot-wrap" role="listitem">
        <button
          className={`nav-dot ${activeIndex === 0 ? 'active' : ''}`}
          onClick={() => onNavClick(0)}
          aria-label="Go to Home"
          aria-current={activeIndex === 0 ? 'page' : undefined}
          title="Home"
        />
      </div>

      {/* One dot per car */}
      {CARS.map((car, i) => (
        <div className="nav-dot-wrap" key={car.id} role="listitem">
          <button
            className={`nav-dot ${activeIndex === i + 1 ? 'active' : ''}`}
            onClick={() => onNavClick(i + 1)}
            aria-label={`Go to ${car.name}`}
            aria-current={activeIndex === i + 1 ? 'page' : undefined}
            title={car.name}
          />
          <span className="nav-dot-label" aria-hidden="true">{car.name}</span>
        </div>
      ))}
    </div>
  </nav>
);

export default Navbar;
