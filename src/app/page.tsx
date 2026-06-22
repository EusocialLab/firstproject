'use client';

import { useMemo, type ReactNode } from 'react';
import { legacyCopyPoint, imageSize } from '../constants/stars';
import type { LegacyStar } from '../types/star';
import { useStarField, mapImagePointToContainer } from '../hooks/useStarField';
import { StarField } from '../components/stars/StarField';
import { LegacyCopy } from '../components/legacy/LegacyCopy';
import '../components/legacy/LegacyCopy.css';

export default function HomePage(): ReactNode {
  const { containerSize } = useStarField();

  const legacyCopyPosition = useMemo(() => {
    if (containerSize.width === 0 || containerSize.height === 0) {
      return { left: 0, top: 0 };
    }

    return mapImagePointToContainer(
      legacyCopyPoint.x,
      legacyCopyPoint.y,
      imageSize,
      containerSize
    );
  }, [containerSize]);

  const handleStarClick = (star: LegacyStar) => {
    // TODO: Handle star click (e.g., show story modal, trigger Google auth)
    console.log('Clicked star:', star.id);
  };

  return (
    <main style={{ minHeight: '100vh', width: '100%', margin: 0, padding: 0 }}>
      <StarField onStarClick={handleStarClick} />
      <LegacyCopy position={legacyCopyPosition} />
    </main>
  );
}
