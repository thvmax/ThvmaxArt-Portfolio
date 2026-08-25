"use client";

import { useRef, type MouseEvent, type ReactNode } from 'react';
import { gsap } from 'gsap';

interface Props {
  href: string;
  label: string;
  className?: string;
  ghost?: boolean;
  large?: boolean;
  knob?: ReactNode;
  target?: string;
  rel?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Magnetic pill CTA. The whole pill leans toward the cursor, the knob
 * leans a little further, and the label swaps for its own duplicate on
 * hover (CSS). Pointer maths is skipped on coarse pointers.
 */
export default function Pill({
  href,
  label,
  className = '',
  ghost,
  large,
  knob = '↗',
  target,
  rel,
  onClick,
}: Props) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const knobRef = useRef<HTMLSpanElement | null>(null);

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return;

    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);

    gsap.to(el, { x: dx * 0.22, y: dy * 0.32, duration: 0.5, ease: 'power3.out' });
    gsap.to(knobRef.current, { x: dx * 0.1, y: dy * 0.14, duration: 0.5, ease: 'power3.out' });
  };

  const onLeave = () => {
    gsap.to([ref.current, knobRef.current], { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' });
  };

  return (
    <a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="hover"
      className={`v2-pill ${ghost ? 'v2-pill--ghost' : ''} ${large ? 'v2-pill--lg' : ''} ${className}`}
    >
      <span className="v2-pill-label">
        <span>{label}</span>
        <span aria-hidden="true">{label}</span>
      </span>
      <span ref={knobRef} className="v2-knob" aria-hidden="true">
        {knob}
      </span>
    </a>
  );
}
