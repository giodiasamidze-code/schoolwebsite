import React from 'react';

/**
 * DynamicBackground — minimal static background.
 * Just a very subtle dot grid for texture. No aurora, no orbs, no mouse tracking.
 */
export default function DynamicBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        background: '#0c0608'
      }}
      aria-hidden="true"
    >
      {/* Subtle dot-grid texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 20%, transparent 80%)'
        }}
      />

      {/* One very subtle, static red glow — top-left */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '60vw',
          height: '60vh',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196,30,58,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />
    </div>
  );
}
