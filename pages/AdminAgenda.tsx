import React, { useState } from 'react';
import { Calendar, Plus, Save, AlertCircle } from 'lucide-react';
import { EnTete, Panneau, Bouton, Champ, Chargement } from '../components/admin/ui';
import { Language } from '../types';
import { useDocument, writeDoc } from '../lib/firestore';

interface AdminAgendaProps {
  lang: Language;
}

interface AgendaSettings {
  calendarId?: string;
}

const AdminAgenda: React.FC<AdminAgendaProps> = ({ lang }) => {
  const { data: settings, loading } = useDocument<AgendaSettings>('settings/agenda');
  const [calendarIdInput, setCalendarIdInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = {
    FR: {
      title: 'Agenda Google',
      subtitle: 'Gérez vos rendez-vous et sessions directement ici.',
      newEvent: 'Nouvel événement',
      setupTitle: 'Brancher votre agenda',
      setupText: "Collez l'identifiant de calendrier Google (dans les paramètres du calendrier, sous « Intégrer le calendrier ») pour l'afficher ici.",
      placeholder: 'exemple@group.calendar.google.com',
      save: 'Enregistrer',
      saving: 'Enregistrement…',
      saveError: "L'enregistrement a échoué. Réessayez.",
      loading: 'Chargement…',
    },
    EN: {
      title: 'Google Calendar',
      subtitle: 'Manage your appointments and sessions directly here.',
      newEvent: 'New event',
      setupTitle: 'Connect your calendar',
      setupText: 'Paste the Google Calendar ID (in the calendar settings, under "Integrate calendar") to display it here.',
      placeholder: 'example@group.calendar.google.com',
      save: 'Save',
      saving: 'Saving…',
      saveError: 'Save failed. Try again.',
      loading: 'Loading…',
    }
  }[lang];

  const calendarId = settings?.calendarId?.trim();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calendarIdInput.trim() || saving) return;
    setError(null);
    setSaving(true);
    try {
      await writeDoc('settings/agenda', { calendarId: calendarIdInput.trim() }, { merge: true });
      setCalendarIdInput('');
    } catch (err) {
      console.error('Agenda settings save failed', err);
      setError(t.saveError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-6 md:px-10 py-10 space-y-8">
      <EnTete
        kicker="Agenda"
        titre={t.title}
        lede={t.subtitle}
        actions={
          <Bouton icone={Plus} onClick={() => window.open('https://calendar.google.com/', '_blank')}>
            {t.newEvent}
          </Bouton>
        }
      />

      {loading ? (
        <Chargement texte={t.loading} />
      ) : calendarId ? (
        <div className="h-[70vh] bg-papier-2 border border-filet rounded-champ overflow-hidden">
          <iframe
            src={`https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=America%2FToronto&bgcolor=%23ffffff&src=${encodeURIComponent(calendarId)}&color=%230B8043`}
            style={{ borderWidth: 0, width: '100%', height: '100%' }}
            frameBorder="0"
            scrolling="no"
            title="Google Calendar"
          />
        </div>
      ) : (
        <Panneau className="max-w-xl">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-6 h-6 text-rose" aria-hidden="true" />
            <h2 className="font-sans font-semibold text-encre text-lg">{t.setupTitle}</h2>
          </div>
          <p className="text-gris text-sm mb-6">{t.setupText}</p>
          <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <Champ
              label={t.setupTitle}
              type="text"
              value={calendarIdInput}
              onChange={(e) => setCalendarIdInput(e.target.value)}
              placeholder={t.placeholder}
              className="flex-1"
            />
            <Bouton type="submit" icone={Save} disabled={saving || !calendarIdInput.trim()}>
              {saving ? t.saving : t.save}
            </Bouton>
          </form>
          {error && (
            <div className="flex items-start gap-2 text-sm text-rose bg-rose/10 border border-rose/20 rounded-champ p-3 mt-4" role="alert">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}
        </Panneau>
      )}
    </div>
  );
};

export default AdminAgenda;
