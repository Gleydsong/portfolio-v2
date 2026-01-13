export default {
  content: ["./index.html", "./js/**/*.{js,ts}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: {
        xl: "1120px",
      },
    },
    extend: {
      colors: {
        bg: "rgb(12 14 18 / <alpha-value>)",
        surface: "rgb(17 20 27 / <alpha-value>)",
        "surface-2": "rgb(20 24 32 / <alpha-value>)",
        text: "rgb(245 247 250 / 1)",
        muted: "rgb(191 198 208 / 1)",
        "muted-2": "rgb(142 151 163 / 1)",
        accent: "rgb(79 140 255 / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Fira Code", "ui-monospace", "SFMono-Regular", "monospace"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "8px",
        tile: "6px",
        chip: "4px",
      },
      minHeight: {
        textarea: "140px",
      },
      letterSpacing: {
        tightish: "-0.02em",
      },
    },
  },
  plugins: [],
};
