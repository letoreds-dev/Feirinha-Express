import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#ea1d2c',
          'red-dark': '#bd1320',
          ink: '#1f1a17',
          muted: '#756f6a',
          line: '#ece5dc',
          paper: '#fffaf4',
          card: '#ffffff',
          soft: '#fff0f2',
          green: '#12805c',
          blue: '#2356c4',
          yellow: '#fff5d8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 16px 36px rgba(33, 24, 18, 0.12)',
        soft: '0 8px 22px rgba(33, 24, 18, 0.08)',
      },
      borderRadius: {
        card: '14px',
        pill: '999px',
      },
    },
  },
  plugins: [],
}

export default config