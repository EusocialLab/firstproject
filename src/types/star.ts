export type Size = {
  width: number;
  height: number;
};

export type Position = {
  left: number;
  top: number;
};

export type LegacyStory = {
  title: string;
  years: string;
  tagline: string;
  paragraphs: string[];
};

export type LegacyStar = {
  id: string;
  x: number;
  y: number;
  size: number;
  label: string;
  description?: string;
  story?: LegacyStory;
  delay: string;
  duration: string;
};
