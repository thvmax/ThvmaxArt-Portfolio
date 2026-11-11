"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { plate, v2Work, type V2Project } from '@/lib/v2content';

/**
 * Work (/work) — an interactive gallery adapted from the Creative Space on
 * gionatannese.com: the projects (plus extra real stills) as small cards
 * on a turning sphere that fills the screen.
 *
 * Cards always face the viewer; scroll, drag or move the pointer to turn
 * the sphere. Plain DOM + transforms, no WebGL, so every card is a real
 * link (keyboard and screen-reader reachable).
 *
 * Real artwork is used where it exists; otherwise the project's own accent
 * plate stands in, as everywhere else on the site.
 */

const COVERS: Record<string, string> = {
  'sting-nightlife-repositioning': '/case-studies/sting-night-life/thematic-kv.png',
};

const pad2 = (n: number) => String(n).padStart(2, '0');
const rest = (p: V2Project) => p.cat.split(' · ').slice(1).join(' · ') || p.cat;

function Media({ p, sizes, src }: { p: V2Project; sizes: string; src?: string }) {
  const cover = src ?? COVERS[p.slug];
  return (
    <span className="v2-ed-media" style={{ background: plate(p.accent) }}>
      {cover && <Image src={cover} alt="" fill sizes={sizes} className="v2-ed-img" />}
    </span>
  );
}

/* ── Space ─────────────────────────────────────────────────────────── */

/** Evenly spread n points on a unit sphere (Fibonacci lattice). */
function lattice(n: number): [number, number, number][] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - ((i + 0.5) / n) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = golden * i;
    return [Math.cos(t) * r, y, Math.sin(t) * r];
  });
}

/** One card on the sphere: a project, optionally showing one of its stills. */
type Card = { key: string; p: V2Project; src?: string };

const STING_STILLS = ['product-kv.png', 'event-poster.png', 'kv-qr-code.png', 'slide-1.jpg', 'slide-2.jpg', 'slide-3.jpg'];

/** Every project once, then the extra real stills that exist (all STING for now). */
function buildCards(): Card[] {
  const cards: Card[] = v2Work.map((p) => ({ key: p.slug, p }));
  const sting = v2Work.find((p) => p.slug === 'sting-nightlife-repositioning');
  if (sting) STING_STILLS.forEach((f) => cards.push({ key: `sting-${f}`, p: sting, src: `/case-studies/sting-night-life/${f}` }));
  // interleave so the STING stills spread over the sphere instead of clumping
  const out: Card[] = [];
  const base = cards.slice(0, v2Work.length), extra = cards.slice(v2Work.length);
  base.forEach((c, i) => { out.push(c); if (i % 2 === 1 && extra.length) out.push(extra.shift()!); });
  return out.concat(extra);
}

