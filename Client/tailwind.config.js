/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#CD2C58",
          medium: "#E06B80",
          light: "#FFC69D",
          pale: "#FFE6D4",
        },
      },
    },
  },
  plugins: [],
};
