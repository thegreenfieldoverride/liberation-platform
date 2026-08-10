/**
 * Shared Tailwind preset — the single definition of the platform's visual
 * language. Both apps/web and apps/small-bets consume this; the second app
 * was a copy of the first, which is exactly how design systems drift.
 *
 * CommonJS on purpose: apps/web's config is CJS and apps/small-bets' is ESM
 * (that package is "type": "module"). A .cjs file can be required by one and
 * default-imported by the other.
 *
 * Colours mirror LIBERATION_COLORS in src/index.ts.
 */
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        // Self-hosted via @fontsource. Never request these from Google —
        // that leaks every visitor's IP on a platform whose first principle
        // is "Privacy is a Human Right".
        sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Source Serif 4', 'Charter', 'Georgia', 'serif'],
        // Was ['Lyon Display', ...]. Lyon is a commercial face Google Fonts
        // never served, so this has always rendered as Inter. Restoring it
        // needs a web licence, which is sold separately from desktop.
        display: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Empathetic palette for users in crisis
        'calm-blue': {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        'hope-green': {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        'warm-gray': {
          50: '#fafaf9',
          100: '#f5f5f4',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
      },
    },
  },
};
