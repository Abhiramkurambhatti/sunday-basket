/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        farm: {
          50: '#f2f9f5',
          100: '#e1f2e7',
          200: '#c4e5d2',
          300: '#99d2b2',
          400: '#68b88d',
          500: '#439c6e',
          600: '#327d56',
          700: '#2b6446',
          800: '#25503a',
          900: '#1f4331',
          950: '#10251c',
        },
        cream: {
          50: '#fdfbf7',
          100: '#f9f5ec',
          200: '#f2e8d5',
          300: '#e7d4b4',
        },
        accent: {
          pomegranate: '#c0392b',
          amber: '#d35400',
          citrus: '#f39c12'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Outfit', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Merriweather', 'serif']
      }
    },
  },
  plugins: [],
}
