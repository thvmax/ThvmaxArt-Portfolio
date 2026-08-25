"use client";

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { v2Home } from '@/lib/v2content';
import { onIntroDone } from './V2Intro';

gsap.registerPlugin(useGSAP);

/**
 * Hero typography.
 *
 * Each heading line sits in its own mask and rises from below with a
 * slight lean, staggered — the line above is still settling as the next
 * one starts, so it reads as one movement rather than three. Waits for
 * the intro to lift before it plays.
 */
export default function V2Hero() {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const routing = document.documentElement.classList.contains('v2-routing');

      if (reduced || routing) {
        gsap.set('.v2-hero-line > span', { yPercent: 0, y: 0, rotate: 0 });
        gsap.set('.v2-hero-label, .v2-hero-intro, .v2-hero-cue', { opacity: 1, y: 0 });
        return;
      }

      const play = () => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        tl.to('.v2-hero-label', { opacity: 1, y: 0, duration: 0.7 })
          // fromTo, not to: the CSS start state is a percentage transform,
          // which GSAP reads back as pixels — animating yPercent alone
          // would leave that pixel offset in place.
          .fromTo(
            '.v2-hero-line > span',
            { yPercent: 105, y: 0, rotate: 3 },
            {
              yPercent: 0,
              y: 0,
              rotate: 0,
              duration: 1.15,
              stagger: 0.085,
            },
            '-=0.45',
          )
          .to('.v2-hero-intro', { opacity: 1, y: 0, duration: 0.8 }, '-=0.7')
          .to('.v2-hero-cue', { opacity: 1, y: 0, duration: 0.6 }, '-=0.5');
      };

      // Sticky gate: fires immediately if the intro has already lifted,
      // so the hero can never miss the hand-off.
      return onIntroDone(play);
    },
    { scope: rootRef },
  );

  return (
    <header className="v2-hero" ref={rootRef}>
      <span className="v2-hero-label">{v2Home.label}</span>

      <h1 className="v2-hero-head">
        {v2Home.headLines.map((line, i) => (
          <span className="v2-hero-line" key={i}>
            <span>
              {line.map((seg, j) =>
                seg.i ? (
                  <em className="v2-italic" key={j}>
                    {seg.t}
                  </em>
                ) : (
                  <span key={j}>{seg.t}</span>
                ),
              )}
            </span>
          </span>
        ))}
      </h1>

      <p className="v2-hero-intro">{v2Home.intro2}</p>

      <span className="v2-hero-cue">
        {v2Home.scrollCue}
        <i />
      </span>
    </header>
  );
}
