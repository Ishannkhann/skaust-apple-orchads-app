/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Brand tokens from the HOME palette, reused app-wide. Sync with theme/colors.ts.
      colors: {
        brand: {
          text: "#33422A",
          "text-deep": "#3D4A30",
          green: "#6D8B4F",
          "green-dark": "#566F3D",
          sage: "#8BA862",
        },
        surface: {
          light: "#F2F8E8",
          highlight: "#C9E0A0",
          track: "#E3EDD0",
          "track-warn": "#F2E3BE",
        },
        edge: {
          green: "#DCE8C8",
          "green-soft": "#C8D9AC",
        },
        accent: {
          amber: "#D9A441",
        },
      },
    },
  },
  plugins: [],
};
