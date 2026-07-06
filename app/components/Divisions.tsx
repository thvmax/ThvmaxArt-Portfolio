"use client";

import { useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { disciplines, works, type Project } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const block = (hue: number) =>
  `linear-gradient(145deg, hsl(${hue} 55% 42%), hsl(${(hue + 45) % 360} 60% 30%))`;

/**
 * Pinned full-frame reveal.
 * Each discipline is a full-viewport panel: title on the left column,
 * description + featured project on the right. While the section is
 * pinned, each next panel wipes up over the previous via a scrubbed
 * clip-path animation. Unpins once the last panel is revealed.
 */
export default function Divisions({ onOpen }: { onOpen: (p: Project) => void }) {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const cards = gsap.utils.toArray<HTMLElement>('.dpin-card');
      if (cards.length < 2) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          // one viewport of scroll per wipe, unpin after the last one
          end: () => `+=${(cards.length - 1) * 100}%`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      cards.slice(1).forEach((card) => {
        tl.fromTo(
          card,
          { clipPath: 'inset(100% 0 0 0)' },
          { clipPath: 'inset(0% 0 0 0)', ease: 'none', duration: 1 },
        );
        // slight settle on the incoming card's content for depth
        tl.from(
          card.querySelector('.dpin-card-body'),
          { yPercent: 12, ease: 'none', duration: 1 },
          '<',
        );
      });
    },
    { scope: rootRef },
  );

  return (
    <section id="disciplines" className="dpin" ref={rootRef}>
      {disciplines.map((d) => {
        const project = works.find((w) => w.name === d.featured);
        return (
          <article key={d.title} className="dpin-card">
            <div className="dpin-card-band" style={{ background: d.gradient }} />
            <div className="dpin-card-body">
              <h2 className="dpin-card-title">{d.title}</h2>

              <div className="dpin-card-right">
                <p className="dpin-card-desc">
                  {d.desc}{' '}
                  <Link href={`/${d.slug}`} className="dpin-learn">
                    <span aria-hidden="true">&#8627;</span> Learn more
                  </Link>
                </p>

                {project && (
                  <button
                    type="button"
                    className="dpin-feature"
                    onClick={() => onOpen(project)}
                  >
                    <span className="dpin-feature-caption">
                      <span>{project.name}</span>
                      <span className="dpin-feature-cat">{project.cat}</span>
                    </span>
                    <span
                      className="dpin-feature-media"
                      style={{
                        background:
                          project.img || project.video ? undefined : block(project.hue),
                      }}
                    >
                      {project.video ? (
                        <video src={project.video} autoPlay muted loop playsInline />
                      ) : project.img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={project.img} alt={project.name} />
                      ) : null}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
