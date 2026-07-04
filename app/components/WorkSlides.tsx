"use client";

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { Project } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const block = (hue: number) =>
  `linear-gradient(145deg, hsl(${hue} 55% 42%), hsl(${(hue + 45) % 360} 60% 30%))`;

const solid = (hue: number) => `hsl(${hue} 60% 45%)`;

interface Props {
  works: Project[];
  onOpen: (p: Project) => void;
}

/**
 * Full-bleed vertical work slides (reference anatomy):
 * - each slide fills the viewport, stacked in normal flow
 * - the media is oversized by 20% vertically and scrubs on scroll,
 *   letting the solid accent background flash between slides
 * - 15% dark overlay, centered caption row: counter / name / category
 */
export default function WorkSlides({ works, onOpen }: Props) {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.utils.toArray<HTMLElement>('.ws-media').forEach((media) => {
        gsap.fromTo(
          media,
          { yPercent: -14 },
          {
            yPercent: 14,
            ease: 'none',
            scrollTrigger: {
              trigger: media.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      });
    },
    { scope: rootRef },
  );

  return (
    <section id="work" className="ws" ref={rootRef} aria-label="Selected work">
      {works.map((p, i) => (
        <div
          key={p.name}
          className="ws-slide"
          style={{ background: solid(p.hue) }}
        >
          <button
            type="button"
            className="ws-hit"
            onClick={() => onOpen(p)}
            aria-label={`Open case study: ${p.name}`}
          />
          <div
            className="ws-media"
            style={{ background: p.img || p.video ? undefined : block(p.hue) }}
          >
            {p.video ? (
              <video src={p.video} autoPlay muted loop playsInline poster={p.img} />
            ) : p.img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.img} alt="" />
            ) : null}
          </div>
          <div className="ws-shade" />
          <div className="ws-caption">
            <span className="ws-counter">{i + 1}/{works.length}</span>
            <span className="ws-name">{p.name}</span>
            <span className="ws-cat">{p.cat}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
