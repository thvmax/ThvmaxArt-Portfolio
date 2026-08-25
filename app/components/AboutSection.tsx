"use client";

import Image from 'next/image';
import { useRef, type MouseEvent } from 'react';
import { gsap } from 'gsap';
import { v2About } from '@/lib/v2content';
import Reveal from './Reveal';
import ScrambleLabel from './ScrambleLabel';
import StatCounter from './StatCounter';

/** 04 · ABOUT — bio, portrait plate, stats, experience, toolkit, education. */
export default function AboutSection() {
  const portraitRef = useRef<HTMLDivElement | null>(null);

  // Portrait tilts toward the cursor — small angle, long ease.
  const tilt = (e: MouseEvent<HTMLDivElement>) => {
    const el = portraitRef.current;
    if (!el) return;
    if (window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return;

    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;

    gsap.to(el, {
      rotateY: px * 9,
      rotateX: -py * 9,
      transformPerspective: 900,
      duration: 0.6,
      ease: 'power3.out',
    });
  };

  const reset = () => {
    gsap.to(portraitRef.current, { rotateY: 0, rotateX: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)' });
  };

  return (
    <section className="v2-section" id="about">
      <Reveal>
        <ScrambleLabel>{v2About.label}</ScrambleLabel>
        <h1 className="v2-display">
          {v2About.headingLines.map((line) => (
            <span key={line} style={{ display: 'block' }}>
              {line}
            </span>
          ))}
          {v2About.headingRest}
          <span className="v2-italic">{v2About.headingItalic}</span>.
        </h1>
      </Reveal>

      <div className="v2-about-grid">
        <Reveal className="v2-about-copy" delay={0.05}>
          <p className="v2-lead">{v2About.lead}</p>
          <p className="v2-body">{v2About.body}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            ref={portraitRef}
            className="v2-portrait"
            onMouseMove={tilt}
            onMouseLeave={reset}
            data-cursor="hover"
          >
            {/* Figma export, committed to public/ */}
            <Image
              src={v2About.portrait.src}
              alt="Thu Ta Soe"
              fill
              sizes="(max-width: 1100px) 90vw, 30vw"
              style={{ objectFit: 'cover' }}
            />
            <span className="v2-portrait-label">{v2About.portrait.label}</span>
            <span className="v2-portrait-name">
              {v2About.portrait.name}
              <br />
              {v2About.portrait.place}
            </span>
          </div>
        </Reveal>
      </div>

      <Reveal className="v2-stats" delay={0.05}>
        {v2About.stats.map((s) => (
          <div key={s.label}>
            <StatCounter value={s.value} className="v2-stat-value" />
            <span className="v2-stat-label">{s.label}</span>
          </div>
        ))}
      </Reveal>

      <Reveal className="v2-sub">
        <ScrambleLabel accent>EXPERIENCE</ScrambleLabel>
        <div className="v2-exp">
          {v2About.experience.map((x) => (
            <div className="v2-exp-row" key={x.role + x.year} data-cursor="hover">
              <div>
                <div className="v2-exp-role">{x.role}</div>
                <div className="v2-exp-co">{x.co}</div>
              </div>
              <p className="v2-exp-note">{x.note}</p>
              <span className="v2-exp-year">{x.year}</span>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="v2-cols">
        <Reveal>
          <ScrambleLabel accent>TOOLKIT</ScrambleLabel>
          <div className="v2-toolkit">
            {v2About.toolkit.map((t) => (
              <div key={t.label}>
                <span className="v2-toolkit-label">{t.label}</span>
                <p className="v2-toolkit-value">{t.value}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <ScrambleLabel accent>EDUCATION</ScrambleLabel>
          <div className="v2-edu">
            {v2About.education.map((e) => (
              <div key={e.title}>
                <div className="v2-edu-title">{e.title}</div>
                <div className="v2-edu-meta">{e.meta}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
