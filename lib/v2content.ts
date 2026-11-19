// ─── Content for the v2 layout (Figma: "ThvmaxArt Website 1") ────────
// Copy is taken verbatim from the Figma frames 02 Work / 03 Project —
// STING / 04 About / 05 Contact / State — Menu open. This file is the
// single source of site copy. Artwork lives in /public/work/<slug>/.

import { workMedia } from './workMedia';

export type V2Span = 'full' | 'half' | 'third' | 'quarter';

export interface V2Still {
  label: string;      // caption, first line
  note?: string;      // caption, second voice
  src?: string;       // artwork in /public/work/<slug>/
  video?: string;
  w?: number;         // intrinsic size, so the frame keeps the artwork's proportions
  h?: number;
  grade?: number;     // 0–1 darkening pass over the gradient plate (no artwork yet)
  span?: V2Span;      // consecutive stills of one span share a row
}

export interface V2Chapter {
  label: string;      // THE BRIEF / THE IDEA / MY ROLE
  heading: string;
  body: string;
  media?: V2Still[];  // frames that follow this chapter
}

export interface V2Study {
  lede: string;
  client: string;
  role: string;
  year: string;
  deliverables: string;
  chapters: V2Chapter[];
  stills: V2Still[];  // frames after the last chapter
  result?: {
    figure: string;
    caption: string;
    body: string;
  };
}

/** The opening frame of a case study: one image or film edge to edge, or a set of pieces laid side by side on the project's colour. */
export interface V2Hero {
  src?: string;
  video?: string;
  set?: V2Still[];
}

export interface V2Project {
  slug: string;
  name: string;
  nameLines: string[];  // display break for the preview plate / hero
  cat: string;          // mono meta line, e.g. "FMCG · Campaign"
  year: string;         // empty when the source gives no date
  accent: string;       // the project's own colour — artwork is never desaturated
  cover?: string;       // 3:4 thumbnail — the project's one card in the Work cluster
  hero?: V2Hero;
  study?: V2Study;
}

// ─── Artwork helpers ─────────────────────────────────────────────────

/** A frame from /public/work/<slug>/<name>.jpg, sized from workMedia. */
const pic = (slug: string, name: string, label: string, note = '', span: V2Span = 'full'): V2Still => {
  const [w, h] = workMedia[slug]?.[name] ?? [1600, 1000];
  return { src: `/work/${slug}/${name}.jpg`, w, h, label, note, span };
};
const cov = (slug: string, name: string) => `/work/${slug}/cover-${name}.jpg`;
const art = (slug: string, name: string) => `/work/${slug}/${name}.jpg`;

export const v2Site = {
  name: 'THVMAX',
  owner: 'THVMAX — THU TA SOE',
  copyright: '2026 © ALL RIGHTS RESERVED',
  email: 'thutasoe24@gmail.com',
  phone: '+971 56 577 6382',
  phoneHref: '+971565776382',
  based: 'Dubai, UAE',
  status: 'Available immediately',
  languages: 'English · Burmese',
  menuFooter: 'DUBAI, UAE  ·  AVAILABLE NOW',
};

export const v2Intro = {
  // five lines, set three times down the screen like verses
  lines: ['THVMAX — THU TA SOE', 'ART DIRECTION', 'MOTION & PRODUCTION', 'PRODUCT & UI DESIGN', 'DUBAI, UAE — 2026'],
};

// One route per page — the site is multi-page, not a one-pager.
export const v2Nav = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const v2Social = [
  { label: 'LinkedIn', handle: 'linkedin.com/in/thu-ta-soe', href: 'https://linkedin.com/in/thu-ta-soe' },
  { label: 'Behance', handle: 'behance.net/Thvmax', href: 'https://behance.net/Thvmax' },
  { label: 'Instagram', handle: 'instagram.com/thvmax', href: 'https://instagram.com/thvmax' },
  { label: 'Portfolio', handle: 'bit.ly/4eEx9OB', href: 'https://bit.ly/4eEx9OB' },
];

// Contact frame lists LinkedIn / Behance / Portfolio; the menu overlay
// lists LinkedIn / Behance / Instagram.
export const v2ContactLinks = v2Social.filter((s) => s.label !== 'Instagram');

// ─── Reach ───────────────────────────────────────────────────────────
// Where the work has been made and where it is offered. Shown on About
// and mirrored in the structured data (areaServed), so search engines
// connect the name to Myanmar, the UAE / Middle East and remote work.

export const v2Reach = {
  label: 'WHERE I WORK',
  heading: 'Rooted in Myanmar, based in Dubai, working worldwide.',
  regions: [
    {
      name: 'Myanmar',
      place: 'Yangon',
      body: 'Where the career started — campaign art direction and production for Pepsi-Cola Myanmar (STING, Pepsi, Mirinda, 7UP), AIA, A Life Insurance and BUC. Native Burmese, so local briefs need no translation.',
    },
    {
      name: 'UAE & Middle East',
      place: 'Dubai · Abu Dhabi · GCC',
      body: 'Based in Dubai. Design lead at Velosi Asset Integrity in Abu Dhabi — brand, social and product UI. Available for senior creative roles and freelance across the UAE, Saudi Arabia, Qatar and the wider GCC.',
    },
    {
      name: 'Worldwide',
      place: 'Remote',
      body: 'Art direction, motion and product design delivered remotely for brands and agencies in any time zone, in English or Burmese.',
    },
  ],
};

// Countries and regions, for structured data (schema.org areaServed).
export const v2AreaServed = [
  'Myanmar',
  'United Arab Emirates',
  'Saudi Arabia',
  'Qatar',
  'Kuwait',
  'Bahrain',
  'Oman',
  'Middle East',
  'Southeast Asia',
  'Worldwide',
];

const STING = 'sting-nightlife-repositioning';
const TITAN = 'pepsi-titan-wall-art';
const MEALS = 'pepsi-meals-ar-campaign';
const VELOSI = 'velosi-brand-channel';
const TALENT = 'pepsi-talent-development';
const MANDALAY = 'aia-mandalay-office-opening';
const SOCIAL = 'pepsico-social-advertising';
const CAL = 'pepsi-2024-calendar';
const POSM = 'pepsi-mt-posm';
const INS = 'insurance-social-advertising';
const TM = 'truemoney-social-advertising';
const MEMBER = 'aia-member-propositions';
const PROFILE = 'pepsi-company-profile';
const SKIN = 'skin-town-identity';
const AHTA = 'a-hta-identity';
const INSIGHT = 'insight-3d-identity';
const LOGOS = 'logofolio';
const IREMIA = 'iremia-meditation-app';
const RETOUCH = 'product-retouch';
const STING_FILM = '/case-studies/sting-night-life/';

