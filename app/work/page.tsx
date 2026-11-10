import type { Metadata } from 'next';
import { v2WorkPage } from '@/lib/v2content';
import WorkEditorial from '../components/WorkEditorial';

export const metadata: Metadata = {
  title: 'Work — THVMAX',
  description: v2WorkPage.intro,
  alternates: { canonical: '/work' },
};

/**
 * Work — two views of the ten projects: Space (a turning sphere of small
 * cards, the default) and Index (an editorial grid). Adapted from the
 * Creative Space / Projects pages on gionatannese.com.
 */
export default function WorkPage() {
  return (
    <main>
      <WorkEditorial />
    </main>
  );
}
