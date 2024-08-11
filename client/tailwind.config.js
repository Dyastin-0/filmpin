/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--bg-primary)",
          foreground: {
            DEFAULT: "var(--text-primary)",
            secondary: "var(--text-secondary)"
          },
          highlight: "var(--highlight)"
        },
        secondary: {
          DEFAULT: "var(--bg-secondary)"
        },
        accent: "var(--accent)"
      }
    },
  },
  plugins: [],
}