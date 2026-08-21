// Liberation UI Components - Values-aligned design system
// 
// @package @greenfieldoverride/liberation-ui
// @description Component library for building ethical technology
// @author Greenfield Override
// @license Liberation-1.0
// @funding https://ko-fi.com/greenfieldoverride

// Core Components
// The app kept its own copy of these for a long time, and that copy was the
// one that got the fixes — a try/catch render guard and a ClientOnly wrapper
// against hydration mismatch. That version now lives here, so there is one.
export { LibIcon, LiberationIcons, AnimatedIcon, IconSizes } from './icons/LibIcon';
export type { IconSize } from './icons/LibIcon';
export { KofiButton } from './support/KofiButton';

// Utilities
export { cn } from './utils/cn';
export { ClientOnly } from './utils/ClientOnly';

// Types
export type { LibIconType, LibIconSize } from './icons/types';
export type { KofiButtonProps, KofiButtonSize, KofiButtonVariant } from './support/types';

// Theme
export { liberationTheme } from './theme/liberation';

// Constants
export const LIBERATION_COLORS = {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  secondary: {
    50: '#ecfdf5', 
    500: '#10b981',
    600: '#059669',
    700: '#047857',
  },
  liberation: {
    blue: '#3b82f6',
    green: '#10b981', 
    purple: '#8b5cf6',
    yellow: '#f59e0b',
    red: '#ef4444',
  }
} as const;

export const LIBERATION_VALUES = {
  privacy: 'Privacy is a Human Right',
  empowerment: 'AI is a Partner, Not a Replacement', 
  empathy: 'Radical Empathy in a Cold World',
  openness: 'Open and Replicable',
} as const;