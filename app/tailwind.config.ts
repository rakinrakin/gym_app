import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18181b",
        surface: "#f6f7f9",
        volt: {
          50: "#faffea",
          100: "#f4ffc5",
          200: "#eaff8e",
          300: "#d9ff4c",
          400: "#ccff00", // Athletic electric volt
          500: "#b0e600",
          600: "#8ab800",
          700: "#688a00",
          800: "#526c07",
          900: "#445b0a"
        },
        cyan: {
          400: "#00f0ff",
          500: "#00d4e3"
        }
      }
    }
  },
  plugins: []
} satisfies Config;
