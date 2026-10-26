/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Press Start 2P"', 'monospace'],
        body: ['"Nunito"', 'system-ui', 'sans-serif'],
      },
      colors: {
        night: '#14162e',
        cream: '#fff1d6',
        panel: '#292044',
        lavender: '#bea0ff',
        pink: '#f18ac8',
        cyan: '#75e8ff',
        gold: '#ffd976',
      },
    },
  },
  plugins: [],
}
