import type { Metadata } from 'next';
import { v2Contact } from '@/lib/v2content';
import ContactSection from '../components/ContactSection';

export const metadata: Metadata = {
  title: 'Contact — THVMAX',
  description: v2Contact.intro,
  alternates: { canonical: '/contact' },
};

/** Figma frame: ThvmaxArt / 05 Contact. */
export default function ContactPage() {
  return (
    <>
      <main>
        <ContactSection />
      </main>
    </>
  );
}
