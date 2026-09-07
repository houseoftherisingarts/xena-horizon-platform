/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './*.tsx', './pages/**/*.tsx', './components/**/*.tsx', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      colors: {
        xena: {
          dark: '#0f172a',
          deep: '#020617',
          cyan: '#22d3ee',
          emerald: '#34d399',
          blueAccent: '#3b82f6',
          accent: '#22d3ee',
          glass: 'rgba(255, 255, 255, 0.08)',
          glassBorder: 'rgba(255, 255, 255, 0.18)',
        },
      },
      backgroundImage: {
        iridescent: 'linear-gradient(135deg, #22d3ee 0%, #34d399 50%, #3b82f6 100%)',
        'iridescent-soft': 'linear-gradient(135deg, rgba(34,211,238,0.18) 0%, rgba(52,211,153,0.18) 50%, rgba(59,130,246,0.18) 100%)',
        'iridescent-radial': 'radial-gradient(ellipse at top right, rgba(52,211,153,0.25), transparent 60%), radial-gradient(ellipse at bottom left, rgba(34,211,238,0.25), transparent 60%), radial-gradient(ellipse at center, rgba(59,130,246,0.20), transparent 70%)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'iridescent-shift': 'iridescent-shift 12s ease-in-out infinite',
        'iridescent-fast': 'iridescent-shift 6s ease-in-out infinite',
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-20px)' } },
        'iridescent-shift': { '0%, 100%': { 'background-position': '0% 50%' }, '50%': { 'background-position': '100% 50%' } },
      },
      boxShadow: {
        iridescent: '0 10px 40px -10px rgba(34,211,238,0.45), 0 6px 20px -6px rgba(52,211,153,0.35)',
        'iridescent-sm': '0 4px 18px -6px rgba(34,211,238,0.4)',
      },
    },
  },
  plugins: [],
};
