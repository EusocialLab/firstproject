'use client';

import { useMemo, type ReactNode } from 'react';
import { legacyStars, imageSize } from '../../constants/stars';
import type { LegacyStar } from '../../types/star';
import { useStarField, mapImagePointToContainer } from '../../hooks/useStarField';
import { Star } from './Star';
import { StarTooltip } from './StarTooltip';
import './StarField.css';

interface StarFieldProps {
  onStarClick?: (star: LegacyStar) => void;
}

export function StarField({ onStarClick }: StarFieldProps): ReactNode {
  const { containerRef, containerSize, hoveredStarId, setHoveredStarId } = useStarField();

  const hoveredStar = useMemo(
    () => legacyStars.find((star) => star.id === hoveredStarId) ?? null,
    [hoveredStarId]
  );

  const tooltipPosition = useMemo(() => {
    if (!hoveredStar || containerSize.width === 0 || containerSize.height === 0) {
      return { left: 0, top: 0 };
    }

    const mapped = mapImagePointToContainer(
      hoveredStar.x,
      hoveredStar.y,
      imageSize,
      containerSize
    );

    return {
      left: mapped.left,
      top: mapped.top - 36
    };
  }, [hoveredStar, containerSize]);

  return (
    <div
      ref={containerRef}
      className="star-field"
    >
      {legacyStars.map((star) => {
        const mapped = mapImagePointToContainer(star.x, star.y, imageSize, containerSize);

        return (
          <Star
            key={star.id}
            star={star}
            mapped={mapped}
            onMouseEnter={() => setHoveredStarId(star.id)}
            onMouseLeave={() => setHoveredStarId(null)}
            onFocus={() => setHoveredStarId(star.id)}
            onBlur={() => setHoveredStarId(null)}
            onClick={() => onStarClick?.(star)}
          />
        );
      })}

      {hoveredStar ? (
        <StarTooltip
          position={tooltipPosition}
          content={hoveredStar.description ?? hoveredStar.label}
        />
      ) : null}
    </div>
  );
}
