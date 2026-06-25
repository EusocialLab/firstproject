'use client';

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
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
import { Meteor, type MeteorPhase } from './Meteor';
import { Star } from './Star';
import { StarTooltip } from './StarTooltip';
import './StarField.css';

interface StarFieldProps {
  onStarClick?: (star: LegacyStar) => void;
}

type BackgroundMeteor = {
  id: string;
  startX: number;
  startY: number;
  angle: number;
  distance: number;
  duration: number;
  delay: number;
  opacity: number;
  tailLength: number;
  thickness: number;
};

const TOUR_STAR_IDS = [
  'star-6',
  'star-5',
  'star-1',
  'star-2',
  'star-3',
  'star-4',
  'star-6'
] as const;
const TOUR_START_STAR_ID = TOUR_STAR_IDS[0];
const TOUR_PAUSE_MS = 1800;
const TOUR_TRAVEL_MS = 2400;
const TAIL_COLLAPSE_MS = TOUR_TRAVEL_MS;
const METEOR_MAX_TAIL_LENGTH = 126;
const MAX_BACKGROUND_METEORS = 5;

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function createBackgroundMeteor(): BackgroundMeteor {
  const angle = randomBetween(18, 39);

  return {
    id: `background-meteor-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    startX: randomBetween(-8, 92),
    startY: randomBetween(4, 62),
    angle,
    distance: randomBetween(120, 360),
    duration: randomBetween(1800, 4400),
    delay: randomBetween(0, 900),
    opacity: randomBetween(0.16, 0.34),
    tailLength: randomBetween(38, 105),
    thickness: randomBetween(0.7, 1.8)
  };
}

function easeInOut(progress: number): number {
  return 0.5 - Math.cos(Math.PI * progress) / 2;
}

export function StarField({ onStarClick }: StarFieldProps): ReactNode {
  const { containerRef, containerSize, hoveredStarId, setHoveredStarId } = useStarField();
  const [selectedStarId, setSelectedStarId] = useState<string | null>(null);
  const [openedStoryId, setOpenedStoryId] = useState<string | null>(null);
  const [isLoginPanelOpen, setIsLoginPanelOpen] = useState(false);
  const [loginStatus, setLoginStatus] = useState<string | null>(null);
  const [activeTourStarId, setActiveTourStarId] = useState<string | null>(null);
  const [tourIndex, setTourIndex] = useState(0);
  const [meteorTargetIndex, setMeteorTargetIndex] = useState(0);
  const [meteorPhase, setMeteorPhase] = useState<MeteorPhase>('paused');
  const [travelProgress, setTravelProgress] = useState(0);
  const [segmentAngle, setSegmentAngle] = useState(0);
  const [segmentDistance, setSegmentDistance] = useState(0);
  const [isTourRunning, setIsTourRunning] = useState(true);
  const [hasTourCompleted, setHasTourCompleted] = useState(false);
  const [activeBackgroundMeteors, setActiveBackgroundMeteors] = useState<
    BackgroundMeteor[]
  >([]);
  const isContainerReady = containerSize.width > 0 && containerSize.height > 0;
  const activeBackgroundMeteorCountRef = useRef(0);

  const userLegacyStar = useMemo(
    () => legacyStars.find((star) => star.type === 'user') ?? null,
    []
  );

  const mappedStars = useMemo(
    () =>
      legacyStars.map((star) => ({
        star,
        position: mapImagePointToContainer(star.x, star.y, imageSize, containerSize)
      })),
    [containerSize]
  );

  const starScreenPositions = useMemo(
    () => new Map(mappedStars.map(({ star, position }) => [star.id, position])),
    [mappedStars]
  );

  const visibleTooltipStars = useMemo(() => {
    const visibleIds = new Set<string>();

    if (activeTourStarId) visibleIds.add(activeTourStarId);
    if (hasTourCompleted) visibleIds.add(TOUR_START_STAR_ID);
    if (isLoginPanelOpen && userLegacyStar) visibleIds.add(userLegacyStar.id);
    if (selectedStarId) visibleIds.add(selectedStarId);
    if (hoveredStarId) visibleIds.add(hoveredStarId);

    return legacyStars.filter((star) => visibleIds.has(star.id));
  }, [
    activeTourStarId,
    hasTourCompleted,
    hoveredStarId,
    isLoginPanelOpen,
    selectedStarId,
    userLegacyStar
  ]);

  const openedStory = useMemo(
    () => legacyStars.find((star) => star.id === openedStoryId)?.story ?? null,
    [openedStoryId]
  );

  const departurePosition = starScreenPositions.get(TOUR_STAR_IDS[tourIndex]);
  const targetPosition = starScreenPositions.get(TOUR_STAR_IDS[meteorTargetIndex]);

  const currentSegmentDistance = useMemo(() => {
    if (!departurePosition || !targetPosition) return 0;
    return Math.hypot(
      targetPosition.left - departurePosition.left,
      targetPosition.top - departurePosition.top
    );
  }, [departurePosition, targetPosition]);

  const meteorPosition = useMemo(() => {
    if (!departurePosition || !targetPosition) return { left: 0, top: 0 };
    if (meteorPhase !== 'traveling') return targetPosition;

    return {
      left:
        departurePosition.left +
        (targetPosition.left - departurePosition.left) * travelProgress,
      top:
        departurePosition.top +
        (targetPosition.top - departurePosition.top) * travelProgress
    };
  }, [departurePosition, meteorPhase, targetPosition, travelProgress]);

  const visibleTailLength =
    meteorPhase === 'traveling'
      ? Math.min(METEOR_MAX_TAIL_LENGTH, currentSegmentDistance * travelProgress)
      : meteorPhase === 'arriving'
        ? Math.min(METEOR_MAX_TAIL_LENGTH, segmentDistance)
        : 0;

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
      setIsTourRunning(false);
      setActiveTourStarId(null);
      setMeteorPhase('paused');
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
      target.closest(
        '.star-button, .tooltip--selected, .legacy-login-panel, .replay-button'
      )
    ) {
      return;
    }

    setSelectedStarId(null);
  };

  const closeStory = useCallback(() => setOpenedStoryId(null), []);

  useEffect(() => {
    activeBackgroundMeteorCountRef.current = activeBackgroundMeteors.length;
  }, [activeBackgroundMeteors.length]);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cleanupTimers: number[] = [];
    let spawnTimer = 0;
    let isCancelled = false;

    const scheduleNextMeteor = () => {
      if (isCancelled || motionQuery.matches) return;

      spawnTimer = window.setTimeout(() => {
        if (isCancelled || motionQuery.matches) return;

        if (activeBackgroundMeteorCountRef.current < MAX_BACKGROUND_METEORS) {
          const meteor = createBackgroundMeteor();
          const lifetime = meteor.delay + meteor.duration + 450;

          setActiveBackgroundMeteors((currentMeteors) => {
            if (currentMeteors.length >= MAX_BACKGROUND_METEORS) {
              return currentMeteors;
            }

            activeBackgroundMeteorCountRef.current = currentMeteors.length + 1;
            return [...currentMeteors, meteor];
          });

          const cleanupTimer = window.setTimeout(() => {
            setActiveBackgroundMeteors((currentMeteors) =>
              currentMeteors.filter((activeMeteor) => activeMeteor.id !== meteor.id)
            );
          }, lifetime);

          cleanupTimers.push(cleanupTimer);
        }

        scheduleNextMeteor();
      }, randomBetween(1200, 5200));
    };

    const handleMotionPreferenceChange = () => {
      if (motionQuery.matches) {
        setActiveBackgroundMeteors([]);
        window.clearTimeout(spawnTimer);
        return;
      }

      scheduleNextMeteor();
    };

    scheduleNextMeteor();
    motionQuery.addEventListener('change', handleMotionPreferenceChange);

    return () => {
      isCancelled = true;
      window.clearTimeout(spawnTimer);
      cleanupTimers.forEach((timer) => window.clearTimeout(timer));
      motionQuery.removeEventListener('change', handleMotionPreferenceChange);
    };
  }, []);

  const handleReplayTour = () => {
    setHasTourCompleted(false);
    setIsTourRunning(true);
    setActiveTourStarId(null);
    setTourIndex(0);
    setMeteorTargetIndex(0);
    setMeteorPhase('paused');
    setTravelProgress(0);
    setSegmentDistance(0);
    setSegmentAngle(0);
    setSelectedStarId(null);
    setIsLoginPanelOpen(false);
    setLoginStatus(null);
  };

  useEffect(() => {
    if (!isTourRunning || !isContainerReady || meteorPhase !== 'paused') return;

    const pauseDuration = TOUR_PAUSE_MS;
    const pauseTimer = setTimeout(() => {
      const nextIndex = tourIndex + 1;
      const source = starScreenPositions.get(TOUR_STAR_IDS[tourIndex]);
      const target = starScreenPositions.get(TOUR_STAR_IDS[nextIndex]);

      if (!source || !target) return;

      setMeteorTargetIndex(nextIndex);
      setTravelProgress(0);
      setSegmentAngle(
        Math.atan2(target.top - source.top, target.left - source.left) * (180 / Math.PI)
      );
      setSegmentDistance(Math.hypot(target.left - source.left, target.top - source.top));
      setMeteorPhase('traveling');
    }, pauseDuration);

    return () => clearTimeout(pauseTimer);
  }, [
    isContainerReady,
    isTourRunning,
    meteorPhase,
    starScreenPositions,
    tourIndex
  ]);

  useEffect(() => {
    if (meteorPhase !== 'traveling') return;

    let animationFrame = 0;
    const startedAt = performance.now();

    const animate = (now: number) => {
      const linearProgress = Math.min((now - startedAt) / TOUR_TRAVEL_MS, 1);
      setTravelProgress(easeInOut(linearProgress));

      if (linearProgress < 1) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      const arrivedIndex = meteorTargetIndex;
      setTravelProgress(1);
      setTourIndex(arrivedIndex);
      setActiveTourStarId(TOUR_STAR_IDS[arrivedIndex]);
      setMeteorPhase('arriving');

      if (arrivedIndex === TOUR_STAR_IDS.length - 1) {
        setSelectedStarId(null);
        setHasTourCompleted(true);
        setIsTourRunning(false);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [meteorPhase, meteorTargetIndex]);

  useEffect(() => {
    if (meteorPhase === 'traveling') {
      setSegmentDistance(currentSegmentDistance);
    }
  }, [currentSegmentDistance, meteorPhase]);

  useEffect(() => {
    if (meteorPhase !== 'arriving') return;

    const arrivalTimer = setTimeout(() => setMeteorPhase('paused'), TAIL_COLLAPSE_MS);
    return () => clearTimeout(arrivalTimer);
  }, [meteorPhase]);

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
      <div className="background-meteor-layer" aria-hidden="true">
        {activeBackgroundMeteors.map((meteor) => {
          const travelX =
            Math.cos((meteor.angle * Math.PI) / 180) * meteor.distance;
          const travelY =
            Math.sin((meteor.angle * Math.PI) / 180) * meteor.distance;
          const meteorStyle = {
            left: `${meteor.startX}%`,
            top: `${meteor.startY}%`,
            '--meteor-angle': `${meteor.angle}deg`,
            '--meteor-distance': `${meteor.distance}px`,
            '--meteor-duration': `${meteor.duration}ms`,
            '--meteor-delay': `${meteor.delay}ms`,
            '--meteor-opacity': meteor.opacity,
            '--meteor-tail-length': `${meteor.tailLength}px`,
            '--meteor-thickness': `${meteor.thickness}px`,
            '--meteor-travel-x': `${travelX}px`,
            '--meteor-travel-y': `${travelY}px`
          } as CSSProperties;

          return (
            <span
              key={meteor.id}
              className="background-meteor"
              style={meteorStyle}
            />
          );
        })}
      </div>

      {mappedStars.map(({ star, position }) => {
        return (
          <Star
            key={star.id}
            star={star}
            mapped={position}
            isSelected={selectedStarId === star.id}
            onMouseEnter={() => setHoveredStarId(star.id)}
            onMouseLeave={() => setHoveredStarId(null)}
            onFocus={() => setHoveredStarId(star.id)}
            onBlur={() => setHoveredStarId(null)}
            onClick={() => handleStarClick(star)}
          />
        );
      })}

      {isContainerReady && (isTourRunning || hasTourCompleted) ? (
        <Meteor
          angle={segmentAngle}
          phase={meteorPhase}
          position={meteorPosition}
          tailLength={visibleTailLength}
        />
      ) : null}

      {visibleTooltipStars.map((star) => {
        const position = starScreenPositions.get(star.id);
        if (!position) return null;

        return (
          <StarTooltip
            key={star.id}
            position={{ left: position.left, top: position.top + 22 }}
            star={star}
            isSelected={selectedStarId === star.id}
            onMore={() => setOpenedStoryId(star.id)}
          />
        );
      })}

      {hasTourCompleted && !isTourRunning ? (
        <button
          type="button"
          className="replay-button"
          aria-label="Replay animation"
          onClick={handleReplayTour}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M20 11a8 8 0 1 0-2.34 5.66M20 5v6h-6" />
          </svg>
        </button>
      ) : null}

      {isContainerReady ? (
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
