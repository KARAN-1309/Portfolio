/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-black':  '#000000',
        'brand-dark':   '#3E3636',
        'brand-red':    '#D72323',
        'brand-light':  '#F5EDED',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.6s ease-out forwards',
        'slide-up':   'slideUp 0.7s ease-out forwards',
        'slide-left': 'slideLeft 0.7s ease-out forwards',
        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite',
        'scan-line':  'scanLine 3s linear infinite',
        'border-run': 'borderRun 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%':   { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px #D72323, 0 0 20px #D72323' },
          '50%':       { boxShadow: '0 0 20px #D72323, 0 0 60px #D72323, 0 0 80px #D72323' },
        },
        scanLine: {
          '0%':   { top: '0%' },
          '100%': { top: '100%' },
        },
        borderRun: {
          '0%':   { 'background-position': '0% 50%' },
          '100%': { 'background-position': '200% 50%' },
        },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(215,35,35,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(215,35,35,0.07) 1px, transparent 1px)",
        'radial-red':   'radial-gradient(ellipse at center, rgba(215,35,35,0.15) 0%, transparent 70%)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
    },
  },
  plugins: [],
};