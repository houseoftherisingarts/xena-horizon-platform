import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErreurRacine } from './components/ErreurRacine';
import './index.css';

// Après un déploiement, un onglet resté ouvert (ou un lien direct vers un fragment de page admin
// mis en cache) demande un fragment de build dont le nom a changé : le import() dynamique de
// React.lazy échoue et la page reste blanche. Vite prévient de cet échec par cet évènement ; un
// rechargement suffit à récupérer les bons fragments. Le drapeau de session évite une boucle si le
// problème vient d'ailleurs (hors ligne) : au deuxième échec, ErreurRacine prend le relais.
window.addEventListener('vite:preloadError', () => {
  const CLE = 'xh-recharge-fragment';
  try {
    if (sessionStorage.getItem(CLE) === '1') return;
    sessionStorage.setItem(CLE, '1');
  } catch {
    // stockage bloqué : on tente quand même le rechargement une fois
  }
  window.location.reload();
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErreurRacine>
      <App />
    </ErreurRacine>
  </React.StrictMode>
);