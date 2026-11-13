"use client";

import Link from 'next/link';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { plate, v2Site, v2Work, type V2Project, type V2Still } from '@/lib/v2content';
import Reveal from './Reveal';
import ScrambleLabel from './ScrambleLabel';
import ArrowUpRight from './ArrowUpRight';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Props {
  project: V2Project;
  next: V2Project;
}

type MediaRow =
  | { type: 'duo'; items: [V2Still, V2Still] }
  | { type: 'single'; item: V2Still };

/** Case study — art-director editorial: full-bleed hero, meta strip,
 *  single-column chapters, one-image-per-row gallery with two-up pairs. */
export default function CaseStudy({ project, next }: Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const study = project.study;
  const index = v2Work.findIndex((p) => p.slug === project.slug) + 1;
  const nextIndex = v2Work.findIndex((p) => p.slug === next.slug) + 1;
  const total = String(v2Work.length).padStart(2, '0');

  // Group consecutive half-width stills into an occasional two-up pair;
  // everything else sits on its own row.
  const rows: MediaRow[] = [];
  if (study) {
    for (let i = 0; i < study.stills.length; i++) {
      const s = study.stills[i];
      const n = study.stills[i + 1];
      if (s.span === 'half' && n?.span === 'half') {
        rows.push({ type: 'duo', items: [s, n] });
        i += 1;
      } else {
        rows.push({ type: 'single', item: s });
      }
    }
  }

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.fromTo(
        '.v2-case-hero-media > .v2-case-hero-fill',
        { yPercent: -8, scale: 1.12 },
        {
          yPercent: 8,
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.v2-case-hero', start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );

      gsap.utils.toArray<HTMLElement>('.v2-case-media').forEach((media) => {
        gsap.fromTo(
          media.querySelector('.v2-case-media-fill'),
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });
    },
    { scope: rootRef },
  );

  const meta = study
    ? [
        { label: 'CLIENT', value: study.client },
        { label: 'YEAR', value: study.year },
        { label: 'ROLE', value: study.role },
        { label: 'DISCIPLINE', value: project.cat },
      ]
    : [];

  return (
    <article className="v2-case" ref={rootRef}>
      <header className="v2-case-head">
        <Reveal>
          <ScrambleLabel accent>{`CASE STUDY ${String(index).padStart(2, '0')} / ${total}`}</ScrambleLabel>
          <h1 className="v2-display v2-display--lg v2-case-title">
            {project.nameLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          {study && <p className="v2-case-lede">{study.lede}</p>}
        </Reveal>
      </header>

      <Reveal className="v2-case-hero" delay={0.05}>
        <div className="v2-case-hero-media">
          <span className="v2-case-hero-fill" style={{ background: plate(project.accent, 140) }} />
          <span className="v2-case-hero-label">{project.cat}</span>
        </div>
      </Reveal>

      {meta.length > 0 && (
        <Reveal className="v2-case-meta" delay={0.05}>
          {meta.map((m) => (
            <div key={m.label} className="v2-case-meta-item">
              <span className="v2-label v2-label--accent">{m.label}</span>
              <p className="v2-case-meta-value">{m.value}</p>
            </div>
          ))}
        </Reveal>
      )}

      {study?.chapters.map((c) => (
        <Reveal as="section" className="v2-case-section" key={c.label}>
          <ScrambleLabel accent>{c.label}</ScrambleLabel>
          <h2 className="v2-case-heading">{c.heading}</h2>
          <p className="v2-case-body">{c.body}</p>
        </Reveal>
      ))}

      {study && study.stills.length > 0 && (
        <Reveal className="v2-case-gallery">
          <ScrambleLabel accent>SELECTED FRAMES</ScrambleLabel>
          <div className="v2-case-media-grid">
            {rows.map((row, i) =>
              row.type === 'duo' ? (
                <div className="v2-case-duo" key={`${row.items[0].label}-${i}`}>
                  {row.items.map((s) => (
                    <div key={s.label} className="v2-case-media" data-cursor="hover">
                      <span className="v2-case-media-fill" style={{ background: plate(project.accent, 131) }} />
                      <span className="v2-case-media-grade" style={{ opacity: s.grade }} />
                      <span className="v2-case-media-label">{s.label}</span>
                      <span className="v2-case-media-note">{s.note}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  key={row.item.label}
                  className={`v2-case-media ${row.item.span === 'third' ? 'v2-case-media--third' : ''}`}
                  data-cursor="hover"
                >
                  <span className="v2-case-media-fill" style={{ background: plate(project.accent, 131) }} />
                  <span className="v2-case-media-grade" style={{ opacity: row.item.grade }} />
                  <span className="v2-case-media-label">{row.item.label}</span>
                  <span className="v2-case-media-note">{row.item.note}</span>
                </div>
              ),
            )}
          </div>
        </Reveal>
      )}

      {study?.result && (
        <Reveal className="v2-case-result">
          <div className="v2-case-result-inner">
            <div>
              <ScrambleLabel>THE RESULT</ScrambleLabel>
              <div className="v2-case-result-figure">{study.result.figure}</div>
              <p className="v2-case-result-caption">{study.result.caption}</p>
            </div>
            <p className="v2-case-result-body">{study.result.body}</p>
          </div>
        </Reveal>
      )}

      <footer className="v2-case-next">
        <Reveal>
          <ScrambleLabel accent>NEXT CASE STUDY</ScrambleLabel>
          <Link className="v2-case-next-link" href={`/work/${next.slug}`} data-cursor="hover">
            <div>
              <span className="v2-case-next-title">
                {next.nameLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </span>
              <span className="v2-case-next-meta">{`${next.cat} · ${next.year}`}</span>
            </div>
            <div className="v2-case-next-media" style={{ background: plate(next.accent, 133) }}>
              <span className="v2-case-next-count">
                {String(nextIndex).padStart(2, '0')} / {total}
              </span>
              <span className="v2-case-next-arrow" aria-hidden="true">
                <ArrowUpRight />
              </span>
            </div>
          </Link>
        </Reveal>

        <div className="v2-band-foot">
          <span>{v2Site.owner}</span>
          <span>{v2Site.copyright}</span>
        </div>
      </footer>

      <Link className="v2-back" href="/work" data-cursor="hover">
        ← ALL WORK
      </Link>
    </article>
  );
}