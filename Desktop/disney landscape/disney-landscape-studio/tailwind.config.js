/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Natural Sage Greens
        sage: {
          50: '#f6f7f4',
          100: '#e3e7dc',
          200: '#c8d0bb',
          300: '#a5b393',
          400: '#839672',
          500: '#677c56',
          600: '#506242',
          700: '#3f4d36',
          800: '#353f2e',
          900: '#2d3528',
        },
        // Secondary - Forest Greens
        forest: {
          50: '#f3f6f3',
          100: '#e3ebe2',
          200: '#c8d7c6',
          300: '#a1b99e',
          400: '#759672',
          500: '#557852',
          600: '#416040',
          700: '#354d35',
          800: '#2c3f2c',
          900: '#253426',
        },
        // Accent - Olive/Gold tones
        olive: {
          50: '#f9f8f3',
          100: '#f0ede0',
          200: '#e0dac3',
          300: '#ccc19d',
          400: '#b8a578',
          500: '#a8905d',
          600: '#927749',
          700: '#785f3d',
          800: '#644f37',
          900: '#554331',
        },
        // Warm Wood Tones
        wood: {
          50: '#faf8f5',
          100: '#f4f0e8',
          200: '#e8dfd0',
          300: '#d8c9b0',
          400: '#c5af8e',
          500: '#b59972',
          600: '#a6845c',
          700: '#8a6c4d',
          800: '#715944',
          900: '#5e4b3a',
        },
        // Background Creams
        cream: {
          50: '#fefdfb',
          100: '#fdf9f3',
          200: '#faf4e8',
          300: '#f5ebd8',
          400: '#ede0c4',
          500: '#e4d3ad',
        },
      },
    },
  },
  plugins: [],
}
