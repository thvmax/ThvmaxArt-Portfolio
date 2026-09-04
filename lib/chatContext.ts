import { v2About, v2Contact, v2Site, v2Work } from './v2content';

// Extra facts pulled from the full 2019-2026 portfolio deck
// (Thvmax 2026 Portfolio.pdf) — projects and skills that aren't part of
// the site's curated case studies but are fair game for the assistant
// to mention if asked.
const EXTRA_STATS = '20+ campaigns executed · 2K+ visualized projects';
const ALSO_GOES_BY = 'Also credited as "Thomas" in some portfolio materials.';

const EXTRA_SKILLS = [
  'Branding & Identity',
  'Social Media Advertising',
  'Motion Design & Reels',
  'Content Creation',
  'Product Retouching & Manipulation',
  'Video Editing & Color Grading',
  'Poster Design',
  'Minimalist Illustration',
  'User Interface Design',
].join(' · ');

const EXTRA_PROJECTS = [
  'Pepsi New Office Decoration (Apr 2024) — surreal wall-art mural for Pepsi Myanmar\'s new office, blending vibrant modern style with traditional Myanmar motifs; 3D-mocked against the real interior before production.',
  'AIA Mandalay Office Opening KV (Dec 2022) — launch key visual for AIA\'s Mandalay office, built around local landmarks (the Mandalay Palace, the Mandalay umbrella) per AIA Myanmar brand guidelines.',
  'iRemia — Meditation App UI/UX (personal project) — wireframed and prototyped a mobile app concept for tracking emotion, reducing stress and calming anxiety.',
  'Brand identities: SkinTown (organic sugar wax), Insight 3D (3D visualization studio), A-HTA (local clothing brand), plus a small logo folio for SMEs and startups.',
  'Offline branding: 2024 Pepsi wall calendar (print), MT POSM/gondola design, brochures & company profiles for Pepsi and AIA, AIA member-proposition collateral.',
  'Motion & editing: STING Nightlife TVC cutdown and last-frame KV animation; an animated AIA social tips reel; a 15-second Pepsi Meals highlight reel.',
].map((s) => `- ${s}`).join('\n');

/** Serializes the real site + portfolio-deck content into the assistant's system prompt. */
export function buildSystemPrompt(): string {
  const work = v2Work
    .map((p) => `- ${p.name} (${p.year}, ${p.cat})${p.study ? `: ${p.study.lede}` : ''}`)
    .join('\n');

  const experience = v2About.experience
    .map((e) => `- ${e.role}, ${e.co} (${e.year}): ${e.note}`)
    .join('\n');

  const toolkit = v2About.toolkit.map((t) => `${t.label}: ${t.value}`).join(' · ');

  return `You are the assistant embedded in ${v2Site.owner}'s portfolio site (thvmaxart.com). Answer only using the facts below — never invent projects, numbers, or history that aren't listed. Keep replies short (2-4 sentences), warm, and direct. If asked something outside this scope, say you don't know and point to the contact page.

PROFILE
${v2About.lead}
${v2About.body}
${ALSO_GOES_BY}
Based: ${v2Site.based} · Status: ${v2Site.status} · Languages: ${v2Site.languages}
Contact: ${v2Site.email} · ${v2Site.phone}

STATS
${v2About.stats.map((s) => `${s.value} ${s.label}`).join(' · ')} · ${EXTRA_STATS}

EXPERIENCE
${experience}

TOOLKIT
${toolkit}
Additional skill areas: ${EXTRA_SKILLS}

SELECTED WORK (featured case studies on the site)
${work}

ADDITIONAL WORK (from the full portfolio deck, not on the site as case studies)
${EXTRA_PROJECTS}

CONTACT INTENT
${v2Contact.intro}`;
}
