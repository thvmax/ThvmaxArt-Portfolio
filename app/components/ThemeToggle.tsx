"use client";

import { useCallback, useEffect, useRef, useState } from 'react';

export const THEME_KEY = 'thv-theme';

const FG = { dark: '#f2f2f0', light: '#101215' } as const;
type Theme = keyof typeof FG;

const MORPH = 460;   // whole-page colour dissolve
const PULSE = 620;   // glow leaving the dial

/**
 * Theme dial.
 *
 * At rest: a hairline circle holding a disc with a bite out of it —
 * crescent in dark, gibbous in light.
 *
 * Switching dissolves the entire page at once — every surface, rule and
 * letter eases to its counterpart over ~460ms — while a soft glow leaves
 * the dial and washes outward, so the change reads as sourced from the
 * button rather than merely happening.
 *
 * Nothing is ever covered. Earlier attempts (a snapshot iris, an
 * expanding disc, a staggered shutter) all hid the page to swap it
 * underneath, which is what made them feel heavy and, in the snapshot
 * case, stutter on the first run. Here the content never leaves the
 * screen: it just changes colour, and the glow is a single element.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');
  const busy = useRef(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const glowRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'light' ? 'light' : 'dark');
  }, []);

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
    const glow = glowRef.current;
    const root = document.documentElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (btn && !reduced) {
      btn.classList.remove('is-spun');
      void btn.offsetWidth; // restart the pulse
      btn.classList.add('is-spun');
      window.setTimeout(() => btn.classList.remove('is-spun'), 900);
    }

    if (reduced) {
      apply(next);
      return;
    }

    busy.current = true;

    // arm the dissolve, then flip — every colour eases to its counterpart
    root.classList.add('is-morphing');
    apply(next);

    // a glow leaves the dial and washes out across the page
    if (btn && glow && typeof glow.animate === 'function') {
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const reach = Math.hypot(
        Math.max(cx, window.innerWidth - cx),
        Math.max(cy, window.innerHeight - cy),
      );

      const size = reach * 2;
      glow.style.width = `${size}px`;
      glow.style.height = `${size}px`;
      glow.style.left = `${cx - reach}px`;
      glow.style.top = `${cy - reach}px`;
      glow.style.background =
        `radial-gradient(circle, ${FG[next]}2e 0%, ${FG[next]}14 38%, transparent 68%)`;

      glow.animate(
        [
          { transform: 'scale(0.15)', opacity: 0.9 },
          { transform: 'scale(1)', opacity: 0 },
        ],
        { duration: PULSE, easing: 'cubic-bezier(0.22, 0.9, 0.36, 1)' },
      );
    }

    window.setTimeout(() => {
      root.classList.remove('is-morphing');
      busy.current = false;
    }, MORPH + 60);
  }, [apply, theme]);

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
      </button>

      <span className="v2-glow" ref={glowRef} aria-hidden="true" />
    </>
  );
}
