"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { experience, skills, stats } from '@/lib/data';

const BIO =
  'Multidisciplinary creative with over 7 years of experience across multinational companies and creative agencies — building visually captivating experiences that communicate a brand’s message with clarity and craft.';

export default function About() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Word-by-word statement reveal
      gsap.fromTo('.about-bio .w',
        { opacity: 0.12 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.02,
          scrollTrigger: {
            trigger: '.about-bio',
            start: 'top 80%',
            end: 'top 30%',
            scrub: true,
          },
        },
      );

      gsap.utils.toArray<HTMLElement>('.about-reveal').forEach((el) => {
        gsap.fromTo(el,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' },
          },
        );
      });

      gsap.fromTo('.stat',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08,
          scrollTrigger: { trigger: '.stats', start: 'top 85%' },
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="section about" ref={rootRef}>
      <div className="section-head about-reveal">
        <h2 className="section-title">About</h2>
        <div className="section-meta">The studio of one</div>
      </div>

      {/* Big scrub-reveal statement */}
      <p className="about-bio" aria-label={BIO}>
        {BIO.split(' ').map((w, i) => (
          <span className="w" key={i} aria-hidden="true">{w} </span>
        ))}
      </p>

      <div className="stats">
        {stats.map((s) => (
          <div key={s.label} className="stat">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="about-cols">
        <div className="about-exp about-reveal">
          <h3 className="about-sub">Experience</h3>
          {experience.map((exp) => (
            <div key={exp.role + exp.year} className="exp-row">
              <div>
                <div className="exp-role">{exp.role}</div>
                <div className="exp-co">{exp.co}</div>
              </div>
              <span className="exp-year">{exp.year}</span>
            </div>
          ))}
        </div>

        <div className="about-skills about-reveal">
          <h3 className="about-sub">Toolkit</h3>
          <div className="skills-grid">
            {skills.map((s) => (
              <span key={s} className="skill-tag">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
