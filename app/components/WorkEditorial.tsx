"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { plate, v2Work, type V2Project } from '@/lib/v2content';

/**
 * Work (/work) — an interactive ring gallery in the manner of cipher.tv:
 * the projects (plus extra real stills) as overlapping landscape cards on
 * a slowly turning ring that fills the screen.
 *
 * Scroll (either way) or drag turns the ring. Hovering a card lifts it in
 * full colour while every other card drops back to a dim greyscale, and
 * its number and title appear at the foot. Clicking draws the whole ring
 * into the centre before the page transition takes over.
 *
 * Plain DOM + transforms, no WebGL, so every card is a real link
 * (keyboard and screen-reader reachable).
 */

const COVERS: Record<string, string> = {
  'sting-nightlife-repositioning': '/case-studies/sting-night-life/thematic-kv.png',
};

const pad2 = (n: number) => String(n).padStart(2, '0');
const pad3 = (n: number) => String(n).padStart(3, '0');
const rest = (p: V2Project) => p.cat.split(' · ').slice(1).join(' · ') || p.cat;

function Media({ p, sizes, src }: { p: V2Project; sizes: string; src?: string }) {
  const cover = src ?? COVERS[p.slug];
  return (
    <span className="v2-ed-media" style={{ background: plate(p.accent) }}>
      {cover && <Image src={cover} alt="" fill sizes={sizes} className="v2-ed-img" />}
    </span>
  );
}

/* ── Ring ──────────────────────────────────────────────────────────── */

/** One card on the ring: a project, optionally showing one of its stills. */
type Card = { key: string; p: V2Project; src?: string };

const STING_STILLS = ['product-kv.png', 'event-poster.png', 'kv-qr-code.png', 'slide-1.jpg', 'slide-2.jpg', 'slide-3.jpg'];

/** Every project once, then the extra real stills that exist (all STING for now). */
function buildCards(): Card[] {
  const cards: Card[] = v2Work.map((p) => ({ key: p.slug, p }));
  const sting = v2Work.find((p) => p.slug === 'sting-nightlife-repositioning');
  if (sting) STING_STILLS.forEach((f) => cards.push({ key: `sting-${f}`, p: sting, src: `/case-studies/sting-night-life/${f}` }));
  // interleave so the STING stills spread round the ring instead of clumping
  const out: Card[] = [];
  const base = cards.slice(0, v2Work.length), extra = cards.slice(v2Work.length);
  base.forEach((c, i) => { out.push(c); if (i % 2 === 1 && extra.length) out.push(extra.shift()!); });
  return out.concat(extra);
}

const EXIT_MS = 620;

