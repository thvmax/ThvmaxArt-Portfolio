"use client";

import Link from 'next/link';
import { disciplines, site } from '@/lib/data';
import { useSmoothScroll } from './SmoothScroll';

export default function Footer() {
  const { scrollTo } = useSmoothScroll();
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollTo(href);
  };

  return (
    <footer className="footer">
      {/* Contact block: quiet grey prompt left, underlined email right */}
      <div className="footer-contact">
        <p className="footer-prompt">
          {site.footerPrompt.split('\n').map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
        <a className="footer-email" href={`mailto:${site.email}`}>
          {site.email}
        </a>
      </div>

      <div className="footer-cols">
        <div className="footer-col">
          <span className="footer-col-title">Discover</span>
          <a href="#work" onClick={(e) => onClick(e, '#work')}>Work</a>
          <a href="#about" onClick={(e) => onClick(e, '#about')}>About</a>
        </div>
        <div className="footer-col">
          <span className="footer-col-title">Disciplines</span>
          {disciplines.map((d) => (
            <Link key={d.slug} href={`/${d.slug}`}>{d.title}</Link>
          ))}
        </div>
        <div className="footer-col">
          <span className="footer-col-title">Contact</span>
          <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
          <span>{site.location}</span>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-social">
          {site.social.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          ))}
        </div>
        <span>{site.copyright}</span>
      </div>
    </footer>
  );
}
