"use client";

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { plate, v2Work, v2WorkPage } from '@/lib/v2content';
import ScrambleLabel from './ScrambleLabel';

/**
 * WORK — an infinite horizontal marquee held in one locked viewport.
 *
 * Three identical sets sit side by side; the track drifts left forever
 * and wraps by exactly one set width, so the seam never shows. Input
 * adds to that drift:
 *   - wheel (either axis) pushes travel and decays back to the idle drift
 *   - drag throws the reel with momentum
 * Hovering a card fills the caption row at the bottom and locks the
 * cursor label to "VIEW PROJECT".
 */

const IDLE = 0.55;        // px per frame of resting drift
const WHEEL = 0.85;       // wheel delta → travel
const DECAY = 0.94;       // per-frame decay of added velocity

export default function WorkMarquee() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const setRef = useRef<HTMLDivElement | null>(null);

  const offset = useRef(0);
  const velocity = useRef(0);
  const setWidth = useRef(0);
  const dragging = useRef(false);
  const dragLast = useRef(0);

  const [hovered, setHovered] = useState<number | null>(null);

  const measure = useCallback(() => {
    if (setRef.current) setWidth.current = setRef.current.getBoundingClientRect().width;
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    measure();
    window.addEventListener('resize', measure);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const tick = () => {
      if (document.hidden) return;
      const w = setWidth.current;
      if (w) {
        if (!dragging.current) {
          offset.current -= reduced ? 0 : IDLE;
          offset.current -= velocity.current;
          velocity.current *= DECAY;
          if (Math.abs(velocity.current) < 0.01) velocity.current = 0;
        }
        // wrap by exactly one set so the loop is seamless
        if (offset.current <= -w) offset.current += w;
        if (offset.current > 0) offset.current -= w;
        track.style.transform = `translate3d(${offset.current}px,0,0)`;
      }
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  // Wheel anywhere in the stage drives the reel sideways
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      velocity.current += (delta * WHEEL) / 12;
    };

    root.addEventListener('wheel', onWheel, { passive: false });
    return () => root.removeEventListener('wheel', onWheel);
  }, []);

  // Drag / swipe to throw it
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const down = (e: PointerEvent) => {
      dragging.current = true;
      dragLast.current = e.clientX;
      velocity.current = 0;
      root.classList.add('is-dragging');
    };
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - dragLast.current;
      dragLast.current = e.clientX;
      offset.current += dx;
      velocity.current = -dx * 0.6;
    };
    const up = () => {
      dragging.current = false;
      root.classList.remove('is-dragging');
    };

    root.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      root.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, []);

  const active = hovered !== null ? v2Work[hovered] : null;

  const set = (key: string) => (
    <div className="v2-mq-set" key={key} ref={key === 'a' ? setRef : undefined} aria-hidden={key !== 'a'}>
      {v2Work.map((p, i) => (
        <Link
          key={p.slug}
          href={`/work/${p.slug}`}
          className="v2-mq-item"
          tabIndex={key === 'a' ? 0 : -1}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered((cur) => (cur === i ? null : cur))}
          onFocus={() => setHovered(i)}
          onBlur={() => setHovered(null)}
          data-cursor="hover"
          data-cursor-label="VIEW PROJECT"
          aria-label={`${p.name} — ${p.cat}`}
        >
          <span className="v2-mq-card">
            <span className="v2-mq-art" style={{ background: plate(p.accent, 128) }} />
            <span className="v2-mq-scan" />
          </span>
          <span className="v2-mq-idx">{String(i + 1).padStart(2, '0')}</span>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="v2-mq-stage" ref={rootRef}>
      <div className="v2-mq-intro">
        <ScrambleLabel>{v2WorkPage.label}</ScrambleLabel>
        <h1 className="v2-mq-title">
          {v2WorkPage.headingLead}{' '}
          <span className="v2-italic">{v2WorkPage.headingItalic}</span>.
        </h1>
      </div>

      <div className="v2-mq-band">
        <div className="v2-mq-track" ref={trackRef}>
          {set('a')}
          {set('b')}
          {set('c')}
        </div>
      </div>

      <div className={`v2-mq-caption ${active ? 'is-on' : ''}`}>
        <span className="v2-mq-caption-meta">{active?.cat ?? v2WorkPage.scope}</span>
        {/* non-breaking space keeps the line box alive so the row never
            changes height between the idle and hover states */}
        <span className="v2-mq-caption-name">{active ? active.name : '\u00A0'}</span>
        <span className="v2-mq-caption-year">{active?.year ?? `${v2Work.length} PROJECTS`}</span>
      </div>
    </div>
  );
}
