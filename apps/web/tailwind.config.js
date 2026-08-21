/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('../../packages/liberation-ui/tailwind-preset.cjs')],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/*/src/**/*.{js,ts,jsx,tsx}', // Include package components
  ],
  plugins: [],
};