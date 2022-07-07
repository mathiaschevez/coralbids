/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coralblack: '#101419',
        coralblue: '#3DB3BB',
        coralgreen: '#79BF8B ',
      }
    },
  },
  plugins: [],
}