export const v2Work: V2Project[] = [
  {
    slug: STING,
    name: 'STING Nightlife Campaign',
    nameLines: ['STING Nightlife', 'Campaign'],
    cat: 'FMCG · Campaign',
    year: '2024',
    accent: 'rgb(217, 199, 33)',
    cover: cov(STING, 'kv-final'),
    hero: { video: STING_FILM + 'hero-video.mp4', src: art(STING, 'hero') },
    study: {
      lede: 'Taking an energy drink into the night — and growing its share while doing it.',
      client: 'Pepsi-Cola Myanmar — STING Energy Drink',
      role: 'Art direction, visualisation, campaign and TVC production management',
      year: 'Dec 2024',
      deliverables: 'Key visual, TVC cutdown,\nend-frame KV animation',
      chapters: [
        {
          label: 'THE BRIEF',
          heading: 'Give STING a reason to be reached for after dark.',
          body: 'The nightlife commercial launch took STING to a new audience — the late hours, where energy is about the night out rather than the next shift. The key visual had to feel bold, fresh and energising, with the nightlife essence up front and the brand’s look and feel intact.',
          media: [
            pic(STING, 'kv-draft', 'Draft KV', 'AI composition', 'half'),
            pic(STING, 'kv-final', 'Final KV', 'Shot with the model', 'half'),
          ],
        },
        {
          label: 'THE KEY VISUAL',
          heading: 'Drafted with AI, finished with a real shoot.',
          body: 'We first built the KV composition with AI — placing the brand elements and readjusting the perspective so the photoshoot had an exact target. The final visual was then shot with the actual model and finished in post.',
          media: [
            pic(STING, 'dj', 'Mood reference', 'Nightlife energy', 'third'),
            pic(STING, 'model', 'Photoshoot', 'Campaign talent', 'third'),
            pic(STING, 'crowd', 'On the floor', 'Launch night', 'third'),
            pic(STING, 'event', 'Launch event', 'Venue'),
          ],
        },
        {
          label: 'MY ROLE',
          heading: 'Art direction through to broadcast.',
          body: 'Working with the Pepsi brand and creative team, I led art direction and visualisation, then managed campaign and TVC production — the cutdown and the animated end-frame KV — so every format closed on the same image.',
          media: [
            pic(STING, 'thematic-kv', 'Thematic KV', 'Nightlife', 'half'),
            pic(STING, 'product-kv', 'Product KV', 'B3 · B6 · B12', 'half'),
          ],
        },
      ],
      stills: [
        pic(STING, 'interior', 'Venue build', 'LED installation', 'half'),
        pic(STING, 'booth', 'Mini dance booth', 'Activation', 'half'),
        pic(STING, 'event-poster', 'Event poster', 'Announcement', 'half'),
        pic(STING, 'kv-qr', 'Retail KV', 'With QR', 'half'),
      ],
      result: {
        figure: '≈10%',
        caption: 'market share increase for STING following the nightlife campaign.',
        body: 'One image, carried from the key visual into the broadcast cutdown and the closing animated frame.',
      },
    },
  },
  {
    slug: TITAN,
    name: 'Pepsi Titan Wall Art',
    nameLines: ['Pepsi Titan', 'Wall Art'],
    cat: 'FMCG · Environmental',
    year: '2024',
    accent: 'rgb(214, 84, 84)',
    cover: cov(TITAN, 'hero'),
    hero: { src: art(TITAN, 'hero') },
    study: {
      lede: 'A surreal wall for Pepsi Myanmar’s new office — modern Pepsi energy drawn over traditional Myanmar motifs.',
      client: 'Pepsi-Cola Myanmar',
      role: 'Art direction · Visualisation',
      year: 'Apr 2024',
      deliverables: 'Wall art, 3D mockups,\nmerch, illustrations, wallpaper',
      chapters: [
        {
          label: 'THE IDEA',
          heading: 'Pepsi’s energy and Myanmar’s heritage on one wall.',
          body: 'For the new office I created a surreal wall art that blends a modern, vibrant style with traditional Myanmar elements. It captures Pepsi’s dynamic brand identity while celebrating the country’s cultural heritage — a piece that reads as local and contemporary at once.',
          media: [pic(TITAN, 'wall', 'Wall art', 'Full spread')],
        },
        {
          label: 'THE CRAFT',
          heading: 'Composed to the room, previewed in 3D.',
          body: 'The composition was adjusted to the office interior, and I built a 3D view of the wall to preview it in place. Keeping the essence of the Pepsi Titan brand, I chose a look that is bold, vibrant, artistic, youthful and surreal — right for the people who work in front of it every day.',
          media: [
            pic(TITAN, 'render-1', '3D mockup', 'Main wall', 'half'),
            pic(TITAN, 'render-2', '3D mockup', 'Second wall', 'half'),
          ],
        },
        {
          label: 'BEYOND THE WALL',
          heading: 'One illustration set, many surfaces.',
          body: 'The same artwork carried onto merchandise, sticker illustrations, wallpapers and the 11th-anniversary office branding, so the wall became a system the whole office uses rather than a one-off mural.',
          media: [
            pic(TITAN, 'merch', 'Merch', 'Sweatshirt', 'third'),
            pic(TITAN, 'stickers', 'Illustrations', 'Sticker set', 'third'),
            pic(TITAN, 'office-brand', 'Office branding', '11th anniversary', 'third'),
          ],
        },
      ],
      stills: [pic(TITAN, 'wallpaper', 'Wallpaper', 'Desktop')],
    },
  },
  {
    slug: MEALS,
    name: 'Pepsi Meals AR Campaign',
    nameLines: ['Pepsi Meals', 'AR Campaign'],
    cat: 'FMCG · AR Experience',
    year: '2024',
    accent: 'rgb(64, 132, 214)',
    cover: cov(MEALS, 'kv'),
    hero: { src: art(MEALS, 'hero') },
    study: {
      lede: 'An AR filter for the 2024 Pepsi Meals campaign — the can and the meal, together on screen.',
      client: 'Pepsi-Cola Myanmar',
      role: 'Art direction · AR visualisation',
      year: 'Mar 2024',
      deliverables: 'AR filter look, campaign KV,\nsocial posts',
      chapters: [
        {
          label: 'THE BRIEF',
          heading: 'Make Pepsi part of the meal.',
          body: 'The 2024 Pepsi Meals campaign launched an AR filter to strengthen the brand’s presence in the Pepsi + Meals category. I was assigned to visualise the filter and give it art direction.',
          media: [
            pic(MEALS, 'kv', 'Campaign KV', 'Filter launch', 'half'),
            pic(MEALS, 'reminder', 'Reminder post', 'Prize mechanic', 'half'),
          ],
        },
        {
          label: 'THE FILTER',
          heading: 'Familiar dishes, served with the can.',
          body: 'Each filter state pairs the Pepsi can with a Myanmar dish, styled as a glowing 3D plate and lettered in Burmese — a set of looks people could cycle through, capture and share.',
          media: [
            pic(MEALS, 'filters', 'Filter states', 'In-app captures', 'half'),
            pic(MEALS, 'model', 'Campaign talent', 'Pepsi + Meals', 'half'),
          ],
        },
      ],
      stills: [pic(MEALS, 'dishes', 'AR dishes', 'Samples')],
    },
  },
  {
    slug: VELOSI,
    name: 'Velosi Brand Channel',
    nameLines: ['Velosi Brand', 'Channel'],
    cat: 'Engineering · Social',
    year: '2026',
    accent: 'rgb(56, 168, 178)',
    cover: cov(VELOSI, 'eid-al-etihad'),
    hero: {
      set: [
        pic(VELOSI, 'commemoration-day', 'UAE Commemoration Day'),
        pic(VELOSI, 'ramadan', 'Ramadan Kareem'),
        pic(VELOSI, 'eid-al-etihad', 'Eid Al Etihad'),
      ],
    },
    study: {
      lede: 'An always-on social channel for an asset-integrity group in Abu Dhabi — national days, seasons and causes, grown from 45K to 75K followers.',
      client: 'Velosi Asset Integrity — Abu Dhabi, UAE',
      role: 'Senior Creative Designer / Design Lead',
      year: '2024 — 26',
      deliverables: 'Channel system, social posts,\nmotion templates',
      chapters: [
        {
          label: 'THE CHANNEL',
          heading: 'An engineering brand that shows up for the moment.',
          body: 'The channel marks the dates Velosi’s people and clients care about — UAE Commemoration Day, Eid Al Etihad, Ramadan, World Environment Day, Women’s Day and the national days of the countries the group works in — each in the brand’s own blue and type.',
          media: [
            pic(VELOSI, 'environment-day', 'World Environment Day', '5 June', 'third'),
            pic(VELOSI, 'womens-day', 'Women’s Day', '8 March', 'third'),
            pic(VELOSI, 'independence-day', 'Vietnam National Day', '2 September', 'third'),
          ],
        },
        {
          label: 'THE SYSTEM',
          heading: 'One frame, many occasions.',
          body: 'Every post sits on the same footer, logo lock-up and type hierarchy, so the feed reads as one brand however different the subject — and a new post can be produced quickly without redrawing the system.',
        },
      ],
      stills: [],
    },
  },
  {
    slug: TALENT,
    name: 'Pepsi Talent Development',
    nameLines: ['Pepsi Talent', 'Development'],
    cat: 'FMCG · Employer brand',
    year: '2024',
    accent: 'rgb(46, 106, 196)',
    cover: cov(TALENT, 'kv'),
    hero: { src: art(TALENT, 'hero') },
    study: {
      lede: 'A talent programme identity for Gen Z — Pepsi’s energy, set in a galaxy of stars.',
      client: 'Pepsi-Cola Myanmar — with the HR team',
      role: 'Art direction · Key visual',
      year: 'Mar 2024',
      deliverables: 'Key visuals, emblem,\nholding cards, standees',
      chapters: [
        {
          label: 'THE BRIEF',
          heading: 'Bring young talent to Pepsi.',
          body: 'The Talent Development Program helps young people follow their passion and explore their future careers. My goal was to bring out the aesthetic essence of the Pepsi brand so the programme would appeal to Gen Z applicants.',
          media: [
            pic(TALENT, 'kv', 'Main KV', 'Embark your new journey', 'half'),
            pic(TALENT, 'thematic', 'Thematic KV', 'The emblem', 'half'),
          ],
        },
        {
          label: 'THE CONCEPT',
          heading: 'Stars for the applicants, an emblem for the chosen.',
          body: 'The stars in the galaxy represent the hardworking talents applying for the programme. The emblem — a ring of glowing glass forms — stands for the outstanding trainees selected from them.',
          media: [pic(TALENT, 'standee', 'Standees', 'Launch event')],
        },
      ],
      stills: [
        pic(TALENT, 'card', 'Holding card', 'Recruitment', 'half'),
        pic(TALENT, 'emblem', 'Emblem', 'Glass render', 'half'),
      ],
    },
  },
  {
    slug: MANDALAY,
    name: 'AIA Mandalay Office Opening',
    nameLines: ['AIA Mandalay', 'Office Opening'],
    cat: 'Insurance · Key visual',
    year: '2022',
    accent: 'rgb(198, 68, 96)',
    cover: cov(MANDALAY, 'visual'),
    hero: { src: art(MANDALAY, 'hero') },
    study: {
      lede: 'A launch key visual for AIA’s new Mandalay office, built from the city’s own landmarks.',
      client: 'AIA Myanmar — Marketing team',
      role: 'Creative Designer',
      year: 'Dec 2022',
      deliverables: 'Office-opening key visual,\nto AIA Myanmar brand guidelines',
      chapters: [
        {
          label: 'THE BRIEF',
          heading: 'Open a new office in a city with its own icons.',
          body: 'For the launch of the AIA Mandalay office I created a visual that sets the new building among traditional elements of the city — making the office feel unique to Mandalay while following the AIA Myanmar brand guidelines.',
          media: [pic(MANDALAY, 'visual', 'Launch key visual', 'AIA’s new Mandalay Office is now open')],
        },
        {
          label: 'THE ELEMENTS',
          heading: 'The palace, the umbrellas, the office itself.',
          body: 'Three references carry the composition: Mandalay Palace and its moat, the hand-painted Mandalay umbrellas, and the new office interior — each placed so the city is recognisable at a glance.',
          media: [
            pic(MANDALAY, 'umbrellas', 'Mandalay umbrella', 'Craft', 'third'),
            pic(MANDALAY, 'palace', 'Mandalay Palace', 'Landmark', 'third'),
            pic(MANDALAY, 'office', 'Mandalay office', 'Interior', 'third'),
          ],
        },
      ],
      stills: [],
    },
  },
  {
    slug: 'velosi-erp-software',
    name: 'Velosi ERP Software UI/UX',
    nameLines: ['Velosi ERP', 'Software UI/UX'],
    cat: 'Enterprise · Product',
    year: '2025',
    accent: 'rgb(58, 122, 224)',
    study: {
      lede: 'Turning a dense internal ERP into a calm, usable product engineers actually want to open.',
      client: 'Velosi Asset Integrity — Abu Dhabi',
      role: 'Product & UI/UX Designer',
      year: '2024 — 25',
      deliverables: 'UX research, IA, design\nsystem, high-fidelity UI',
      chapters: [
        {
          label: 'THE PROBLEM',
          heading: 'The system worked, but it fought its users.',
          body: 'Operators juggled dozens of data-heavy modules with inconsistent patterns, slow task flows and high training overhead. Every module had been built by a different team at a different time, so nothing behaved the same way twice.',
        },
        {
          label: 'THE APPROACH',
          heading: 'Audit the journeys, then build the system underneath.',
          body: 'I audited the core journeys, restructured the information architecture, and defined a component-driven design system — consistent tables, forms, states and navigation — so new modules inherit the pattern instead of inventing one.',
        },
        {
          label: 'THE OUTCOME',
          heading: 'Clearer hierarchy, faster task paths, a reusable library.',
          body: 'High-fidelity screens with sharper hierarchy and shorter task paths, plus a UI library that lets the team ship new modules without reinventing the interface each time.',
        },
      ],
      stills: [
        { label: 'Dashboard overview', note: 'Desktop', grade: 0.22, span: 'half' },
        { label: 'Module screen', note: 'Inspection flow', grade: 0.44, span: 'half' },
        { label: 'Component library', note: 'Design system', grade: 0.22, span: 'third' },
        { label: 'Responsive views', note: 'Tablet + mobile', grade: 0.44, span: 'third' },
        { label: 'Data tables', note: 'Density study', grade: 0.22, span: 'third' },
      ],
    },
  },
  {
    slug: SOCIAL,
    name: 'Pepsi-Cola Social Advertising',
    nameLines: ['Pepsi-Cola Social', 'Advertising'],
    cat: 'FMCG · Social',
    year: '2023 — 24',
    accent: 'rgb(38, 88, 200)',
    cover: cov(SOCIAL, 'pepsi-poster'),
    hero: {
      set: [
        pic(SOCIAL, 'pepsi-poster', 'Pepsi'),
        pic(SOCIAL, 'mirinda-green', 'Mirinda'),
        pic(SOCIAL, '7up-feeling-up', '7UP'),
        pic(SOCIAL, 'sting-gold', 'STING'),
      ],
    },
    study: {
      lede: 'Always-on social for Pepsi, 7UP, Mirinda and STING in Myanmar — one designer, four brand voices.',
      client: 'Pepsi-Cola Myanmar',
      role: 'Senior Creative Designer',
      year: '2023 — 24',
      deliverables: 'Social posts, seasonal\ncampaigns, flavour launches',
      chapters: [
        {
          label: 'PEPSI',
          heading: 'Electric blue, built around the can.',
          body: 'Seasonal moments, flavour launches and community events — New Year, Women’s Day, the Padauk flavour, the A-Tar Memofest — each composed around the can in Pepsi’s blue, with the Burmese headline drawn into the image rather than laid on top.',
          media: [
            pic(SOCIAL, 'pepsi-padauk', 'Padauk flavour', 'Launch', 'third'),
            pic(SOCIAL, 'pepsi-memofest', 'A-Tar Memofest', 'Event', 'third'),
            pic(SOCIAL, 'pepsi-emoji', 'Meals better with Pepsi', 'Engagement', 'third'),
            pic(SOCIAL, 'pepsi-new-year', 'Happy 2024', 'New Year', 'third'),
            pic(SOCIAL, 'pepsi-ice', 'Ice cold', 'Product', 'third'),
            pic(SOCIAL, 'pepsi-hand', 'Ask for Pepsi', 'Retail', 'third'),
            pic(SOCIAL, 'pepsi-womens-day', 'Women’s Day', '8 March', 'half'),
            pic(SOCIAL, 'pepsi-kiosk', 'Pepsi kiosk', 'Outlet', 'half'),
          ],
        },
        {
          label: '7UP',
          heading: 'Fresh air, cold green.',
          body: 'For 7UP the art direction leaned on open landscapes, mist and lime — “Hike up, drink 7UP” and “Feeling up” — so the drink reads as refreshment you can almost feel.',
          media: [
            pic(SOCIAL, '7up-hike', 'Hike up, drink 7UP', 'Outdoor', 'third'),
            pic(SOCIAL, '7up-cooler', 'Cooler', 'Holiday', 'third'),
            pic(SOCIAL, '7up-feeling-up', 'Feeling up', 'Product', 'third'),
          ],
        },
        {
          label: 'MIRINDA',
          heading: 'Orange, loud and playful.',
          body: 'Mirinda took the opposite register: saturated orange and magenta, splashes and flying fruit — a brand that is allowed to shout.',
          media: [
            pic(SOCIAL, 'mirinda-orange', 'Mirinda Orange', 'Product', 'third'),
            pic(SOCIAL, 'mirinda-girl', 'Turn it up', 'Talent', 'third'),
            pic(SOCIAL, 'mirinda-splash', 'Splash', 'Product', 'third'),
            pic(SOCIAL, 'mirinda-clock', 'Anytime', 'Product', 'half'),
            pic(SOCIAL, 'mirinda-green', 'Mirinda Green', 'Flavour', 'half'),
          ],
        },
        {
          label: 'STING',
          heading: 'Red heat for the energy drink.',
          body: 'STING’s always-on work kept the brand’s red-and-gold energy — lightning, sparks and cans in motion — running alongside the nightlife campaign.',
          media: [
            pic(SOCIAL, 'sting-red', 'STING Red', 'Product', 'third'),
            pic(SOCIAL, 'sting-gold', 'STING Gold', 'Product', 'third'),
            pic(SOCIAL, 'sting-can', 'Night can', 'Teaser', 'third'),
            pic(SOCIAL, 'sting-bottles', 'Bottles', 'Pack range', 'half'),
            pic(SOCIAL, 'sting-cans', 'Cans', 'Pack range', 'half'),
          ],
        },
      ],
      stills: [],
    },
  },
  {
    slug: CAL,
    name: 'Pepsi 2024 Calendar',
    nameLines: ['Pepsi 2024', 'Calendar'],
    cat: 'FMCG · Print',
    year: '2024',
    accent: 'rgb(32, 70, 190)',
    cover: cov(CAL, 'pages'),
    hero: { src: art(CAL, 'hero') },
    study: {
      lede: 'Twelve months, twelve product stories — the 2024 desk calendar for Pepsi-Cola Myanmar.',
      client: 'Pepsi-Cola Myanmar',
      role: 'Art direction · Print design',
      year: '2024',
      deliverables: 'Desk calendar, 12 product\nvisuals, print production',
      chapters: [
        {
          label: 'THE IDEA',
          heading: 'A visual journey through the year.',
          body: 'As you flip through the months, each page opens on a visual built around one PepsiCo product — Pepsi, 7UP, Mirinda and STING — so the calendar tells the portfolio’s story one month at a time.',
          media: [pic(CAL, 'pages', 'Calendar pages', 'Print')],
        },
        {
          label: 'THE PAGES',
          heading: 'The artwork leads, the dates stay readable.',
          body: 'Every page pairs a full-bleed product visual with a clean month grid, so the image carries the page and the calendar still works on a desk all year.',
          media: [
            pic(CAL, 'jan', 'January', '', 'half'),
            pic(CAL, 'feb', 'February', '', 'half'),
            pic(CAL, 'apr', 'April', '', 'half'),
            pic(CAL, 'may', 'May', '', 'half'),
            pic(CAL, 'jun', 'June', '', 'half'),
            pic(CAL, 'jul', 'July', '', 'half'),
            pic(CAL, 'aug', 'August', '', 'half'),
            pic(CAL, 'sep', 'September', '', 'half'),
            pic(CAL, 'nov', 'November', '', 'half'),
            pic(CAL, 'dec', 'December', '', 'half'),
          ],
        },
      ],
      stills: [],
    },
  },
  {
    slug: POSM,
    name: 'Modern Trade POSM',
    nameLines: ['Modern Trade', 'POSM'],
    cat: 'FMCG · Retail',
    year: '2024',
    accent: 'rgb(206, 38, 52)',
    cover: cov(POSM, 'promotion-cans'),
    hero: { src: art(POSM, 'hero') },
    study: {
      lede: 'Promotion banners, posters and gondola displays for Pepsi-Cola brands in Myanmar’s modern-trade stores.',
      client: 'Pepsi-Cola Myanmar',
      role: 'Retail design · Visualisation',
      year: '2024',
      deliverables: 'Promotion banners, posters,\ngondola mockups',
      chapters: [
        {
          label: 'THE BRIEF',
          heading: 'Win the shelf, not only the feed.',
          body: 'Modern-trade promotions — two tickets for a Pepsi string bag, one ticket for a free Mirinda, four cans for the 2024 calendar — needed banners, posters and gondola ends that could be read from the aisle.',
          media: [
            pic(POSM, 'mirinda-banner', 'Promotion banner', 'Mirinda'),
            pic(POSM, 'promotion-cans', 'Promotion poster', 'Multi-brand', 'half'),
            pic(POSM, 'promotion-calendar', 'Promotion poster', 'Calendar offer', 'half'),
          ],
        },
        {
          label: 'THE DISPLAYS',
          heading: 'Gondolas, previewed before they were built.',
          body: 'Each gondola was visualised as a 3D mockup — header, side panels and shelf strips — so the layout could be approved before production.',
          media: [
            pic(POSM, 'gondola-mixed', 'Gondola', 'Multi-brand', 'third'),
            pic(POSM, 'gondola-pepsi', 'Gondola', 'Pepsi', 'third'),
            pic(POSM, 'gondola-sting', 'Gondola', 'STING', 'third'),
          ],
        },
      ],
      stills: [],
    },
  },
  {
    slug: INS,
    name: 'Insurance Social Campaigns',
    nameLines: ['Insurance Social', 'Campaigns'],
    cat: 'Insurance · Social',
    year: '2022 — 23',
    accent: 'rgb(186, 62, 88)',
    cover: cov(INS, 'alife-beauty'),
    hero: {
      set: [
        pic(INS, 'aia-crossword', 'AIA'),
        pic(INS, 'alife-beauty', 'A Life'),
        pic(INS, 'ains-vehicle', 'A Insurance'),
      ],
    },
    study: {
      lede: 'Social campaigns for three insurers — AIA, A Life and A Insurance — each with its own colour, cast and tone.',
      client: 'AIA Myanmar · A Life Insurance · A Insurance',
      role: 'Creative Designer',
      year: '2022 — 23',
      deliverables: 'Social posts, campaign\nseries, product launches',
      chapters: [
        {
          label: 'AIA',
          heading: 'Health, made into a habit.',
          body: 'For AIA Myanmar the posts promoted healthier living and easier service — the PUSH step challenge with Locale, premium payments through AYA Pay, a New Year word search and the SHER customer line — in AIA red, with a light, friendly hand.',
          media: [
            pic(INS, 'aia-push', 'PUSH challenge', 'With Locale', 'third'),
            pic(INS, 'aia-aya-pay', 'AYA Pay', 'Payments', 'third'),
            pic(INS, 'aia-sher', 'SHER', 'Customer service', 'third'),
          ],
        },
        {
          label: 'A INSURANCE',
          heading: 'Simple cover, confident people.',
          body: 'A Insurance spoke in violet and white: motor, EV and life-planning products shown through confident people and clean product photography, with one benefit to each post.',
          media: [
            pic(INS, 'ains-sleep', 'Sleep tight', 'Life cover', 'quarter'),
            pic(INS, 'ains-together', 'Together', 'Family', 'quarter'),
            pic(INS, 'ains-ev', 'Clean Energy Fair', 'EV cover', 'quarter'),
            pic(INS, 'ains-future', 'Build your future', 'Savings', 'quarter'),
          ],
        },
        {
          label: 'A LIFE',
          heading: 'Life, told as a metaphor.',
          body: 'A Life Insurance took a more poetic route — life as a garden, a journey, flowing water and a dance — surreal, painterly images finished into a series where each post carries one idea and the brand’s green.',
          media: [
            pic(INS, 'alife-grow', 'Grow your life’s garden', '', 'quarter'),
            pic(INS, 'alife-journey', 'Life is a beautiful journey', '', 'quarter'),
            pic(INS, 'alife-flow', 'Flow with confidence', '', 'quarter'),
            pic(INS, 'alife-dance', 'On the stage of life', '', 'quarter'),
          ],
        },
      ],
      stills: [],
    },
  },
  {
    slug: TM,
    name: 'TrueMoney Social Advertising',
    nameLines: ['TrueMoney Social', 'Advertising'],
    cat: 'Fintech · Social',
    year: '2021',
    accent: 'rgb(232, 112, 36)',
    cover: cov(TM, 'transfer'),
    hero: {
      set: [pic(TM, 'agent', 'Agents'), pic(TM, 'transfer', 'Transfers'), pic(TM, 'free', 'Offers')],
    },
    study: {
      lede: 'Social advertising for TrueMoney Myanmar’s e-payment service — transfers, agents and offers, in the brand’s orange.',
      client: 'TrueMoney Myanmar',
      role: 'Creative Designer',
      year: '2021',
      deliverables: 'Social posts,\nservice explainers',
      chapters: [
        {
          label: 'THE WORK',
          heading: 'Everyday money, one idea per post.',
          body: 'Each post explains one part of the service — sending money, finding an agent, a free offer, a thank-you to customers — with one person, one clear Burmese headline and the orange that makes the brand recognisable across the feed.',
          media: [
            pic(TM, 'app', 'App support', 'Service', 'half'),
            pic(TM, 'thank-you', 'Thank you', 'Customers', 'half'),
          ],
        },
      ],
      stills: [],
    },
  },
  {
    slug: MEMBER,
    name: 'AIA Member Propositions',
    nameLines: ['AIA Member', 'Propositions'],
    cat: 'Insurance · Print',
    year: '2022',
    accent: 'rgb(214, 36, 74)',
    cover: cov(MEMBER, 'hero'),
    hero: { src: art(MEMBER, 'hero') },
    study: {
      lede: 'A member-benefits brochure for AIA Myanmar — hospitals, telemedicine and fitness partners, organised so members can find theirs.',
      client: 'AIA Myanmar',
      role: 'Layout · Illustration',
      year: '2022',
      deliverables: 'Printed and digital brochure,\nspot illustrations',
      chapters: [
        {
          label: 'THE BRIEF',
          heading: 'Many partners, one clear book.',
          body: 'AIA members get benefits from partner hospitals, telemedicine services and sports and fitness brands. The brochure groups them by need, and each spread gives a partner, its offer and how to use it.',
          media: [
            pic(MEMBER, 'cover', 'Cover', 'Member propositions', 'half'),
            pic(MEMBER, 'partners', 'Partners', 'Overview', 'half'),
          ],
        },
        {
          label: 'THE SPREADS',
          heading: 'Illustrated, colour-coded, quick to scan.',
          body: 'Each category has its own colour and illustration, so a member can open straight to health care, telemedicine or fitness and read the offer in seconds.',
          media: [
            pic(MEMBER, 'foreign-hospitals', 'Health care', 'Foreign hospitals', 'half'),
            pic(MEMBER, 'local-hospitals', 'Health care', 'Local hospitals', 'half'),
            pic(MEMBER, 'telemedicine', 'Health care', 'Telemedicine', 'half'),
            pic(MEMBER, 'sports-fitness', 'Health care', 'Sports and fitness', 'half'),
            pic(MEMBER, 'benefits', 'Benefits', 'At a glance', 'half'),
            pic(MEMBER, 'terms', 'Terms', 'Conditions', 'half'),
          ],
        },
      ],
      stills: [],
    },
  },
  {
    slug: PROFILE,
    name: 'Pepsi Company Profile',
    nameLines: ['Pepsi Company', 'Profile'],
    cat: 'FMCG · Editorial',
    year: '2024',
    accent: 'rgb(30, 62, 196)',
    cover: cov(PROFILE, 'cover'),
    hero: { src: art(PROFILE, 'hero') },
    study: {
      lede: 'The company profile for Pepsi Myanmar — the business, its people and its achievements, in one blue book.',
      client: 'Pepsi-Cola Myanmar',
      role: 'Editorial design',
      year: '2024',
      deliverables: 'Company profile,\nprint and digital',
      chapters: [
        {
          label: 'THE BOOK',
          heading: 'A corporate story with the brand’s energy.',
          body: 'The profile covers the company’s story, its distribution across Myanmar, leadership messages and the Chairman’s Ring of Honor — set in Burmese on Pepsi’s deep blue, with the circular Pepsi motif carried through every page.',
          media: [
            pic(PROFILE, 'cover', 'Cover', '', 'third'),
            pic(PROFILE, 'page-02', 'Spread', '', 'third'),
            pic(PROFILE, 'page-03', 'Ring of Honor', '', 'third'),
            pic(PROFILE, 'page-04', 'Spread', '', 'third'),
            pic(PROFILE, 'page-05', 'Achievements', '', 'third'),
            pic(PROFILE, 'page-06', 'Contents', '', 'third'),
            pic(PROFILE, 'page-07', 'Distribution', '', 'third'),
            pic(PROFILE, 'page-08', 'Spread', '', 'third'),
            pic(PROFILE, 'contact', 'Contact', '', 'third'),
          ],
        },
      ],
      stills: [],
    },
  },
  {
    slug: SKIN,
    name: 'Skin Town Identity',
    nameLines: ['Skin Town', 'Identity'],
    cat: 'Beauty · Brand identity',
    year: '',
    accent: 'rgb(58, 98, 82)',
    cover: cov(SKIN, 'logo'),
    hero: {
      set: [pic(SKIN, 'logo', 'Logo'), pic(SKIN, 'signage', 'Signage'), pic(SKIN, 'jar', 'Packaging')],
    },
    study: {
      lede: 'Identity for Skin Town, a Myanmar maker of organic sugar wax — a calm serif and a leaf mark for a natural product.',
      client: 'Skin Town — organic sugar wax',
      role: 'Brand identity',
      year: '',
      deliverables: 'Logo, packaging,\nsignage, social',
      chapters: [
        {
          label: 'THE BRAND',
          heading: 'Natural ingredients, said plainly.',
          body: 'Skin Town produces high-quality sugar wax in Myanmar. The logo reflects the brand’s commitment to natural ingredients and sustainability — the leaves in the mark stand for the organic, plant-based nature of the products.',
          media: [
            pic(SKIN, 'app', 'Social', 'Mobile', 'half'),
            pic(SKIN, 'overview', 'Brand overview', 'Identity board', 'half'),
          ],
        },
      ],
      stills: [],
    },
  },
  {
    slug: AHTA,
    name: 'A-HTA Identity',
    nameLines: ['A-HTA', 'Identity'],
    cat: 'Fashion · Brand identity',
    year: '',
    accent: 'rgb(190, 30, 102)',
    cover: cov(AHTA, 'poster'),
    hero: { src: art(AHTA, 'hero') },
    study: {
      lede: 'Identity for A-HTA, a local clothing brand — a flowing wordmark on deep magenta.',
      client: 'A-HTA — local clothing brand',
      role: 'Brand identity',
      year: '',
      deliverables: 'Wordmark, stationery,\ntags, bags, posters',
      chapters: [
        {
          label: 'THE IDENTITY',
          heading: 'A signature that moves like fabric.',
          body: 'The wordmark is drawn as a flowing signature on a deep magenta, carried onto business cards, swing tags, shopping bags and posters so every touchpoint feels cut from the same cloth.',
          media: [
            pic(AHTA, 'card', 'Business card', 'Stationery', 'half'),
            pic(AHTA, 'bag', 'Shopping bag', 'Retail', 'half'),
            pic(AHTA, 'tag', 'Swing tag', 'Product', 'half'),
            pic(AHTA, 'poster', 'Poster', 'Campaign', 'half'),
            pic(AHTA, 'portrait', 'Lookbook', 'Photography', 'half'),
            pic(AHTA, 'silhouette', 'Lookbook', 'Photography', 'half'),
          ],
        },
      ],
      stills: [],
    },
  },
  {
    slug: INSIGHT,
    name: 'Insight 3D Identity',
    nameLines: ['Insight 3D', 'Identity'],
    cat: '3D studio · Brand identity',
    year: '',
    accent: 'rgb(92, 98, 106)',
    cover: cov(INSIGHT, 'sphere'),
    hero: { src: art(INSIGHT, 'hero') },
    study: {
      lede: 'Identity for Insight 3D, a 3D visualisation studio — a mark that is an eye and a lens at once.',
      client: 'Insight 3D — 3D visualisation',
      role: 'Brand identity',
      year: '',
      deliverables: 'Logo, stationery,\nmerchandise, web banner',
      chapters: [
        {
          label: 'THE MARK',
          heading: 'An eye, an aperture, a sphere.',
          body: 'The logo reads as an eye and a camera aperture at once — fitting for a studio that sells renderings and animation. Rendered in black chrome, it moves from the logo itself to embossed paper, tote bags and the studio’s web banner.',
          media: [
            pic(INSIGHT, 'logo', 'Logo', 'Primary mark', 'half'),
            pic(INSIGHT, 'sphere', 'Sphere', '3D render', 'half'),
            pic(INSIGHT, 'emboss', 'Emboss', 'Stationery', 'third'),
            pic(INSIGHT, 'tote', 'Tote bag', 'Merchandise', 'third'),
            pic(INSIGHT, 'laptop', 'Website', 'Desktop', 'third'),
          ],
        },
      ],
      stills: [],
    },
  },
  {
    slug: LOGOS,
    name: 'Logofolio',
    nameLines: ['Logofolio', 'SMEs & start-ups'],
    cat: 'Identity · Logo design',
    year: '',
    accent: 'rgb(140, 140, 140)',
    cover: cov(LOGOS, 'grid'),
    hero: { src: art(LOGOS, 'hero') },
    study: {
      lede: 'Logos for small businesses and start-ups — cafés, restaurants, clinics, pharmacies, gyms and shops.',
      client: 'SMEs & start-ups',
      role: 'Logo design',
      year: '',
      deliverables: 'Logos and\nwordmarks',
      chapters: [
        {
          label: 'THE COLLECTION',
          heading: 'Small businesses, distinct marks.',
          body: 'A collection of marks for small businesses and start-ups — from Bean Here, Extra Bowls and The Canteen to MEDx and Shwe Phoe Aung Pharmacy — each drawn to work small and in one colour, on a sign, a cup or a phone screen.',
          media: [pic(LOGOS, 'grid', 'Logo collection', 'Brand identity')],
        },
      ],
      stills: [],
    },
  },
  {
    slug: IREMIA,
    name: 'Iremia Meditation App',
    nameLines: ['Iremia', 'Meditation App'],
    cat: 'Product · UI design',
    year: '',
    accent: 'rgb(242, 128, 40)',
    cover: cov(IREMIA, 'hero'),
    hero: { src: art(IREMIA, 'hero') },
    study: {
      lede: 'A meditation app concept that tracks how people feel, then helps them calm down.',
      client: 'App concept',
      role: 'UI design · Illustration',
      year: '',
      deliverables: 'App UI, onboarding,\nillustrations',
      chapters: [
        {
          label: 'THE IDEA',
          heading: 'Know the mood, then ease it.',
          body: 'Iremia tracks people’s emotions and offers guided sessions to reduce stress and calm anxiety — a check-in first, then the right exercise for that moment.',
          media: [pic(IREMIA, 'screens', 'Final screens', 'Onboarding to session')],
        },
        {
          label: 'THE INTERFACE',
          heading: 'Warm orange, plenty of air, friendly drawings.',
          body: 'The interface keeps one warm orange accent, generous white space and simple line illustrations, so the app feels like a breather rather than another dashboard. Designed in Figma and Illustrator.',
          media: [
            pic(IREMIA, 'onboarding', 'Onboarding', 'Mobile', 'half'),
            pic(IREMIA, 'session', 'Session', 'Mobile', 'half'),
          ],
        },
      ],
      stills: [],
    },
  },
  {
    slug: RETOUCH,
    name: 'Product Retouch & Manipulation',
    nameLines: ['Product Retouch', '& Manipulation'],
    cat: 'Advertising · Retouch',
    year: '',
    accent: 'rgb(196, 44, 40)',
    cover: cov(RETOUCH, 'whisky'),
    hero: {
      set: [pic(RETOUCH, 'whisky', 'Whisky'), pic(RETOUCH, 'lays', 'Crisps'), pic(RETOUCH, 'carlsberg', 'Beer')],
    },
    study: {
      lede: 'Product advertising built in post — packshots composited into scenes that sell the taste.',
      client: 'Product advertising',
      role: 'Retouching · Photo manipulation',
      year: '',
      deliverables: 'Key visuals,\nproduct composites',
      chapters: [
        {
          label: 'THE CRAFT',
          heading: 'One packshot, a whole world around it.',
          body: 'Each visual starts from a product shot and is built up in Photoshop — light, liquid, fruit and setting composited and graded until the product looks as if it belongs there.',
          media: [
            pic(RETOUCH, 'serum', 'Serum', 'Beauty', 'half'),
            pic(RETOUCH, 'matcha', 'Matcha', 'Beverage', 'half'),
          ],
        },
      ],
      stills: [],
    },
  },
  {
    slug: 'thvmax-studio-site',
    name: 'THVMAX Studio Site',
    nameLines: ['THVMAX', 'Studio Site'],
    cat: 'Studio · Web Design',
    year: '2024',
    accent: 'rgb(120, 128, 136)',
    study: {
      lede: 'Design and build of this portfolio — art direction, interaction design and front-end.',
      client: 'Self-initiated',
      role: 'Designer · Developer',
      year: '2024 — 26',
      deliverables: 'Art direction, interaction\ndesign, front-end build',
      chapters: [],
      stills: [
        { label: 'Art direction', note: 'System', grade: 0.22, span: 'half' },
        { label: 'Interaction design', note: 'Motion', grade: 0.44, span: 'half' },
      ],
    },
  },
];

