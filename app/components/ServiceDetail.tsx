"use client";

import Link from 'next/link';
import { findProject, v2Site, type V2Project, type V2Service } from '@/lib/v2content';
import Reveal from './Reveal';
import ScrambleLabel from './ScrambleLabel';
import ArrowUpRight from './ArrowUpRight';
import Pill from './Pill';

/** A single service detail page: H1, lead, deliverables and related work. */
export default function ServiceDetail({ service }: { service: V2Service }) {
  const projects = service.projectSlugs
    .map((slug) => findProject(slug))
    .filter((p): p is V2Project => Boolean(p));

  return (
    <section className="v2-section">
      <Reveal>
        <ScrambleLabel accent>{service.label}</ScrambleLabel>
        <h1 className="v2-display v2-display--lg v2-service-title">{service.title}</h1>
        <p className="v2-service-intro">{service.lead}</p>
      </Reveal>

      <Reveal className="v2-service-body" delay={0.05}>
        <p className="v2-body">{service.body}</p>
      </Reveal>

      <div className="v2-service-block">
        <Reveal>
          <ScrambleLabel accent>WHAT I DELIVER</ScrambleLabel>
          <div className="v2-deliverables">
            {service.deliverables.map((d) => (
              <div key={d} className="v2-deliverable">
                {d}
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {projects.length > 0 && (
        <div className="v2-service-block">
          <Reveal>
            <ScrambleLabel accent>RELATED WORK</ScrambleLabel>
          </Reveal>
          <Reveal className="v2-list">
            {projects.map((p, i) => (
              <Link key={p.slug} href={`/work/${p.slug}`} className="v2-row" data-cursor="hover">
                <span className="v2-row-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="v2-row-name">{p.name}</span>
                <span className="v2-row-meta">{p.cat}</span>
                <span className="v2-row-year">{p.year}</span>
                <span className="v2-row-arrow" aria-hidden="true"><ArrowUpRight /></span>
              </Link>
            ))}
          </Reveal>
        </div>
      )}

      <Reveal className="v2-service-block" delay={0.05}>
        <Pill href={`mailto:${v2Site.email}`} label="Start a project" large />
      </Reveal>
    </section>
  );
}
