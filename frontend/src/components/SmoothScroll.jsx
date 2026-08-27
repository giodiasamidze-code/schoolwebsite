import { useEffect, useRef } from 'react';

/**
 * SmoothScroll — global momentum/inertia scroll for the whole page.
 * When the user spins the mouse wheel:
 *   - velocity builds up gradually (ease-in feel)
 *   - after releasing the wheel, velocity decays with friction (ease-out feel)
 * Does NOT interfere with elements that call e.preventDefault() on their own
 * wheel events (e.g. the teacher carousel), because those events never reach
 * the document listener.
 */
export default function SmoothScroll() {
  const velocityRef = useRef(0);
  const rAFRef = useRef(null);
  const targetRef = useRef(window.scrollY);
  const currentRef = useRef(window.scrollY);

  useEffect(() => {
    const FRICTION = 0.88;      // higher = slides longer (0–1)
    const SPEED_FACTOR = 0.55;  // scales raw deltaY into velocity units
    const MAX_VEL = 180;        // max pixels/frame (prevents mega-jumps)

    const onWheel = (e) => {
      // If the target element (or any ancestor) handles this wheel event
      // by calling preventDefault, this listener won't fire — which is
      // exactly what we want for the teacher carousel and similar widgets.

      e.preventDefault();

      const delta = e.deltaY * SPEED_FACTOR;
      // Accumulate velocity (ease-in: spinning faster adds more speed)
      velocityRef.current = Math.max(
        -MAX_VEL,
        Math.min(MAX_VEL, velocityRef.current + delta)
      );
    };

    const loop = () => {
      if (Math.abs(velocityRef.current) > 0.3) {
        // Apply velocity to scroll position
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const next = Math.max(0, Math.min(maxScroll, window.scrollY + velocityRef.current));
        window.scrollTo(0, next);

        // Ease-out friction — decay until nearly zero
        velocityRef.current *= FRICTION;
      } else {
        velocityRef.current = 0;
      }

      rAFRef.current = requestAnimationFrame(loop);
    };

    rAFRef.current = requestAnimationFrame(loop);

    // passive: false so we can call preventDefault()
    window.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(rAFRef.current);
      window.removeEventListener('wheel', onWheel);
    };
  }, []);

  return null; // no UI — effect only
}
