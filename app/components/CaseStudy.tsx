"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRef, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { plate, projectMeta, v2Site, v2Work, type V2Project, type V2Still } from '@/lib/v2content';
import Reveal from './Reveal';
import ScrambleLabel from './ScrambleLabel';
import ArrowUpRight from './ArrowUpRight';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Props {
  project: V2Project;
  next: V2Project;
}

const PER_ROW = { full: 1, half: 2, third: 3, quarter: 4 } as const;
// plates stand in where there is no artwork yet, at the old fixed proportions
const PLATE_RATIO = { full: 1740 / 1000, half: 4 / 3, third: 1740 / 1180, quarter: 1 } as const;
const SIZES = {
  1: '(max-width: 700px) 100vw, 80vw',
  2: '(max-width: 700px) 100vw, 46vw',
  3: '(max-width: 700px) 50vw, 31vw',
  4: '(max-width: 700px) 50vw, 23vw',
} as const;

const ratio = (s: V2Still) => (s.w && s.h ? s.w / s.h : PLATE_RATIO[s.span ?? 'full']);

/** Consecutive stills of one span share a row, up to that span's count. */
function toRows(stills: V2Still[]): V2Still[][] {
  const rows: V2Still[][] = [];
  let cur: V2Still[] = [];
  for (const s of stills) {
    const span = s.span ?? 'full';
    const first = cur[0];
    if (first && ((first.span ?? 'full') !== span || cur.length >= PER_ROW[span])) {
      rows.push(cur);
      cur = [];
    }
    cur.push(s);
  }
  if (cur.length) rows.push(cur);
  return rows;
}

/** One piece of work at its own proportions, captioned underneath. */
function Frame({ still, accent, sizes }: { still: V2Still; accent: string; sizes: string }) {
  const style = { '--r': ratio(still).toFixed(4) } as CSSProperties;
  return (
    <figure className="v2-case-frame" style={style}>
      <div className={`v2-case-frame-media${still.src || still.video ? '' : ' v2-case-frame-media--plate'}`}>
        {still.video ? (
          <video className="v2-case-frame-art" src={still.video} autoPlay muted loop playsInline preload="metadata" />
        ) : still.src ? (
          <Image className="v2-case-frame-art" src={still.src} alt={`${still.label}${still.note ? ` — ${still.note}` : ''}`} fill sizes={sizes} />
        ) : (
          <>
            <span className="v2-case-media-fill" style={{ background: plate(accent, 131) }} />
            <span className="v2-case-media-grade" style={{ opacity: still.grade ?? 0.22 }} />
          </>
        )}
      </div>
      <figcaption className="v2-case-cap">
        <span className="v2-case-cap-label">{still.label}</span>
        {still.note && <span className="v2-case-cap-note">{still.note}</span>}
      </figcaption>
    </figure>
  );
}

/** A row of frames that share one height, each as wide as its proportions ask. */
function Rows({ stills, accent }: { stills: V2Still[]; accent: string }) {
  return (
    <div className="v2-case-rows">
      {toRows(stills).map((row, i) => {
        const sum = row.reduce((a, s) => a + ratio(s), 0);
        const kind = row.length === 1 ? ' v2-case-row--single' : sum > 2.6 && row.length === 2 ? ' v2-case-row--wide' : '';
        return (
          <Reveal className={`v2-case-row v2-case-row--n${row.length}${kind}`} key={`${row[0].label}-${i}`}>
            <div className="v2-case-row-inner" style={{ '--sum': sum.toFixed(4), '--n': row.length } as CSSProperties}>
              {row.map((s, j) => (
                <Frame key={`${s.label}-${j}`} still={s} accent={accent} sizes={SIZES[row.length as 1 | 2 | 3 | 4]} />
              ))}
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

/** Case study — art-director editorial: hero, meta strip, chapters each
 *  followed by their frames, the result, and the next project. */
export default function CaseStudy({ project, next }: Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const study = project.study;
  const hero = project.hero;
  const index = v2Work.findIndex((p) => p.slug === project.slug) + 1;
  const nextIndex = v2Work.findIndex((p) => p.slug === next.slug) + 1;
  const total = String(v2Work.length).padStart(2, '0');
  const nextArt = next.hero?.src ?? next.hero?.set?.[0]?.src ?? next.cover;

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

      // only the stand-in plates drift; real artwork stays still and whole
      gsap.utils.toArray<HTMLElement>('.v2-case-frame-media--plate').forEach((media) => {
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
      ].filter((m) => m.value)
    : [];

  const set = hero?.set;
  const setSum = set ? set.reduce((a, s) => a + ratio(s), 0) : 0;

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
        {set ? (
          <div
            className="v2-case-hero-media v2-case-hero-media--set"
            style={
              {
                background: plate(project.accent, 140),
                '--n': set.length,
                '--sum': setSum.toFixed(4),
                '--maxr': Math.max(...set.map(ratio)).toFixed(4),
                '--rows': Math.ceil(set.length / 2),
              } as CSSProperties
            }
          >
            <div className="v2-case-hero-set">
              {set.map((s) => (
                <div className="v2-case-hero-piece" key={s.src} style={{ '--r': ratio(s).toFixed(4) } as CSSProperties}>
                  <Image src={s.src!} alt={s.label} fill priority sizes="(max-width: 700px) 34vw, 28vw" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="v2-case-hero-media">
            {hero?.video ? (
              <video
                className="v2-case-hero-fill v2-case-hero-art"
                src={hero.video}
                poster={hero.src}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
            ) : hero?.src ? (
              <span className="v2-case-hero-fill">
                <Image className="v2-case-hero-art" src={hero.src} alt={project.name} fill priority sizes="100vw" />
              </span>
            ) : (
              <span className="v2-case-hero-fill" style={{ background: plate(project.accent, 140) }} />
            )}
          </div>
        )}
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
        <section className="v2-case-chapter" key={c.label}>
          <Reveal className="v2-case-section">
            <ScrambleLabel accent>{c.label}</ScrambleLabel>
            <h2 className="v2-case-heading">{c.heading}</h2>
            <p className="v2-case-body">{c.body}</p>
          </Reveal>
          {c.media && c.media.length > 0 && (
            <div className="v2-case-gallery">
              <Rows stills={c.media} accent={project.accent} />
            </div>
          )}
        </section>
      ))}

      {study && study.stills.length > 0 && (
        <div className="v2-case-gallery">
          <Rows stills={study.stills} accent={project.accent} />
        </div>
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
              <span className="v2-case-next-meta">{projectMeta(next)}</span>
            </div>
            <div className="v2-case-next-media" style={{ background: plate(next.accent, 133) }}>
              {nextArt && <Image className="v2-case-next-art" src={nextArt} alt="" fill sizes="(max-width: 900px) 90vw, 36vw" />}
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
