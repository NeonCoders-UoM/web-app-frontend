/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // Scan all app files
    './components/**/*.{js,ts,jsx,tsx}', // Scan all components
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        primary: {
          100: '#DBEAFE',
          200: '#93C5FD',
          300: '#60A5FA',
        },
      },
    },
  },
  plugins: [],
};