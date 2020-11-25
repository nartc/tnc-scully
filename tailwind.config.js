const { fontFamily, spacing } = require('tailwindcss/defaultTheme');

module.exports = (isProd) => ({
  prefix: '',
  important: true,
  purge: {
    enabled: isProd,
    content: ['./src/**/*.html', './src/**/*.ts'],
  },
  theme: {
    fontFamily: {
      sans: ['Quicksand', ...fontFamily.sans],
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      inset: {
        1: '1rem',
        2: '1.5rem',
      },
      spacing: {
        '2-rev': `-${spacing['2']}`,
      },
      boxShadow: {
        common: 'var(--shadow)',
      },
      maxWidth: {
        32: '8rem',
      },
      minHeight: {
        128: '32rem',
      },
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        'gray-light': 'var(--gray-light)',
        'gray-medium': 'var(--gray-medium)',
        'gray-dark': 'var(--gray-dark)',
        text: 'var(--text-color)',
      },
    },
  },
});
