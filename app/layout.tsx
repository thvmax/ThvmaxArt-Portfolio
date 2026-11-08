import type { Metadata, Viewport } from 'next';
import './site.css';
import SiteFrame from './components/V2Frame';
import { v2Site, v2Social } from '@/lib/v2content';

// Geist / Geist Mono / Instrument Serif are not in this Next version's
// next/font/google list, so they come from the Google CSS API instead.
const FONTS =
  'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;700&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@1&display=swap';

const DESCRIPTION =
  'Campaign art direction, motion and product design for FMCG and enterprise brands across Myanmar and the UAE. Senior creative designer based in Abu Dhabi.';

export const metadata: Metadata = {
  metadataBase: new URL('https://thvmaxart.com'),
  title: {
    default: 'THVMAX — Thu Ta Soe | Art Direction, Motion & Product Design',
    template: '%s — THVMAX',
  },
  description: DESCRIPTION,
  keywords: [
    'Thu Ta Soe',
    'THVMAX',
    'Art Direction',
    'Motion Design',
    'Product Design',
    'Brand Design',
    'Abu Dhabi Designer',
    'Portfolio',
  ],
  authors: [{ name: 'Thu Ta Soe' }],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'THVMAX — Thu Ta Soe',
    description: DESCRIPTION,
    url: 'https://thvmaxart.com',
    siteName: 'THVMAX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'THVMAX — Thu Ta Soe',
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f4f1' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0c0d' },
  ],
};

const PERSON_JSONLD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Thu Ta Soe',
  alternateName: 'THVMAX',
  url: 'https://thvmaxart.com',
  image: 'https://thvmaxart.com/portrait.jpg',
  jobTitle: 'Senior Creative Designer',
  description: DESCRIPTION,
  email: `mailto:${v2Site.email}`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Abu Dhabi',
    addressCountry: 'AE',
  },
  sameAs: v2Social.map((s) => s.href),
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS} />
        {/* Resolve the theme before first paint, or a light-mode visitor
            gets a dark flash on every navigation. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('thv-theme');" +
              "if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}" +
              "document.documentElement.setAttribute('data-theme',t);}" +
              "catch(e){document.documentElement.setAttribute('data-theme','dark');}})();",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: PERSON_JSONLD }}
        />
      </head>
      <body>
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
