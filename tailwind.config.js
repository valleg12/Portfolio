/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
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
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translate(-50%, -55%)' },
          '50%': { transform: 'translate(-50%, -45%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translate(-50%, -60%)' },
          '100%': { opacity: '0.6', transform: 'translate(-50%, -50%)' },
        },
        rotateRight: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(90deg)' },
        },
        scroll: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 -100px' }
        },
        'scroll-horizontal': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '100px 0' }
        },
        wave: {
          '0%': { transform: 'translateY(0) scale(0.8)' },
          '50%': { transform: 'translateY(-20%) scale(1)' },
          '100%': { transform: 'translateY(0) scale(0.8)' }
        }
      },
      animation: {
        wiggle: 'wiggle 0.3s ease-in-out',
        float: 'float 3s ease-in-out infinite',
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        rotateRight: 'rotateRight 0.2s ease-out forwards',
        scroll: 'scroll 5s linear infinite',
        'scroll-horizontal': 'scroll-horizontal 3s linear infinite',
        'wave': 'wave 3s ease-in-out infinite',
      }
    },
  },
} 