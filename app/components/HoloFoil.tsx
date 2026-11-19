"use client";

import { useEffect, useRef } from 'react';
import { onIntroDone } from './V2Intro';

/**
 * A strip of holographic print foil, floating in the hero.
 *
 * The finish a designer specs for a premium pack or a calendar cover:
 * thin-film colour that shifts with the viewing angle, a fine diffraction
 * grating, a little glitter. The strip twists slowly on its own; the
 * pointer tilts it, moves the light across it and presses a soft dent
 * where it passes, the way a fingertip would. Scrolling winds it further.
 *
 * Plain WebGL, one mesh, one draw call. It only renders while it is on
 * screen, renders one still frame for reduced motion, and quietly steps
 * aside where WebGL is unavailable.
 */

const VERT = /* glsl */ `
attribute vec2 aUV;
uniform float uTime;
uniform float uScroll;
uniform float uAspect;
uniform float uFocal;
uniform vec2 uTilt;
uniform vec2 uPointer;
uniform float uPress;
uniform vec3 uPlace;
uniform float uSpin;
varying vec3 vN;
varying vec3 vP;
varying vec2 vUV;

const float L = 2.6;
const float W = 0.78;

vec3 strip(vec2 uv) {
  float u = uv.x, v = uv.y, t = uTime * 0.22;
  float twist = u * 2.9 + sin(t + u * 1.3) * 0.8 + uScroll * 2.6;
  vec3 spine = vec3(
    u * L,
    sin(u * 1.8 + t) * 0.42 + sin(u * 3.6 - t * 1.3) * 0.07,
    cos(u * 1.4 - t * 0.8) * 0.55
  );
  vec3 across = vec3(-sin(u * 1.1 + t) * 0.12, cos(twist), sin(twist)) * W * v;
  across.z += sin(u * 7.0 + v * 2.0 + t * 3.0) * 0.025;
  return spine + across;
}

mat3 rx(float a) { float c = cos(a), s = sin(a); return mat3(1., 0., 0., 0., c, s, 0., -s, c); }
mat3 ry(float a) { float c = cos(a), s = sin(a); return mat3(c, 0., -s, 0., 1., 0., s, 0., c); }
mat3 rz(float a) { float c = cos(a), s = sin(a); return mat3(c, s, 0., -s, c, 0., 0., 0., 1.); }

vec3 place(vec3 p) {
  p = rz(uSpin) * p;
  p = ry(uTilt.x) * rx(uTilt.y) * p;
  return p * uPlace.z + vec3(uPlace.xy, 0.);
}

// the fingertip: a soft dent toward the viewer, with a ripple running out of it
vec3 press(vec3 p) {
  float d = length(p.xy - uPointer);
  float k = exp(-d * d * 2.2);
  p.z += k * 0.42 * uPress + sin(d * 9.0 - uTime * 4.0) * exp(-d * 1.6) * 0.035 * uPress;
  return p;
}

void main() {
  float e = 0.004;
  vec3 p = press(place(strip(aUV)));
  vec3 pu = press(place(strip(aUV + vec2(e, 0.))));
  vec3 pv = press(place(strip(aUV + vec2(0., e))));
  vN = normalize(cross(pu - p, pv - p));
  vP = p;
  vUV = aUV;
  float z = p.z - 6.0;
  // perspective from a camera at z = 6, near 1, far 20
  gl_Position = vec4(p.x * uFocal / uAspect, p.y * uFocal, z * -1.10526 - 2.10526, -z);
}
`;

const FRAG = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uLight;
uniform float uReveal;
uniform vec2 uPointer;
uniform vec2 uRes;
varying vec3 vN;
varying vec3 vP;
varying vec2 vUV;

