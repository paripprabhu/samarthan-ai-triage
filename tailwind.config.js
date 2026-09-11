/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        surface: 'var(--surface)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          active: 'var(--primary-active)',
          foreground: 'var(--primary-foreground)',
          tint: 'var(--primary-tint)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          hover: 'var(--destructive-hover)',
          foreground: 'var(--destructive-foreground)',
          tint: 'var(--destructive-tint)',
        },
        success: 'var(--success)',
        warning: 'var(--warning)',

        /* legacy aliases kept so un-swept refs still resolve */
        civic: { blue: 'var(--primary)', blueMid: 'var(--primary-hover)', blueLight: 'var(--primary-tint)' },
        brand: { blue: 'var(--primary)', blueHover: 'var(--primary-hover)', sky: 'var(--primary-tint)', dark: 'var(--foreground)' },
      },
      borderRadius: {
        md: 'var(--radius-control)',
        lg: 'var(--radius-card)',
        xl: 'calc(var(--radius-card) + 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'Noto Sans Bengali', 'Noto Sans Telugu', 'Noto Sans Tamil', 'Noto Sans Gujarati', 'Noto Sans Kannada', 'Noto Sans Oriya', 'Noto Sans Malayalam', 'Noto Sans Gurmukhi', 'Noto Sans Arabic', 'system-ui', '-apple-system', 'sans-serif'],
        devanagari: ['Noto Sans Devanagari', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'ui-main': ['0.875rem', { lineHeight: '1.25rem' }],     // 14px (Main font tier)
        'ui-small': ['0.75rem', { lineHeight: '1rem' }],        // 12px (Smaller font tier)
        'ui-micro': ['0.625rem', { lineHeight: '0.875rem' }],   // 10px (Smallest font tier)
      },
      boxShadow: {
        /* Supabase-flat: barely-there elevation */
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        sm: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        card: '0 1px 2px 0 rgb(0 0 0 / 0.03), 0 0 0 1px rgb(0 0 0 / 0.02)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
