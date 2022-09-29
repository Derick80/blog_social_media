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
      colors: {
light:{
  primary: "#e5e7eb",
  secondary: "#f3f4f6",
  DEFAULT: "#e5e7eb",
},
dark:{
  primary:"#3f3f46",
  secondary:"#4b5563",
  DEFAULT:"#3f3f46",
},
      }
    },
  },
  plugins: [],
};
