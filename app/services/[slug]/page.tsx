import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findService, v2Services } from '@/lib/v2content';
import ServiceDetail from '../../components/ServiceDetail';

export function generateStaticParams() {
  return v2Services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = findService(params.slug);
  if (!service) return { title: 'Services — THVMAX' };

  return {
    title: `${service.name} — THVMAX`,
    description: service.lead,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.name} — THVMAX`,
      description: service.lead,
      url: `/services/${service.slug}`,
      type: 'website',
    },
  };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = findService(params.slug);
  if (!service) notFound();

  return (
    <main>
      <ServiceDetail service={service} />
    </main>
  );
}
