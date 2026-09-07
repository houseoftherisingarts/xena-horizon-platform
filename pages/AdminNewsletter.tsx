import React, { useState } from 'react';
import {
  Download, LayoutTemplate, Image as ImageIcon, Link as LinkIcon,
  Type, X, Plus, Trash2, ArrowUp, ArrowDown, Bot, Mail, Send, Save, Users, FileText
} from 'lucide-react';
import { orderBy } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import GlassCard from '../components/GlassCard';
import { ACTION_BUTTON_CLASSES, GLASS_INPUT_CLASSES } from '../constants';
import { GalleryImage, Language, NewsletterCampaign, Subscriber } from '../types';
import { useCollection, createDoc, patchDoc, removeDoc } from '../lib/firestore';

interface AdminNewsletterProps {
  lang: Language;
}

// --- TYPES (local editor types) ---

type EmailBlockType = 'HEADER' | 'TEXT' | 'IMAGE' | 'BUTTON' | 'FOOTER' | 'SPACER';

interface BaseBlock {
  id: string;
  type: EmailBlockType;
}

interface HeaderBlock extends BaseBlock {
  type: 'HEADER';
  logoUrl: string;
  title: string;
  viewOnlineText: string;
}

interface TextBlock extends BaseBlock {
  type: 'TEXT';
  content: string;
  align: 'left' | 'center' | 'right';
}

interface ImageBlock extends BaseBlock {
  type: 'IMAGE';
  imageUrl: string;
  link: string;
  alt: string;
}

interface ButtonBlock extends BaseBlock {
  type: 'BUTTON';
  label: string;
  link: string;
  color: string;
  textColor: string;
}

interface FooterBlock extends BaseBlock {
  type: 'FOOTER';
  companyName: string;
  address: string;
  unsubscribeText: string;
}

interface SpacerBlock extends BaseBlock {
    type: 'SPACER';
    height: number;
}

type EmailBlock = HeaderBlock | TextBlock | ImageBlock | ButtonBlock | FooterBlock | SpacerBlock;

// --- AI WIZARD ---

interface WizardAnswers {
  topic: string;
  audience: string;
  goal: string;
}

const INITIAL_ANSWERS: WizardAnswers = { topic: '', audience: '', goal: '' };

type Tab = 'composer' | 'subscribers';

