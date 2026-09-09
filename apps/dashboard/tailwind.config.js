/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        brand: "#1d4ed8",
        paper: "#f6f5f3",
      },
    },
  },
  plugins: [],
};
