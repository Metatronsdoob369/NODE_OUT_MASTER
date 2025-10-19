/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          400: '#00ff88',
          500: '#00dd77',
          600: '#00bb66',
        }
      }
    },
  },
  plugins: [],
}
