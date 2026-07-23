import React from 'react';
import { Environment } from '@react-three/drei';

// AUDIT NOTE: Only one directional light casts shadows (castShadow removed
// from the car meshes entirely, so this is moot). We keep lights cheap:
// - 1 ambient (free, no shadow)
// - 2 directional (no shadows)
// - 2 point lights (no shadows)
// - Environment for IBL reflections only (no real-time shadow RT)

const Lighting = ({ isMobile }) => (
  <>
    {/* Soft fill from all directions */}
    <ambientLight intensity={0.2} />

    {/* Cyan key from upper-right */}
    <directionalLight
      position={[8, 6, 4]}
      intensity={isMobile ? 1.6 : 2.2}
      color="#00ffff"
    />

    {/* Magenta fill from upper-left */}
    <directionalLight
      position={[-8, 6, 4]}
      intensity={isMobile ? 1.6 : 2.2}
      color="#ff00ff"
    />

    {/* White rim from behind — makes the car pop from the dark bg */}
    <pointLight position={[0, 3, -5]} intensity={isMobile ? 1.2 : 2.5} color="#ffffff" />

    {/* Subtle purple ground bounce */}
    <pointLight position={[0, -3, 1]} intensity={0.4} color="#2a0a40" />

    {/*
     * AUDIT FIX #4 — Environment preset:
     * 'apartment' is significantly lighter than 'city' (smaller HDR, faster IBL).
     * background={false} so the HDR cube doesn't render as a visible backdrop.
     */}
    <Environment preset="apartment" background={false} />
  </>
);

export default Lighting;
