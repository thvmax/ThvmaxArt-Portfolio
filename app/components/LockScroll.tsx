"use client";

import { useEffect } from 'react';

/** Pages held in a single viewport (the work marquee) lock page scroll. */
export default function LockScroll() {
  useEffect(() => {
    document.body.classList.add('v2-locked');
    return () => document.body.classList.remove('v2-locked');
  }, []);

  return null;
}
