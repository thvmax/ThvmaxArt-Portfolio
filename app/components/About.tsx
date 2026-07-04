"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { experience, skills, stats } from '@/lib/data';

export default function About() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from('.about-heading', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about-heading', start: 'top 85%' },
      });
      gsap.utils.toArray<HTMLElement>('.about-block').forEach((el) => {
        gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="about" ref={rootRef}>
      <h2 className="about-heading">About</h2>

      <div className="about-grid">
        <div className="about-block about-intro">
          <p className="about-bio">
            Thuta Soe is a multidisciplinary creative with over 7 years of
            experience across multinational companies and creative agencies —
            building visually captivating experiences that communicate a
            brand&rsquo;s message with clarity and craft.
          </p>
          <div className="about-stats">
            {stats.map((s) => (
              <div key={s.label} className="about-stat">
                <span className="about-stat-value">{s.value}</span>
                <span className="about-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="about-block">
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

        <div className="about-block">
          <h3 className="about-sub">Toolkit</h3>
          <ul className="skills-list">
            {skills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
