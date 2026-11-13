import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findProject, nextProject, v2Work } from '@/lib/v2content';
import CaseStudy from '../../components/CaseStudy';

export function generateStaticParams() {
  return v2Work.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = findProject(params.slug);
  if (!project) return { title: 'Case study' };

  const lede = project.study?.lede ?? project.cat;
  const client = project.study?.client;
  const description = client
    ? `${lede} ${client} — ${project.cat}, by Thu Ta Soe (THVMAX).`
    : `${lede} ${project.cat}, by Thu Ta Soe (THVMAX).`;
  return {
    title: project.name,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.name} — THVMAX`,
      description,
      url: `/work/${project.slug}`,
      type: 'article',
    },
  };
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const project = findProject(params.slug);
  if (!project) notFound();

  // Ties each case study back to the person, so the work ranks for the name.
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    url: `https://thvmaxart.com/work/${project.slug}`,
    description: project.study?.lede ?? project.cat,
    genre: project.cat,
    dateCreated: project.year,
    creator: { '@id': 'https://thvmaxart.com/#person' },
    ...(project.study?.client && project.study.client !== 'Self-initiated'
      ? { sourceOrganization: { '@type': 'Organization', name: project.study.client } }
      : {}),
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <main>
        <CaseStudy project={project} next={nextProject(project.slug)} />
      </main>
    </>
  );
}
