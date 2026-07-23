import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// AUDIT FIX #5 — Particle system:
// - Velocity stored in a Float32Array (typed array — ~4× faster iteration than JS Array)
// - All data is component-scoped via useMemo (no shared module-level state bug)
// - Particle count capped at 600 desktop / 250 mobile — beyond this the
//   per-frame Float32Array scan becomes the bottleneck, not render
// - Uses <points> with a single draw call (not individual meshes)

const ParticleExplosion = ({ isMobile }) => {
  const pointsRef   = useRef();
  const particleN   = isMobile ? 250 : 600;

  // Allocate all typed arrays once, inside the component lifetime via useMemo
  const { positions, colors, velocities } = useMemo(() => {
    const positions  = new Float32Array(particleN * 3);
    const colors     = new Float32Array(particleN * 3);
    const velocities = new Float32Array(particleN * 3); // flat: [vx,vy,vz, vx,vy,vz, ...]

    for (let i = 0; i < particleN; i++) {
      const i3 = i * 3;

      // Spawn tightly around origin
      positions[i3]     = (Math.random() - 0.5) * 0.3;
      positions[i3 + 1] = (Math.random() - 0.5) * 0.3;
      positions[i3 + 2] = (Math.random() - 0.5) * 0.3;

      // Color mix: 45% cyan, 45% magenta, 10% white
      const r = Math.random();
      if (r < 0.45) {
        colors[i3] = 0; colors[i3 + 1] = 1; colors[i3 + 2] = 1; // cyan
      } else if (r < 0.9) {
        colors[i3] = 1; colors[i3 + 1] = 0; colors[i3 + 2] = 1; // magenta
      } else {
        colors[i3] = 1; colors[i3 + 1] = 1; colors[i3 + 2] = 1; // white sparkle
      }

      // Spherical burst
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(Math.random() * 2 - 1);
      const spd   = Math.random() * 0.2 + 0.04;
      velocities[i3]     = Math.sin(phi) * Math.cos(theta) * spd;
      velocities[i3 + 1] = Math.sin(phi) * Math.sin(theta) * spd;
      velocities[i3 + 2] = Math.cos(phi) * spd;
    }

    return { positions, colors, velocities };
  }, [particleN]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const posArr = pointsRef.current.geometry.attributes.position.array;

    for (let i3 = 0; i3 < particleN * 3; i3 += 3) {
      posArr[i3]     += velocities[i3];
      posArr[i3 + 1] += velocities[i3 + 1];
      posArr[i3 + 2] += velocities[i3 + 2];
      // Apply drag
      velocities[i3]     *= 0.93;
      velocities[i3 + 1] *= 0.93;
      velocities[i3 + 2] *= 0.93;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} position={[0, 0, 1]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleN}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleN}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.06 : 0.09}
        vertexColors
        transparent
        opacity={0.92}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
};

export default ParticleExplosion;
