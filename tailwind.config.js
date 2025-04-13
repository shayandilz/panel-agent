const { colors: defaultColors } = require('tailwindcss/defaultTheme')

const colors = {
    ...defaultColors,
    ...{
        "blue-light": {
            light: '#2169d7',
            "500": "#1a53aa",
            DEFAULT: '#1a53aa',
            dark: '#133d7c',
        },
        brand: {
            light: '#2169d7',
            "500": "#1a53aa",
            DEFAULT: '#1a53aa',
            dark: '#133d7c',
        },
        primary: {
            light: '#2169d7',
            "500": "#1a53aa",
            DEFAULT: '#1a53aa',
            dark: '#133d7c',
        },
        secondary: {
            light: '#ffbc52',
            "500": "#f7aa21",
            DEFAULT: '#f7aa21',
            dark: '#b47508',
        },
    },
}

module.exports = {
    "theme": {
        "colors": colors,
    }
};