import type { Config } from "tailwindcss";

/**
 * Apple-inspired design tokens.
 * Theme-able colors are wired to CSS variables (space-separated RGB triplets)
 * defined in `globals.css`, so light/dark adapt automatically.
 */
const config: Config = {
  darkMode: "media",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        brand: {
          DEFAULT: "#0071e3",
          dark: "#0077ed",
          50: "#eef6ff",
          100: "#d9ecff",
          200: "#bcddff",
          500: "#0071e3",
          600: "#0062c4",
          700: "#0052a6",
        },
        success: {
          DEFAULT: "#1fb35a",
          soft: "#e7f8ee",
        },
        danger: {
          DEFAULT: "#e0352b",
          soft: "#fdebea",
        },
        warning: {
          DEFAULT: "#f59e0b",
          soft: "#fff4e2",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -12px rgba(0,0,0,0.12)",
        card: "0 1px 3px rgba(0,0,0,0.05), 0 12px 32px -16px rgba(0,0,0,0.14)",
        lifted: "0 8px 40px -12px rgba(0,0,0,0.22)",
      },
      maxWidth: {
        content: "1180px",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.97)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
        "scale-in": "scale-in 0.2s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
