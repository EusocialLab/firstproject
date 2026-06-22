'use client';

import type { ReactNode } from 'react';
import { StarField } from '../components/stars/StarField';

export default function HomePage(): ReactNode {
  return (
    <main style={{ minHeight: '100vh', width: '100%', margin: 0, padding: 0 }}>
      <StarField />
    </main>
  );
}
