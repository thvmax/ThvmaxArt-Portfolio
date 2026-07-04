"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { works, type Project } from '@/lib/data';
import Nav from './Nav';
import Hero from './Hero';
import Divisions from './Divisions';
import WorkStack from './WorkStack';
import About from './About';
import Footer from './Footer';
import CaseStudyModal from './CaseStudyModal';

export default function Site() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // ─── Smooth scroll + ScrollTrigger sync ─────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Low lerp → slow, heavy, cinematic glide
    const lenis = new Lenis({ lerp: 0.055, smoothWheel: !reduced, touchMultiplier: 1.6 });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = useCallback((href: string) => {
    const target = document.querySelector(href);
    if (target) lenisRef.current?.scrollTo(target as HTMLElement, { duration: 1.8 });
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
        <Divisions onOpen={openProject} />
        <WorkStack works={works} onOpen={openProject} />
        <About />
      </main>
      <Footer scrollTo={scrollTo} />
      <CaseStudyModal project={activeProject} onClose={closeProject} />
    </>
  );
}