// ─── 01 Home ─────────────────────────────────────────────────────────
// No Figma frame exists for Home — this is the landing page the
// multi-page structure needs, written in the same system and using the
// hero line already in content/data.json.

/** A heading line, split into segments so it can be masked per line. */
export type V2HeadSeg = { t: string; i?: boolean };

export const v2Home = {
  label: 'THVMAX — THU TA SOE',
  // pre-split for the masked line reveal — no runtime text measuring
  headLines: [
    [{ t: 'Shaping brand visuals,' }],
    [{ t: 'campaigns and motion' }],
    [{ t: 'that ' }, { t: 'audiences remember', i: true }, { t: '.' }],
  ] as V2HeadSeg[][],
  intro2:
    'Senior creative designer from Myanmar, based in Dubai — campaign art direction, motion and product UI for brands across the UAE, the Middle East and worldwide.',
  scrollCue: 'SCROLL',
  headingLead: 'Shaping brand visuals, campaigns and motion that ',
  headingItalic: 'audiences remember',
  intro:
    'Senior creative designer working across campaign art direction, motion and product UI — seven years, six organisations, four countries.',
  reel: {
    src: '/case-studies/sting-night-life/hero-video.mp4',
    label: 'SHOWREEL',
    note: '2026 REEL — 01:12',
  },
  featuredLabel: 'SELECTED WORK',
  featuredCta: 'All work',
};

