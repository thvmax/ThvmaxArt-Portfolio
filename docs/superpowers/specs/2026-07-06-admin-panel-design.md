# Admin Panel — Design

Date: 2026-07-06
Status: Approved

## Goal

A password-protected `/admin` panel where the site owner can edit every piece
of site content — projects (including case-study blocks and galleries),
disciplines, services, experience, skills, marquee, stats, and site copy
(hero statement, about bio, contact details) — and upload images/videos.
No external CMS, no database.

## Architecture (Vercel + GitHub storage)

- All editable content lives in `content/data.json`. The public site imports
  it at build time, so every page stays fully static.
- `lib/data.ts` keeps the TypeScript interfaces and re-exports typed values
  from the JSON, so existing component imports keep working.
- Saving in the admin panel commits the updated `content/data.json` to the
  GitHub repo via the Contents API. Vercel auto-redeploys; changes are live
  in about a minute. Git history doubles as content versioning/rollback.
- Uploads are committed to `public/uploads/` the same way and referenced by
  path. Files over ~10 MB are rejected with a hint to use an external URL
  (GitHub API limits; large video belongs on a CDN anyway).
- Local development fallback: when `GITHUB_TOKEN` is unset, the content and
  upload APIs read/write the local filesystem directly.

## Auth

- Credentials come from env vars `ADMIN_USER` and `ADMIN_PASSWORD`;
  comparison is constant-time.
- Successful login sets an httpOnly, secure, sameSite=lax session cookie —
  a JWT signed with `SESSION_SECRET` (jose, HS256, 7-day expiry).
- `middleware.ts` verifies the JWT on every `/admin/*` page and
  `/api/admin/*` route except the login page/endpoint.

## Routes & modules

| Path | Purpose |
| --- | --- |
| `app/admin/login/page.tsx` | Login form |
| `app/admin/page.tsx` + components | Panel UI |
| `app/api/admin/login/route.ts` | POST credentials → session cookie |
| `app/api/admin/logout/route.ts` | Clear cookie |
| `app/api/admin/content/route.ts` | GET latest JSON / PUT commit update |
| `app/api/admin/upload/route.ts` | POST file → commit to public/uploads |
| `lib/github.ts` | GitHub Contents API get/put helpers |
| `lib/adminSession.ts` | JWT sign/verify helpers |
| `middleware.ts` | Session gate |

## Panel UI

Single-page client panel, sidebar of sections: Site, Disciplines, Projects,
Services, Experience, Toolkit (skills), Marquee, Stats. Content loads via
GET (always the latest committed version, not the build-time copy), edits
happen in client state, one "Save & publish" button PUTs the whole JSON.
Projects get the richest editor: all fields, discipline tags, optional
case-study editor (blocks + gallery with per-image upload), cover
image/video upload.

## Env vars (Vercel + .env.local)

- `ADMIN_USER`, `ADMIN_PASSWORD` — panel credentials
- `SESSION_SECRET` — random 32+ char string for JWT signing
- `GITHUB_TOKEN` — fine-grained PAT, Contents read/write on this repo only
- `GITHUB_REPO` — e.g. `thvmax/ThvmaxArt-Portfolio`
- `GITHUB_BRANCH` — default `main`

## Out of scope (v1)

- Multiple users/roles, password reset flows
- Instant publish (accepted ~1 min rebuild)
- Image editing/cropping in the panel
