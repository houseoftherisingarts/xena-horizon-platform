/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './*.tsx', './pages/**/*.tsx', './components/**/*.tsx', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Chaque couleur lit un triplet RGB posé sur :root (index.css) : la bascule de palette
        // (data-skin="ciel", couleurs de Laurie) change les triplets, jamais les classes.
        papier: 'rgb(var(--c-papier) / <alpha-value>)',
        'papier-2': 'rgb(var(--c-papier-2) / <alpha-value>)',
        encre: 'rgb(var(--c-encre) / <alpha-value>)',
        'encre-2': 'rgb(var(--c-encre-2) / <alpha-value>)',
        gris: 'rgb(var(--c-gris) / <alpha-value>)',
        'gris-clair': 'rgb(var(--c-gris-clair) / <alpha-value>)',
        filet: 'rgb(var(--c-filet) / <alpha-value>)',
        'filet-encre': 'rgb(var(--c-papier) / 0.14)',
        // « rose » est le nom du rôle accent : en palette ciel, ce même jeton porte le bleu de Laurie.
        rose: 'rgb(var(--c-rose) / <alpha-value>)',
        'rose-vif': 'rgb(var(--c-rose-vif) / <alpha-value>)',
        'rose-clair': 'rgb(var(--c-rose-clair) / <alpha-value>)',
        trait: 'rgb(var(--c-trait) / <alpha-value>)',
        bouton: 'rgb(var(--c-bouton) / <alpha-value>)',
        'bouton-2': 'rgb(var(--c-bouton-2) / <alpha-value>)',
        'sur-bouton': 'rgb(var(--c-sur-bouton) / <alpha-value>)',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['Figtree', '"Avenir Next"', 'Avenir', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Aucun texte visible sous 13 px (règle d'Alex) : text-xs et les kickers montent à 0.8125rem.
        xs: ['0.8125rem', { lineHeight: '1.4' }],
        h1: ['clamp(2.3rem, 0.6rem + 6.4vw, 6.5rem)', { lineHeight: '0.95', letterSpacing: '-0.02em', fontWeight: '400' }],
        display: ['clamp(2.4rem, 1.5rem + 3.6vw, 5rem)', { lineHeight: '1', letterSpacing: '-0.015em', fontWeight: '400' }],
        h2: ['clamp(1.9rem, 1.3rem + 2.4vw, 3.4rem)', { lineHeight: '1.05', letterSpacing: '-0.01em', fontWeight: '500' }],
        h3: ['clamp(1.35rem, 1.1rem + 0.9vw, 1.9rem)', { lineHeight: '1.15', letterSpacing: '0', fontWeight: '500' }],
        chiffre: ['clamp(4rem, 2.6rem + 5.6vw, 8rem)', { lineHeight: '0.9', letterSpacing: '-0.03em', fontWeight: '400' }],
        prenom: ['clamp(2.2rem, 5.4vw, 5rem)', { lineHeight: '1', letterSpacing: '0.02em', fontWeight: '400' }],
        lede: ['clamp(1.125rem, 1rem + 0.5vw, 1.375rem)', { lineHeight: '1.5', fontWeight: '300' }],
        corps: ['1rem', { lineHeight: '1.7', fontWeight: '400' }],
        petit: ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        kicker: ['0.8125rem', { lineHeight: '1.2', letterSpacing: '0.26em', fontWeight: '600' }],
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
        feuille: '0 -30px 80px rgb(var(--c-encre) / 0.18)',
        'feuille-encre': '0 -30px 80px rgb(var(--c-encre) / 0.45)',
        panneau: '0 24px 60px -30px rgb(var(--c-encre) / 0.25)',
        focus: '0 0 0 3px rgb(var(--c-rose) / 0.35)',
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
        ken: { from: { transform: 'scale(1.06)' }, to: { transform: 'scale(1.16)' } },
        rise: { to: { opacity: '1', transform: 'none' } },
        defile: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
      animation: {
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
