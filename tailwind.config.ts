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
        'title-l': '1.125rem',
        'title-m': '1rem',
        body: '.875rem',
        small: '0.75rem',
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
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float-slow 5s ease-in-out infinite',
        'float-delayed': 'float-delayed 4.5s ease-in-out infinite 0.5s',
        'phone-float': 'phone-float 6s ease-in-out infinite',
        'phone-float-left': 'phone-float-left 7s ease-in-out infinite 0.5s',
        'phone-float-right': 'phone-float-right 6.5s ease-in-out infinite 1s',
        'fade-slide-up': 'fade-slide-up 0.7s ease-out both',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'float-delayed': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'phone-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'phone-float-left': {
          '0%, 100%': { transform: 'rotate(-8deg) translateY(20px)' },
          '50%': { transform: 'rotate(-8deg) translateY(10px)' },
        },
        'phone-float-right': {
          '0%, 100%': { transform: 'rotate(8deg) translateY(20px)' },
          '50%': { transform: 'rotate(8deg) translateY(10px)' },
        },
        'fade-slide-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
