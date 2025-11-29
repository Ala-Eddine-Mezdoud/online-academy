/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Core color variables (mapped to CSS variables) */
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        primary: "var(--primary)",
        "primary-600": "var(--primary-600)",
        secondary: "var(--secondary)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        destructive: "var(--destructive)",
        border: "var(--border)",

        /* EduConnect / neutrals compatibility tokens */
        "neutral-100": "var(--neutral-100)",
        "neutral-200": "var(--neutral-200)",
        "neutral-500": "var(--neutral-500)",
        "neutral-700": "var(--neutral-700)",
        success: "var(--success)",
        error: "var(--error)",
      },
      fontFamily: {
        /* Use CSS variables to prefer runtime-swappable fonts if desired */
        sans: ['var(--font-inter)', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
        display: ['var(--font-poppins)', 'Poppins', 'Inter', 'system-ui', 'sans-serif'],
        opensans: ['"Open Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: ["class", '[data-theme="dark"]'],
};
