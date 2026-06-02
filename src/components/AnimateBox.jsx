// AnimateBox component – uses IntersectionObserver instead of jQuery Waypoints
// Adds 'animated' class when element scrolls into view

import React, { useEffect, useRef } from 'react';

export default function AnimateBox({ children, effect = 'fadeInLeft', className = '', delay = 0, style = {} }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add(effect, 'animated');
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [effect, delay]);

  return (
    <div
      ref={ref}
      className={`animate-box ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
