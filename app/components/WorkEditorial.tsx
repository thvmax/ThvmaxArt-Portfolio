"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { plate, v2Work, type V2Project } from '@/lib/v2content';
import ArrowUpRight from './ArrowUpRight';

/**
 * Work (/work) — the projects as a cluster of portrait thumbnails hung
 * on an invisible sphere in the middle of an otherwise empty page.
 *
 * Every card faces the viewer at all times; only its place on the sphere
 * changes. Near cards are large and sit in front, far ones small and
 * behind. Dragging turns the whole cluster like a trackball, in any
 * direction, and it glides to rest when let go. At rest nothing moves
 * except the thumbnails that are videos, which play.
 *
 * The cluster leans a few degrees toward the pointer. With a mouse, the
 * card under the pointer is named at the foot, and a
 * click opens it. By touch there is no hover, so the first tap names the
 * card and the foot line becomes the way in; a second tap also opens it.
 *
 * Plain DOM and transforms: every card is a real link. The same layout
 * serves phone and desktop, sized off the viewport.
 */

const COVERS: Record<string, string> = {
  'sting-nightlife-repositioning': '/case-studies/sting-night-life/thematic-kv.png',
};

/* ── Cards ─────────────────────────────────────────────────────────── */

/** One thumbnail in the cluster: a project, optionally showing one of its stills or films. */
type Card = { key: string; p: V2Project; src?: string; video?: string };

const STING = '/case-studies/sting-night-life/';
const STING_EXTRA: Pick<Card, 'src' | 'video'>[] = [
  { video: 'hero-video.mp4' },
  { src: 'product-kv.png' },
  { src: 'event-poster.png' },
  { video: 'Header-Video.mp4' },
  { src: 'kv-qr-code.png' },
  { src: 'slide-1.jpg' },
  { src: 'slide-3.jpg' },
];

/** Every project once, then the extra real stills and films that exist (all STING for now), spread through. */
function buildCards(): Card[] {
  const base: Card[] = v2Work.map((p) => ({ key: p.slug, p }));
  const sting = v2Work.find((p) => p.slug === 'sting-nightlife-repositioning');
  const extra: Card[] = sting
    ? STING_EXTRA.map((x) => ({
        key: `sting-${x.src ?? x.video}`,
        p: sting,
        src: x.src && STING + x.src,
        video: x.video && STING + x.video,
      }))
    : [];
  const out: Card[] = [];
  base.forEach((c, i) => { out.push(c); if (extra.length) out.push(extra.shift()!); if (i > 6 && extra.length) out.push(extra.shift()!); });
  return out.concat(extra);
}

function Thumb({ card }: { card: Card }) {
  const { p, src, video } = card;
  const cover = src ?? (video ? undefined : COVERS[p.slug]);
  return (
    <span className="v2-ed-media" style={{ background: plate(p.accent) }}>
      {video ? (
        <video className="v2-ed-img" src={video} autoPlay muted loop playsInline preload="metadata" />
      ) : cover ? (
        <Image src={cover} alt="" fill sizes="(max-width: 700px) 34vw, 220px" className="v2-ed-img" />
      ) : null}
    </span>
  );
}

/* ── Cloud ─────────────────────────────────────────────────────────── */

const frac = (v: number) => v - Math.floor(v);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const hash = (i: number, k: number) => frac(Math.sin(i * 127.1 + k * 311.7) * 43758.5453);

type Mat = [number, number, number, number, number, number, number, number, number];

/** Turn `m` by `a` about the screen's vertical axis and `b` about its horizontal one. */
function turn(m: Mat, a: number, b: number): Mat {
  const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
  // T = Ry(a) · Rx(b), then T · m
  const t = [ca, sa * sb, sa * cb, 0, cb, -sb, -sa, ca * sb, ca * cb];
  const o = new Array(9) as Mat;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    o[r * 3 + c] = t[r * 3] * m[c] + t[r * 3 + 1] * m[3 + c] + t[r * 3 + 2] * m[6 + c];
  }
  return o;
}

/** Thousands of small turns drift; square the matrix back up now and then. */
function square(m: Mat): Mat {
  let [a, b, c, d, e, f] = m;
  let l = Math.hypot(a, b, c); a /= l; b /= l; c /= l;
  const dot = a * d + b * e + c * f; d -= dot * a; e -= dot * b; f -= dot * c;
  l = Math.hypot(d, e, f); d /= l; e /= l; f /= l;
  return [a, b, c, d, e, f, b * f - c * e, c * d - a * f, a * e - b * d];
}

const START: Mat = turn([1, 0, 0, 0, 1, 0, 0, 0, 1], 0.5, -0.35);
const EYE = 3;        // viewer's distance, in sphere radii: sets how much nearer cards grow

