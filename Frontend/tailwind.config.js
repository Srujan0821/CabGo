/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'car-to-pickup': {
          '0%': { left: 'calc(4rem - 20px)' }, // Start near origin marker
          '100%': { left: 'calc(50% - 20px)' }, // Move to the middle of the route
        },
        'car-to-dropoff': {
          '0%': { left: 'calc(50% - 20px)' }, // Start from middle
          '100%': { left: 'calc(100% - 4rem - 20px)' }, // Move to the end marker
        },
        'pulse-light': { // A lighter pulse than default Tailwind's pulse
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.7' },
        },
        // Keep existing animations if you use them elsewhere
        'bounce-horizontal': {
          '0%, 100%': {
            transform: 'translateX(0)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateX(25%)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        'ping-slow': {
          '75%, 100%': {
            transform: 'scale(1.5)',
            opacity: '0',
          },
        },
      },
      animation: {
        'car-to-pickup': 'car-to-pickup 3s ease-in-out forwards', // Adjust duration and easing
        'car-to-dropoff': 'car-to-dropoff 7s ease-in-out forwards', // Adjust duration and easing
        'pulse-light': 'pulse-light 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-horizontal': 'bounce-horizontal 1s infinite',
        'ping-slow': 'ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
};