// ─── 02 Work ─────────────────────────────────────────────────────────

export const v2WorkSection = {
  label: 'SELECTED WORK',
  headingLead: 'Six projects. Six numbers',
  headingRest: 'that ',
  headingItalic: 'actually moved',
  intro:
    'Campaign art direction, motion and product design for FMCG and enterprise brands across Myanmar and the UAE.',
  previewHint: '↳ preview follows the cursor',
  cta: {
    label: 'NEXT',
    headingLead: 'Want the ',
    headingItalic: 'thinking',
    headingRest: ' behind these?',
    button: 'Read a case study',
  },
};

// ─── Work subpage ────────────────────────────────────────────────────
// The home page shows five rows under the Figma headline; the full
// index gets its own line so the two pages don't repeat themselves.

export const v2WorkPage = {
  label: 'SELECTED WORK',
  headingLead: 'Twenty-one projects, four countries,',
  headingItalic: 'one instinct',
  intro:
    'Campaign art direction, social, print, identity and product design for FMCG, insurance and enterprise brands across Myanmar and the UAE.',
  // the marquee footer carries scope only, so it sits on one line and
  // matches the hover state it swaps with
  scope: 'Campaign · Social · Print · Identity · Product',
};

// ─── 04 About ────────────────────────────────────────────────────────

