/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        misa: {
          blue: '#005F9E',
          'blue-light': '#E6F0F8',
          green: '#2ECC71',
          orange: '#FF5733',
          dark: '#2C3E50',
          gray: '#F8F9FA',
          border: '#DCDFE6'
        }
      }
    },
  },
  plugins: [],
}