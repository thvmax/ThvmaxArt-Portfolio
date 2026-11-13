"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { plate, v2Work, v2WorkPage, type V2Project } from '@/lib/v2content';

/**
 * Work (/work) — the projects as a globe: tiles laid over a sphere in
 * rows of latitude, the whole thing turning slowly on a tilted axis like
 * the earth. Only the near side shows; tiles come round the limb, face
 * you, and go.
 *
 * Scroll or drag spins it (drag up and down tips it a little). Input
 * moves a target and the globe glides after it. Hovering a tile lifts it
 * off the surface in full colour while the rest fall back, and its
 * number and title appear at the foot. A click goes straight to the
 * site's page transition; coming back, the globe is where it was left.
 *
 * Plain DOM + CSS 3D, no WebGL: every tile is a real link, and only one
 * transform (the globe's) is written per frame.
 *
 * On a phone the globe gives way to an editorial index (see Index).
 */

const COVERS: Record<string, string> = {
  'sting-nightlife-repositioning': '/case-studies/sting-night-life/thematic-kv.png',
};

const pad2 = (n: number) => String(n).padStart(2, '0');

function Media({ p, sizes, src }: { p: V2Project; sizes: string; src?: string }) {
  const cover = src ?? COVERS[p.slug];
  return (
    <span className="v2-ed-media" style={{ background: plate(p.accent) }}>
      {cover && <Image src={cover} alt="" fill sizes={sizes} className="v2-ed-img" />}
    </span>
  );
}

/* ── Globe ──────────────────────────────────────────────────────────── */

/** One picture on the globe: a project, optionally showing one of its stills. */
type Card = { key: string; p: V2Project; src?: string };

const STING_STILLS = ['product-kv.png', 'event-poster.png', 'kv-qr-code.png', 'slide-1.jpg'];

/** Every project once, then the extra real stills that exist (all STING for now). */
function buildCards(): Card[] {
  const cards: Card[] = v2Work.map((p) => ({ key: p.slug, p }));
  const sting = v2Work.find((p) => p.slug === 'sting-nightlife-repositioning');
  if (sting) STING_STILLS.forEach((f) => cards.push({ key: `sting-${f}`, p: sting, src: `/case-studies/sting-night-life/${f}` }));
  // interleave so the STING stills spread over the globe instead of clumping
  const out: Card[] = [];
  const base = cards.slice(0, v2Work.length), extra = cards.slice(v2Work.length);
  base.forEach((c, i) => { out.push(c); if (i % 2 === 1 && extra.length) out.push(extra.shift()!); });
  return out.concat(extra);
}

/** Where the globe was left, so coming back to /work picks it up rather than restarting. */
let savedRot: number | null = null;

/** Rows of latitude (degrees) and how many tiles each carries — fewer toward the poles. */
const EQUATOR = 14;
const ROWS: [number, number][] = [[56, 8], [42, 10], [28, 12], [14, 14], [0, EQUATOR], [-14, 14], [-28, 12], [-42, 10], [-56, 8]];

type Tile = { card: Card; lat: number; lon: number; first: boolean };

function buildTiles(cards: Card[]): Tile[] {
  const seen = new Set<string>();
  const tiles: Tile[] = [];
  let t = 0;
  ROWS.forEach(([lat, count], r) => {
    for (let c = 0; c < count; c++, t++) {
      // stepped so the same picture never sits beside or above itself
      const card = cards[(t * 5 + r * 3) % cards.length];
      // every other row sits half a step round, like brickwork
      const lon = ((c + (r % 2 ? 0.5 : 0)) / count) * 360;
      const first = !seen.has(card.p.slug);
      seen.add(card.p.slug);
      tiles.push({ card, lat, lon, first });
    }
  });
  return tiles;
}

