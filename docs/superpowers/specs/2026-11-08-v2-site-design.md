# THVMAX v2 — Multi-page Site (ThvmaxArt Website 2026)

Date: 2026-11-08
Reference: `ThvmaxArt Design Website Figma File/ThvnaxArt Website 2026.fig`
Status: Implemented (current production)

> This spec supersedes the three July-2026 specs in this folder
> (`portfolio-redesign`, `silent-house-redesign`, `discipline-subpages`),
> which document earlier iterations that were later replaced by the v2
> multi-page build.

## Goal

Move the portfolio from a single-page scroller to a **multi-page, monochrome
editorial site** driven by a single content module. One route per Figma frame,
with a persistent chrome (smooth scroll, nav, cursor, route transition) that
survives navigation.

## Figma source

The design is the "ThvmaxArt Website 1" system in
`ThvnaxArt Website 2026.fig`. Frames map to routes as follows:

| Figma frame | Route |
|---|---|
| 01 Home | `/` |
| 02 Work | `/work` |
| 03 Project — STING (template) | `/work/[slug]` (10 studies) |
| 04 About | `/about` |
| 05 Contact | `/contact` |
| State — Menu open | nav overlay |
| Services (added 2026-11-08) | `/services` + `/services/[slug]` |

## Design system (`app/site.css`)

- Scoped under `.v2`. **Monochrome ~70/30** — near-black canvas, off-white
  type; no third colour. Colour enters only through the work itself.
- Role tokens only — every rule is written against roles, never values.
  Dark default: `--bg #0b0c0d`, `--raised #141618`, `--fg #f2f2f0`,
  `--muted #8a8f94`, hairline `--line`/`--line-soft`. Light inverts to
  `--bg #f4f4f1`, `--fg #101215`.
- Type: **Geist** (display/sans), **Geist Mono** (labels/meta), **Instrument
  Serif** (italic accent). Fluid `clamp()` scale measured off the 1920px frame.
- Fonts load from the Google CSS API (not `next/font`, as they aren't in this
  Next version's list).

## Routes & components

### Persistent chrome (`app/components/V2Frame.tsx`)
Lenis smooth scroll + `PageTransition` + `V2Nav` + `Cursor` render once in the
layout, so the route wipe, scroll state and cursor survive page changes.

### `/` — Home (`app/page.tsx`)
- `V2Intro` — first-visit only (sessionStorage), count-to-100 over discipline
  words, then the panel lifts off on the same curved edge the route wipe uses.
  Fires `INTRO_DONE`; reduced-motion users skip straight to the hero.
- `V2Hero` — masked line reveal of the headline, staggered, waits for intro.
- Full-bleed showreel (`/case-studies/sting-night-life/hero-video.mp4`).
- `WorkIndex` (limit 5) — selected-work rows with a cursor-tracked tonal
  preview plate; "View all ten projects" links to `/work`.

### `/work` — Work (`app/components/WorkMarquee.tsx`)
A locked viewport holding an infinite horizontal marquee: three identical
sets drift left and wrap by one set width. Wheel and drag/throw add momentum.
Hovering a card fills a bottom caption and locks the cursor label.

### `/work/[slug]` — Case study (`app/components/CaseStudy.tsx`)
`generateStaticParams` + `generateMetadata` per project. Plate/still imagery
scroll-scrubs (parallax), chapters + deliverables + result, and a "next
project" footer. 10 studies, driven entirely by `v2content.ts`.

### `/about` — About (`app/components/AboutSection.tsx`)
Bio statement, cursor-tilt portrait, animated stat counters, experience rows,
toolkit + education columns, closing `Band` CTA.

### `/contact` — Contact (`app/components/ContactSection.tsx`)
Large email `Pill`, fact grid (phone/based/status/languages), social links,
footer.

### `/services` — Services (`app/components/ServiceDetail.tsx`)
Hub listing three disciplines (art direction, motion & production, product &
UI), each with its own `/services/[slug]` detail page: H1 + SEO lead, "what I
deliver" list, and deep-linked related work.

### Atoms
`Reveal` (IntersectionObserver scroll-in), `ScrambleLabel` (mono label
self-decodes), `Pill` (magnetic CTA), `StatCounter`, `Band` (dark closing
block), `ThemeToggle`, `LockScroll`, `Cursor`, `SmoothScroll`.

## Motion system

- Single shared **Lenis** instance (lerp 0.055) synced with GSAP
  `ScrollTrigger`.
- Scroll-scrub parallax on case-study imagery; mask-up line reveals; stagger
  reveals via IntersectionObserver.
- Route transition is a curved-edge clip wipe — deliberately the same shape as
  the intro lift, so first movement and every movement after share one shape.
- Theme switch dissolves every surface over ~460ms with a glow leaving the dial.
- `prefers-reduced-motion` respected everywhere (reveals instant, parallax off,
  intro skipped).

## Data model (`lib/v2content.ts`)

Single source of copy — no CMS, no JSON. Exports:
`v2Site`, `v2Intro`, `v2Nav`, `v2Social`, `v2ContactLinks`, `v2Services`,
`v2ServicesSection`, `v2Work` (10 `V2Project`s with optional `study`),
`v2Home`, `v2WorkSection`, `v2WorkPage`, `v2About`, `v2Contact`, plus helpers
`findProject`, `nextProject`, `findService`, `plate()` (accent-gradient plate
standing in for artwork until real assets land).

## SEO

- All pages indexable (no `noindex`); canonical URLs per route.
- `app/robots.ts` → `/robots.txt`; `app/sitemap.ts` → `/sitemap.xml`.
- JSON-LD `Person` schema in the layout.
- Dynamic `app/opengraph-image.tsx` share card; `app/icon.svg` favicon.
- `themeColor` + `color-scheme` for matching browser chrome.

## Files

```
app/
  layout.tsx                 metadata, viewport, fonts, theme no-flash, JSON-LD
  page.tsx                   Home
  site.css                   design tokens + all v2 styles
  robots.ts / sitemap.ts     crawler metadata
  opengraph-image.tsx        social share card
  icon.svg                   favicon
  work/page.tsx              marquee
  work/[slug]/page.tsx       10 case studies
  about/page.tsx
  contact/page.tsx
  services/page.tsx
  services/[slug]/page.tsx   3 discipline pages
  components/                V2Frame, V2Nav, V2Intro, V2Hero, WorkIndex,
                             WorkMarquee, CaseStudy, AboutSection,
                             ContactSection, ServiceDetail, Band, Pill, Reveal,
                             ScrambleLabel, StatCounter, ThemeToggle, Cursor,
                             PageTransition, LockScroll, SmoothScroll
lib/v2content.ts             all site copy + types
```

## Responsive

Breakpoints 1100 / 900 / 640. Project rows collapse to `num + name + arrow`
below 1100px; grids collapse 4→2→1; nav links hide below 900px behind the
full-screen menu overlay; the cursor-tracking preview plate is hidden on
coarse pointers.

## Testing

- `npm run build` passes (lint + types) — 24 routes generated.
- Manual: first-visit intro, route wipe, marquee drag/wheel, theme toggle,
  mobile menu, keyboard focus, reduced-motion spot check.
