import type { Config } from "tailwindcss";

// Talentbank look: white background, one red accent, strong type hierarchy.
// The status-chip colours (green/amber/red/grey) come straight from Tailwind's
// default palette in the components that use them — kept simple on purpose.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Single red accent picked from Talentbank's branding.
        brand: {
          DEFAULT: "#D81E2C",
          dark: "#B01722",
        },
      },
    },
  },
  plugins: [],
};

export default config;
