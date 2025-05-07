/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          50: '#E6EEF4',
          100: '#C0D5E3',
          200: '#97B9D0',
          300: '#6D9CBC',
          400: '#4E86AD',
          500: '#2E6F9F',
          600: '#0A3D62', // Main brand color
          700: '#093556',
          800: '#072D4A',
          900: '#05253E',
          950: '#031B2F',
        },
        slate: {
          950: '#0B1120',
        },
        blue: {
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        purple: {
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7E22CE',
        },
      },
      animation: {
        'bounce': 'bounce 1.5s infinite',
      },
      backgroundImage: {
        'card-gradient': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
        'grid-slate-900/20': `
          linear-gradient(to right, #1E293B20 1px, transparent 1px),
          linear-gradient(to bottom, #1E293B20 1px, transparent 1px)
        `,
      },
      boxShadow: {
        highlight: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
} 