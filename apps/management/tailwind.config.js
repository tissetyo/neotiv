/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f172a', // Slate 900 for serious admin feel
          light: '#334155',
          50: '#f8fafc',
          100: '#f1f5f9'
        },
        accent: {
          DEFAULT: '#0284c7', // Professional Blue
          light: '#38bdf8'
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        bg: {
          body: '#f1f5f9', // slate-100
          card: '#ffffff'
        },
        text: {
          primary: '#0f172a',
          secondary: '#475569',
          muted: '#94a3b8'
        },
        border: {
          light: '#e2e8f0',
          dark: '#cbd5e1'
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'float': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
      }
    },
  },
  plugins: [],
};
