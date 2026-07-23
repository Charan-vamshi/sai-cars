import React, { useRef, useEffect, useState } from 'react';

// Animates the bar width from 0 → target% once scrolled into view
const DimBar = ({ dim }) => {
  const ref       = useRef();
  const [pct, setPct] = useState(0);
  const targetPct = Math.round((dim.value / dim.max) * 100);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Small delay so the user sees the bar animate in
          setTimeout(() => setPct(targetPct), 120);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [targetPct]);

  return (
    <div className="dim-row" ref={ref}>
      <span className="dim-label">{dim.label}</span>
      <div className="dim-bar-track">
        <div
          className="dim-bar-fill"
          style={{
            width: `${pct}%`,
            transition: pct > 0 ? 'width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
          }}
        />
      </div>
      <span className="dim-value">
        {dim.value.toLocaleString('en-IN')}&nbsp;{dim.unit}
      </span>
    </div>
  );
};

const CarDimensions = ({ dimensions }) => (
  <div className="dimensions-section">
    <p className="section-label">Dimensions &amp; Capacity</p>
    {dimensions.map((d) => (
      <DimBar key={d.label} dim={d} />
    ))}
  </div>
);

export default CarDimensions;
