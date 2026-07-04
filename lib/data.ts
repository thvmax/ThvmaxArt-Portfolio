// ─── Central content for the portfolio ──────────────────────────────
// Everything the page renders lives here so copy can be edited in one place.

// ─── Works ───────────────────────────────────────────────────────────
// One unified list drives the index-style showcase. Every entry can carry
// an optional real image later (`img`) — until then a hue color-block
// placeholder renders. Rich entries also open a detail modal.

export interface Project {
  name: string;
  year: string;
  cat: string;        // short category line, e.g. "FMCG · TVC Campaign"
  hue: number;        // drives the placeholder color block
  img?: string;       // real preview asset — drop a path here to swap in
  // ── detail fields (present → row opens a full modal) ──
  desc?: string;
  client?: string;
  role?: string;
  caseStudyHref?: string; // real case-study page, if one exists
}

export const works: Project[] = [
  {
    name: 'STING Nightlife Campaign',
    year: '2024',
    cat: 'FMCG · TVC Campaign',
    desc: 'Led visual direction for the Sting Energy nightlife campaign — TV commercial production, key visuals and digital rollouts.',
    hue: 30,
    client: 'Sting Energy — PepsiCo Myanmar',
    role: 'Art Director',
    caseStudyHref: '/sting-night-life',
  },
  {
    name: 'Pepsi Titan Wall Art',
    year: '2023',
    cat: 'FMCG · Wall Art',
    desc: 'A massive wall art and mural project exploring the scale of the brand through detailed 3D visualization and illustration.',
    hue: 220,
    client: 'Pepsi-Cola Myanmar',
    role: 'Art Director · Illustrator',
  },
  {
    name: 'Pepsi Talent Development',
    year: '2023',
    cat: 'FMCG · Campaign',
    desc: 'Key visual and creative direction for Pepsi’s talent development program targeting Gen Z creators and audiences.',
    hue: 280,
    client: 'Pepsi-Cola Myanmar',
    role: 'Art Director',
  },
  {
    name: 'Pepsi Meals AR Campaign',
    year: '2022',
    cat: 'FMCG · AR Experience',
    desc: 'Visual identity and 3D assets for an interactive Augmented Reality campaign bridging digital and physical touchpoints.',
    hue: 200,
    client: 'Pepsi-Cola Myanmar',
    role: 'Art Director · AR Visualization',
  },
  {
    name: 'AIA Mandalay Office Opening',
    year: '2022',
    cat: 'Financial · Launch KV',
    desc: 'Key visuals for AIA’s regional office launch — integrating traditional Myanmar cultural elements with modern financial branding.',
    hue: 0,
    client: 'AIA Life Insurance Myanmar',
    role: 'Brand & Creative',
  },
  // ── lighter archive entries (preview only, no modal) ──
  { name: '7UP Social Series',      year: '2023', cat: 'Social Advertising', hue: 140 },
  { name: 'STING × Pepsi Motion',   year: '2023', cat: 'Motion Design',      hue: 300 },
  { name: 'Iremia App',             year: '2022', cat: 'UI Design',          hue: 190 },
  { name: 'Pepsi-Cola Social',      year: '2022', cat: 'Social Advertising', hue: 240 },
  { name: 'Logo & Identity',        year: '2021', cat: 'Brand Identity',     hue: 10  },
  { name: 'Velosi Asset',           year: '2024', cat: 'Brand & Digital',    hue: 340 },
  { name: 'Product Photography',    year: '2023', cat: 'Retouching',         hue: 170 },
  { name: 'Pepsi 2024 Calendar',    year: '2024', cat: 'Offline Branding',   hue: 260 },
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
