import type { CSSProperties, ReactNode } from 'react';
import type { Position } from '../../types/star';

interface MeteorProps {
  position: Position;
  angle: number;
  phase: MeteorPhase;
  tailLength: number;
}

export type MeteorPhase = 'paused' | 'traveling' | 'arriving';

export function Meteor({ position, angle, phase, tailLength }: MeteorProps): ReactNode {
  const style = {
    left: position.left,
    top: position.top,
    '--meteor-angle': `${angle}deg`,
    '--current-tail-length': `${tailLength}px`
  } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      className={`meteor meteor--${phase}`}
      style={style}
    >
      <span className="meteor__tail-axis">
        <span className="meteor__trail" />
      </span>
      <span className="meteor__core" />
    </div>
  );
}
