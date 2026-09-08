// Admin › Pour Vexel : l'endroit où Laurie dépose, pour Alex, ce qu'il faut pour ouvrir à son nom les
// abonnements du site (Google Cloud pour Blaze, Resend, Stripe). Tout est chiffré dans le navigateur avec
// la clé publique de Vexel (lib/coffre.ts) : Firestore ne garde que le texte chiffré et un résumé.
import React, { useMemo, useState } from 'react';
import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { ExternalLink, ShieldCheck, Trash2 } from 'lucide-react';
import { auth, db } from '../firebase';
import { useDocument } from '../lib/firestore';
import { CHEMIN_COFFRE, luhnValide, numeroPropre, sceller, type CoffreScelle, type ContenuCoffre } from '../lib/coffre';
import { useTextes } from '../lib/textes';
import { Bouton, Champ, EnTete, Etiquette, Panneau, Zone } from '../components/admin/ui';
import type { Language } from '../types';

const TEXTES = {
  FR: {
    kicker: 'Vexel Webstudio',
    titre: 'Pour Vexel',
    lede: 'Ce qu\'il faut à Alex pour ouvrir, à votre nom, les services dont votre site a besoin.',
    pourquoiTitre: 'À quoi ça sert',
    pourquoi1: 'Ces informations ne servent pas à vous facturer. Elles servent à ouvrir, à votre nom, les abonnements dont le site a besoin pour envoyer votre infolettre, encaisser des paiements et faire tourner ses fonctions serveur. Vexel les configure, vous en restez propriétaire, et les factures de ces services arrivent chez vous.',
    pourquoi2: 'Tout ce que vous écrivez ici est chiffré dans votre navigateur avant de partir, avec une clé dont Alex seul détient la moitié qui déchiffre. Ni le site, ni sa base de données, ni Google ne peuvent le lire. Vous voyez ci-dessous la date où Alex l\'a lu, et il efface la carte d\'ici une fois les comptes ouverts. Vous pouvez aussi l\'effacer vous-même à tout moment.',
    coutsTitre: 'Ce que chaque service coûte',
    coutsNote: 'Estimations au 8 septembre 2026, d\'après les grilles publiques des fournisseurs. Les montants en dollars américains se convertissent au taux du jour sur votre relevé.',
    colService: 'Service',
    colPourquoi: 'À quoi il sert',
    colCout: 'Coût estimé',
    colCarte: 'Carte requise',
    oui: 'Oui',
    non: 'Non',
    services: [
      { nom: 'Google Cloud (Firebase Blaze)', pourquoi: 'Hébergement, base de données, fonctions serveur : l\'envoi de l\'infolettre, plus tard Stripe et la transcription des rencontres.', cout: 'Gratuit dans les quotas inclus. Pour votre volume, entre 0 $ et 5 $ par mois. Google offre 300 $ US de crédit au départ.', carte: true },
      { nom: 'Resend (envoi de l\'infolettre)', pourquoi: 'Le courrier qui part de votre composeur d\'infolettre, avec votre domaine xenahorizon.com comme expéditeur.', cout: 'Gratuit jusqu\'à 3 000 courriels par mois (100 par jour). Au-delà, 20 $ US par mois pour 50 000.', carte: true },
      { nom: 'Stripe (paiement en ligne)', pourquoi: 'Encaisser vos offres directement sur le site, sans facture manuelle.', cout: 'Aucun abonnement. 2,9 % + 0,30 $ par paiement, plus taxes; 0,8 % de plus pour une carte étrangère.', carte: false },
      { nom: 'Rencontres vidéo (Jitsi Meet)', pourquoi: 'Les rendez-vous vidéo de votre espace client.', cout: 'Gratuit, aucun compte à ouvrir.', carte: false },
    ],
    stripeNote: 'Stripe demande le nom légal de l\'entreprise, le NEQ et un compte bancaire pour les dépôts : les champs plus bas les recueillent, et le compte bancaire va dans les notes.',
    formTitre: 'Vos informations',
    formIntro: 'Remplissez ce que vous avez sous la main. Une seule carte suffit pour tous les services.',
    carteTitre: 'Carte de crédit',
    nomCarte: 'Nom sur la carte',
    numero: 'Numéro de carte',
    expiration: 'Expiration (MM/AA)',
    cvv: 'Code de sécurité (CVV)',
    factTitre: 'Adresse de facturation',
    adresse: 'Adresse',
    ville: 'Ville',
    province: 'Province',
    codePostal: 'Code postal',
    telephone: 'Téléphone',
    courriel: 'Courriel pour les factures',
    entrepriseTitre: 'Entreprise et taxes',
    entrepriseIntro: 'Stripe et les factures des fournisseurs demandent ces numéros. Laissez vide ce que vous n\'avez pas.',
    nomLegal: 'Nom légal de l\'entreprise',
    neq: 'Numéro d\'entreprise du Québec (NEQ)',
    tps: 'Numéro de TPS',
    tvq: 'Numéro de TVQ',
    accesTitre: 'Accès à vos comptes',
    accesIntro: 'Si vous avez déjà un compte Stripe ou Google, Alex s\'y connecte pour brancher le site sans rien recréer. Il ne change rien à vos réglages sans vous en parler.',
    stripeCourriel: 'Courriel du compte Stripe',
    stripeMotDePasse: 'Mot de passe Stripe',
    googleCourriel: 'Courriel du compte Google (Firebase)',
    googleMotDePasse: 'Mot de passe Google',
    accesAide: 'Si la double authentification est activée, gardez votre téléphone à portée le jour de l\'appel avec Alex.',
    notes: 'Notes pour Alex',
    notesAide: 'Compte bancaire pour les dépôts Stripe, ou tout ce qu\'il doit savoir.',
    consentement: 'Je comprends que ces informations servent à ouvrir des abonnements à mon nom, et que les factures de ces services m\'arrivent directement.',
    deposer: 'Sceller et déposer',
    sceller: 'Chiffrement en cours…',
    remplacer: 'Remplacer',
    effacer: 'Effacer du coffre',
    effacerConfirme: 'Oui, effacer',
    annuler: 'Annuler',
    depose: 'Déposé dans le coffre',
    carteResume: 'Carte se terminant par',
    exp: 'exp.',
    deposeLe: 'Déposé le',
    luLe: 'Lu par Alex le',
    pasLu: 'Alex ne l\'a pas encore lu.',
    erreurLuhn: 'Le numéro de carte semble comporter une faute de frappe.',
    erreurExp: 'L\'expiration s\'écrit MM/AA, par exemple 04/28.',
    erreurConsentement: 'Cochez la case pour continuer.',
    erreur: 'Le dépôt n\'a pas fonctionné. Réessayez.',
    succes: 'Vos informations sont scellées et déposées. Alex sera prévenu.',
    chiffre: 'Chiffré de bout en bout',
    blaze: 'Passer le projet sur Blaze (geste d\'Alex)',
  },
  EN: {
    kicker: 'Vexel Webstudio',
    titre: 'For Vexel',
    lede: 'What Alex needs to open, in your name, the services your site relies on.',
    pourquoiTitre: 'What it is for',
    pourquoi1: 'This information is not used to bill you. It is used to open, in your name, the subscriptions your site needs to send your newsletter, take payments and run its server functions. Vexel sets them up, you stay the owner, and the invoices from these services come to you.',
    pourquoi2: 'Everything you type here is encrypted in your browser before it leaves, with a key whose decrypting half only Alex holds. Neither the site, nor its database, nor Google can read it. You can see below when Alex read it, and he clears the card from here once the accounts are open. You can also clear it yourself at any time.',
    coutsTitre: 'What each service costs',
    coutsNote: 'Estimates as of September 8, 2026, from the providers\' public pricing. US dollar amounts convert at the day\'s rate on your statement.',
    colService: 'Service',
    colPourquoi: 'What it does',
    colCout: 'Estimated cost',
    colCarte: 'Card needed',
    oui: 'Yes',
    non: 'No',
    services: [
      { nom: 'Google Cloud (Firebase Blaze)', pourquoi: 'Hosting, database, server functions: newsletter sending, later Stripe and meeting transcription.', cout: 'Free within the included quotas. For your volume, between $0 and $5 a month. Google gives US$300 in starting credit.', carte: true },
      { nom: 'Resend (newsletter delivery)', pourquoi: 'The mail that leaves your newsletter composer, sent from your xenahorizon.com domain.', cout: 'Free up to 3,000 emails a month (100 a day). Beyond that, US$20 a month for 50,000.', carte: true },
      { nom: 'Stripe (online payments)', pourquoi: 'Take payment for your offers directly on the site.', cout: 'No subscription. 2.9% + $0.30 per payment, plus taxes; 0.8% more for a foreign card.', carte: false },
      { nom: 'Video calls (Jitsi Meet)', pourquoi: 'The video appointments in your client space.', cout: 'Free, no account to open.', carte: false },
    ],
    stripeNote: 'Stripe asks for the legal business name, the NEQ and a bank account for payouts: the fields below collect them, and the bank account goes in the notes.',
    formTitre: 'Your information',
    formIntro: 'Fill in what you have at hand. One card covers every service.',
    carteTitre: 'Credit card',
    nomCarte: 'Name on the card',
    numero: 'Card number',
    expiration: 'Expiry (MM/YY)',
    cvv: 'Security code (CVV)',
    factTitre: 'Billing address',
    adresse: 'Address',
    ville: 'City',
    province: 'Province',
    codePostal: 'Postal code',
    telephone: 'Phone',
    courriel: 'Email for invoices',
    entrepriseTitre: 'Business and taxes',
    entrepriseIntro: 'Stripe and the providers\' invoices ask for these numbers. Leave blank what you do not have.',
    nomLegal: 'Legal business name',
    neq: 'Quebec enterprise number (NEQ)',
    tps: 'GST number',
    tvq: 'QST number',
    accesTitre: 'Access to your accounts',
    accesIntro: 'If you already have a Stripe or Google account, Alex signs in to connect the site without recreating anything. He changes none of your settings without telling you.',
    stripeCourriel: 'Stripe account email',
    stripeMotDePasse: 'Stripe password',
    googleCourriel: 'Google account email (Firebase)',
    googleMotDePasse: 'Google password',
    accesAide: 'If two-step verification is on, keep your phone nearby on the day of the call with Alex.',
    notes: 'Notes for Alex',
    notesAide: 'Bank account for Stripe payouts, or anything he should know.',
    consentement: 'I understand this information is used to open subscriptions in my name, and that the invoices from these services come directly to me.',
    deposer: 'Seal and deposit',
    sceller: 'Encrypting…',
    remplacer: 'Replace',
    effacer: 'Clear the vault',
    effacerConfirme: 'Yes, clear it',
    annuler: 'Cancel',
    depose: 'Deposited in the vault',
    carteResume: 'Card ending in',
    exp: 'exp.',
    deposeLe: 'Deposited on',
    luLe: 'Read by Alex on',
    pasLu: 'Alex has not read it yet.',
    erreurLuhn: 'The card number looks mistyped.',
    erreurExp: 'Expiry is written MM/YY, for example 04/28.',
    erreurConsentement: 'Tick the box to continue.',
    erreur: 'The deposit failed. Try again.',
    succes: 'Your information is sealed and deposited. Alex will be told.',
    chiffre: 'End-to-end encrypted',
    blaze: 'Move the project to Blaze (Alex\'s step)',
  },
};

