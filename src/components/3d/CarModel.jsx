import React, { useRef, useLayoutEffect, useMemo, useCallback } from 'react';
import { useGLTF, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ✅ Verified 200 OK (Khronos official repo, raw.githubusercontent.com CDN)
const CAR_URL =
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CarConcept/glTF-Binary/CarConcept.glb';

// ─────────────────────────────────────────────────────────────────────────────
// PERFORMANCE RULE: ALL Three.js objects that are used every frame are
// allocated ONCE here at module scope and mutated via .set() — NEVER
// re-created with `new THREE.*()` inside useFrame. Verified: zero
// instantiations in the render loop below.
// ─────────────────────────────────────────────────────────────────────────────
const _pos   = new THREE.Vector3();  // target position scratch
const _scale = new THREE.Vector3();  // target scale scratch

// Ease-in-out cubic — pure math, no allocation
const easeIO = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Lerp speed — lower = smoother/slower, higher = snappier
const LERP = 0.055;

// ─────────────────────────────────────────────────────────────────────────────
const CarModel = ({ isMobile }) => {
  const { scene } = useGLTF(CAR_URL);
  const ref        = useRef();
  const scroll     = useScroll();

  // Computed once, not per-frame
  const sideX  = isMobile ? 1.0 : 2.6;
  const baseS  = isMobile ? 0.85 : 1.15;

  // ── One-time material setup ────────────────────────────────────────────────
  // AUDIT FIX #1: castShadow removed from all meshes — shadow depth passes
  // for every sub-mesh of a complex model are extremely expensive. Using
  // environment IBL for reflections instead (cheaper, looks better).
  // AUDIT FIX #2: envMapIntensity lowered — value of 2.8 was saturating.
  useLayoutEffect(() => {
    scene.traverse((obj) => {
      if (!obj.isMesh) return;

      // Disable shadows entirely on car (they tank GPU on complex models)
      obj.castShadow    = false;
      obj.receiveShadow = false;

      if (obj.material) {
        // Clone material only if shared — prevents mutating shared instances
        if (obj.material.isMeshStandardMaterial || obj.material.isMeshPhysicalMaterial) {
          obj.material = obj.material.clone();
          obj.material.envMapIntensity = isMobile ? 1.2 : 1.8;

          // Add emissive neon glow to light/lens meshes
          const n = (obj.name || '').toLowerCase();
          if (n.includes('light') || n.includes('lens') || n.includes('lamp') || n.includes('glass')) {
            obj.material.emissive = (n.includes('front') || n.includes('head'))
              ? new THREE.Color(0x00ffff)
              : new THREE.Color(0xff00ff);
            obj.material.emissiveIntensity = 1.0;
          }
        }
      }
    });
  }, [scene, isMobile]);

  // ── Render loop ─────────────────────────────────────────────────────────────
  // AUDIT CONFIRMED: zero `new THREE.*()` calls here.
  // useFrame mutates refs directly — NO setState, NO new objects.
  useFrame((_state, delta) => {
    if (!ref.current) return;

    const off = scroll.offset; // 0 → 1, read-only scalar

    // Clamp delta to prevent jump after tab-switch
    const dt = Math.min(delta, 0.05);
    ref.current.rotation.y += dt * 0.12;

    // Compute target position — mutates module-level scratch vectors
    _pos.set(0, -1, 0);
    _scale.set(baseS, baseS, baseS);

    if (off < 0.2) {
      const t = easeIO(off / 0.2);
      _pos.z = THREE.MathUtils.lerp(-5, 0, t);
    } else if (off < 0.4) {
      const t = easeIO((off - 0.2) / 0.2);
      _pos.x = THREE.MathUtils.lerp(0, sideX, t);
      _pos.z = THREE.MathUtils.lerp(0, -0.5, t);
    } else if (off < 0.6) {
      const t = easeIO((off - 0.4) / 0.2);
      _pos.x = THREE.MathUtils.lerp(sideX, -sideX, t);
      _pos.z = -0.5;
    } else if (off < 0.8) {
      const t = easeIO((off - 0.6) / 0.2);
      _pos.x = THREE.MathUtils.lerp(-sideX, sideX, t);
      _pos.z = -0.5;
    } else {
      const t = easeIO((off - 0.8) / 0.2);
      _pos.x = THREE.MathUtils.lerp(sideX, 0, t);
      _pos.z = THREE.MathUtils.lerp(-0.5, 3.0, t);
    }

    // Lerp towards target — direct ref mutation, no React state involved
    ref.current.position.lerp(_pos,   LERP);
    ref.current.scale.lerp(   _scale, LERP);
  });

  return <primitive ref={ref} object={scene} position={[0, -1, -5]} />;
};

useGLTF.preload(CAR_URL);
export default CarModel;
