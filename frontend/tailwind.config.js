/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-light': '#F0F8FF', // Alice Blue - soft background
        'primary-dark': '#4A5568',  // Dark Gray - text
        'accent-blue': '#667EEA',   // Royal Blue - buttons, highlights
        'accent-purple': '#9F7AEA', // Medium Purple - secondary accent
        'mood-happy': '#48BB78',    // Green
        'mood-ok': '#ECC94B',       // Yellow
        'mood-sad': '#F56565',      // Red
        'mood-neutral': '#CBD5E0',  // Light Gray
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Poppins"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
