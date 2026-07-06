"use client";

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { experience, skills, stats, site } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function About() {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
    },
    { scope: rootRef },
  );

  return (
    <section id="about" className="about" ref={rootRef}>
      <h2 className="about-heading">About</h2>

      <div className="about-grid">
        <div className="about-block about-intro">
          <p className="about-bio">{site.aboutBio}</p>
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
