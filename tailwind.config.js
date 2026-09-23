/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './App.tsx'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E8849A',
          soft: '#F5B5C4',
          deep: '#D46A82',
          muted: '#FCE8EE',
        },
        secondary: {
          DEFAULT: '#B8A4D4',
          soft: '#D4C8E8',
          deep: '#9A84BC',
          muted: '#F0EBF7',
        },
        background: {
          DEFAULT: '#FFF5F7',
          warm: '#FFF9FA',
          card: 'rgba(255, 255, 255, 0.78)',
        },
        ink: {
          DEFAULT: '#2D2A32',
          muted: '#7A7480',
          soft: '#A39DA8',
        },
        success: {
          DEFAULT: '#7BC4A0',
          soft: '#E5F6EE',
        },
        warning: {
          DEFAULT: '#E8B86D',
          soft: '#FBF3E3',
        },
        danger: {
          DEFAULT: '#E8928A',
          soft: '#FCECEA',
        },
      },
      borderRadius: {
        card: '24px',
        pill: '999px',
      },
      fontFamily: {
        display: ['Livvic_900Black'],
        heading: ['Livvic_700Bold'],
        body: ['Inter_400Regular'],
        accent: ['Poppins_600SemiBold'],
      },
    },
  },
  plugins: [],
};
