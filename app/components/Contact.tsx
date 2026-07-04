"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Contact() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.fromTo('.contact > *',
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: '.contact', start: 'top 80%' },
          },
        );
      }

      // Magnetic hover on contact links (desktop only)
      if (finePointer && !reduced) {
        gsap.utils.toArray<HTMLElement>('.contact-links a').forEach((link) => {
          const xTo = gsap.quickTo(link, 'x', { duration: 0.4, ease: 'power3' });
          const yTo = gsap.quickTo(link, 'y', { duration: 0.4, ease: 'power3' });
          const onMove = (e: MouseEvent) => {
            const r = link.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.35);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
          };
          const onLeave = () => { xTo(0); yTo(0); };
          link.addEventListener('mousemove', onMove);
          link.addEventListener('mouseleave', onLeave);
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={rootRef}>
      <div className="contact">
        <div className="contact-eyebrow">Have a project in mind?</div>
        <a href="mailto:thutasoe24@gmail.com" className="contact-email">
          <span>Let’s talk</span>
          <span className="contact-email-addr">thutasoe24@gmail.com</span>
        </a>
        <div className="contact-links">
          <a href="https://linktr.ee/thvmax" target="_blank" rel="noopener noreferrer">Linktree</a>
          <a href="tel:+971565776382">+971 56 577 6382</a>
          <a href="mailto:thutasoe24@gmail.com">Email</a>
        </div>
      </div>

      <footer>
        <div className="footer-left">Thuta Soe © 2026</div>
        <div className="footer-right">Design &amp; Strategy · Abu Dhabi, UAE</div>
      </footer>
    </section>
  );
}
