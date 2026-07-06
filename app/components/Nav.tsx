"use client";

import { useEffect, useState } from 'react';
import { useSmoothScroll } from './SmoothScroll';
import { site } from '@/lib/data';

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Disciplines', href: '#disciplines' },
  { label: 'About', href: '#about' },
];

export default function Nav() {
  const { scrollTo } = useSmoothScroll();
  const [open, setOpen] = useState(false);

  // Close the mobile sheet if the viewport grows past the breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)');
    const onChange = () => {
      if (mq.matches) {
        setOpen(false);
        document.body.style.overflow = '';
      }
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const close = () => {
    setOpen(false);
    document.body.style.overflow = '';
  };

  const toggle = () => {
    const next = !open;
    setOpen(next);
    document.body.style.overflow = next ? 'hidden' : '';
  };

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollTo(href);
    close();
  };

  return (
    <>
      <nav id="nav">
        <a href="#top" className="nav-logo" onClick={(e) => onClick(e, '#top')}>
          <span className="nav-logo-mark" aria-hidden="true" />
          THVMAX
        </a>

        <div className="nav-right">
          <ul className="nav-links">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={(e) => onClick(e, l.href)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a className="nav-talk" href={`mailto:${site.email}`}>
            Let&rsquo;s talk
          </a>
          <button
            className={`nav-hamburger ${open ? 'open' : ''}`}
            onClick={toggle}
            aria-label="Menu"
            aria-expanded={open}
          >
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        {navLinks.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            className="mobile-menu-link"
            style={{ transitionDelay: `${0.05 + i * 0.06}s` }}
            onClick={(e) => onClick(e, l.href)}
          >
            {l.label}
          </a>
        ))}
        <a
          href={`mailto:${site.email}`}
          className="mobile-menu-link"
          style={{ transitionDelay: '0.23s' }}
        >
          Let&rsquo;s talk
        </a>
        <div className="mobile-menu-footer">THVMAX © 2026 · Abu Dhabi</div>
      </div>
    </>
  );
}