export const v2About = {
  label: 'ABOUT ME',
  headingLines: ['Two brands taught me', 'everything: one shouts,'],
  headingRest: 'one ',
  headingItalic: 'can’t afford to',
  lead: 'I’m Thu Ta Soe, a senior creative designer in Dubai working across campaign art direction, motion and product UI. I spent two years making energy drinks look like a night out, and the two after that making asset-integrity software look like something an engineer would actually want to open. The instinct is the same in both — find the one true thing the brand can say, then build a system disciplined enough that other people can say it without me.',
  body: 'I work across corporate identity, campaign art direction, motion and product UI. Seven years, six organisations, four countries’ worth of brand guidelines. I use generative tools daily — Midjourney, Firefly, Runway, Kling — but the direction and the judgement stay mine; they compress execution, not thinking.',
  portrait: {
    src: '/portrait.jpg',
    label: 'PORTRAIT',
    name: 'Thu Ta Soe',
    place: 'Dubai, UAE',
  },
  stats: [
    { value: '7+', label: 'Years experience' },
    { value: '20+', label: 'Campaigns executed' },
    { value: '2K+', label: 'Projects visualised' },
    { value: '≈10%', label: 'Share lift on STING' },
  ],
  experience: [
    {
      role: 'Senior Creative Designer / Design Lead',
      co: 'Velosi Asset Integrity — Abu Dhabi, UAE',
      note: 'Brand channel growth 45K→75K. UI lead on the proprietary inspection platform.',
      year: '2024 — 26',
    },
    {
      role: 'Senior Creative Designer',
      co: 'Pepsi-Cola Myanmar',
      note: 'STING, Mirinda, 7UP and Pepsi. Campaign art direction and production.',
      year: '2023 — 24',
    },
    {
      role: 'Senior Creative Designer',
      co: 'A Life Insurance Myanmar',
      note: 'Brand and marketing communications.',
      year: '2023',
    },
    {
      role: 'Creative Designer',
      co: 'AIA Life Insurance Myanmar',
      note: 'Identity refresh and campaign toolkit.',
      year: '2022 — 23',
    },
    {
      role: 'Creative Lead',
      co: 'BUC Myanmar',
      note: 'Built and led the in-house creative function.',
      year: '2021 — 22',
    },
    {
      role: 'Creative Designer, Intern',
      co: 'Bliss Creative Communication',
      note: 'Agency foundation — studio craft and production.',
      year: '2020',
    },
    {
      role: 'Freelance Creative Lead',
      co: 'TM Design Studio',
      note: 'Brand identities, logos and product retouching for SMEs and start-ups.',
      year: '2019 — now',
    },
  ],
  toolkit: [
    { label: 'Design', value: 'Photoshop · Illustrator · InDesign' },
    { label: 'Motion', value: 'After Effects · Premiere Pro' },
    { label: 'Product', value: 'Figma · Adobe XD · design systems' },
    { label: 'Generative', value: 'Midjourney · Firefly · Runway · Kling · Veo' },
    { label: 'Presentation', value: 'Keynote · PowerPoint · Canva' },
    { label: 'Language', value: 'English (professional) · Burmese (native)' },
  ],
  education: [
    {
      title: 'Professional Diploma, Marketing & Brand Management',
      meta: 'Strategy First University · 2022 — 23',
    },
    {
      title: 'Professional Certificate, Graphic Design',
      meta: 'The World Design Institute · 2018',
    },
    {
      title: 'Commerce, Marketing (3 years)',
      meta: 'Yangon University of Economics · 2018 — 21',
    },
  ],
  cta: {
    label: 'OPEN TO WORK',
    headingItalic: 'Available now',
    headingRest: ', based in Dubai.',
  },
};

