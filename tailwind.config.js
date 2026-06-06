/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        green: '#19a887',
        sky: '#1687dd',
        'sky-neutral': '#daecfa',
        blue: '#03324f',
        neutral: '#f0f4fa',
        orange: '#fca136',
        'rc-blue': '#1a3d52',
        'rc-orange': '#c47d1a',
        rc: {
          'text-base': '#03324f',
        },
      }
    },
    fontFamily: {
      sans: ['Montserrat', 'system-ui', 'sans-serif'],
      display: ['Montserrat', 'system-ui', 'sans-serif'],
    },
  },
  plugins: [],
};
