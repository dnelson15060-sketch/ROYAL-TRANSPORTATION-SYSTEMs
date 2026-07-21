import type { ReactNode } from 'react';

export type BadgeColor =
  | 'green'
  | 'yellow'
  | 'red'
  | 'blue'
  | 'gray'
  | 'primary'
  | 'accent';

export interface BadgeProps {
  color?: BadgeColor;
  children: ReactNode;
}

const COLOR_CLASSES: Record<BadgeColor, string> = {
  green: 'bg-green-100 text-green-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  red: 'bg-red-100 text-red-800',
  blue: 'bg-blue-100 text-blue-800',
  gray: 'bg-gray-100 text-gray-700',
  primary: 'bg-primary-100 text-primary-700',
  accent: 'bg-accent-100 text-accent-700',
};

export function Badge({ color = 'gray', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${COLOR_CLASSES[color]}`}
    >
      {children}
    </span>
  );
}

export default Badge;
