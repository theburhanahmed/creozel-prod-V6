/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}',
        "*.{js,ts,jsx,tsx,mdx}"
    ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
    extend: {
      screens: {
        xs: '475px',
      },
      animation: {
        gradient: 'gradient 8s ease infinite',
        glow: 'glow 3s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        'spin-slow': 'spin-slow 10s linear infinite',
      },
    },
  },
  plugins: [],
}
