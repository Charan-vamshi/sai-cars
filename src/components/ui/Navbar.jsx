import React from 'react';
import { CARS } from '../../data/cars';

const Navbar = ({ activeIndex, onNavClick }) => (
  <nav className="navbar">
    <a href="#landing" className="navbar-logo">SCR</a>
    <div className="navbar-dots">
      {/* Landing dot */}
      <div className="nav-dot-wrap">
        <button
          className={`nav-dot ${activeIndex === 0 ? 'active' : ''}`}
          onClick={() => onNavClick(0)}
          aria-label="Landing"
        />
      </div>
      {/* One dot per car */}
      {CARS.map((car, i) => (
        <div className="nav-dot-wrap" key={car.id}>
          <button
            className={`nav-dot ${activeIndex === i + 1 ? 'active' : ''}`}
            onClick={() => onNavClick(i + 1)}
            aria-label={car.name}
          />
          <span className="nav-dot-label">{car.name}</span>
        </div>
      ))}
    </div>
  </nav>
);

export default Navbar;
