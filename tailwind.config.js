/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          950: '#06020c',
          900: '#0a0414',
          850: '#0f0720',
          800: '#160b2f',
          750: '#1d0e3d',
          700: '#281353',
          600: '#43197f',
          500: '#7c3aed',
          400: '#a855f7',
          300: '#c084fc',
          200: '#e9d5ff',
          100: '#f5eeff',
          neon: '#d946ef',
          teal: '#2dd4bf',
          gold: '#fbbf24',
          crimson: '#f43f5e'
        }
      },
      boxShadow: {
        'void-sm': '0 0 12px rgba(168, 85, 247, 0.2)',
        'void': '0 0 20px rgba(168, 85, 247, 0.35)',
        'void-lg': '0 0 35px rgba(217, 70, 239, 0.4)',
        'void-glow': '0 0 50px rgba(124, 58, 237, 0.55)',
        'void-card': '0 8px 32px 0 rgba(0, 0, 0, 0.6)'
      },
      fontFamily: {
        display: ['Cinzel', 'Trajan Pro', 'Cinzel Decorative', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { opacity: '0.6', filter: 'drop-shadow(0 0 10px #a855f7)' },
          '100%': { opacity: '1', filter: 'drop-shadow(0 0 25px #d946ef)' },
        }
      }
    },
  },
  plugins: [],
}
