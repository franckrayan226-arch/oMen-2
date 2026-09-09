/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f4efe3",
        "paper-2": "#ece4d2",
        ink: "#17211a",
        forest: "#1e3a2a",
        "forest-deep": "#14261d",
        terra: "#b4552d",
        sage: "#7d8c74",
        line: "#d8cdb4",
      },
      fontFamily: {
        sans: ['"IBM Plex Mono"', "monospace"],
        display: ['"Fraunces"', "serif"],
      },
    },
  },
  plugins: [],
};
