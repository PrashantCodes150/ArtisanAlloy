/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                jewelry: {
                    gold: '#D4AF37',
                    'gold-light': '#F4D03F',
                    'gold-dark': '#B8931A',
                    rose: '#B76E79',
                    'rose-light': '#D4A5A5',
                    'rose-dark': '#8B4C55',
                    silver: '#C0C0C0',
                    'silver-light': '#E8E8E8',
                    'silver-dark': '#808080',
                    dark: '#2C2C2C',
                    'dark-light': '#3D3D3D',
                    'dark-deep': '#0A0A0A',
                    cream: '#F5F5DC',
                    'cream-light': '#FFFEF0',
                },
            },
            fontFamily: {
                display: ['Playfair Display', 'serif'],
                body: ['Lora', 'serif'],
                sans: ['Montserrat', 'sans-serif'],
                title: ['Cormorant Garamond', 'serif'],
                subtitle: ['Inter', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
                'gradient-rose': 'linear-gradient(135deg, #B76E79 0%, #D4A5A5 100%)',
            },
        },
    },
    plugins: [],
}
