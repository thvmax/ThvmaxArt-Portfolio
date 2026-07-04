"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  works,
  services,
  experience,
  skills,
  marquee,
  stats,
  type Project,
} from '@/lib/data';
import ThemeToggle from './ThemeToggle';

// hue → readable placeholder swatch (theme-aware via CSS, this is the base tint)
const block = (hue: number) =>
  `linear-gradient(145deg, hsl(${hue} 55% 42%), hsl(${(hue + 45) % 360} 60% 30%))`;

export default function Portfolio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const moveX = useRef<((v: number) => void) | null>(null);
  const moveY = useRef<((v: number) => void) | null>(null);

  // ─── Smooth scroll + scroll animations ──────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // Hero entrance
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.from('.hero-line span', { yPercent: 115, duration: 1, stagger: 0.12 })
        .from('.hero-eyebrow', { y: 20, opacity: 0, duration: 0.7 }, '-=0.7')
        .from('.hero-tagline', { y: 20, opacity: 0, duration: 0.7 }, '-=0.6')
        .from('.hero-meta > *', { y: 16, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.5')
        .from('nav', { y: -30, opacity: 0, duration: 0.7 }, '-=0.9');

      // Scroll reveals — explicit fromTo so end state (opacity:1) is fixed,
      // not inferred from the DOM (StrictMode double-invokes this effect).
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.fromTo(el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' },
          },
        );
      });

      // Stagger children marked .reveal-stagger
      gsap.utils.toArray<HTMLElement>('.reveal-stagger').forEach((wrap) => {
        gsap.fromTo(wrap.children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.08,
            scrollTrigger: { trigger: wrap, start: 'top 85%' },
          },
        );
      });
    });

    // Nav hide on scroll down
    let lastY = 0;
    const onScroll = ({ scroll }: { scroll: number }) => {
      const nav = document.getElementById('nav');
      if (!nav) return;
      if (scroll > lastY && scroll > 120) nav.classList.add('nav--hidden');
      else nav.classList.remove('nav--hidden');
      lastY = scroll;
    };
    lenis.on('scroll', onScroll);

    return () => {
      ctx.revert();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // ─── Floating cursor preview for the works index ────────────────
  useEffect(() => {
    if (typeof window === 'undefined' || !previewRef.current) return;
    // fine-pointer only (skip touch)
    if (!window.matchMedia('(pointer: fine)').matches) return;
    moveX.current = gsap.quickTo(previewRef.current, 'x', { duration: 0.5, ease: 'power3' });
    moveY.current = gsap.quickTo(previewRef.current, 'y', { duration: 0.5, ease: 'power3' });
  }, []);

  const onWorksMove = useCallback((e: React.MouseEvent) => {
    moveX.current?.(e.clientX);
    moveY.current?.(e.clientY);
  }, []);

  // Smooth anchor scrolling
  const scrollTo = useCallback((href: string) => {
    const target = document.querySelector(href);
    if (target) lenisRef.current?.scrollTo(target as HTMLElement, { duration: 1.3 });
  }, []);

  const onNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollTo(href);
    closeMobileMenu();
  };

  const toggleMobileMenu = () => {
    const next = !mobileMenuOpen;
    setMobileMenuOpen(next);
    document.body.style.overflow = next ? 'hidden' : '';
  };
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  const openProject = (p: Project) => {
    setActiveProject(p);
    document.body.style.overflow = 'hidden';
  };
  const closeProject = () => {
    setActiveProject(null);
    document.body.style.overflow = '';
  };

  const navLinks = [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* NAV */}
      <nav id="nav">
        <a href="#home" className="nav-logo" onClick={(e) => onNavClick(e, '#home')}>
          THVMAX
        </a>

        <div className="nav-marquee" aria-hidden="true">
          <div className="nav-marquee-track">
            <span>Designer with 7+ years shaping brand visuals across multinational companies and creative agencies —&nbsp;</span>
            <span>Designer with 7+ years shaping brand visuals across multinational companies and creative agencies —&nbsp;</span>
          </div>
        </div>

        <ul className="nav-links">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={(e) => onNavClick(e, l.href)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <ThemeToggle />
          <button
            className={`nav-hamburger ${mobileMenuOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
          >
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        {navLinks.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            className="mobile-menu-link"
            style={{ transitionDelay: `${0.05 + i * 0.06}s` }}
            onClick={(e) => onNavClick(e, l.href)}
          >
            <span>{String(i + 1).padStart(2, '0')}</span>
            {l.label}
          </a>
        ))}
        <div className="mobile-menu-footer">THVMAX © 2026 · Abu Dhabi</div>
      </div>

      <main>
        {/* HERO */}
        <section id="home" className="hero">
          <div className="hero-eyebrow">
            <span className="dot" /> Available for work
          </div>
          <h1 className="hero-title">
            <span className="hero-line"><span>Thuta Soe —</span></span>
            <span className="hero-line"><span>Creative Director</span></span>
            <span className="hero-line"><span>&amp; Visual Artist.</span></span>
          </h1>
          <p className="hero-tagline">
            Multidisciplinary creative shaping brand visuals, campaigns and motion for
            brands worldwide.
          </p>
          <div className="hero-meta">
            <div className="hero-meta-item">
              <span className="hero-meta-label">Based in</span>
              <span className="hero-meta-value">Abu Dhabi, UAE</span>
            </div>
            <div className="hero-meta-item">
              <span className="hero-meta-label">Focus</span>
              <span className="hero-meta-value">Art Direction · Branding · Motion</span>
            </div>
            <a
              href="#work"
              className="hero-cta"
              onClick={(e) => onNavClick(e, '#work')}
            >
              View work <span className="arrow">↓</span>
            </a>
          </div>
        </section>

        {/* MARQUEE STRIP */}
        <div className="brand-marquee">
          <div className="brand-marquee-track">
            {[...marquee, ...marquee].map((m, i) => (
              <span key={i} className="brand-marquee-item">
                {m} <span className="sep">✳</span>
              </span>
            ))}
          </div>
        </div>

        {/* STATS */}
        <section className="stats reveal-stagger">
          {stats.map((s) => (
            <div key={s.label} className="stat">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </section>

        {/* WORK — index showcase */}
        <section id="work" className="section works">
          <div className="section-head reveal">
            <h2 className="section-title">Selected Works</h2>
            <div className="section-meta">
              2019 — 2026<br />
              {works.length} projects
            </div>
          </div>

          <ul
            className={`works-index reveal-stagger ${hovered !== null ? 'is-hovering' : ''}`}
            onMouseMove={onWorksMove}
            onMouseLeave={() => setHovered(null)}
          >
            {works.map((p, i) => (
              <li
                key={p.name}
                className={`work-row ${hovered === i ? 'is-active' : ''}`}
                onMouseEnter={() => setHovered(i)}
              >
                <button
                  className="work-row-btn"
                  type="button"
                  onClick={() => openProject(p)}
                >
                  <span className="work-row-num">{String(i + 1).padStart(2, '0')}</span>
                  <span
                    className="work-row-thumb"
                    style={{ background: p.img ? undefined : block(p.hue) }}
                  >
                    {p.img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.img} alt={p.name} />
                    )}
                  </span>
                  <span className="work-row-name">{p.name}</span>
                  <span className="work-row-cat">{p.cat}</span>
                  <span className="work-row-year">{p.year}</span>
                  <span className="work-row-arrow" aria-hidden="true">→</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* FLOATING CURSOR PREVIEW (desktop) */}
        <div
          ref={previewRef}
          className={`works-preview ${hovered !== null ? 'show' : ''}`}
          aria-hidden="true"
        >
          {works.map((p, i) => (
            <div
              key={p.name}
              className={`works-preview-media ${hovered === i ? 'active' : ''}`}
              style={{ background: p.img ? undefined : block(p.hue) }}
            >
              {p.img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.img} alt="" />
              ) : (
                <span className="works-preview-label">{p.name}</span>
              )}
            </div>
          ))}
        </div>

        {/* SERVICES */}
        <section id="services" className="section">
          <div className="section-head reveal">
            <h2 className="section-title">Creative Services</h2>
            <div className="section-meta">What I do</div>
          </div>
          <div className="services-list reveal-stagger">
            {services.map((s) => (
              <div key={s.num} className="service-row">
                <span className="service-num">{s.num}</span>
                <h3 className="service-title">{s.title}</h3>
                <p className="service-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="section about">
          <div className="about-intro reveal">
            <h2 className="section-title">About</h2>
            <p className="about-bio">
              Multidisciplinary creative with over 7 years of experience across
              multinational companies and creative agencies. Passionate about driving
              innovation in marketing and building visually captivating experiences that
              communicate a brand’s message with clarity and craft.
            </p>
          </div>

          <div className="about-cols">
            <div className="about-exp reveal">
              <h3 className="about-sub">Experience</h3>
              {experience.map((exp) => (
                <div key={exp.role + exp.year} className="exp-row">
                  <div>
                    <div className="exp-role">{exp.role}</div>
                    <div className="exp-co">{exp.co}</div>
                  </div>
                  <span className="exp-year">{exp.year}</span>
                </div>
              ))}
            </div>

            <div className="about-skills reveal">
              <h3 className="about-sub">Toolkit</h3>
              <div className="skills-grid">
                {skills.map((s) => (
                  <span key={s} className="skill-tag">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="contact reveal">
          <div className="contact-eyebrow">Have a project in mind?</div>
          <a href="mailto:thutasoe24@gmail.com" className="contact-email">
            thutasoe24@gmail.com
          </a>
          <div className="contact-links">
            <a href="https://linktr.ee/thvmax" target="_blank" rel="noopener noreferrer">Linktree</a>
            <a href="tel:+971565776382">+971 56 577 6382</a>
            <a href="mailto:thutasoe24@gmail.com">Email</a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="footer-left">Thuta Soe © 2026</div>
        <div className="footer-right">Design &amp; Strategy · Abu Dhabi, UAE</div>
      </footer>

      {/* PROJECT CASE-STUDY MODAL */}
      <div
        className={`modal ${activeProject ? 'open' : ''}`}
        onClick={closeProject}
        role="dialog"
        aria-modal="true"
        aria-hidden={!activeProject}
      >
        {activeProject && (
          <div className="cs" onClick={(e) => e.stopPropagation()}>
            <button className="cs-close" onClick={closeProject} aria-label="Close">
              <span>Close</span> ✕
            </button>

            {/* HERO */}
            <header className="cs-hero" style={{ background: block(activeProject.hue) }}>
              <div className="cs-hero-inner">
                <span className="cs-eyebrow">{activeProject.cat}</span>
                <h2 className="cs-title">{activeProject.name}</h2>
                {activeProject.caseStudy && (
                  <p className="cs-tagline">{activeProject.caseStudy.tagline}</p>
                )}
              </div>
            </header>

            <div className="cs-body">
              {/* META BAR */}
              <div className="cs-meta">
                <div className="cs-meta-item">
                  <span className="cs-meta-label">Year</span>
                  <span className="cs-meta-value">{activeProject.year}</span>
                </div>
                {activeProject.client && (
                  <div className="cs-meta-item">
                    <span className="cs-meta-label">Client</span>
                    <span className="cs-meta-value">{activeProject.client}</span>
                  </div>
                )}
                {activeProject.role && (
                  <div className="cs-meta-item">
                    <span className="cs-meta-label">Role</span>
                    <span className="cs-meta-value">{activeProject.role}</span>
                  </div>
                )}
                <div className="cs-meta-item">
                  <span className="cs-meta-label">Scope</span>
                  <span className="cs-meta-value">
                    {activeProject.caseStudy
                      ? activeProject.caseStudy.scope.join(' · ')
                      : activeProject.cat}
                  </span>
                </div>
              </div>

              {/* LEAD */}
              <p className="cs-lead">
                {activeProject.caseStudy?.overview ?? activeProject.desc}
              </p>

              {activeProject.caseStudy && (
                <>
                  {/* GALLERY + NARRATIVE, interleaved */}
                  {(() => {
                    const cs = activeProject.caseStudy!;
                    const fig = (im: (typeof cs.gallery)[number], key: number) => (
                      <figure
                        key={key}
                        className={`cs-figure cs-figure--${im.span ?? 'half'} cs-figure--${im.ratio ?? 'wide'}`}
                        style={{ background: im.img ? undefined : block(im.hue) }}
                      >
                        {im.img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={im.img} alt={im.label ?? activeProject.name} />
                        ) : (
                          im.label && <figcaption>{im.label}</figcaption>
                        )}
                      </figure>
                    );
                    const halves = cs.gallery.filter((g) => (g.span ?? 'half') === 'half');
                    const fulls = cs.gallery.filter((g) => g.span === 'full');
                    return (
                      <>
                        {/* featured full image */}
                        {fulls[0] && <div className="cs-figrow">{fig(fulls[0], 0)}</div>}

                        {/* section 1 */}
                        {cs.blocks[0] && (
                          <section className="cs-section">
                            <h3 className="cs-h">{cs.blocks[0].heading}</h3>
                            <p className="cs-p">{cs.blocks[0].body}</p>
                          </section>
                        )}

                        {/* paired half images */}
                        {halves.length > 0 && (
                          <div className="cs-figrow cs-figrow--pair">
                            {halves.map((im, i) => fig(im, 100 + i))}
                          </div>
                        )}

                        {/* section 2 */}
                        {cs.blocks[1] && (
                          <section className="cs-section">
                            <h3 className="cs-h">{cs.blocks[1].heading}</h3>
                            <p className="cs-p">{cs.blocks[1].body}</p>
                          </section>
                        )}

                        {/* second full image */}
                        {fulls[1] && <div className="cs-figrow">{fig(fulls[1], 1)}</div>}

                        {/* remaining sections */}
                        {cs.blocks.slice(2).map((b, i) => (
                          <section className="cs-section" key={i}>
                            <h3 className="cs-h">{b.heading}</h3>
                            <p className="cs-p">{b.body}</p>
                          </section>
                        ))}
                      </>
                    );
                  })()}
                </>
              )}

              {/* CTA */}
              <div className="cs-cta-row">
                {activeProject.caseStudyHref && (
                  <a className="cs-cta" href={activeProject.caseStudyHref}>
                    View full case study →
                  </a>
                )}
                <a className="cs-cta cs-cta--ghost" href="mailto:thutasoe24@gmail.com">
                  Start a project →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
