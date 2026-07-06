"use client";

import { useState, useCallback } from 'react';
import { works, type Project } from '@/lib/data';
import SmoothScroll from './SmoothScroll';
import Nav from './Nav';
import Hero from './Hero';
import Divisions from './Divisions';
import WorkSlides from './WorkSlides';
import About from './About';
import Footer from './Footer';
import CaseStudyModal from './CaseStudyModal';

export default function Site() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const openProject = useCallback((p: Project) => {
    setActiveProject(p);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeProject = useCallback(() => {
    setActiveProject(null);
    document.body.style.overflow = '';
  }, []);

  return (
    <SmoothScroll>
      <Nav />
      <main>
        <Hero />
        <Divisions onOpen={openProject} />
        <WorkSlides works={works.filter((w) => !w.hideOnHome)} onOpen={openProject} />
        <About />
      </main>
      <Footer />
      <CaseStudyModal project={activeProject} onClose={closeProject} />
    </SmoothScroll>
  );
}
