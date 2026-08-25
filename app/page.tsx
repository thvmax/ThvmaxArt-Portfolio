import Link from 'next/link';
import { v2Home, v2Site } from '@/lib/v2content';
import WorkIndex from './components/WorkIndex';
import Reveal from './components/Reveal';
import ScrambleLabel from './components/ScrambleLabel';
import Pill from './components/Pill';
import V2Intro from './components/V2Intro';
import V2Hero from './components/V2Hero';

/**
 * Home. The Figma page has no Home frame, so this is built from the
 * same system: intro, hero, full-bleed showreel, featured projects.
 */
export default function HomePage() {
  return (
    <>
      <V2Intro />
      <main>
        <V2Hero />

        <section className="v2-reelblock">
          <video
            className="v2-reel"
            src={v2Home.reel.src}
            autoPlay
            muted
            loop
            playsInline
          />
          <span className="v2-reelblock-label">{v2Home.reel.label}</span>
          <span className="v2-reelblock-note">{v2Home.reel.note}</span>
        </section>

        <section className="v2-section v2-home-work">
          <Reveal className="v2-home-work-head">
            <ScrambleLabel>{v2Home.featuredLabel}</ScrambleLabel>
            <Pill href="/work" label={v2Home.featuredCta} className="v2-pill--ghost" />
          </Reveal>

          <WorkIndex limit={5} />

          <Reveal delay={0.05}>
            <Link className="v2-textlink" href="/work" data-cursor="hover">
              View all ten projects ↗
            </Link>
          </Reveal>
        </section>

        <div className="v2-home-foot">
          <span>{v2Site.owner}</span>
          <span>{v2Site.copyright}</span>
        </div>
      </main>
    </>
  );
}
