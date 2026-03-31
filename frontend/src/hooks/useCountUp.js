import { useState, useEffect } from 'react';

export function useCountUp(end, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      // easeOutQuart — starts fast, slows down at the end
      const ease = 1 - Math.pow(1 - percentage, 4);

      setCount(Math.floor(end * ease));

      if (progress < duration) {
        window.requestAnimationFrame(animate);
      }
    };

    window.requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
}