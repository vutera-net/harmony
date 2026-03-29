import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#fafafa", // Light Zen gray
        foreground: "#111111", // Deep ink
        tuviPrimary: "#8c1c13", // Đỏ bã trầu (Traditional scholarly color)
      },
      fontFamily: {
        serif: ["'Noto Serif'", "serif"], // Cho tiêu đề học thuật
        sans: ["Inter", "sans-serif"],   // Cho body text
      }
    },
  },
  plugins: [
    typography, // Cho hiển thị rich text (MDX)
  ],
};
export default config;
