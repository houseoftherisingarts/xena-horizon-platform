// OffrePartenaireVexel : l'offre partenaire officielle de Vexel dans le back-office d'un client
// (23 septembre 2026, dicté par Alex pour Laurie de Xena Horizon, à porter sur chaque site).
//
// Alex allume l'offre dans vexelwebstudio.com/admin (onglet Demandes, fiche du client,
// « Envoyer l'offre partenaire officielle »). À la prochaine entrée dans son admin, la personne
// voit une fenêtre en foil Vexel (c'est le studio qui parle, jamais la marque du client) qui
// explique l'offre et porte trois gestes : la visite guidée de l'accueil de Vexel en spotlight
// (nouvel onglet), J'accepte (l'entente à signer sur Vexel) et Plus tard. Après Plus tard,
// l'offre se replie en bulle au coin inférieur droit, avec une pastille qui saute; un clic la
// rouvre. La bulle reste tant que l'entente n'est pas signée, puis tout disparaît de lui-même.
//
// L'état vit chez Vexel (`clients/{slug}.offrePartenaire`), lu et noté par la porte publique
// `offrePartenaire` avec la même clé que la fenêtre de demandes. Rien n'est écrit dans le
// Firestore du client. `?offreVexel=apercu` montre la fenêtre à n'importe quel admin (Alex)
// sans rien noter.
//
// Pièges tenus : aucun `filter` sous le texte irisé (WebKit l'efface), et le plein écran est un
// calque qui défile plutôt qu'un centrage qui couperait les boutons d'un téléphone en paysage.
import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

const PORTE = 'https://us-central1-vexel-integrations.cloudfunctions.net/offrePartenaire';
const SITE = 'https://vexelwebstudio.com';

type Statut = 'envoyee' | 'vue' | 'plus_tard' | 'acceptee' | 'signee';
type Geste = 'vue' | 'plus_tard' | 'accepte';

interface Props {
  /** Le slug du client chez Vexel et sa clé : les mêmes que la fenêtre de demandes. */
  client: string;
  cle: string;
  /** Le courriel de la personne à qui l'offre s'adresse; les autres admins (Alex) ne la voient pas. */
  destinataire: string;
  /** Le courriel de la personne connectée. */
  courriel?: string | null;
  /** « représentante » ou « représentant ». */
  role?: string;
  /** Le chemin du logo Vexel dans le site du client. */
  logo?: string;
  /** Vrai tant qu'une autre couche plein écran occupe l'admin (sa propre visite guidée) : l'offre attend. */
  enAttente?: boolean;
}

const IRISE = 'linear-gradient(100deg, #ff9ecb 0%, #ffe08a 24%, #9bffcf 48%, #8ad4ff 72%, #c9a4ff 100%)';

const STYLE = `
.ovx-irise { background: ${IRISE}; -webkit-background-clip: text; background-clip: text; color: transparent; }
.ovx-foil { overflow: hidden; isolation: isolate; color: #f5f5f5;
  background: radial-gradient(120% 90% at 20% 0%, rgb(255 255 255 / 0.10), transparent 55%), linear-gradient(135deg, #1b1b22 0%, #050505 60%, #14141a 100%); }
.ovx-foil::before { content: ''; position: absolute; inset: -40%; z-index: -1; pointer-events: none; opacity: 0.2; mix-blend-mode: color-dodge;
  background: repeating-conic-gradient(from 200deg at 30% 20%, #ff9ecb 0deg, #ffe08a 24deg, #9bffcf 48deg, #8ad4ff 72deg, #c9a4ff 96deg, #ff9ecb 120deg);
  filter: blur(40px); }
.ovx-lisere { position: absolute; inset: 0; border-radius: inherit; padding: 1px; pointer-events: none;
  background: ${IRISE}; -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; }
.ovx-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 20px; border-radius: 999px;
  font-size: 15px; font-weight: 600; transition: transform 180ms, background-color 180ms, border-color 180ms; }
.ovx-btn:focus-visible { outline: 2px solid #8ad4ff; outline-offset: 3px; }
.ovx-btn:active { transform: scale(0.97); }
.ovx-plein { background: #f5f5f5; color: #0a0a0a; }
.ovx-plein:hover { background: #ffffff; }
.ovx-irise-bouton { position: relative; background: #0a0a0a; color: #f5f5f5; }
.ovx-vide { color: rgb(245 245 245 / 0.72); }
.ovx-vide:hover { color: #fff; }
@keyframes ovx-saut { 0%, 62%, 100% { transform: translateY(0) } 70% { transform: translateY(-7px) } 78% { transform: translateY(0) } 84% { transform: translateY(-3px) } 90% { transform: translateY(0) } }
.ovx-pastille { animation: ovx-saut 2.4s cubic-bezier(.3,.7,.4,1) infinite; }
@media (prefers-reduced-motion: reduce) { .ovx-pastille { animation: none } }
`;

