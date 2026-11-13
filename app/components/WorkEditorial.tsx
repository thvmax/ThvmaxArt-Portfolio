"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { plate, v2Work, v2WorkPage, type V2Project } from '@/lib/v2content';

/**
 * Work (/work) — an interactive ring gallery in the manner of cipher.tv:
 * the projects (plus extra real stills) as overlapping landscape cards on
 * a slowly turning ring that fills the screen.
 *
 * The ring is not a clean circle: like the reference it is a leaning
 * oval, with each card sitting a little in or out of line and at its own
 * size, so the frames stair-step over one another.
 *
 * Scroll (either way) or drag turns the ring: input moves a target angle
 * and the ring glides after it, opening out a little while it is moving
 * fast and closing up as it settles. Hovering a card lifts it in full
 * colour while every other card drops right back, and its number and
 * title appear at the foot. A click goes straight to the
 * site's page transition; coming back, the ring is where it was left and
 * simply settles in.
 *
 * Plain DOM + transforms, no WebGL, so every card is a real link
 * (keyboard and screen-reader reachable).
 *
 * On a phone the ring gives way to an editorial index (see Index): a
 * ring of overlapping cards has no hover to name them and no room to
 * read, so the projects run down the page as captioned plates instead.
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

/* ── Ring ──────────────────────────────────────────────────────────── */

/** One card on the ring: a project, optionally showing one of its stills. */
type Card = { key: string; p: V2Project; src?: string };

const STING_STILLS = ['product-kv.png', 'event-poster.png', 'kv-qr-code.png', 'slide-1.jpg'];

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

/** Where the ring was left, so coming back to /work picks it up rather than restarting. */
let savedRot: number | null = null;

const LEAN = -0.38; // the oval leans: long axis runs lower-left to upper-right

