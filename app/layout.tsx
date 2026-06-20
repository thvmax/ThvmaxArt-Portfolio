import type { Metadata } from 'next';
import { Syne, DM_Sans } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'THVMAX — Thuta Soe | Design & Strategy',
  description:
    'Multidisciplinary creative with 7+ years shaping brand visuals across multinational companies and creative agencies. Based in Abu Dhabi, UAE.',
  keywords: [
    'Thuta Soe',
    'THVMAX',
    'Creative Design',
    'Art Direction',
    'Brand Design',
    'Abu Dhabi Designer',
    'Portfolio',
  ],
  authors: [{ name: 'Thuta Soe' }],
  openGraph: {
    title: 'THVMAX — Thuta Soe | Design & Strategy',
    description: 'Design & Strategy · Abu Dhabi, UAE',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
