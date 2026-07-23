import React from 'react';

const CarNote = ({ note, nextCar, onNext }) => (
  <div className="note-section">
    <p className="section-label">My Take</p>
    <div className="note-card">
      <p className="note-text">{note}</p>
      <p className="note-sig">— Sai Charan Reddy</p>
    </div>

    {/* Scroll cue into next car */}
    {nextCar && (
      <div className="next-car-strip" onClick={onNext} style={{ cursor: 'pointer' }}>
        <p className="next-car-label">Up Next</p>
        <p className="next-car-name">{nextCar}</p>
        <span className="next-car-arrow">↓</span>
      </div>
    )}
    {!nextCar && (
      <div style={{ textAlign: 'center', padding: '4rem 0 2rem', color: 'var(--text-muted)', fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        — End of the road. For now. —
      </div>
    )}
  </div>
);

export default CarNote;
