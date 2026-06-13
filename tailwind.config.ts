import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1a56db",
          50: "#eff6ff",
          100: "#dbeafe",
          600: "#1d4ed8",
          700: "#1e40af",
          800: "#1a56db",
          900: "#1e3a8a",
        },
        gold: {
          DEFAULT: "#f59e0b",
          light: "#fde68a",
          dark: "#d97706",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
