/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        apple: {
          bg: '#000000',
          base: '#050507',
          surface: '#121215',
          card: '#18181b',
          elevated: '#202024',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-hover': 'rgba(255, 255, 255, 0.22)',
          blue: '#2997ff',
          'blue-hover': '#147ce5',
          text: '#f5f5f7',
          muted: '#86868b',
          subtle: '#6e6e73'
        },
        brand: {
          DEFAULT: '#ffffff',
          hover: '#e5e5ea',
          dark: '#1c1c1e',
          accent: '#2997ff',
          glow: 'rgba(255, 255, 255, 0.25)',
          muted: 'rgba(255, 255, 255, 0.12)'
        },
        cinema: {
          950: '#000000',
          900: '#0a0a0c',
          850: '#111114',
          800: '#18181c',
          700: '#232328',
          600: '#34343a',
          500: '#52525a',
          400: '#86868b',
          300: '#a1a1a6',
          200: '#d2d2d7',
          100: '#f5f5f7'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"SF Pro Display"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', 'sans-serif'],
      },
      boxShadow: {
        'apple-card': '0 12px 36px -4px rgba(0, 0, 0, 0.7), 0 4px 12px -2px rgba(0, 0, 0, 0.5)',
        'apple-card-hover': '0 20px 48px -4px rgba(0, 0, 0, 0.85), 0 8px 24px -2px rgba(0, 0, 0, 0.6)',
        'apple-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'apple-button': '0 4px 16px rgba(255, 255, 255, 0.2)',
        'apple-blue': '0 4px 20px rgba(41, 151, 255, 0.4)',
        'modal': '0 25px 70px -10px rgba(0, 0, 0, 0.95)'
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
