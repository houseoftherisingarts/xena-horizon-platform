import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { ACTION_BUTTON_CLASSES } from '../constants';
import { Language } from '../types';

interface AdminAgendaProps {
  lang: Language;
}

const AdminAgenda: React.FC<AdminAgendaProps> = ({ lang }) => {
  const t = {
    FR: {
      title: 'Agenda Google',
      subtitle: 'Gérez vos rendez-vous et sessions directement ici.',
      newEvent: 'Nouvel Événement'
    },
    EN: {
      title: 'Google Calendar',
      subtitle: 'Manage your appointments and sessions directly here.',
      newEvent: 'New Event'
    }
  }[lang];

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

      <div className="flex-1 bg-slate-900 border border-white/10 rounded-[20px] overflow-hidden shadow-2xl relative">
        {/* Loading / Placeholder background */}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950 z-0">
           <Calendar className="w-12 h-12 text-slate-700 animate-pulse" />
        </div>
        
        {/* Google Calendar Embed */}
        <iframe 
          src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=America%2FToronto&bgcolor=%23ffffff&src=fr.canadian%23holiday%40group.v.calendar.google.com&color=%230B8043" 
          style={{ borderWidth: 0, width: '100%', height: '100%', position: 'relative', zIndex: 10, filter: 'invert(0.92) hue-rotate(180deg)' }} 
          frameBorder="0" 
          scrolling="no"
          title="Google Calendar"
        ></iframe>
      </div>
    </div>
  );
};

export default AdminAgenda;