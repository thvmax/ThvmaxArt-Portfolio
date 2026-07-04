"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { works, type Project } from '@/lib/data';

// Three discipline groups, silent-house style numbered rows.
// Each features one project from the works list.
const divisions = [
  {
    num: '1',
    title: 'Art Direction',
    desc: 'I build campaign worlds for global brands — key visuals, TVCs and rollouts that cut through.',
    project: 'STING Nightlife Campaign',
    gradient: 'linear-gradient(90deg, #ffb199, #ff4e33, #b8235a)',
  },
  {
    num: '2',
    title: 'Motion & Production',
    desc: 'From boards to final grade — animation, edit and production management across film and social.',
    project: 'Pepsi Meals AR Campaign',
    gradient: 'linear-gradient(90deg, #a8c6ff, #4d7dff, #6a4dff)',
  },
  {
    num: '3',
    title: 'Digital & UI',
    desc: 'Product interfaces and design systems that make heavy enterprise software feel effortless.',
    project: 'Velosi ERP Software UI/UX',
    gradient: 'linear-gradient(90deg, #ffd7a8, #ff9d4d, #ff5c33)',
  },
];

const block = (hue: number) =>
  `linear-gradient(145deg, hsl(${hue} 55% 42%), hsl(${(hue + 45) % 360} 60% 30%))`;

export default function Divisions({ onOpen }: { onOpen: (p: Project) => void }) {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.division').forEach((row) => {
        gsap.from(row.querySelectorAll('.division-inner > *'), {
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: row, start: 'top 78%' },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="disciplines" className="divisions" ref={rootRef}>
      {divisions.map((d) => {
        const project = works.find((w) => w.name === d.project);
        return (
          <article key={d.num} className="division">
            <div className="division-band" style={{ background: d.gradient }} />
            <div className="division-inner">
              <span className="division-num">{d.num}</span>
              <h2 className="division-title">{d.title}</h2>
              <div className="division-right">
                <p className="division-desc">
                  {d.desc}{' '}
                  <a
                    className="arrow-link arrow-link--dim"
                    href="#work"
                    onClick={(e) => {
                      e.preventDefault();
                      if (project) onOpen(project);
                    }}
                  >
                    <span className="arrow" aria-hidden="true">&#8627;</span> Learn more
                  </a>
                </p>

                {project && (
                  <button
                    type="button"
                    className="division-feature"
                    onClick={() => onOpen(project)}
                  >
                    <span className="division-feature-caption">
                      <span>{project.name}</span>
                      <span className="division-feature-cat">{project.cat}</span>
                    </span>
                    <span
                      className="division-feature-media"
                      style={{
                        background: project.img || project.video ? undefined : block(project.hue),
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
