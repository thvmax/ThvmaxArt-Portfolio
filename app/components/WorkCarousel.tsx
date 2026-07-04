"use client";

import { useEffect, useState } from 'react';
import type { Project } from '@/lib/data';

const CYCLE_MS = 4500;

const block = (hue: number) =>
  `linear-gradient(145deg, hsl(${hue} 55% 42%), hsl(${(hue + 45) % 360} 60% 30%))`;

interface Props {
  works: Project[];
  onOpen: (p: Project) => void;
}

export default function WorkCarousel({ works, onOpen }: Props) {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % works.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [works.length]);

  const current = works[slide];

  return (
    <section id="work" className="carousel" aria-label="Selected work">
      <button
        type="button"
        className="carousel-hit"
        onClick={() => onOpen(current)}
        aria-label={`Open case study: ${current.name}`}
      />
      {works.map((p, i) => (
        <div
          key={p.name}
          className={`carousel-slide ${slide === i ? 'active' : ''}`}
          style={{ background: p.img || p.video ? undefined : block(p.hue) }}
          aria-hidden={slide !== i}
        >
          {p.video ? (
            <video src={p.video} autoPlay muted loop playsInline poster={p.img} />
          ) : p.img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.img} alt="" />
          ) : null}
        </div>
      ))}

      <div className="carousel-overlay">
        <span className="carousel-counter">{slide + 1}/{works.length}</span>
        <span className="carousel-name">{current.name}</span>
        <span className="carousel-cat">{current.cat}</span>
      </div>

      <div className="carousel-dots" aria-hidden="true">
        {works.map((p, i) => (
          <button
            key={p.name}
            type="button"
            className={`carousel-dot ${slide === i ? 'active' : ''}`}
            onClick={() => setSlide(i)}
            tabIndex={-1}
          />
        ))}
      </div>
    </section>
  );
}
