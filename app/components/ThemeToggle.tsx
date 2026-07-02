"use client";

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Read whatever the no-flash script already applied to <html>.
  useEffect(() => {
    const current = (document.documentElement.getAttribute('data-theme') as Theme) || 'light';
    setTheme(current);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* ignore private-mode storage errors */
    }
  };

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label="Toggle color theme"
      // Avoid a hydration mismatch flash: render neutral until mounted.
      suppressHydrationWarning
    >
      <span className="theme-toggle-track">
        <span className="theme-toggle-thumb" />
      </span>
      <span className="theme-toggle-label">
        {mounted ? (theme === 'light' ? 'Light' : 'Dark') : ''}
      </span>
    </button>
  );
}
