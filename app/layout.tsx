import type { Metadata, Viewport } from 'next';
import './site.css';
import SiteFrame from './components/V2Frame';
import { v2AreaServed, v2Site, v2Social } from '@/lib/v2content';

// One family for the whole site — Host Grotesk — in five weights, loaded
// from the Google CSS API. Hierarchy comes from weight and size alone.
const FONTS =
  'https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@300;400;500;600;700&display=swap';

const DESCRIPTION =
  'Thu Ta Soe (THVMAX) — Myanmar-born senior creative designer and art director based in Dubai. Campaign art direction, motion and product design for brands across Myanmar, the UAE, the Middle East and worldwide.';

export const metadata: Metadata = {
  metadataBase: new URL('https://thvmaxart.com'),
  title: {
    default: 'Thu Ta Soe (THVMAX) — Art Director & Creative Designer | Dubai, UAE · Myanmar',
    template: '%s — THVMAX',
  },
  description: DESCRIPTION,
  applicationName: 'THVMAX',
  keywords: [
    'Thu Ta Soe',
    'THVMAX',
    'ThvmaxArt',
    'Art Director Dubai',
    'Creative Designer Dubai',
    'Senior Creative Designer UAE',
    'Freelance Art Director UAE',
    'Motion Designer Dubai',
    'Product Designer Dubai',
    'Graphic Designer Abu Dhabi',
    'Creative Designer Middle East',
    'Art Director GCC',
    'Myanmar Art Director',
    'Myanmar Graphic Designer',
    'Yangon Creative Designer',
    'Burmese Designer in Dubai',
    'Myanmar Designer UAE',
    'Campaign Art Direction',
    'Brand Design',
    'Remote Art Director',
  ],
  authors: [{ name: 'Thu Ta Soe', url: 'https://thvmaxart.com/about' }],
  creator: 'Thu Ta Soe',
  publisher: 'THVMAX',
  category: 'design',
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    title: 'Thu Ta Soe (THVMAX) — Art Director & Creative Designer',
    description: DESCRIPTION,
    url: 'https://thvmaxart.com',
    siteName: 'THVMAX',
    locale: 'en_AE',
    alternateLocale: ['en_US', 'en_GB'],
    type: 'profile',
    firstName: 'Thu Ta',
    lastName: 'Soe',
    username: 'thvmax',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thu Ta Soe (THVMAX) — Art Director & Creative Designer',
    description: DESCRIPTION,
  },
  other: {
    // regional hints for search engines that still read them (Bing, Yandex)
    'geo.region': 'AE-DU',
    'geo.placename': 'Dubai',
  },
};

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f4f1' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0c0d' },
  ],
};

// One graph: the person, the site and how they connect. The case-study
// pages reference the person by its @id.
const SITE_JSONLD = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://thvmaxart.com/#person',
      name: 'Thu Ta Soe',
      alternateName: ['THVMAX', 'ThvmaxArt'],
      url: 'https://thvmaxart.com',
      image: 'https://thvmaxart.com/portrait.jpg',
      jobTitle: ['Senior Creative Designer', 'Art Director'],
      description: DESCRIPTION,
      email: `mailto:${v2Site.email}`,
      telephone: v2Site.phone,
      nationality: { '@type': 'Country', name: 'Myanmar' },
      homeLocation: {
        '@type': 'Place',
        address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressCountry: 'AE' },
      },
      workLocation: [
        { '@type': 'Place', name: 'Dubai, United Arab Emirates' },
        { '@type': 'Place', name: 'Abu Dhabi, United Arab Emirates' },
        { '@type': 'Place', name: 'Yangon, Myanmar' },
      ],
      knowsLanguage: ['English', 'Burmese'],
      knowsAbout: [
        'Art Direction',
        'Campaign Design',
        'Brand Identity',
        'Motion Design',
        'Video Production',
        'Product Design',
        'UI Design',
        'UX Design',
        'Design Systems',
        'Generative AI for Design',
      ],
      alumniOf: [
        { '@type': 'CollegeOrUniversity', name: 'Yangon University of Economics' },
        { '@type': 'EducationalOrganization', name: 'Strategy First University' },
      ],
      hasOccupation: {
        '@type': 'Occupation',
        name: 'Art Director',
        occupationLocation: v2AreaServed.map((name) => ({ '@type': 'AdministrativeArea', name })),
      },
      areaServed: v2AreaServed,
      sameAs: v2Social.filter((s) => !s.href.includes('bit.ly')).map((s) => s.href),
    },
    {
      '@type': 'WebSite',
      '@id': 'https://thvmaxart.com/#website',
      url: 'https://thvmaxart.com',
      name: 'THVMAX',
      alternateName: 'Thu Ta Soe Portfolio',
      inLanguage: 'en',
      publisher: { '@id': 'https://thvmaxart.com/#person' },
      about: { '@id': 'https://thvmaxart.com/#person' },
    },
  ],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS} />
        {/* Resolve the theme before first paint, or a light-mode visitor
            gets a dark flash on every navigation. The same script decides
            whether the intro plays (see V2Intro). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('thv-theme');" +
              "if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}" +
              "document.documentElement.setAttribute('data-theme',t);}" +
              "catch(e){document.documentElement.setAttribute('data-theme','dark');}" +
              // First visit of the session, landing on home: raise the intro
              // sheet now, before paint, so the page never shows ahead of it.
              "try{if(location.pathname==='/'&&!sessionStorage.getItem('v2-intro-seen')" +
              "&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)" +
              "document.documentElement.setAttribute('data-intro','play');}catch(e){}})();",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: SITE_JSONLD }}
        />
      </head>
      <body>
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
