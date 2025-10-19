// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        customBlue: '#BFDBFE', // Define a custom blue color
      },
      fontFamily: {
        times: ['"Times New Roman"', 'serif'], // Use Times New Roman
      },
    },
  },
  plugins: [],
};
