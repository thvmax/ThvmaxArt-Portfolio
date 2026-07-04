"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import type { Project } from '@/lib/data';

const block = (hue: number) =>
  `linear-gradient(145deg, hsl(${hue} 55% 42%), hsl(${(hue + 45) % 360} 60% 30%))`;

interface Props {
  works: Project[];
  onOpen: (p: Project) => void;
}

// Scroll-driven stacking deck: every slide is a sticky full-viewport
// panel; the next one scrolls up and covers it while the one underneath
// gently scales down and dims.
export default function WorkStack({ works, onOpen }: Props) {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray<HTMLElement>('.stack-slide');
      slides.forEach((slide, i) => {
        const next = slides[i + 1];
        if (!next) return;
        // As the next panel rises, this one settles back
        gsap.fromTo(
          slide.querySelector('.stack-slide-inner'),
          { scale: 1, filter: 'brightness(1)' },
          {
            scale: 0.94,
            filter: 'brightness(0.55)',
            ease: 'none',
            scrollTrigger: {
              trigger: next,
              start: 'top bottom',
              end: 'top top',
              scrub: true,
            },
          },
        );
        // Caption drifts up slightly for depth
        gsap.fromTo(
          slide.querySelector('.stack-overlay'),
          { yPercent: 0, opacity: 1 },
          {
            yPercent: -40,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: next,
              start: 'top 80%',
              end: 'top 15%',
              scrub: true,
            },
          },
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, [works]);

  return (
    <section id="work" className="stack" ref={rootRef} aria-label="Selected work">
      {works.map((p, i) => (
        <div key={p.name} className="stack-slide">
          <div className="stack-slide-inner">
            <button
              type="button"
              className="stack-hit"
              onClick={() => onOpen(p)}
              aria-label={`Open case study: ${p.name}`}
            >
              <span className="stack-view">View case &#8627;</span>
            </button>

            <div
              className="stack-media"
              style={{ background: p.img || p.video ? undefined : block(p.hue) }}
            >
              {p.video ? (
                <video src={p.video} autoPlay muted loop playsInline poster={p.img} />
              ) : p.img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.img} alt="" />
              ) : null}
            </div>

            <div className="stack-overlay">
              <span className="stack-counter">{i + 1}/{works.length}</span>
              <span className="stack-name">{p.name}</span>
              <span className="stack-cat">{p.cat}</span>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
