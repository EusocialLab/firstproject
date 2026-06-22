import type { ReactNode } from 'react';
import type { LegacyStar, Position } from '../../types/star';

interface StarProps {
  star: LegacyStar;
  mapped: Position;
  isSelected: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onClick?: () => void;
}

export function Star({
  star,
  mapped,
  isSelected,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onClick
}: StarProps): ReactNode {
  return (
    <button
      key={star.id}
      type="button"
      aria-label={star.label}
      aria-pressed={isSelected}
      className={`star-button${isSelected ? ' star-button--selected' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onClick}
      style={{
        left: mapped.left,
        top: mapped.top
      }}
    >
      <span
        className="star-inner"
        style={{
          width: `${star.size * 4}px`,
          height: `${star.size * 4}px`,
          animationDuration: star.duration,
          animationDelay: star.delay
        }}
      />
    </button>
  );
}
