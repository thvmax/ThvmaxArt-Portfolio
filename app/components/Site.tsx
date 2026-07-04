"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { works, type Project } from '@/lib/data';
import Nav from './Nav';
import Hero from './Hero';
import WorkShowcase from './WorkShowcase';
import Services from './Services';
import About from './About';
import Contact from './Contact';
import CaseStudyModal from './CaseStudyModal';

export default function Site() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // ─── Smooth scroll + ScrollTrigger sync ─────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: !reduced });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Nav hide on scroll down
    let lastY = 0;
    const onScroll = ({ scroll }: { scroll: number }) => {
      const nav = document.getElementById('nav');
      if (!nav) return;
      if (scroll > lastY && scroll > 120) nav.classList.add('nav--hidden');
      else nav.classList.remove('nav--hidden');
      nav.classList.toggle('nav--solid', scroll > 40);
      lastY = scroll;
    };
    lenis.on('scroll', onScroll);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Smooth anchor scrolling
  const scrollTo = useCallback((href: string) => {
    const target = document.querySelector(href);
    if (target) lenisRef.current?.scrollTo(target as HTMLElement, { duration: 1.3 });
  }, []);

  const openProject = useCallback((p: Project) => {
    setActiveProject(p);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeProject = useCallback(() => {
    setActiveProject(null);
    document.body.style.overflow = '';
  }, []);

  return (
    <>
      <Nav scrollTo={scrollTo} />
      <main>
        <Hero scrollTo={scrollTo} />
        <WorkShowcase works={works} onOpen={openProject} />
        <Services />
        <About />
        <Contact />
      </main>
      <CaseStudyModal project={activeProject} onClose={closeProject} />
    </>
  );
}
