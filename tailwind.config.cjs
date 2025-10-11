/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,html}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary-green": "#1db954",
        "primary-blue": "#007bff",
        "dark-bg": "#121212",
        "light-bg": "#f8f9fa",
        "card-dark": "#1e1e1e",
        "card-light": "#ffffff",
      },
    },
  },
  plugins: [],
};
