import React from 'react';
import { createPortal } from 'react-dom';

/** Toute fenêtre modale se rend à la racine du document, jamais dans son parent. */
const PortailModal: React.FC<{ children: React.ReactNode }> = ({ children }) =>
  createPortal(children, document.body);

export default PortailModal;
