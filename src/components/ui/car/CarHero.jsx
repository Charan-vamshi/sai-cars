import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useVelocity,
} from 'framer-motion';

// ─── Spring config for momentum/overshoot feel ────────────────────────────────
// Low stiffness + moderate damping = drifts in with momentum, overshoots
// slightly, then settles — like a car braking into position.
const SPRING = { stiffness: 60, damping: 18, mass: 1.1 };

// ─────────────────────────────────────────────────────────────────────────────
/**
 * @param {object} props
 * @param {object} props.car       - Car data object from cars.js
 * @param {boolean} props.priority - true for first car (eager load), false for rest (lazy)
 */
const CarHero = ({ car, priority = false }) => {
  const sectionRef  = useRef();
  const innerRef    = useRef();               // CSS 3D tilt target
  const mouseRef    = useRef({ x: 0, y: 0 }); // raw cursor normalised -1→1
  const tiltRef     = useRef({ x: 0, y: 0 }); // smoothed tilt
  const [rimStyle, setRimStyle] = useState({ x: 50, y: 40, opacity: 0 });

  // ── Scroll-driven drift ──────────────────────────────────────────────────────
  // useScroll tracks how far this section has scrolled into the viewport.
  // offset: "start end" = section top just touched viewport bottom (progress=0)
  //         "center center" = section centre is viewport centre (progress=1)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });

  // Velocity of the scroll progress — positive = scrolling down, negative = up.
  // Used to scale the initial drift offset so fast scroll = wilder motion.
  const scrollVelocity = useVelocity(scrollYProgress);

  // Raw transforms from scroll progress
  // Car starts 180px to the right (off-screen-ish), settles to 0
  const rawX       = useTransform(scrollYProgress, [0, 1], [180, 0]);
  const rawY       = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.25, 1], [0, 0.6, 1]);
  const rawScale   = useTransform(scrollYProgress, [0, 1], [0.82, 1]);

  // Wrap with spring for momentum / overshoot
  const x       = useSpring(rawX,       SPRING);
  const y       = useSpring(rawY,       SPRING);
  const opacity = useSpring(rawOpacity, { stiffness: 80, damping: 22 });
  const scale   = useSpring(rawScale,   SPRING);

  // ── Cursor tilt via rAF (mutates DOM directly — no setState) ────────────────
  const onMouseMove = useCallback((e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left)  / rect.width  - 0.5;  // -0.5 → 0.5
    const ny = (e.clientY - rect.top)   / rect.height - 0.5;

    mouseRef.current.x = nx;
    mouseRef.current.y = ny;

    // Rim-light: radial gradient positioned near cursor — only setState here
    // (not in rAF) so React batches it. Low frequency, not per-frame.
    setRimStyle({
      x:       (nx + 0.5) * 100,
      y:       (ny + 0.5) * 100,
      opacity: 0.55,
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    mouseRef.current.x = 0;
    mouseRef.current.y = 0;
    setRimStyle((s) => ({ ...s, opacity: 0 }));
  }, []);

  // rAF loop for silky-smooth tilt — never calls setState
  useEffect(() => {
    let raf;
    const tick = () => {
      tiltRef.current.x += (mouseRef.current.x - tiltRef.current.x) * 0.07;
      tiltRef.current.y += (mouseRef.current.y - tiltRef.current.y) * 0.07;

      if (innerRef.current) {
        const rx = -tiltRef.current.y * 9;   // ±9° vertical
        const ry =  tiltRef.current.x * 12;  // ±12° horizontal
        innerRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="car-hero"
      ref={sectionRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Text header — fades up independently */}
      <motion.div
        style={{ opacity, y: useTransform(scrollYProgress, [0, 1], [24, 0]) }}
        className="car-hero-text"
      >
        <p className="car-hero-category">{car.category}</p>
        <h2 className="car-hero-name">{car.name}</h2>
        <p className="car-hero-tagline">{car.tagline}</p>
      </motion.div>

      {/* ── Car image wrapper — scroll drift ────────────────────────────────── */}
      <motion.div
        className="car-img-wrap"
        style={{ x, y, opacity, scale }}
      >
        {/* Fog/atmosphere layer (behind car, slow CSS drift animation) */}
        <div
          className="car-fog"
          style={{
            background: `radial-gradient(ellipse 75% 45% at 50% 65%,
              ${car.accentColor}20 0%,
              ${car.accentColor}08 55%,
              transparent 100%)`,
          }}
        />

        {/* Ground glow line */}
        <div
          className="car-ground-glow"
          style={{ background: car.accentColor }}
        />

        {/* 3D perspective tilt container */}
        <div className="car-tilt-perspective">
          <div className="car-img-inner" ref={innerRef}>

            {/* The car image — primary visual element */}
            <img
              src={car.image}
              alt={car.name}
              draggable={false}
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : 'low'}
              width={940}
              height={529}
              style={{ position: 'relative', zIndex: 2 }}
            />

            {/* Rim light: radial gradient that follows cursor */}
            <div
              className="car-rimlight"
              style={{
                background: `radial-gradient(circle at ${rimStyle.x}% ${rimStyle.y}%,
                  ${car.accentColor}50 0%,
                  ${car.accentColor}18 35%,
                  transparent 65%)`,
                opacity: rimStyle.opacity,
                transition: 'opacity 0.4s ease',
              }}
            />

            {/* Ground reflection */}
            <div
              className="car-reflection"
              style={{
                background: `linear-gradient(to bottom,
                  transparent 0%,
                  ${car.accentColor}15 60%,
                  ${car.accentColor}08 100%)`,
              }}
            />
          </div>
        </div>

        {/* Glow halo under car */}
        <div
          className="car-glow-halo"
          style={{ background: car.accentColor }}
        />
      </motion.div>
    </div>
  );
};

export default CarHero;
