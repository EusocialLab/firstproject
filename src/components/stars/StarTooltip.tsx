import type { ReactNode } from 'react';
import type { LegacyStar, Position } from '../../types/star';

interface StarTooltipProps {
  position: Position;
  star: LegacyStar;
  isSelected: boolean;
  onMore: () => void;
}

export function StarTooltip({
  position,
  star,
  isSelected,
  onMore
}: StarTooltipProps): ReactNode {
  const story = star.story;

  return (
    <div
      aria-live="polite"
      className={`tooltip${story ? ' tooltip--story' : ''}${
        isSelected ? ' tooltip--selected' : ''
      }`}
      style={{ left: position.left, top: position.top }}
    >
      {story ? (
        <>
          <strong className="tooltip__title">{story.title}</strong>
          <span className="tooltip__years">{story.years}</span>
          <span className="tooltip__tagline">{story.tagline}</span>
          {isSelected ? (
            <button className="tooltip__more" type="button" onClick={onMore}>
              More
            </button>
          ) : null}
        </>
      ) : (
        star.description ?? star.label
      )}
    </div>
  );
}
