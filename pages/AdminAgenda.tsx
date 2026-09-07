import React, { useState } from 'react';
import { Calendar, Plus, Save, AlertCircle } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { ACTION_BUTTON_CLASSES, GLASS_INPUT_CLASSES } from '../constants';
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
      newEvent: 'Nouvel Événement',
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
      newEvent: 'New Event',
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
    <div className="pt-24 px-6 pb-12 h-screen flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">{t.title}</h1>
          <p className="text-slate-400">{t.subtitle}</p>
        </div>
        <button
          className={ACTION_BUTTON_CLASSES}
          onClick={() => window.open('https://calendar.google.com/', '_blank')}
        >
          <Plus className="w-4 h-4" /> {t.newEvent}
        </button>
      </div>

      {loading ? (
        <p className="text-slate-400 text-sm" role="status" aria-live="polite">{t.loading}</p>
      ) : calendarId ? (
        <div className="flex-1 bg-slate-900 border border-white/10 rounded-[20px] overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950 z-0">
            <Calendar className="w-12 h-12 text-slate-700 animate-pulse" />
          </div>
          <iframe
            src={`https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=America%2FToronto&bgcolor=%23ffffff&src=${encodeURIComponent(calendarId)}&color=%230B8043`}
            style={{ borderWidth: 0, width: '100%', height: '100%', position: 'relative', zIndex: 10, filter: 'invert(0.92) hue-rotate(180deg)' }}
            frameBorder="0"
            scrolling="no"
            title="Google Calendar"
          />
        </div>
      ) : (
        <GlassCard className="p-8 max-w-xl">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">{t.setupTitle}</h2>
          </div>
          <p className="text-slate-400 text-sm mb-6">{t.setupText}</p>
          <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={calendarIdInput}
              onChange={(e) => setCalendarIdInput(e.target.value)}
              placeholder={t.placeholder}
              className={`${GLASS_INPUT_CLASSES} flex-1`}
              aria-label={t.setupTitle}
            />
            <button type="submit" disabled={saving || !calendarIdInput.trim()} className={`${ACTION_BUTTON_CLASSES} disabled:opacity-50`}>
              <Save className="w-4 h-4" /> {saving ? t.saving : t.save}
            </button>
          </form>
          {error && (
            <div className="flex items-start gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-[12px] p-3 mt-4" role="alert">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
};

export default AdminAgenda;
