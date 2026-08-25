"use client";

import { useEffect, useRef } from 'react';

const GLYPHS = '01·/#%ABCDEFGHIJKLMNOPQRSTUVWXYZ';

interface Props {
  children: string;
  className?: string;
  accent?: boolean;
}

/**
 * Mono section label that decodes itself the first time it scrolls in —
 * the small "systems" tic that ties the mono labels to the rest of the
 * futuristic hover language. Falls back to plain text when the user
 * prefers reduced motion or JS is still loading.
 */
export default function ScrambleLabel({ children, className = '', accent }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const target = children;
    let frame = 0;
    let raf = 0;

    const run = () => {
      const total = target.length * 3 + 12;
      const tick = () => {
        const revealed = Math.floor((frame / total) * target.length * 1.6);
        el.textContent = target
          .split('')
          .map((ch, i) => {
            if (ch === ' ' || i < revealed) return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('');
        frame += 1;
        if (frame <= total) {
          raf = requestAnimationFrame(tick);
        } else {
          el.textContent = target;
        }
      };
      tick();
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run();
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.6 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [children]);

  return (
    <span ref={ref} className={`v2-label ${accent ? 'v2-label--accent' : ''} ${className}`}>
      {children}
    </span>
  );
}
