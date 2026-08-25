import type { Metadata } from 'next';
import './site.css';
import SiteFrame from './components/V2Frame';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body>
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
