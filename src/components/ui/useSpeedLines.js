import { useEffect, useRef } from 'react';

// Draws radial speed-lines on a fixed canvas overlay for ~600ms on transition.
// Pure canvas 2D — zero React renders, zero Three.js overhead.
const useSpeedLines = () => {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    // Create and append canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'speed-canvas';
    canvas.style.cssText =
      'position:fixed;inset:0;z-index:998;pointer-events:none;opacity:0;';
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    const onResize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      canvas.remove();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const trigger = (forward = true) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx  = canvas.width  / 2;
    const cy  = canvas.height / 2;
    const color = forward ? '#00e5ff' : '#ff00ff';
    const lineCount = 60;
    const duration = 600; // ms
    const start = performance.now();

    cancelAnimationFrame(rafRef.current);
    canvas.style.opacity = '1';

    const draw = (now) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // Ease-in fast, ease-out slow
      const alpha = t < 0.3
        ? t / 0.3 * 0.85                  // ramp up
        : (1 - (t - 0.3) / 0.7) * 0.85;  // ramp down

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < lineCount; i++) {
        const angle  = (i / lineCount) * Math.PI * 2;
        const spread = forward ? t * 0.25 : 0.25 - t * 0.25; // lines spread out on forward
        const r1 = 60  + spread * canvas.width * 0.4;
        const r2 = r1  + 80 + t * canvas.width * 0.45;

        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
        ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
        ctx.strokeStyle = color;
        ctx.lineWidth = forward ? 1.5 - t : 0.8 + t;
        ctx.globalAlpha = alpha * (0.5 + 0.5 * Math.random());
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      if (t < 1) {
        rafRef.current = requestAnimationFrame(draw);
      } else {
        canvas.style.opacity = '0';
      }
    };

    rafRef.current = requestAnimationFrame(draw);
  };

  return trigger;
};

export default useSpeedLines;
