import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * SmoothScroll — powered by Lenis (same library used by fraxbit.com,
 * Vercel, Linear, and other premium sites).
 *
 * Characteristics:
 *  - Silky smooth continuous scroll (NOT section-snapping)
 *  - Ease-in acceleration, exponential ease-out deceleration
 *  - Consistent across browsers (overrides each browser's native scroll)
 *  - Works with touch on mobile (disabled automatically)
 *  - Does NOT touch elements that call e.preventDefault() on wheel
 *    (e.g. the teacher carousel widget)
 */
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      // How quickly the scroll "catches up" to the input (0–1, lower = longer glide)
      lerp: 0.07,
      // Multiplier for wheel delta — controls how far each tick moves
      wheelMultiplier: 1.0,
      // Smooth behaviour on touch devices (set false to keep native touch)
      smoothTouch: false,
      // Normalize scroll direction
      syncTouch: false,
      // Easing function — expo out for a silky deceleration tail
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // Integrate with requestAnimationFrame for perfect 60/120fps rendering
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Expose lenis globally so other components can scroll programmatically
    window.__lenis = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
