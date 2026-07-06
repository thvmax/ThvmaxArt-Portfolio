import type { Metadata } from 'next';
import DisciplinePage from '../components/DisciplinePage';

export const metadata: Metadata = {
  title: 'Art Direction | THVMAX',
  description:
    'Campaign worlds for global brands — key visuals, TVCs and rollouts that cut through.',
};

export default function ArtDirection() {
  return <DisciplinePage slug="art-direction" />;
}
