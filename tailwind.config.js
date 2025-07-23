export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'orange-gradient': 'linear-gradient(to right, #E6911E, #FFB347B2)',
      },
      colors: {
        primary: '#E6911E',
        'primary-light': 'rgba(255, 179, 71, 0.7)',
        // gray: '#7B7B7B'
      }
    }
  },
  plugins: [],
}