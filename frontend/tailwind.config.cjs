/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'fiverr-green': '#1dbf73',
        'fiverr-dark-green': '#19a463',
        'fiverr-light-green': '#e8f5e8',
        'fiverr-gray': '#404145',
        'fiverr-light-gray': '#f7f7f7',
        'fiverr-border': '#e4e5e7',
      }
    },
  },
  plugins: [],
}
