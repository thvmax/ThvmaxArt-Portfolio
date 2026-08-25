"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { useSmoothScroll } from '@/app/components/SmoothScroll';

/**
 * Route transition — one motion, two beats.
 *
 *   1. the page you are leaving dims to 60% black and stays there
 *   2. the new page swipes up over it on a curved leading edge
 *
 * The outgoing page is a frozen snapshot pinned under a scrim. The live
 * page container is the one that rises: it lives in the layout, so it
 * survives navigation and can simply be clipped while its children swap.
 */

const SAG = 1.725;
const DIM = 0.6;

/** Region of the incoming page that is visible: everything below the curve. */
const buildD = (edge: number, w: number, h: number) => {
  const ctrl = Math.min(h + 2, edge * SAG);
  return `M 0 ${h + 2} V ${edge} Q ${w / 2} ${ctrl} ${w} ${edge} V ${h + 2} z`;
};

const buildEdge = (edge: number, w: number, h: number) =>
  `M 0 ${edge} Q ${w / 2} ${Math.min(h + 2, edge * SAG)} ${w} ${edge}`;

export default function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { stop, start } = useSmoothScroll();

  const clipRef = useRef<SVGPathElement | null>(null);
  const edgeRef = useRef<SVGPathElement | null>(null);
  const edgeSvgRef = useRef<SVGSVGElement | null>(null);
  const busyRef = useRef(false);

  const cleanup = useCallback(() => {
    document.documentElement.classList.remove('v2-routing');
    document.querySelectorAll('.v2-snapshot, .v2-scrim').forEach((n) => n.remove());
    const page = document.querySelector('.v2') as HTMLElement | null;
    if (page) {
      page.style.clipPath = '';
      page.style.zIndex = '';
      page.style.position = '';
    }
    if (edgeSvgRef.current) gsap.set(edgeSvgRef.current, { autoAlpha: 0 });
    busyRef.current = false;
  }, []);

  const go = useCallback(
    (href: string) => {
      if (busyRef.current || href === pathname) return;

      const page = document.querySelector('.v2') as HTMLElement | null;
      const clip = clipRef.current;
      const edge = edgeRef.current;
      const edgeSvg = edgeSvgRef.current;

      if (!page || !clip || !edge || !edgeSvg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        router.push(href);
        return;
      }

      busyRef.current = true;
      stop();
      // tells anything mounting on the incoming page to be there already
      // rather than fading in behind the sweep
      document.documentElement.classList.add('v2-routing');

      const w = window.innerWidth;
      const h = window.innerHeight;
      const scrolled = window.scrollY;

      // 1 ── freeze the page being left, exactly as it looks now
      const snapshot = document.createElement('div');
      snapshot.className = 'v2-snapshot';

      const inner = document.createElement('div');
      inner.className = 'v2-snapshot-inner';
      inner.style.transform = `translateY(${-scrolled}px)`;

      const frozen = page.cloneNode(true) as HTMLElement;
      frozen.removeAttribute('id');
      frozen.style.cssText = '';
      // nothing live belongs in a snapshot
      frozen.querySelectorAll('.v2-cursor, .v2-cursor-ring, .v2-menu').forEach((n) => n.remove());

      // A cloned <video> paints black — it has no frame until it reloads.
      // Swap each one for a still of the frame currently on screen, or the
      // page appears to black out wherever a video was.
      const liveVideos = page.querySelectorAll('video');
      frozen.querySelectorAll('video').forEach((cloneVideo, i) => {
        const live = liveVideos[i] as HTMLVideoElement | undefined;
        const box = live?.getBoundingClientRect();

        if (!live || !box || live.readyState < 2 || !live.videoWidth) {
          cloneVideo.remove();
          return;
        }

        const still = document.createElement('canvas');
        still.className = cloneVideo.className;
        still.width = Math.round(box.width);
        still.height = Math.round(box.height);

        const ctx = still.getContext('2d');
        if (ctx) {
          // object-fit: cover, by hand
          const scale = Math.max(still.width / live.videoWidth, still.height / live.videoHeight);
          const dw = live.videoWidth * scale;
          const dh = live.videoHeight * scale;
          ctx.drawImage(live, (still.width - dw) / 2, (still.height - dh) / 2, dw, dh);
        }

        cloneVideo.replaceWith(still);
      });

      inner.appendChild(frozen);
      snapshot.appendChild(inner);

      const scrim = document.createElement('div');
      scrim.className = 'v2-scrim';

      document.body.append(snapshot, scrim);

      // 2 ── the live container is what rises; hide it until it does
      page.style.position = 'relative';
      page.style.zIndex = '120';
      clip.setAttribute('d', buildD(h, w, h));
      edge.setAttribute('d', buildEdge(h, w, h));
      page.style.clipPath = 'url(#v2-rise)';

      const state = { edge: h };
      const draw = () => {
        clip.setAttribute('d', buildD(state.edge, w, h));
        edge.setAttribute('d', buildEdge(state.edge, w, h));
      };

      gsap
        .timeline({ onComplete: () => { cleanup(); start(); } })
        // the screen you are leaving goes to 60% black
        .fromTo(scrim, { opacity: 0 }, { opacity: DIM, duration: 0.26, ease: 'power2.out' })
        .add(() => {
          router.push(href);
          window.scrollTo(0, 0);
          gsap.set(edgeSvg, { autoAlpha: 1 });
        })
        // a frame for the incoming page to paint before it moves
        .to({}, { duration: 0.06 })
        // and it swipes up over the dimmed one
        .to(state, { edge: 0, duration: 0.82, ease: 'power3.inOut', onUpdate: draw })
        .to(edgeSvg, { autoAlpha: 0, duration: 0.25 }, '-=0.25');
    },
    [cleanup, pathname, router, start, stop],
  );

  // One delegated handler covers every internal link. Capture phase, or
  // React's own router handler runs first and navigates without us.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const link = (e.target as HTMLElement | null)?.closest?.('a') as HTMLAnchorElement | null;
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

      const href = link.getAttribute('href');
      // internal routes only — not protocol-relative, hashes, or API paths
      if (!href || !href.startsWith('/') || href.startsWith('//') || href.startsWith('/api')) return;

      e.preventDefault();
      e.stopPropagation();
      go(href);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [go]);

  // Route reached some other way (back button) — never leave a snapshot behind
  useEffect(() => {
    if (busyRef.current) return;
    cleanup();
  }, [pathname, cleanup]);

  return (
    <>
      <svg className="v2-rise-defs" aria-hidden="true">
        <defs>
          <clipPath id="v2-rise" clipPathUnits="userSpaceOnUse">
            <path ref={clipRef} d="" />
          </clipPath>
        </defs>
      </svg>

      <svg className="v2-rise-edge" ref={edgeSvgRef} aria-hidden="true">
        <path ref={edgeRef} d="" />
      </svg>

      {children}
    </>
  );
}
