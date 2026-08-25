"use client";

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { plate, v2Work, v2WorkSection, type V2Project } from '@/lib/v2content';
import Reveal from './Reveal';
import ScrambleLabel from './ScrambleLabel';

/**
 * SELECTED WORK — the project index.
 *
 * Rows are plain links; the interaction is in two places:
 *  - each row wipes a white tint + hairline in from the left on hover
 *  - a tonal preview plate rides the cursor, tilting with its velocity
 *    and swapping content per row
 */
export default function WorkIndex({ limit, hint }: { limit?: number; hint?: boolean }) {
  const [hovered, setHovered] = useState<V2Project | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const shown = limit ? v2Work.slice(0, limit) : v2Work;
  const hoveredIndex = hovered ? shown.findIndex((p) => p.slug === hovered.slug) : -1;

  // ── cursor-tracked preview plate ────────────────────────────────────
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    if (window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return;

    const x = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3.out' });
    const rot = gsap.quickTo(el, 'rotation', { duration: 0.8, ease: 'power3.out' });

    let last = 0;
    let settle = 0;

    const onMove = (e: PointerEvent) => {
      x(e.clientX + 32);
      y(e.clientY - 40);
      // tilt with horizontal velocity — the plate feels like it has mass,
      // then levels off once the cursor stops
      const dx = e.clientX - last;
      last = e.clientX;
      rot(gsap.utils.clamp(-9, 9, dx * 0.35));
      window.clearTimeout(settle);
      settle = window.setTimeout(() => rot(0), 90);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.clearTimeout(settle);
    };
  }, []);

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    if (window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return;

    gsap.to(el, {
      opacity: hovered ? 1 : 0,
      scale: hovered ? 1 : 0.9,
      duration: 0.4,
      ease: 'power3.out',
    });
  }, [hovered]);

  return (
    <>
      <Reveal className="v2-list">
        {shown.map((p, i) => (
          <Link
            key={p.slug}
            href={`/work/${p.slug}`}
            className="v2-row"
            onMouseEnter={() => setHovered(p)}
            onMouseLeave={() => setHovered((cur) => (cur?.slug === p.slug ? null : cur))}
            onFocus={() => setHovered(p)}
            onBlur={() => setHovered(null)}
            data-cursor="hover"
          >
            <span className="v2-row-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="v2-row-name">{p.name}</span>
            <span className="v2-row-meta">{p.cat}</span>
            <span className="v2-row-year">{p.year}</span>
            <span className="v2-row-arrow" aria-hidden="true">↗</span>
          </Link>
        ))}
      </Reveal>

      {hint && <p className="v2-preview-hint">{v2WorkSection.previewHint}</p>}

      {/* preview plate — pointer-events:none, mirrors the hovered row */}
      <div
        ref={previewRef}
        className="v2-preview"
        aria-hidden="true"
        style={{ background: plate(hovered?.accent ?? 'rgb(217, 199, 33)') }}
      >
        <span className="v2-preview-grain" />
        <span className="v2-preview-count">
          {String(Math.max(hoveredIndex, 0) + 1).padStart(2, '0')} / {String(shown.length).padStart(2, '0')}
        </span>
        <span className="v2-preview-title">
          {(hovered?.nameLines ?? ['', '']).map((line, i) => (
            <span key={i} style={{ display: 'block' }}>
              {line}
            </span>
          ))}
        </span>
      </div>
    </>
  );
}

/** Heading block for the Work frame, kept next to the list it titles. */
export function WorkHeading() {
  return (
    <Reveal className="v2-work-head">
      <ScrambleLabel>{v2WorkSection.label}</ScrambleLabel>
      <h1 className="v2-display">
        {v2WorkSection.headingLead}
        <br />
        {v2WorkSection.headingRest}
        <span className="v2-italic">{v2WorkSection.headingItalic}</span>.
      </h1>
      <p className="v2-work-intro">{v2WorkSection.intro}</p>
    </Reveal>
  );
}
