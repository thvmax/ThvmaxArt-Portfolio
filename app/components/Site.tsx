"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { works, type Project } from '@/lib/data';
import Nav from './Nav';
import Hero from './Hero';
import Divisions from './Divisions';
import WorkCarousel from './WorkCarousel';
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

    const lenis = new Lenis({ lerp: 0.11, smoothWheel: !reduced });
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
    if (target) lenisRef.current?.scrollTo(target as HTMLElement, { duration: 1.2 });
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
        <WorkCarousel works={works} onOpen={openProject} />
        <About />
      </main>
      <Footer scrollTo={scrollTo} />
      <CaseStudyModal project={activeProject} onClose={closeProject} />
    </>
  );
}
