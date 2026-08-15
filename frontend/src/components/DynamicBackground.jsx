import React, { useEffect, useRef } from 'react';

export default function DynamicBackground() {
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const orb3Ref = useRef(null);
  const gridGlowRef = useRef(null);

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetX = mouseX;
    let targetY = mouseY;
    let animFrameId;

    const onMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (gridGlowRef.current) {
        gridGlowRef.current.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(212, 175, 55, 0.07), rgba(196, 30, 58, 0.03) 40%, transparent 80%)`;
      }
    };

    const loop = () => {
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      const normX = (mouseX / window.innerWidth - 0.5) * 60;
      const normY = (mouseY / window.innerHeight - 0.5) * 60;

      if (orb1Ref.current) {
        orb1Ref.current.style.transform = `translate3d(${normX * 1.2}px, ${normY * 1.2}px, 0)`;
      }
      if (orb2Ref.current) {
        orb2Ref.current.style.transform = `translate3d(${-normX * 0.9}px, ${-normY * 0.9}px, 0)`;
      }
      if (orb3Ref.current) {
        orb3Ref.current.style.transform = `translate3d(${normX * 0.6}px, ${normY * 0.6}px, 0)`;
      }

      animFrameId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    loop();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        background: '#18090b'
      }}
      aria-hidden="true"
    >
      {/* Base Deep Velvet Gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #18090b 0%, #240e12 50%, #100507 100%)'
        }}
      />

      {/* Layer 1: Moving Aurora Glow Orbs */}
      <div
        ref={orb1Ref}
        className="aurora-orb-1"
        style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '650px',
          height: '650px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196, 30, 58, 0.22) 0%, rgba(139, 0, 0, 0.08) 60%, transparent 80%)',
          filter: 'blur(130px)',
          willChange: 'transform'
        }}
      />

      <div
        ref={orb2Ref}
        className="aurora-orb-2"
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '8%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.16) 0%, rgba(212, 175, 55, 0.04) 60%, transparent 80%)',
          filter: 'blur(140px)',
          willChange: 'transform'
        }}
      />

      <div
        ref={orb3Ref}
        className="aurora-orb-3"
        style={{
          position: 'absolute',
          top: '55%',
          left: '45%',
          width: '750px',
          height: '750px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 0, 0, 0.2) 0%, rgba(36, 14, 18, 0.1) 60%, transparent 80%)',
          filter: 'blur(150px)',
          willChange: 'transform'
        }}
      />

      {/* Layer 2: Tech Blueprint Architecture Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '54px 54px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 40%, rgba(0, 0, 0, 0.6) 80%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 40%, rgba(0, 0, 0, 0.6) 80%, transparent 100%)'
        }}
      />

      {/* Layer 3: Interactive Grid Mouse Illumination */}
      <div
        ref={gridGlowRef}
        style={{
          position: 'absolute',
          inset: 0,
          transition: 'background 0.15s ease',
          willChange: 'background'
        }}
      />

      {/* Layer 4: Vignette Edge Darkening */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 50%, rgba(16, 5, 7, 0.7) 100%)'
        }}
      />
    </div>
  );
}
