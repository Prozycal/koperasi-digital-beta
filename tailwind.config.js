module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navyDark': '#213555',
        'snavy': '#3E5879',
        'sbeige': '#D8C4B6',
        'creamy': '#F5EFE7',
        'creamyLight': '#f8fac3',
        'navyDarkest': '#1d2040'
      },
      fontFamily: {
        typographica: ['Typographica', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
