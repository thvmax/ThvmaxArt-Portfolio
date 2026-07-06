// ─── Central content for the portfolio ──────────────────────────────
// Everything the page renders lives here so copy can be edited in one place.

// ─── Works ───────────────────────────────────────────────────────────
// One unified list drives the index-style showcase. Every entry can carry
// an optional real image later (`img`) — until then a hue color-block
// placeholder renders. Rich entries also open a detail modal.

// A single content block inside a case study (heading + copy).
export interface CaseBlock {
  heading: string;
  body: string;
}

// An image placeholder in a case study. `span` controls grid width.
// Drop `img` later to swap the hue-block for a real asset.
export interface CaseImage {
  hue: number;
  span?: 'full' | 'half';   // full-width or half (paired) — default 'half'
  ratio?: 'wide' | 'tall';  // aspect hint — default 'wide'
  label?: string;           // caption shown on the placeholder
  img?: string;
}

export interface CaseStudy {
  tagline: string;      // one-line hero subtitle
  overview: string;     // lead paragraph
  scope: string[];      // discipline tags
  blocks: CaseBlock[];  // narrative sections
  gallery: CaseImage[]; // image placeholders, rendered in order
}

export interface Project {
  name: string;
  year: string;
  cat: string;        // short category line, e.g. "FMCG · TVC Campaign"
  hue: number;        // drives the placeholder color block
  img?: string;       // real preview asset — drop a path here to swap in
  video?: string;     // looping cover video — takes priority over img
  disciplines?: string[]; // discipline slugs — controls which subpages list this project
  // ── detail fields (present → row opens a full modal) ──
  desc?: string;
  client?: string;
  role?: string;
  caseStudyHref?: string; // real external/route case-study page, if one exists
  caseStudy?: CaseStudy;  // in-modal Behance-style case study
}

// ─── Disciplines ─────────────────────────────────────────────────────
// Drives both the Divisions section on the homepage and the /<slug>
// subpages. A project appears on a subpage when its `disciplines` array
// includes that discipline's slug.

export interface Discipline {
  slug: string;       // route: /<slug>
  title: string;
  desc: string;
  gradient: string;   // accent band
  featured: string;   // project name featured on the homepage card
}

export const disciplines: Discipline[] = [
  {
    slug: 'art-direction',
    title: 'Art Direction',
    desc: 'I build campaign worlds for global brands — key visuals, TVCs and rollouts that cut through.',
    gradient: 'linear-gradient(90deg, #ffb199, #ff4e33, #b8235a)',
    featured: 'STING Nightlife Campaign',
  },
  {
    slug: 'motion-production',
    title: 'Motion & Production',
    desc: 'From boards to final grade — animation, edit and production management across film and social.',
    gradient: 'linear-gradient(90deg, #a8c6ff, #4d7dff, #6a4dff)',
    featured: 'Pepsi Meals AR Campaign',
  },
  {
    slug: 'digital-ui',
    title: 'Digital & UI',
    desc: 'Product interfaces and design systems that make heavy enterprise software feel effortless.',
    gradient: 'linear-gradient(90deg, #ffd7a8, #ff9d4d, #ff5c33)',
    featured: 'Velosi ERP Software UI/UX',
  },
];

