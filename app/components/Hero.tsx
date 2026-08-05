"use client";

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useSmoothScroll } from './SmoothScroll';
import { INTRO_DISMISS_EVENT } from './Intro';
import { site } from '@/lib/data';

gsap.registerPlugin(useGSAP);

export default function Hero() {
  const { scrollTo } = useSmoothScroll();
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const play = () => {
        gsap.fromTo(
          '.hero-statement, .hero-browse',
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.09, delay: 0.05 },
        );
        // The video block is already on screen: the intro panel contracts
        // onto it, so only its label is introduced here. It lands a beat
        // after the panel dissolves off the footage.
        gsap.fromTo(
          '.hero-reel',
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', delay: 0.46 },
        );
      };

      let introSeen = true;
      try {
        introSeen = !!sessionStorage.getItem('ts-intro-seen');
      } catch {}

      if (introSeen) {
        play();
      } else {
        window.addEventListener(INTRO_DISMISS_EVENT, play, { once: true });
        return () => window.removeEventListener(INTRO_DISMISS_EVENT, play);
      }
    },
    { scope: rootRef },
  );

  return (
    <section id="top" className="hero" ref={rootRef}>
      <div className="hero-top">
        <h1 className="hero-statement">{site.heroStatement}</h1>
        <a
          href="#work"
          className="hero-browse arrow-link"
          onClick={(e) => { e.preventDefault(); scrollTo('#work'); }}
        >
          <span className="arrow" aria-hidden="true">&#8627;</span> Browse all work
        </a>
      </div>

      <div className="hero-media">
        <video
          src={site.heroVideo}
          autoPlay
          muted
          loop
          playsInline
        />
        <span className="hero-reel">
          Showreel <span className="hero-reel-play" aria-hidden="true">&#9654;</span>
        </span>
      </div>
    </section>
  );
}
