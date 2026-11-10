import type { Metadata } from 'next';
import Link from 'next/link';
import { v2Services, v2ServicesSection } from '@/lib/v2content';
import Reveal from '../components/Reveal';
import ScrambleLabel from '../components/ScrambleLabel';
import ArrowUpRight from '../components/ArrowUpRight';

export const metadata: Metadata = {
  title: 'Services — THVMAX',
  description: v2ServicesSection.intro,
  alternates: { canonical: '/services' },
};

/** Services hub — one row per discipline, each with its own detail page. */
export default function ServicesPage() {
  return (
    <section className="v2-section">
      <Reveal>
        <ScrambleLabel>{v2ServicesSection.label}</ScrambleLabel>
        <h1 className="v2-display v2-display--lg">
          {v2ServicesSection.headingLead}
          <br />
          <span className="v2-italic">{v2ServicesSection.headingItalic}</span>.
        </h1>
        <p className="v2-service-intro">{v2ServicesSection.intro}</p>
      </Reveal>

      <Reveal className="v2-list">
        {v2Services.map((s, i) => (
          <Link key={s.slug} href={`/services/${s.slug}`} className="v2-row" data-cursor="hover">
            <span className="v2-row-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="v2-row-name">{s.name}</span>
            <span className="v2-row-meta">{s.tagline}</span>
            <span className="v2-row-year" aria-hidden="true" />
            <span className="v2-row-arrow" aria-hidden="true"><ArrowUpRight /></span>
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
