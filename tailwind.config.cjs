/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Google dark mode colors
        'google-dark-bg': '#202124',
        'google-dark-input': '#303134',
        'google-dark-text': '#e8eaed',
        'google-dark-button': '#5f6368',
      }
    },
  },
  plugins: [],
}