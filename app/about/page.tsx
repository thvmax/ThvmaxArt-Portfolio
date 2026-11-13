import type { Metadata } from 'next';
import { v2About, v2Site } from '@/lib/v2content';
import AboutSection from '../components/AboutSection';
import Band from '../components/Band';
import Pill from '../components/Pill';

export const metadata: Metadata = {
  title: 'About Thu Ta Soe — Art Director from Myanmar, based in Dubai',
  description:
    'Thu Ta Soe (THVMAX): Myanmar-born senior creative designer and art director in Dubai. Seven years across Pepsi-Cola Myanmar, AIA and Velosi Abu Dhabi — working across the UAE, the Middle East and worldwide.',
  alternates: { canonical: '/about' },
  openGraph: { type: 'profile', url: '/about' },
};

const PROFILE_JSONLD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  url: 'https://thvmaxart.com/about',
  mainEntity: { '@id': 'https://thvmaxart.com/#person' },
});

/** Figma frame: ThvmaxArt / 04 About. */
export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: PROFILE_JSONLD }} />
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
