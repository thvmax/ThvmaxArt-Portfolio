import type { Metadata } from 'next';
import DisciplinePage from '../components/DisciplinePage';

export const metadata: Metadata = {
  title: 'Motion & Production | THVMAX',
  description:
    'From boards to final grade — animation, edit and production management across film and social.',
};

export default function MotionProduction() {
  return <DisciplinePage slug="motion-production" />;
}
