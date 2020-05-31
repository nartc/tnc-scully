const { fontFamily, colors } = require('tailwindcss/defaultTheme');

module.exports = {
  prefix: '',
  important: false,
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
      colors: {
        primary: colors.purple['600'],
        secondary: colors.yellow['600'],
      },
    },
  },
};
