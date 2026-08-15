import React, { useEffect, useState, useRef } from 'react';

export default function AnimatedCounter({ end, duration = 1800, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  const hasAnimated = useRef(false);

  // Extract number from string if needed (e.g. "98" from "98%", or parse float)
  const numericEnd = typeof end === 'number' ? end : parseFloat(end) || 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTime = null;

          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            // EaseOutExpo curve
            const easeOutProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(Math.floor(easeOutProgress * numericEnd));

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCount(numericEnd);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.25 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [numericEnd, duration]);

  return (
    <span ref={counterRef}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}