export const works: Project[] = [
  {
    name: 'STING Nightlife Campaign',
    year: '2024',
    cat: 'FMCG · TVC Campaign',
    desc: 'Led visual direction for the Sting Energy nightlife campaign — TV commercial production, key visuals and digital rollouts.',
    hue: 30,
    disciplines: ['art-direction'],
    video: '/case-studies/sting-night-life/hero-video.mp4',
    client: 'Sting Energy — PepsiCo Myanmar',
    role: 'Art Director',
    caseStudyHref: '/sting-night-life',
    caseStudy: {
      tagline: 'Charging the night with a bolder, high-energy Sting.',
      overview:
        'Sting needed to own the after-dark moment. We built a nightlife-first visual world — neon-charged, kinetic and unmistakably premium — spanning a national TV commercial, key visuals and a full digital rollout that pushed the brand deeper into Gen Z culture.',
      scope: ['Art Direction', 'TVC Production', 'Key Visual', 'Digital Rollout'],
      blocks: [
        { heading: 'The Challenge', body: 'Energy drinks live or die on attitude. Sting was strong by day but invisible once the lights dropped. The brief: claim the night without losing the mass-market punch that made Sting a market leader.' },
        { heading: 'The Direction', body: 'We leaned into contrast — deep black canvases cut by electric ambers and reds, motion-blur streaks and product hero shots that feel charged with voltage. Every frame was built to read at a glance on a phone and hold up on a billboard.' },
        { heading: 'The Result', body: 'A cohesive campaign system that flexed from a 30-second TVC to stories, posters and in-store POSM — giving Sting a distinct nightlife identity that lifted recall across the target audience.' },
      ],
      gallery: [
        { hue: 30, span: 'full', ratio: 'wide', label: 'KV breakdown', img: '/case-studies/sting-night-life/slide-1.jpg' },
        { hue: 20, span: 'half', ratio: 'tall', label: 'Thematic key visual', img: '/case-studies/sting-night-life/thematic-kv.png' },
        { hue: 45, span: 'half', ratio: 'tall', label: 'Product key visual', img: '/case-studies/sting-night-life/product-kv.png' },
        { hue: 15, span: 'full', ratio: 'wide', label: 'Campaign rollout', img: '/case-studies/sting-night-life/slide-3.jpg' },
      ],
    },
  },
  {
    name: 'Pepsi Titan Wall Art',
    year: '2023',
    cat: 'FMCG · Wall Art',
    desc: 'A massive wall art and mural project exploring the scale of the brand through detailed 3D visualization and illustration.',
    hue: 220,
    disciplines: ['art-direction'],
    client: 'Pepsi-Cola Myanmar',
    role: 'Art Director · Illustrator',
    caseStudy: {
      tagline: 'Brand at monumental scale — a mural you can feel.',
      overview:
        'Pepsi wanted a landmark. We designed a large-format wall installation that turned a flat facade into a dimensional, illustrative statement — engineered through detailed 3D visualization before a single litre of paint was mixed.',
      scope: ['Art Direction', '3D Visualization', 'Illustration', 'Mural Design'],
      blocks: [
        { heading: 'The Concept', body: 'A “titan” expression of the brand — bottle forms and brand marks reimagined at architectural scale, composed to draw the eye from across the street.' },
        { heading: 'The Craft', body: 'Every panel was modeled and lit in 3D to preview shadow, depth and perspective on the real wall, then translated into a production-ready illustration guide for the paint team.' },
        { heading: 'The Impact', body: 'A photographed, share-worthy landmark that generated organic social reach and gave the brand a permanent physical anchor in the city.' },
      ],
      gallery: [
        { hue: 220, span: 'full', ratio: 'wide', label: 'Finished mural' },
        { hue: 210, span: 'half', ratio: 'tall', label: '3D visualization' },
        { hue: 235, span: 'half', ratio: 'tall', label: 'Illustration detail' },
        { hue: 225, span: 'full', ratio: 'wide', label: 'On-site context' },
      ],
    },
  },
  {
    name: 'Velosi ERP Software UI/UX',
    year: '2024',
    cat: 'Enterprise · UI/UX Design',
    desc: 'End-to-end interface and experience design for Velosi’s internal ERP platform — wireframing, design system and high-fidelity product screens.',
    hue: 340,
    disciplines: ['digital-ui'],
    client: 'Velosi Asset Integrity — Abu Dhabi',
    role: 'Product & UI/UX Designer',
    caseStudy: {
      tagline: 'Turning a complex ERP into a calm, usable product.',
      overview:
        'Velosi’s teams ran on dense, legacy screens. I led the end-to-end redesign of the internal ERP — mapping real workflows, building a scalable design system and delivering high-fidelity screens that made heavy enterprise data feel effortless.',
      scope: ['UX Research', 'Wireframing', 'Design System', 'UI Design'],
      blocks: [
        { heading: 'The Problem', body: 'Operators juggled dozens of data-heavy modules with inconsistent patterns, slow task flows and high training overhead. The system worked, but it fought its users.' },
        { heading: 'The Approach', body: 'I audited the core journeys, restructured the information architecture, and defined a component-driven design system — consistent tables, forms, states and navigation — so every module felt like one product.' },
        { heading: 'The Outcome', body: 'Cleaner high-fidelity screens with clearer hierarchy and faster task paths, plus a reusable UI library that lets the team ship new modules without reinventing the interface each time.' },
      ],
      gallery: [
        { hue: 340, span: 'full', ratio: 'wide', label: 'Dashboard overview' },
        { hue: 330, span: 'half', ratio: 'tall', label: 'Module screen' },
        { hue: 350, span: 'half', ratio: 'tall', label: 'Component library' },
        { hue: 345, span: 'full', ratio: 'wide', label: 'Responsive views' },
      ],
    },
  },
  {
    name: 'Pepsi Meals AR Campaign',
    year: '2022',
    cat: 'FMCG · AR Experience',
    desc: 'Visual identity and 3D assets for an interactive Augmented Reality campaign bridging digital and physical touchpoints.',
    hue: 200,
    disciplines: ['motion-production', 'art-direction'],
    client: 'Pepsi-Cola Myanmar',
    role: 'Art Director · AR Visualization',
    caseStudy: {
      tagline: 'Where the meal becomes an interactive playground.',
      overview:
        'We turned everyday Pepsi meal moments into an augmented-reality experience — pairing bold visual identity with custom 3D assets that let audiences unlock playful, shareable interactions straight from the pack.',
      scope: ['Art Direction', '3D Assets', 'AR Experience', 'Visual Identity'],
      blocks: [
        { heading: 'The Idea', body: 'Bridge the physical pack and the phone: scan, and the meal comes alive with branded 3D characters, effects and rewards designed to drive participation and reshare.' },
        { heading: 'The Build', body: 'I directed the visual identity and modeled/optimized the 3D assets for smooth real-time AR performance across a wide range of devices.' },
        { heading: 'The Payoff', body: 'A digital-physical loop that boosted engagement time and gave the campaign a novel, tech-forward edge in a crowded FMCG space.' },
      ],
      gallery: [
        { hue: 200, span: 'full', ratio: 'wide', label: 'AR experience' },
        { hue: 190, span: 'half', ratio: 'tall', label: '3D asset' },
        { hue: 215, span: 'half', ratio: 'tall', label: 'In-app view' },
        { hue: 205, span: 'full', ratio: 'wide', label: 'Pack integration' },
      ],
    },
  },
  {
    name: 'Pepsi Talent Development',
    year: '2023',
    cat: 'FMCG · Campaign',
    desc: 'Key visual and creative direction for Pepsi’s talent development program targeting Gen Z creators and audiences.',
    hue: 280,
    disciplines: ['art-direction'],
    client: 'Pepsi-Cola Myanmar',
    role: 'Art Director',
    caseStudy: {
      tagline: 'A creative platform built for the next generation.',
      overview:
        'Pepsi set out to nurture young creators. We shaped the campaign’s creative direction and key visuals into a vibrant, culture-first platform that spoke Gen Z’s language and made the program feel like a movement, not an ad.',
      scope: ['Art Direction', 'Key Visual', 'Campaign System', 'Social'],
      blocks: [
        { heading: 'The Brief', body: 'Position Pepsi as a genuine backer of emerging talent — credible to a skeptical Gen Z audience while staying unmistakably on-brand.' },
        { heading: 'The Look', body: 'Energetic color, expressive type and a flexible layout system that let the program scale across social, stage and print without losing its identity.' },
        { heading: 'The Result', body: 'A recognizable campaign world that gave the talent program a strong, ownable identity and a consistent presence across every touchpoint.' },
      ],
      gallery: [
        { hue: 280, span: 'full', ratio: 'wide', label: 'Campaign key visual' },
        { hue: 270, span: 'half', ratio: 'tall', label: 'Social series' },
        { hue: 295, span: 'half', ratio: 'tall', label: 'Poster' },
        { hue: 285, span: 'full', ratio: 'wide', label: 'Event branding' },
      ],
    },
  },
];

