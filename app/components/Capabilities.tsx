"use client";

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { services } from '@/lib/data';

// hue per card until real imagery lands
const hues = [18, 205, 275, 340, 45, 150, 220, 300];

const block = (hue: number) =>
  `linear-gradient(145deg, hsl(${hue} 55% 42%), hsl(${(hue + 45) % 360} 60% 30%))`;

/**
 * Horizontally scrolling capability cards: image on top, title,
 * quiet grey description underneath.
 */
export default function Capabilities() {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.from('.cap-head', {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.cap-head', start: 'top 85%' },
      });
      gsap.from('.cap-card', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.07,
        scrollTrigger: { trigger: '.cap-row', start: 'top 82%' },
      });
    },
    { scope: rootRef },
  );

  return (
    <section id="capabilities" className="cap" ref={rootRef}>
      <h2 className="cap-head">Types of work</h2>
      <div className="cap-row">
        {services.map((s, i) => (
          <article key={s.num} className="cap-card">
            <div
              className="cap-card-media"
              style={{ background: block(hues[i % hues.length]) }}
            />
            <h3 className="cap-card-title">{s.title}</h3>
            <p className="cap-card-desc">{s.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
