import React from 'react';

const CarFeatures = ({ features }) => (
  <div className="features-section">
    <p className="section-label">Standout Features</p>
    <div className="features-grid">
      {features.map((f) => (
        <div className="feature-card" key={f.title}>
          <span className="feature-icon">{f.icon}</span>
          <p className="feature-title">{f.title}</p>
          <p className="feature-desc">{f.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

export default CarFeatures;
