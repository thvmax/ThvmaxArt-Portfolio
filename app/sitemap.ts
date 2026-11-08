import type { MetadataRoute } from 'next';
import { v2Services, v2Work } from '@/lib/v2content';

const BASE = 'https://thvmaxart.com';

// Static pages are all pri-1 discovery; the work index and case studies
// carry the site's real content, so they rank just below home.
const staticPages: MetadataRoute.Sitemap = [
  { url: BASE, changeFrequency: 'monthly', priority: 1 },
  { url: `${BASE}/work`, changeFrequency: 'weekly', priority: 0.9 },
  { url: `${BASE}/services`, changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE}/about`, changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE}/contact`, changeFrequency: 'monthly', priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const projects: MetadataRoute.Sitemap = v2Work.map((p) => ({
    url: `${BASE}/work/${p.slug}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const services: MetadataRoute.Sitemap = v2Services.map((s) => ({
    url: `${BASE}/services/${s.slug}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticPages, ...projects, ...services];
}