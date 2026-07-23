import React, { useRef, useMemo } from 'react';
import { useFrame }                from '@react-three/fiber';
import * as THREE                  from 'three';

// ─── Shared cursor state — written by App, read in useFrame (zero React cost) ─
export let _cursorX = 0;
export let _cursorY = 0;
export const setCursorPos = (nx, ny) => { _cursorX = nx; _cursorY = ny; };

// ─────────────────────────────────────────────────────────────────────────────
// Shared geometries — allocated once at module scope, reused by all instances.
// BoxGeometry / CylinderGeometry are extremely lightweight (< 200 vertices each).
// ─────────────────────────────────────────────────────────────────────────────
const BODY_GEO  = new THREE.BoxGeometry(2.0,  0.52, 1.0);
const CABIN_GEO = new THREE.BoxGeometry(1.15, 0.44, 0.82);
const WHEEL_GEO = new THREE.CylinderGeometry(0.29, 0.29, 0.22, 10);
const HEAD_GEO  = new THREE.BoxGeometry(0.06, 0.14, 0.22);

// ─── Shared materials ─────────────────────────────────────────────────────────
const sm = (color, emissive, eI, rough, metal) =>
  new THREE.MeshStandardMaterial({
    color, emissive, emissiveIntensity: eI,
    roughness: rough ?? 0.55, metalness: metal ?? 0.45,
  });

const C_BODY  = sm('#05050f', '#00e5ff', 0.22);
const C_CABIN = sm('#07071a', '#00e5ff', 0.10);
const C_WHEEL = sm('#0a0a0a', '#00e5ff', 0.55, 0.7, 0.3);
const C_HEAD  = new THREE.MeshBasicMaterial({ color: '#00e5ff' });

const M_BODY  = sm('#0f0508', '#ff00ff', 0.22);
const M_CABIN = sm('#1a0714', '#ff00ff', 0.10);
const M_WHEEL = sm('#0a0a0a', '#ff00ff', 0.55, 0.7, 0.3);
const M_HEAD  = new THREE.MeshBasicMaterial({ color: '#ff00ff' });

// ─── Scratch Object3D — never re-created in useFrame ─────────────────────────
const _obj = new THREE.Object3D();

// ─── Local offsets (car-space coordinates) ────────────────────────────────────
const W_OFF = [            // [local-x, local-y, local-z] per wheel
  [-0.72, -0.28,  0.58],   // front-left
  [ 0.72, -0.28,  0.58],   // front-right
  [-0.72, -0.28, -0.58],   // rear-left
  [ 0.72, -0.28, -0.58],   // rear-right
];
const H_OFF = [            // headlight positions
  [1.03,  0.06,  0.30],
  [1.03,  0.06, -0.30],
];

// ─── Instance counts ──────────────────────────────────────────────────────────
const N  = 14;          // total background toy cars
const NC = 7;           // cyan cars (indices 0 … NC-1)
const NM = N - NC;      // magenta cars (indices NC … N-1)

// ─── Place a car part into _obj.matrix ────────────────────────────────────────
// Rotates the local offset (lx, lz) by the car's Y-yaw then sets the matrix.
const applyPart = (lx, ly, lz, bx, by, bz, rotY, rotX, sc, rx, ry, rz) => {
  const c = Math.cos(rotY);
  const s = Math.sin(rotY);
  _obj.position.set(bx + (lx * c - lz * s) * sc,  by + ly * sc,  bz + (lx * s + lz * c) * sc);
  _obj.rotation.set(rx ?? rotX,  ry ?? rotY,  rz ?? 0);
  _obj.scale.setScalar(sc);
  _obj.updateMatrix();
};

