// ─── Content for the v2 layout (Figma: "ThvmaxArt Website 1") ────────
// Copy is taken verbatim from the Figma frames 02 Work / 03 Project —
// STING / 04 About / 05 Contact / State — Menu open. Kept separate from
// content/data.json so the live homepage and /admin stay untouched
// while v2 is in preview; merge it back when v2 becomes the homepage.

export interface V2Still {
  label: string;      // top-left caption
  note: string;       // bottom-left caption
  grade: number;      // 0–1 darkening pass over the gradient plate
  span?: 'half' | 'third';
}

export interface V2Chapter {
  label: string;      // THE BRIEF / THE IDEA / MY ROLE
  heading: string;
  body: string;
}

export interface V2Study {
  lede: string;
  client: string;
  role: string;
  year: string;
  deliverables: string;
  chapters: V2Chapter[];
  stills: V2Still[];
  result?: {
    figure: string;
    caption: string;
    body: string;
  };
}

export interface V2Project {
  slug: string;
  name: string;
  nameLines: string[];  // display break for the preview plate / hero
  cat: string;          // mono meta line, e.g. "FMCG · Campaign"
  year: string;
  accent: string;       // the project's own colour — artwork is never desaturated
  study?: V2Study;
}

export const v2Site = {
  name: 'THVMAX',
  owner: 'THVMAX — THU TA SOE',
  copyright: '2026 © ALL RIGHTS RESERVED',
  email: 'thutasoe24@gmail.com',
  phone: '+971 56 577 6382',
  phoneHref: '+971565776382',
  based: 'Abu Dhabi, UAE',
  status: 'Available immediately',
  languages: 'English · Burmese',
  menuFooter: 'ABU DHABI, UAE  ·  AVAILABLE NOW',
};

