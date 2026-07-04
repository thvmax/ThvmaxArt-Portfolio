"use client";

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import type { Project } from '@/lib/data';

const block = (hue: number) =>
  `linear-gradient(145deg, hsl(${hue} 55% 42%), hsl(${(hue + 45) % 360} 60% 30%))`;

interface Props {
  works: Project[];
  onOpen: (p: Project) => void;
}

/**
 * Pinned horizontal slider.
 * Vertical scroll translates the track on the x-axis (scrub: 1).
 * Inside every card the media is oversized (scale 1.2) and drifts in
 * the opposite direction via a containerAnimation-linked ScrollTrigger,
 * producing the parallax-window effect.
 */
export default function ProjectsSlider({ works, onOpen }: Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const track = trackRef.current;
      if (!track) return;

      const distance = () => track.scrollWidth - window.innerWidth;

      // 1 — translate vertical scroll into horizontal movement
      const slide = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // 2 — media parallax inside each card, opposite direction
      gsap.utils.toArray<HTMLElement>('.hs-card').forEach((card) => {
        const media = card.querySelector('.hs-media > *');
        if (!media) return;
        gsap.fromTo(
          media,
          { xPercent: -7 },
          {
            xPercent: 7,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              containerAnimation: slide,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        );
      });
    },
    { scope: rootRef },
  );

  return (
    <section id="work" className="hs" ref={rootRef} aria-label="Selected work">
      <div className="hs-head">
        <h2 className="hs-heading">Selected work</h2>
        <span className="hs-hint">Keep scrolling &#8594;</span>
      </div>

      <div className="hs-track" ref={trackRef}>
        {works.map((p, i) => (
          <article key={p.name} className="hs-card">
            <button
              type="button"
              className="hs-card-btn"
              onClick={() => onOpen(p)}
              aria-label={`Open case study: ${p.name}`}
            >
              <span className="hs-media">
                {p.video ? (
                  <video src={p.video} autoPlay muted loop playsInline poster={p.img} />
                ) : p.img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.img} alt="" />
                ) : (
                  <span className="hs-fill" style={{ background: block(p.hue) }} />
                )}
              </span>
              <span className="hs-caption">
                <span className="hs-caption-num">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="hs-caption-name">{p.name}</span>
                <span className="hs-caption-cat">{p.cat}</span>
              </span>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
