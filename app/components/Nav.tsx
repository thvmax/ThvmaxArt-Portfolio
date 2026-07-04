"use client";

import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Nav({ scrollTo }: { scrollTo: (href: string) => void }) {
  const [open, setOpen] = useState(false);

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
        <a href="#home" className="nav-logo" onClick={(e) => onClick(e, '#home')}>
          THVMAX
        </a>

        <ul className="nav-links">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={(e) => onClick(e, l.href)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <ThemeToggle />
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
            <span>{String(i + 1).padStart(2, '0')}</span>
            {l.label}
          </a>
        ))}
        <div className="mobile-menu-footer">THVMAX © 2026 · Abu Dhabi</div>
      </div>
    </>
  );
}
