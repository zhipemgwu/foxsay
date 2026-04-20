/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/*.{js,jsx,ts,tsx}",
    "./src/components/*.{js,jsx,ts,tsx}",
    "./src/components/figma/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D8C4E6',
        'primary-dark': '#C0A8D8',
        'primary-light': '#E8D8F0',
        'secondary-blue': '#D8E8F5',
        'secondary-mint': '#E0F5E8',
        'secondary-peach': '#F5DCC8',
        'secondary-pink': '#F5D8E8',
        'text-primary': '#3D3D3D',
        'text-secondary': '#999999',
        'text-light': '#CCCCCC',
      },
      spacing: {
        xs: '12px',
        sm: '16px',
        md: '20px',
        lg: '24px',
        xl: '32px',
        '2xl': '40px',
        '3xl': '64px',
      },
      borderRadius: {
        base: '16px',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
      fontSize: {
        '2xs': '10px',
        xs: '12px',
        sm: '14px',
        base: '16px',
        md: '18px',
        lg: '20px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '40px',
      },
    },
  },
  plugins: [],
}
