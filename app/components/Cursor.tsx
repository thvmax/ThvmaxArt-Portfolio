"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Two-part cursor: a hard amber dot that tracks 1:1 and a ring that
 * trails it. The ring swells over anything marked `data-cursor="hover"`
 * and goes dark over inverted (white) blocks.
 * Hidden on coarse pointers via CSS.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    if (window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return;

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3.out' });

    let shown = false;

    // pointermove only moves the cursor — no DOM queries per frame
    const onMove = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    // state only changes when the element under the cursor changes
    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest) return;
      ring.classList.toggle('is-active', !!target.closest('[data-cursor="hover"], a, button'));
      ring.classList.toggle('is-light', !!target.closest('.v2-invert'));
    };

    const onLeave = () => {
      shown = false;
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="v2-cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="v2-cursor" aria-hidden="true" />
    </>
  );
}
