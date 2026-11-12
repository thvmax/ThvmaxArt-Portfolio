"use client";

import { useEffect, useRef, useState } from 'react';
import { v2Intro } from '@/lib/v2content';

export const INTRO_DONE = 'v2:intro-done';
const SEEN_KEY = 'v2-intro-seen';

/**
 * Module-level gate. StrictMode mounts effects twice in development, so
 * the decision to play must be made once and reused — and "done" has to
 * be sticky, or a listener attaching a tick late never hears the event.
 */
let decided = false;
let willPlay = false;
let done = false;

const decide = () => {
  // once it has played, it is finished for the session — returning to the
  // home route must not replay it
  if (done) return false;
  if (decided) return willPlay;
  decided = true;
  let seen = false;
  try {
    seen = !!sessionStorage.getItem(SEEN_KEY);
  } catch {}
  willPlay = !seen && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return willPlay;
};

const markDone = () => {
  if (done) return;
  done = true;
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {}
  window.dispatchEvent(new Event(INTRO_DONE));
};

/** Runs `cb` when the intro is finished — immediately if it already is. */
export const onIntroDone = (cb: () => void) => {
  if (done) {
    cb();
    return () => {};
  }
  window.addEventListener(INTRO_DONE, cb, { once: true });
  return () => window.removeEventListener(INTRO_DONE, cb);
};

/**
 * First-visit intro, after mariavasilyeva.com.
 *
 * Three verses of the same five lines on ruled lanes. Every line flies in
 * from off the left edge to its place, its first and last letters leaving
 * a trail of stamped copies that close up as it lands. It rests a moment,
 * then a copy of it carries on out to the right while the line itself
 * comes round again — so the lanes keep moving while a count climbs at
 * the foot.
 *
 * Once every line has landed the count runs to 100 and the dark sheet
 * lifts off the page from the bottom up on a stepped edge of bars, like
 * a level meter — lines still passing — as the page rides up beneath it.
 *
 * Runs once per session — on the first arrival only. Navigating between
 * pages, or back to home, never replays it; nor does it run under
 * reduced motion. Fires INTRO_DONE either way so the hero knows when to
 * play.
 */

const TRAVEL_MS = 2150;   // one pass, edge to rest (and rest to edge)
const HOLD_MS = 780;      // rest before a line leaves, scaled 0.3–1.6× per pass
const STEP_MS = 100;      // stagger between lines starting
const SEP = 200;
const LEAD_STAMPS = 28, LEAD_WINDOW = 670;
const END_STAMPS = 44, END_WINDOW = 1070;
const PITCH = 0.66, GAP = 1.1;
const MERGE0 = 0.3, MERGE1 = 0.97;
const LIFT_MS = 1500;     // the sheet lifting off
const RIDE = 0.3;         // the page starts this far down (× viewport height)

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
/** Sixth-power in-out: almost still, then a snap through the middle. */
const snap = (t: number) => (t < 0.5 ? 32 * t ** 6 : 1 - 32 * (1 - t) ** 6);
const merge = (t: number) => clamp((MERGE1 - snap(t)) / (MERGE1 - MERGE0), 0, 1);
const quartIO = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - 8 * (1 - t) ** 4);
const bell = (v: number) => {
  const f = (x: number) => { const c = clamp(x, 0, 1) ** 2; return c * (2 - c); };
  return f(v / 0.12) * f((1 - v) / 0.12);
};
const hash = (x: number, y: number) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123; return s - Math.floor(s); };
/** Height of one bar of the lifting edge, 0–1, stepping as `flow` advances. */
const level = (bar: number, flow: number) => {
  const i = Math.floor(flow), f = flow - i, u = f * f * (3 - 2 * f);
  return hash(bar, i) * (1 - u) + hash(bar, i + 1) * u;
};

/** Where a moving line was `ago` ms back — the trail hangs off its recent path. */
const lookup = (hist: number[], t: number) => {
  if (t <= hist[0]) return hist[1];
  for (let i = hist.length - 2; i >= 2; i -= 2) {
    if (hist[i] <= t) {
      const k = (t - hist[i]) / ((hist[i + 2] ?? hist[i]) - hist[i] || 1);
      return hist[i + 1] + ((hist[i + 3] ?? hist[i + 1]) - hist[i + 1]) * k;
    }
  }
  return hist[1];
};

