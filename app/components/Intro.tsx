"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSmoothScroll } from './SmoothScroll';

const STORAGE_KEY = 'ts-intro-seen';
export const INTRO_DISMISS_EVENT = 'ts-intro-dismiss';
const CHARS = ['T', '—', 'S'];

// Timeline (ms)
const REVEAL_DUR = 950;   // characters mask-rise (CSS)
const HOLD = 360;         // rest on the full mark before the handoff
const SKIP_AFTER = 400;   // clicks ignored before this
const CONTRACT_DUR = 700;  // panel shrinks into the hero video frame (CSS)
const HERO_CUE = 320;      // hero copy starts rising mid-contraction
const FADE_AT = 540;       // panel starts dissolving over the live video
const LEAVE_DUR = 760;     // unmount

export default function Intro() {
  const { stop, start } = useSmoothScroll();
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);       // triggers mask reveal
  const [leaving, setLeaving] = useState(false);   // triggers contraction
  const [dissolving, setDissolving] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const leavingRef = useRef(false);
  const startedRef = useRef(0);

  // Match the panel's end state to the hero video block so the intro
  // backdrop reads as the same surface as the showreel banner.
  const measure = useCallback(() => {
    const root = rootRef.current;
    const media = document.querySelector('.hero-media');
    if (!root || !media) return;

    const r = media.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const top = Math.max(r.top, 0);
    const left = Math.max(r.left, 0);
    const right = Math.max(vw - r.right, 0);
    const bottom = Math.max(vh - r.bottom, 0);

    root.style.setProperty('--to-top', `${top}px`);
    root.style.setProperty('--to-right', `${right}px`);
    root.style.setProperty('--to-bottom', `${bottom}px`);
    root.style.setProperty('--to-left', `${left}px`);

    // The mark rides the same contraction: scale down and settle in the
    // middle of the frame it is collapsing into.
    const scale = Math.min((r.width * 0.34) / Math.max(vw, 1), 0.34);
    const dx = (r.left + r.width / 2) - vw / 2;
    const dy = (Math.min(r.top + r.height / 2, vh * 0.78)) - vh / 2;
    root.style.setProperty('--mark-scale', `${Math.max(scale, 0.22)}`);
    root.style.setProperty('--mark-x', `${dx}px`);
    root.style.setProperty('--mark-y', `${dy}px`);
  }, []);

  const dismiss = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {}

    measure();
    requestAnimationFrame(() => setLeaving(true));

    start();
    document.body.style.overflow = '';
    window.setTimeout(() => window.dispatchEvent(new Event(INTRO_DISMISS_EVENT)), HERO_CUE);
    window.setTimeout(() => setDissolving(true), FADE_AT);
    window.setTimeout(() => setVisible(false), LEAVE_DUR);
  }, [measure, start]);

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
    measure();
    window.addEventListener('resize', measure);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setReady(true);
      const t = window.setTimeout(dismiss, 600);
      return () => {
        window.clearTimeout(t);
        window.removeEventListener('resize', measure);
      };
    }

    startedRef.current = performance.now();
    const revealRaf = requestAnimationFrame(() => setReady(true));
    const t = window.setTimeout(dismiss, REVEAL_DUR + HOLD);

    const onClick = () => {
      if (performance.now() - startedRef.current > SKIP_AFTER) dismiss();
    };
    window.addEventListener('pointerdown', onClick);

    return () => {
      cancelAnimationFrame(revealRaf);
      window.clearTimeout(t);
      window.removeEventListener('pointerdown', onClick);
      window.removeEventListener('resize', measure);
    };
  }, [dismiss, stop, measure]);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className={`intro ${leaving ? 'intro--leaving' : ''} ${dissolving ? 'intro--dissolving' : ''}`}
      aria-hidden="true"
      style={{ transitionDuration: `${CONTRACT_DUR}ms` }}
    >
      <div className={`intro-inner ${ready ? 'is-ready' : ''}`}>
        <div className="intro-mark">
          {CHARS.map((ch, i) => (
            <span className="intro-char-mask" key={i}>
              <span className="intro-char" style={{ transitionDelay: `${i * 0.11}s` }}>
                {ch}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
