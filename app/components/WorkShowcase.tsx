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

// Silent-house-style layout: first card full-bleed, then alternating
// wide/narrow pairs. Sizes are expressed as CSS classes.
const spanFor = (i: number): 'full' | 'wide' | 'narrow' => {
  if (i === 0) return 'full';
  // pairs after the first: [wide, narrow], [narrow, wide], …
  const pairIndex = Math.floor((i - 1) / 2);
  const first = (i - 1) % 2 === 0;
  const flipped = pairIndex % 2 === 1;
  return first === !flipped ? 'wide' : 'narrow';
};

export default function WorkShowcase({ works, onOpen }: Props) {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Section heading reveal
      gsap.fromTo('.works-head',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.works-head', start: 'top 88%' },
        },
      );

      gsap.utils.toArray<HTMLElement>('.work-card').forEach((card) => {
        const media = card.querySelector('.work-card-media');
        const inner = card.querySelector(
          '.work-card-media img, .work-card-media video, .work-card-media .work-card-fill',
        );
        const info = card.querySelector('.work-card-info');

        if (reduced) return;

        // Scale-in reveal inside the clipped frame
        if (inner) {
          gsap.fromTo(inner,
            { scale: 1.18 },
            {
              scale: 1, duration: 1.4, ease: 'power3.out',
              scrollTrigger: { trigger: card, start: 'top 85%' },
            },
          );
        }
        if (media) {
          gsap.fromTo(media,
            { clipPath: 'inset(0 0 14% 0)', y: 60 },
            {
              clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1.2, ease: 'power3.out',
              scrollTrigger: { trigger: card, start: 'top 85%' },
            },
          );
          // Continuous scrub parallax — image drifts inside its frame
          if (inner) {
            gsap.fromTo(inner,
              { yPercent: -6 },
              {
                yPercent: 6, ease: 'none',
                scrollTrigger: {
                  trigger: card,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                },
              },
            );
          }
        }
        if (info) {
          gsap.fromTo(info,
            { y: 30, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.15,
              scrollTrigger: { trigger: card, start: 'top 82%' },
            },
          );
        }
      });
    }, rootRef);

    return () => ctx.revert();
  }, [works]);

  return (
    <section id="work" className="section works" ref={rootRef}>
      <div className="section-head works-head">
        <h2 className="section-title">Selected Works</h2>
        <div className="section-meta">
          2019 — 2026<br />
          {works.length} projects
        </div>
      </div>

      <div className="works-grid">
        {works.map((p, i) => (
          <article key={p.name} className={`work-card work-card--${spanFor(i)}`}>
            <button
              type="button"
              className="work-card-btn"
              onClick={() => onOpen(p)}
              aria-label={`Open case study: ${p.name}`}
            >
              <div className="work-card-media">
                {p.video ? (
                  <video src={p.video} autoPlay muted loop playsInline poster={p.img} />
                ) : p.img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.img} alt={p.name} />
                ) : (
                  <div className="work-card-fill" style={{ background: block(p.hue) }} />
                )}
                <span className="work-card-view" aria-hidden="true">View case →</span>
              </div>
              <div className="work-card-info">
                <span className="work-card-num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="work-card-name">{p.name}</h3>
                <div className="work-card-meta">
                  <span>{p.cat}</span>
                  <span className="work-card-year">{p.year}</span>
                </div>
              </div>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
