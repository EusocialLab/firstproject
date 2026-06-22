'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PointerEvent,
  type ReactNode
} from 'react';
import { legacyCopyPoint, legacyStars, imageSize } from '../../constants/stars';
import type { LegacyStar } from '../../types/star';
import { useStarField, mapImagePointToContainer } from '../../hooks/useStarField';
import { LegacyCopy } from '../legacy/LegacyCopy';
import { LegacyLoginPanel } from '../authentication/LegacyLoginPanel';
import { StoryModal } from '../modal/StoryModal';
import { Star } from './Star';
import { StarTooltip } from './StarTooltip';
import './StarField.css';

interface StarFieldProps {
  onStarClick?: (star: LegacyStar) => void;
}

export function StarField({ onStarClick }: StarFieldProps): ReactNode {
  const { containerRef, containerSize, hoveredStarId, setHoveredStarId } = useStarField();
  const [selectedStarId, setSelectedStarId] = useState<string | null>(null);
  const [openedStoryId, setOpenedStoryId] = useState<string | null>(null);
  const [isLoginPanelOpen, setIsLoginPanelOpen] = useState(false);
  const [loginStatus, setLoginStatus] = useState<string | null>(null);

  const userLegacyStar = useMemo(
    () => legacyStars.find((star) => star.type === 'user') ?? null,
    []
  );

  const hoveredStar = useMemo(
    () => legacyStars.find((star) => star.id === hoveredStarId) ?? null,
    [hoveredStarId]
  );

  const selectedStar = useMemo(
    () => legacyStars.find((star) => star.id === selectedStarId) ?? null,
    [selectedStarId]
  );

  const displayedStar = hoveredStar ?? selectedStar ?? (isLoginPanelOpen ? userLegacyStar : null);

  const openedStory = useMemo(
    () => legacyStars.find((star) => star.id === openedStoryId)?.story ?? null,
    [openedStoryId]
  );

  const tooltipPosition = useMemo(() => {
    if (!displayedStar || containerSize.width === 0 || containerSize.height === 0) {
      return { left: 0, top: 0 };
    }

    const mapped = mapImagePointToContainer(
      displayedStar.x,
      displayedStar.y,
      imageSize,
      containerSize
    );

    return {
      left: mapped.left,
      top: mapped.top + 22
    };
  }, [displayedStar, containerSize]);

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
    if (star.type === 'user') {
      setSelectedStarId(star.id);
      setIsLoginPanelOpen(true);
      setLoginStatus(null);
      onStarClick?.(star);
      return;
    }

    if (star.story) {
      setSelectedStarId(star.id);
    } else {
      setSelectedStarId(null);
    }

    onStarClick?.(star);
  };

  const handleFieldPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const target = event.target;

    if (
      target instanceof Element &&
      target.closest('.star-button, .tooltip--selected, .legacy-login-panel')
    ) {
      return;
    }

    setSelectedStarId(null);
  };

  const closeStory = useCallback(() => setOpenedStoryId(null), []);

  const closeLoginPanel = useCallback(() => {
    setIsLoginPanelOpen(false);
    setSelectedStarId(null);
    setLoginStatus(null);
  }, []);

  useEffect(() => {
    if (!isLoginPanelOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLoginPanel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeLoginPanel, isLoginPanelOpen]);

  const handleGoogleSignIn = () => {
    // TODO(auth): Replace this placeholder with the project's Google OAuth provider.
    // Keep the client ID and client secret in environment variables; never ship the
    // client secret to this browser component.
    setLoginStatus('Google sign-in is not configured yet.');
  };

  return (
    <div
      ref={containerRef}
      className="star-field"
      onPointerDown={handleFieldPointerDown}
    >
      {legacyStars.map((star) => {
        const mapped = mapImagePointToContainer(star.x, star.y, imageSize, containerSize);

        return (
          <Star
            key={star.id}
            star={star}
            mapped={mapped}
            isSelected={selectedStarId === star.id}
            onMouseEnter={() => setHoveredStarId(star.id)}
            onMouseLeave={() => setHoveredStarId(null)}
            onFocus={() => setHoveredStarId(star.id)}
            onBlur={() => setHoveredStarId(null)}
            onClick={() => handleStarClick(star)}
          />
        );
      })}

      {displayedStar ? (
        <StarTooltip
          position={tooltipPosition}
          star={displayedStar}
          isSelected={selectedStarId === displayedStar.id}
          onMore={() => setOpenedStoryId(displayedStar.id)}
        />
      ) : null}

      {containerSize.width > 0 && containerSize.height > 0 ? (
        <LegacyCopy position={legacyCopyPosition} />
      ) : null}

      {isLoginPanelOpen ? (
        <LegacyLoginPanel
          onClose={closeLoginPanel}
          onGoogleSignIn={handleGoogleSignIn}
          statusMessage={loginStatus}
        />
      ) : null}

      {openedStory ? <StoryModal story={openedStory} onClose={closeStory} /> : null}
    </div>
  );
}
