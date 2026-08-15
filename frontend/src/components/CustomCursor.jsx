import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window) {
      setIsTouchDevice(true);
      return;
    }

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering interactive element
      const target = e.target;
      const isInteractive = target.closest('button, a, input, select, textarea, [role="button"], .spotlight-card, .clickable');
      setIsHovered(!!isInteractive);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        pointerEvents: 'none',
        zIndex: 99999,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: 'transform 0.08s ease-out',
        willChange: 'transform'
      }}
    >
      {/* Central Dot */}
      <div
        style={{
          position: 'absolute',
          top: '-3px',
          left: '-3px',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#d4af37',
          boxShadow: '0 0 10px #d4af37, 0 0 20px #c41e3a',
          transition: 'transform 0.15s ease-out',
          transform: isHovered ? 'scale(0.5)' : 'scale(1)'
        }}
      />

      {/* Glowing Outer Halo */}
      <div
        style={{
          position: 'absolute',
          top: isHovered ? '-24px' : '-16px',
          left: isHovered ? '-24px' : '-16px',
          width: isHovered ? '48px' : '32px',
          height: isHovered ? '48px' : '32px',
          borderRadius: '50%',
          border: isHovered ? '1.5px solid rgba(212, 175, 55, 0.85)' : '1px solid rgba(196, 30, 58, 0.45)',
          background: isHovered ? 'rgba(212, 175, 55, 0.08)' : 'rgba(196, 30, 58, 0.04)',
          backdropFilter: isHovered ? 'blur(2px)' : 'none',
          boxShadow: isHovered ? '0 0 20px rgba(212, 175, 55, 0.4), inset 0 0 10px rgba(196, 30, 58, 0.3)' : 'none',
          transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), height 0.25s cubic-bezier(0.16, 1, 0.3, 1), top 0.25s cubic-bezier(0.16, 1, 0.3, 1), left 0.25s cubic-bezier(0.16, 1, 0.3, 1), border 0.2s, background 0.2s',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
