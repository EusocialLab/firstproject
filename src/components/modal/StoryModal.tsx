'use client';

import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import type { LegacyStory } from '../../types/star';
import './StoryModal.css';

interface StoryModalProps {
  story: LegacyStory;
  onClose: () => void;
}

export function StoryModal({ story, onClose }: StoryModalProps): ReactNode {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="story-modal__backdrop" onMouseDown={handleBackdropClick}>
      <section
        aria-labelledby="story-modal-title"
        aria-describedby="story-modal-tagline"
        aria-modal="true"
        className="story-modal"
        role="dialog"
      >
        <button
          ref={closeButtonRef}
          aria-label="Close story"
          className="story-modal__close"
          type="button"
          onClick={onClose}
        >
          ×
        </button>

        <header className="story-modal__header">
          <h2 id="story-modal-title">{story.title}</h2>
          <p className="story-modal__years">{story.years}</p>
          <p id="story-modal-tagline" className="story-modal__tagline">
            {story.tagline}
          </p>
        </header>

        <div className="story-modal__body">
          {story.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
