"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Lenis from 'lenis';
import { projects, showcaseCards } from '@/lib/projects';
import { drawGradientCanvas, drawPortrait } from '@/lib/canvas-helpers';



const marqueeItems = [
  'Pepsi-Cola', 'Sting Energy', '7UP', 'Mirinda', 'AIA Life Insurance',
  'Velosi', 'True Money', 'ADNOC', 'Aramco',
];

const servicesData = [
  { tag: 'Brand', num: '01', title: 'Branding & Identity', desc: 'Logo design, visual identity systems, brand guidelines and comprehensive brand experience design.' },
  { tag: 'Direction', num: '02', title: 'Art Direction', desc: 'Campaign creative direction, visual storytelling and conceptualization of integrated marketing campaigns.' },
  { tag: 'Motion', num: '03', title: 'Motion Design', desc: 'After Effects animations, video editing, social media reels, TVC production management and color grading.' },
  { tag: 'Social', num: '04', title: 'Social Media Advertising', desc: 'Engaging social content design, paid advertising visuals and platform-specific creative strategy.' },
  { tag: 'Strategy', num: '05', title: 'Strategic Thinking', desc: 'Campaign strategy, market research, creative brief development and brand positioning.' },
  { tag: 'Retouch', num: '06', title: 'Product Retouching', desc: 'High-end product photography retouching, composite advertising visuals and photo manipulation.' },
  { tag: 'UI', num: '07', title: 'UI Design', desc: 'User interface design, wireframing, prototyping and mobile app visual design using Figma.' },
  { tag: 'Print', num: '08', title: 'Poster & Print', desc: 'Editorial poster design, event visuals, POSM design, brochures and offline branding materials.' },
];

const experience = [
  { role: 'Creative Design Lead', co: 'Velosi Asset Integrity · Abu Dhabi', year: '2024–Now' },
  { role: 'Sr. Brand & Creative', co: 'Pepsi-Cola Myanmar', year: '2023' },
  { role: 'Brand & Creative', co: 'AIA Life Insurance Myanmar', year: '2022' },
  { role: 'Creative Lead', co: 'British University College', year: '2021' },
  { role: 'Creative Designer', co: 'Bliss Creative Agency', year: '2020' },
  { role: 'Creative Director', co: 'TM Design Studio', year: '2019–Now' },
];

const skills = [
  'Adobe Illustrator', 'Adobe Photoshop', 'Adobe After Effects', 'Adobe Premiere Pro',
  'DaVinci Resolve', 'Figma', 'Framer', 'Canva', 'Notion', 'Procreate',
  'Midjourney', 'Stable Diffusion', 'ChatGPT / AI', 'Meta Spark AR', 'Blender',
];

