"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSmoothScroll } from './SmoothScroll';

const STORAGE_KEY = 'ts-intro-seen';
export const INTRO_DISMISS_EVENT = 'ts-intro-dismiss';
const WORDMARK = 'T—S';

// Timeline (seconds)
const GATHER_DUR = 0.9;   // per-particle gather duration
const GATHER_SPREAD = 0.5; // random stagger window
const HOLD_UNTIL = 3.2;    // auto-dismiss at this point
const SKIP_AFTER = 0.7;    // clicks ignored before this

// Physics
const SPRING = 0.024;
const DAMPING = 0.88;
const REPEL_RADIUS = 110;
const REPEL_FORCE = 2.6;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hx: number;
  hy: number;
  sx: number;
  sy: number;
  delay: number;
  r: number;
}

function sampleWordmark(width: number, height: number): { hx: number; hy: number; r: number }[] {
  const off = document.createElement('canvas');
  off.width = width;
  off.height = height;
  const octx = off.getContext('2d', { willReadFrequently: true });
  if (!octx) return [];

  let fontSize = 100;
  octx.font = `600 ${fontSize}px Inter, 'Helvetica Neue', Arial, sans-serif`;
  const measured = octx.measureText(WORDMARK).width || 1;
  fontSize = Math.min(fontSize * ((Math.min(width * 0.72, 920)) / measured), height * 0.42);

  octx.font = `600 ${fontSize}px Inter, 'Helvetica Neue', Arial, sans-serif`;
  octx.textAlign = 'center';
  octx.textBaseline = 'middle';
  octx.fillStyle = '#000';
  octx.fillText(WORDMARK, width / 2, height / 2);

  const step = Math.max(3, Math.round(Math.min(width, height) / 170));
  const data = octx.getImageData(0, 0, width, height).data;
  const points: { hx: number; hy: number; r: number }[] = [];
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (data[(y * width + x) * 4 + 3] > 128) {
        points.push({
          hx: x + (Math.random() - 0.5) * step * 0.6,
          hy: y + (Math.random() - 0.5) * step * 0.6,
          r: step * 0.34 + Math.random() * step * 0.12,
        });
      }
    }
  }
  return points;
}

export default function Intro() {
  const { stop, start } = useSmoothScroll();
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const leavingRef = useRef(false);

  const dismiss = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {}
    setLeaving(true);
    start();
    document.body.style.overflow = '';
    window.setTimeout(() => window.dispatchEvent(new Event(INTRO_DISMISS_EVENT)), 300);
    window.setTimeout(() => setVisible(false), 950);
  }, [start]);

  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem(STORAGE_KEY);
    } catch {}
    if (seen) {
      setVisible(false);
      return;
    }

    stop();
    document.body.style.overflow = 'hidden';

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      const t = window.setTimeout(dismiss, 700);
      return () => window.clearTimeout(t);
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      dismiss();
      return;
    }

    let raf = 0;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let gathered = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const mouse = { x: -9999, y: -9999 };
    const t0 = performance.now();

    const build = (scatter: boolean) => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = sampleWordmark(width, height).map((p) => ({
        ...p,
        sx: scatter ? Math.random() * width : p.hx,
        sy: scatter ? Math.random() * height : p.hy,
        x: scatter ? Math.random() * width : p.hx,
        y: scatter ? Math.random() * height : p.hy,
        vx: 0,
        vy: 0,
        delay: Math.random() * GATHER_SPREAD,
      }));
      gathered = !scatter;
    };

    const easeOutQuart = (p: number) => 1 - Math.pow(1 - p, 4);

    const frame = (now: number) => {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#111111';

      for (const p of particles) {
        if (!gathered) {
          const prog = Math.min(Math.max((t - p.delay) / GATHER_DUR, 0), 1);
          if (prog < 1) {
            const e = easeOutQuart(prog);
            p.x = p.sx + (p.hx - p.sx) * e;
            p.y = p.sy + (p.hy - p.sy) * e;
          } else {
            p.x = p.hx;
            p.y = p.hy;
          }
        } else {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < REPEL_RADIUS && dist > 0.01) {
            const f = (1 - dist / REPEL_RADIUS) * REPEL_FORCE;
            p.vx += (dx / dist) * f;
            p.vy += (dy / dist) * f;
          }
          p.vx = (p.vx + (p.hx - p.x) * SPRING) * DAMPING;
          p.vy = (p.vy + (p.hy - p.y) * SPRING) * DAMPING;
          p.x += p.vx;
          p.y += p.vy;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!gathered && t > GATHER_DUR + GATHER_SPREAD) gathered = true;
      raf = requestAnimationFrame(frame);
    };

    const onPointerMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onPointerLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => build(false), 150);
    };
    const onClick = () => {
      if ((performance.now() - t0) / 1000 > SKIP_AFTER) dismiss();
    };
    const autoDismiss = window.setTimeout(dismiss, HOLD_UNTIL * 1000);

    const startAnimation = () => {
      build(true);
      raf = requestAnimationFrame(frame);
    };
    if (document.fonts?.ready) {
      document.fonts.ready.then(startAnimation).catch(startAnimation);
    } else {
      startAnimation();
    }

    window.addEventListener('pointermove', onPointerMove);
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('resize', onResize);
    window.addEventListener('pointerdown', onClick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(autoDismiss);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointerdown', onClick);
    };
  }, [dismiss, stop]);

  if (!visible) return null;

  return (
    <div className={`intro ${leaving ? 'intro--leaving' : ''}`} aria-hidden="true">
      <canvas ref={canvasRef} className="intro-canvas" />
      <div className="intro-meta">
        <span>THVMAX — Portfolio</span>
        <span>Abu Dhabi, UAE © 2026</span>
      </div>
    </div>
  );
}
