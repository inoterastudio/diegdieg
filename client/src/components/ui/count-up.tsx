import { useState, useEffect, useRef } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection";

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export function CountUp({ end, duration = 2000, suffix = "", className = "" }: CountUpProps) {
  const [count, setCount] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useIntersectionObserver(ref, { threshold: 0.3 });
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // Start animation when element comes into view
  useEffect(() => {
    if (inView && !shouldAnimate) {
      setShouldAnimate(true);
    }
  }, [inView, shouldAnimate]);

  // Animate the count
  useEffect(() => {
    if (!shouldAnimate) return;

    const step = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const currentCount = Math.floor(progress * end);

      setCount(currentCount);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        // Ensure we reach the exact final value
        setCount(end);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [shouldAnimate, end, duration]);

  return (
    <div ref={ref} className={className}>
      {count}{suffix}
    </div>
  );
}
