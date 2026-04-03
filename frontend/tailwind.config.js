import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Manrope", "sans-serif"]
      },
      colors: {
        brand: {
          50: "rgb(var(--brand-50) / <alpha-value>)",
          100: "rgb(var(--brand-100) / <alpha-value>)",
          200: "rgb(var(--brand-200) / <alpha-value>)",
          300: "rgb(var(--brand-300) / <alpha-value>)",
          400: "rgb(var(--brand-400) / <alpha-value>)",
          500: "rgb(var(--brand-500) / <alpha-value>)",
          600: "rgb(var(--brand-600) / <alpha-value>)",
          700: "rgb(var(--brand-700) / <alpha-value>)",
          800: "rgb(var(--brand-800) / <alpha-value>)",
          900: "rgb(var(--brand-900) / <alpha-value>)"
        }
      },
      boxShadow: {
        glow: "0 30px 80px rgba(var(--brand-600), 0.24)"
      },
      backgroundImage: {
        mesh:
          "radial-gradient(circle at 15% 20%, rgba(var(--brand-400), 0.16), transparent 32%), radial-gradient(circle at 80% 75%, rgba(var(--brand-200), 0.24), transparent 34%), radial-gradient(circle at 60% 12%, rgba(var(--brand-900), 0.06), transparent 26%)"
      }
    }
  },
  plugins: [forms]
};
