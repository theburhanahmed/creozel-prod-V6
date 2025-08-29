import React, { useEffect, useState, useRef } from 'react';
interface CountUpAnimationProps {
  start?: number;
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}
export const CountUpAnimation: React.FC<CountUpAnimationProps> = ({
  start = 0,
  end,
  duration = 2000,
  decimals = 0,
  prefix = '',
  suffix = ''
}) => {
  const [value, setValue] = useState(start);
  const countRef = useRef(null);
  const frameRef = useRef(null);
  const startTimeRef = useRef(null);
  useEffect(() => {
    // Check if the element is in viewport to start animation
    const observer = new IntersectionObserver(entries => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        startAnimation();
        observer.disconnect();
      }
    }, {
      threshold: 0.1
    });
    if (countRef.current) {
      observer.observe(countRef.current);
    }
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      observer.disconnect();
    };
  }, [end]);
  const startAnimation = () => {
    startTimeRef.current = Date.now();
    const step = () => {
      const currentTime = Date.now();
      const progress = Math.min((currentTime - startTimeRef.current) / duration, 1);
      setValue(start + progress * (end - start));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        setValue(end);
      }
    };
    frameRef.current = requestAnimationFrame(step);
  };
  const formatValue = (val: number) => {
    return `${prefix}${val.toFixed(decimals)}${suffix}`;
  };
  return <span ref={countRef}>{formatValue(value)}</span>;
};
