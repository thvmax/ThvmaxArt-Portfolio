"use client";

import { useCallback, useEffect, useRef, useState } from 'react';

export const THEME_KEY = 'thv-theme';

type Theme = 'dark' | 'light';

const SWAP_MS = 60;   // how long hover transitions stay suspended after swap
const WAVE_MS = 640;  // halftone ripple travelling across the page
const SPARKS = 8;

/**
 * Theme dial.
 *
 * At rest: a hairline circle holding a disc with a bite out of it —
 * crescent in dark, gibbous in light.
 *
 * Switching is instant — every surface flips in the same paint as the
 * click — and an art layer rides on top of it:
 *   - a halftone ripple (a ring of dots in the new ink) bursts out of the
 *     dial and crosses the page, led by a hairline ring;
 *   - the dial throws a small spark burst while the moon flips.
 * The art layer never covers content and never blocks input. It is built
 * only from transform + opacity on layers that are rasterised once at
 * mount (one per ink, so the swap never forces a repaint of them), which
 * is what keeps even the very first click smooth.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');
  const busy = useRef(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const waveDark = useRef<HTMLSpanElement | null>(null);
  const waveLight = useRef<HTMLSpanElement | null>(null);
  const lineRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'light' ? 'light' : 'dark');
  }, []);

  // Park the ripple layers on the dial so they are pre-rasterised and the
  // first switch has nothing to build.
  const place = useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const reach = Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy));
    // drawn at half size and scaled past 1 — a quarter of the GPU memory
    const size = Math.ceil(reach * 1.05);
    for (const el of [waveDark.current, waveLight.current, lineRef.current]) {
      if (!el) continue;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.left = `${cx - size / 2}px`;
      el.style.top = `${cy - size / 2}px`;
    }
  }, []);

  useEffect(() => {
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [place]);

  const apply = useCallback((next: Theme) => {
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
    setTheme(next);
  }, []);

  const toggle = useCallback(() => {
    if (busy.current) return;

    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    const btn = btnRef.current;
    const root = document.documentElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      apply(next);
      return;
    }

    busy.current = true;

    // Suspend every element's own hover transition, then flip the tokens.
    root.classList.add('is-morphing');
    apply(next);

    if (btn) {
      btn.classList.remove('is-spun');
      void btn.offsetWidth; // restart the burst
      btn.classList.add('is-spun');
      window.setTimeout(() => btn.classList.remove('is-spun'), 700);
    }

    const wave = next === 'dark' ? waveDark.current : waveLight.current;
    const line = lineRef.current;
    if (wave && typeof wave.animate === 'function') {
      place();
      const easing = 'cubic-bezier(0.16, 1, 0.3, 1)';
      wave.animate(
        [
          { transform: 'scale(0.06)', opacity: 0 },
          { transform: 'scale(0.5)', opacity: 0.85, offset: 0.18 },
          { transform: 'scale(2.1)', opacity: 0 },
        ],
        { duration: WAVE_MS, easing },
      );
      if (line) {
        line.dataset.ink = next;
        line.animate(
          [
            { transform: 'scale(0.04)', opacity: 0.9 },
            { transform: 'scale(2.15)', opacity: 0 },
          ],
          { duration: WAVE_MS - 80, easing },
        );
      }
    }

    window.setTimeout(() => {
      root.classList.remove('is-morphing');
      busy.current = false;
    }, SWAP_MS);
  }, [apply, place, theme]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="v2-dial"
        onClick={toggle}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-pressed={theme === 'light'}
        title="Switch theme"
        data-cursor="hover"
      >
        <span className="v2-dial-disc" aria-hidden="true" />
        <span className="v2-dial-ring" aria-hidden="true" />
        {Array.from({ length: SPARKS }, (_, i) => (
          <i
            key={i}
            className="v2-dial-spark"
            style={{ ['--a' as string]: `${(360 / SPARKS) * i + 22}deg`, ['--d' as string]: `${(i % 2) * 40}ms` }}
            aria-hidden="true"
          />
        ))}
      </button>

      <span className="v2-wave v2-wave--dark" ref={waveDark} aria-hidden="true" />
      <span className="v2-wave v2-wave--light" ref={waveLight} aria-hidden="true" />
      <span className="v2-wave-line" ref={lineRef} aria-hidden="true" />
    </>
  );
}
