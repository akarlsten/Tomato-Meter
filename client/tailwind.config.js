module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Varela Round', 'sans-serif'],
      mono: ['Inconsolata', 'monospace']
    },
    extend: {
      spacing: {
        '108': '28rem',
        '120': '32rem',
        '132': '36rem',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