function noter(client: string, cle: string, geste?: Geste): Promise<{ active: boolean; statut: Statut } | null> {
  return fetch(PORTE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(geste ? { client, cle, geste } : { client, cle }),
    keepalive: Boolean(geste),
  })
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);
}

const ETAPES = [
  ['La visite', 'Une courte visite guidée de vexelwebstudio.com te montre les sites que tu feras voir et ce que tu toucheras.'],
  ['J’accepte', 'L’entente se lit et se signe en ligne avec ton compte Google, sans rien imprimer ni renvoyer.'],
  ['Ton code compte', 'Dès ta signature, chaque site signé par un client que tu as amené s’inscrit à ton nom.'],
] as const;

export default function OffrePartenaireVexel({
  client,
  cle,
  destinataire,
  courriel,
  role = 'représentante',
  logo = '/images/vexel-logo.png',
  enAttente = false,
}: Props) {
  const apercu = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('offreVexel') === 'apercu';
  const pourMoi = apercu || (courriel ?? '').toLowerCase() === destinataire.toLowerCase();
  const [statut, setStatut] = useState<Statut | null>(null);
  const [ouvert, setOuvert] = useState(false);

  useEffect(() => {
    if (!pourMoi) return;
    if (apercu) {
      setStatut('envoyee');
      setOuvert(true);
      return;
    }
    let vivant = true;
    void noter(client, cle).then((r) => {
      if (!vivant || !r?.active) return;
      setStatut(r.statut);
      // La fenêtre s'ouvre seule tant que la personne n'a pas répondu; ensuite, la bulle attend.
      if (r.statut === 'envoyee' || r.statut === 'vue') {
        setOuvert(true);
        if (r.statut === 'envoyee') void noter(client, cle, 'vue');
      }
    });
    return () => {
      vivant = false;
    };
  }, [pourMoi, apercu, client, cle]);

  const geste = useCallback(
    (g: Geste) => {
      if (!apercu) void noter(client, cle, g);
    },
    [apercu, client, cle],
  );

  const plusTard = () => {
    geste('plus_tard');
    setStatut((s) => (s === 'acceptee' ? s : 'plus_tard'));
    setOuvert(false);
  };

  // Échap vaut « Plus tard » : la fenêtre ne disparaît jamais sans laisser sa bulle.
  useEffect(() => {
    if (!ouvert || enAttente) return;
    const f = (e: KeyboardEvent) => e.key === 'Escape' && plusTard();
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ouvert, enAttente]);

  if (!pourMoi || !statut || statut === 'signee' || enAttente) return null;

  // En aperçu, la visite part sans le client ni sa clé : les gestes d'Alex ne se notent pas au dossier.
  const lienVisite = apercu
    ? `${SITE}/?visite=partenaire`
    : `${SITE}/?visite=partenaire&client=${encodeURIComponent(client)}&cle=${encodeURIComponent(cle)}`;
  const lienEntente = `${SITE}/compte/partenaire/contrat`;
  const acceptee = statut === 'acceptee';

  return (
    <>
      <style>{STYLE}</style>

      <AnimatePresence>
        {ouvert && (
          <motion.div
            key="fenetre"
            className="fixed inset-0 z-[120]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={plusTard} aria-hidden="true" />
            <div className="absolute inset-0 overflow-y-auto overscroll-contain pointer-events-none">
              <div className="flex min-h-full flex-col items-center justify-center px-4 py-8">
                <motion.section
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="ovx-titre"
                  className="ovx-foil pointer-events-auto relative w-full max-w-[1040px] rounded-[15px] shadow-[0_30px_90px_rgb(0_0_0/0.6)]"
                  initial={{ opacity: 0, y: 24, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="ovx-lisere" aria-hidden="true" />
                  <button
                    type="button"
                    onClick={plusTard}
                    aria-label="Fermer et garder l’offre pour plus tard"
                    className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full text-white/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8ad4ff]"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>

                  <div className="grid md:grid-cols-[0.9fr_1.1fr]">
                    {/* Le volet des chiffres : le logo, puis les deux montants en grand. */}
                    <div className="relative flex flex-col justify-between gap-8 border-b border-white/10 p-7 md:border-b-0 md:border-r md:p-10">
                      <div className="flex items-center gap-3">
                        <img src={logo} alt="" className="h-11 w-11 object-contain" />
                        <span className="text-[13px] uppercase tracking-[0.22em] text-white/70">Vexel Webstudio</span>
                      </div>
                      <div>
                        <p className="ovx-irise text-[clamp(3.4rem,8vw,6rem)] font-semibold leading-[0.95] tracking-tight">200 $</p>
                        <p className="mt-2 text-[15px] text-white/75">au premier client Signature que tu amènes</p>
                        <p className="ovx-irise mt-6 text-[clamp(3.4rem,8vw,6rem)] font-semibold leading-[0.95] tracking-tight">+ 12 %</p>
                        <p className="mt-2 text-[15px] text-white/75">de chaque abonnement, chaque mois</p>
                      </div>
                      <p className="text-[13px] leading-relaxed text-white/60">
                        Tant que le site de ton client reste en ligne, ta part revient tous les mois.
                      </p>
                    </div>

                    {/* Le volet de l'offre : le titre, l'explication, les trois temps, les gestes. */}
                    <div className="p-7 md:p-10">
                      <p className="text-[13px] uppercase tracking-[0.22em] text-[#8ad4ff]">Une offre de Vexel Webstudio</p>
                      <h2 id="ovx-titre" className="mt-3 text-[clamp(1.9rem,3.4vw,2.6rem)] font-semibold leading-[1.08] tracking-tight">
                        Deviens {role} Vexel
                      </h2>
                      <p className="mt-4 text-[16px] leading-relaxed text-white/80">
                        Ton site est bâti par Vexel et tu sais ce qu’il a changé pour toi, ce qui fait de toi la personne la mieux
                        placée pour le montrer à une entreprise qui cherche le sien.
                      </p>

                      <ol className="mt-7 space-y-4">
                        {ETAPES.map(([titre, corps], i) => (
                          <li key={titre} className="flex gap-4">
                            <span
                              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold"
                              style={{ background: 'rgb(255 255 255 / 0.06)' }}
                            >
                              <span className="ovx-lisere" aria-hidden="true" />
                              {i + 1}
                            </span>
                            <span>
                              <span className="block text-[15px] font-semibold text-white">{titre}</span>
                              <span className="block text-[15px] leading-relaxed text-white/70">{corps}</span>
                            </span>
                          </li>
                        ))}
                      </ol>

                      <div className="mt-8 flex flex-wrap items-center gap-3">
                        {!acceptee && (
                          <a
                            href={lienVisite}
                            target="_blank"
                            rel="noopener"
                            onClick={() => setOuvert(false)}
                            className="ovx-btn ovx-plein"
                          >
                            Commencer la visite
                          </a>
                        )}
                        <a
                          href={lienEntente}
                          target="_blank"
                          rel="noopener"
                          onClick={() => {
                            geste('accepte');
                            setStatut('acceptee');
                            setOuvert(false);
                          }}
                          className={`ovx-btn ${acceptee ? 'ovx-plein' : 'ovx-irise-bouton'}`}
                        >
                          {!acceptee && <span className="ovx-lisere" aria-hidden="true" />}
                          {acceptee ? 'Signer mon entente' : 'J’accepte'}
                        </a>
                        <button type="button" onClick={plusTard} className="ovx-btn ovx-vide">
                          Plus tard
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.section>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!ouvert && (
          <motion.button
            key="bulle"
            type="button"
            onClick={() => setOuvert(true)}
            aria-label={acceptee ? 'Ton entente Vexel t’attend : ouvrir l’offre' : 'Ton offre Vexel t’attend : ouvrir l’offre'}
            title={acceptee ? 'Ton entente Vexel t’attend' : 'Ton offre Vexel t’attend'}
            className="fixed bottom-5 right-5 z-[110] flex h-16 w-16 items-center justify-center rounded-full shadow-[0_14px_36px_rgb(0_0_0/0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8ad4ff]"
            initial={{ opacity: 0, scale: 0.4, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.4 }}
            whileHover={{ scale: 1.06 }}
            transition={{ type: 'spring', stiffness: 380, damping: 24 }}
          >
            {/* Le foil vit sur une couche intérieure : son overflow rognerait la pastille. */}
            <span className="ovx-foil absolute inset-0 rounded-full" aria-hidden="true">
              <span className="ovx-lisere" />
            </span>
            <img src={logo} alt="" className="relative h-9 w-9 object-contain" />
            <span
              className="ovx-pastille absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[13px] font-bold text-white ring-2 ring-white"
              style={{ background: '#e0245e' }}
              aria-hidden="true"
            >
              1
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
