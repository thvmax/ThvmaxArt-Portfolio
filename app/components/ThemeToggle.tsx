"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useSmoothScroll } from '@/app/components/SmoothScroll';

export const THEME_KEY = 'thv-theme';
const SAG = 1.725;

const BG = { dark: '#0b0c0d', light: '#f4f4f1' } as const;

/* Front-loaded, but still moving when it lands — no dead tail. */
const EASE = 'cubic-bezier(0.22, 0.9, 0.36, 1)';
type Theme = keyof typeof BG;

/** Chrome/Edge ship this; Safari and Firefox fall back to the curve sweep. */
type ViewTransitionDoc = Document & {
  startViewTransition?: (cb: () => void) => {
    ready: Promise<void>;
    finished: Promise<void>;
    skipTransition?: () => void;
  };
};

/**
 * Theme dial.
 *
 * At rest: a hairline circle holding a disc with a bite out of it —
 * crescent in dark, gibbous in light. Quiet enough to ignore, specific
 * enough to find.
 *
 * Switching opens an iris from the dial itself: the incoming theme
 * spreads out of the button like ink through paper, so the change has a
 * physical origin instead of just happening to the page. Where the View
 * Transitions API is unavailable, the site's curve sweep stands in.
 *
 * The theme is applied synchronously either way — no animation path is
 * ever load-bearing for whether the switch actually happened.
 */
export default function ThemeToggle() {
  const { stop, start } = useSmoothScroll();
  const [theme, setTheme] = useState<Theme>('dark');
  const busy = useRef(false);
  const warmed = useRef(false);
  const pausedVideos = useRef<HTMLVideoElement[]>([]);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const sweepRef = useRef<SVGSVGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

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

  /**
   * A view transition snapshots the whole document. Anything still
   * painting during that capture — an autoplaying reel, the marquee
   * ticker, blurred nav glass — is rasterised under load and shows up as
   * a hitch. Quiet the page first, restore it after.
   */
  const quiet = useCallback(() => {
    document.documentElement.classList.add('is-theming');
    stop();
    gsap.ticker.sleep();

    pausedVideos.current = [];
    document.querySelectorAll('video').forEach((v) => {
      if (!v.paused) {
        v.pause();
        pausedVideos.current.push(v);
      }
    });
  }, [stop]);

  const restore = useCallback(() => {
    document.documentElement.classList.remove('is-theming');
    gsap.ticker.wake();
    start();
    pausedVideos.current.forEach((v) => {
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    });
    pausedVideos.current = [];
  }, [start]);

  /**
   * The first transition pays for allocating the snapshot machinery.
   * Hovering the dial is a reliable signal a click is coming, so pay it
   * then and skip straight back out — by click time it is warm.
   */
  const prewarm = useCallback(() => {
    if (warmed.current) return;
    warmed.current = true;
    const doc = document as ViewTransitionDoc;
    if (typeof doc.startViewTransition !== 'function') return;
    try {
      const t = doc.startViewTransition(() => {});
      t.skipTransition?.();
      t.finished.catch(() => {});
    } catch {}
  }, []);

  /** Fallback: the outgoing background sweeps up and off on the site curve. */
  const curveSweep = useCallback((prev: Theme) => {
    const svg = sweepRef.current;
    const path = pathRef.current;
    if (!svg || !path) return;

    busy.current = true;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const state = { edge: h };

    const clear = () => {
      gsap.set(svg, { autoAlpha: 0 });
      busy.current = false;
    };
    const failsafe = window.setTimeout(clear, 2000);

    const drawUp = () => {
      const ctrl = Math.min(h + 2, state.edge * SAG);
      path.setAttribute('d', `M 0 ${h + 2} V ${state.edge} Q ${w / 2} ${ctrl} ${w} ${state.edge} V ${h + 2} z`);
    };
    const drawOff = () => {
      const ctrl = Math.max(-h, state.edge - (h - state.edge) * (SAG - 1));
      path.setAttribute('d', `M 0 ${-2} V ${state.edge} Q ${w / 2} ${ctrl} ${w} ${state.edge} V ${-2} z`);
    };

    path.setAttribute('fill', BG[prev]);
    gsap.set(svg, { autoAlpha: 1 });
    drawUp();

    gsap
      .timeline({ onComplete: () => { window.clearTimeout(failsafe); clear(); } })
      .to(state, { edge: 0, duration: 0.42, ease: 'power3.inOut', onUpdate: drawUp })
      .add(() => { state.edge = h; drawOff(); })
      .to(state, { edge: 0, duration: 0.52, ease: 'power3.inOut', onUpdate: drawOff });
  }, []);

  const toggle = useCallback(() => {
    if (busy.current) return;

    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    const prev: Theme = theme;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // the dial reacts on its own, immediately
    const btn = btnRef.current;
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

    const doc = document as ViewTransitionDoc;

    if (typeof doc.startViewTransition !== 'function') {
      apply(next);
      curveSweep(prev);
      return;
    }

    // iris origin: the centre of the dial itself
    const r = btn?.getBoundingClientRect();
    const cx = r ? r.left + r.width / 2 : window.innerWidth - 90;
    const cy = r ? r.top + r.height / 2 : 60;
    // Distance to the furthest corner, plus a margin. The overshoot is
    // off-screen, so the viewport is fully covered slightly BEFORE the
    // animation ends — otherwise the last sliver is still uncovered when
    // the pseudo-elements are torn down, and it snaps.
    const reach =
      Math.hypot(
        Math.max(cx, window.innerWidth - cx),
        Math.max(cy, window.innerHeight - cy),
      ) * 1.04;

    busy.current = true;
    quiet();
    const transition = doc.startViewTransition(() => apply(next));

    transition.ready
      .then(() => {
        document.documentElement.animate(
          { transform: ['scale(1)', 'scale(0.985)'], opacity: [1, 0.9] },
          {
            duration: 760,
            easing: EASE,
            fill: 'forwards',
            pseudoElement: '::view-transition-old(root)',
          },
        );

        document.documentElement.animate(
          {
            clipPath: [`circle(0px at ${cx}px ${cy}px)`, `circle(${reach}px at ${cx}px ${cy}px)`],
          },
          {
            // A circle's area grows with r², so an even radius reads as
            // accelerating. The curve stays front-loaded to cancel that,
            // but arrives with real velocity instead of an expo tail —
            // expo spends its last 40% imperceptibly still, which is what
            // made the end look stuck before it filled.
            duration: 760,
            easing: EASE,
            fill: 'forwards',
            pseudoElement: '::view-transition-new(root)',
          },
        );
      })
      .catch(() => {});

    const done = () => {
      busy.current = false;
      restore();
    };
    transition.finished.then(done).catch(done);
    window.setTimeout(done, 2000);
  }, [apply, curveSweep, quiet, restore, theme]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="v2-dial"
        onClick={toggle}
        onPointerEnter={prewarm}
        onFocus={prewarm}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-pressed={theme === 'light'}
        title="Switch theme"
        data-cursor="hover"
      >
        <span className="v2-dial-disc" aria-hidden="true" />
        <span className="v2-dial-ring" aria-hidden="true" />
      </button>

      <svg className="v2-theme-sweep" ref={sweepRef} aria-hidden="true">
        <path ref={pathRef} d="" />
      </svg>
    </>
  );
}
