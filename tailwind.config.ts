import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', // Attio blue
        secondary: '#4f46e5',
        background: '#f8fafc',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'job-title': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'company': ['14px', { lineHeight: '20px', fontWeight: '500' }],
      },
      transitionDuration: {
        '150': '150ms',
      },
      transitionTimingFunction: {
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      gridTemplateColumns: {
        'job-grid': 'repeat(auto-fill, minmax(320px, 1fr))',
      },
      spacing: {
        'sidebar': '16rem', // 256px
      },
    },
  },
  plugins: [],
};

export default config;
