/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--bg-primary)",
          foreground: "var(--text-primary)",
          highlight: {
            DEFAULT: "var(--highlight)",
            foreground: "var(--text-highlight)",
          },
        },
        secondary: {
          DEFAULT: "var(--bg-secondary)",
          foreground: "var(--text-secondary)",
          accent: "var(--accent-secondary)",
        },
        accent: "var(--accent)",
        success: "var(--success)",
        danger: "var(--danger)",
        light: "var(--light)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