/** How the cluster was left, so coming back to /work picks it up rather than restarting. */
let savedTurn: Mat | null = null;

function Cloud({ cards }: { cards: Card[] }) {
  const n = cards.length;
  const stageRef = useRef<HTMLDivElement | null>(null);
  const nodes = useRef<(HTMLAnchorElement | null)[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [tapped, setTapped] = useState(false);   // chosen by touch: the foot line becomes the way in
  const s = useRef({
    m: START, ax: 0, ay: 0, vx: 0, vy: 0, frames: 0, born: 0, resume: false,
    drag: false, moved: false, touch: false, lx: 0, ly: 0, active: -1,
    px: 0, py: 0, tpx: 0, tpy: 0,
  });

  // Each card's fixed seat on the unit sphere: evenly spread (a Fibonacci
  // lattice), then knocked a little off it and in or out, so the cluster
  // reads as scattered rather than plotted. Fixed per card, not random per load.
  const seat = useMemo(
    () => Array.from({ length: n }, (_, i) => {
      const y = 1 - (2 * (i + 0.5)) / n + (hash(i, 1) - 0.5) * 0.16;
      const r = Math.sqrt(Math.max(0, 1 - y * y)), a = i * 2.39996 + (hash(i, 2) - 0.5) * 0.5;
      const d = 0.82 + hash(i, 3) * 0.24;
      return [Math.cos(a) * r * d, y * d, Math.sin(a) * r * d] as const;
    }),
    [n],
  );

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const st = s.current;
    if (savedTurn) { st.m = savedTurn; st.resume = true; }
    let raf = 0, sized = 0, RX = 0, RY = 0, lastKey = '';

    const tick = (now: number) => {
      const w = stage.clientWidth, h = stage.clientHeight;
      if (!w) { raf = requestAnimationFrame(tick); return; }
      if (!st.born) st.born = now;

      if (sized !== w * 10000 + h) {
        sized = w * 10000 + h;
        // The cluster keeps clear of the nav above and the line at the foot,
        // and is spread wider than it is tall where there is room for it.
        const cw = Math.max(52, Math.min(h * 0.086, w * 0.155));
        const top = w < 700 ? 78 : 84, foot = w < 700 ? 104 : 84;
        const room = Math.max(160, h - top - foot);
        RY = Math.max(60, (room / 2 - cw * 0.85) / 1.06);
        RX = Math.min(w * 0.38, RY * 1.22);
        stage.style.setProperty('--cw', `${cw.toFixed(1)}px`);
        stage.style.setProperty('--cy', `${(top + room / 2).toFixed(1)}px`);
        lastKey = '';
      }

      // the hand's movement is paid out a share per frame, so the cluster
      // follows smoothly and runs on a little after it is let go
      const dx = st.ax * 0.16, dy = st.ay * 0.16;
      st.ax -= dx; st.ay -= dy;
      if (Math.abs(st.ax) + Math.abs(st.ay) < 0.05) { st.ax = 0; st.ay = 0; }
      if (Math.abs(dx) + Math.abs(dy) > 0.008) {
        st.m = turn(st.m, dx / RX, -dy / RY);
        if (++st.frames % 240 === 0) st.m = square(st.m);
      }

      // nothing to redraw once it has opened and come to rest
      const o = reduced || st.resume ? 1 : clamp01((now - st.born) / 1900);
      // the whole cluster leans a few degrees toward the pointer, and back
      st.px += (st.tpx - st.px) * 0.07; st.py += (st.tpy - st.py) * 0.07;
      if (Math.abs(st.tpx - st.px) + Math.abs(st.tpy - st.py) < 0.0008) { st.px = st.tpx; st.py = st.tpy; }
      const key = o < 1 ? '' : st.m.map((v) => v.toFixed(4)).join() + st.px.toFixed(3) + st.py.toFixed(3);
      if (key && key === lastKey) { raf = requestAnimationFrame(tick); return; }
      lastKey = key;

      const m = turn(st.m, st.px * 0.22, -st.py * 0.16);
      for (let i = 0; i < n; i++) {
        const el = nodes.current[i];
        if (!el) continue;
        const [px, py, pz] = seat[i];
        const x = m[0] * px + m[1] * py + m[2] * pz;
        const y = m[3] * px + m[4] * py + m[5] * pz;
        const z = m[6] * px + m[7] * py + m[8] * pz;    // +1 nearest … −1 furthest

        // arriving: the cards open out from one small stack, in turn
        const oi = reduced || st.resume ? 1 : clamp01((now - st.born - i * 35) / 1300);
        const e = 1 - Math.pow(1 - oi, 4);

        const k = EYE / (EYE - z);                       // perspective: nearer is larger and further out
        el.style.transform = `translate3d(${(x * RX * k * e).toFixed(1)}px, ${(y * RY * k * e).toFixed(1)}px, 0) translate(-50%, -50%) scale(${(k * (0.3 + 0.7 * e)).toFixed(4)})`;
        el.style.opacity = Math.min(1, e * 1.6).toFixed(3);
        el.style.zIndex = String(100 + Math.round(z * 90));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      st.ax -= Math.max(-120, Math.min(120, e.deltaX)) * 0.6;
      st.ay -= Math.max(-120, Math.min(120, e.deltaY)) * 0.6;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && !reduced) {
        const r = stage.getBoundingClientRect();
        st.tpx = (e.clientX - r.left) / r.width - 0.5;
        st.tpy = (e.clientY - r.top) / r.height - 0.5;
      }
      if (!st.drag) return;
      const dx = e.clientX - st.lx, dy = e.clientY - st.ly;
      if (Math.abs(dx) + Math.abs(dy) > 5) st.moved = true;
      st.ax += dx; st.ay += dy;
      st.vx += (dx - st.vx) * 0.5; st.vy += (dy - st.vy) * 0.5;
      st.lx = e.clientX; st.ly = e.clientY;
    };
    const onUp = () => {
      if (!st.drag) return;
      st.drag = false;
      // a throw carries on a little; a still release stops where it is
      if (st.moved) { st.ax += st.vx * 6; st.ay += st.vy * 6; }
      st.vx = 0; st.vy = 0;
    };

    // Taken on window, ahead of the site's page transition. A drag must not
    // open a project; and by touch the first tap only chooses the card.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest?.('a.v2-ed-node') as HTMLElement | null;
      if (!link || !stage.contains(link)) return;
      const i = Number(link.dataset.i);
      const drag = st.moved;
      st.moved = false;
      if (drag || (st.touch && st.active !== i)) {
        e.preventDefault();
        e.stopPropagation();
        if (!drag) { st.active = i; setTapped(true); setActive(i); }
      }
    };

    stage.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('click', onClick, true);
    return () => {
      savedTurn = st.m;
      cancelAnimationFrame(raf);
      stage.removeEventListener('wheel', onWheel);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('click', onClick, true);
    };
  }, [n, seat]);

  const show = (i: number | null) => {
    s.current.active = i ?? -1;
    setActive(i);
  };

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const st = s.current;
    st.touch = e.pointerType !== 'mouse';
    st.drag = true; st.moved = false; st.lx = e.clientX; st.ly = e.clientY; st.vx = 0; st.vy = 0;
    // touching empty page lets go of the chosen card
    if (st.touch && !(e.target as HTMLElement).closest('a')) { setTapped(false); show(null); }
  };

  const cur = active === null ? null : cards[active].p;
  const line = cur && (
    <>
      {cur.name} <em>{cur.cat}</em>
    </>
  );

  return (
    <div
      ref={stageRef}
      className={`v2-ed-space${tapped && active !== null ? ' is-tapped' : ''}`}
      onPointerDown={onDown}
      data-lenis-prevent
    >
      {cards.map((card, i) => (
        <Link
          key={card.key}
          ref={(el) => { nodes.current[i] = el; }}
          href={`/work/${card.p.slug}`}
          data-i={i}
          className={`v2-ed-node${active === i ? ' is-active' : ''}`}
          aria-label={`${card.p.name} — ${card.p.cat}, ${card.p.year}`}
          onPointerEnter={(e) => { if (e.pointerType === 'mouse') show(i); }}
          onPointerLeave={(e) => { if (e.pointerType === 'mouse') show(null); }}
          // keyboard focus only: a tap also focuses the link, and must not count as choosing it
          onFocus={(e) => { if (e.currentTarget.matches(':focus-visible') && !s.current.touch) show(i); }}
          onBlur={() => { if (!s.current.touch) show(null); }}
          draggable={false}
          data-cursor="hover"
        >
          <span className="v2-ed-node-card">
            <Thumb card={card} />
          </span>
        </Link>
      ))}

      {/* one quiet line at the foot, only while a card is chosen: its name, then what it is */}
      <p className="v2-ed-counter" aria-live="polite">
        {cur && tapped ? (
          <Link href={`/work/${cur.slug}`} className="v2-ed-open">
            <span className="v2-ed-open-text">{line}</span>
            <span className="v2-ed-open-knob"><ArrowUpRight /></span>
          </Link>
        ) : (
          line
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
      <Cloud cards={cards} />
    </section>
  );
}