function Ring({ cards }: { cards: Card[] }) {
  const items = cards.map((c) => c.p);
  const n = cards.length;
  const stageRef = useRef<HTMLDivElement | null>(null);
  const nodes = useRef<(HTMLAnchorElement | null)[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [leaving, setLeaving] = useState(false);
  const s = useRef({
    rot: -0.6, v: 0, born: 0, exit: 0, last: 0,
    hold: false, drag: false, moved: false, lx: 0, ly: 0,
    px: 0, py: 0, tpx: 0, tpy: 0, active: -1, pass: false,
  });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;

    const tick = (now: number) => {
      const st = s.current;
      if (!st.born) { st.born = now; st.last = now; }
      const dt = Math.min(3, (now - st.last) / 16.67);
      st.last = now;

      // opening: the cards start stacked in the centre and fan out into the ring;
      // leaving plays the same move backwards
      const o = reduced ? 1 : Math.min(1, (now - st.born) / 1400);
      const open = 1 - Math.pow(1 - o, 4);
      const x = st.exit ? Math.min(1, (now - st.exit) / EXIT_MS) : 0;
      const close = x * x * (3 - 2 * x);
      const spread = (0.03 + 0.97 * open) * (1 - close);

      const w = stage.clientWidth, h = stage.clientHeight;
      const narrow = w < 700;
      const Rx = (narrow ? w * 0.27 : Math.min(w * 0.3, h * 0.52)) * spread;
      const Ry = (narrow ? h * 0.25 : h * 0.27) * spread;

      st.rot += ((reduced || st.hold || st.drag ? 0 : 0.0014) + st.v + (1 - open) * 0.035 + close * 0.05) * dt;
      st.v *= Math.pow(0.94, dt);
      st.px += (st.tpx - st.px) * 0.06;
      st.py += (st.tpy - st.py) * 0.06;

      for (let i = 0; i < n; i++) {
        const el = nodes.current[i];
        if (!el) continue;
        const t = (i / n) * Math.PI * 2 + st.rot;
        // the ring leans toward the viewer at lower left, so cards swell as they pass it
        const near = Math.cos(t - Math.PI * 0.75);
        const k = (1 + 0.2 * near) * (1 - 0.55 * close);
        const px = Math.cos(t) * Rx + st.px * (10 + 8 * near);
        const py = Math.sin(t) * Ry + st.py * (10 + 8 * near);
        el.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%) scale(${k})`;
        el.style.opacity = String(Math.min(1, open * 1.4) * (1 - close));
        el.style.zIndex = String(i === st.active ? 400 : Math.round((near + 1) * 100));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      s.current.v += Math.max(-0.06, Math.min(0.06, (e.deltaY + e.deltaX) * 0.00022));
    };
    const onMove = (e: PointerEvent) => {
      const st = s.current;
      if (st.drag) {
        const dx = e.clientX - st.lx, dy = e.clientY - st.ly;
        if (Math.abs(dx) + Math.abs(dy) > 4) st.moved = true;
        // turn the ring the way the pointer pushes it, wherever it is grabbed
        const r = stage.getBoundingClientRect();
        const cx = e.clientX - (r.left + r.width / 2), cy = e.clientY - (r.top + r.height * 0.53);
        const len = Math.max(60, Math.hypot(cx, cy));
        st.v = (cx * dy - cy * dx) / (len * len) * 0.9;
        st.lx = e.clientX; st.ly = e.clientY;
        return;
      }
      if (e.pointerType !== 'mouse' || reduced) return;
      const r = stage.getBoundingClientRect();
      st.tpx = (e.clientX - r.left) / r.width - 0.5;
      st.tpy = (e.clientY - r.top) / r.height - 0.5;
    };
    const onUp = () => { s.current.drag = false; };

    // Clicks are taken on window, ahead of the site's page transition: a drag
    // must not open a project, and a real click first draws the ring into
    // the centre, then hands the same click on to the transition.
    const onClick = (e: MouseEvent) => {
      const st = s.current;
      const link = (e.target as HTMLElement | null)?.closest?.('a.v2-ed-node') as HTMLAnchorElement | null;
      if (!link || !stage.contains(link)) return;
      if (st.pass) { st.pass = false; return; }
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      e.stopPropagation();
      if (st.moved) { st.moved = false; return; }
      if (st.exit) return;
      if (reduced) { st.pass = true; link.click(); return; }
      st.exit = performance.now();
      st.hold = false;
      setLeaving(true);
      window.setTimeout(() => { st.pass = true; link.click(); }, EXIT_MS - 60);
    };

    stage.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('click', onClick, true);
    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener('wheel', onWheel);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('click', onClick, true);
    };
  }, [n]);

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const st = s.current;
    st.drag = true; st.moved = false; st.lx = e.clientX; st.ly = e.clientY;
  };

  const show = (i: number | null) => {
    if (s.current.exit) return;
    s.current.hold = i !== null;
    s.current.active = i ?? -1;
    setActive(i);
  };
  const cur = active === null ? null : items[active];

  return (
    <div
      ref={stageRef}
      className={`v2-ed-space${active !== null ? ' has-active' : ''}${leaving ? ' is-leaving' : ''}`}
      onPointerDown={onDown}
      data-lenis-prevent
    >
      {cards.map(({ key, p, src }, i) => (
        <Link
          key={key}
          ref={(el) => { nodes.current[i] = el; }}
          href={`/work/${p.slug}`}
          className={`v2-ed-node${active === i ? ' is-active' : ''}`}
          aria-label={`${p.name} — ${p.cat}, ${p.year}`}
          onPointerEnter={() => show(i)}
          onPointerLeave={() => show(null)}
          onFocus={() => show(i)}
          onBlur={() => show(null)}
          draggable={false}
          data-cursor="hover"
        >
          <span className="v2-ed-node-card">
            <Media p={p} src={src} sizes="(max-width: 700px) 45vw, 340px" />
          </span>
        </Link>
      ))}

      <span className="v2-ed-index" aria-hidden="true">{cur ? pad3(active! + 1) : ''}</span>

      <p className="v2-ed-counter" aria-live="polite">
        {cur ? (
          <>
            {cur.name} <em>{rest(cur)}, {cur.year}</em>
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
      <Ring cards={cards} />
    </section>
  );
}
