const withAnimations = require("animated-tailwindcss");

module.exports = withAnimations({
    content: ["./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}"],
    darkMode: 'class',
    theme: {
        extend: {
            //start banner animation
            keyframes: {
                fadeInSlideLeftDown: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateX(100px) translateY(-100px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translate(0)'
                    },
                },
                fadeInSlideRight: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateX(-100px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateX(0)'
                    },
                },
                fadeInSlideUp: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(100px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    },
                }
            },
            animation: {
                fadeInSlideLeftDown: 'fadeInSlideLeftDown 3s ease-out',
                fadeInSlideRight: 'fadeInSlideRight 3s ease-out',
                fadeInSlideUp: 'fadeInSlideUp 3s ease-out'
            }
            //end of banner animation

        },
    },
    variants: {

        extend: {
            scrollBehavior: ['motion-safe', 'motion-reduce', 'responsive']
        },
    },
    plugins: [
        require('@tailwindcss/aspect-ratio'),
        require('@tailwindcss/forms'),
        require('tailwind-scroll-behavior')(),
    ],
});




