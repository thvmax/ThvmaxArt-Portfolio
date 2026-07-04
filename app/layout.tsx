import type { Metadata } from 'next';
import { Archivo, DM_Sans } from 'next/font/google';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
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
    <html lang="en" className={`${archivo.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        {/* No-flash theme: set data-theme before paint. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