function Ring({ cards }: { cards: Card[] }) {
  const items = cards.map((c) => c.p);
  const n = cards.length;
  const stageRef = useRef<HTMLDivElement | null>(null);
  const nodes = useRef<(HTMLAnchorElement | null)[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const s = useRef({
    rot: -0.6, target: -0.6, v: 0, auto: 0, open: 1, born: 0, last: 0, resume: false, faded: false,
    hold: false, drag: false, moved: false, lx: 0, ly: 0,
    px: 0, py: 0, tpx: 0, tpy: 0, active: -1,
  });
  // each card keeps its own place in the line and its own size (fixed, not random per load)
  const quirk = useMemo(
    () => Array.from({ length: n }, (_, i) => ({
      r: 1 + 0.11 * Math.sin(i * 2.4 + 1),
      a: 0.09 * Math.sin(i * 3.1),
      k: 1 + 0.17 * Math.sin(i * 1.7 + 0.5),
    })),
    [n],
  );

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const st = s.current;
    if (savedRot !== null) { st.rot = savedRot; st.target = savedRot; st.resume = true; }
    const cosL = Math.cos(LEAN), sinL = Math.sin(LEAN);
    let raf = 0;

    const tick = (now: number) => {
      if (!st.born) { st.born = now; st.last = now; }
      const dt = Math.min(3, (now - st.last) / 16.67);
      st.last = now;

      // first visit: the cards start stacked in the centre and fan out into the
      // ring. Coming back: the ring is already formed and only eases up to size.
      const o = reduced ? 1 : Math.min(1, (now - st.born) / (st.resume ? 900 : 1400));
      const eased = 1 - Math.pow(1 - o, 4);
      const spread = st.resume ? 0.9 + 0.1 * eased : 0.03 + 0.97 * eased;
      const alpha = st.resume ? eased : Math.min(1, eased * 1.4);

      const w = stage.clientWidth, h = stage.clientHeight;
      // hidden (the phone layout is showing instead): idle until it is back
      if (!w) { st.born = 0; raf = requestAnimationFrame(tick); return; }

      // the idle turn eases off and back on, so hovering never jolts the ring
      st.auto += ((reduced || st.hold || st.drag ? 0 : 0.0012) - st.auto) * Math.min(1, 0.06 * dt);
      // input moves the target; the ring glides after it and never snaps
      st.target += (st.auto + st.v + (st.resume ? 0 : (1 - eased) * 0.035)) * dt;
      st.v *= Math.pow(0.95, dt);
      const lag = st.target - st.rot;
      st.rot += lag * (1 - Math.pow(1 - 0.085, dt));
      // moving fast, the ring opens out and the cards draw back a touch
      const rush = Math.min(1, Math.abs(lag) * 2.2);
      st.open += (1 + 0.075 * rush - st.open) * Math.min(1, 0.1 * dt);
      const shrink = 1 - 0.07 * (st.open - 1) / 0.075;

      const A = Math.min(w * 0.205, h * 0.41) * spread * st.open;
      const B = h * 0.178 * spread * st.open;
      const cl = cosL, sl = sinL;

      st.px += (st.tpx - st.px) * 0.06;
      st.py += (st.tpy - st.py) * 0.06;

      for (let i = 0; i < n; i++) {
        const el = nodes.current[i];
        if (!el) continue;
        const q = quirk[i];
        const t = (i / n) * Math.PI * 2 + st.rot + q.a;
        const u = Math.cos(t) * A * q.r, v = Math.sin(t) * B * q.r;
        const near = Math.cos(t - Math.PI * 0.75);
        const k = q.k * (1 + 0.06 * near) * shrink;
        const px = u * cl - v * sl + st.px * (10 + 8 * near);
        const py = u * sl + v * cl + st.py * (10 + 8 * near);
        // transform is the only thing written every frame. Stacking is fixed
        // (each card over the one before it, like tiles) so cards never swap
        // front-to-back as the ring turns; opacity is only touched while fading in.
        el.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0) translate(-50%, -50%) scale(${k.toFixed(4)})`;
        if (!st.faded) el.style.opacity = String(alpha);
      }
      if (!st.faded && alpha >= 1) st.faded = true;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // straight onto the target: a notch of the wheel is a fixed turn, eased in
      s.current.target += Math.max(-0.5, Math.min(0.5, (e.deltaY + e.deltaX) * 0.0011));
    };
    const onMove = (e: PointerEvent) => {
      if (st.drag) {
        const dx = e.clientX - st.lx, dy = e.clientY - st.ly;
        if (Math.abs(dx) + Math.abs(dy) > 4) st.moved = true;
        // turn the ring the way the pointer pushes it, wherever it is grabbed
        const r = stage.getBoundingClientRect();
        const cx = e.clientX - (r.left + r.width / 2), cy = e.clientY - (r.top + r.height * 0.52);
        const len = Math.max(60, Math.hypot(cx, cy));
        const turn = (cx * dy - cy * dx) / (len * len);
        st.target += turn;          // follows the hand…
        st.v = turn * 0.35;         // …and keeps a little of the throw on release
        st.lx = e.clientX; st.ly = e.clientY;
        return;
      }
      if (e.pointerType !== 'mouse' || reduced) return;
      const r = stage.getBoundingClientRect();
      st.tpx = (e.clientX - r.left) / r.width - 0.5;
      st.tpy = (e.clientY - r.top) / r.height - 0.5;
    };
    const onUp = () => { s.current.drag = false; };

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
  }, [n, quirk]);

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const st = s.current;
    st.drag = true; st.moved = false; st.lx = e.clientX; st.ly = e.clientY;
  };

  const show = (i: number | null) => {
    s.current.hold = i !== null;
    s.current.active = i ?? -1;
    setActive(i);
  };
  const cur = active === null ? null : items[active];

  return (
    <div
      ref={stageRef}
      className={`v2-ed-space${active !== null ? ' has-active' : ''}`}
      onPointerDown={onDown}
      data-lenis-prevent
    >
      {cards.map(({ key, p, src }, i) => (
        <Link
          key={key}
          ref={(el) => { nodes.current[i] = el; }}
          href={`/work/${p.slug}`}
          className={`v2-ed-node${active === i ? ' is-active' : ''}`}
          style={{ zIndex: active === i ? 400 : i + 1 }}
          aria-label={`${p.name} — ${p.cat}, ${p.year}`}
          onPointerEnter={() => show(i)}
          onPointerLeave={() => show(null)}
          onFocus={() => show(i)}
          onBlur={() => show(null)}
          draggable={false}
          data-cursor="hover"
        >
          <span className="v2-ed-node-card">
            <Media p={p} src={src} sizes="240px" />
          </span>
        </Link>
      ))}

      {/* one quiet line at the foot: the count at rest, the project under
          the pointer otherwise */}
      <p className="v2-ed-counter" aria-live="polite">
        {cur ? (
          <>
            <span>{pad2(v2Work.indexOf(cur) + 1)}</span> {cur.name} <em>{cur.cat}, {cur.year}</em>
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
      <Ring cards={cards} />
      <Index />
    </section>
  );
}
