"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;   // seconds
  id?: string;
}

/**
 * Scroll-in reveal. Adds `.is-in` once the element crosses the viewport
 * (see `.v2-reveal` in v2.css). IntersectionObserver rather than a
 * ScrollTrigger per element — there are a lot of these on the page.
 */
export default function Reveal({ children, as, className = '', delay = 0, id }: Props) {
  const Tag = (as || 'div') as ElementType;
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in');
      return;
    }

    // Mounting during a route transition: anything already on screen must
    // be visible as the page rises, or the new page reads as a black panel.
    if (
      document.documentElement.classList.contains('v2-routing') &&
      el.getBoundingClientRect().top < window.innerHeight * 0.95
    ) {
      el.style.transition = 'none';
      el.classList.add('is-in');
      const id = requestAnimationFrame(() => {
        el.style.transition = '';
      });
      return () => cancelAnimationFrame(id);
    }

    el.style.transition = `opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('is-in');
            io.unobserve(el);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref} id={id} className={`v2-reveal ${className}`}>
      {children}
    </Tag>
  );
}
