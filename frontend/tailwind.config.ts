import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Galactic Dark Theme Colors
        galactic: {
          background: '#1A1528',
          surface: '#221B3A',
          accent: '#9B6BFF',
          highlight: '#E0AFFF',
          purple: {
            50: '#F3F0FF',
            100: '#E9E5FF',
            200: '#D6CCFF',
            300: '#B388EB',
            400: '#9B6BFF',
            500: '#8B5CF6',
            600: '#7C3AED',
            700: '#6D28D9',
            800: '#4C2E6D',
            900: '#2B1B4B',
            950: '#1A1528',
          },
          neon: {
            purple: '#9B6BFF',
            pink: '#B388EB',
            lavender: '#E0AFFF',
            blue: '#60A5FA',
            teal: '#34D399',
          }
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "galaxy-shimmer": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(155, 107, 255, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(155, 107, 255, 0.6)" },
        },
        "star-twinkle": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "galaxy-shimmer": "galaxy-shimmer 3s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "star-twinkle": "star-twinkle 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
      },
      backgroundImage: {
        "galaxy-gradient": "linear-gradient(135deg, #1A1528 0%, #2B1B4B 25%, #4C2E6D 50%, #2B1B4B 75%, #1A1528 100%)",
        "purple-glow": "radial-gradient(circle at center, rgba(155, 107, 255, 0.1) 0%, transparent 70%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config


