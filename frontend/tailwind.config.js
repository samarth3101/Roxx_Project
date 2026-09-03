/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        // Base neutrals (90% of UI)
        base: '#FAF9F6',
        surface: '#FFFFFF',
        border: '#E8E5DF',
        muted: '#8A8578',
        body: '#2B2924',
        heading: '#1A1815',

        // Primary & Secondary Accents
        accent: {
          DEFAULT: '#C9714F',
          hover: '#B5613F',
          secondary: '#4A6FA5',
        },

        // Semantic
        success: '#6B8F6B',
        error: '#B5544A',
        warning: '#C9A15A',
      },
      borderRadius: {
        DEFAULT: '8px',
        card: '8px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(43, 41, 36, 0.04)',
        cardHover: '0 4px 16px rgba(43, 41, 36, 0.06)',
        dropdown: '0 8px 24px -4px rgba(43, 41, 36, 0.08)',
      },
    },
  },
  plugins: [],
};
