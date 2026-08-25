"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { v2Intro } from '@/lib/v2content';

export const INTRO_DONE = 'v2:intro-done';
const SEEN_KEY = 'v2-intro-seen';
const SAG = 1.725;

/**
 * Module-level gate. StrictMode mounts effects twice in development, so
 * the decision to play must be made once and reused — and "done" has to
 * be sticky, or a listener attaching a tick late never hears the event.
 */
let decided = false;
let willPlay = false;
let done = false;

const decide = () => {
  // once it has played, it is finished for the session — returning to the
  // home route must not replay it
  if (done) return false;
  if (decided) return willPlay;
  decided = true;
  let seen = false;
  try {
    seen = !!sessionStorage.getItem(SEEN_KEY);
  } catch {}
  willPlay = !seen && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return willPlay;
};

const markDone = () => {
  if (done) return;
  done = true;
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {}
  window.dispatchEvent(new Event(INTRO_DONE));
};

/** Runs `cb` when the intro is finished — immediately if it already is. */
export const onIntroDone = (cb: () => void) => {
  if (done) {
    cb();
    return () => {};
  }
  window.addEventListener(INTRO_DONE, cb, { once: true });
  return () => window.removeEventListener(INTRO_DONE, cb);
};

/**
 * First-visit intro.
 *
 * A count to 100 against the discipline words, then the panel lifts off
 * on the same curved edge the route transition uses — so the site's
 * first movement and every movement after it share one shape.
 *
 * Runs once per session — on the first arrival only. Navigating between
 * pages, or back to home, never replays it; nor does it run under
 * reduced motion. Fires INTRO_DONE either way so the hero knows when to
 * play.
 */
export default function V2Intro() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const countRef = useRef<HTMLSpanElement | null>(null);
  const railRef = useRef<HTMLSpanElement | null>(null);
  const wordsRef = useRef<HTMLSpanElement | null>(null);
  const [armed, setArmed] = useState<boolean | null>(null);

  useEffect(() => {
    const play = decide();
    setArmed(play);
    if (!play) markDone();
  }, []);

  useEffect(() => {
    if (!armed) return;

    const root = rootRef.current;
    const count = countRef.current;
    const rail = railRef.current;
    const words = wordsRef.current;
    if (!root || !count || !rail || !words) return;

    document.body.classList.add('v2-intro-open');

    const w = window.innerWidth;
    const h = window.innerHeight;
    const n = { v: 0 };

    // the panel lifts as a curved edge: region kept is above the line
    const lift = (edge: number) => {
      const ctrl = Math.max(-h, edge - (h - edge) * (SAG - 1));
      root.style.clipPath = `path('M 0 -2 V ${edge} Q ${w / 2} ${ctrl} ${w} ${edge} V -2 z')`;
    };

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.classList.remove('v2-intro-open');
        root.style.display = 'none';
        markDone();
      },
    });

    tl.set(root, { autoAlpha: 1 })
      .from('.v2-intro-mark span', {
        yPercent: 110,
        duration: 0.9,
        stagger: 0.045,
        ease: 'power4.out',
      })
      .from('.v2-intro-line', { opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5')
      // count and rail run together
      .to(
        n,
        {
          v: 100,
          duration: 1.5,
          ease: 'power2.inOut',
          onUpdate: () => {
            count.textContent = String(Math.round(n.v)).padStart(3, '0');
          },
        },
        '-=0.35',
      )
      .fromTo(rail, { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }, '<')
      // discipline words cycle behind the count
      .to(
        words,
        {
          yPercent: -75,
          duration: 1.4,
          ease: 'steps(3)',
        },
        '<',
      )
      .to('.v2-intro-body', { opacity: 0, duration: 0.35, ease: 'power2.in' }, '+=0.15')
      // then the panel lifts off on the curve
      .fromTo(
        { e: h },
        { e: h },
        {
          e: 0,
          duration: 0.9,
          ease: 'power3.inOut',
          onUpdate: function () {
            lift((this.targets()[0] as { e: number }).e);
          },
        },
        '-=0.1',
      );

    return () => {
      tl.kill();
      document.body.classList.remove('v2-intro-open');
    };
  }, [armed]);

  if (armed === null || armed === false) return null;

  return (
    <div className="v2-intro" ref={rootRef} aria-hidden="true">
      <div className="v2-intro-body">
        <span className="v2-intro-mark">
          {v2Intro.mark.split('').map((c, i) => (
            <span key={`${c}-${i}`}>{c}</span>
          ))}
        </span>
        <span className="v2-intro-line">{v2Intro.line}</span>

        <div className="v2-intro-foot">
          <span className="v2-intro-words-mask">
            <span className="v2-intro-words" ref={wordsRef}>
              {v2Intro.words.map((word) => (
                <span key={word}>{word}</span>
              ))}
            </span>
          </span>
          <span className="v2-intro-count" ref={countRef}>
            000
          </span>
        </div>

        <span className="v2-intro-rail">
          <span className="v2-intro-rail-fill" ref={railRef} />
        </span>
      </div>
    </div>
  );
}
