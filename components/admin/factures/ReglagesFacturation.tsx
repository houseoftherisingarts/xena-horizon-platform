// Les réglages de facturation de Laurie (settings/facturation, admin seulement) : identité légale,
// numéros de taxes, modalités par défaut et lien de paiement. Ouvert depuis l'onglet Factures.
import React, { useEffect, useState } from 'react';
import { Panneau, Bouton, Champ, Zone } from '../ui';
import { writeDoc } from '../../../lib/firestore';
import type { ParametresFacturation } from '../../../lib/factures';
import type { Language } from '../../../types';

interface Props {
  lang: Language;
  parametres: ParametresFacturation;
  onClose: () => void;
}

const T = {
  FR: {
    titre: 'Réglages de facturation',
    nomLegal: 'Nom légal',
    courriel: 'Courriel de contact',
    adresse: 'Adresse',
    neq: 'NEQ',
    tps: 'Numéro de TPS',
    tvq: 'Numéro de TVQ',
    aideTaxe: 'Laissé vide, la taxe correspondante ne paraît sur aucun document.',
    stripe: 'Lien de paiement',
    aideStripe: 'Un lien de paiement Stripe. La personne facturée le voit sur la page publique de la facture.',
    modalites: 'Modalités par défaut',
    note: 'Note de remerciement',
    annuler: 'Annuler',
    enregistrer: 'Enregistrer',
  },
  EN: {
    titre: 'Invoicing settings',
    nomLegal: 'Legal name',
    courriel: 'Contact email',
    adresse: 'Address',
    neq: 'Business number',
    tps: 'GST number',
    tvq: 'QST number',
    aideTaxe: 'Left empty, that tax never appears on a document.',
    stripe: 'Payment link',
    aideStripe: 'A Stripe payment link. The billed person sees it on the invoice public page.',
    modalites: 'Default terms',
    note: 'Thank-you note',
    annuler: 'Cancel',
    enregistrer: 'Save',
  },
};

const ReglagesFacturation: React.FC<Props> = ({ lang, parametres, onClose }) => {
  const t = T[lang];
  const [form, setForm] = useState<ParametresFacturation>(parametres);
  const [enregistrement, setEnregistrement] = useState(false);
  useEffect(() => { setForm(parametres); }, [parametres]);

  const champ = (cle: keyof ParametresFacturation) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [cle]: e.target.value });

  const enregistrer = async () => {
    setEnregistrement(true);
    await writeDoc('settings/facturation', form, { merge: true });
    setEnregistrement(false);
    onClose();
  };

  return (
    <Panneau titre={t.titre} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <Champ label={t.nomLegal} value={form.nomLegal} onChange={champ('nomLegal')} />
        <Champ label={t.courriel} type="email" value={form.courriel} onChange={champ('courriel')} />
      </div>
      <Champ label={t.adresse} value={form.adresse} onChange={champ('adresse')} />
      <div className="grid sm:grid-cols-3 gap-4">
        <Champ label={t.neq} value={form.neq} onChange={champ('neq')} />
        <Champ label={t.tps} value={form.tps} onChange={champ('tps')} aide={t.aideTaxe} />
        <Champ label={t.tvq} value={form.tvq} onChange={champ('tvq')} />
      </div>
      <Champ label={t.stripe} value={form.lienPaiementStripe} onChange={champ('lienPaiementStripe')} placeholder="https://buy.stripe.com/..." aide={t.aideStripe} />
      <Zone label={t.modalites} value={form.modalites} onChange={champ('modalites')} className="min-h-[6rem]" />
      <Champ label={t.note} value={form.note} onChange={champ('note')} />
      <div className="flex justify-end gap-2 pt-2">
        <Bouton variante="secondaire" onClick={onClose}>{t.annuler}</Bouton>
        <Bouton variante="primaire" onClick={enregistrer} disabled={enregistrement}>{t.enregistrer}</Bouton>
      </div>
    </Panneau>
  );
};

export default ReglagesFacturation;
