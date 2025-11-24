module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    colors: {
      limeCustom: '#BCEC30',
      limeHover: '#C6FF00',
    },
    fontSize: {
      titleToforty: '40px',
    },
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
      },
    },
  },
};

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ['./src/**/*.{html,js}'],
//   theme: {
//     colors: {
//       blue: '#1fb6ff',
//       purple: '#7e5bef',
//       pink: '#ff49db',
//       orange: '#ff7849',
//       green: '#13ce66',
//       yellow: '#ffc82c',
//       'gray-dark': '#273444',
//       gray: '#8492a6',
//       'gray-light': '#d3dce6',
//     },
//     fontFamily: {
//       sans: ['Graphik', 'sans-serif'],
//       serif: ['Merriweather', 'serif'],
//     },
//     extend: {
//       spacing: {
//         '8xl': '96rem',
//         '9xl': '128rem',
//       },
//       borderRadius: {
//         '4xl': '2rem',
//       },
//     },
//   },
// };
