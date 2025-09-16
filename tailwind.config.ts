import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,js,jsx,mdx}',
    './components/**/*.{ts,tsx,js,jsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        base: {
          bg: '#f8f8f6',
          surface: '#ffffff',
          border: '#e2e2dd',
          text: '#111111',
          subtler: '#6b6f76'
        },
        accent: {
          DEFAULT: '#2563eb',
          hover: '#1d4ed8'
        },
        success: '#059669',
        danger: '#dc2626'
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif']
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.06)',
        base: '0 2px 4px -1px rgba(0,0,0,0.08), 0 4px 6px -1px rgba(0,0,0,0.05)',
        md: '0 4px 8px -2px rgba(0,0,0,0.08), 0 8px 12px -2px rgba(0,0,0,0.04)',
        lg: '0 8px 16px -4px rgba(0,0,0,0.08), 0 16px 24px -4px rgba(0,0,0,0.04)'
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        xl: '16px'
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 0.61, 0.36, 1)'
      }
    }
  },
  plugins: [
    plugin(function({ addVariant }) {
      addVariant('motion-safe', '@media (prefers-reduced-motion: no-preference)');
    })
  ]
};

export default config;
