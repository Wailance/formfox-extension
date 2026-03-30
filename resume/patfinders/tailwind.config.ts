import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0F172A",
        foreground: "#FFFFFF",
        primary: "#10B981",
        secondary: "#F59E0B",
        accent: "#8B5CF6"
      }
    }
  },
  plugins: []
};

export default config;
