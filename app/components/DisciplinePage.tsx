"use client";

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { disciplines, works, type Project } from '@/lib/data';
import CaseStudyModal from './CaseStudyModal';
import styles from './discipline.module.css';

const block = (hue: number) =>
  `linear-gradient(145deg, hsl(${hue} 55% 42%), hsl(${(hue + 45) % 360} 60% 30%))`;

/**
 * Shared discipline subpage (/art-direction, /motion-production, /digital-ui).
 * Lists every project tagged with the discipline's slug; clicking a project
 * opens the same case-study modal used on the homepage.
 */
export default function DisciplinePage({ slug }: { slug: string }) {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const openProject = useCallback((p: Project) => {
    setActiveProject(p);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeProject = useCallback(() => {
    setActiveProject(null);
    document.body.style.overflow = '';
  }, []);

  const discipline = disciplines.find((d) => d.slug === slug);
  if (!discipline) return null;

  const projects = works.filter((w) => w.disciplines?.includes(slug));

  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLogo}>THVMAX</Link>
        <Link href="/#disciplines" className={styles.navBack}>
          <span className={styles.navBackLine} />
          Back to Portfolio
        </Link>
      </nav>

      <header className={styles.hero}>
        <div className={styles.heroBand} style={{ background: discipline.gradient }} />
        <p className={styles.heroEyebrow}>
          Discipline · {String(projects.length).padStart(2, '0')} project{projects.length === 1 ? '' : 's'}
        </p>
        <h1 className={styles.heroTitle}>{discipline.title}</h1>
        <p className={styles.heroDesc}>{discipline.desc}</p>
      </header>

      <section className={styles.list} aria-label="Projects">
        {projects.map((p) => (
          <button
            key={p.name}
            type="button"
            className={styles.row}
            onClick={() => openProject(p)}
          >
            <span
              className={styles.rowMedia}
              style={{ background: p.img || p.video ? undefined : block(p.hue) }}
            >
              {p.video ? (
                <video src={p.video} autoPlay muted loop playsInline />
              ) : p.img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.img} alt={p.name} />
              ) : null}
            </span>
            <span className={styles.rowInfo}>
              <span className={styles.rowName}>{p.name}</span>
              <span className={styles.rowMeta}>
                <span>{p.cat}</span>
                <span className={styles.rowYear}>{p.year}</span>
              </span>
              {p.desc && <span className={styles.rowDesc}>{p.desc}</span>}
              <span className={styles.rowCta}>View project →</span>
            </span>
          </button>
        ))}
      </section>

      <footer className={styles.footer}>
        <Link href="/#disciplines" className={styles.footerLink}>← All disciplines</Link>
        <a href="mailto:thutasoe24@gmail.com" className={styles.footerLink}>Start a project →</a>
      </footer>

      <CaseStudyModal project={activeProject} onClose={closeProject} />
    </main>
  );
}
