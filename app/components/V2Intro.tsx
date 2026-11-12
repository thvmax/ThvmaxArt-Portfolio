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
 * Three verses of the same five lines, stepped across ruled lanes. Each
 * line arrives with a stutter — its first letter repeated, then pulled
 * in — while a count runs to 100 at the foot. Then the panel lifts off on
 * the same curved edge the route transition uses, so the site's first
 * movement and every movement after it share one shape.
 *
 * Runs once per session — on the first arrival only. Navigating between
 * pages, or back to home, never replays it; nor does it run under
 * reduced motion. Fires INTRO_DONE either way so the hero knows when to
 * play.
 */

// how far in each line starts (% of the width), and how each verse shifts
const STEP = [58, 38, 25, 36, 47];
const SHIFT = [8, 4, -12];
const STUTTER = 9;

export default function V2Intro() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const countRef = useRef<HTMLSpanElement | null>(null);
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
    if (!root || !count) return;

    document.body.classList.add('v2-intro-open');

    const w = window.innerWidth;
    const h = window.innerHeight;
    const n = { v: 0 };
    const lines = Array.from(root.querySelectorAll<HTMLElement>('.v2-intro-ln'));

    // the panel lifts as a curved edge: region kept is above the line
    const lift = (edge: number) => {
      const ctrl = Math.max(-h, edge - (h - edge) * (SAG - 1));
      root.style.clipPath = `path('M 0 -2 V ${edge} Q ${w / 2} ${ctrl} ${w} ${edge} V -2 z')`;
    };

    // first letter repeated out to the left, then drawn back into the word
    const stutter = (el: HTMLElement, at: number, dur: number, reps = STUTTER) => {
      const echo = el.querySelector('i');
      const ch = (el.dataset.t ?? ' ')[0];
      const o = { p: 0 };
      if (!echo) return;
      tl.set(el, { opacity: 1 }, at).fromTo(
        o,
        { p: 0 },
        {
          p: 1,
          duration: dur,
          ease: 'power2.out',
          onUpdate: () => { echo.textContent = ch.repeat(Math.round((1 - o.p) * reps)); },
        },
        at,
      );
    };

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.classList.remove('v2-intro-open');
        root.style.display = 'none';
        markDone();
      },
    });

    tl.set(root, { autoAlpha: 1 })
      .from('.v2-intro-verse', { '--rule': 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, 0)
      .to(
        n,
        {
          v: 100,
          duration: 2.3,
          ease: 'power2.inOut',
          onUpdate: () => { count.textContent = String(Math.round(n.v)).padStart(3, '0'); },
        },
        0.1,
      );

    // verses fill in line by line, each verse starting a beat after the last
    const perVerse = lines.length / 3;
    lines.forEach((el, i) => {
      const verse = Math.floor(i / perVerse), row = i % perVerse;
      stutter(el, 0.3 + verse * 0.22 + row * 0.13, 0.55);
    });
    // a second, shorter stutter runs through a few settled lines
    [1, 7, 12, 4, 10].forEach((i, k) => { if (lines[i]) stutter(lines[i], 1.75 + k * 0.1, 0.4, 6); });

    tl.to('.v2-intro-body', { opacity: 0, duration: 0.35, ease: 'power2.in' }, 2.55)
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
        {SHIFT.map((shift, v) => (
          <div className="v2-intro-verse" key={v}>
            {v2Intro.lines.map((line, i) => (
              <span
                className="v2-intro-ln"
                key={line}
                data-t={line}
                style={{ '--x': STEP[i % STEP.length] + shift } as React.CSSProperties}
              >
                <i />
                {line}
              </span>
            ))}
          </div>
        ))}

        <span className="v2-intro-count">
          <b />
          <span>
            <span ref={countRef}>000</span>%
          </span>
        </span>
      </div>
    </div>
  );
}
