"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export const THEME_KEY = 'thv-theme';

type Theme = 'dark' | 'light';

const INK_MS = 720;   // ink spreading until it covers the page
const SWAP_MS = 60;   // hover transitions stay suspended this long after swap
const SCALE = 0.5;    // ink is drawn at half resolution — softer edges, a quarter of the work

/**
 * Theme dial with an ink-blot dissolve.
 *
 * The two palettes are near-exact negatives of each other (#0b0c0d ↔
 * #f4f4f1, #f2f2f0 ↔ #101215). So instead of repainting the page while it
 * animates, one WebGL layer sits over everything in `difference` blend and
 * grows organic, grainy ink blots: wherever the ink has reached, the page
 * already reads in the other theme, text included, and nothing is ever
 * covered. When the blots have merged, the real tokens flip and the layer
 * is dropped in the same frame, so the hand-off is invisible.
 *
 * The shader is compiled and drawn once at mount, so the first switch has
 * nothing to warm up. No WebGL or reduced motion → plain instant swap.
 */

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;
const FRAG = `
precision mediump float;
uniform vec2 uRes; uniform float uP; uniform vec2 uO; uniform float uSeed;
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }
void main(){
  vec2 uv = gl_FragCoord.xy / uRes; float asp = uRes.x / uRes.y;
  vec2 q = vec2(uv.x * asp, uv.y);
  float blots = smoothstep(0.28, 0.72, fbm(q * 2.4 + uSeed));
  float spray = noise(q * 46.0 + uSeed * 3.1);
  float near  = 1.0 - clamp(distance(q, vec2(uO.x * asp, uO.y)) / (asp * 1.15), 0.0, 1.0);
  float field = blots * 0.8 + near * 0.22 + (spray - 0.5) * 0.08;
  float th = mix(1.06, -0.08, uP);
  float ink = smoothstep(th - 0.018, th + 0.018, field);
  gl_FragColor = vec4(ink, ink, ink, ink);
}`;

type Ink = { gl: WebGLRenderingContext; uP: WebGLUniformLocation | null; uO: WebGLUniformLocation | null; uSeed: WebGLUniformLocation | null; uRes: WebGLUniformLocation | null };

// a few blots first, steady spread, last gaps close just before the swap
const ease = (t: number) => t * t * (3 - 2 * t);

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');
  const running = useRef(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ink = useRef<Ink | null>(null);
  // the ink layer lives on <body>: inside the nav (backdrop-filter) a blend
  // mode can only see the nav, not the page behind it
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => setHost(document.body), []);

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'light' ? 'light' : 'dark');
  }, []);

  const size = useCallback(() => {
    const c = canvasRef.current, k = ink.current;
    if (!c || !k) return;
    c.width = Math.max(2, Math.ceil(window.innerWidth * SCALE));
    c.height = Math.max(2, Math.ceil(window.innerHeight * SCALE));
    k.gl.viewport(0, 0, c.width, c.height);
    k.gl.uniform2f(k.uRes, c.width, c.height);
  }, []);

  const draw = useCallback((p: number) => {
    const k = ink.current;
    if (!k) return;
    k.gl.uniform1f(k.uP, p);
    k.gl.clearColor(0, 0, 0, 0);
    k.gl.clear(k.gl.COLOR_BUFFER_BIT);
    k.gl.drawArrays(k.gl.TRIANGLES, 0, 3);
  }, []);

  // compile + warm the shader once, so the first switch is as smooth as the rest
  useEffect(() => {
    const c = canvasRef.current;
    if (!c || ink.current) return;
    const gl = c.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
    if (!gl) return;
    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    ink.current = {
      gl,
      uP: gl.getUniformLocation(prog, 'uP'),
      uO: gl.getUniformLocation(prog, 'uO'),
      uSeed: gl.getUniformLocation(prog, 'uSeed'),
      uRes: gl.getUniformLocation(prog, 'uRes'),
    };
    size();
    draw(0);
    window.addEventListener('resize', size);
    return () => window.removeEventListener('resize', size);
  }, [draw, size, host]);

  const apply = useCallback((next: Theme) => {
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
    setTheme(next);
  }, []);

  const swap = useCallback((next: Theme) => {
    const root = document.documentElement;
    // suspend every element's own hover transition so all surfaces land in one paint
    root.classList.add('is-morphing');
    apply(next);
    window.setTimeout(() => root.classList.remove('is-morphing'), SWAP_MS);
  }, [apply]);

  const toggle = useCallback(() => {
    if (running.current) return;
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    const btn = btnRef.current, c = canvasRef.current, k = ink.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || !c || !k) {
      swap(next);
      return;
    }
    running.current = true;

    if (btn) {
      btn.classList.remove('is-spun', 'to-light', 'to-dark');
      void btn.offsetWidth;
      btn.classList.add('is-spun', next === 'light' ? 'to-light' : 'to-dark');
    }

    const r = btn?.getBoundingClientRect();
    k.gl.uniform2f(k.uO, r ? (r.left + r.width / 2) / window.innerWidth : 1, r ? 1 - (r.top + r.height / 2) / window.innerHeight : 1);
    k.gl.uniform1f(k.uSeed, Math.random() * 100);
    draw(0);
    c.style.display = 'block';

    const start = performance.now();
    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / INK_MS);
      draw(ease(t));
      if (t < 1) {
        requestAnimationFrame(frame);
        return;
      }
      // fully inked: flip the real palette and drop the layer in the same frame
      swap(next);
      c.style.display = 'none';
      btn?.classList.remove('to-light', 'to-dark', 'is-spun');
      running.current = false;
    };
    requestAnimationFrame(frame);
  }, [draw, swap, theme]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="v2-dial"
        onClick={toggle}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-pressed={theme === 'light'}
        title="Switch theme"
        data-cursor="hover"
      >
        <span className="v2-dial-disc" aria-hidden="true" />
        <span className="v2-dial-ring" aria-hidden="true" />
      </button>

      {host && createPortal(<canvas className="v2-ink" ref={canvasRef} aria-hidden="true" />, host)}
    </>
  );
}
