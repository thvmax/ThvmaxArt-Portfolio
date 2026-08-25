"use client";

import type { ReactNode } from 'react';
import { v2Site } from '@/lib/v2content';
import Reveal from './Reveal';
import ScrambleLabel from './ScrambleLabel';

interface Props {
  label: string;
  heading: ReactNode;
  children?: ReactNode;   // CTA
  id?: string;
}

/** Dark closing band shared by the Work and About frames. */
export default function Band({ label, heading, children, id }: Props) {
  return (
    <section className="v2-band" id={id}>
      <Reveal>
        <ScrambleLabel accent>{label}</ScrambleLabel>
        <h2 className="v2-band-head">{heading}</h2>
        {children}
      </Reveal>
      <div className="v2-band-foot">
        <span>{v2Site.owner}</span>
        <span>{v2Site.copyright}</span>
      </div>
    </section>
  );
}
