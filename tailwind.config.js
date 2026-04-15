/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#7C3AED",
        secondary: "#F472B6",
        accent: "#22C55E",
        background: "#0B0B0F",
        surface: "#14141A",
        textPrimary: "#FFFFFF",
        "text-primary": "#FFFFFF",
        textSecondary: "#A1A1AA",
        "text-secondary": "#A1A1AA",
        success: "#10B981",
        warning: "#F59E0B",
      },
      fontFamily: {
        "headline": ["System", "sans-serif"],
        "body": ["System", "sans-serif"],
        "label": ["System", "sans-serif"]
      },
      borderRadius: {
        "lg": "32px",
        "xl": "48px",
        "full": "9999px"
      }
    },
  },
  plugins: [],
}
