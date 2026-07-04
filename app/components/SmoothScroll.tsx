"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface SmoothScrollApi {
  scrollTo: (target: string) => void;
}

const SmoothScrollContext = createContext<SmoothScrollApi>({ scrollTo: () => {} });

export const useSmoothScroll = () => useContext(SmoothScrollContext);

/**
 * App-level smooth-scroll provider.
 * Everything touching window/document lives inside useEffect, so the
 * component is SSR-safe under the App Router.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Low lerp → slow, heavy, cinematic glide
    const lenis = new Lenis({
      lerp: 0.055,
      smoothWheel: !reduced,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;

    // Keep ScrollTrigger in sync with Lenis and drive Lenis off the
    // GSAP ticker so both share one rAF loop.
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = useCallback((target: string) => {
    const el = document.querySelector(target);
    if (el) lenisRef.current?.scrollTo(el as HTMLElement, { duration: 1.8 });
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
