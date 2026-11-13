"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { plate, v2Work, type V2Project } from '@/lib/v2content';
import ArrowUpRight from './ArrowUpRight';

/**
 * Work (/work) — the projects as a loose cloud of portrait thumbnails
 * hanging in the middle of an otherwise empty page. Every card faces
 * the viewer; nothing turns. Depth is told by size alone: near cards are
 * large, far ones small, and they overlap where they happen to.
 *
 * The cloud is alive but quiet. Each card drifts a few pixels on its own
 * slow cycle, the whole field leans against the pointer (near cards move
 * further than far ones), and scroll or drag travels through the depth:
 * cards come forward, pass, and return small at the back.
 *
 * With a mouse, hovering a card lifts it and names it at the foot, and a
 * click opens it. By touch there is no hover, so the first tap names the
 * card and the foot line becomes the way in; a second tap also opens it.
 *
 * Plain DOM and transforms: every card is a real link. The same layout
 * serves phone and desktop, sized off the viewport.
 */

const COVERS: Record<string, string> = {
  'sting-nightlife-repositioning': '/case-studies/sting-night-life/thematic-kv.png',
};

const pad2 = (n: number) => String(n).padStart(2, '0');

/* ── Cards ─────────────────────────────────────────────────────────── */

/** One thumbnail in the cloud: a project, optionally showing one of its stills. */
type Card = { key: string; p: V2Project; src?: string };

const STING_STILLS = ['product-kv.png', 'event-poster.png', 'kv-qr-code.png', 'slide-1.jpg', 'slide-3.jpg'];

/** Every project once, then the extra real stills that exist (all STING for now), spread through. */
function buildCards(): Card[] {
  const base: Card[] = v2Work.map((p) => ({ key: p.slug, p }));
  const sting = v2Work.find((p) => p.slug === 'sting-nightlife-repositioning');
  const extra: Card[] = sting
    ? STING_STILLS.map((f) => ({ key: `sting-${f}`, p: sting, src: `/case-studies/sting-night-life/${f}` }))
    : [];
  const out: Card[] = [];
  base.forEach((c, i) => { out.push(c); if (i % 2 === 1 && extra.length) out.push(extra.shift()!); });
  return out.concat(extra);
}

