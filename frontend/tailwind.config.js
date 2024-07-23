/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        softpeach: '#FFAB91',
        lightbeigh: '#FFF5E1',
        bgcol: '#f6f9ff',
      },
    },
  },
  plugins: [require('flowbite/plugin')],
}

