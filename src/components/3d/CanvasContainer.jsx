import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import { Perf } from 'r3f-perf';
import CarModel from './CarModel';
import ErrorBoundary from './ErrorBoundary';
import Lighting from './Lighting';
import ParticleExplosion from './ParticleExplosion';
import Overlay from '../ui/Overlay';
import LoadingScreen from '../ui/LoadingScreen';

// Detect mobile once at module level — avoids re-renders
const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

// Show the FPS/memory perf panel only in dev
const SHOW_PERF = import.meta.env.DEV;

const CanvasContainer = ({ formSuccess, setFormSuccess, theme, setTheme }) => {
  return (
    <>
      <LoadingScreen />
      <div
        className="canvas-container"
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1 }}
      >
        {/*
         * AUDIT FIX #3 — Canvas GL settings (clean, no duplicate keys):
         *
         * shadows: DISABLED globally — the car model has castShadow=false on all
         * meshes after the audit fix, so enabling shadows wastes GPU on depth
         * passes for nothing. Turning it off here eliminates the shadow render pass.
         *
         * antialias: off on mobile (MSAA costs ~30% fillrate on low-end GPUs)
         *
         * dpr: capped at [1, 2] desktop / [1, 1.5] mobile — avoids rendering
         * 9 × pixels on Retina 3× displays
         *
         * powerPreference: 'high-performance' — hints the OS/driver to use the
         * discrete GPU on hybrid laptop systems
         *
         * flat: true skips tone-mapping overhead since we handle it via materials
         */}
        <Canvas
          shadows={false}
          camera={{ position: [0, 1.5, 9], fov: isMobile ? 55 : 45, near: 0.5, far: 80 }}
          gl={{
            antialias: !isMobile,
            powerPreference: 'high-performance',
          }}
          dpr={isMobile ? [1, 1.5] : [1, 2]}
        >
          <color attach="background" args={['#050507']} />

          {/* FPS / GPU / Memory counter (dev only) */}
          {SHOW_PERF && <Perf position="bottom-right" minimal={false} />}

          <Suspense fallback={null}>
            <Lighting isMobile={isMobile} />

            {/* Particle explosion on form success */}
            {formSuccess && <ParticleExplosion isMobile={isMobile} />}

            {/* ScrollControls: 5 pages, moderate damping */}
            <ScrollControls pages={5} damping={0.3} maxSpeed={1.0}>
              <ErrorBoundary
                fallback={
                  <mesh position={[0, -1, 0]}>
                    <boxGeometry args={[2, 1, 4]} />
                    <meshStandardMaterial color="#0ff" wireframe />
                  </mesh>
                }
              >
                <CarModel isMobile={isMobile} />
              </ErrorBoundary>
              <Overlay
                formSuccess={formSuccess}
                setFormSuccess={setFormSuccess}
                theme={theme}
                setTheme={setTheme}
              />
            </ScrollControls>
          </Suspense>
        </Canvas>
      </div>
    </>
  );
};

export default CanvasContainer;
