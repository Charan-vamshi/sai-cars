# 🚗 Sai Cars — 3D Interactive Car Showcase

> A cinematic, scroll-driven 3D car showcase built with React, Three.js, and Framer Motion. Explore 4 cars with immersive animations, real spec data, and cursor-reactive effects.

![Tech Stack](https://img.shields.io/badge/React-19-61DAFB?logo=react) ![Three.js](https://img.shields.io/badge/Three.js-R3F-black?logo=threedotjs) ![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-pink)

---

## ✨ Features

- **3D Background** — 14 miniature toy cars (InstancedMesh, 8 draw calls) drifting with cursor parallax
- **Cinematic scroll drift** — Cars enter/exit with spring-physics momentum via Framer Motion `useScroll` + `useSpring`
- **Cursor-reactive 3D tilt** — CSS perspective + rAF lerp loop (no setState in render loop)
- **Rim-light effect** — Radial gradient overlay that tracks cursor position, simulating light off the car body
- **Animated stat counters** — Count up from 0 on scroll-into-view with ease-out cubic
- **Visual dimension bars** — Animated width bars proportional to real spec values
- **Speed-line transitions** — Canvas2D radial burst between sections
- **Keyboard navigation** — Arrow Up/Down to jump between sections

---

## 🚙 Cars Featured

| # | Car | Category | Engine |
|---|-----|----------|--------|
| 1 | Tata Tigor | Sedan | 1.2L Revotron NA Petrol |
| 2 | Volkswagen Taigun | Compact SUV | 1.5L TSI EVO GT Turbo |
| 3 | Tata Nexon | Compact SUV | 1.2L Turbocharged Revotron |
| 4 | Renault Kiger | Compact SUV | 1.0L TCe Turbo Petrol |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 8 |
| 3D Rendering | Three.js via `@react-three/fiber` |
| Animations | Framer Motion 12 |
| 3D Helpers | `@react-three/drei` |
| Styling | Vanilla CSS with custom design tokens |
| Fonts | Inter · Outfit · Orbitron (Google Fonts) |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

---

## 📁 Project Structure

```
src/
├── data/
│   └── cars.js              # All 4 car specs, features, personal notes
├── components/
│   ├── 3d/
│   │   ├── BackgroundScene.jsx  # InstancedMesh toy cars (14 × 4 parts)
│   │   ├── BackgroundCanvas.jsx # Fixed R3F canvas, persistent across pages
│   │   └── ...
│   └── ui/
│       ├── car/
│       │   ├── CarHero.jsx      # Scroll drift + cursor tilt + rim-light
│       │   ├── CarStats.jsx     # Animated count-up counters
│       │   ├── CarDimensions.jsx# Animated bar chart
│       │   ├── CarEngine.jsx    # Engine spec table
│       │   ├── CarFeatures.jsx  # Feature icon grid
│       │   └── CarNote.jsx      # Personal note + next-car cue
│       ├── Landing.jsx
│       ├── Navbar.jsx
│       └── CarPage.jsx
└── index.css                # Design system, tokens, animations
```

---

## ⚡ Performance

- Background: **8 draw calls** for all 14 toy cars (InstancedMesh batching)
- No shadows on background scene
- DPR capped at `[1, 1.5]` — prevents 3× pixel rendering on Retina
- `useFrame` mutates refs directly — zero React state updates per frame
- All Three.js scratch objects allocated at module scope (zero GC pressure in render loop)

---

## 🎨 Design

Dark theme with **neon cyan `#00e5ff`** and **neon magenta `#ff00ff`** accents on a near-black `#040408` background. Each car section overrides `--car-accent` CSS variable:

- Tigor → Cyan
- Taigun → Cyan / VW Blue  
- Nexon → Orange `#ff6d00`
- Kiger → Yellow `#ffd600`

---

*Built by Sai Charan Reddy*