// ─── 05 Contact ──────────────────────────────────────────────────────

export const v2Contact = {
  label: 'CONTACT',
  headingLead: 'Let’s make something',
  headingItalic: 'worth stopping for',
  intro:
    'Available for senior creative roles and freelance art direction, motion and product-design work — across Myanmar, the UAE and the wider Middle East, and remote worldwide, from Dubai. I reply within a day.',
  facts: [
    { label: 'PHONE', value: v2Site.phone },
    { label: 'BASED', value: v2Site.based },
    { label: 'STATUS', value: v2Site.status },
    { label: 'LANGUAGES', value: v2Site.languages },
  ],
};

/** Year and discipline as one meta line; the year is left out when the source gives none. */
export const projectMeta = (p: V2Project) => (p.year ? `${p.cat} · ${p.year}` : p.cat);

export const findProject = (slug: string) => v2Work.find((p) => p.slug === slug);

export const nextProject = (slug: string) => {
  const i = v2Work.findIndex((p) => p.slug === slug);
  return v2Work[(i + 1) % v2Work.length];
};

// Plate gradient standing in for artwork until real assets land.
// The site chrome is black and white; the work itself carries colour.
export const plate = (accent: string, angle = 137) =>
  `linear-gradient(${angle}deg, ${accent} 0%, #0b0c0d 74%)`;
