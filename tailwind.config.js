/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Condensed: ["Roboto Condensed", "sans-serif"],
        Eczar: ["Eczar", "serif"],
        Icons_O: ["Material Symbols Outlined"],
      },
    },
  },
  plugins: [],
};
