import React from 'react';
import { Canvas } from '@react-three/fiber';
import BackgroundToys from './BackgroundScene';

// Fixed full-viewport canvas — persists across all pages.
// antialias: false, DPR capped at 1.5 — keeps background perf cost negligible.
const BackgroundCanvas = () => (
  <Canvas
    style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    camera={{ position: [0, 0, 7], fov: 58, near: 0.1, far: 60 }}
    shadows={false}
    gl={{ antialias: false, powerPreference: 'high-performance' }}
    dpr={[1, 1.5]}
  >
    <color attach="background" args={['#040408']} />

    {/* Lights — needed for MeshStandardMaterial to show form/depth on toy cars.
        No shadows = cheap. Ambient gives base visibility; two directionals add
        neon-coloured rim lighting that makes the cars read as solid objects. */}
    <ambientLight intensity={0.18} />
    <directionalLight position={[6, 8, 4]}  intensity={0.7} color="#00e5ff" />
    <directionalLight position={[-6, 4, -3]} intensity={0.5} color="#ff00ff" />
    <directionalLight position={[0, -4, 6]}  intensity={0.25} color="#ffffff" />

    {/* 14 miniature toy cars drifting across the background */}
    <BackgroundToys />
  </Canvas>
);

export default BackgroundCanvas;
