import { defineConfig } from 'vite';
import react            from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    // Suppress the 500 kB chunk warning — Three.js is intentionally large
    chunkSizeWarningLimit: 1500,

    // No source maps in production — keeps bundle lean
    sourcemap: false,

    // Target modern browsers — smaller output (no IE/legacy polyfills)
    target: 'es2020',
  },

  // Pre-bundle heavy deps so dev-server HMR stays fast on cold start
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei', 'framer-motion'],
  },
});
