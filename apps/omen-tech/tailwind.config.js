/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#0071e3",
        "accent-dark": "#0058b0",
        ink: "#1d1d1f",
        "ink-secondary": "#6e6e73",
        "ink-tertiary": "#86868b",
        surface: "#fbfbfd",
        "surface-elevated": "#ffffff",
        line: "#d2d2d7",
      },
      fontFamily: {
        sans: ['"Inter"', "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      borderRadius: {
        card: "18px",
        btn: "980px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.06)",
        "card-hover": "0 8px 30px rgba(0,0,0,0.10)",
        hero: "0 20px 60px rgba(0,0,0,0.08)",
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
    },
  },
  plugins: [],
};
