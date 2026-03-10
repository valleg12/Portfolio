import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        bg: '#050510',
        primary: '#6366f1',
        accent: '#22d3ee',
        muted: '#94a3b8',
      },
    },
  },
  plugins: [],
}

export default config
