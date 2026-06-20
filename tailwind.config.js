/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        cream: {
          50: "#FAF8F3",
          100: "#F5F1E8",
          200: "#EDE5D4",
          300: "#E0D4BA",
        },
        teal: {
          700: "#2D4A4E",
          600: "#3A5A5F",
          500: "#4D6E73",
          400: "#6B8C90",
          100: "#D8E4E5",
        },
        terracotta: {
          600: "#C75B39",
          500: "#D47152",
          100: "#F7E1D9",
        },
        sage: {
          500: "#7A8B6F",
          100: "#E4E9DF",
        },
        sand: {
          500: "#B89968",
          100: "#F0E6D4",
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', "serif"],
        sans: ['"Noto Sans SC"', "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 12px rgba(45, 74, 78, 0.08)",
        cardHover: "0 8px 24px rgba(45, 74, 78, 0.12)",
      },
      borderRadius: {
        xl2: "12px",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
