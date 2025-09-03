/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        darkG: '#235C4A',
        lightG: '#33CC66',
        lightB: '#6699FF',
        red: '#FF0000',
        darkGrey: '#333333'
      }
    },
  },
  plugins: [],
}

