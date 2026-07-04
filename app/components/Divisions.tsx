"use client";

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { works, type Project } from '@/lib/data';

// Three discipline groups. Each card features one project.
const divisions = [
  {
    title: 'Art Direction',
    desc: 'I build campaign worlds for global brands — key visuals, TVCs and rollouts that cut through.',
    project: 'STING Nightlife Campaign',
    gradient: 'linear-gradient(90deg, #ffb199, #ff4e33, #b8235a)',
  },
  {
    title: 'Motion & Production',
    desc: 'From boards to final grade — animation, edit and production management across film and social.',
    project: 'Pepsi Meals AR Campaign',
    gradient: 'linear-gradient(90deg, #a8c6ff, #4d7dff, #6a4dff)',
  },
  {
    title: 'Digital & UI',
    desc: 'Product interfaces and design systems that make heavy enterprise software feel effortless.',
    project: 'Velosi ERP Software UI/UX',
    gradient: 'linear-gradient(90deg, #ffd7a8, #ff9d4d, #ff5c33)',
  },
];

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
      {divisions.map((d) => {
        const project = works.find((w) => w.name === d.project);
        return (
          <article key={d.title} className="dpin-card">
            <div className="dpin-card-band" style={{ background: d.gradient }} />
            <div className="dpin-card-body">
              <h2 className="dpin-card-title">{d.title}</h2>

              <div className="dpin-card-right">
                <p className="dpin-card-desc">
                  {d.desc}{' '}
                  <button
                    type="button"
                    className="dpin-learn"
                    onClick={() => project && onOpen(project)}
                  >
                    <span aria-hidden="true">&#8627;</span> Learn more
                  </button>
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