export interface Service {
  num: string;
  title: string;
  desc: string;
}

export const services: Service[] = [
  { num: '01', title: 'Branding & Identity', desc: 'Logo design, visual identity systems, brand guidelines and comprehensive brand experience design.' },
  { num: '02', title: 'Art Direction', desc: 'Campaign creative direction, visual storytelling and conceptualization of integrated marketing campaigns.' },
  { num: '03', title: 'Motion Design', desc: 'After Effects animation, video editing, social reels, TVC production management and color grading.' },
  { num: '04', title: 'Social Advertising', desc: 'Engaging social content, paid advertising visuals and platform-specific creative strategy.' },
  { num: '05', title: 'Strategic Thinking', desc: 'Campaign strategy, market research, creative brief development and brand positioning.' },
  { num: '06', title: 'Product Retouching', desc: 'High-end product photography retouching, composite advertising visuals and photo manipulation.' },
  { num: '07', title: 'UI Design', desc: 'User interface design, wireframing, prototyping and mobile app visual design in Figma.' },
  { num: '08', title: 'Poster & Print', desc: 'Editorial poster design, event visuals, POSM, brochures and offline branding materials.' },
];

export interface Experience {
  role: string;
  co: string;
  year: string;
}

export const experience: Experience[] = [
  { role: 'Creative Design Lead', co: 'Velosi Asset Integrity · Abu Dhabi', year: '2024–Now' },
  { role: 'Sr. Brand & Creative', co: 'Pepsi-Cola Myanmar', year: '2023' },
  { role: 'Brand & Creative', co: 'AIA Life Insurance Myanmar', year: '2022' },
  { role: 'Creative Lead', co: 'British University College', year: '2021' },
  { role: 'Creative Designer', co: 'Bliss Creative Agency', year: '2020' },
  { role: 'Creative Director', co: 'TM Design Studio', year: '2019–Now' },
];

export const skills: string[] = [
  'Adobe Illustrator', 'Adobe Photoshop', 'Adobe After Effects', 'Adobe Premiere Pro',
  'DaVinci Resolve', 'Figma', 'Framer', 'Canva', 'Notion', 'Procreate',
  'Midjourney', 'Stable Diffusion', 'ChatGPT / AI', 'Meta Spark AR', 'Blender',
];

export const marquee: string[] = [
  'Pepsi-Cola', 'Sting Energy', '7UP', 'Mirinda', 'AIA Life Insurance',
  'Velosi', 'True Money', 'ADNOC', 'Aramco',
];

export interface Stat {
  value: string;
  label: string;
}

export const stats: Stat[] = [
  { value: '7+',  label: 'Years experience' },
  { value: '40+', label: 'Projects delivered' },
  { value: '15+', label: 'Brands & clients' },
  { value: '8',   label: 'Creative disciplines' },
];
