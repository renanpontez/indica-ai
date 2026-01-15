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
        primary: '#111111',
        background: '#FFFFFF',
        surface: '#F6F7F9',
        'chip-bg': '#EDEEF1',
        'text-primary': '#111111',
        'text-secondary': '#555555',
        divider: '#E4E6EA',
        accent: '#FD512E',
        'accent-hover': '#FD4233',
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
        chip: '12px',
        surface: '14px',
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
