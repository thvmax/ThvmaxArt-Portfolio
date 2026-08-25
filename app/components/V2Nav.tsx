"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useSmoothScroll } from '@/app/components/SmoothScroll';
import { v2Nav, v2Site, v2Social } from '@/lib/v2content';
import Pill from './Pill';

/**
 * Floating nav + full-screen menu overlay ("State — Menu open").
 * Links are routes: every frame is its own page.
 */
export default function V2Nav() {
  const { stop, start } = useSmoothScroll();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [onWhite, setOnWhite] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const rowsRef = useRef<HTMLUListElement | null>(null);

  const isCurrent = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  // Route change closes the overlay
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Inverted (white) blocks pass under the fixed nav — flip its chrome
  // while one is behind it, or the white-on-white pill disappears.
  useEffect(() => {
    const blocks = document.querySelectorAll('.v2-invert');
    if (!blocks.length) return;

    const seen = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) seen.add(entry.target);
          else seen.delete(entry.target);
        });
        setOnWhite(seen.size > 0);
      },
      // a thin strip at the top of the viewport, level with the nav
      { rootMargin: '0px 0px -94% 0px' },
    );

    blocks.forEach((b) => io.observe(b));
    return () => io.disconnect();
  }, [pathname]);

  // Open / close: circular clip reveal out of the menu button, then the
  // rows ladder in. Reduced motion just toggles visibility.
  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rows = rowsRef.current?.querySelectorAll('.v2-menu-row') ?? [];
    const aside = el.querySelectorAll('.v2-menu-aside > *, .v2-menu-foot');

    if (open) {
      stop();
      document.body.style.overflow = 'hidden';
      el.classList.add('is-open');
      if (reduced) {
        gsap.set(el, { clipPath: 'circle(150% at 50% 50%)' });
        gsap.set([...rows, ...aside], { opacity: 1, y: 0 });
        return;
      }
      gsap.killTweensOf([el, ...rows, ...aside]);
      gsap.fromTo(
        el,
        { clipPath: 'circle(0% at calc(100% - 5rem) 4rem)' },
        { clipPath: 'circle(150% at calc(100% - 5rem) 4rem)', duration: 0.85, ease: 'power4.inOut' },
      );
      gsap.fromTo(
        rows,
        { yPercent: 105, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.07, delay: 0.18, ease: 'power4.out' },
      );
      gsap.fromTo(
        aside,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, delay: 0.42, ease: 'power3.out' },
      );
    } else if (el.classList.contains('is-open')) {
      document.body.style.overflow = '';
      start();
      if (reduced) {
        el.classList.remove('is-open');
        return;
      }
      gsap.to(el, {
        clipPath: 'circle(0% at calc(100% - 5rem) 4rem)',
        duration: 0.6,
        ease: 'power4.inOut',
        onComplete: () => el.classList.remove('is-open'),
      });
    }
  }, [open, start, stop]);

  // Escape closes the overlay
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <nav className={`v2-nav ${onWhite ? 'v2-nav--on-white' : ''}`}>
        <Link className="v2-nav-logo" href="/" data-cursor="hover">
          <span className="v2-nav-mark" aria-hidden="true" />
          {v2Site.name}
        </Link>

        <div className="v2-nav-menu">
          {v2Nav.slice(1).map((l) => (
            <Link
              key={l.href}
              className={`v2-nav-link ${isCurrent(l.href) ? 'is-current' : ''}`}
              href={l.href}
              aria-current={isCurrent(l.href) ? 'page' : undefined}
              data-cursor="hover"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="v2-nav-right">
          <Pill href={`mailto:${v2Site.email}`} label="Let’s talk" />
          <button
            className="v2-burger"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            data-cursor="hover"
          >
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div
        ref={menuRef}
        className="v2-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
      >
        <button className="v2-menu-close" onClick={() => setOpen(false)} aria-label="Close menu" data-cursor="hover">
          ✕
        </button>

        <ul className="v2-menu-list" ref={rowsRef}>
          {v2Nav.map((l, i) => (
            <li className="v2-menu-row" key={l.href}>
              <span className="v2-menu-num">{String(i + 1).padStart(2, '0')}</span>
              <Link className="v2-menu-link" href={l.href} data-cursor="hover">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="v2-menu-aside">
          <div>
            <span className="v2-label">ELSEWHERE</span>
            {v2Social.slice(0, 3).map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" data-cursor="hover">
                {s.label}
              </a>
            ))}
          </div>
          <div>
            <a className="v2-menu-mail" href={`mailto:${v2Site.email}`} data-cursor="hover">
              {v2Site.email}
            </a>
            <a href={`tel:${v2Site.phoneHref}`} data-cursor="hover">
              {v2Site.phone}
            </a>
          </div>
        </div>

        <span className="v2-menu-foot">{v2Site.menuFooter}</span>
      </div>
    </>
  );
}
