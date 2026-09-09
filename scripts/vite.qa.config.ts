// Config Vite à part pour scripts/qa-finances.cjs : ajoute qa-finances.html à dist-verif sans toucher
// à vite.config.ts (partagé entre les vagues) ni relancer le bundle principal (emptyOutDir: false).
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const RACINE = path.resolve(__dirname, '..');

export default defineConfig({
  root: RACINE,
  plugins: [react()],
  build: {
    outDir: path.resolve(RACINE, 'dist-verif'),
    emptyOutDir: false,
    rollupOptions: {
      input: path.resolve(RACINE, 'qa-finances.html'),
    },
  },
  resolve: {
    alias: {
      '@': RACINE,
    },
  },
});
