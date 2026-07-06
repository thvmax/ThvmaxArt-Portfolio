"use client";

import { site, type Project, type CaseImage } from '@/lib/data';

const block = (hue: number) =>
  `linear-gradient(145deg, hsl(${hue} 55% 42%), hsl(${(hue + 45) % 360} 60% 30%))`;

interface Props {
  project: Project | null;
  onClose: () => void;
}

export default function CaseStudyModal({ project, onClose }: Props) {
  return (
    <div
      className={`modal ${project ? 'open' : ''}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-hidden={!project}
      data-lenis-prevent
    >
      {project && (
        <div className="cs" onClick={(e) => e.stopPropagation()}>
          <button className="cs-close" onClick={onClose} aria-label="Close">
            <span>Close</span> ✕
          </button>

          {/* HERO */}
          <header
            className="cs-hero"
            style={{ background: project.img || project.video ? undefined : block(project.hue) }}
          >
            {project.video ? (
              <video
                className="cs-hero-img"
                src={project.video}
                autoPlay
                muted
                loop
                playsInline
                poster={project.img}
              />
            ) : project.img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="cs-hero-img" src={project.img} alt="" />
            ) : null}
            <div className="cs-hero-inner">
              <span className="cs-eyebrow">{project.cat}</span>
              <h2 className="cs-title">{project.name}</h2>
              {project.caseStudy && (
                <p className="cs-tagline">{project.caseStudy.tagline}</p>
              )}
            </div>
          </header>

          <div className="cs-body">
            {/* META BAR */}
            <div className="cs-meta">
              <div className="cs-meta-item">
                <span className="cs-meta-label">Year</span>
                <span className="cs-meta-value">{project.year}</span>
              </div>
              {project.client && (
                <div className="cs-meta-item">
                  <span className="cs-meta-label">Client</span>
                  <span className="cs-meta-value">{project.client}</span>
                </div>
              )}
              {project.role && (
                <div className="cs-meta-item">
                  <span className="cs-meta-label">Role</span>
                  <span className="cs-meta-value">{project.role}</span>
                </div>
              )}
              <div className="cs-meta-item">
                <span className="cs-meta-label">Scope</span>
                <span className="cs-meta-value">
                  {project.caseStudy
                    ? project.caseStudy.scope.join(' · ')
                    : project.cat}
                </span>
              </div>
            </div>

            {/* LEAD */}
            <p className="cs-lead">
              {project.caseStudy?.overview ?? project.desc}
            </p>

            {project.caseStudy && (() => {
              const cs = project.caseStudy;
              const fig = (im: CaseImage, key: number) => (
                <figure
                  key={key}
                  className={`cs-figure cs-figure--${im.span ?? 'half'} cs-figure--${im.ratio ?? 'wide'}`}
                  style={{ background: im.img ? undefined : block(im.hue) }}
                >
                  {im.img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={im.img} alt={im.label ?? project.name} />
                  ) : (
                    im.label && <figcaption>{im.label}</figcaption>
                  )}
                </figure>
              );
              const halves = cs.gallery.filter((g) => (g.span ?? 'half') === 'half');
              const fulls = cs.gallery.filter((g) => g.span === 'full');
              return (
                <>
                  {fulls[0] && <div className="cs-figrow">{fig(fulls[0], 0)}</div>}

                  {cs.blocks[0] && (
                    <section className="cs-section">
                      <h3 className="cs-h">{cs.blocks[0].heading}</h3>
                      <p className="cs-p">{cs.blocks[0].body}</p>
                    </section>
                  )}

                  {halves.length > 0 && (
                    <div className="cs-figrow cs-figrow--pair">
                      {halves.map((im, i) => fig(im, 100 + i))}
                    </div>
                  )}

                  {cs.blocks[1] && (
                    <section className="cs-section">
                      <h3 className="cs-h">{cs.blocks[1].heading}</h3>
                      <p className="cs-p">{cs.blocks[1].body}</p>
                    </section>
                  )}

                  {fulls[1] && <div className="cs-figrow">{fig(fulls[1], 1)}</div>}

                  {cs.blocks.slice(2).map((b, i) => (
                    <section className="cs-section" key={i}>
                      <h3 className="cs-h">{b.heading}</h3>
                      <p className="cs-p">{b.body}</p>
                    </section>
                  ))}
                </>
              );
            })()}

            {/* CTA */}
            <div className="cs-cta-row">
              {project.caseStudyHref && (
                <a className="cs-cta" href={project.caseStudyHref}>
                  View full case study →
                </a>
              )}
              <a className="cs-cta cs-cta--ghost" href={`mailto:${site.email}`}>
                Start a project →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
