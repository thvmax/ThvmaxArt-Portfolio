"use client";

import { useEffect, type ReactNode } from 'react';
import SmoothScroll from '@/app/components/SmoothScroll';
import PageTransition from './PageTransition';
import V2Nav from './V2Nav';
import Cursor from './Cursor';
import ChatWidget from './ChatWidget';

/**
 * Persistent frame for every v2 route. Lives in the layout, not in the
 * pages, so Lenis, the nav, the cursor and the route wipe survive
 * navigation — the wipe in particular must outlive the page it is
 * animating away.
 */
export default function V2Frame({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.body.classList.add('v2-body');
    return () => document.body.classList.remove('v2-body');
  }, []);

  return (
    <SmoothScroll>
      <PageTransition>
        <div className="v2" id="top">
          <Cursor />
          <V2Nav />
          {children}
          <ChatWidget />
        </div>
      </PageTransition>
    </SmoothScroll>
  );
}
