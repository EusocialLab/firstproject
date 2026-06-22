export type Size = {
  width: number;
  height: number;
};

export type Position = {
  left: number;
  top: number;
};

export type LegacyStar = {
  id: string;
  x: number;
  y: number;
  size: number;
  label: string;
  description?: string;
  delay: string;
  duration: string;
};
