export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--black)',
        color: 'var(--white)',
        fontFamily: 'var(--font-body), sans-serif',
        fontWeight: 300,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
      }}
    >
      {/* Animated grain — reuses class from globals.css */}
      <div className="hero-grain-overlay" />

      {/* ── Header ─────────────────────────────────── */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'clamp(1.2rem, 2vw, 1.8rem) clamp(1.5rem, 4vw, 3rem)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display), sans-serif',
            fontWeight: 700,
            fontSize: '1rem',
            letterSpacing: '0.02em',
            color: 'var(--white)',
          }}
        >
          THVMAX
        </span>

        <span
          style={{
            fontSize: '0.58rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--gray)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#6ee7b7',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          Available
        </span>
      </header>

      {/* ── Main Content ────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(4rem, 8vw, 8rem) clamp(1.5rem, 4vw, 3rem)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <p
          style={{
            fontSize: '0.58rem',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'var(--gray)',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '2rem',
              height: '1px',
              background: 'var(--gray)',
              flexShrink: 0,
            }}
          />
          Coming Soon
        </p>

        <h1
          style={{
            fontFamily: 'var(--font-display), sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(3.5rem, 10vw, 10rem)',
            lineHeight: 0.88,
            letterSpacing: '-0.04em',
            color: 'var(--white)',
            marginBottom: '3rem',
          }}
        >
          Something
          <br />
          new is
          <br />
          <em style={{ fontStyle: 'normal', color: 'var(--accent)' }}>
            on its way.
          </em>
        </h1>

        <p
          style={{
            fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
            lineHeight: 1.7,
            color: 'rgba(245, 243, 239, 0.45)',
            maxWidth: '44ch',
          }}
        >
          Multidisciplinary creative design &amp; strategy.
          <br />
          Based in Abu Dhabi, UAE.
        </p>
      </div>

      {/* ── Footer / Contact ────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: 'clamp(1.2rem, 2vw, 1.8rem) clamp(1.5rem, 4vw, 3rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <p
            style={{
              fontSize: '0.52rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--gray)',
              marginBottom: '0.25rem',
            }}
          >
            For projects &amp; open positions
          </p>
          <a
            href="mailto:thutasoe24@gmail.com"
            style={{
              fontFamily: 'var(--font-display), sans-serif',
              fontWeight: 600,
              fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)',
              letterSpacing: '-0.01em',
              color: 'var(--white)',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            thutasoe24@gmail.com
          </a>
          <a
            href="tel:+971565776382"
            style={{
              fontSize: '0.78rem',
              letterSpacing: '0.05em',
              color: 'var(--gray)',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            +971 56 577 6382
          </a>
        </div>

        <p
          style={{
            fontSize: '0.55rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(154, 154, 142, 0.4)',
          }}
        >
          © 2025 Thuta Soe
        </p>
      </footer>
    </main>
  );
}
