/*
 * CASE STUDY — Sting Night Life
 *
 * To rename this route, rename the parent folder only:
 *   app/sting-night-life  →  app/<new-slug>
 *
 * To add images:
 *   1. Drop assets into  public/case-studies/sting-night-life/
 *   2. Uncomment the <Image> blocks below and remove the placeholder divs.
 */

import type { Metadata } from 'next';
// import Image from 'next/image'; // uncomment when adding real assets
import styles from './case-study.module.css';

export const metadata: Metadata = {
  title: 'Sting Night Life — Case Study | THVMAX',
  description: 'Brand and campaign design for Sting Energy — PepsiCo Myanmar, 2023.',
  robots: {
    index: false,
    follow: true,
  },
};

const META = [
  { label: 'Client',       value: 'Sting Energy — PepsiCo Myanmar' },
  { label: 'Year',         value: '2023' },
  { label: 'Disciplines',  value: 'Brand Design · Art Direction · Campaign' },
  { label: 'Deliverables', value: 'Key Visuals · OOH · Social Assets · POSM' },
  { label: 'Role',         value: 'Sr. Brand & Creative Designer' },
];

export default function StingNightLifeCaseStudy() {
  return (
    <main className={styles.main}>

      {/* ── Fixed Nav ───────────────────────────────── */}
      <nav className={styles.nav}>
        <a href="/" className={styles.navLogo}>THVMAX</a>
        <a href="/" className={styles.navBack}>
          <span className={styles.navBackLine} />
          Back to Portfolio
        </a>
      </nav>

      {/* ── Hero ────────────────────────────────────── */}
      <section className={styles.hero}>
        {/*
          Uncomment once the hero image is ready:
          <Image
            src="/case-studies/sting-night-life/hero.jpg"
            alt="Sting Night Life — Hero Campaign Visual"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 35%' }}
            priority
          />
        */}
        <div className={styles.heroGradient} />
        <div className={styles.heroGrain} />

        <div className={styles.heroContent}>
          <div className={styles.heroMeta}>
            <span className={styles.heroLabel}>Brand &amp; Campaign</span>
            <span className={styles.heroDivider} />
            <span className={styles.heroYear}>2023</span>
          </div>
          <h1 className={styles.heroTitle}>
            Sting
            <br />
            Night Life
          </h1>
        </div>

        <div className={styles.heroScroll}>
          <span className={styles.heroScrollText}>Scroll</span>
          <span className={styles.heroScrollLine} />
        </div>
      </section>

      {/* ── Project Brief ───────────────────────────── */}
      <section className={styles.brief}>
        <div>
          <p className={styles.sectionLabel}>Project Brief</p>
          <div className={styles.briefText}>
            <p>
              Sting Energy set out to own Myanmar&apos;s after-dark occasions — a
              fast-growing market segment where energy drinks had become inseparable
              from late-night study sessions, gaming culture, and the vibrant
              street-food scene after midnight. The challenge was to translate that
              raw, nocturnal energy into a visual campaign that felt electric without
              alienating the brand&apos;s existing audience.
            </p>
            <p>
              The brief called for a bold, flexible identity system spanning outdoor
              advertising, retail point-of-sale, and social content — all anchored by
              a single creative truth: <em>the night belongs to those who refuse to
              stop.</em> Every visual had to carry that urgency while staying unmistakably
              Sting.
            </p>
            <p>
              Working as Sr. Brand &amp; Creative Designer within the PepsiCo Myanmar
              team, I led the visual development from concept through final production —
              art directing the key visuals, building the campaign system, and
              overseeing asset delivery across all touchpoints.
            </p>
          </div>
        </div>

        <div className={styles.meta}>
          {META.map(({ label, value }) => (
            <div key={label} className={styles.metaItem}>
              <p className={styles.metaLabel}>{label}</p>
              <p className={styles.metaValue}>{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Concept / Pull-quote ────────────────────── */}
      <section className={styles.concept}>
        <p className={styles.conceptLabel}>Creative Direction</p>
        <h2 className={styles.conceptQuote}>
          Energy that
          <br />
          doesn&apos;t sleep.
          <br />
          <span className={styles.conceptAccent}>
            Designed for hours
            <br />
            that don&apos;t exist
            <br />
            until midnight.
          </span>
        </h2>
        <span className={styles.conceptGhost} aria-hidden>NIGHT</span>
      </section>

      {/* ── Visual Gallery ──────────────────────────── */}
      <section className={styles.gallerySection}>
        <p className={styles.sectionLabel}>Visual Assets</p>

        {/*
          Grid map:
            Row 1 — land(×2col)  port(spans 2 rows)
            Row 2 — sq1   sq2    port(continued)
            Row 3 — wide(×3col, panoramic)

          To populate: replace each placeholder div with an <Image fill> block.
          Keep the outer wrapper div and its className — only swap the inner content.
        */}
        <div className={styles.galleryGrid}>

          <div className={styles.galleryLandscape}>
            {/* <Image src="/case-studies/sting-night-life/01.jpg" alt="Key Visual — Landscape" fill style={{ objectFit: 'cover' }} /> */}
            <div className={styles.galleryPlaceholder}>
              <span className={styles.galleryPlaceholderSlot}>Key Visual · 01</span>
            </div>
          </div>

          <div className={styles.galleryPortrait}>
            {/* <Image src="/case-studies/sting-night-life/02.jpg" alt="Key Visual — Portrait" fill style={{ objectFit: 'cover' }} /> */}
            <div className={styles.galleryPlaceholder}>
              <span className={styles.galleryPlaceholderSlot}>Portrait · 02</span>
            </div>
          </div>

          <div className={styles.gallerySquare1}>
            {/* <Image src="/case-studies/sting-night-life/03.jpg" alt="Social Asset 01" fill style={{ objectFit: 'cover' }} /> */}
            <div className={styles.galleryPlaceholder}>
              <span className={styles.galleryPlaceholderSlot}>Social · 03</span>
            </div>
          </div>

          <div className={styles.gallerySquare2}>
            {/* <Image src="/case-studies/sting-night-life/04.jpg" alt="Social Asset 02" fill style={{ objectFit: 'cover' }} /> */}
            <div className={styles.galleryPlaceholder}>
              <span className={styles.galleryPlaceholderSlot}>Social · 04</span>
            </div>
          </div>

          <div className={styles.galleryWide}>
            {/* <Image src="/case-studies/sting-night-life/05.jpg" alt="OOH / Billboard" fill style={{ objectFit: 'cover' }} /> */}
            <div className={styles.galleryPlaceholder}>
              <span className={styles.galleryPlaceholderSlot}>OOH · Billboard · 05</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── Footer ──────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <p className={styles.footerSub}>Back to all work</p>
          <a href="/" className={styles.footerBackLink}>
            <span className={styles.footerBackArrow} />
            Portfolio
          </a>
        </div>
        <div className={styles.footerRight}>
          <span className={styles.footerLogo}>THVMAX</span>
          <span className={styles.footerYear}>© 2025 Thuta Soe</span>
        </div>
      </footer>

    </main>
  );
}
