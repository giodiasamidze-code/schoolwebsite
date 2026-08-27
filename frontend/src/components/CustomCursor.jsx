import React, { useEffect, useState, useRef } from 'react';

// Gold diamond arrow cursor (matches the golden cursor set in user's image)
const CursorArrow = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cg1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fff8dc" />
        <stop offset="30%" stopColor="#f5e2a3" />
        <stop offset="65%" stopColor="#d4af37" />
        <stop offset="100%" stopColor="#7d5b1b" />
      </linearGradient>
      <linearGradient id="cgShine" x1="0" y1="0" x2="0.6" y2="0.6">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
      </linearGradient>
      <filter id="cs" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="1" dy="1.5" stdDeviation="1.5" floodColor="#000" floodOpacity="0.7" />
        <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#d4af37" floodOpacity="0.3" />
      </filter>
    </defs>
    {/* Arrow body — classic pointer shape */}
    <polygon
      points="2,2 2,21 8,16 12,25 15.5,23.5 11.5,14.5 19,14.5"
      fill="url(#cg1)"
      filter="url(#cs)"
    />
    {/* Shine */}
    <polygon
      points="2,2 2,13 9.5,9"
      fill="url(#cgShine)"
    />
    {/* Edge highlight */}
    <polygon
      points="2,2 2,21 8,16 12,25 15.5,23.5 11.5,14.5 19,14.5"
      fill="none"
      stroke="#f5e2a3"
      strokeWidth="0.6"
      opacity="0.45"
    />
  </svg>
);

// Gold cross/move cursor for hover state
const CursorCross = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cg2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fff8dc" />
        <stop offset="40%" stopColor="#d4af37" />
        <stop offset="100%" stopColor="#7d5b1b" />
      </linearGradient>
      <filter id="cs2">
        <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#d4af37" floodOpacity="0.5" />
      </filter>
    </defs>
    {/* Cross shaft H */}
    <rect x="4" y="13.5" width="24" height="5" rx="2.5" fill="url(#cg2)" filter="url(#cs2)" />
    {/* Cross shaft V */}
    <rect x="13.5" y="4" width="5" height="24" rx="2.5" fill="url(#cg2)" filter="url(#cs2)" />
    {/* Arrow tips */}
    <polygon points="4,16 8,12 8,20" fill="#f5e2a3" />
    <polygon points="28,16 24,12 24,20" fill="#f5e2a3" />
    <polygon points="16,4 12,8 20,8" fill="#f5e2a3" />
    <polygon points="16,28 12,24 20,24" fill="#f5e2a3" />
  </svg>
);

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const dotRef = useRef(null);
  const haloRef = useRef(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const haloPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window) {
      setIsTouchDevice(true);
      return;
    }

    let animationFrameId;

    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      const target = e.target;
      const isInteractive = target.closest('button, a, input, select, textarea, [role="button"], .spotlight-card, .clickable, label, .twc');
      setIsHovered(!!isInteractive);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);
    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const loop = () => {
      haloPos.current.x += (mousePos.current.x - haloPos.current.x) * 0.15;
      haloPos.current.y += (mousePos.current.y - haloPos.current.y) * 0.15;

      if (haloRef.current) {
        haloRef.current.style.transform = `translate3d(${haloPos.current.x}px, ${haloPos.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Gold Diamond Arrow / Cross Cursor (instant tracking) */}
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
            top: 0,
            left: 0,
            transition: 'transform 0.08s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s',
            transform: isClicking ? 'scale(0.82)' : isHovered ? 'scale(1.08)' : 'scale(1)',
            opacity: isClicking ? 0.85 : 1
          }}
        >
          {isHovered
            ? <CursorCross size={30} />
            : <CursorArrow size={28} />
          }
        </div>
      </div>
    </>
  );
}
