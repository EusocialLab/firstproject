import type { ReactNode } from 'react';
import type { Position } from '../../types/star';

interface StarTooltipProps {
  position: Position;
  content: string;
}

export function StarTooltip({ position, content }: StarTooltipProps): ReactNode {
  return (
    <div
      className="tooltip"
      style={{ left: position.left, top: position.top }}
    >
      {content}
    </div>
  );
}
