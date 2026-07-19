"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSmoothScroll } from './SmoothScroll';

const STORAGE_KEY = 'ts-intro-seen';
export const INTRO_DISMISS_EVENT = 'ts-intro-dismiss';
const WORDMARK = 'T—S';

// Timeline (ms)
const COUNT_DUR = 2200;   // 0 -> 100 counter duration
const HOLD_AT_END = 380;  // pause on 100 before curtain wipe
const SKIP_AFTER = 500;   // clicks ignored before this
const LEAVE_DUR = 950;    // matches CSS curtain transition

const easeOutExpo = (p: number) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p));

export default function Intro() {
  const { stop, start } = useSmoothScroll();
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);   // triggers mask reveal
  const [leaving, setLeaving] = useState(false);
  const [count, setCount] = useState(0);
  const leavingRef = useRef(false);
  const startedRef = useRef(0);

  const dismiss = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {}
    setLeaving(true);
    start();
    document.body.style.overflow = '';
    window.setTimeout(() => window.dispatchEvent(new Event(INTRO_DISMISS_EVENT)), 300);
    window.setTimeout(() => setVisible(false), LEAVE_DUR);
  }, [start]);

  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem(STORAGE_KEY);
    } catch {}
    if (seen) {
      setVisible(false);
      return;
    }

    stop();
    document.body.style.overflow = 'hidden';

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setReady(true);
      setCount(100);
      const t = window.setTimeout(dismiss, 700);
      return () => window.clearTimeout(t);
    }

    // kick off mask reveal on next frame
    const revealRaf = requestAnimationFrame(() => setReady(true));

    startedRef.current = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - startedRef.current) / COUNT_DUR, 1);
      setCount(Math.round(easeOutExpo(p) * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(dismiss, HOLD_AT_END);
      }
    };
    raf = requestAnimationFrame(tick);

    const onClick = () => {
      if (performance.now() - startedRef.current > SKIP_AFTER) dismiss();
    };
    window.addEventListener('pointerdown', onClick);

    return () => {
      cancelAnimationFrame(revealRaf);
      cancelAnimationFrame(raf);
      window.removeEventListener('pointerdown', onClick);
    };
  }, [dismiss, stop]);

  if (!visible) return null;

  return (
    <div className={`intro ${leaving ? 'intro--leaving' : ''}`} aria-hidden="true">
      <div className={`intro-inner ${ready ? 'is-ready' : ''}`}>
        <div className="intro-mark">
          <span className="intro-mark-line">{WORDMARK}</span>
        </div>
      </div>

      <div className="intro-meta">
        <span>THVMAX — Portfolio</span>
        <span>Abu Dhabi, UAE © 2026</span>
      </div>

      <div className="intro-count" aria-hidden="true">
        <span>{String(count).padStart(3, '0')}</span>
        <span className="intro-count-pct">%</span>
      </div>

      <div className="intro-progress">
        <span className="intro-progress-bar" style={{ transform: `scaleX(${count / 100})` }} />
      </div>
    </div>
  );
}
