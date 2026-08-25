import type { Metadata } from 'next';
import { v2WorkPage } from '@/lib/v2content';
import WorkMarquee from '../components/WorkMarquee';
import LockScroll from '../components/LockScroll';

export const metadata: Metadata = {
  title: 'Work — THVMAX',
  description: v2WorkPage.intro,
  robots: { index: false, follow: false },
};

/**
 * Figma frame: ThvmaxArt / 02 Work — held in a single locked viewport
 * as an infinite marquee, so the page never repeats the home list.
 */
export default function WorkPage() {
  return (
    <>
      <LockScroll />
      <main>
        <WorkMarquee />
      </main>
    </>
  );
}
