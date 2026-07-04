"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { works } from '@/lib/data';

const CYCLE_MS = 5000;

// hue → placeholder swatch when a slide has no real image yet
const block = (hue: number) =>
  `linear-gradient(145deg, hsl(${hue} 55% 42%), hsl(${(hue + 45) % 360} 60% 30%))`;

export default function Hero({ scrollTo }: { scrollTo: (href: string) => void }) {
  const [slide, setSlide] = useState(0);
  const rootRef = useRef<HTMLElement | null>(null);
  const slides = works.slice(0, 4);

  // Auto-cycle backdrop
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % slides.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [slides.length]);

  // Entrance + parallax-out
  useEffect(() => {
    if (!rootRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (!reduced) {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
        tl.from('.hero-line span', { yPercent: 115, duration: 1.1, stagger: 0.12 }, 0.15)
          .from('.hero-eyebrow', { y: 20, opacity: 0, duration: 0.7 }, '-=0.7')
          .from('.hero-meta > *', { y: 16, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.5')
          .from('.hero-counter, .hero-scroll', { opacity: 0, duration: 0.8 }, '-=0.4')
          .from('#nav', { y: -30, opacity: 0, duration: 0.7 }, '-=0.9');

        // Image drifts slower than content while scrolling out → depth
        gsap.to('.hero-bg', {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
        gsap.to('.hero-content', {
          yPercent: -12,
          opacity: 0.25,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="home" className="hero" ref={rootRef}>
      {/* Full-bleed cycling backdrop */}
      <div className="hero-bg" aria-hidden="true">
        {slides.map((p, i) => (
          <div
            key={p.name}
            className={`hero-slide ${slide === i ? 'active' : ''}`}
            style={{ background: p.img ? undefined : block(p.hue) }}
          >
            {p.img && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.img} alt="" />
            )}
          </div>
        ))}
        <div className="hero-scrim" />
      </div>

      <div className="hero-content">
        <div className="hero-eyebrow">
          <span className="dot" /> Available for work — Abu Dhabi, UAE
        </div>
        <h1 className="hero-title">
          <span className="hero-line"><span>Thuta Soe</span></span>
          <span className="hero-line"><span>Creative Director</span></span>
          <span className="hero-line"><span>&amp; Visual Artist</span></span>
        </h1>
        <div className="hero-meta">
          <p className="hero-tagline">
            Multidisciplinary creative shaping brand visuals, campaigns and motion
            for brands worldwide.
          </p>
          <a
            href="#work"
            className="hero-cta"
            onClick={(e) => { e.preventDefault(); scrollTo('#work'); }}
          >
            View work <span className="arrow">↓</span>
          </a>
        </div>
      </div>

      <div className="hero-counter" aria-hidden="true">
        <span className="hero-counter-current">{String(slide + 1).padStart(2, '0')}</span>
        <span className="hero-counter-sep">/</span>
        <span>{String(slides.length).padStart(2, '0')}</span>
        <span className="hero-counter-name">{slides[slide].name}</span>
      </div>

      <div className="hero-scroll" aria-hidden="true">
        <span>Scroll</span>
        <span className="hero-scroll-line" />
      </div>
    </section>
  );
}
