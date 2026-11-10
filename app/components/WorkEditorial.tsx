"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { plate, v2Work, type V2Project } from '@/lib/v2content';

/**
 * Work (/work) — adapted from the Creative Space on gionatannese.com.
 *
 * Two views of the same ten projects, switched by a small segmented control:
 *   Index — a tight three-column grid, small captions, a hover tilt + sheen
 *           and a "View" label.
 *   Space — the projects as small, evenly spaced cards on a turning sphere.
 *           Cards always face the viewer; scroll, drag or move the pointer
 *           to turn it. Plain DOM + transforms, no WebGL, so every card is a
 *           real link (keyboard and screen-reader reachable).
 * Real artwork is used where it exists; otherwise the project's own accent
 * plate stands in, as everywhere else on the site.
 */

const COVERS: Record<string, string> = {
  'sting-nightlife-repositioning': '/case-studies/sting-night-life/thematic-kv.png',
};

type View = 'index' | 'space';
const VIEW_KEY = 'thv-work-view';

const pad2 = (n: number) => String(n).padStart(2, '0');
const lead = (p: V2Project) => p.cat.split(' · ')[0];
const rest = (p: V2Project) => p.cat.split(' · ').slice(1).join(' · ') || p.cat;

function Media({ p, sizes }: { p: V2Project; sizes: string }) {
  const cover = COVERS[p.slug];
  return (
    <span className="v2-ed-media" style={{ background: plate(p.accent) }}>
      {cover && <Image src={cover} alt="" fill sizes={sizes} className="v2-ed-img" />}
    </span>
  );
}

/* ── Index ─────────────────────────────────────────────────────────── */

function GridTile({ p, i }: { p: V2Project; i: number }) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  const onMove = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.width;
    el.style.setProperty('--rx', `${(0.5 - y) * 6}deg`);
    el.style.setProperty('--ry', `${(x - 0.5) * 6}deg`);
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <Link
      ref={ref}
      href={`/work/${p.slug}`}
      className="v2-ed-tile"
      style={{ ['--i' as string]: i }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      data-cursor="hover"
    >
      <span className="v2-ed-frame">
        <Media p={p} sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw" />
        <span className="v2-ed-tag">{lead(p)}</span>
        <span className="v2-ed-view" aria-hidden="true">View</span>
      </span>
      <span className="v2-ed-cap">
        <span className="v2-ed-title">{p.name}</span>
        <span className="v2-ed-meta">{rest(p)}, {p.year}</span>
      </span>
    </Link>
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

function Space({ items }: { items: V2Project[] }) {
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
      const wide = stage.clientWidth < 700 ? 0.33 : 0.2; // more room on phones
      const R = Math.min(stage.clientWidth * wide, stage.clientHeight * 0.3) * (0.04 + 0.96 * open);
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
        el.style.opacity = String(0.3 + depth * 0.7);
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
      <span className="v2-ed-side v2-ed-side--l">Thu Ta Soe</span>
      <span className="v2-ed-side v2-ed-side--r">Senior Creative Designer</span>

      {items.map((p, i) => (
        <Link
          key={p.slug}
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
            <Media p={p} sizes="96px" />
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
            <span>{pad2(items.length)}</span> Projects <em>scroll or drag to turn</em>
          </>
        )}
      </p>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function WorkEditorial() {
  // the sphere is the first thing you see, like the reference's home
  const [view, setView] = useState<View>('space');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(VIEW_KEY);
      if (saved === 'index' || saved === 'space') setView(saved);
    } catch {}
  }, []);

  const pick = (v: View) => {
    setView(v);
    try { localStorage.setItem(VIEW_KEY, v); } catch {}
  };

  return (
    <section className={`v2-ed v2-ed--${view}`}>
      <header className="v2-ed-head">
        <p className="v2-ed-kicker">Selected work · {pad2(v2Work.length)}</p>
        <h1 className="v2-ed-h1">
          Ten projects across <em>campaign, motion and product design</em>
        </h1>
        <div className="v2-ed-toggle" role="group" aria-label="Work view">
          {(['space', 'index'] as View[]).map((v, i) => (
            <button
              key={v}
              type="button"
              className="v2-ed-toggle-btn"
              aria-pressed={view === v}
              onClick={() => pick(v)}
              data-cursor="hover"
            >
              {v === 'space' ? 'Space' : 'Index'}
              <sup>{i + 1}</sup>
            </button>
          ))}
        </div>
      </header>

      {view === 'index' ? (
        <div className="v2-ed-grid">
          {v2Work.map((p, i) => (
            <GridTile key={p.slug} p={p} i={i} />
          ))}
        </div>
      ) : (
        <Space items={v2Work} />
      )}
    </section>
  );
}
