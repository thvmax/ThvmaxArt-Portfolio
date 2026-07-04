import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
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
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
