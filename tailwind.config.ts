import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FCF8F6",
        rose: { DEFAULT: "#B76E62", dark: "#9C574C" },
        blush: "#F1DAD5",
        cocoa: "#49302B",
        champagne: "#EDE4D6",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: { luxe: "0.22em" },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(14px)" }, "100%": { opacity: "1", transform: "none" } },
      },
      animation: { fadeUp: "fadeUp .8s ease both" },
    },
  },
  plugins: [],
};
export default config;
