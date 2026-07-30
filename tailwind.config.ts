import type { Config } from "tailwindcss";

// Two palettes coexist:
//  - `brand` red: the functional app (/events, /admin) — clean white/red.
//  - the marketing tokens (paper/navy/champagne): the landing at / (talentbank.io look).
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#D81E2C",
          dark: "#B01722",
        },
        paper: {
          DEFAULT: "#F8F4EC",
          deep: "#E8E0CE",
        },
        cream: "#FAF7F0",
        navy: {
          900: "#0A1F44",
          800: "#122A55",
          700: "#1E3A6F",
        },
        champagne: {
          DEFAULT: "#B89253",
          deep: "#9A7942",
          soft: "#E8D9B8",
        },
        gold: "#C9A66B",
        redx: {
          DEFAULT: "#D6231F",
          deep: "#B01813",
        },
        warm: {
          grey: "#6B6358",
          "grey-light": "#A39A8C",
        },
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        eyebrow: "0.18em",
      },
    },
  },
  plugins: [],
};

export default config;