const AdminNewsletter: React.FC<AdminNewsletterProps> = ({ lang }) => {
  const { data: gallery } = useCollection<GalleryImage>('gallery');

  // Editor (WIP) state
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [subject, setSubject] = useState<string>('');
  const [currentCampaignId, setCurrentCampaignId] = useState<string | null>(null);

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardAnswers, setWizardAnswers] = useState<WizardAnswers>(INITIAL_ANSWERS);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [targetImageBlockId, setTargetImageBlockId] = useState<string | null>(null);

  const [tab, setTab] = useState<Tab>('composer');
  const [banner, setBanner] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Subscriber modal state
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [newSubEmail, setNewSubEmail] = useState('');
  const [newSubTags, setNewSubTags] = useState('');

  // Firestore data
  const { data: campaigns, loading: campaignsLoading } = useCollection<NewsletterCampaign>(
    'newsletters',
    [orderBy('createdAt', 'desc')]
  );
  const { data: subscribers, loading: subscribersLoading } = useCollection<Subscriber>(
    'subscribers',
    [orderBy('createdAt', 'desc')]
  );

  const t = {
    FR: {
      title: 'Générateur d\'Infolettre',
      assistant: 'Assistant Rédaction',
      copy: 'Copier HTML',
      blocks: 'Blocs Email',
      header: 'En-tête',
      text: 'Texte',
      image: 'Image',
      button: 'Bouton',
      spacer: 'Espace',
      footer: 'Pied',
      structure: 'Structure',
      empty: 'Ajoutez des blocs pour commencer.',
      preview: 'Zone de prévisualisation',
      aiTitle: 'Assistant Infolettre',
      topic: 'Sujet principal',
      goal: 'Objectif',
      cancel: 'Annuler',
      generate: 'Générer',
      selectImg: 'Sélectionner une image',
      emptyGallery: 'Aucune image. Ajoutez-en depuis la Galerie de l\'admin.',
      composer: 'Composer',
      subscribers: 'Abonnés',
      campaigns: 'Campagnes',
      saveDraft: 'Enregistrer brouillon',
      send: 'Envoyer',
      newDraft: 'Nouveau brouillon',
      subjectPlaceholder: 'Sujet de l\'infolettre…',
      noCampaigns: 'Aucune campagne enregistrée.',
      draft: 'Brouillon',
      sent: 'Envoyé',
      addSubscriber: 'Ajouter un abonné',
      subscriberEmail: 'Adresse courriel',
      subscriberTags: 'Tags (séparés par virgule)',
      add: 'Ajouter',
      noSubscribers: 'Aucun abonné.',
      remove: 'Retirer',
      loading: 'Chargement…',
      sentBanner: 'Brouillon enregistré comme envoyé. La fonction Cloud sera connectée à Resend (tâche #8).',
      savedToast: 'Brouillon enregistré.',
      confirmRemove: 'Retirer cet abonné ?',
      subjectRequired: 'Veuillez saisir un sujet avant d\'enregistrer.',
    },
    EN: {
      title: 'Newsletter Generator',
      assistant: 'Writing Assistant',
      copy: 'Copy HTML',
      blocks: 'Email Blocks',
      header: 'Header',
      text: 'Text',
      image: 'Image',
      button: 'Button',
      spacer: 'Spacer',
      footer: 'Footer',
      structure: 'Structure',
      empty: 'Add blocks to start.',
      preview: 'Preview Area',
      aiTitle: 'Newsletter Assistant',
      topic: 'Main Topic',
      goal: 'Goal',
      cancel: 'Cancel',
      generate: 'Generate',
      selectImg: 'Select Image',
      composer: 'Composer',
      subscribers: 'Subscribers',
      campaigns: 'Campaigns',
      saveDraft: 'Save draft',
      send: 'Send',
      newDraft: 'New draft',
      subjectPlaceholder: 'Newsletter subject…',
      noCampaigns: 'No campaigns yet.',
      draft: 'Draft',
      sent: 'Sent',
      addSubscriber: 'Add subscriber',
      subscriberEmail: 'Email address',
      subscriberTags: 'Tags (comma-separated)',
      add: 'Add',
      noSubscribers: 'No subscribers yet.',
      remove: 'Remove',
      loading: 'Loading…',
      sentBanner: 'Brouillon enregistré comme envoyé. La fonction Cloud sera connectée à Resend (tâche #8).',
      savedToast: 'Draft saved.',
      confirmRemove: 'Remove this subscriber?',
      subjectRequired: 'Please enter a subject before saving.',
    }
  }[lang];

  // --- ACTIONS ---

  const addBlock = (type: EmailBlockType) => {
    const id = Date.now().toString();
    let newBlock: EmailBlock;

    switch (type) {
      case 'HEADER':
        newBlock = { type: 'HEADER', id, logoUrl: 'https://via.placeholder.com/150x50?text=LOGO', title: 'Votre Infolettre', viewOnlineText: 'Voir dans le navigateur' };
        break;
      case 'TEXT':
        newBlock = { type: 'TEXT', id, content: 'Bonjour {Prénom},<br><br>Voici les nouvelles de la semaine.', align: 'left' };
        break;
      case 'IMAGE':
        newBlock = { type: 'IMAGE', id, imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80', link: '#', alt: 'Image' };
        break;
      case 'BUTTON':
        newBlock = { type: 'BUTTON', id, label: 'Lire la suite', link: '#', color: '#3b82f6', textColor: '#ffffff' };
        break;
      case 'FOOTER':
        newBlock = { type: 'FOOTER', id, companyName: 'Xena Horizon', address: '123 Rue de la Création, Montréal', unsubscribeText: 'Se désabonner' };
        break;
      case 'SPACER':
        newBlock = { type: 'SPACER', id, height: 20 };
        break;
      default: return;
    }
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, field: string, value: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    if ((index === 0 && direction === -1) || (index === blocks.length - 1 && direction === 1)) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + direction];
    newBlocks[index + direction] = temp;
    setBlocks(newBlocks);
  };

  const deleteBlock = (index: number) => {
    if(window.confirm("Supprimer ce bloc ?")) {
      const newBlocks = [...blocks];
      newBlocks.splice(index, 1);
      setBlocks(newBlocks);
    }
  };

  // --- AI WIZARD LOGIC ---

  const generateAiNewsletter = () => {
    const { topic, goal } = wizardAnswers;
    const id = Date.now();

    setBlocks([
       { type: 'HEADER', id: `h-${id}`, logoUrl: 'https://via.placeholder.com/150x50?text=XENA', title: topic, viewOnlineText: 'Voir en ligne' },
       { type: 'IMAGE', id: `i-${id}`, imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80', link: '#', alt: 'Hero' },
       { type: 'TEXT', id: `t-${id}`, align: 'left', content: `Bonjour à tous,<br><br>Aujourd'hui, nous parlons de <strong>${topic}</strong>. C'est un sujet crucial pour atteindre ${goal}.<br><br>Voici pourquoi c'est important...` },
       { type: 'BUTTON', id: `b-${id}`, label: 'Découvrir la méthode', link: '#', color: '#3b82f6', textColor: '#ffffff' },
       { type: 'FOOTER', id: `f-${id}`, companyName: 'Xena Horizon', address: 'Montréal, QC', unsubscribeText: 'Me désinscrire' }
    ]);
    if (!subject) setSubject(topic);
    setIsWizardOpen(false);
    setWizardStep(0);
  };

  // --- HTML EXPORT (Email Safe-ish) ---
  const generateHTML = () => {
    const bodyContent = blocks.map(block => {
       if (block.type === 'HEADER') {
         const b = block as HeaderBlock;
         return `
           <tr><td align="center" style="padding: 20px;">
             <p style="font-size: 10px; color: #999;"><a href="#" style="color:#999;">${b.viewOnlineText}</a></p>
             <img src="${b.logoUrl}" alt="Logo" width="150" style="display:block;">
             <h1 style="font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: #111827; margin-top: 15px; letter-spacing: -0.5px;">${b.title}</h1>
           </td></tr>`;
       }
       if (block.type === 'TEXT') {
         const b = block as TextBlock;
         return `
           <tr><td align="${b.align}" style="padding: 10px 20px; font-family: sans-serif; font-size: 16px; line-height: 1.6; color: #374151;">
             ${b.content}
           </td></tr>`;
       }
       if (block.type === 'IMAGE') {
         const b = block as ImageBlock;
         return `
           <tr><td align="center" style="padding: 10px 0;">
             <a href="${b.link}"><img src="${b.imageUrl}" alt="${b.alt}" width="600" style="max-width: 100%; height: auto; display: block; border-radius: 8px;"></a>
           </td></tr>`;
       }
       if (block.type === 'BUTTON') {
         const b = block as ButtonBlock;
         return `
           <tr><td align="center" style="padding: 20px;">
             <a href="${b.link}" style="display: inline-block; padding: 14px 32px; background-color: ${b.color}; color: ${b.textColor}; text-decoration: none; font-weight: bold; border-radius: 50px; font-family: sans-serif; font-size: 16px;">${b.label}</a>
           </td></tr>`;
       }
       if (block.type === 'SPACER') {
         const b = block as SpacerBlock;
         return `<tr><td height="${b.height}" style="font-size: 0; line-height: 0;">&nbsp;</td></tr>`;
       }
       if (block.type === 'FOOTER') {
         const b = block as FooterBlock;
         return `
           <tr><td align="center" style="padding: 30px 20px; font-family: sans-serif; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6;">
             <p><strong>${b.companyName}</strong><br>${b.address}</p>
             <p><a href="#" style="color: #9ca3af; text-decoration: underline;">${b.unsubscribeText}</a></p>
           </td></tr>`;
       }
       return '';
    }).join('');

    return `
<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; margin: 0 auto; max-width: 600px; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);">
          ${bodyContent}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  };

  const handleExport = () => {
    const html = generateHTML();
    navigator.clipboard.writeText(html);
    alert("Code HTML copié dans le presse-papier !");
  };

  // --- FIRESTORE: campaigns ---

  const showBanner = (msg: string) => {
    setBanner(msg);
    setTimeout(() => setBanner(null), 4500);
  };

  const handleSaveDraft = async () => {
    if (!subject.trim()) {
      alert(t.subjectRequired);
      return;
    }
    setSaving(true);
    try {
      if (currentCampaignId) {
        await patchDoc<NewsletterCampaign>('newsletters', currentCampaignId, { subject, blocks });
      } else {
        const id = await createDoc('newsletters', { subject, blocks, status: 'draft' as const });
        setCurrentCampaignId(id);
      }
      showBanner(t.savedToast);
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async () => {
    if (!subject.trim()) {
      alert(t.subjectRequired);
      return;
    }
    setSaving(true);
    try {
      let id = currentCampaignId;
      if (!id) {
        id = await createDoc('newsletters', { subject, blocks, status: 'draft' as const });
        setCurrentCampaignId(id);
      } else {
        await patchDoc<NewsletterCampaign>('newsletters', id, { subject, blocks });
      }
      await patchDoc<NewsletterCampaign>('newsletters', id!, {
        status: 'sent',
        sentAt: serverTimestamp() as any,
      });
      showBanner(t.sentBanner);
    } finally {
      setSaving(false);
    }
  };

  const loadCampaign = (c: NewsletterCampaign) => {
    setCurrentCampaignId(c.id);
    setSubject(c.subject || '');
    setBlocks(Array.isArray(c.blocks) ? (c.blocks as EmailBlock[]) : []);
    setTab('composer');
  };

  const newDraft = () => {
    setCurrentCampaignId(null);
    setSubject('');
    setBlocks([]);
  };

  const deleteCampaign = async (id: string) => {
    if (!window.confirm(lang === 'FR' ? 'Supprimer cette campagne ?' : 'Delete this campaign?')) return;
    await removeDoc('newsletters', id);
    if (currentCampaignId === id) newDraft();
  };

  // --- FIRESTORE: subscribers ---

  const handleAddSubscriber = async () => {
    const email = newSubEmail.trim();
    if (!email) return;
    const tags = newSubTags
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    await createDoc<Partial<Subscriber>>('subscribers', {
      email,
      tags: tags.length > 0 ? tags : undefined,
      status: 'active',
      source: 'admin',
    });
    setNewSubEmail('');
    setNewSubTags('');
    setIsSubModalOpen(false);
  };

  const handleRemoveSubscriber = async (id: string) => {
    if (!window.confirm(t.confirmRemove)) return;
    await removeDoc('subscribers', id);
  };

  return (
    <div className="pt-24 px-6 pb-12 max-w-[1920px] mx-auto h-screen flex flex-col relative">

       {/* HEADER */}
       <div className="flex justify-between items-center mb-4 flex-shrink-0">
         <div className="flex items-center gap-4">
           <h1 className="text-3xl font-serif font-bold text-white">{t.title}</h1>
           <button onClick={() => setIsWizardOpen(true)} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full text-sm font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105">
             <Bot className="w-4 h-4" /> {t.assistant}
           </button>
         </div>
         <div className="flex items-center gap-2">
            <button onClick={handleSaveDraft} disabled={saving} className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-full text-sm font-bold flex items-center gap-2 transition">
                <Save className="w-4 h-4" /> {t.saveDraft}
            </button>
            <button onClick={handleSend} disabled={saving} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-full text-sm font-bold flex items-center gap-2 shadow-lg transition">
                <Send className="w-4 h-4" /> {t.send}
            </button>
            <button onClick={handleExport} className={ACTION_BUTTON_CLASSES}>
                <Download className="w-4 h-4" /> {t.copy}
            </button>
         </div>
       </div>

       {/* TABS + BANNER */}
       <div className="flex items-center justify-between gap-4 mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
             <button
                onClick={() => setTab('composer')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition ${tab === 'composer' ? 'bg-white text-slate-900' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
             >
                <FileText className="w-3.5 h-3.5"/> {t.composer}
             </button>
             <button
                onClick={() => setTab('subscribers')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition ${tab === 'subscribers' ? 'bg-white text-slate-900' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
             >
                <Users className="w-3.5 h-3.5"/> {t.subscribers}
                {!subscribersLoading && (
                   <span className="ml-1 px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">{subscribers.length}</span>
                )}
             </button>
          </div>
          {banner && (
             <div className="px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-200 text-xs">
                {banner}
             </div>
          )}
       </div>

       {tab === 'composer' && (
         <div className="flex flex-1 gap-6 overflow-hidden">

            {/* SIDEBAR */}
            <div className="w-64 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 flex-shrink-0">
               <GlassCard className="p-4">
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={t.subjectPlaceholder}
                    className={GLASS_INPUT_CLASSES}
                  />
               </GlassCard>

               <GlassCard className="p-4">
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">{t.blocks}</h3>
                 <div className="grid grid-cols-2 gap-2">
                   <button onClick={() => addBlock('HEADER')} className="p-3 bg-white/5 hover:bg-white/10 rounded-lg flex flex-col items-center gap-2 text-xs text-slate-300 transition-all border border-white/5"><LayoutTemplate className="w-4 h-4 text-blue-400"/> {t.header}</button>
                   <button onClick={() => addBlock('TEXT')} className="p-3 bg-white/5 hover:bg-white/10 rounded-lg flex flex-col items-center gap-2 text-xs text-slate-300 transition-all border border-white/5"><Type className="w-4 h-4 text-slate-400"/> {t.text}</button>
                   <button onClick={() => addBlock('IMAGE')} className="p-3 bg-white/5 hover:bg-white/10 rounded-lg flex flex-col items-center gap-2 text-xs text-slate-300 transition-all border border-white/5"><ImageIcon className="w-4 h-4 text-emerald-400"/> {t.image}</button>
                   <button onClick={() => addBlock('BUTTON')} className="p-3 bg-white/5 hover:bg-white/10 rounded-lg flex flex-col items-center gap-2 text-xs text-slate-300 transition-all border border-white/5"><LinkIcon className="w-4 h-4 text-amber-400"/> {t.button}</button>
                   <button onClick={() => addBlock('SPACER')} className="p-3 bg-white/5 hover:bg-white/10 rounded-lg flex flex-col items-center gap-2 text-xs text-slate-300 transition-all border border-white/5"><ArrowDown className="w-4 h-4 text-slate-500"/> {t.spacer}</button>
                   <button onClick={() => addBlock('FOOTER')} className="p-3 bg-white/5 hover:bg-white/10 rounded-lg flex flex-col items-center gap-2 text-xs text-slate-300 transition-all border border-white/5"><LayoutTemplate className="w-4 h-4 text-slate-500 rotate-180"/> {t.footer}</button>
                 </div>
               </GlassCard>

               <div className="space-y-2">
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.structure}</h3>
                 {blocks.map((block, index) => (
                    <div key={block.id} className="bg-slate-900 border border-white/10 p-3 rounded-lg flex items-center justify-between group">
                       <span className="text-xs font-bold text-white">{block.type}</span>
                       <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => moveBlock(index, -1)} className="p-1 hover:bg-white/10 rounded text-slate-400"><ArrowUp className="w-3 h-3"/></button>
                          <button onClick={() => moveBlock(index, 1)} className="p-1 hover:bg-white/10 rounded text-slate-400"><ArrowDown className="w-3 h-3"/></button>
                          <button onClick={() => deleteBlock(index)} className="p-1 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded"><Trash2 className="w-3 h-3"/></button>
                       </div>
                    </div>
                 ))}
                 {blocks.length === 0 && <p className="text-xs text-slate-500 italic text-center py-4">{t.empty}</p>}
               </div>

               {/* CAMPAIGNS LIST */}
               <GlassCard className="p-4">
                  <div className="flex items-center justify-between mb-3">
                     <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.campaigns}</h3>
                     <button onClick={newDraft} className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1">
                        <Plus className="w-3 h-3"/> {t.newDraft}
                     </button>
                  </div>
                  {campaignsLoading ? (
                     <p className="text-xs text-slate-500 italic">{t.loading}</p>
                  ) : campaigns.length === 0 ? (
                     <p className="text-xs text-slate-500 italic">{t.noCampaigns}</p>
                  ) : (
                     <ul className="space-y-1.5">
                        {campaigns.map(c => (
                           <li
                              key={c.id}
                              className={`group p-2 rounded-lg border cursor-pointer transition ${currentCampaignId === c.id ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                              onClick={() => loadCampaign(c)}
                           >
                              <div className="flex items-center justify-between gap-2">
                                 <span className="text-xs text-white truncate flex-1">{c.subject || '(sans sujet)'}</span>
                                 <button
                                    onClick={(e) => { e.stopPropagation(); deleteCampaign(c.id); }}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded"
                                 >
                                    <Trash2 className="w-3 h-3"/>
                                 </button>
                              </div>
                              <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${c.status === 'sent' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                                 {c.status === 'sent' ? t.sent : t.draft}
                              </span>
                           </li>
                        ))}
                     </ul>
                  )}
               </GlassCard>
            </div>

            {/* MAIN PREVIEW AREA (Email Context) */}
            <div className="flex-1 bg-slate-950/50 rounded-[20px] border border-white/5 overflow-y-auto custom-scrollbar flex justify-center py-8">
               <div className="w-[600px] bg-white min-h-[800px] shadow-2xl relative text-slate-900 selection:bg-slate-200 selection:text-slate-900">
                  {blocks.length === 0 && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                        <Mail className="w-16 h-16 mb-4 opacity-20" />
                        <p>{t.preview} (600px)</p>
                     </div>
                  )}

                  {blocks.map(block => (
                     <div key={block.id} className="relative group border border-transparent hover:border-slate-200 border-dashed transition-all">
                        {/* HEADER RENDER */}
                        {block.type === 'HEADER' && (
                           <div className="p-5 text-center">
                              <input
                                 value={(block as HeaderBlock).title}
                                 onChange={(e) => updateBlock(block.id, 'title', e.target.value)}
                                 className="text-3xl font-serif font-bold text-slate-900 text-center w-full focus:outline-none bg-transparent placeholder-slate-300"
                                 placeholder="Titre de votre infolettre"
                              />
                              <p className="text-xs text-slate-400 mt-2">{(block as HeaderBlock).viewOnlineText}</p>
                           </div>
                        )}

                        {/* TEXT RENDER */}
                        {block.type === 'TEXT' && (
                           <div className="p-5">
                              <textarea
                                 value={(block as TextBlock).content.replace(/<br>/g, '\n')}
                                 onChange={(e) => updateBlock(block.id, 'content', e.target.value.replace(/\n/g, '<br>'))}
                                 className="w-full h-auto min-h-[100px] text-slate-700 text-base resize-none focus:outline-none bg-transparent font-sans"
                              />
                              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 bg-white shadow-md border rounded flex gap-1 z-10">
                                 <button onClick={() => updateBlock(block.id, 'align', 'left')} className="p-1 hover:bg-slate-100 rounded text-xs">G</button>
                                 <button onClick={() => updateBlock(block.id, 'align', 'center')} className="p-1 hover:bg-slate-100 rounded text-xs">C</button>
                                 <button onClick={() => updateBlock(block.id, 'align', 'right')} className="p-1 hover:bg-slate-100 rounded text-xs">D</button>
                              </div>
                           </div>
                        )}

                        {/* IMAGE RENDER */}
                        {block.type === 'IMAGE' && (
                           <div className="p-2 text-center relative">
                              <img
                                 src={(block as ImageBlock).imageUrl}
                                 className="max-w-full h-auto rounded-lg mx-auto cursor-pointer"
                                 onClick={() => { setIsGalleryOpen(true); setTargetImageBlockId(block.id); }}
                              />
                              <input
                                 value={(block as ImageBlock).link}
                                 onChange={(e) => updateBlock(block.id, 'link', e.target.value)}
                                 placeholder="Lien de destination..."
                                 className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded text-xs w-64 text-center opacity-0 group-hover:opacity-100 shadow-lg text-slate-800"
                              />
                           </div>
                        )}

                        {/* BUTTON RENDER */}
                        {block.type === 'BUTTON' && (
                           <div className="p-5 text-center">
                              <button
                                 className="px-6 py-3 rounded-full font-bold inline-block"
                                 style={{ backgroundColor: (block as ButtonBlock).color, color: (block as ButtonBlock).textColor }}
                              >
                                 <input
                                    value={(block as ButtonBlock).label}
                                    onChange={(e) => updateBlock(block.id, 'label', e.target.value)}
                                    className="bg-transparent text-center focus:outline-none w-auto font-sans"
                                    style={{ color: 'inherit', width: '100%' }}
                                 />
                              </button>
                              <div className="mt-2 opacity-0 group-hover:opacity-100 flex justify-center items-center gap-2">
                                 <input type="color" value={(block as ButtonBlock).color} onChange={(e) => updateBlock(block.id, 'color', e.target.value)} className="w-6 h-6 p-0 border-0 rounded cursor-pointer" />
                                 <input type="text" value={(block as ButtonBlock).link} onChange={(e) => updateBlock(block.id, 'link', e.target.value)} className="border rounded px-2 py-1 text-xs text-slate-600 bg-white" placeholder="http://..." />
                              </div>
                           </div>
                        )}

                        {/* SPACER RENDER */}
                        {block.type === 'SPACER' && (
                            <div style={{ height: (block as SpacerBlock).height }} className="bg-slate-50 flex items-center justify-center relative group/spacer">
                                <span className="text-[10px] text-slate-400 opacity-0 group-hover/spacer:opacity-100">Espace {(block as SpacerBlock).height}px</span>
                                <input
                                  type="range" min="10" max="100"
                                  value={(block as SpacerBlock).height}
                                  onChange={(e) => updateBlock(block.id, 'height', parseInt(e.target.value))}
                                  className="absolute inset-x-4 opacity-0 group-hover/spacer:opacity-100 cursor-ns-resize"
                                />
                            </div>
                        )}

                        {/* FOOTER RENDER */}
                        {block.type === 'FOOTER' && (
                           <div className="p-8 border-t border-slate-100 text-center text-xs text-slate-400">
                              <input
                                 value={(block as FooterBlock).companyName}
                                 onChange={(e) => updateBlock(block.id, 'companyName', e.target.value)}
                                 className="font-bold text-center w-full focus:outline-none bg-transparent text-slate-500"
                              />
                              <input
                                 value={(block as FooterBlock).address}
                                 onChange={(e) => updateBlock(block.id, 'address', e.target.value)}
                                 className="text-center w-full focus:outline-none bg-transparent mt-1"
                              />
                              <p className="mt-2 underline cursor-pointer">{(block as FooterBlock).unsubscribeText}</p>
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            </div>
         </div>
       )}

       {tab === 'subscribers' && (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
             <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                   <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Users className="w-5 h-5"/> {t.subscribers}
                      <span className="ml-1 px-2 py-0.5 rounded-full bg-white/10 text-slate-300 text-xs">{subscribers.length}</span>
                   </h2>
                   <button onClick={() => setIsSubModalOpen(true)} className={ACTION_BUTTON_CLASSES}>
                      <Plus className="w-4 h-4"/> {t.addSubscriber}
                   </button>
                </div>
                {subscribersLoading ? (
                   <p className="text-sm text-slate-400 italic py-8 text-center">{t.loading}</p>
                ) : subscribers.length === 0 ? (
                   <p className="text-sm text-slate-400 italic py-8 text-center">{t.noSubscribers}</p>
                ) : (
                   <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                         <thead>
                            <tr className="text-left text-xs text-slate-500 uppercase tracking-wider border-b border-white/5">
                               <th className="py-2 pr-4 font-bold">Email</th>
                               <th className="py-2 pr-4 font-bold">Status</th>
                               <th className="py-2 pr-4 font-bold">Tags</th>
                               <th className="py-2 pr-4 font-bold"></th>
                            </tr>
                         </thead>
                         <tbody>
                            {subscribers.map(sub => (
                               <tr key={sub.id} className="border-b border-white/5 hover:bg-white/5 transition">
                                  <td className="py-3 pr-4 text-white">{sub.email}</td>
                                  <td className="py-3 pr-4">
                                     <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${sub.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-500/20 text-slate-300'}`}>
                                        {sub.status}
                                     </span>
                                  </td>
                                  <td className="py-3 pr-4 text-slate-400 text-xs">
                                     {sub.tags && sub.tags.length > 0 ? sub.tags.join(', ') : '—'}
                                  </td>
                                  <td className="py-3 pr-4 text-right">
                                     <button
                                        onClick={() => handleRemoveSubscriber(sub.id)}
                                        className="p-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded transition"
                                     >
                                        <Trash2 className="w-4 h-4"/>
                                     </button>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                )}
             </GlassCard>
          </div>
       )}

       {/* WIZARD MODAL */}
       {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
           <div className="bg-slate-900 border border-white/10 rounded-[20px] p-8 max-w-lg w-full">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Bot className="w-5 h-5"/> {t.aiTitle}</h2>
              <div className="space-y-4">
                 <div>
                    <label className="text-sm text-slate-400 block mb-1">{t.topic}</label>
                    <input autoFocus className={GLASS_INPUT_CLASSES} value={wizardAnswers.topic} onChange={(e) => setWizardAnswers({...wizardAnswers, topic: e.target.value})} placeholder="Ex: Lancement nouvelle offre" />
                 </div>
                 <div>
                    <label className="text-sm text-slate-400 block mb-1">{t.goal}</label>
                    <input className={GLASS_INPUT_CLASSES} value={wizardAnswers.goal} onChange={(e) => setWizardAnswers({...wizardAnswers, goal: e.target.value})} placeholder="Ex: Faire cliquer sur le lien" />
                 </div>
                 <div className="pt-4 flex justify-end gap-2">
                    <button onClick={() => setIsWizardOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">{t.cancel}</button>
                    <button onClick={generateAiNewsletter} className={ACTION_BUTTON_CLASSES}>{t.generate}</button>
                 </div>
              </div>
           </div>
        </div>
       )}

       {/* SUBSCRIBER MODAL */}
       {isSubModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <div className="bg-slate-900 border border-white/10 rounded-[20px] p-8 max-w-md w-full">
               <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Plus className="w-5 h-5"/> {t.addSubscriber}</h2>
               <div className="space-y-4">
                  <div>
                     <label className="text-sm text-slate-400 block mb-1">{t.subscriberEmail}</label>
                     <input
                        autoFocus
                        type="email"
                        className={GLASS_INPUT_CLASSES}
                        value={newSubEmail}
                        onChange={(e) => setNewSubEmail(e.target.value)}
                        placeholder="nom@exemple.com"
                     />
                  </div>
                  <div>
                     <label className="text-sm text-slate-400 block mb-1">{t.subscriberTags}</label>
                     <input
                        className={GLASS_INPUT_CLASSES}
                        value={newSubTags}
                        onChange={(e) => setNewSubTags(e.target.value)}
                        placeholder="vip, mensuel"
                     />
                  </div>
                  <div className="pt-4 flex justify-end gap-2">
                     <button onClick={() => setIsSubModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">{t.cancel}</button>
                     <button onClick={handleAddSubscriber} className={ACTION_BUTTON_CLASSES}>{t.add}</button>
                  </div>
               </div>
            </div>
         </div>
       )}

       {/* GALLERY MODAL (Reusable) */}
       {isGalleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
           <div className="bg-slate-900 border border-white/10 rounded-[20px] shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                 <h2 className="text-xl font-bold text-white">{t.selectImg}</h2>
                 <button onClick={() => setIsGalleryOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
              </div>
              <div className="p-6 overflow-y-auto grid grid-cols-3 md:grid-cols-4 gap-4">
                  {MOCK_GALLERY.map(img => (
                    <button
                      key={img.id}
                      onClick={() => {
                        if (targetImageBlockId) {
                           updateBlock(targetImageBlockId, 'imageUrl', img.url);
                        }
                        setIsGalleryOpen(false);
                        setTargetImageBlockId(null);
                      }}
                      className="aspect-square rounded-[10px] overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all relative group"
                    >
                       <img src={img.url} className="w-full h-full object-cover" />
                    </button>
                  ))}
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default AdminNewsletter;
