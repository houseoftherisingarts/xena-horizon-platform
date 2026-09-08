import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      build: {
        rollupOptions: {
          output: {
            // Recharts n'est plus forcé dans son propre chunk manuel : seules AdminDashboard.tsx et
            // AdminFinance.tsx l'importent, et les deux sont déjà chargées par React.lazy(). Un
            // manualChunks explicite faisait précharger ce chunk depuis dist/index.html même sur les
            // pages publiques (audit SEO technique, sept. 2026) ; le laisser au découpage automatique
            // de Rollup le range dans le graphe async des pages admin, jamais dans celui de l'accueil.
            manualChunks: {
              firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage', 'firebase/analytics'],
            },
          },
        },
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
