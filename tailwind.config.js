/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          900: '#0a0505',
          800: '#140a0a',
          700: '#1e0f0f',
        },
        crimson: {
          900: '#4a0f16',
          800: '#7a1824',
          700: '#a32638',
          600: '#c82f45',
          neon: '#ff4d64',
        },
        wine: '#5e101d',
        rose: '#d99a9e',
        amber: '#d97736',
        gold: '#cca35e',
        offwhite: '#f5f2ee',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cinzel', 'serif'],
      },
      borderRadius: {
        'xl': '24px',
        '2xl': '32px',
        '3xl': '40px',
      },
      boxShadow: {
        'glass': '0 15px 40px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.15)',
        'glass-active': '0 20px 50px rgba(0,0,0,0.8), inset 0 2px 5px rgba(255,255,255,0.25), 0 0 30px rgba(163,38,56,0.2)',
        'bubble': '0 15px 30px rgba(0,0,0,0.5), inset 2px 2px 10px rgba(255,255,255,0.15), inset -4px -4px 15px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(20,10,10,0.4) 0%, rgba(10,5,5,0.2) 100%)',
        'active-gradient': 'linear-gradient(90deg, rgba(163,38,56,0.15) 0%, transparent 100%)',
      }
    },
  },
  plugins: [],
}
