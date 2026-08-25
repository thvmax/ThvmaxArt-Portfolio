"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Counts the numeric part of a stat up when it scrolls in.
 * "≈10%" → prefix "≈", number 10, suffix "%". Non-numeric values are
 * rendered as-is.
 */
export default function StatCounter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
    if (!match) return;

    const [, prefix, digits, suffix] = match;
    const target = parseFloat(digits);
    const decimals = digits.includes('.') ? digits.split('.')[1].length : 0;
    const counter = { n: 0 };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.unobserve(el);
          gsap.to(counter, {
            n: target,
            duration: 1.5,
            ease: 'power3.out',
            onUpdate: () => {
              el.textContent = `${prefix}${counter.n.toFixed(decimals)}${suffix}`;
            },
            onComplete: () => {
              el.textContent = value;
            },
          });
        });
      },
      { threshold: 0.6 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
