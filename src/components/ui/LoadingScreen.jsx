import React from 'react';
import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = () => {
  const { progress, active } = useProgress();
  const pct = Math.round(progress);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--bg-dark)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            gap: '1.5rem',
          }}
        >
          {/* Animated spinner ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
            style={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              border: '3px solid var(--glass-border)',
              borderTop: '3px solid var(--neon-cyan)',
              boxShadow: '0 0 18px var(--neon-cyan-glow)',
            }}
          />

          {/* Percentage counter */}
          <motion.span
            key={pct}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.15 }}
            style={{
              fontSize: '3.5rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: 'var(--neon-cyan)',
              textShadow: '0 0 20px var(--neon-cyan-glow)',
              lineHeight: 1,
            }}
          >
            {pct}%
          </motion.span>

          {/* Progress bar */}
          <div
            style={{
              width: 260,
              height: 3,
              background: 'var(--glass-border)',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <motion.div
              animate={{ width: `${pct}%` }}
              transition={{ ease: 'linear' }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-magenta))',
                boxShadow: '0 0 8px var(--neon-magenta-glow)',
              }}
            />
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', letterSpacing: '0.1em' }}>
            Loading 3D Assets…
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
