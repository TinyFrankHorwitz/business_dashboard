import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#161616",
        cream: "#f7f0df",
        sand: "#ead8b5",
        ember: "#c85c39",
        moss: "#617a55",
        slate: "#364153"
      },
      boxShadow: {
        card: "0 18px 50px rgba(22, 22, 22, 0.08)"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
