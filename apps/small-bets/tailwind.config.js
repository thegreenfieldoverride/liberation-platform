/** @type {import('tailwindcss').Config} */
// Mirrors apps/web/tailwind.config.js so the two render as one product.
// When more tools move over, this should be hoisted into a shared preset
// rather than copied a third time.
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Source Serif 4', 'Charter', 'Georgia', 'serif'],
        display: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // From @greenfieldoverride/liberation-ui LIBERATION_COLORS
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
  plugins: [],
};
