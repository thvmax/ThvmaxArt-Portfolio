# THVMAX — Portfolio (Next.js)

Next.js 14 port of Thuta Soe's portfolio. Preserves the original design, GSAP animations, custom cursor, hero slider, sticky scroll work section, drag-scroll showcase, and project detail overlay.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **React 18**
- **GSAP 3.12** + **@gsap/react** + **ScrollTrigger** + **ScrollToPlugin**
- **next/font** (Syne + DM Sans, auto-optimized)
- **next/image** ready (currently using `<img>` for GSAP slider compatibility; see notes)

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Build for production:

```bash
npm run build
npm start
```

## Project Structure

```
thvmax-portfolio/
├── app/
│   ├── layout.tsx            # Root layout, Google Fonts
│   ├── page.tsx              # Entry (server component)
│   ├── globals.css           # All styles ported from HTML
│   └── components/
│       └── Portfolio.tsx     # Main client component with GSAP + JSX
├── lib/
│   ├── projects.ts           # Projects + showcase data
│   └── canvas-helpers.ts     # Procedural gradient canvas draw functions
├── public/
│   └── images/
│       └── sting-nightlife/  # Hero slider + loader images (1.jpg–4.jpg)
├── package.json
├── next.config.mjs
├── tsconfig.json
└── .gitignore
```

## Deployment

This project is ready to deploy on **Vercel** with zero config:

1. Push to GitHub
2. Import the repo at https://vercel.com/new
3. Deploy

Vercel auto-detects Next.js and configures everything.

## Customization

### Replace the hero images
Drop new images into `public/images/sting-nightlife/` and update the `heroSlides` and `loaderImages` arrays at the top of `app/components/Portfolio.tsx`.

### Add a new project
Edit `lib/projects.ts` — add an entry to the `projects` array. The work list, detail overlay, and sticky-scroll canvases all update automatically.

### Change fonts
Edit `app/layout.tsx` — swap the Google Font imports. The CSS variables `--font-display` and `--font-body` are injected automatically.

### Update contact info
Edit the `contact-links` block at the bottom of the About section in `Portfolio.tsx`. The email currently has a placeholder — replace `mailto:thutasoe@example.com` with your real email.

## Notes

- The hero slider uses plain `<img>` tags instead of `next/image` because GSAP reads and writes `.src` dynamically for the cross-fade capsule. If you want to convert it, you'll need to restructure to use React state for the slide index and let `next/image` re-render.
- Project detail pages render procedurally generated canvases (matching the original HTML). To replace them with real project images, update `openProject()` in `Portfolio.tsx` to render `<img>` elements instead of drawing to canvas.
- The custom cursor is automatically disabled on mobile (`@media (max-width: 768px)` in globals.css).

## License

Personal portfolio — do not reuse the design without permission.