// the colours of real foil: pinks, lilacs, cyans and mints, never the full-strength rainbow
vec3 film(float t) {
  vec3 c = 0.62 + 0.38 * cos(6.28318 * (t + vec3(0.0, 0.3, 0.62)));
  return mix(c, vec3(dot(c, vec3(0.333))), 0.22);
}
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
  // the strip unrolls from one end as it arrives
  float edge = mix(-1.25, 1.25, uReveal);
  float a = 1.0 - smoothstep(edge - 0.2, edge, vUV.x);
  a *= smoothstep(1.0, 0.94, abs(vUV.x));
  if (a < 0.003) discard;

  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(vec3(0., 0., 6.) - vP);
  float ndv = clamp(dot(N, V), 0., 1.);

  // light comes from where the pointer is
  vec3 Lt = normalize(vec3(uPointer * 0.45, 1.6) - vP * 0.15);
  vec3 H = normalize(Lt + V);
  float nh = max(dot(N, H), 0.);

  // a studio reflected in chrome: soft bands of light on black
  vec3 R = reflect(-V, N);
  float band = 0.5 + 0.5 * sin(R.y * 6.5 + R.x * 2.5 + uTime * 0.15);
  float studio = pow(band, 5.0);
  float fres = pow(1.0 - ndv, 3.0);
  float chrome = clamp(studio * 0.95 + fres * 0.35 + 0.06, 0.0, 1.0);

  // thin-film colour over it: angle first, then position, then the grating
  float grating = sin((vUV.x * 0.9 + vUV.y * 0.32) * 150.0);
  float hue = ndv * 2.1 + R.y * 0.55 + vUV.x * 0.32 + uTime * 0.025 + grating * 0.012;
  vec3 col = film(hue) * (0.28 + 0.95 * chrome) + studio * studio * 0.35;
  col += pow(nh, 70.0) * 0.9 + pow(nh, 9.0) * 0.12;
  // on the light theme the shadows lift, so the foil reads pearly rather than heavy
  col = mix(col, max(col, film(hue + 0.12) * 0.55 + 0.35), uLight * 0.85);

  // glitter: tiny cells that catch the light only at the right angle
  vec2 cell = floor(vUV * vec2(520., 110.));
  float g = step(0.9965, hash(cell)) * smoothstep(0.55, 0.95, nh + hash(cell + 7.) * 0.3);
  col += g * 1.2;

  a *= smoothstep(0.0, 0.25, uReveal);
  // fade out before the canvas edge, so the hero never shows a hard cut
  a *= smoothstep(0.0, 0.07, gl_FragCoord.y / uRes.y) * smoothstep(1.0, 0.985, gl_FragCoord.y / uRes.y);
  gl_FragColor = vec4(col * a, a);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

const SEG_U = 180;
const SEG_V = 22;
const FOV = (34 * Math.PI) / 180;

