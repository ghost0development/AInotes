/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00D4FF",
        secondary: "#7C3AED",
        background: "#080C18",
        card: "#111827",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Space Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [],
};