function Globe({ cards }: { cards: Card[] }) {
  const tiles = useMemo(() => buildTiles(cards), [cards]);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const globeRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const s = useRef({
    rot: 20, target: 20, tip: 0, tipTarget: 0, v: 0, auto: 0,
    born: 0, last: 0, resume: false, hold: false, drag: false, moved: false, lx: 0, ly: 0,
  });

  useEffect(() => {
    const stage = stageRef.current, globe = globeRef.current;
    if (!stage || !globe) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const st = s.current;
    if (savedRot !== null) { st.rot = savedRot; st.target = savedRot; st.resume = true; }
    let raf = 0, sized = 0;

    const tick = (now: number) => {
      const w = stage.clientWidth, h = stage.clientHeight;
      // hidden (the phone layout is showing instead): idle until it is back
      if (!w) { st.born = 0; raf = requestAnimationFrame(tick); return; }
      if (!st.born) { st.born = now; st.last = now; }
      const dt = Math.min(3, (now - st.last) / 16.67);
      st.last = now;

      if (sized !== w * 10000 + h) {
        sized = w * 10000 + h;
        const R = Math.min(w * 0.28, h * 0.37);
        stage.style.setProperty('--r', `${R.toFixed(1)}px`);
        stage.style.setProperty('--tw', `${(((2 * Math.PI * R) / EQUATOR) * 0.9).toFixed(1)}px`);
      }

      // arriving: the globe comes up to size out of a faster spin that runs down
      const o = reduced ? 1 : Math.min(1, (now - st.born) / (st.resume ? 900 : 1800));
      const eased = 1 - Math.pow(1 - o, 4);

      // the idle turn eases off and back on, so hovering never jolts it
      st.auto += ((reduced || st.hold || st.drag ? 0 : 0.045) - st.auto) * Math.min(1, 0.05 * dt);
      st.target += (st.auto + st.v + (st.resume ? 0 : (1 - eased) * 1.6)) * dt;
      st.v *= Math.pow(0.95, dt);
      const k = 1 - Math.pow(1 - 0.085, dt);
      st.rot += (st.target - st.rot) * k;
      st.tip += (st.tipTarget - st.tip) * k;

      const scale = st.resume ? 0.94 + 0.06 * eased : 0.8 + 0.2 * eased;
      globe.style.transform = `scale(${scale.toFixed(4)}) rotateX(${st.tip.toFixed(2)}deg) rotateY(${st.rot.toFixed(2)}deg)`;
      globe.style.opacity = String(Math.min(1, eased * 1.5));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // straight onto the target: a notch of the wheel is a fixed turn, eased in
      st.target += Math.max(-28, Math.min(28, (e.deltaY + e.deltaX) * 0.06));
    };
    const onMove = (e: PointerEvent) => {
      if (!st.drag) return;
      const dx = e.clientX - st.lx, dy = e.clientY - st.ly;
      if (Math.abs(dx) + Math.abs(dy) > 4) st.moved = true;
      const per = 110 / Math.max(320, stage.clientHeight); // degrees per pixel: the surface follows the hand
      st.target += dx * per;
      st.v = dx * per * 0.35;                               // and keeps a little of the throw
      st.tipTarget = Math.max(-24, Math.min(24, st.tipTarget - dy * per * 0.6));
      st.lx = e.clientX; st.ly = e.clientY;
    };
    const onUp = () => { st.drag = false; };

    // Taken on window, ahead of the site's page transition: a drag must not
    // open a project. A real click passes straight through to the transition.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest?.('a.v2-ed-node');
      if (!link || !stage.contains(link) || !st.moved) return;
      st.moved = false;
      e.preventDefault();
      e.stopPropagation();
    };

    stage.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('click', onClick, true);
    return () => {
      savedRot = st.rot;
      cancelAnimationFrame(raf);
      stage.removeEventListener('wheel', onWheel);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('click', onClick, true);
    };
  }, []);

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const st = s.current;
    st.drag = true; st.moved = false; st.lx = e.clientX; st.ly = e.clientY;
  };

  const show = (i: number | null) => {
    s.current.hold = i !== null;
    setActive(i);
  };
  const cur = active === null ? null : tiles[active].card.p;

  return (
    <div
      ref={stageRef}
      className={`v2-ed-space${active !== null ? ' has-active' : ''}`}
      onPointerDown={onDown}
      data-lenis-prevent
    >
      <div className="v2-ed-axis">
        <div className="v2-ed-globe" ref={globeRef}>
          {tiles.map(({ card: { p, src }, lat, lon, first }, i) => (
            <Link
              key={i}
              href={`/work/${p.slug}`}
              className={`v2-ed-node${active === i ? ' is-active' : ''}`}
              style={{ transform: `rotateY(${lon.toFixed(2)}deg) rotateX(${lat}deg) translateZ(var(--r))` }}
              aria-label={`${p.name} — ${p.cat}, ${p.year}`}
              // the globe repeats each project; only its first tile is in the tab order
              tabIndex={first ? undefined : -1}
              aria-hidden={first ? undefined : true}
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
        </div>
      </div>

      {/* one quiet line at the foot: the count at rest, the project under
          the pointer otherwise */}
      <p className="v2-ed-counter" aria-live="polite">
        {cur ? (
          <>
            <span>{pad2(v2Work.indexOf(cur) + 1)}</span> {cur.name} <em>{cur.cat}, {cur.year}</em>
          </>
        ) : (
          <>
            <span>{pad2(v2Work.length)}</span> Projects <em>scroll or drag to spin</em>
          </>
        )}
      </p>
    </div>
  );
}

/* ── Index (phone) ─────────────────────────────────────────────────── */

/**
 * The projects as a column of captioned plates, stepping left and right
 * down the page like a magazine contents spread. Each one rises into
 * place as it is scrolled to, its picture settling back from a slight
 * push-in; IntersectionObserver, transform and opacity only.
 */
function Index() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-rise]'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }),
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="v2-ed-list" ref={rootRef}>
      <header className="v2-ed-list-head" data-rise>
        <span className="v2-ed-kicker">{v2WorkPage.label}</span>
        <p className="v2-ed-list-title">
          {v2WorkPage.headingLead} <span>{v2WorkPage.headingItalic}</span>.
        </p>
        <p className="v2-ed-list-intro">{v2WorkPage.intro}</p>
      </header>

      <ol className="v2-ed-list-items">
        {v2Work.map((p, i) => (
          <li key={p.slug} className="v2-ed-item" data-rise>
            <Link href={`/work/${p.slug}`} aria-label={`${p.name} — ${p.cat}, ${p.year}`}>
              <span className="v2-ed-item-rule">
                <span>{pad2(i + 1)}</span>
                <span>{p.year}</span>
              </span>
              <span className="v2-ed-item-plate">
                <Media p={p} sizes="(max-width: 760px) 92vw, 1px" />
              </span>
              <span className="v2-ed-item-name">{p.name}</span>
              <span className="v2-ed-item-cat">{p.cat}</span>
            </Link>
          </li>
        ))}
      </ol>

      <p className="v2-ed-list-end">{pad2(v2Work.length)} Projects — {v2WorkPage.scope}</p>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function WorkEditorial() {
  const cards = useMemo(buildCards, []);
  return (
    <section className="v2-ed v2-ed--space">
      <h1 className="v2-sr-only">Selected work</h1>
      <Globe cards={cards} />
      <Index />
    </section>
  );
}
