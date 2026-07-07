/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#030A05',
        'card': '#0A1A0D',
        'card-hover': '#0F2315',
        'accent': '#00E676',
        'accent-dark': '#00C853',
        'accent-glow': 'rgba(0,230,118,0.10)',
        'teal': '#00BCD4',
        'amber': '#FFC107',
        'danger': '#FF5252',
        'text-primary': '#D4EDDA',
        'text-soft': '#7A9A80',
        'text-muted': '#3D5C42',
        'border': 'rgba(0,230,118,0.12)',
        'border-mid': 'rgba(0,230,118,0.28)'
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        'cards': '1rem',
        'buttons': '0.75rem',
      },
      boxShadow: {
        'card-glow': '0 0 30px rgba(0,230,118,0.06)',
        'button-glow': '0 0 20px rgba(0,230,118,0.25)',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        'count-up': {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        'slide-up': {
          'from': { transform: 'translateY(20px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' }
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,230,118,0.25)' },
          '50%': { boxShadow: '0 0 40px rgba(0,230,118,0.5)' }
        }
      },
      animation: {
        'pulse-ring': 'pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'glow-pulse': 'glow-pulse 2s infinite',
      }
    },
  },
  plugins: [],
}