const VIDE: ContenuCoffre = { nomCarte: '', numero: '', expiration: '', cvv: '', adresse: '', ville: '', province: 'Québec', codePostal: '', telephone: '', courrielFacturation: '', nomLegal: '', neq: '', tps: '', tvq: '', stripeCourriel: '', stripeMotDePasse: '', googleCourriel: '', googleMotDePasse: '', notes: '' };
const LIEN_BLAZE = 'https://console.firebase.google.com/project/xena-70977/usage/details';

const dateCourte = (ts: any, lang: Language): string => {
  const d: Date | null = ts?.toDate ? ts.toDate() : ts instanceof Date ? ts : null;
  return d ? d.toLocaleDateString(lang === 'FR' ? 'fr-CA' : 'en-CA', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
};

const AdminVexel: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = useTextes('adminVexel', TEXTES as any, lang) as unknown as (typeof TEXTES)['FR'];
  const { data: coffre, loading } = useDocument<CoffreScelle>(CHEMIN_COFFRE);
  const [contenu, setContenu] = useState<ContenuCoffre>(VIDE);
  const [consent, setConsent] = useState(false);
  const [remplacer, setRemplacer] = useState(false);
  const [confirmeEffacer, setConfirmeEffacer] = useState(false);
  const [busy, setBusy] = useState(false);
  const [avis, setAvis] = useState<{ ok: boolean; texte: string } | null>(null);

  const champ = (cle: keyof ContenuCoffre) => ({
    value: contenu[cle],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setContenu((c) => ({ ...c, [cle]: e.target.value })),
  });

  const numeroAffiche = useMemo(() => numeroPropre(contenu.numero).replace(/(.{4})/g, '$1 ').trim(), [contenu.numero]);

  const deposer = async (e: React.FormEvent) => {
    e.preventDefault();
    setAvis(null);
    if (!consent) return setAvis({ ok: false, texte: t.erreurConsentement });
    if (!luhnValide(contenu.numero)) return setAvis({ ok: false, texte: t.erreurLuhn });
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(contenu.expiration.trim())) return setAvis({ ok: false, texte: t.erreurExp });
    setBusy(true);
    try {
      const scelle = await sceller(contenu, auth.currentUser?.email ?? '');
      await setDoc(doc(db, CHEMIN_COFFRE), scelle);
      setContenu(VIDE);
      setConsent(false);
      setRemplacer(false);
      setAvis({ ok: true, texte: t.succes });
    } catch (err) {
      console.error('coffre', err);
      setAvis({ ok: false, texte: t.erreur });
    } finally {
      setBusy(false);
    }
  };

  const effacer = async () => {
    setBusy(true);
    try {
      await deleteDoc(doc(db, CHEMIN_COFFRE));
      setConfirmeEffacer(false);
      setAvis(null);
    } finally {
      setBusy(false);
    }
  };

  const formulaire = (
    <form onSubmit={deposer} className="space-y-8">
      <p className="text-gris text-sm mesure">{t.formIntro}</p>
      <div className="space-y-4">
        <h3 className="font-sans font-semibold text-encre">{t.carteTitre}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Champ label={t.nomCarte} autoComplete="cc-name" required maxLength={80} {...champ('nomCarte')} />
          <Champ label={t.numero} inputMode="numeric" autoComplete="cc-number" required value={numeroAffiche} onChange={(e) => setContenu((c) => ({ ...c, numero: e.target.value }))} maxLength={23} />
          <Champ label={t.expiration} inputMode="numeric" autoComplete="cc-exp" placeholder="MM/AA" required maxLength={5} {...champ('expiration')} />
          <Champ label={t.cvv} inputMode="numeric" autoComplete="cc-csc" required maxLength={4} type="password" {...champ('cvv')} />
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="font-sans font-semibold text-encre">{t.factTitre}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Champ label={t.adresse} autoComplete="street-address" required maxLength={160} className="md:col-span-2" {...champ('adresse')} />
          <Champ label={t.ville} autoComplete="address-level2" required maxLength={80} {...champ('ville')} />
          <Champ label={t.province} autoComplete="address-level1" required maxLength={40} {...champ('province')} />
          <Champ label={t.codePostal} autoComplete="postal-code" required maxLength={10} {...champ('codePostal')} />
          <Champ label={t.telephone} type="tel" autoComplete="tel" maxLength={30} {...champ('telephone')} />
          <Champ label={t.courriel} type="email" autoComplete="email" maxLength={160} className="md:col-span-2" {...champ('courrielFacturation')} />
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="font-sans font-semibold text-encre">{t.entrepriseTitre}</h3>
        <p className="text-gris text-sm mesure">{t.entrepriseIntro}</p>
        <div className="grid gap-4 md:grid-cols-2">
          <Champ label={t.nomLegal} autoComplete="organization" maxLength={120} className="md:col-span-2" {...champ('nomLegal')} />
          <Champ label={t.neq} inputMode="numeric" maxLength={20} placeholder="1234567890" {...champ('neq')} />
          <Champ label={t.tps} maxLength={20} placeholder="123456789 RT0001" {...champ('tps')} />
          <Champ label={t.tvq} maxLength={20} placeholder="1234567890 TQ0001" {...champ('tvq')} />
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="font-sans font-semibold text-encre">{t.accesTitre}</h3>
        <p className="text-gris text-sm mesure">{t.accesIntro}</p>
        <div className="grid gap-4 md:grid-cols-2">
          <Champ label={t.stripeCourriel} type="email" autoComplete="off" maxLength={160} {...champ('stripeCourriel')} />
          <Champ label={t.stripeMotDePasse} type="password" autoComplete="new-password" maxLength={200} {...champ('stripeMotDePasse')} />
          <Champ label={t.googleCourriel} type="email" autoComplete="off" maxLength={160} {...champ('googleCourriel')} />
          <Champ label={t.googleMotDePasse} type="password" autoComplete="new-password" maxLength={200} {...champ('googleMotDePasse')} />
        </div>
        <p className="text-xs text-gris mesure">{t.accesAide}</p>
      </div>
      <Zone label={t.notes} aide={t.notesAide} maxLength={2000} {...champ('notes')} />
      <label className="flex items-start gap-3 text-sm text-encre">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-[rgb(var(--c-rose))]" />
        <span>{t.consentement}</span>
      </label>
      {avis && (
        <p role={avis.ok ? 'status' : 'alert'} className={`text-sm ${avis.ok ? 'text-encre' : 'text-rose'}`}>
          {avis.texte}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Bouton type="submit" icone={ShieldCheck} disabled={busy}>
          {busy ? t.sceller : t.deposer}
        </Bouton>
        {remplacer && (
          <Bouton variante="secondaire" onClick={() => setRemplacer(false)} disabled={busy}>
            {t.annuler}
          </Bouton>
        )}
        <span className="text-xs text-gris">{t.chiffre}</span>
      </div>
    </form>
  );

  return (
    <div className="px-6 md:px-10 py-10 space-y-8" data-tx-scope="adminVexel">
      <EnTete
        kicker={t.kicker}
        titre={t.titre}
        lede={t.lede}
        actions={
          <a
            href={LIEN_BLAZE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-pilule border border-filet text-encre text-sm font-medium hover:border-encre transition-colors"
          >
            {t.blaze} <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </a>
        }
      />

      <Panneau titre={t.pourquoiTitre}>
        <div className="grid gap-6 lg:grid-cols-2">
          <p className="text-corps text-encre mesure">{t.pourquoi1}</p>
          <p className="text-corps text-encre mesure">{t.pourquoi2}</p>
        </div>
      </Panneau>

      <Panneau titre={t.coutsTitre}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-filet">
                <th className="kicker text-gris py-3 pr-4 font-semibold">{t.colService}</th>
                <th className="kicker text-gris py-3 pr-4 font-semibold">{t.colPourquoi}</th>
                <th className="kicker text-gris py-3 pr-4 font-semibold">{t.colCout}</th>
                <th className="kicker text-gris py-3 font-semibold">{t.colCarte}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-filet">
              {t.services.map((s) => (
                <tr key={s.nom} className="align-top">
                  <td className="py-4 pr-4 text-sm font-semibold text-encre min-w-[12rem]">{s.nom}</td>
                  <td className="py-4 pr-4 text-sm text-encre min-w-[16rem]">{s.pourquoi}</td>
                  <td className="py-4 pr-4 text-sm text-encre min-w-[16rem]">{s.cout}</td>
                  <td className="py-4 text-sm"><Etiquette tone={s.carte ? 'accent' : 'neutre'}>{s.carte ? t.oui : t.non}</Etiquette></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-gris mesure">{t.coutsNote}</p>
        <p className="mt-2 text-xs text-gris mesure">{t.stripeNote}</p>
      </Panneau>

      <Panneau titre={t.formTitre}>
        {loading ? null : coffre && !remplacer ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <Etiquette tone="accent">{t.depose}</Etiquette>
              <span className="text-xs text-gris">{t.chiffre}</span>
            </div>
            <p className="font-serif text-h3 text-encre">
              {t.carteResume} {coffre.resume?.derniers4} · {t.exp} {coffre.resume?.expiration}
            </p>
            <p className="text-sm text-gris">
              {coffre.resume?.nomCarte} · {t.deposeLe} {dateCourte(coffre.deposeLe, lang)} · {coffre.luLe ? `${t.luLe} ${dateCourte(coffre.luLe, lang)}` : t.pasLu}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Bouton variante="secondaire" onClick={() => setRemplacer(true)} disabled={busy}>
                {t.remplacer}
              </Bouton>
              {confirmeEffacer ? (
                <>
                  <Bouton variante="danger" icone={Trash2} onClick={effacer} disabled={busy}>
                    {t.effacerConfirme}
                  </Bouton>
                  <Bouton variante="discret" onClick={() => setConfirmeEffacer(false)}>
                    {t.annuler}
                  </Bouton>
                </>
              ) : (
                <Bouton variante="danger" icone={Trash2} onClick={() => setConfirmeEffacer(true)} disabled={busy}>
                  {t.effacer}
                </Bouton>
              )}
            </div>
          </div>
        ) : (
          formulaire
        )}
      </Panneau>
    </div>
  );
};

export default AdminVexel;
