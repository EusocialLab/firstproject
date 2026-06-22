import type { ReactNode } from 'react';
import type { Position } from '../../types/star';
import './LegacyCopy.css';

interface LegacyCopyProps {
  position: Position;
}

export function LegacyCopy({ position }: LegacyCopyProps): ReactNode {
  return (
    <div
      className="legacy-copy"
      style={{ left: position.left, top: position.top }}
    >
      <p className="legacy-copy__line--small">EVERY LIFE LEAVES A LIGHT.</p>
      <p className="legacy-copy__line--large">Preserve yours.</p>
    </div>
  );
}
