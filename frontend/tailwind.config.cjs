/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  mode: "jit",
  theme: {
    extend: {
      backgroundSize: {
        "size-200": "200% 200%",
      },
      backgroundPosition: {
        "pos-0": "0% 0%",
        "pos-100": "100% 100%",
      },
      colors: {
        primary: {
          DEFAULT: "#7B4BE7",
          50: "#F2EDFD",
          100: "#E5DBFA",
          200: "#CAB7F5",
          300: "#B093F1",
          400: "#956FEC",
          500: "#7B4BE7",
          600: "#581DDD",
          700: "#4417AB",
          800: "#31107A",
          900: "#1D0A48",
        },

        secondary: colors.cyan,

        shade: {
          DEFAULT: "#35325A",
          50: "#817CB6",
          100: "#7974B2",
          200: "#6963A8",
          300: "#5C569C",
          400: "#524D8B",
          500: "#49447B",
          600: "#3F3B6A",
          700: "#35325A",
          800: "#201E36",
          900: "#060418",
        },
      },
    },

    fontFamily: {
      sans: ["Josefin Sans", "sans-serif"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
