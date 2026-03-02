/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        "primary-blue": "var(--primary-blue)",
        "dark-navy": "var(--dark-navy)",
        "neon-yellow": "var(--neon-yellow)",
        "light-gray": "var(--light-gray)",
        "text-dark": "var(--text-dark)",
        "text-gray": "var(--text-gray)",
        "error-red": "var(--error-red)",
        "success-green": "var(--success-green)",
      },
      fontFamily: {
        sans: [
          "var(--font-main)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