export default function HoloFoil() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: true });
    if (!gl) {
      canvas.style.display = 'none';
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      canvas.style.display = 'none';
      return;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // a (SEG_U+1) × (SEG_V+1) grid over u, v ∈ [-1, 1]
    const uv = new Float32Array((SEG_U + 1) * (SEG_V + 1) * 2);
    let k = 0;
    for (let j = 0; j <= SEG_V; j++)
      for (let i = 0; i <= SEG_U; i++) {
        uv[k++] = (i / SEG_U) * 2 - 1;
        uv[k++] = (j / SEG_V) * 2 - 1;
      }
    const idx = new Uint16Array(SEG_U * SEG_V * 6);
    k = 0;
    for (let j = 0; j < SEG_V; j++)
      for (let i = 0; i < SEG_U; i++) {
        const a = j * (SEG_U + 1) + i, b = a + 1, c = a + SEG_U + 1, d = c + 1;
        idx.set([a, c, b, b, c, d], k);
        k += 6;
      }
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, uv, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aUV');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const u = {
      time: U('uTime'), scroll: U('uScroll'), aspect: U('uAspect'), focal: U('uFocal'),
      tilt: U('uTilt'), pointer: U('uPointer'), press: U('uPress'), place: U('uPlace'),
      spin: U('uSpin'), light: U('uLight'), reveal: U('uReveal'), res: U('uRes'),
    };
    gl.uniform1f(u.focal, 1 / Math.tan(FOV / 2));

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;
    const st = {
      w: 0, h: 0, halfW: 1, halfH: 1,
      px: 0.5, py: 0.1, tx: 0.5, ty: 0.1,      // pointer, in canvas NDC (smoothed / target)
      tiltX: 0, tiltY: 0, press: 0, pressT: 0.25,
      light: root.getAttribute('data-theme') === 'light' ? 1 : 0,
      reveal: reduced ? 1 : 0, revealT: reduced ? 1 : 0,
      scroll: 0, t0: performance.now(), visible: true, raf: 0,
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      st.w = r.width;
      st.h = r.height;
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u.res, canvas.width, canvas.height);
      const aspect = r.width / Math.max(1, r.height);
      st.halfH = 6 * Math.tan(FOV / 2);
      st.halfW = st.halfH * aspect;
      gl.uniform1f(u.aspect, aspect);
      // wide screens: the strip lies across the right of the hero, behind the
      // ends of the headline; on a phone it runs across the open band above the copy
      if (aspect > 1.05) {
        gl.uniform3f(u.place, st.halfW * 0.56, st.halfH * 0.2, (st.halfW * 0.84) / 5.2);
        gl.uniform1f(u.spin, -0.3);
      } else {
        const y = (1 - (2 * 132) / Math.max(1, r.height)) * st.halfH;
        gl.uniform3f(u.place, st.halfW * 0.04, y, (st.halfW * 2.05) / 5.2);
        gl.uniform1f(u.spin, -0.1);
      }
      draw();
    };

    const draw = () => {
      const t = reduced ? 8 : (performance.now() - st.t0) / 1000;
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform1f(u.time, t);
      gl.uniform1f(u.scroll, st.scroll);
      gl.uniform2f(u.tilt, st.tiltX, st.tiltY);
      gl.uniform2f(u.pointer, st.px * st.halfW, st.py * st.halfH);
      gl.uniform1f(u.press, st.press);
      gl.uniform1f(u.light, st.light);
      gl.uniform1f(u.reveal, st.reveal);
      gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0);
    };

    const loop = () => {
      st.raf = 0;
      if (!st.visible) return;
      const ease = 0.075;
      st.px += (st.tx - st.px) * ease;
      st.py += (st.ty - st.py) * ease;
      st.tiltX += (st.px * 0.38 - st.tiltX) * 0.05;
      st.tiltY += (-st.py * 0.26 - st.tiltY) * 0.05;
      st.press += (st.pressT - st.press) * 0.08;
      st.pressT += (0.25 - st.pressT) * 0.03;   // a moving pointer presses harder, then it eases off
      st.reveal += (st.revealT - st.reveal) * 0.035;
      const target = root.getAttribute('data-theme') === 'light' ? 1 : 0;
      st.light += (target - st.light) * 0.12;
      const rect = canvas.getBoundingClientRect();
      st.scroll = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height)));
      draw();
      st.raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!reduced && st.visible && !st.raf && !document.hidden) st.raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = 1 - ((e.clientY - r.top) / r.height) * 2;
      const dx = nx - st.tx, dy = ny - st.ty;
      st.tx = Math.max(-1.3, Math.min(1.3, nx));
      st.ty = Math.max(-1.3, Math.min(1.3, ny));
      st.pressT = Math.min(1, st.pressT + Math.hypot(dx, dy) * 2.2);
    };
    const onTheme = () => {
      st.light = root.getAttribute('data-theme') === 'light' ? 1 : 0;
      if (reduced) draw();
    };
    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(st.raf);
        st.raf = 0;
      } else start();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      st.visible = entry.isIntersecting;
      if (st.visible) start();
    });
    io.observe(canvas);
    const mo = new MutationObserver(onTheme);
    mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVis);

    const stopIntro = onIntroDone(() => {
      st.revealT = 1;
      start();
    });
    start();

    return () => {
      stopIntro?.();
      cancelAnimationFrame(st.raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return <canvas className="v2-holo" ref={ref} aria-hidden="true" />;
}
