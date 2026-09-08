// Portail — toute fenêtre qui se pose par-dessus la page passe par ici :
// rendue à la racine du document après hydratation, jamais dans son
// parent. Un parent animé (transform, filter) fait sinon glisser un
// `fixed` loin sous le pli.

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export const Portail: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pret, setPret] = useState(false);
  useEffect(() => setPret(true), []);
  if (!pret || typeof document === 'undefined') return null;
  return createPortal(children, document.body);
};

export default Portail;
