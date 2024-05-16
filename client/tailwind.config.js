/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#222831',
        'secondary': '#393E46',
        'text': '#00ADB5',
        'background': '#EEEEEE'
      }
    },
  },
  plugins: [],
}