export const v2Intro = {
  mark: 'THVMAX',
  line: 'THU TA SOE — ABU DHABI',
  words: ['CAMPAIGN', 'MOTION', 'PRODUCT', 'IDENTITY'],
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

export const v2Work: V2Project[] = [
  {
    slug: 'sting-nightlife-repositioning',
    name: 'STING Nightlife Repositioning',
    nameLines: ['STING Nightlife', 'Repositioning'],
    cat: 'FMCG · Campaign',
    year: '2024',
    accent: 'rgb(217, 199, 33)',
    study: {
      lede: 'Moving an energy drink out of the gym and into the night — and taking share while doing it.',
      client: 'Pepsi-Cola Myanmar',
      role: 'Senior Creative Designer',
      year: '2023 — 24',
      deliverables: 'Key visual, TVC, OOH,\nsocial system, POSM',
      chapters: [
        {
          label: 'THE BRIEF',
          heading: 'STING was winning on price and losing on meaning.',
          body: 'The brand had strong distribution and a loyal daytime user, but it was read as a functional energy hit — something you drank before a shift or a workout. In a category where three competitors were spending harder on the same functional promise, there was no reason to reach for STING over anything else on the shelf. The ask was to find territory nobody else owned, and make it unmistakably ours.',
        },
        {
          label: 'THE IDEA',
          heading: 'Own the hours the category ignored.',
          body: 'Everyone was selling energy for work. Nobody was selling it for the night — the gigs, the late shifts, the drive home at 2am, the second half of the day people actually look forward to. We built the brand world around that window: a nightlife identity with its own colour behaviour, its own light, and a visual language that only made sense after dark.',
        },
        {
          label: 'MY ROLE',
          heading: 'Art direction, key visual, and the system underneath.',
          body: 'I led the visual development from territory boards through to the master key visual, then built the system that let it survive contact with reality — TVC frames, OOH, POSM, social cutdowns and retail. That meant defining how the palette behaved under different lighting, how the logo held on a dark field, and how a regional team could produce on-brand work without me in the room.',
        },
      ],
      stills: [
        { label: 'Master key visual', note: 'Print + OOH', grade: 0.22, span: 'half' },
        { label: 'TVC frame 04', note: 'Broadcast', grade: 0.44, span: 'half' },
        { label: 'Social system', note: '9:16 cutdowns', grade: 0.22, span: 'third' },
        { label: 'POSM', note: 'Retail cooler', grade: 0.44, span: 'third' },
        { label: 'Palette behaviour', note: 'Night grade', grade: 0.22, span: 'third' },
      ],
      result: {
        figure: '≈10%',
        caption: 'market share increase attributed to the nightlife repositioning.',
        body: 'The territory outlived the campaign — the nightlife system became the brand’s default visual language for the following cycle, and the same framework was reused across Mirinda and 7UP activations.',
      },
    },
  },
  {
    slug: 'velosi-brand-channel',
    name: 'Velosi Brand Channel',
    nameLines: ['Velosi Brand', 'Channel'],
    cat: 'Social · Always-on',
    year: '2026',
    accent: 'rgb(56, 168, 178)',
    study: {
      lede: 'An always-on brand channel for an asset-integrity company — 45K to 75K without a single stock photo.',
      client: 'Velosi Asset Integrity — Abu Dhabi, UAE',
      role: 'Senior Creative Designer / Design Lead',
      year: '2024 — 26',
      deliverables: 'Channel system, motion\ntemplates, campaign art direction',
      chapters: [],
      stills: [
        { label: 'Channel system', note: 'Always-on grid', grade: 0.22, span: 'half' },
        { label: 'Motion templates', note: 'Reels + shorts', grade: 0.44, span: 'half' },
      ],
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
    slug: 'pepsi-meals-ar-campaign',
    name: 'Pepsi Meals AR Campaign',
    nameLines: ['Pepsi Meals', 'AR Campaign'],
    cat: 'FMCG · AR Experience',
    year: '2024',
    accent: 'rgb(64, 132, 214)',
    study: {
      lede: 'Where the meal becomes an interactive playground — pack, phone and reward in one loop.',
      client: 'Pepsi-Cola Myanmar',
      role: 'Art Director · AR Visualization',
      year: '2022 — 24',
      deliverables: 'Visual identity, 3D assets,\nAR experience design',
      chapters: [
        {
          label: 'THE IDEA',
          heading: 'Bridge the physical pack and the phone.',
          body: 'Scan, and the meal comes alive with branded 3D characters, effects and rewards designed to drive participation and resharing straight from the table.',
        },
        {
          label: 'THE BUILD',
          heading: 'Identity first, then assets light enough to run anywhere.',
          body: 'I directed the visual identity and modelled and optimised the 3D assets for smooth real-time AR performance across a wide range of devices, including the low-end handsets that make up most of the market.',
        },
        {
          label: 'THE PAYOFF',
          heading: 'A digital-physical loop with a tech-forward edge.',
          body: 'Longer engagement time per session and a novel mechanic in a crowded FMCG space, with the AR layer giving the campaign a reason to be shared rather than scrolled past.',
        },
      ],
      stills: [
        { label: 'AR experience', note: 'In-app capture', grade: 0.22, span: 'half' },
        { label: '3D asset', note: 'Real-time optimised', grade: 0.44, span: 'half' },
        { label: 'Pack integration', note: 'Scan trigger', grade: 0.22, span: 'third' },
        { label: 'Reward states', note: 'Motion', grade: 0.44, span: 'third' },
        { label: 'Identity', note: 'Campaign toolkit', grade: 0.22, span: 'third' },
      ],
    },
  },
  {
    slug: 'pepsi-titan-wall-art',
    name: 'Pepsi Titan Wall Art',
    nameLines: ['Pepsi Titan', 'Wall Art'],
    cat: 'FMCG · Environmental',
    year: '2023',
    accent: 'rgb(214, 84, 84)',
    study: {
      lede: 'Brand at monumental scale — a mural engineered in 3D before a single litre of paint.',
      client: 'Pepsi-Cola Myanmar',
      role: 'Art Director · Illustrator',
      year: '2023',
      deliverables: '3D visualisation, illustration\nguide, mural production art',
      chapters: [
        {
          label: 'THE CONCEPT',
          heading: 'A titan expression of the brand.',
          body: 'Bottle forms and brand marks reimagined at architectural scale, composed to draw the eye from across the street and hold up at both fifty metres and five.',
        },
        {
          label: 'THE CRAFT',
          heading: 'Modelled and lit before it was painted.',
          body: 'Every panel was modelled and lit in 3D to preview shadow, depth and perspective on the real wall, then translated into a production-ready illustration guide for the paint team.',
        },
        {
          label: 'THE IMPACT',
          heading: 'A permanent, photographable anchor in the city.',
          body: 'A share-worthy landmark that generated organic social reach and gave the brand a physical presence no media buy expires out of.',
        },
      ],
      stills: [
        { label: 'Finished mural', note: 'On site', grade: 0.22, span: 'half' },
        { label: '3D visualization', note: 'Pre-production', grade: 0.44, span: 'half' },
        { label: 'Illustration detail', note: 'Panel study', grade: 0.22, span: 'third' },
        { label: 'On-site context', note: 'Street view', grade: 0.44, span: 'third' },
        { label: 'Production guide', note: 'Paint spec', grade: 0.22, span: 'third' },
      ],
    },
  },
  {
    slug: 'aia-life-insurance-refresh',
    name: 'AIA Life Insurance Refresh',
    nameLines: ['AIA Life', 'Insurance Refresh'],
    cat: 'Financial · Identity',
    year: '2022',
    accent: 'rgb(198, 68, 96)',
    study: {
      lede: 'An identity refresh and campaign toolkit for a life insurer that needed to sound human.',
      client: 'AIA Life Insurance Myanmar',
      role: 'Creative Designer',
      year: '2022 — 23',
      deliverables: 'Identity refresh, campaign\ntoolkit, social films',
      chapters: [],
      stills: [
        { label: 'Identity refresh', note: 'Core system', grade: 0.22, span: 'half' },
        { label: 'Campaign toolkit', note: 'Rollout', grade: 0.44, span: 'half' },
      ],
    },
  },
  {
    slug: 'pepsi-talent-development',
    name: 'Pepsi Talent Development',
    nameLines: ['Pepsi Talent', 'Development'],
    cat: 'FMCG · Campaign',
    year: '2023',
    accent: 'rgb(46, 106, 196)',
    study: {
      lede: 'A creative platform built for the next generation — credible to a sceptical Gen Z audience, still unmistakably Pepsi.',
      client: 'Pepsi-Cola Myanmar',
      role: 'Art Director',
      year: '2023',
      deliverables: 'Key visual, campaign system,\nsocial, event branding',
      chapters: [
        {
          label: 'THE BRIEF',
          heading: 'Back emerging talent without sounding like a sponsor.',
          body: 'Position Pepsi as a genuine backer of young creators — credible to an audience that can smell a media buy from across the room, while staying on-brand enough to sit beside the rest of the portfolio.',
        },
        {
          label: 'THE LOOK',
          heading: 'Energetic colour, expressive type, a system that scales.',
          body: 'A flexible layout system that let the programme run across social, stage and print without losing its identity — the same rules producing a story frame, a poster and a stage backdrop.',
        },
        {
          label: 'THE RESULT',
          heading: 'An ownable world for the programme.',
          body: 'A recognisable campaign identity that gave the talent programme a consistent presence across every touchpoint it appeared on.',
        },
      ],
      stills: [
        { label: 'Campaign key visual', note: 'Master', grade: 0.22, span: 'half' },
        { label: 'Social series', note: '9:16', grade: 0.44, span: 'half' },
        { label: 'Poster', note: 'Print', grade: 0.22, span: 'third' },
        { label: 'Event branding', note: 'Stage', grade: 0.44, span: 'third' },
        { label: 'Type system', note: 'Toolkit', grade: 0.22, span: 'third' },
      ],
    },
  },
  {
    slug: 'aia-brand-social-films',
    name: 'AIA Brand & Social Films',
    nameLines: ['AIA Brand', '& Social Films'],
    cat: 'Insurance · Motion',
    year: '2022',
    accent: 'rgb(186, 62, 88)',
    study: {
      lede: 'Motion design and a social film series for AIA — animated brand stories, reels and campaign cutdowns.',
      client: 'AIA Life Insurance Myanmar',
      role: 'Motion Designer · Editor',
      year: '2022',
      deliverables: 'Brand films, social reels,\ncampaign cutdowns',
      chapters: [],
      stills: [
        { label: 'Brand film', note: 'Master edit', grade: 0.22, span: 'half' },
        { label: 'Social reels', note: 'Cutdowns', grade: 0.44, span: 'half' },
      ],
    },
  },
  {
    slug: 'true-money-app-concept',
    name: 'True Money App Concept',
    nameLines: ['True Money', 'App Concept'],
    cat: 'Fintech · Mobile UI',
    year: '2021',
    accent: 'rgb(224, 106, 52)',
    study: {
      lede: 'A mobile interface exploration for True Money — onboarding flows, wallet screens and a lightweight design system.',
      client: 'True Money Myanmar',
      role: 'UI Designer',
      year: '2021',
      deliverables: 'Onboarding, wallet UI,\ncomponent system',
      chapters: [],
      stills: [
        { label: 'Onboarding', note: 'Flow', grade: 0.22, span: 'half' },
        { label: 'Wallet screens', note: 'Core UI', grade: 0.44, span: 'half' },
      ],
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
    'Senior creative designer — campaign art direction, motion and product UI.',
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
  headingLead: 'Ten projects, four countries,',
  headingItalic: 'one instinct',
  intro:
    'Campaign art direction, motion and product design for FMCG and enterprise brands across Myanmar and the UAE.',
  // the marquee footer carries scope only, so it sits on one line and
  // matches the hover state it swaps with
  scope: 'Campaign · Motion · Product · Identity',
};

// ─── 04 About ────────────────────────────────────────────────────────

export const v2About = {
  label: 'ABOUT ME',
  headingLines: ['Two brands taught me', 'everything: one shouts,'],
  headingRest: 'one ',
  headingItalic: 'can’t afford to',
  lead: 'I spent two years making energy drinks look like a night out, and the two after that making asset-integrity software look like something an engineer would actually want to open. The instinct is the same in both — find the one true thing the brand can say, then build a system disciplined enough that other people can say it without me.',
  body: 'I work across corporate identity, campaign art direction, motion and product UI. Seven years, six organisations, four countries’ worth of brand guidelines. I use generative tools daily — Midjourney, Firefly, Runway, Kling — but the direction and the judgement stay mine; they compress execution, not thinking.',
  portrait: {
    src: '/portrait.jpg',
    label: 'PORTRAIT',
    name: 'Thu Ta Soe',
    place: 'Abu Dhabi, UAE',
  },
  stats: [
    { value: '7+', label: 'Years experience' },
    { value: '40+', label: 'Projects delivered' },
    { value: '30K', label: 'Followers added at Velosi' },
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
    headingRest: ', based in Abu Dhabi.',
  },
};

// ─── 05 Contact ──────────────────────────────────────────────────────

export const v2Contact = {
  label: 'CONTACT',
  headingLead: 'Let’s make something',
  headingItalic: 'worth stopping for',
  intro:
    'Open to senior creative roles in the UAE, and to freelance art direction and motion work. I reply within a day.',
  facts: [
    { label: 'PHONE', value: v2Site.phone },
    { label: 'BASED', value: v2Site.based },
    { label: 'STATUS', value: v2Site.status },
    { label: 'LANGUAGES', value: v2Site.languages },
  ],
};

export const findProject = (slug: string) => v2Work.find((p) => p.slug === slug);

export const nextProject = (slug: string) => {
  const i = v2Work.findIndex((p) => p.slug === slug);
  return v2Work[(i + 1) % v2Work.length];
};

// Plate gradient standing in for artwork until real assets land.
// The site chrome is black and white; the work itself carries colour.
export const plate = (accent: string, angle = 137) =>
  `linear-gradient(${angle}deg, ${accent} 0%, #0b0c0d 74%)`;
