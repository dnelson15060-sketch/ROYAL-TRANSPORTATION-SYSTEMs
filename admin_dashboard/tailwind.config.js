/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#003DA5',
          50: '#e6ecf7',
          100: '#c0d0ec',
          200: '#94b0df',
          300: '#6890d2',
          400: '#3c70c5',
          500: '#003DA5',
          600: '#003792',
          700: '#002d78',
          800: '#00235e',
          900: '#001a45',
        },
        accent: {
          DEFAULT: '#E31937',
          50: '#fdeaed',
          100: '#fbc9d1',
          200: '#f594a3',
          300: '#ef5f75',
          400: '#e93f5c',
          500: '#E31937',
          600: '#c11530',
          700: '#9c1127',
          800: '#770d1e',
          900: '#520914',
        },
        background: '#f8fafc',
      },
    },
  },
  plugins: [],
};
