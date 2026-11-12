import type { Metadata } from 'next';
import { v2WorkPage } from '@/lib/v2content';
import WorkEditorial from '../components/WorkEditorial';

export const metadata: Metadata = {
  title: 'Work — THVMAX',
  description: v2WorkPage.intro,
  alternates: { canonical: '/work' },
};

/** Work — the projects as a turning ring of cards (see WorkEditorial). */
export default function WorkPage() {
  return (
    <main>
      <WorkEditorial />
    </main>
  );
}