type Mover = { el: HTMLElement; lead: HTMLElement | null; end: HTMLElement | null; size: number; ta: number; hist: number[] };
type Line = Mover & { dist: number; back: number; t0: number; phase: 'wait' | 'enter' | 'rest'; until: number; landed: boolean };
type Ghost = Mover & { from: number; travel: number; t0: number };

export default function V2Intro() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const countRef = useRef<HTMLSpanElement | null>(null);
  const [armed, setArmed] = useState<boolean | null>(null);

  useEffect(() => {
    const play = decide();
    setArmed(play);
    if (!play) markDone();
  }, []);

  useEffect(() => {
    if (!armed) return;
    const root = rootRef.current;
    const count = countRef.current;
    if (!root || !count) return;

    document.body.classList.add('v2-intro-open');
    root.style.visibility = 'visible';

    const ink = (getComputedStyle(root).color.match(/[\d.]+/g) ?? ['242', '242', '240']).slice(0, 3).join(' ');
    const page = document.querySelector('.v2 main') as HTMLElement | null;

    const smear = (m: Mover, x: number, t: number, j: number, stamps: number, win: number) => {
      const b = j > 0 ? lookup(m.hist, t - win * j) : x;
      const z = x - b;
      if (z <= 1) return '';
      const q = m.size * PITCH * 2, gap = m.size * 0.7 * GAP;
      let out = '', w = x;
      for (let v = 1; v <= stamps; v++) {
        const at = Math.min(x - z * (1 - Math.sin((1 - v / stamps) * Math.PI * 0.5)), w - gap);
        if (at <= b) break;
        w = at;
        const a = m.ta * (1 - v / stamps) * Math.min(1, (at - b) / q);
        if (a <= 0.01) continue;
        out += `${out ? ', ' : ''}${(at - x).toFixed(1)}px 0 rgb(${ink} / ${(a * 100).toFixed(0)}%)`;
      }
      return out;
    };
    const shade = (m: Mover, x: number, t: number, j: number) => {
      m.hist.push(t, x);
      const cut = t - END_WINDOW - 100;
      while (m.hist.length > 4 && m.hist[2] < cut) m.hist.splice(0, 2);
      if (m.lead) m.lead.style.textShadow = smear(m, x, t, j, LEAD_STAMPS, LEAD_WINDOW);
      if (m.end) m.end.style.textShadow = smear(m, x, t, j, END_STAMPS, END_WINDOW);
    };

    const start = performance.now();
    const lines: Line[] = Array.from(root.querySelectorAll<HTMLElement>('.v2-intro-ln')).map((el, i) => {
      const r = el.getBoundingClientRect();
      return {
        el, lead: el.firstElementChild as HTMLElement | null, end: el.lastElementChild as HTMLElement | null,
        size: parseFloat(getComputedStyle(el).fontSize), ta: 0.5 + Math.random() * 0.5, hist: [],
        dist: r.right, back: Math.max(0, SEP - 2 * r.left),
        t0: 0, phase: 'wait', until: start + i * STEP_MS * (0.4 + Math.random()), landed: false,
      };
    });
    const ghosts: Ghost[] = [];

    let raf = 0, shown = 0, settledAt = 0, liftAt = 0, last = start;
    let flow = 0, prevQ = 0, speed = 0, fired = false, base = 0;

    const place = (l: Line, p: number, t: number) => {
      const x = -(l.dist + l.back) * (1 - snap(p));
      l.el.style.opacity = '1';
      l.el.style.setProperty('--kx', `${x.toFixed(1)}px`);
      shade(l, x, t, merge(p));
    };

    // a line leaving: a copy carries on to the right while the line comes round again
    const leave = (l: Line, now: number) => {
      const copy = l.el.cloneNode(true) as HTMLElement;
      copy.classList.add('v2-intro-ghost');
      copy.style.top = `${l.el.offsetTop}px`;
      copy.style.left = `${l.el.offsetLeft}px`;
      const from = new DOMMatrix(getComputedStyle(l.el).transform).m41;
      l.el.parentElement?.appendChild(copy);
      ghosts.push({
        el: copy, lead: copy.firstElementChild as HTMLElement | null, end: copy.lastElementChild as HTMLElement | null,
        size: l.size, ta: l.ta, hist: [], from, travel: window.innerWidth - l.el.getBoundingClientRect().left + 60, t0: now,
      });
      l.hist.length = 0;
      l.ta = 0.5 + Math.random() * 0.5;
      l.phase = 'enter';
      l.t0 = now;
      l.el.style.opacity = '0';
    };

    const finish = () => {
      cancelAnimationFrame(raf);
      document.body.classList.remove('v2-intro-open');
      root.style.display = 'none';
      if (page) page.style.transform = '';
      if (!fired) { fired = true; markDone(); }
    };

    const tick = (now: number) => {
      const dt = Math.min(now - last, 34);
      last = now;

      let all = true;
      {
        for (const l of lines) {
          if (l.phase === 'wait') {
            all = false;
            if (now < l.until) continue;
            l.phase = 'enter'; l.t0 = now; l.hist.length = 0;
          }
          if (l.phase === 'enter') {
            const p = Math.min((now - l.t0) / TRAVEL_MS, 1);
            place(l, p, now - l.t0);
            if (p >= 1) { l.phase = 'rest'; l.landed = true; l.until = now + HOLD_MS * (0.3 + Math.random() * 1.3); }
          } else if (l.phase === 'rest' && now >= l.until) {
            leave(l, now);
          }
          if (!l.landed) all = false;
        }
        for (let i = ghosts.length - 1; i >= 0; i--) {
          const g = ghosts[i];
          const p = Math.min((now - g.t0) / TRAVEL_MS, 1);
          const x = g.from + g.travel * snap(p);
          g.el.style.transform = `translateX(${x.toFixed(1)}px)`;
          shade(g, x, now - g.t0, merge(p));
          if (p >= 1) { g.el.remove(); ghosts.splice(i, 1); }
        }

      }

      if (!liftAt) {
        // the count creeps toward 99, then runs out to 100 once everything has landed
        if (!settledAt) {
          shown += (99 * (1 - Math.exp(-(now - start) / 3600)) - shown) * 0.08;
          if (all) { settledAt = now; base = shown; }
        } else {
          const k = clamp((now - settledAt) / 300, 0, 1);
          shown = base + (100 - base) * (1 - (1 - k) * (1 - k));
          if (k >= 1) {
            root.classList.add('is-out');
            liftAt = now + 60;
            // the page is there, already moving, as the sheet comes off it
            if (!fired) { fired = true; markDone(); }
          }
        }
        count.textContent = String(Math.round(shown));
      } else if (now >= liftAt) {
        // the sheet lifts: its lower edge climbs the screen as a row of bars
        const w = window.innerWidth, h = window.innerHeight;
        const q = quartIO(clamp((now - liftAt) / LIFT_MS, 0, 1));
        const pad = 0.0052 * h, span = h + 2 * pad;
        const y = h + pad - q * span;
        const moved = (q - prevQ) * span;
        prevQ = q;
        speed += (Math.abs(moved) - speed) * 0.08 * (dt / 16.67);
        const rush = clamp(speed / (h * 0.025), 0, 1);
        flow += moved * 0.0018 * (1 + rush * 2.5);
        const stepped = Math.round(flow / 0.15) * 0.15;
        const amp = 0.16 * h * (1 + rush * 0.7) * bell(q);
        const bar = w <= 768 ? 72 : 120;
        let d = `M0 -2 H${w}`;
        for (let i = Math.ceil(w / bar) - 1; i >= 0; i--) {
          const by = Math.max(-2, y + (level(i, stepped + 31) - 0.5) * amp).toFixed(1);
          d += ` V${by} H${i * bar}`;
        }
        root.style.clipPath = `path('${d} Z')`;
        if (page) page.style.transform = q < 1 ? `translate3d(0, ${(RIDE * h * (1 - q)).toFixed(1)}px, 0)` : '';
        if (q >= 1) { finish(); return; }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.body.classList.remove('v2-intro-open');
      if (page) page.style.transform = '';
    };
  }, [armed]);

  if (armed === null || armed === false) return null;

  return (
    <div className="v2-intro" ref={rootRef} aria-hidden="true">
      <div className="v2-intro-txt">
        {[0, 1, 2].map((v) => (
          <div className="v2-intro-verse" key={v}>
            {v2Intro.lines.map((line) => (
              <p className="v2-intro-ln" key={line}>
                <span>{line.charAt(0)}</span>
                {line.slice(1, -1)}
                <span>{line.slice(-1)}</span>
              </p>
            ))}
          </div>
        ))}
      </div>

      <span className="v2-intro-count">
        <b>▸</b>
        <span>
          <span ref={countRef}>0</span>%
        </span>
      </span>
    </div>
  );
}
