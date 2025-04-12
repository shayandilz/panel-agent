const { colors: defaultColors } = require('tailwindcss/defaultTheme')

const colors = {
    ...defaultColors,
    ...{
        "custom-primary": {
            "500": "#1a53aa",
        },
        "custom-secondary": {
            "500": "#f7aa21",
        },
    },
}

module.exports = {
    "theme": {
        "colors": colors,
    }
};