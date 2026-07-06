// ─── Central content for the portfolio ──────────────────────────────
// All editable copy lives in content/data.json (managed via /admin).
// This module owns the TypeScript shapes and re-exports typed values,
// so components keep importing from '@/lib/data'.

import content from '@/content/data.json';

// ─── Case studies ────────────────────────────────────────────────────

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
  hideOnHome?: boolean;   // true → listed on discipline subpages only, not the homepage showcase
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

export interface Service {
  num: string;
  title: string;
  desc: string;
}

export interface Experience {
  role: string;
  co: string;
  year: string;
}

export interface Stat {
  value: string;
  label: string;
}

// ─── Site-level copy (hero, about, contact, footer) ─────────────────

export interface SocialLink {
  label: string;
  href: string;
}

export interface SiteInfo {
  email: string;
  phone: string;
  phoneHref: string;     // tel: target, digits only
  location: string;
  heroStatement: string;
  heroVideo: string;
  aboutBio: string;
  footerPrompt: string;  // \n for line breaks
  social: SocialLink[];
  copyright: string;
}

// ─── Typed exports from content/data.json ───────────────────────────

export const site: SiteInfo = content.site as SiteInfo;
export const disciplines: Discipline[] = content.disciplines as Discipline[];
export const works: Project[] = content.works as Project[];
export const services: Service[] = content.services as Service[];
export const experience: Experience[] = content.experience as Experience[];
export const skills: string[] = content.skills as string[];
export const marquee: string[] = content.marquee as string[];
export const stats: Stat[] = content.stats as Stat[];
