"use client";

import Link from 'next/link';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { plate, v2Site, v2Work, type V2Project } from '@/lib/v2content';
import Reveal from './Reveal';
import ScrambleLabel from './ScrambleLabel';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Props {
  project: V2Project;
  next: V2Project;
}

/** Figma frame: ThvmaxArt / 03 Project — driven by v2content. */
export default function CaseStudy({ project, next }: Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const study = project.study;
  const index = v2Work.findIndex((p) => p.slug === project.slug) + 1;
  const nextIndex = v2Work.findIndex((p) => p.slug === next.slug) + 1;
  const total = String(v2Work.length).padStart(2, '0');

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // Hero plate drifts and settles as the page moves under it
      gsap.fromTo(
        '.v2-plate-core > .v2-plate-fill',
        { yPercent: -8, scale: 1.12 },
        {
          yPercent: 8,
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.v2-plate', start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );

      gsap.utils.toArray<HTMLElement>('.v2-still').forEach((still) => {
        gsap.fromTo(
          still.querySelector('.v2-still-fill'),
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: { trigger: still, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });
    },
    { scope: rootRef },
  );

  return (
    <article className="v2-case" ref={rootRef}>
      <header className="v2-case-head">
        <Reveal>
          <ScrambleLabel accent>{`CASE STUDY ${String(index).padStart(2, '0')} / ${total}`}</ScrambleLabel>
          <h1 className="v2-display v2-display--lg" style={{ lineHeight: 0.98 }}>
            {project.nameLines.map((line) => (
              <span key={line} style={{ display: 'block' }}>
                {line}
              </span>
            ))}
          </h1>
          {study && <p className="v2-case-lede">{study.lede}</p>}
        </Reveal>
      </header>

      <Reveal className="v2-plate" delay={0.05}>
        <div className="v2-plate-core">
          <div
            className="v2-plate-fill v2-still-fill"
            style={{ background: plate(project.accent, 140), position: 'absolute', inset: '-10%' }}
          />
          <span className="v2-plate-label">KEY VISUAL — MASTER</span>
        </div>
      </Reveal>

      {study && (
        <Reveal className="v2-case-meta" delay={0.05}>
          <div>
            <span className="v2-label v2-label--accent">CLIENT</span>
            <p className="v2-case-meta-value">{study.client}</p>
          </div>
          <div>
            <span className="v2-label v2-label--accent">ROLE</span>
            <p className="v2-case-meta-value">{study.role}</p>
          </div>
          <div>
            <span className="v2-label v2-label--accent">YEAR</span>
            <p className="v2-case-meta-value">{study.year}</p>
          </div>
          <div>
            <span className="v2-label v2-label--accent">DELIVERABLES</span>
            <p className="v2-case-meta-value">{study.deliverables}</p>
          </div>
        </Reveal>
      )}

      {study?.chapters.map((c) => (
        <Reveal className="v2-chapter" key={c.label}>
          <div>
            <ScrambleLabel accent>{c.label}</ScrambleLabel>
            <h2 className="v2-chapter-heading">{c.heading}</h2>
          </div>
          <p className="v2-chapter-body">{c.body}</p>
        </Reveal>
      ))}

      {study && study.stills.length > 0 && (
        <>
          <div style={{ padding: 'clamp(3rem, 6.6vw, 7.5rem) var(--pad) 0' }}>
            <ScrambleLabel accent>SELECTED FRAMES</ScrambleLabel>
          </div>
          <div className="v2-stills">
            {study.stills.map((s) => (
              <div
                key={s.label}
                className={`v2-still ${s.span === 'third' ? 'v2-still--third' : ''}`}
                data-cursor="hover"
              >
                <div
                  className="v2-still-fill"
                  style={{ background: plate(project.accent, 131), position: 'absolute', inset: '-8%' }}
                />
                <span className="v2-still-grade" style={{ opacity: s.grade }} />
                <span className="v2-still-scan" />
                <span className="v2-still-label">{s.label}</span>
                <span className="v2-still-note">{s.note}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {study?.result && (
        <Reveal className="v2-result v2-invert">
          <div>
            <ScrambleLabel>THE RESULT</ScrambleLabel>
            <div className="v2-result-figure">{study.result.figure}</div>
            <p className="v2-result-caption">{study.result.caption}</p>
          </div>
          <p className="v2-result-body">{study.result.body}</p>
        </Reveal>
      )}

      <section className="v2-next">
        <Reveal>
          <ScrambleLabel accent>NEXT CASE STUDY</ScrambleLabel>
          <Link className="v2-next-link" href={`/work/${next.slug}`} data-cursor="hover">
            <div className="v2-next-grid">
              <div>
                <span className="v2-next-title">
                  {next.nameLines.map((line) => (
                    <span key={line} style={{ display: 'block' }}>
                      {line}
                    </span>
                  ))}
                </span>
                <p className="v2-next-meta">{`${next.cat} · ${next.year}`}</p>
              </div>
              <div className="v2-next-plate" style={{ background: plate(next.accent, 133) }}>
                <span className="v2-next-plate-count">
                  {String(nextIndex).padStart(2, '0')} / {total}
                </span>
              </div>
            </div>
          </Link>
        </Reveal>

        <div className="v2-band-foot">
          <span>{v2Site.owner}</span>
          <span>{v2Site.copyright}</span>
        </div>
      </section>

      <Link className="v2-back" href="/work" data-cursor="hover">
        ← ALL WORK
      </Link>
    </article>
  );
}