function Thumb({ card, index }: { card: Card; index: number }) {
  const { p, src } = card;
  const cover = src ?? COVERS[p.slug];
  return (
    <span className="v2-ed-media" style={{ background: plate(p.accent) }}>
      {cover ? (
        <Image src={cover} alt="" fill sizes="(max-width: 700px) 34vw, 220px" className="v2-ed-img" />
      ) : (
        // no artwork yet: the plate carries the project's own name, set small,
        // so it reads as a cover rather than a blank
        <span className="v2-ed-plate">
          <span>{pad2(index + 1)}</span>
          <span>
            {p.nameLines.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </span>
        </span>
      )}
    </span>
  );
}

/* ── Cloud ─────────────────────────────────────────────────────────── */

const frac = (v: number) => v - Math.floor(v);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (a: number, b: number, v: number) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const hash = (i: number, k: number) => frac(Math.sin(i * 127.1 + k * 311.7) * 43758.5453);

/** Where the travel was left, so coming back to /work picks it up rather than restarting. */
let savedTravel: number | null = null;

function Cloud({ cards }: { cards: Card[] }) {
  const n = cards.length;
  const stageRef = useRef<HTMLDivElement | null>(null);
  const nodes = useRef<(HTMLAnchorElement | null)[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [tapped, setTapped] = useState(false);   // chosen by touch: the foot line becomes the way in
  const s = useRef({
    travel: 0, target: 0, v: 0, auto: 0, born: 0, last: 0, resume: false,
    hold: false, drag: false, moved: false, touch: false, lx: 0, ly: 0,
    px: 0, py: 0, tpx: 0, tpy: 0, active: -1,
  });

  // Each card's fixed place: scattered over a disc (a sunflower spiral, then
  // knocked off-grid), with its own depth and its own slow drift. Fixed per
  // card, not random per load, so the page is the same page every visit.
  const seat = useMemo(
    () => Array.from({ length: n }, (_, i) => {
      const r = Math.sqrt((i + 0.6) / n), a = i * 2.39996 + 0.5;
      return {
        x: Math.cos(a) * r + (hash(i, 1) - 0.5) * 0.24,
        y: Math.sin(a) * r + (hash(i, 2) - 0.5) * 0.24,
        z: ((i * 5 + 2) % n) / n,
        ph: hash(i, 3) * Math.PI * 2,
        sp: 0.25 + hash(i, 4) * 0.3,
      };
    }),
    [n],
  );

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const st = s.current;
    if (savedTravel !== null) { st.travel = savedTravel; st.target = savedTravel; st.resume = true; }
    const shown: boolean[] = new Array(n).fill(true);
    let raf = 0, sized = 0;

    const tick = (now: number) => {
      const w = stage.clientWidth, h = stage.clientHeight;
      if (!w) { raf = requestAnimationFrame(tick); return; }
      if (!st.born) { st.born = now; st.last = now; }
      const dt = Math.min(3, (now - st.last) / 16.67);
      st.last = now;

      // the field is a disc sized off the height, held in on narrow screens
      const RX = Math.min(w * 0.36, h * 0.36), RY = h * (w < 700 ? 0.3 : 0.33);
      if (sized !== w * 10000 + h) {
        sized = w * 10000 + h;
        stage.style.setProperty('--cw', `${Math.max(64, Math.min(h * 0.105, w * 0.24)).toFixed(1)}px`);
      }

      // input moves a target; the travel glides after it and never snaps
      st.auto += ((reduced || st.hold || st.drag ? 0 : 0.00011) - st.auto) * Math.min(1, 0.05 * dt);
      st.target += (st.auto + st.v) * dt;
      st.v *= Math.pow(0.95, dt);
      const k = 1 - Math.pow(1 - 0.085, dt);
      st.travel += (st.target - st.travel) * k;
      st.px += (st.tpx - st.px) * 0.06 * dt;
      st.py += (st.tpy - st.py) * 0.06 * dt;

      const t = (now - st.born) / 1000;
      for (let i = 0; i < n; i++) {
        const el = nodes.current[i];
        if (!el) continue;
        const q = seat[i];

        // arriving: the cards start as one small stack and open out in turn
        const o = reduced || st.resume ? 1 : clamp01((now - st.born - i * 40) / 1500);
        const e = 1 - Math.pow(1 - o, 4);

        const z = frac(q.z + st.travel);                   // 0 far … 1 passing
        const reach = (0.8 + 0.42 * z) * e;                // nearer cards sit further out
        const lean = 6 + 44 * z;                           // …and lean further against the pointer
        const bob = reduced ? 0 : Math.sin(t * q.sp + q.ph) * (3 + 5 * z);
        const x = q.x * RX * reach - st.px * lean;
        const y = q.y * RY * reach - st.py * lean + bob;
        const size = (0.52 + 0.9 * Math.pow(z, 1.25)) * (0.35 + 0.65 * e);
        // far cards fade up out of the page, near ones fade as they pass
        const alpha = smooth(0, 0.09, z) * (1 - smooth(0.9, 1, z)) * Math.min(1, e * 1.6);

        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${size.toFixed(4)})`;
        el.style.opacity = alpha.toFixed(3);
        el.style.zIndex = st.active === i ? '400' : String(1 + Math.round(z * 200));
        const on = alpha > 0.5;
        if (on !== shown[i]) { shown[i] = on; el.style.pointerEvents = on ? '' : 'none'; }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      st.target += Math.max(-0.09, Math.min(0.09, (e.deltaY + e.deltaX) * 0.0003));
    };
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      if (st.drag) {
        const dx = e.clientX - st.lx, dy = e.clientY - st.ly;
        if (Math.abs(dx) + Math.abs(dy) > 5) st.moved = true;
        // pushing up or left travels forward, wherever the field is held
        const step = -(dy + dx * 0.6) / Math.max(320, r.height) * 0.9;
        st.target += step;
        st.v = step * 0.3;
        st.lx = e.clientX; st.ly = e.clientY;
      }
      if (reduced) return;
      st.tpx = (e.clientX - r.left) / r.width - 0.5;
      st.tpy = (e.clientY - r.top) / r.height - 0.5;
    };
    const onUp = (e: PointerEvent) => {
      st.drag = false;
      // a finger leaves nothing to lean against
      if (e.pointerType !== 'mouse') { st.tpx = 0; st.tpy = 0; }
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
        if (!drag) { st.active = i; st.hold = true; setTapped(true); setActive(i); }
      }
    };

    stage.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('click', onClick, true);
    return () => {
      savedTravel = st.travel;
      cancelAnimationFrame(raf);
      stage.removeEventListener('wheel', onWheel);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('click', onClick, true);
    };
  }, [n, seat]);

  const show = (i: number | null) => {
    s.current.hold = i !== null;
    s.current.active = i ?? -1;
    setActive(i);
  };

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const st = s.current;
    st.touch = e.pointerType !== 'mouse';
    st.drag = true; st.moved = false; st.lx = e.clientX; st.ly = e.clientY;
    // touching empty page lets go of the chosen card
    if (st.touch && !(e.target as HTMLElement).closest('a')) { setTapped(false); show(null); }
  };

  const cur = active === null ? null : cards[active].p;
  const line = cur && (
    <>
      <span>{pad2(v2Work.indexOf(cur) + 1)}</span> {cur.name} <em>{cur.cat}, {cur.year}</em>
    </>
  );

  return (
    <div
      ref={stageRef}
      className={`v2-ed-space${active !== null ? ' has-active' : ''}`}
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
            <Thumb card={card} index={v2Work.indexOf(card.p)} />
          </span>
        </Link>
      ))}

      {/* one quiet line at the foot: the count at rest, the chosen project otherwise */}
      <p className="v2-ed-counter" aria-live="polite">
        {cur && tapped ? (
          <Link href={`/work/${cur.slug}`} className="v2-ed-open">
            <span className="v2-ed-open-text">{line}</span>
            <span className="v2-ed-open-knob"><ArrowUpRight /></span>
          </Link>
        ) : cur ? (
          line
        ) : (
          <>
            <span>{pad2(v2Work.length)}</span> Projects <em>scroll or drag to move through</em>
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
      <Cloud cards={cards} />
    </section>
  );
}
