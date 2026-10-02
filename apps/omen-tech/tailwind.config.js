/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        "ink-2": "#555555",
        "ink-3": "#999999",
        paper: "#fafafa",
        card: "#ffffff",
        line: "#e5e5e5",
        accent: "#111111",
      },
      fontFamily: {
        sans: ['"Outfit Variable"', '"Outfit"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        none: "0",
      },
    },
  },
  plugins: [],
};
