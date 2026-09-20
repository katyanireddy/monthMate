/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          soft: 'rgb(var(--color-primary-soft) / <alpha-value>)',
          dark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
        },
        lavender: 'rgb(var(--color-lavender) / <alpha-value>)',
        plum: 'rgb(var(--color-plum) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
      },
      borderRadius: {
        xl2: '1.25rem',
        xl3: '1.75rem',
      },
      boxShadow: {
        soft: '0 4px 20px -4px rgba(58, 37, 64, 0.08)',
        card: '0 2px 14px -2px rgba(237, 79, 134, 0.10)',
        lift: '0 12px 30px -8px rgba(237, 79, 134, 0.22)',
      },
    },
  },
  plugins: [],
}
