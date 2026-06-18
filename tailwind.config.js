/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1976D2',
          dark: '#1565C0',
          light: '#BBDEFB',
        },
        secondary: {
          DEFAULT: '#FF6F00',
        },
        background: {
          DEFAULT: '#F5F7FA',
          paper: '#FFFFFF',
        },
        success: {
          DEFAULT: '#2E7D32',
        },
        error: {
          DEFAULT: '#C62828',
        },
      },
      borderRadius: {
        pill: '24px',
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
