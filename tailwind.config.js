/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#7C3AED",
        accent: "#EC4899",
        background: "#F9FAFB",
        surface: "#FFFFFF",
        textPrimary: "#111827",
        "text-primary": "#111827",
        textSecondary: "#6B7280",
        "text-secondary": "#6B7280",
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
