/** @type {import('tailwindcss').Config} */
export default {
  // No dark mode as requested; using glass UI style
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#1d4ed8",
        "brand-light": "#3b82f6",
        "brand-dark": "#1e3a8a",
      },
      fontFamily: {
        sans: ['"Inter"', "sans-serif"],
        display: ['"Playfair Display"', "serif"],
      },
    },
  },
  // Tailwind includes backdrop-blur utilities by default (v3+)
  plugins: [],
};
