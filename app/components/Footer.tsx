"use client";

export default function Footer({ scrollTo }: { scrollTo: (href: string) => void }) {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollTo(href);
  };

  return (
    <footer className="footer">
      <div className="footer-cta">
        <p className="footer-cta-line">Have a project in mind?</p>
        <a className="footer-talk" href="mailto:thutasoe24@gmail.com">
          Let&rsquo;s talk <span className="arrow" aria-hidden="true">&#8627;</span>
        </a>
      </div>

      <div className="footer-cols">
        <div className="footer-col">
          <span className="footer-col-title">Menu</span>
          <a href="#work" onClick={(e) => onClick(e, '#work')}>Work</a>
          <a href="#disciplines" onClick={(e) => onClick(e, '#disciplines')}>Disciplines</a>
          <a href="#about" onClick={(e) => onClick(e, '#about')}>About</a>
        </div>
        <div className="footer-col">
          <span className="footer-col-title">Contact</span>
          <a href="mailto:thutasoe24@gmail.com">thutasoe24@gmail.com</a>
          <a href="tel:+971565776382">+971 56 577 6382</a>
          <span>Abu Dhabi, UAE</span>
        </div>
        <div className="footer-col">
          <span className="footer-col-title">Elsewhere</span>
          <a href="https://linktr.ee/thvmax" target="_blank" rel="noopener noreferrer">
            Linktree
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 THVMAX — Thuta Soe</span>
        <span>Design &amp; Strategy</span>
      </div>
    </footer>
  );
}
