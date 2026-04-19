/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Stitch Master Tokens
      "surface-container-lowest": "#ffffff",
      "tertiary-fixed": "#d8e2ff",
      "tertiary": "#005ac2",
      "on-tertiary": "#ffffff",
      "on-primary-container": "#004b1e",
      "on-tertiary-container": "#003d88",
      "inverse-primary": "#4ae176",
      "surface-container-high": "#dce9ff",
      "on-tertiary-fixed": "#001a42",
      "surface-dim": "#cbdbf5",
      "surface-tint": "#006e2f",
      "primary-fixed": "#6bff8f",
      "tertiary-container": "#82abff",
      "surface-bright": "#f8f9ff",
      "on-surface": "#0b1c30",
      "inverse-surface": "#213145",
      "secondary-container": "#6df5e1",
      "on-primary": "#ffffff",
      "tertiary-fixed-dim": "#adc6ff",
      "on-secondary": "#ffffff",
      "surface-variant": "#d3e4fe",
      "on-primary-fixed-variant": "#005321",
      "surface-container-highest": "#d3e4fe",
      "outline-variant": "#bccbb9",
      "outline": "#6d7b6c",
      "inverse-on-surface": "#eaf1ff",
      "error-container": "#ffdad6",
      "secondary": "#006b5f",
      "on-error-container": "#93000a",
      "on-secondary-fixed-variant": "#005048",
      "on-background": "#0b1c30",
      "primary-container": "#22c55e",
      "on-primary-fixed": "#002109",
      "on-secondary-fixed": "#00201c",
      "primary": "#006e2f",
      "secondary-fixed": "#71f8e4",
      "on-tertiary-fixed-variant": "#004395",
      "error": "#ba1a1a",
      "on-error": "#ffffff",
      "surface-container-low": "#eff4ff",
      "on-secondary-container": "#006f64",
      "on-surface-variant": "#3d4a3d",
      "surface-container": "#e5eeff",
      "surface": "#f8f9ff",
      "primary-fixed-dim": "#4ae176",
      "secondary-fixed-dim": "#4fdbc8",

      // Legacy Tokens (maintained for Phases 1-4)
      "background": "#f8f9ff", // updated to match new surface so old components match
      "background-main": "#f8f9ff",
      "background-card": "#ffffff",
      "text-primary": "#0b1c30",
      "text-secondary": "#3d4a3d",
      "primary-green": "#006e2f",

      bmi: {
        underweight: "#60A5FA",
        normal: "#22C55E",
        overweight: "#FACC15",
        obese: "#EF4444"
      }
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
  plugins: [],
}
