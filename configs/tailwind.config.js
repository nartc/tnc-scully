const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  prefix: '',
  important: true,
  separator: ':',
  theme: {
    fontFamily: {
      sans: ['"Open Sans"', ...fontFamily.sans],
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      inset: {
        '1': '1rem',
        '2': '1.5rem',
      },
      boxShadow: {
        common: 'var(--shadow)',
      },
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        'gray-light': 'var(--gray-light)',
        'gray-medium': 'var(--gray-medium)',
        'gray-dark': 'var(--gray-dark)',
      },
    },
  },
};