function Space({ cards }: { cards: Card[] }) {
  const items = cards.map((c) => c.p);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const nodes = useRef<(HTMLAnchorElement | null)[]>([]);
  const points = useMemo(() => lattice(items.length), [items.length]);
  const [active, setActive] = useState<number | null>(null);
  const born = useRef(0);
  const s = useRef({ ry: 0, vy: 0, rx: -0.2, tx: -0.2, yaw: 0, tyaw: 0, hold: false, drag: false, moved: false, lx: 0, ly: 0 });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;

    const tick = () => {
      const st = s.current;
      // opening: the cards start stacked in the centre and burst out into the sphere
      if (!born.current) born.current = performance.now();
      const o = reduced ? 1 : Math.min(1, (performance.now() - born.current) / 1300);
      const open = 1 - Math.pow(1 - o, 4);
      // sized to the screen: the sphere fills most of the viewport at any size
      const wide = stage.clientWidth < 700 ? 0.4 : 0.3;
      const R = Math.min(stage.clientWidth * wide, stage.clientHeight * 0.29) * (0.04 + 0.96 * open);
      const f = R * 3.4;
      st.ry += (reduced || st.hold || st.drag ? 0 : 0.0016) + st.vy + (1 - open) * 0.03;
      st.vy *= 0.93;
      st.rx += (st.tx - st.rx) * 0.07;
      st.yaw += (st.tyaw - st.yaw) * 0.05;
      const a = st.ry + st.yaw;
      const cy = Math.cos(a), sy = Math.sin(a), cx = Math.cos(st.rx), sx = Math.sin(st.rx);
      for (let i = 0; i < points.length; i++) {
        const el = nodes.current[i];
        if (!el) continue;
        const [px, py, pz] = points[i];
        const x1 = px * cy + pz * sy;
        const z1 = -px * sy + pz * cy;
        const y2 = py * cx - z1 * sx;
        const z2 = py * sx + z1 * cx;
        const k = f / (f - z2 * R);
        const depth = (z2 + 1) / 2;
        el.style.transform = `translate3d(${x1 * R * k}px, ${y2 * R * k}px, 0) translate(-50%, -50%) scale(${k})`;
        // fully opaque: a see-through card shows the page behind it, which reads as
        // a faded image and flashes during the theme switch. Depth is carried by
        // scale and stacking alone; only the opening burst fades the cards in.
        el.style.opacity = String(Math.min(1, open * 1.4));
        el.style.zIndex = String(Math.round(depth * 100));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      s.current.vy += Math.max(-0.05, Math.min(0.05, (e.deltaY + e.deltaX) * 0.00018));
    };
    const onMove = (e: PointerEvent) => {
      const st = s.current;
      if (st.drag) {
        const dx = e.clientX - st.lx, dy = e.clientY - st.ly;
        if (Math.abs(dx) + Math.abs(dy) > 4) st.moved = true;
        st.vy = dx * 0.0045;
        st.tx = Math.max(-0.9, Math.min(0.9, st.tx - dy * 0.004));
        st.lx = e.clientX; st.ly = e.clientY;
        return;
      }
      if (e.pointerType !== 'mouse' || reduced) return;
      const r = stage.getBoundingClientRect();
      st.tyaw = ((e.clientX - r.left) / r.width - 0.5) * 0.7;
      st.tx = -0.2 - ((e.clientY - r.top) / r.height - 0.5) * 0.5;
    };
    const onUp = () => { s.current.drag = false; };

    stage.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener('wheel', onWheel);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [points]);

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const st = s.current;
    st.drag = true; st.moved = false; st.lx = e.clientX; st.ly = e.clientY;
  };

  const show = (i: number | null) => { s.current.hold = i !== null; setActive(i); };
  const cur = active === null ? null : items[active];

  return (
    <div
      ref={stageRef}
      className="v2-ed-space"
      onPointerDown={onDown}
      onClickCapture={(e) => { if (s.current.moved) { e.preventDefault(); e.stopPropagation(); s.current.moved = false; } }}
      data-lenis-prevent
    >
      {cards.map(({ key, p, src }, i) => (
        <Link
          key={key}
          ref={(el) => { nodes.current[i] = el; }}
          href={`/work/${p.slug}`}
          className="v2-ed-node"
          aria-label={`${p.name} — ${p.cat}, ${p.year}`}
          onPointerEnter={() => show(i)}
          onPointerLeave={() => show(null)}
          onFocus={() => show(i)}
          onBlur={() => show(null)}
          draggable={false}
          data-cursor="hover"
        >
          <span className="v2-ed-node-card">
            <Media p={p} src={src} sizes="160px" />
          </span>
        </Link>
      ))}

      <p className="v2-ed-counter" aria-live="polite">
        {cur ? (
          <>
            <span>{pad2(active! + 1)} / {pad2(items.length)}</span> {cur.name} <em>{rest(cur)}, {cur.year}</em>
          </>
        ) : (
          <>
            <span>{pad2(v2Work.length)}</span> Projects <em>scroll or drag to turn</em>
          </>
        )}
      </p>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function WorkEditorial() {
  const cards = useMemo(buildCards, []);
  return (
    <section className="v2-ed v2-ed--space">
      <h1 className="v2-sr-only">Selected work</h1>
      <Space cards={cards} />
    </section>
  );
}
