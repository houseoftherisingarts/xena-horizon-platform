// Exemple en mémoire pour la boucle locale de l'échelle de valeur, sous MODE === 'verif' seulement
// (voir pages/AdminProducts.tsx). Ne sert qu'à la capture : jamais écrit dans Firestore, jamais public.
import type { Product } from '../types';

export const PRODUITS_DEMO: Product[] = [
  {
    id: 'demo-guide',
    name: 'Guide de démarrage',
    price: 0,
    description: 'Un court guide gratuit pour clarifier son positionnement avant toute démarche.',
    type: 'Digital',
    category: 'Product',
    status: 'Active',
    isPublic: true
  },
  {
    id: 'demo-fiche',
    name: 'Fiche diagnostic',
    price: 7,
    description: 'Un outil autoportant pour situer son projet avant une première rencontre.',
    type: 'Digital',
    category: 'Product',
    status: 'Active',
    isPublic: true,
    clientTypes: ['Artist']
  },
  {
    id: 'demo-atelier',
    name: 'Atelier bio et dossier de presse',
    price: 65,
    description: 'Une séance ciblée pour bâtir une bio et un dossier de presse qui tiennent debout.',
    type: 'Consulting',
    category: 'Service',
    status: 'Active',
    isPublic: true,
    clientTypes: ['Artist', 'Entrepreneur']
  },
  {
    id: 'demo-strategie',
    name: 'Stratégie de visibilité',
    price: 350,
    description: 'Un plan de visibilité complet, taxes en sus, avec plan d\'action et échéancier.',
    type: 'Consulting',
    category: 'Service',
    status: 'Active',
    isPublic: true
  },
  {
    id: 'demo-accompagnement',
    name: 'Accompagnement trimestriel',
    price: 1200,
    description: 'Un suivi mensuel sur trois mois, pour tenir le cap sur un lancement ou un festival.',
    type: 'Consulting',
    category: 'Service',
    status: 'Planned',
    isPublic: false,
    clientTypes: ['Entrepreneur', 'NPO']
  },
  {
    id: 'demo-immersion',
    name: 'Immersion stratégique',
    price: 4500,
    description: 'Une semaine intensive pour poser la ligne directrice d\'un organisme ou d\'une entreprise.',
    type: 'Consulting',
    category: 'Service',
    status: 'Concept',
    isPublic: false,
    clientTypes: ['NPO']
  },
  {
    id: 'demo-mandat',
    name: 'Mandat de communication annuel',
    price: 9800,
    description: 'Un mandat récurrent qui couvre la stratégie, les événements et la formation de l\'équipe.',
    type: 'Consulting',
    category: 'Service',
    status: 'Planned',
    isPublic: false
  },
  {
    id: 'demo-elite-1',
    name: 'Elite : direction de communication déléguée',
    price: 18000,
    description: 'Une prise en charge complète de la communication, sur mesure, pour une saison entière.',
    type: 'Consulting',
    category: 'Service',
    status: 'Active',
    isPublic: false,
    clientTypes: ['NPO']
  },
  {
    id: 'demo-elite-2',
    name: 'Elite : cercle privé',
    price: 25000,
    description: 'Un accompagnement exclusif, places limitées, pour une poignée de clients à la fois.',
    type: 'Consulting',
    category: 'Service',
    status: 'Inactive',
    isPublic: false
  }
];
