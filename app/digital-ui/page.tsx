import type { Metadata } from 'next';
import DisciplinePage from '../components/DisciplinePage';

export const metadata: Metadata = {
  title: 'Digital & UI | THVMAX',
  description:
    'Product interfaces and design systems that make heavy enterprise software feel effortless.',
};

export default function DigitalUi() {
  return <DisciplinePage slug="digital-ui" />;
}
