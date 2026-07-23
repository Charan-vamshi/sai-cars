import React, { useRef, useEffect, useState } from 'react';

// Eases a number from 0 → target over ~1.5s when scrolled into view
const useCountUp = (target, duration = 1500, decimals = 0) => {
  const [value, setValue] = useState(0);
  const ref               = useRef();
  const triggered         = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          const start = performance.now();
          const tick  = (now) => {
            const pct = Math.min((now - start) / duration, 1);
            // Ease-out cubic
            const ease = 1 - Math.pow(1 - pct, 3);
            setValue(parseFloat((target * ease).toFixed(decimals)));
            if (pct < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration, decimals]);

  return { value, ref };
};

const StatItem = ({ stat }) => {
  const decimals = Number.isInteger(stat.value) ? 0 : 1;
  const { value, ref } = useCountUp(stat.value, 1500, decimals);

  return (
    <div className="stat-item" ref={ref}>
      <span className="stat-value">
        {value.toLocaleString('en-IN', { minimumFractionDigits: decimals })}
      </span>
      <p className="stat-unit">{stat.unit}</p>
      <p className="stat-label">{stat.label}</p>
    </div>
  );
};

const CarStats = ({ stats }) => (
  <div className="stat-row">
    {stats.map((s, i) => (
      <React.Fragment key={s.label}>
        <StatItem stat={s} />
        {i < stats.length - 1 && <div className="stat-divider" />}
      </React.Fragment>
    ))}
  </div>
);

export default CarStats;
