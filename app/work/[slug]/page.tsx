import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findProject, nextProject, v2Work } from '@/lib/v2content';
import CaseStudy from '../../components/CaseStudy';

export function generateStaticParams() {
  return v2Work.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = findProject(params.slug);
  if (!project) return { title: 'Case study — THVMAX' };

  const lede = project.study?.lede ?? project.cat;
  return {
    title: `${project.name} — THVMAX`,
    description: lede,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.name} — THVMAX`,
      description: lede,
      url: `/work/${project.slug}`,
      type: 'article',
    },
  };
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const project = findProject(params.slug);
  if (!project) notFound();

  return (
    <>
      <main>
        <CaseStudy project={project} next={nextProject(project.slug)} />
      </main>
    </>
  );
}
