import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#FFEBE6',
          200: '#FFC9BA',
          300: '#FEA68E',
          400: '#FE7B5E',
          500: '#FD512E', // Main color from logo
          600: '#FD4233',
          700: '#E5301F',
          800: '#B8210F',
          900: '#8A1507',
          DEFAULT: '#FD512E',
        },
        background: '#FFFFFF',
        surface: '#F6F7F9',
        'chip-bg': '#EDEEF1',
        'dark-grey': '#111111',
        'medium-grey': '#555555',
        divider: '#E4E6EA',
        white: '#FFF'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'title-l': '1.4rem',
        'title-m': '1.2rem',
        body: '1rem',
        small: '0.85rem',
      },
      borderRadius: {
        chip: '8px',
        surface: '10px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
      },
    },
  },
  plugins: [],
}
export default config
