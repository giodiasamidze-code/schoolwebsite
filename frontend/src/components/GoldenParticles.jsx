import React, { useEffect, useRef } from 'react';

export default function GoldenParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle Generation
    const particleCount = Math.min(Math.floor(width / 35), 45);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.6,
        color: Math.random() > 0.4 ? 'rgba(212, 175, 55, ' : 'rgba(196, 30, 58, ',
        baseAlpha: Math.random() * 0.4 + 0.2,
        alpha: 0,
        alphaSpeed: Math.random() * 0.015 + 0.005,
        alphaDirection: 1,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35 - 0.15 // Gentle upward drift
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Alpha oscillation for gentle twinkling
        p.alpha += p.alphaSpeed * p.alphaDirection;
        if (p.alpha > p.baseAlpha) {
          p.alphaDirection = -1;
        } else if (p.alpha < 0.05) {
          p.alphaDirection = 1;
        }

        // Slight attraction/repulsion to mouse for depth parallax
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          p.x -= (dx / dist) * 0.5;
          p.y -= (dy / dist) * 0.5;
        }

        // Movement
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw glowing particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha.toFixed(2)})`;
        ctx.shadowColor = p.color.includes('212') ? '#d4af37' : '#c41e3a';
        ctx.shadowBlur = p.radius * 6;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2
      }}
    />
  );
}
