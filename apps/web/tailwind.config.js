/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/*/src/**/*.{js,ts,jsx,tsx}', // Include package components
  ],
  theme: {
    extend: {
      fontFamily: {
        // Self-hosted via @fontsource, no runtime request to Google.
        // 'Inter Variable' is the variable build; plain 'Inter' stays as a
        // fallback for anyone with it installed locally.
        sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
        // Charter and Georgia are local-only fallbacks, which is fine — the
        // problem was requesting Charter from Google, where it does not exist.
        serif: ['Source Serif 4', 'Charter', 'Georgia', 'serif'],
        // Was ['Lyon Display', ...]. Lyon is a commercial Commercial Type face
        // that Google Fonts never served, so every `font-display` usage has
        // rendered as Inter since the site launched. Pointing this at Inter
        // makes the config honest; it changes nothing visually. If a *web*
        // licence for Lyon is confirmed (separate from a desktop licence),
        // self-host the woff2s and put it back at the front of this stack.
        display: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Empathetic color palette for users in crisis
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
        }
      },
    },
  },
  plugins: [],
};