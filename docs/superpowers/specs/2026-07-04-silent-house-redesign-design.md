# THVMAX v2 — Silent-House-Direction Redesign

Date: 2026-07-04
Reference: https://silent-house.com/

## Goal

Upgrade the portfolio to a silent-house-style image-driven editorial site:
full-bleed imagery, huge grotesque display type, scroll-scrub motion,
parallax, refined interactions. Full visual redesign; content and data
model unchanged.

## Decisions

- **Scope**: full redesign of layout/animation/typography. Sections kept:
  hero, work, services, about, contact.
- **Images**: real project images will be supplied over time; every image
  slot falls back to the existing hue-gradient placeholder. Sting
  Nightlife already has real assets in `/public/case-studies/sting-night-life/`.
- **Theme**: light/dark toggle stays. Dark = near-black + warm amber accent;
  light = warm cream + black.
- **Typography**: display swaps Syne → Archivo (tight grotesque, wide weight
  range); body stays DM Sans. Hero ~10vw, section titles ~6vw, uppercase
  micro-labels.
- **Hero**: full-viewport, featured-work images full-bleed behind, ~5s
  crossfade cycle with slow Ken Burns zoom, slide counter, huge overlaid
  name/role type with mask-up line reveals, scroll indicator, parallax on
  scroll-out (image moves slower than text).
- **Work showcase**: replaces hover-index. Large image cards — first card
  full-width, following cards in alternating 60/40 pairs. Each card:
  scroll-scrub inner parallax, scale-in reveal (1.15 → 1 inside clipped
  frame), big title, category + year labels, hover scale + title slide.
  Click opens existing case-study modal (restyled to match).
- **Services**: editorial rows, bigger type, index numbers, border draw-in
  on scroll.
- **About**: big display-type bio statement with line-stagger reveal;
  experience list + toolkit beside it.
- **Contact**: huge email type filling width; magnetic hover on links.
- **Nav**: minimal fixed bar — logo left, links right, theme toggle,
  hide-on-scroll-down kept. Nav marquee removed. Mobile overlay menu kept.
- **Motion system**: single shared Lenis instance + GSAP ScrollTrigger sync;
  mask reveals for type; scrub parallax on all imagery; stagger reveals;
  `prefers-reduced-motion` respected (reveals become instant, parallax off).

## Architecture

Split the 547-line `Portfolio.tsx` mega-component into section components:

```
app/components/
  Site.tsx            client composer: Lenis + ScrollTrigger sync, modal state
  Nav.tsx             fixed nav + mobile menu + ThemeToggle
  Hero.tsx            full-bleed cycling hero
  WorkShowcase.tsx    image-card project grid
  Services.tsx        editorial service rows
  About.tsx           bio statement + experience + toolkit
  Contact.tsx         big-email contact + footer
  CaseStudyModal.tsx  extracted, restyled case-study modal
  ThemeToggle.tsx     unchanged
```

- `app/page.tsx` renders `<Site />`.
- `app/layout.tsx` font swap Syne → Archivo.
- `app/globals.css` rewritten with design tokens (both themes).
- `lib/data.ts` shape unchanged; Sting entry gets real `img` paths.
- Old `Portfolio.tsx` and `LenisProvider.tsx` deleted (Lenis moves into
  `Site.tsx`).

## Error handling / edge cases

- Missing `img` → hue-gradient block everywhere (hero, cards, modal).
- Touch devices: hover effects gated behind `(pointer: fine)`; parallax
  reduced on small screens.
- `prefers-reduced-motion`: no scrub/parallax, instant reveals.
- StrictMode double-mount: all GSAP via `gsap.context`/`useGSAP` with revert.

## Testing

- `npm run build` passes (type + lint).
- Manual: scroll full page both themes, open/close modal, mobile menu,
  keyboard focus on cards, reduced-motion spot check.
