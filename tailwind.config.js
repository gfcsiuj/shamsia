/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Tajawal', 'sans-serif'],
            },
            colors: {
                emerald: {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    300: '#6ee7b7',
                    400: '#34d399',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857',
                    800: '#065f46',
                    900: '#064e3b',
                },
                primary: {
                    50: 'rgb(var(--color-primary-50) / <alpha-value>)',
                    100: 'rgb(var(--color-primary-100) / <alpha-value>)',
                    200: 'rgb(var(--color-primary-200) / <alpha-value>)',
                    300: 'rgb(var(--color-primary-300) / <alpha-value>)',
                    400: 'rgb(var(--color-primary-400) / <alpha-value>)',
                    500: 'rgb(var(--color-primary-500) / <alpha-value>)',
                    600: 'rgb(var(--color-primary-600) / <alpha-value>)',
                    700: 'rgb(var(--color-primary-700) / <alpha-value>)',
                    800: 'rgb(var(--color-primary-800) / <alpha-value>)',
                    900: 'rgb(var(--color-primary-900) / <alpha-value>)',
                },
                secondary: {
                    400: 'rgb(var(--color-secondary-400) / <alpha-value>)',
                    500: 'rgb(var(--color-secondary-500) / <alpha-value>)',
                    600: 'rgb(var(--color-secondary-600) / <alpha-value>)',
                },
                accent: {
                    50: 'rgb(var(--color-accent-50) / <alpha-value>)',
                    100: 'rgb(var(--color-accent-100) / <alpha-value>)',
                    200: 'rgb(var(--color-accent-200) / <alpha-value>)',
                    300: 'rgb(var(--color-accent-300) / <alpha-value>)',
                    400: 'rgb(var(--color-accent-400) / <alpha-value>)',
                    500: 'rgb(var(--color-accent-500) / <alpha-value>)',
                    600: 'rgb(var(--color-accent-600) / <alpha-value>)',
                    700: 'rgb(var(--color-accent-700) / <alpha-value>)',
                    800: 'rgb(var(--color-accent-800) / <alpha-value>)',
                    900: 'rgb(var(--color-accent-900) / <alpha-value>)',
                }
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'fade-in-down': 'fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'fade-in': 'fadeIn 0.6s ease-out forwards',
                'fade-up': 'fadeUp 0.8s ease-out forwards',
                'scale-in': 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'pop-in': 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                'slide-in-right': 'slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'slide-in-left': 'slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'bounce-slow': 'bounce 3s infinite',
                'float': 'float 8s ease-in-out infinite',
                'blob': 'blob 7s infinite',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInDown: {
                    '0%': { opacity: '0', transform: 'translateY(-30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                popIn: {
                    '0%': { opacity: '0', transform: 'scale(0.5)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px) rotate(1deg)' },
                    '50%': { transform: 'translateY(-20px) rotate(-1deg)' },
                },
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                shimmer: {
                    '100%': { transform: 'translateX(100%)' },
                }
            },
            backgroundImage: {
                'grid-pattern': 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
                'grid-pattern-dark': 'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)'
            }
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
    plugins: [],
}
