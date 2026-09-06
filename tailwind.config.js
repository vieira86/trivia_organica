/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          red: '#ef4444',
          blue: '#3b82f6',
          yellow: '#eab308',
          green: '#22c55e'
        }
      },
      animation: {
        'dice-roll': 'diceRoll 0.8s ease-in-out',
        'piece-move': 'pieceMove 0.5s ease-in-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'confetti-fall': 'confettiFall 3s linear forwards',
        'modal-pop': 'modalPop 0.25s ease-out',
        'blob': 'blobFloat 9s ease-in-out infinite',
        'blob-delayed': 'blobFloat 9s ease-in-out infinite 3s',
        'fade-in-up': 'fadeInUp 0.6s ease-out both',
        'float-slow': 'floatSlow 5s ease-in-out infinite',
        'spin-slow': 'spin 6s linear infinite'
      },
      keyframes: {
        modalPop: {
          '0%': { transform: 'scale(0.95)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 }
        },
        diceRoll: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '25%': { transform: 'rotate(90deg) scale(1.1)' },
          '50%': { transform: 'rotate(180deg) scale(1)' },
          '75%': { transform: 'rotate(270deg) scale(1.1)' },
          '100%': { transform: 'rotate(360deg) scale(1)' }
        },
        pieceMove: {
          '0%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(var(--move-x), var(--move-y)) scale(1.2)' },
          '100%': { transform: 'translate(var(--move-x), var(--move-y)) scale(1)' }
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        confettiFall: {
          '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: 1 },
          '100%': { transform: 'translateY(105vh) rotate(360deg)', opacity: 0.4 }
        },
        blobFloat: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(20px, -25px) scale(1.08)' },
          '66%': { transform: 'translate(-15px, 15px) scale(0.95)' }
        },
        fadeInUp: {
          '0%': { transform: 'translateY(16px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 }
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(3deg)' }
        }
      }
    },
  },
  plugins: [],
}
