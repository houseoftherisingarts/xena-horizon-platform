// Panneau « Mes disponibilités » du back-office Agenda (voir pages/AdminAgenda.tsx). Édite settings/agenda :
// plages hebdomadaires, durée/tampon/délai/horizon, exceptions par date. Lecture par useAgendaConfig(),
// écriture par writeDoc en merge. Suit le canon v2 (components/admin/CANON-ADMIN.md).
import React, { useEffect, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { Bouton, Champ, Panneau } from '../ui';
import { useTextes } from '../../../lib/textes';
import { writeDoc } from '../../../lib/firestore';
import { useAgendaConfig } from '../../../lib/rendezvous';
import type { AgendaConfig, Language, PlageHoraire } from '../../../types';

interface Props {
  lang: Language;
}

type JourKey = keyof AgendaConfig['jours'];
const JOURS_ORDRE: JourKey[] = ['1', '2', '3', '4', '5', '6', '0'];

const TEXTES = {
  FR: {
    titre: 'Mes disponibilités',
    sous: 'Les plages où votre clientèle peut réserver, et les exceptions à votre horaire habituel.',
    jour0: 'Dimanche',
    jour1: 'Lundi',
    jour2: 'Mardi',
    jour3: 'Mercredi',
    jour4: 'Jeudi',
    jour5: 'Vendredi',
    jour6: 'Samedi',
    ajouterPlage: 'Ajouter une plage',
    retirer: 'Retirer la plage',
    jourFerme: 'Fermé',
    de: 'De',
    aChamp: 'À',
    dureeLabel: "Durée d'une rencontre (minutes)",
    tamponLabel: 'Tampon entre deux rencontres (minutes)',
    delaiLabel: 'Délai minimal avant un rendez-vous (heures)',
    horizonLabel: 'Horizon de réservation (jours)',
    exceptionsTitre: 'Exceptions',
    dateException: "Date de l'exception",
    ajouterException: "Ajouter l'exception",
    aucuneException: 'Aucune exception pour le moment.',
    retirerException: "Retirer l'exception",
    enregistrer: 'Enregistrer',
    enregistrementEnCours: 'Enregistrement…',
    enregistre: 'Enregistré',
  },
  EN: {
    titre: 'My availability',
    sous: 'The time slots your clients can book, and exceptions to your usual schedule.',
    jour0: 'Sunday',
    jour1: 'Monday',
    jour2: 'Tuesday',
    jour3: 'Wednesday',
    jour4: 'Thursday',
    jour5: 'Friday',
    jour6: 'Saturday',
    ajouterPlage: 'Add a time slot',
    retirer: 'Remove the time slot',
    jourFerme: 'Closed',
    de: 'From',
    aChamp: 'To',
    dureeLabel: 'Meeting length (minutes)',
    tamponLabel: 'Buffer between meetings (minutes)',
    delaiLabel: 'Minimum notice before a meeting (hours)',
    horizonLabel: 'Booking horizon (days)',
    exceptionsTitre: 'Exceptions',
    dateException: 'Exception date',
    ajouterException: 'Add the exception',
    aucuneException: 'No exceptions yet.',
    retirerException: 'Remove the exception',
    enregistrer: 'Save',
    enregistrementEnCours: 'Saving…',
    enregistre: 'Saved',
  },
};

const CHAMP_PETIT =
  'flex-1 min-w-0 bg-papier border border-filet rounded-champ px-2 py-2 text-sm text-encre outline-none transition-colors focus:border-rose';

const Disponibilites: React.FC<Props> = ({ lang }) => {
  const t = useTextes('adminAgendaDispo', TEXTES, lang);
  const config = useAgendaConfig();

  const [jours, setJours] = useState<AgendaConfig['jours']>(config.jours);
  const [duree, setDuree] = useState(config.duree);
  const [tampon, setTampon] = useState(config.tampon);
  const [delaiMinHeures, setDelaiMinHeures] = useState(config.delaiMinHeures);
  const [horizonJours, setHorizonJours] = useState(config.horizonJours);
  const [exceptions, setExceptions] = useState<Record<string, PlageHoraire[]>>(config.exceptions ?? {});
  const [dateException, setDateException] = useState('');
  const [modifie, setModifie] = useState(false);
  const [enregistrement, setEnregistrement] = useState(false);
  const [enregistre, setEnregistre] = useState(false);

  // Suit Firestore tant que l'admin n'a pas commencé à éditer; s'arrête dès la première modification
  // locale pour ne jamais écraser une saisie en cours, reprend une fois l'enregistrement terminé.
  useEffect(() => {
    if (modifie) return;
    setJours(config.jours);
    setDuree(config.duree);
    setTampon(config.tampon);
    setDelaiMinHeures(config.delaiMinHeures);
    setHorizonJours(config.horizonJours);
    setExceptions(config.exceptions ?? {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, modifie]);

  const majPlage = (jour: JourKey, i: number, champ: keyof PlageHoraire, valeur: string) => {
    setJours((j) => ({ ...j, [jour]: j[jour].map((p, idx) => (idx === i ? { ...p, [champ]: valeur } : p)) }));
    setModifie(true);
  };
  const ajouterPlage = (jour: JourKey) => {
    setJours((j) => ({ ...j, [jour]: [...j[jour], { de: '09:00', a: '17:00' }] }));
    setModifie(true);
  };
  const retirerPlage = (jour: JourKey, i: number) => {
    setJours((j) => ({ ...j, [jour]: j[jour].filter((_, idx) => idx !== i) }));
    setModifie(true);
  };

  const ajouterException = () => {
    if (!dateException || exceptions[dateException]) return;
    setExceptions((ex) => ({ ...ex, [dateException]: [] }));
    setDateException('');
    setModifie(true);
  };
  const retirerException = (cle: string) => {
    setExceptions((ex) => {
      const suivant = { ...ex };
      delete suivant[cle];
      return suivant;
    });
    setModifie(true);
  };
  const majPlageException = (cle: string, i: number, champ: keyof PlageHoraire, valeur: string) => {
    setExceptions((ex) => ({ ...ex, [cle]: ex[cle].map((p, idx) => (idx === i ? { ...p, [champ]: valeur } : p)) }));
    setModifie(true);
  };
  const ajouterPlageException = (cle: string) => {
    setExceptions((ex) => ({ ...ex, [cle]: [...ex[cle], { de: '09:00', a: '17:00' }] }));
    setModifie(true);
  };
  const retirerPlageException = (cle: string, i: number) => {
    setExceptions((ex) => ({ ...ex, [cle]: ex[cle].filter((_, idx) => idx !== i) }));
    setModifie(true);
  };

  const enregistrer = async () => {
    if (enregistrement) return;
    setEnregistrement(true);
    try {
      await writeDoc<Partial<AgendaConfig>>(
        'settings/agenda',
        { duree, tampon, delaiMinHeures, horizonJours, fuseau: config.fuseau, jours, exceptions },
        { merge: true }
      );
      setModifie(false);
      setEnregistre(true);
      window.setTimeout(() => setEnregistre(false), 2500);
    } catch {
      /* modifie reste vrai : le bouton reste actif pour réessayer */
    } finally {
      setEnregistrement(false);
    }
  };

  const rangeePlage = (p: PlageHoraire, onDe: (v: string) => void, onA: (v: string) => void, onRetirer: () => void, cle: string) => (
    <div key={cle} className="flex items-center gap-2 min-w-0">
      <input type="time" value={p.de} onChange={(e) => onDe(e.target.value)} aria-label={t.de} className={CHAMP_PETIT} />
      <span className="text-gris text-sm">{t.aChamp}</span>
      <input type="time" value={p.a} onChange={(e) => onA(e.target.value)} aria-label={t.aChamp} className={CHAMP_PETIT} />
      <button
        type="button"
        onClick={onRetirer}
        aria-label={t.retirer}
        className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-pilule text-gris hover:text-rose transition-colors"
      >
        <Trash2 className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );

  return (
    <div data-tx-scope="adminAgendaDispo">
      <Panneau titre={t.titre} className="space-y-8">
        <p className="text-gris text-sm mesure -mt-3">{t.sous}</p>

        <div className="grid gap-4 sm:grid-cols-2">
          {JOURS_ORDRE.map((jour) => (
            <div key={jour} className="min-w-0 border border-filet rounded-champ p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-sans font-semibold text-encre text-sm">{t[`jour${jour}` as 'jour0']}</p>
                <button
                  type="button"
                  onClick={() => ajouterPlage(jour)}
                  aria-label={t.ajouterPlage}
                  className="w-11 h-11 flex items-center justify-center rounded-pilule text-gris hover:text-encre transition-colors"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
              {jours[jour].length === 0 ? (
                <p className="text-gris text-sm">{t.jourFerme}</p>
              ) : (
                <div className="space-y-2">
                  {jours[jour].map((p, i) =>
                    rangeePlage(
                      p,
                      (v) => majPlage(jour, i, 'de', v),
                      (v) => majPlage(jour, i, 'a', v),
                      () => retirerPlage(jour, i),
                      `${jour}-${i}`
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Champ
            label={t.dureeLabel}
            type="number"
            min={5}
            step={5}
            value={duree}
            onChange={(e) => {
              setDuree(Number(e.target.value));
              setModifie(true);
            }}
          />
          <Champ
            label={t.tamponLabel}
            type="number"
            min={0}
            step={5}
            value={tampon}
            onChange={(e) => {
              setTampon(Number(e.target.value));
              setModifie(true);
            }}
          />
          <Champ
            label={t.delaiLabel}
            type="number"
            min={0}
            value={delaiMinHeures}
            onChange={(e) => {
              setDelaiMinHeures(Number(e.target.value));
              setModifie(true);
            }}
          />
          <Champ
            label={t.horizonLabel}
            type="number"
            min={1}
            value={horizonJours}
            onChange={(e) => {
              setHorizonJours(Number(e.target.value));
              setModifie(true);
            }}
          />
        </div>

        <div className="border border-filet rounded-champ p-4 space-y-4">
          <p className="font-sans font-semibold text-encre text-sm">{t.exceptionsTitre}</p>
          <div className="flex flex-wrap items-end gap-3">
            <Champ
              label={t.dateException}
              type="date"
              value={dateException}
              onChange={(e) => setDateException(e.target.value)}
              className="flex-1 min-w-[10rem]"
            />
            <Bouton type="button" variante="secondaire" icone={Plus} onClick={ajouterException} disabled={!dateException}>
              {t.ajouterException}
            </Bouton>
          </div>
          {Object.keys(exceptions).length === 0 ? (
            <p className="text-gris text-sm">{t.aucuneException}</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(exceptions)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([cle, plages]: [string, PlageHoraire[]]) => (
                  <div key={cle} className="border border-filet rounded-champ p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-encre">{cle}</p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => ajouterPlageException(cle)}
                          aria-label={t.ajouterPlage}
                          className="w-11 h-11 flex items-center justify-center rounded-pilule text-gris hover:text-encre transition-colors"
                        >
                          <Plus className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => retirerException(cle)}
                          aria-label={t.retirerException}
                          className="w-11 h-11 flex items-center justify-center rounded-pilule text-gris hover:text-rose transition-colors"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    {plages.length === 0 ? (
                      <p className="text-gris text-sm">{t.jourFerme}</p>
                    ) : (
                      <div className="space-y-2">
                        {plages.map((p, i) =>
                          rangeePlage(
                            p,
                            (v) => majPlageException(cle, i, 'de', v),
                            (v) => majPlageException(cle, i, 'a', v),
                            () => retirerPlageException(cle, i),
                            `${cle}-${i}`
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Bouton icone={Save} onClick={enregistrer} disabled={!modifie || enregistrement}>
            {enregistrement ? t.enregistrementEnCours : t.enregistrer}
          </Bouton>
          {enregistre && <span className="text-rose text-sm">{t.enregistre}</span>}
        </div>
      </Panneau>
    </div>
  );
};

export default Disponibilites;
