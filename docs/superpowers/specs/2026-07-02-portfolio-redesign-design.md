# Portfolio Redesign — Design Spec

Date: 2026-07-02
Owner: Thuta Soe (THVMAX)

## Goal

Rebuild the single-page portfolio as a **clean, responsive, editorial** site inspired by
chantheman.ae and kaungthatsan.com — but distinct. Smooth scroll + scroll-reveal
transitions. Light/dark toggle. Works on phone and laptop.

## Decisions (locked)

- **Full clean rebuild.** Remove: 120-frame cinematic scrub intro, custom cursor,
  `<canvas>` gradient placeholders, `lib/canvas-helpers.ts`.
- **Theme:** light + dark toggle. `data-theme` on `<html>`, persisted in localStorage,
  no-flash inline script in `layout.tsx`. Default light.
- **Placeholders:** solid color blocks with project name/category text, color derived
  from each project's existing `hue`. No fake photos. Swap real images later.
- **Project click:** lightweight modal with project detail. Projects flagged
  `caseStudy` (Sting) show a "View case study →" button linking to the real page
  (`/sting-night-life`). Existing case-study pages kept as-is.
- **Keep:** Lenis smooth scroll, GSAP `ScrollTrigger` scroll-reveals, hover/lift micro-interactions.

## Structure (single page, top → bottom)

1. **Nav** — `THVMAX` logo, links (Work, Services, About, Contact), theme toggle,
   mobile hamburger → full-screen menu. Subtle running marquee kept.
2. **Hero** — big display name, "Available for work" pill, tagline, location.
   Staggered entrance animation.
3. **Stats strip** — 7+ yrs, project count, client count, disciplines. Derived from data.
4. **Selected Works** — responsive grid of color-block cards → modal on click.
5. **Visual Archive** — smaller grid of showcase color blocks, hover reveal.
6. **Services** — numbered grid.
7. **About** — bio + experience timeline + skills tags.
8. **Contact CTA** — large email, social links.
9. **Footer**.

## Data model

`lib/data.ts` centralizes all content:
- `projects[]` — add `client`, `role`, `slug?`, `caseStudyHref?`.
- `showcaseCards[]`, `services[]`, `experience[]`, `skills[]`, `marquee[]`, `stats[]`.

## Files

- `app/components/Portfolio.tsx` — rewritten clean.
- `app/components/ThemeToggle.tsx` — new.
- `app/globals.css` — rewritten: CSS-variable theming, responsive, transitions.
- `app/layout.tsx` — add no-flash theme script; keep Syne + DM Sans fonts.
- `lib/data.ts` — new content module. Delete `lib/projects.ts`, `lib/canvas-helpers.ts`.
- Case-study pages untouched.

## Responsive

- Breakpoints: mobile ≤640, tablet ≤1024, desktop >1024.
- `clamp()` type scale; grids collapse 3→2→1; hamburger below 900px.

## Non-goals

- New photography/real case-study content.
- CMS. Data stays as TS modules.
- Additional case-study pages beyond existing.
