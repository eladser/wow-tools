/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'wow-blue': '#00b4ff',
        'wow-gold': '#f4c430',
        'wow-purple': '#a335ee',
        'wow-orange': '#ff8000',
        'wow-green': '#1eff00',
      },
      backgroundImage: {
        'wow-gradient': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      },
    },
  },
  plugins: [],
};
