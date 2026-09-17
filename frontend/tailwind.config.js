const { neutral } = require('tailwindcss/colors');

// Keep existing semantic utility names, but render every palette without hue.
const monochromeColors = Object.fromEntries(
  ['slate', 'gray', 'zinc', 'stone', 'red', 'orange', 'amber', 'yellow', 'lime',
    'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet',
    'purple', 'fuchsia', 'pink', 'rose'].map((name) => [name, neutral]),
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        ...monochromeColors,
        navy: {
          DEFAULT: '#171717',
          deep: '#0a0a0a',
        },
      },
    },
  },
  plugins: [],
};
