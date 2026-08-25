"use client";

import { v2Contact, v2ContactLinks, v2Site } from '@/lib/v2content';
import Reveal from './Reveal';
import ScrambleLabel from './ScrambleLabel';
import Pill from './Pill';

/** 05 · CONTACT — dark closing frame. */
export default function ContactSection() {
  return (
    <section className="v2-contact" id="contact">
      <Reveal>
        <ScrambleLabel accent>{v2Contact.label}</ScrambleLabel>
        <h1 className="v2-display v2-display--lg">
          {v2Contact.headingLead}
          <br />
          <span className="v2-italic">{v2Contact.headingItalic}</span>.
        </h1>
        <p className="v2-contact-intro">{v2Contact.intro}</p>
      </Reveal>

      <Reveal delay={0.05}>
        <div style={{ marginTop: 'clamp(2rem, 3.3vw, 3.75rem)' }}>
          <Pill href={`mailto:${v2Site.email}`} label={v2Site.email} large />
        </div>
      </Reveal>

      <Reveal className="v2-facts" delay={0.05}>
        {v2Contact.facts.map((f) => (
          <div key={f.label}>
            <span className="v2-label v2-label--accent">{f.label}</span>
            <p className="v2-fact-value">{f.value}</p>
          </div>
        ))}
      </Reveal>

      <Reveal className="v2-links" delay={0.05}>
        {v2ContactLinks.map((s) => (
          <a
            key={s.label}
            className="v2-link-item"
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
          >
            <span className="v2-link-title">{s.label}</span>
            <span className="v2-link-handle">{s.handle}</span>
          </a>
        ))}
      </Reveal>

      <div className="v2-contact-foot">
        <span>{v2Site.owner}</span>
        <span>{v2Site.copyright}</span>
      </div>
    </section>
  );
}
