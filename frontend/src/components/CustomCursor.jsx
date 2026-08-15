import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const dotRef = useRef(null);
  const haloRef = useRef(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const haloPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Detect touch devices
    if (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window) {
      setIsTouchDevice(true);
      return;
    }

    let animationFrameId;

    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Instant dot position update
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check if hovering interactive element
      const target = e.target;
      const isInteractive = target.closest('button, a, input, select, textarea, [role="button"], .spotlight-card, .clickable, label');
      setIsHovered(!!isInteractive);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Smooth lerp render loop for the glowing halo
    const loop = () => {
      haloPos.current.x += (mousePos.current.x - haloPos.current.x) * 0.18;
      haloPos.current.y += (mousePos.current.y - haloPos.current.y) * 0.18;

      if (haloRef.current) {
        haloRef.current.style.transform = `translate3d(${haloPos.current.x}px, ${haloPos.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* 1. Instant Central Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 999999,
          willChange: 'transform'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-3.5px',
            left: '-3.5px',
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#d4af37',
            boxShadow: '0 0 10px #d4af37, 0 0 20px #c41e3a',
            transition: 'transform 0.15s ease-out',
            transform: isHovered ? 'scale(0.6)' : 'scale(1)'
          }}
        />
      </div>

      {/* 2. Smooth Lerp Glowing Outer Halo */}
      <div
        ref={haloRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 999998,
          willChange: 'transform'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: isHovered ? '-24px' : '-17px',
            left: isHovered ? '-24px' : '-17px',
            width: isHovered ? '48px' : '34px',
            height: isHovered ? '48px' : '34px',
            borderRadius: '50%',
            border: isHovered ? '1.5px solid rgba(212, 175, 55, 0.9)' : '1px solid rgba(196, 30, 58, 0.5)',
            background: isHovered ? 'rgba(212, 175, 55, 0.1)' : 'rgba(196, 30, 58, 0.05)',
            backdropFilter: isHovered ? 'blur(2px)' : 'none',
            boxShadow: isHovered ? '0 0 20px rgba(212, 175, 55, 0.4), inset 0 0 10px rgba(196, 30, 58, 0.3)' : 'none',
            transition: 'width 0.22s cubic-bezier(0.16, 1, 0.3, 1), height 0.22s cubic-bezier(0.16, 1, 0.3, 1), top 0.22s cubic-bezier(0.16, 1, 0.3, 1), left 0.22s cubic-bezier(0.16, 1, 0.3, 1), border 0.2s, background 0.2s',
            pointerEvents: 'none'
          }}
        />
      </div>
    </>
  );
}
