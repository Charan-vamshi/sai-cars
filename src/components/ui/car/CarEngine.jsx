import React from 'react';

const CarEngine = ({ engine }) => (
  <div className="engine-section">
    <p className="section-label">Engine &amp; Performance</p>

    <div className="engine-grid">
      <div className="engine-cell">
        <p className="engine-cell-label">Engine</p>
        <p className="engine-cell-value">{engine.type}</p>
      </div>
      <div className="engine-cell">
        <p className="engine-cell-label">Displacement</p>
        <p className="engine-cell-value">{engine.displacement}</p>
      </div>
      <div className="engine-cell">
        <p className="engine-cell-label">Max Power</p>
        <p className="engine-cell-value">{engine.power}</p>
      </div>
      <div className="engine-cell">
        <p className="engine-cell-label">Max Torque</p>
        <p className="engine-cell-value">{engine.torque}</p>
      </div>
      <div className="engine-cell">
        <p className="engine-cell-label">Transmission</p>
        <div className="engine-tx-pills">
          {engine.transmission.map((t) => (
            <span key={t} className="tx-pill">{t}</span>
          ))}
        </div>
      </div>
      <div className="engine-cell">
        <p className="engine-cell-label">Drivetrain / Fuel Tank</p>
        <p className="engine-cell-value">{engine.drivetrain} &nbsp;·&nbsp; {engine.fuelTank}</p>
      </div>
      {engine.note && (
        <div className="engine-cell" style={{ gridColumn: '1 / -1' }}>
          <p className="engine-cell-label">Note</p>
          <p className="engine-cell-value" style={{ fontStyle: 'italic', opacity: 0.75 }}>
            {engine.note}
          </p>
        </div>
      )}
    </div>
  </div>
);

export default CarEngine;
