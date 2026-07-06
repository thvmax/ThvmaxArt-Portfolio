# Discipline Subpages — Design

Date: 2026-07-06
Status: Approved

## Goal

Each of the three discipline cards in the Divisions section gets its own subpage
(like thvmaxart.com/artdirection), reached via the "Learn more" button. Each
subpage lists the projects belonging to that discipline (reference:
silent-house.com/project). Clicking a project opens the existing case-study modal.

## Routes

Three explicit route folders, hyphenated slugs:

- `app/art-direction/page.tsx`
- `app/motion-production/page.tsx`
- `app/digital-ui/page.tsx`

Each is a thin server component: metadata + `<DisciplinePage slug="…" />`.
This matches the existing per-folder pattern (`app/sting-night-life/`).

## Data (`lib/data.ts`)

- New `Discipline` interface: `slug`, `title`, `desc`, `gradient`. The three
  division definitions move out of `Divisions.tsx` into an exported
  `disciplines` array — single source of truth.
- New optional `disciplines?: string[]` field on `Project` (slug references).
  Initial tagging:
  - STING Nightlife Campaign → `art-direction`
  - Pepsi Titan Wall Art → `art-direction`
  - Pepsi Talent Development → `art-direction`
  - Pepsi Meals AR Campaign → `motion-production`, `art-direction`
  - Velosi ERP Software UI/UX → `digital-ui`
- Each Divisions card also keeps its featured `project` name.

## Shared component (`app/components/DisciplinePage.tsx`, client)

- Fixed nav: THVMAX logo + "Back to Portfolio" (pattern from case-study pages).
- Hero: discipline title (large), description, gradient accent band,
  project count.
- Project list: full-width rows/large cards — media (video > img > hue block),
  name, category, year. Click opens `CaseStudyModal` via local state with the
  same body-overflow lock used in `Site.tsx`.
- Projects are filtered from `works` by discipline slug, so adding a project
  later only requires tagging it in `data.ts`.

## Divisions.tsx change

"Learn more" becomes a `<Link href={`/${d.slug}`}>` to the subpage. The
featured project card keeps its modal `onOpen` behavior.

## Styling

New `app/components/discipline.module.css` (dark theme, consistent with the
existing site look). No changes to global styles beyond what the shared
component needs.

## Verification

- `npm run build` passes.
- All three routes render; modal opens/closes; back link returns home.