export default function Portfolio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(0);

  // Refs for elements GSAP needs direct access to
  const projCanvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const aboutPortraitRef = useRef<HTMLCanvasElement | null>(null);
  const showcaseCanvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const detailHeroCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const detailGalleryRef = useRef<HTMLDivElement | null>(null);
  const heroArtworkRef = useRef<HTMLImageElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // ─── INIT EVERYTHING ────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Lenis smooth scroll — lerp gives the inertia feel
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenisRef.current = lenis;

    // Drive Lenis from GSAP's RAF so timing stays in sync
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Let ScrollTrigger read Lenis's virtual scroll position
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });

    lenis.on('scroll', ScrollTrigger.update);

    let ctx = gsap.context(() => {
      gsap.set('nav', { opacity: 0, yPercent: -100 });
      initCursor();
      initNav();
      runLoader();
    });

    return () => {
      ctx.revert();
      lenis.destroy();
      lenisRef.current = null;
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      ScrollTrigger.clearScrollMemory();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── LOADER ANIMATION ───────────────────────────────
  const runLoader = () => {
    const loader = document.getElementById('loader');
    const holePath = document.getElementById('loaderHolePath') as SVGPathElement | null;
    const loaderL1 = document.getElementById('loaderL1');
    const loaderL2 = document.getElementById('loaderL2');
    if (!loader) return;

    document.body.style.overflow = 'hidden';

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cx = vw / 2;
    const cy = vh / 2;

    // Exact-dimension outer boundary (replaces the huge SSR path)
    const outerPath = `M 0 0 L ${vw} 0 L ${vw} ${vh} L 0 ${vh} Z`;
    holePath?.setAttribute('d', outerPath);

    // Animated proxy object — hole grows from center outward
    const hole = { w: 0, h: 0 };
    const updatePath = () => {
      if (!holePath) return;
      const x = cx - hole.w / 2;
      const y = cy - hole.h / 2;
      holePath.setAttribute(
        'd',
        `${outerPath} M ${x} ${y} L ${x + hole.w} ${y} L ${x + hole.w} ${y + hole.h} L ${x} ${y + hole.h} Z`
      );
    };

    // Make letters visible but hidden below their overflow mask (CSS kept them display-hidden)
    gsap.set([loaderL1, loaderL2], { visibility: 'visible', yPercent: 110 });
    gsap.set(['#cursor', '#cursor-follower'], { opacity: 0 });
    gsap.set('.hero-name .line span', { yPercent: 110, opacity: 0 });
    gsap.set('#heroScrollBtn', { scale: 0, opacity: 0 });
    gsap.set('#heroTagline', { opacity: 0, y: 20 });
    gsap.set('.hero-label', { opacity: 0, y: 10 });

    const tl = gsap.timeline({
      onComplete: () => {
        loader.style.display = 'none';
        loader.style.pointerEvents = 'none';
        document.body.style.overflow = '';
        initCanvases();
        initScrollTriggers();
        initHeroParallax();
      },
    });

    // ── Phase 1: Letter groups slide up from below their masks ──
    tl.to([loaderL1, loaderL2], {
      yPercent: 0,
      duration: 0.88,
      ease: 'power4.out',
      stagger: 0.1,
    }, 0);

    // ── Phase 2: Tiny square hole punches through centre ──
    tl.addLabel('holeOpen', '+=0.24');
    tl.to(hole, {
      w: 48, h: 48,
      duration: 0.28,
      ease: 'power2.out',
      onUpdate: updatePath,
    }, 'holeOpen');

    // ── Phase 3: Hole grows to mid-sized rectangle ──
    tl.addLabel('holeRect', '>');
    const midW = vw * 0.58;
    const midH = vh * 0.58;
    tl.to(hole, {
      w: midW, h: midH,
      duration: 1.05,
      ease: 'power4.inOut',
      onUpdate: updatePath,
    }, 'holeRect');

    // Letters exit during rect expansion
    tl.to([loaderL1, loaderL2], {
      yPercent: 110,
      duration: 0.42,
      ease: 'power3.in',
      stagger: { amount: 0.07, from: 'center' },
    }, 'holeRect+=0.32');

    // ── Phase 4: Rectangle blows out to full screen ──
    tl.addLabel('holeFull', 'holeRect+=0.78');
    tl.to(hole, {
      w: vw + 20, h: vh + 20,
      duration: 0.66,
      ease: 'power4.inOut',
      onUpdate: updatePath,
    }, 'holeFull');

    // ── Hero content cascades in as overlay disappears ──
    tl.to('.hero-name .line span', {
      yPercent: 0, opacity: 1,
      duration: 1.2, ease: 'power4.out', stagger: 0.12,
    }, 'holeFull+=0.26');

    tl.to('#heroTagline', {
      y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
    }, 'holeFull+=0.48');

    tl.to('.hero-label', {
      y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.14,
    }, 'holeFull+=0.52');

    tl.to('nav', {
      yPercent: 0, opacity: 1, duration: 0.8,
      ease: 'power3.out', clearProps: 'transform',
    }, 'holeFull+=0.36');

    tl.to(['#cursor', '#cursor-follower'], {
      opacity: 1, duration: 0.5, ease: 'power2.out',
    }, 'holeFull+=0.36');

    tl.to('#heroScrollBtn', {
      scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)',
    }, 'holeFull+=0.62');
  };

  // ─── CANVASES ────────────────────────────────────────
  const initCanvases = () => {
    projCanvasRefs.current.forEach((c, i) => {
      if (c) drawGradientCanvas(c, projects[i].hue);
    });
    if (aboutPortraitRef.current) drawPortrait(aboutPortraitRef.current);
    showcaseCanvasRefs.current.forEach((c, i) => {
      if (c) drawGradientCanvas(c, showcaseCards[i].hue);
    });
  };

  // ─── SCROLL TRIGGERS ────────────────────────────────
  const initScrollTriggers = () => {
    gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
      const isInsideWork = el.closest('#work') !== null;
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
          pinnedContainer: isInsideWork ? '#work' : undefined
        },
      });
    });

    // Work sticky scroll
    const workItems = gsap.utils.toArray<HTMLElement>('.project-item');
    const workImages = gsap.utils.toArray<HTMLElement>('.work-img-wrapper');
    const projectsList = document.getElementById('projectsList');
    let currentWork = -1;

    const activateWork = (index: number) => {
      if (currentWork === index) return;

      workItems.forEach((el, i) => {
        if (i === index) el.classList.add('active');
        else el.classList.remove('active');
      });

      if (currentWork !== -1) {
        gsap.to(workImages[currentWork], { opacity: 0, duration: 0.5, ease: 'power3.inOut', clipPath: 'none' });
        gsap.set(workImages[currentWork], { zIndex: 1 });
      }

      gsap.set(workImages[index], { zIndex: 10, opacity: 0, clipPath: 'none' });
      gsap.to(workImages[index], { opacity: 1, duration: 0.7, ease: 'power3.out' });

      currentWork = index;
    };

    if (window.innerWidth > 1024) {
      requestAnimationFrame(() => {
        if (!projectsList) return;
        const listHeight = projectsList.scrollHeight;
        const scrollerEl = document.querySelector('.work-projects-scroller') as HTMLElement;
        if (!scrollerEl) return;

        const visibleHeight = scrollerEl.offsetHeight;
        const scrollDistance = Math.max(0, listHeight - visibleHeight);
        console.log('--- DEBUG GSAP ---');
        console.log('listHeight:', listHeight, 'visibleHeight:', visibleHeight, 'scrollDistance:', scrollDistance);

        ScrollTrigger.create({
          trigger: '#work',
          scroller: document.documentElement,
          start: 'top top',
          end: () => `+=${scrollDistance + window.innerHeight * 0.5}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          anticipatePin: 1,
          animation: gsap.to(projectsList, { y: -scrollDistance, ease: 'none' }),
          onUpdate: (self) => {
            const progress = self.progress;
            workItems.forEach((item, i) => {
              const itemTop = item.offsetTop;
              const itemBottom = itemTop + item.offsetHeight;
              const startProgress = Math.max(0, (itemTop - visibleHeight * 0.4) / scrollDistance);
              const endProgress = Math.min(1, (itemBottom - visibleHeight * 0.4) / scrollDistance);
              if (progress >= startProgress && progress < endProgress) {
                activateWork(i);
              }
            });
          }
        });

        ScrollTrigger.create({
          trigger: '#work',
          scroller: document.documentElement,
          start: 'top 80%',
          onEnter: () => activateWork(0),
        });
      });
    } else {
      workItems.forEach((item, i) => {
        ScrollTrigger.create({
          trigger: item,
          scroller: document.documentElement,
          start: 'top center',
          end: 'bottom center',
          onToggle: self => {
            if (self.isActive) activateWork(i);
          }
        });
      });
    }

    // ── Visual Archive: Parallax + Magnetic Hover ──
    const showcaseSection = document.getElementById('showcase');
    const archiveCards = gsap.utils.toArray<HTMLElement>('.showcase-card');

    if (showcaseSection && archiveCards.length) {
      // Set initial hidden state
      gsap.set(archiveCards, { opacity: 0, y: 70, scale: 0.88 });

      // Staggered scroll-entry reveal
      ScrollTrigger.create({
        trigger: showcaseSection,
        start: 'top 78%',
        onEnter: () => {
          gsap.to(archiveCards, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.3,
            ease: 'power4.out',
            stagger: 0.08,
          });
        },
      });

      // Per-card quickTo setters for smooth parallax
      const cardXTo = archiveCards.map((c) =>
        gsap.quickTo(c, 'x', { duration: 0.9, ease: 'power3.out' })
      );
      const cardYTo = archiveCards.map((c) =>
        gsap.quickTo(c, 'y', { duration: 0.9, ease: 'power3.out' })
      );
      const cardRXTo = archiveCards.map((c) =>
        gsap.quickTo(c, 'rotateX', { duration: 0.9, ease: 'power3.out' })
      );
      const cardRYTo = archiveCards.map((c) =>
        gsap.quickTo(c, 'rotateY', { duration: 0.9, ease: 'power3.out' })
      );

      // Global mouse-parallax across the entire section
      const onSectionMove = (e: MouseEvent) => {
        const rect = showcaseSection.getBoundingClientRect();
        const xRel = (e.clientX - rect.left) / rect.width - 0.5;
        const yRel = (e.clientY - rect.top) / rect.height - 0.5;
        archiveCards.forEach((card, i) => {
          const d = parseFloat(card.dataset.depth || '1');
          cardXTo[i](xRel * 28 * d);
          cardYTo[i](yRel * 18 * d);
          cardRXTo[i](yRel * -5 * d);
          cardRYTo[i](xRel * 5 * d);
        });
      };
      showcaseSection.addEventListener('mousemove', onSectionMove);

      // Reset on mouse leave
      showcaseSection.addEventListener('mouseleave', () => {
        archiveCards.forEach((_, i) => {
          cardXTo[i](0); cardYTo[i](0);
          cardRXTo[i](0); cardRYTo[i](0);
        });
      });

      // Per-card magnetic pull + counter update
      const counterEl = document.getElementById('showcaseCurrentNum');
      archiveCards.forEach((card, i) => {
        const scaleUp = gsap.quickTo(card, 'scale', { duration: 0.4, ease: 'power2.out' });

        card.addEventListener('mouseenter', () => {
          scaleUp(1.06);
          if (counterEl) counterEl.textContent = String(i + 1).padStart(2, '0');
        });
        card.addEventListener('mouseleave', () => {
          scaleUp(1);
        });
      });
    }

    // Smooth anchor scrolling via Lenis
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        e.preventDefault();
        const target = document.querySelector(id);
        if (target) lenisRef.current?.scrollTo(target as HTMLElement, { duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      });
    });

    // ── Hero artwork scroll parallax ──
    gsap.to('#heroArtworkWrap', {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: '#home',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Hero text fades & lifts as you scroll away
    gsap.to(['.hero-name', '#heroTagline', '.hero-label'], {
      y: -50,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '#home',
        start: 'top top',
        end: '55% top',
        scrub: true,
      },
    });
  };

  // ─── HERO PARALLAX (mouse-move) ─────────────────────
  const initHeroParallax = () => {
    const heroEl = document.getElementById('home');
    const wrap = document.getElementById('heroArtworkWrap');
    const labelLeft = document.getElementById('heroLabelLeft');
    const labelRight = document.getElementById('heroLabelRight');
    if (!heroEl || !wrap) return;

    const wrapXTo = gsap.quickTo(wrap, 'x', { duration: 1.4, ease: 'power3.out' });
    const wrapYTo = gsap.quickTo(wrap, 'y', { duration: 1.4, ease: 'power3.out' });
    const lxTo = labelLeft ? gsap.quickTo(labelLeft, 'x', { duration: 1.1, ease: 'power3.out' }) : null;
    const lyTo = labelLeft ? gsap.quickTo(labelLeft, 'y', { duration: 1.1, ease: 'power3.out' }) : null;
    const rxTo = labelRight ? gsap.quickTo(labelRight, 'x', { duration: 1.0, ease: 'power3.out' }) : null;
    const ryTo = labelRight ? gsap.quickTo(labelRight, 'y', { duration: 1.0, ease: 'power3.out' }) : null;

    heroEl.addEventListener('mousemove', (e) => {
      const cx = e.clientX / window.innerWidth - 0.5;
      const cy = e.clientY / window.innerHeight - 0.5;
      wrapXTo(cx * -28);
      wrapYTo(cy * -20);
      if (lxTo && lyTo) { lxTo(cx * 20); lyTo(cy * 14); }
      if (rxTo && ryTo) { rxTo(cx * -16); ryTo(cy * -12); }
    });

    heroEl.addEventListener('mouseleave', () => {
      wrapXTo(0); wrapYTo(0);
      if (lxTo && lyTo) { lxTo(0); lyTo(0); }
      if (rxTo && ryTo) { rxTo(0); ryTo(0); }
    });
  };

  // ─── NAV HIDE/SHOW ──────────────────────────────────
  const initNav = () => {
    let lastY = 0;
    const handler = ({ scroll }: { scroll: number }) => {
      const nav = document.getElementById('nav');
      if (!nav) return;
      if (scroll > lastY && scroll > 100) nav.classList.add('hide');
      else nav.classList.remove('hide');
      lastY = scroll;
    };
    // Attach after lenis is ready (next tick)
    setTimeout(() => lenisRef.current?.on('scroll', handler), 0);
  };

  // ─── CUSTOM CURSOR ──────────────────────────────────
  const initCursor = () => {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    if (!cursor || !follower) return;

    let mx = 0, my = 0, fx = 0, fy = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      gsap.to(cursor, { x: mx, y: my, duration: 0.1 });
    });

    const follow = () => {
      fx += (mx - fx) * 0.12;
      fy += (my - fy) * 0.12;
      gsap.set(follower, { x: fx, y: fy });
      requestAnimationFrame(follow);
    };
    follow();

    // Delegate hover state
    document.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, .project-item, .showcase-card, .campaign-card, .next-capsule, .hero-scroll-btn')) {
        document.body.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, .project-item, .showcase-card, .campaign-card, .next-capsule, .hero-scroll-btn')) {
        document.body.classList.remove('cursor-hover');
      }
    });
  };

  // ─── PROJECT DETAIL ─────────────────────────────────
  const openProject = useCallback((i: number) => {
    setCurrentProject(i);
    const p = projects[i];

    // Draw hero canvas
    if (detailHeroCanvasRef.current) {
      detailHeroCanvasRef.current.width = 1400;
      detailHeroCanvasRef.current.height = 700;
      drawGradientCanvas(detailHeroCanvasRef.current, p.hue);
    }

    // Draw gallery canvases
    if (detailGalleryRef.current) {
      detailGalleryRef.current.innerHTML = '';
      [p.hue, p.hue + 30, p.hue + 60].forEach((h) => {
        const c = document.createElement('canvas');
        c.width = 800;
        c.height = 600;
        drawGradientCanvas(c, h % 360);
        detailGalleryRef.current!.appendChild(c);
      });
    }

    setDetailOpen(true);
    const detail = document.getElementById('projectDetail');
    if (detail) {
      detail.scrollTop = 0;
      gsap.fromTo(detail, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' });
    }
  }, []);

  const closeProject = () => {
    const detail = document.getElementById('projectDetail');
    if (!detail) {
      setDetailOpen(false);
      return;
    }
    gsap.to(detail, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => setDetailOpen(false),
    });
  };

  const goNextProject = () => openProject(projects[currentProject].next);

  // ─── MOBILE MENU ────────────────────────────────────
  const toggleMobileMenu = () => {
    const next = !mobileMenuOpen;
    setMobileMenuOpen(next);
    document.body.style.overflow = next ? 'hidden' : '';
    if (next) document.body.classList.add('menu-open');
    else document.body.classList.remove('menu-open');
  };
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
    document.body.classList.remove('menu-open');
  };

  const p = projects[currentProject];
  const next = projects[p.next];

  return (
    <>
      {/* LOADER — SVG hole-punch reveal */}
      <div id="loader">
        {/* Dark overlay with a growing transparent hole cut from centre */}
        <svg
          id="loaderSvg"
          className="loader-svg"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <clipPath id="loaderClip" clipPathUnits="userSpaceOnUse">
              {/*
                evenodd: outer rect = dark, inner growing rect = transparent hole.
                Starts huge to guarantee full coverage before JS updates exact dims.
              */}
              <path id="loaderHolePath" fillRule="evenodd" d="M -1 -1 L 9999 -1 L 9999 9999 L -1 9999 Z" />
            </clipPath>
          </defs>
          {/* clipPath applied in JSX — no JS setup needed for initial dark state */}
          <rect id="loaderBgRect" width="100%" height="100%" fill="#080808" clipPath="url(#loaderClip)" />
        </svg>

        {/* Logo letters — slide up from below their overflow-hidden masks */}
        <div className="loader-name-wrap" id="loaderNameWrap">
          <div className="loader-letter-mask">
            <span className="loader-letter" id="loaderL1">THV</span>
          </div>
          <div className="loader-letter-mask">
            <span className="loader-letter" id="loaderL2">MAX</span>
          </div>
        </div>
      </div>

      {/* CUSTOM CURSOR */}
      <div id="cursor"></div>
      <div id="cursor-follower"></div>

      {/* NAV */}
      <nav id="nav">
        <a href="#home" className="nav-logo">THVMAX</a>
        <div className="nav-running-text">
          <div className="nav-marquee">
            <span>• Designer with 7+ years of experience • shaping brand visuals across multinational companies and creative agencies • </span>
            <span>• Designer with 7+ years of experience • shaping brand visuals across multinational companies and creative agencies • </span>
          </div>
        </div>
        <ul className="nav-links">
          <li><a href="#work">Work</a></li>
          <li><a href="#campaign">Services</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <button
          className={`nav-hamburger ${mobileMenuOpen ? 'open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Menu"
        >
          <span></span><span></span><span></span>
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className={`nav-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#work" className="mobile-nav-link" onClick={closeMobileMenu}>Work</a>
        <a href="#campaign" className="mobile-nav-link" onClick={closeMobileMenu}>Services</a>
        <a href="#about" className="mobile-nav-link" onClick={closeMobileMenu}>About</a>
        <a href="#contact" className="mobile-nav-link" onClick={closeMobileMenu}>Contact</a>
        <div className="nav-mobile-footer">THVMAX © 2026</div>
      </div>

      {/* HERO */}
      <section id="home">
        <div className="hero-bg">
          <div className="hero-artwork-wrap" id="heroArtworkWrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={heroArtworkRef}
              className="hero-artwork-img"
              src="/images/my-kind-of-vacation.jpg"
              alt="My Kind of Vacation"
            />
          </div>
          <div className="hero-overlay"></div>
          <div className="hero-grain-overlay" aria-hidden="true"></div>
          <div className="hero-bg-grid"></div>
        </div>

        {/* Corner labels — parallax on mouse move */}
        <div className="hero-label hero-label-left" id="heroLabelLeft">
          <span>My Kind of Vacation</span>
          <span>Original Artwork · 2024</span>
        </div>
        <div className="hero-label hero-label-right" id="heroLabelRight">
          <span>Art Direction</span>
          <span>Photo Manipulation</span>
        </div>

        <div className="hero-scroll-btn" id="heroScrollBtn">
          <a href="#work" style={{ color: 'var(--black)', textDecoration: 'none' }}>SCROLL</a>
        </div>

        <h1 className="hero-name thomas-title">
          <span className="line"><span>THIS IS THOMAS</span></span>
        </h1>
        <p className="hero-tagline" id="heroTagline">Creative Director &amp; Visual Artist</p>
      </section>

      {/* MARQUEE */}
      <div className="marquee-section">
        <div className="marquee-track" id="marquee">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <div key={i} className="marquee-item">{item}<span className="dot"></span></div>
          ))}
        </div>
      </div>

      {/* WORK */}
      <section id="work" className="work-scroll-section">
        <div className="work-pinned-viewport" id="workPinnedViewport">
          <div className="work-left">
            <div className="section-header reveal">
              <h2 className="section-title">Selected<br />Works</h2>
              <div className="section-meta">2019 — 2026<br />5 Projects</div>
            </div>
            <div className="work-projects-scroller">
              <ul className="projects-list" id="projectsList">
                {projects.map((proj, i) => (
                  <li key={i} className="project-item reveal" data-project={i}>
                    <button
                      className="project-link"
                      onClick={() => openProject(i)}
                      type="button"
                    >
                      <span className="project-num">{String(i + 1).padStart(2, '0')}</span>
                      <div className="project-info">
                        <span className="project-name">{proj.name}</span>
                        <span className="project-tags">{proj.tags}</span>
                      </div>
                      <span className="project-year">{proj.year}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Fixed Gallery Right Side */}
          <div className="work-right">
            <div className="work-sticky-container" id="workStickyContainer">
              {projects.map((proj, i) => (
                <canvas
                  key={i}
                  ref={(el) => { projCanvasRefs.current[i] = el; }}
                  className="work-img-wrapper proj-canvas"
                  data-hue={proj.hue}
                  width={800}
                  height={1000}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SHOWCASE */}
      <section id="showcase">
        {/* Ghost watermark */}
        <div className="showcase-ghost" aria-hidden="true">ARCHIVE</div>

        {/* Header */}
        <div className="showcase-header reveal">
          <div className="showcase-header-left">
            <h2 className="section-title">Visual<br />Archive</h2>
          </div>
          <div className="showcase-header-right">
            <div className="showcase-counter">
              <span className="showcase-counter-current" id="showcaseCurrentNum">01</span>
              <span className="showcase-counter-sep">/</span>
              <span className="showcase-counter-total">08</span>
            </div>
            <p className="showcase-header-sub">Selected visual experiments<br />and brand explorations</p>
          </div>
        </div>

        {/* Masonry grid */}
        <div className="showcase-grid" id="showcaseGrid">
          {showcaseCards.map((card, i) => (
            <div
              key={i}
              className="showcase-card"
              data-index={i}
              data-depth={card.depth}
            >
              <div className="showcase-card-inner">
                <canvas
                  ref={(el) => { showcaseCanvasRefs.current[i] = el; }}
                  width={800}
                  height={1000}
                />
              </div>
              {/* Corner index */}
              <span className="showcase-card-index">{String(i + 1).padStart(2, '0')}</span>
              {/* Info overlay */}
              <div className="showcase-card-info">
                <span className="showcase-card-cat">{card.cat}</span>
                <span className="showcase-card-name">{card.name}</span>
              </div>
              {/* Animated border */}
              <div className="showcase-card-border" aria-hidden="true" />
            </div>
          ))}
        </div>
      </section>

      {/* CAMPAIGN / SERVICES */}
      <section id="campaign">
        <div className="section-header reveal">
          <h2 className="section-title">Creative<br />Services</h2>
          <div className="section-meta">What I Do</div>
        </div>
        <div className="campaign-grid">
          {servicesData.map((s, i) => (
            <div key={i} className="campaign-card reveal">
              <span className="campaign-card-tag">{s.tag}</span>
              <div className="campaign-card-num">{s.num}</div>
              <h3 className="campaign-card-title">{s.title}</h3>
              <p className="campaign-card-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="about-left">
          <h2 className="about-headline">About<br />the work.</h2>
          <canvas
            ref={aboutPortraitRef}
            className="about-portrait"
            id="aboutPortrait"
            width={640}
            height={860}
          />
        </div>
        <div className="about-right">
          <p className="about-bio reveal">
            Multidisciplinary creative with over 7 years of working experience in both multinational companies and creative agency environments. Passionate about driving innovation in marketing approaches and creating visually captivating experiences that effectively communicate a brand&apos;s message.
          </p>
          <div className="about-exp reveal">
            <div className="about-exp-title">Experience</div>
            {experience.map((exp, i) => (
              <div key={i} className="exp-item">
                <div>
                  <div className="exp-role">{exp.role}</div>
                  <div className="exp-co">{exp.co}</div>
                </div>
                <span className="exp-year">{exp.year}</span>
              </div>
            ))}
          </div>
          <div className="skills-grid reveal">
            {skills.map((skill) => (
              <span key={skill} className="skill-tag">{skill}</span>
            ))}
          </div>
          <div className="contact-links reveal" id="contact">
            <a href="mailto:thutasoe@example.com" className="contact-link">Email</a>
            <a href="https://linktr.ee/thvmax" target="_blank" rel="noopener noreferrer" className="contact-link">Linktree</a>
            <a href="tel:+971565776382" className="contact-link">+971 56 577 6382</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-left">Thuta Soe © 2026</div>
        <div className="footer-right">Design &amp; Strategy · Abu Dhabi, UAE</div>
      </footer>

      {/* PROJECT DETAIL OVERLAY */}
      <div
        className={`project-detail ${detailOpen ? 'active' : ''}`}
        id="projectDetail"
      >
        <button className="detail-close" onClick={closeProject}>Close</button>
        <div className="detail-hero">
          <canvas
            ref={detailHeroCanvasRef}
            className="detail-hero-canvas"
            id="detailHeroCanvas"
            width={1400}
            height={700}
          />
          <div className="detail-hero-overlay"></div>
          <h2 className="detail-hero-title" id="detailTitle">{p.name}</h2>
        </div>
        <div className="detail-body">
          <p className="detail-desc" id="detailDesc">{p.desc}</p>
          <div className="detail-meta">
            <div className="detail-meta-item">
              <span className="detail-meta-label">Year</span>
              <span className="detail-meta-value" id="detailYear">{p.year}</span>
            </div>
            <div className="detail-meta-item">
              <span className="detail-meta-label">Scope</span>
              <span className="detail-meta-value">{p.tags}</span>
            </div>
            <div className="detail-meta-item">
              <span className="detail-meta-label">Role</span>
              <span className="detail-meta-value">Art Director</span>
            </div>
            <div className="detail-meta-item">
              <span className="detail-meta-label">Client</span>
              <span className="detail-meta-value">Confidential</span>
            </div>
          </div>
        </div>
        <div className="detail-gallery" id="detailGallery" ref={detailGalleryRef}></div>
        <div className="detail-next">
          <div>
            <div className="detail-next-label">Next Project</div>
            <button
              className="detail-next-name"
              id="detailNextName"
              onClick={goNextProject}
              type="button"
            >
              {next.name} →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
