import type { Metadata } from 'next';
import { v2About, v2Site } from '@/lib/v2content';
import AboutSection from '../components/AboutSection';
import Band from '../components/Band';
import Pill from '../components/Pill';

export const metadata: Metadata = {
  title: 'About — THVMAX',
  description: v2About.lead,
  robots: { index: false, follow: false },
};

/** Figma frame: ThvmaxArt / 04 About. */
export default function AboutPage() {
  return (
    <>
      <main>
        <AboutSection />

        <Band
          label={v2About.cta.label}
          heading={
            <>
              <span className="v2-italic">{v2About.cta.headingItalic}</span>
              {v2About.cta.headingRest}
            </>
          }
        >
          <Pill href={`mailto:${v2Site.email}`} label={v2Site.email} />
        </Band>
      </main>
    </>
  );
}
