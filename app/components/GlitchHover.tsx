"use client";

import { useEffect, useRef } from 'react';

// Same glyph family as ScrambleLabel's decode-in — mono symbols and
// uppercase letters — so both scramble effects read as one system
// rather than two unrelated tricks.
const GLYPHS = '01·/#%+=~ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const WAVE_THRESHOLD = 3;   // chars within this intensity get a glyph, not a hold
const CHAR_STEP = 3;        // glyph cycles faster the further a char sits from the wave origin
const FRAME_MS = 40;        // ~25fps glyph cycling — fast enough to read as noise, slow enough to read as letters underneath
const WAVE_MARGIN = 5;      // wave keeps expanding a little past the far edge before it's spent

interface Wave {
  originIndex: number;
  startedAt: number;
}

interface Props {
  children: string;
  as?: 'span' | 'a' | 'div';
  className?: string;
  href?: string;
  /** How long one ripple takes to cross and fade, in ms. */
  duration?: number;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * Hover text where a ripple of scrambled glyphs follows the cursor
 * across the characters, settling back to the real word behind it —
 * the hover-triggered cousin of ScrambleLabel's scroll-in decode.
 *
 * Pointer position drives the wave: entering or moving across the text
 * starts a new ripple at the character under the cursor; multiple
 * ripples can overlap mid-fade. Reserved for a few specific spots, not
 * every link — it's a loud effect against an otherwise quiet site.
 *
 * Skipped entirely under reduced motion or on touch, where there's no
 * hover to drive it.
 */
export default function GlitchHover({
  children,
  as = 'span',
  className = '',
  href,
  duration = 700,
  onClick,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return;

    const chars = children.split('');
    const waves: Wave[] = [];
    let animating = false;
    let raf = 0;
    let lockedWidth: number | null = null;
    let cursorIndex = 0;

    const cursorFromEvent = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      const idx = Math.round(ratio * chars.length);
      return Math.max(0, Math.min(idx, chars.length - 1));
    };

    const render = (now: number) => {
      el.textContent = chars
        .map((ch, i) => {
          if (ch === ' ') return ch;

          let resolved = ch;
          for (const wave of waves) {
            const age = now - wave.startedAt;
            const progress = Math.min(age / duration, 1);
            const dist = Math.abs(i - wave.originIndex);
            const maxDist = Math.max(wave.originIndex, chars.length - wave.originIndex - 1);
            const radius = (progress * (maxDist + WAVE_MARGIN));
            const intensity = radius - dist;

            if (intensity > 0 && intensity <= WAVE_THRESHOLD) {
              const glyphIndex = (dist * CHAR_STEP + Math.floor(age / FRAME_MS)) % GLYPHS.length;
              resolved = GLYPHS[glyphIndex];
            }
          }
          return resolved;
        })
        .join('');
    };

    const stop = () => {
      el.textContent = children;
      if (lockedWidth !== null) {
        el.style.width = '';
        lockedWidth = null;
      }
      animating = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const tick = () => {
      const now = performance.now();
      for (let i = waves.length - 1; i >= 0; i -= 1) {
        if (now - waves[i].startedAt > duration) waves.splice(i, 1);
      }
      if (!waves.length) {
        stop();
        return;
      }
      render(now);
      raf = requestAnimationFrame(tick);
    };

    const spawnWave = (originIndex: number) => {
      waves.push({ originIndex, startedAt: performance.now() });
      if (!animating) {
        // lock the box so scrambled glyphs of a different width don't
        // reflow the line while the ripple runs
        if (lockedWidth === null) {
          lockedWidth = el.getBoundingClientRect().width;
          el.style.width = `${lockedWidth}px`;
        }
        animating = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onEnter = (e: PointerEvent) => {
      cursorIndex = cursorFromEvent(e);
      spawnWave(cursorIndex);
    };
    const onMove = (e: PointerEvent) => {
      const next = cursorFromEvent(e);
      if (next !== cursorIndex) {
        cursorIndex = next;
        spawnWave(next);
      }
    };

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointermove', onMove);

    return () => {
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointermove', onMove);
      stop();
    };
  }, [children, duration]);

  const Tag = as as React.ElementType;
  const tagProps: Record<string, unknown> = {
    ref,
    onClick,
    className: `v2-glitch ${className}`,
  };
  if (as === 'a') tagProps.href = href;

  return <Tag {...tagProps}>{children}</Tag>;
}
