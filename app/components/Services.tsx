"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { services } from '@/lib/data';

export default function Services() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.section-head',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.section-head', start: 'top 88%' },
        },
      );

      gsap.utils.toArray<HTMLElement>('.service-row').forEach((row) => {
        // Border draws in from the left, content rises
        gsap.fromTo(row,
          { '--line-scale': 0 } as gsap.TweenVars,
          {
            '--line-scale': 1, duration: 1.1, ease: 'power3.inOut',
            scrollTrigger: { trigger: row, start: 'top 90%' },
          } as gsap.TweenVars,
        );
        gsap.fromTo(row.children,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.06,
            scrollTrigger: { trigger: row, start: 'top 88%' },
          },
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" className="section" ref={rootRef}>
      <div className="section-head">
        <h2 className="section-title">Creative Services</h2>
        <div className="section-meta">What I do</div>
      </div>
      <div className="services-list">
        {services.map((s) => (
          <div key={s.num} className="service-row">
            <span className="service-num">{s.num}</span>
            <h3 className="service-title">{s.title}</h3>
            <p className="service-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
