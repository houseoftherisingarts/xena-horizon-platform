/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './*.tsx', './pages/**/*.tsx', './components/**/*.tsx', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        papier: '#F7F4EE',
        'papier-2': '#EFEBE3',
        encre: '#1A1A1E',
        'encre-2': '#26262B',
        gris: '#5E5850',
        'gris-clair': '#B8B2A8',
        filet: '#DDD7CD',
        'filet-encre': 'rgba(247, 244, 238, 0.14)',
        rose: '#A8104A',
        'rose-vif': '#E0206E',
        'rose-clair': '#F2789F',
        // Variante bleue, dormante : ne s'active que si Laurie tient à son bleu.
        // bleu: '#0B6BA8', 'bleu-clair': '#7CC6F5'
        // Tokens v1 conservés pour le back-office (sombre) tant qu'il n'est pas rhabillé.
        xena: { dark: '#0f172a', deep: '#020617', cyan: '#22d3ee', emerald: '#34d399', blueAccent: '#3b82f6', accent: '#22d3ee', glass: 'rgba(255, 255, 255, 0.08)', glassBorder: 'rgba(255, 255, 255, 0.18)' },
      },
      backgroundImage: {
        iridescent: 'linear-gradient(135deg, #22d3ee 0%, #34d399 50%, #3b82f6 100%)',
        'iridescent-soft': 'linear-gradient(135deg, rgba(34,211,238,0.18) 0%, rgba(52,211,153,0.18) 50%, rgba(59,130,246,0.18) 100%)',
        'iridescent-radial': 'radial-gradient(ellipse at top right, rgba(52,211,153,0.25), transparent 60%), radial-gradient(ellipse at bottom left, rgba(34,211,238,0.25), transparent 60%)',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['Figtree', '"Avenir Next"', 'Avenir', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        h1: ['clamp(2.3rem, 0.6rem + 6.4vw, 6.5rem)', { lineHeight: '0.95', letterSpacing: '-0.02em', fontWeight: '400' }],
        display: ['clamp(2.4rem, 1.5rem + 3.6vw, 5rem)', { lineHeight: '1', letterSpacing: '-0.015em', fontWeight: '400' }],
        h2: ['clamp(1.9rem, 1.3rem + 2.4vw, 3.4rem)', { lineHeight: '1.05', letterSpacing: '-0.01em', fontWeight: '500' }],
        h3: ['clamp(1.35rem, 1.1rem + 0.9vw, 1.9rem)', { lineHeight: '1.15', letterSpacing: '0', fontWeight: '500' }],
        chiffre: ['clamp(4rem, 2.6rem + 5.6vw, 8rem)', { lineHeight: '0.9', letterSpacing: '-0.03em', fontWeight: '400' }],
        prenom: ['clamp(2.2rem, 5.4vw, 5rem)', { lineHeight: '1', letterSpacing: '0.02em', fontWeight: '400' }],
        lede: ['clamp(1.125rem, 1rem + 0.5vw, 1.375rem)', { lineHeight: '1.5', fontWeight: '300' }],
        corps: ['1rem', { lineHeight: '1.7', fontWeight: '400' }],
        petit: ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        kicker: ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.28em', fontWeight: '600' }],
      },
      spacing: {
        gut: 'clamp(1.25rem, 4vw, 4.5rem)',
        col: 'clamp(1rem, 2.5vw, 3rem)',
        feuille: 'clamp(4rem, 10vh, 8rem)',
        bloc: 'clamp(2.5rem, 6vw, 5rem)',
        nav: '4.5rem',
        mesure: '62ch',
      },
      maxWidth: {
        mesure: '62ch',
        consentement: '420px',
      },
      borderRadius: {
        none: '0',
        champ: '6px',
        feuille: '22px',
        'feuille-lg': '30px',
        pilule: '9999px',
      },
      boxShadow: {
        iridescent: '0 10px 40px -10px rgba(34,211,238,0.45), 0 6px 20px -6px rgba(52,211,153,0.35)',
        'iridescent-sm': '0 4px 18px -6px rgba(34,211,238,0.4)',
        feuille: '0 -30px 80px rgba(26, 26, 30, 0.18)',
        'feuille-encre': '0 -30px 80px rgba(26, 26, 30, 0.45)',
        panneau: '0 24px 60px -30px rgba(26, 26, 30, 0.25)',
        focus: '0 0 0 3px rgba(168, 16, 74, 0.35)',
      },
      transitionTimingFunction: {
        maison: 'cubic-bezier(0.16, 0.8, 0.24, 1)',
        sortie: 'cubic-bezier(0.22, 1, 0.36, 1)',
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
        presse: 'cubic-bezier(0.23, 1, 0.32, 1)',
        chute: 'cubic-bezier(0.55, 0.06, 0.68, 0.19)',
      },
      transitionDuration: {
        presse: '160ms',
        survol: '200ms',
        onglet: '200ms',
        panneau: '240ms',
        entree: '900ms',
        lente: '1300ms',
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-20px)' } },
        'iridescent-shift': { '0%, 100%': { 'background-position': '0% 50%' }, '50%': { 'background-position': '100% 50%' } },
        ken: { from: { transform: 'scale(1.06)' }, to: { transform: 'scale(1.16)' } },
        rise: { to: { opacity: '1', transform: 'none' } },
        defile: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'iridescent-shift': 'iridescent-shift 12s ease-in-out infinite',
        'iridescent-fast': 'iridescent-shift 6s ease-in-out infinite',
        ken: 'ken 22s ease-in-out infinite alternate',
        rise: 'rise 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        defile: 'defile 60s linear infinite',
      },
      gridTemplateColumns: {
        12: 'repeat(12, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
};
