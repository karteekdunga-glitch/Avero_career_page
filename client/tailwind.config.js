/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        averoBlue: '#0a4a6b',
        averoGreen: '#2fb57c'
      }
    }
  },
  plugins: []
}