// ─────────────────────────────────────────────────────────────────────────────
const BackgroundToys = () => {
  const cBodyRef  = useRef();
  const cCabinRef = useRef();
  const cWheelRef = useRef();
  const cHeadRef  = useRef();
  const mBodyRef  = useRef();
  const mCabinRef = useRef();
  const mWheelRef = useRef();
  const mHeadRef  = useRef();

  // Per-car physics state — Float32Arrays for cache efficiency
  const st = useMemo(() => {
    const px  = new Float32Array(N);
    const py  = new Float32Array(N);
    const pz  = new Float32Array(N);
    const vx  = new Float32Array(N);
    const vy  = new Float32Array(N);
    const ry0 = new Float32Array(N);
    const spd = new Float32Array(N);
    const sc  = new Float32Array(N);
    const par = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      px[i]  = (Math.random() - 0.5) * 34;
      py[i]  = (Math.random() - 0.5) * 20;
      pz[i]  = -4 - Math.random() * 9;
      vx[i]  = (Math.random() - 0.5) * 0.0045;
      vy[i]  = (Math.random() - 0.5) * 0.0030;
      ry0[i] = Math.random() * Math.PI * 2;
      spd[i] = (Math.random() < 0.5 ? 1 : -1) * (0.06 + Math.random() * 0.18);
      sc[i]  = 0.17 + Math.random() * 0.17;   // 0.17–0.34 (miniature)
      par[i] = 0.4  + Math.random() * 0.9;    // per-car parallax depth
    }
    return { px, py, pz, vx, vy, ry0, spd, sc, par };
  }, []);

  useFrame(({ clock }) => {
    const { px, py, pz, vx, vy, ry0, spd, sc, par } = st;
    const t  = clock.elapsedTime;

    for (let i = 0; i < N; i++) {
      // Drift + wrap
      px[i] += vx[i];
      py[i] += vy[i];
      if (px[i] >  17) px[i] = -17;
      if (px[i] < -17) px[i] =  17;
      if (py[i] >  10) py[i] = -10;
      if (py[i] < -10) py[i] =  10;

      // Final world pos = drift + cursor parallax offset
      const bx = px[i] - _cursorX * par[i];
      const by = py[i] - _cursorY * par[i] * 0.55;
      const bz = pz[i];

      const rotY = ry0[i] + t * spd[i];
      const rotX = Math.sin(t * 0.26 + i * 1.4) * 0.10;

      const isCyan = i < NC;
      const li = isCyan ? i : i - NC;

      const bR = isCyan ? cBodyRef  : mBodyRef;
      const cR = isCyan ? cCabinRef : mCabinRef;
      const wR = isCyan ? cWheelRef : mWheelRef;
      const hR = isCyan ? cHeadRef  : mHeadRef;

      // Body
      applyPart(0, 0, 0, bx, by, bz, rotY, rotX, sc[i]);
      bR.current?.setMatrixAt(li, _obj.matrix);

      // Cabin — raised by 0.48 units (half body + half cabin)
      applyPart(0.05, 0.48, 0, bx, by, bz, rotY, rotX, sc[i]);
      cR.current?.setMatrixAt(li, _obj.matrix);

      // Wheels — each rotated to stand upright and spin
      for (let w = 0; w < 4; w++) {
        const [lx, ly, lz] = W_OFF[w];
        applyPart(lx, ly, lz, bx, by, bz, rotY, rotX, sc[i],
          Math.PI / 2,            // stand wheel upright (cylinder axis → horizontal)
          rotY + Math.PI / 2,     // align with car direction
          t * spd[i] * 8,         // rolling spin
        );
        wR.current?.setMatrixAt(li * 4 + w, _obj.matrix);
      }

      // Headlights
      for (let h = 0; h < 2; h++) {
        const [lx, ly, lz] = H_OFF[h];
        applyPart(lx, ly, lz, bx, by, bz, rotY, rotX, sc[i]);
        hR.current?.setMatrixAt(li * 2 + h, _obj.matrix);
      }
    }

    // Mark all matrices dirty
    [cBodyRef, cCabinRef, cWheelRef, cHeadRef,
     mBodyRef, mCabinRef, mWheelRef, mHeadRef].forEach((r) => {
      if (r.current) r.current.instanceMatrix.needsUpdate = true;
    });
  });

  return (
    <>
      {/* Cyan cars */}
      <instancedMesh ref={cBodyRef}  args={[BODY_GEO,  C_BODY,  NC]}     frustumCulled={false} />
      <instancedMesh ref={cCabinRef} args={[CABIN_GEO, C_CABIN, NC]}     frustumCulled={false} />
      <instancedMesh ref={cWheelRef} args={[WHEEL_GEO, C_WHEEL, NC * 4]} frustumCulled={false} />
      <instancedMesh ref={cHeadRef}  args={[HEAD_GEO,  C_HEAD,  NC * 2]} frustumCulled={false} />

      {/* Magenta cars */}
      <instancedMesh ref={mBodyRef}  args={[BODY_GEO,  M_BODY,  NM]}     frustumCulled={false} />
      <instancedMesh ref={mCabinRef} args={[CABIN_GEO, M_CABIN, NM]}     frustumCulled={false} />
      <instancedMesh ref={mWheelRef} args={[WHEEL_GEO, M_WHEEL, NM * 4]} frustumCulled={false} />
      <instancedMesh ref={mHeadRef}  args={[HEAD_GEO,  M_HEAD,  NM * 2]} frustumCulled={false} />
    </>
  );
};

export default BackgroundToys;
