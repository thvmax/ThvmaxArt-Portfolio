"use client";

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useSmoothScroll } from './SmoothScroll';

export default function Hero() {
  const { scrollTo } = useSmoothScroll();
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.from('.hero-statement, .hero-browse', {
        y: 28,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.15,
      });
      gsap.from('.hero-media', {
        opacity: 0,
        duration: 1.1,
        ease: 'power2.out',
        delay: 0.45,
      });
    },
    { scope: rootRef },
  );

  return (
    <section id="top" className="hero" ref={rootRef}>
      <div className="hero-top">
        <h1 className="hero-statement">
          Shaping brand visuals, campaigns and motion that audiences remember.
        </h1>
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
          src="/case-studies/sting-night-life/hero-video.mp4"
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
