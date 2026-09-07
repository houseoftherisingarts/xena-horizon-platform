import React from 'react';
import type { User } from 'firebase/auth';
import { Language } from '../types';
import PorteClient from '../components/espace/PorteClient';
import EspaceShell from '../components/espace/EspaceShell';

interface EspaceClientProps {
  user: User | null;
  lang: Language;
}

/**
 * L'espace client, adresse /espace. Porté du module client de Vexel et branché sur
 * Firebase (Auth, Firestore, Storage) : la porte pour ouvrir ou créer son dossier,
 * puis l'espace complet une fois connecté. Aucune vérification admin ici,
 * n'importe qui peut ouvrir son propre dossier.
 */
const EspaceClient: React.FC<EspaceClientProps> = ({ user, lang }) => {
  if (!user) return <PorteClient lang={lang} />;
  return <EspaceShell user={user} lang={lang} />;
};

export default EspaceClient;
