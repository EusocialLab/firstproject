'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Position, Size } from '../types/star';

export function mapImagePointToContainer(
  x: number,
  y: number,
  imageSize: Size,
  containerSize: Size
): Position {
  const scale = Math.max(
    containerSize.width / imageSize.width,
    containerSize.height / imageSize.height
  );

  const displayedWidth = imageSize.width * scale;
  const displayedHeight = imageSize.height * scale;

  const offsetX = (containerSize.width - displayedWidth) / 2;
  const offsetY = (containerSize.height - displayedHeight) / 2;

  return {
    left: x * scale + offsetX,
    top: y * scale + offsetY
  };
}

export function useStarField() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = useState<Size>({ width: 0, height: 0 });
  const [hoveredStarId, setHoveredStarId] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const updateSize = () => {
      const bounds = containerRef.current?.getBoundingClientRect();
      if (bounds) {
        setContainerSize({ width: bounds.width, height: bounds.height });
      }
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return {
    containerRef,
    containerSize,
    hoveredStarId,
    setHoveredStarId
  };
}
