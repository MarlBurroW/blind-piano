/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: colors.purple,
        base: colors.slate,
      },
    },

    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
