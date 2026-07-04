"use client";

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
          Have a project in mind?
          <br />
          I&rsquo;m ready to collaborate.
        </p>
        <a className="footer-email" href="mailto:thutasoe24@gmail.com">
          thutasoe24@gmail.com
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
          <a href="#disciplines" onClick={(e) => onClick(e, '#disciplines')}>Art Direction</a>
          <a href="#disciplines" onClick={(e) => onClick(e, '#disciplines')}>Motion &amp; Production</a>
          <a href="#disciplines" onClick={(e) => onClick(e, '#disciplines')}>Digital &amp; UI</a>
        </div>
        <div className="footer-col">
          <span className="footer-col-title">Contact</span>
          <a href="tel:+971565776382">+971 56 577 6382</a>
          <span>Abu Dhabi, UAE</span>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-social">
          <a href="https://linktr.ee/thvmax" target="_blank" rel="noopener noreferrer">
            Linktree
          </a>
        </div>
        <span>2026 © THVMAX — Thuta Soe</span>
      </div>
    </footer>
  );
}
