import React, { useState } from 'react';
import {
  Download, LayoutTemplate, Image as ImageIcon, Link as LinkIcon,
  Type, X, Plus, Trash2, ArrowUp, ArrowDown, Bot, Send, Save, Users, FileText
} from 'lucide-react';
import { orderBy } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { GalleryImage, Language, NewsletterCampaign, Subscriber } from '../types';
import { useCollection, createDoc, patchDoc, removeDoc } from '../lib/firestore';
import { EnTete, Panneau, Bouton, Champ, Etiquette, Vide, Chargement } from '../components/admin/ui';

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
      kicker: 'Infolettres',
      title: 'Infolettres',
      assistant: 'Assistant de rédaction',
      copy: 'Copier le HTML',
      blocks: 'Blocs du courriel',
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
      saveDraft: 'Enregistrer le brouillon',
      send: 'Envoyer',
      newDraft: 'Nouveau brouillon',
      subjectLabel: 'Sujet',
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
      kicker: 'Newsletters',
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
      emptyGallery: 'No images yet. Add some from the admin Gallery.',
      composer: 'Composer',
      subscribers: 'Subscribers',
      campaigns: 'Campaigns',
      saveDraft: 'Save draft',
      send: 'Send',
      newDraft: 'New draft',
      subjectLabel: 'Subject',
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
        newBlock = { type: 'IMAGE', id, imageUrl: '/images/laurie-scene.jpg', link: '#', alt: 'Image' };
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
       { type: 'IMAGE', id: `i-${id}`, imageUrl: '/images/laurie-portrait-2.jpg', link: '#', alt: 'Hero' },
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

  const BLOC_BOUTON =
    'p-3 rounded-champ border border-filet text-gris hover:text-encre hover:border-encre flex flex-col items-center gap-2 text-xs transition-colors min-h-[44px]';

  return (
    <div className="px-6 md:px-10 py-10 lg:h-screen flex flex-col">
      <EnTete
        kicker={t.kicker}
        titre={t.title}
        actions={
          <>
            <Bouton variante="secondaire" icone={Bot} onClick={() => setIsWizardOpen(true)}>{t.assistant}</Bouton>
            <Bouton variante="secondaire" icone={Save} onClick={handleSaveDraft} disabled={saving}>{t.saveDraft}</Bouton>
            <Bouton variante="primaire" icone={Send} onClick={handleSend} disabled={saving}>{t.send}</Bouton>
            <Bouton variante="discret" icone={Download} onClick={handleExport}>{t.copy}</Bouton>
          </>
        }
      />

      {/* TABS + BANNER */}
      <div className="flex items-center justify-between gap-4 mt-8 mb-6 flex-shrink-0">
         <div className="flex items-center gap-2">
            <button
               type="button"
               onClick={() => setTab('composer')}
               className={`inline-flex items-center gap-2 min-h-[36px] rounded-pilule px-4 text-xs font-semibold transition-colors ${
                 tab === 'composer' ? 'bg-encre text-papier' : 'border border-filet text-gris hover:text-encre'
               }`}
            >
               <FileText className="w-3.5 h-3.5" aria-hidden="true" /> {t.composer}
            </button>
            <button
               type="button"
               onClick={() => setTab('subscribers')}
               className={`inline-flex items-center gap-2 min-h-[36px] rounded-pilule px-4 text-xs font-semibold transition-colors ${
                 tab === 'subscribers' ? 'bg-encre text-papier' : 'border border-filet text-gris hover:text-encre'
               }`}
            >
               <Users className="w-3.5 h-3.5" aria-hidden="true" /> {t.subscribers}
               {!subscribersLoading && <Etiquette tone="neutre" className="ml-1">{subscribers.length}</Etiquette>}
            </button>
         </div>
         {banner && (
            <div className="px-4 py-2 rounded-pilule bg-rose/10 text-rose text-xs">
               {banner}
            </div>
         )}
      </div>

      {tab === 'composer' && (
        <div className="flex flex-col gap-6 lg:flex-1 lg:min-h-0 lg:flex-row lg:overflow-hidden">

           {/* SIDEBAR */}
           <div className="w-full lg:w-64 flex flex-col gap-4 lg:overflow-y-auto lg:pr-2 flex-shrink-0">
              <Panneau>
                <Champ label={t.subjectLabel} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={t.subjectPlaceholder} />
              </Panneau>

              <Panneau titre={t.blocks}>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => addBlock('HEADER')} className={BLOC_BOUTON}><LayoutTemplate className="w-4 h-4" aria-hidden="true" /> {t.header}</button>
                  <button type="button" onClick={() => addBlock('TEXT')} className={BLOC_BOUTON}><Type className="w-4 h-4" aria-hidden="true" /> {t.text}</button>
                  <button type="button" onClick={() => addBlock('IMAGE')} className={BLOC_BOUTON}><ImageIcon className="w-4 h-4" aria-hidden="true" /> {t.image}</button>
                  <button type="button" onClick={() => addBlock('BUTTON')} className={BLOC_BOUTON}><LinkIcon className="w-4 h-4" aria-hidden="true" /> {t.button}</button>
                  <button type="button" onClick={() => addBlock('SPACER')} className={BLOC_BOUTON}><ArrowDown className="w-4 h-4" aria-hidden="true" /> {t.spacer}</button>
                  <button type="button" onClick={() => addBlock('FOOTER')} className={BLOC_BOUTON}><LayoutTemplate className="w-4 h-4 rotate-180" aria-hidden="true" /> {t.footer}</button>
                </div>
              </Panneau>

              <div className="space-y-2">
                <h3 className="kicker text-gris mb-2">{t.structure}</h3>
                {blocks.map((block, index) => (
                   <div key={block.id} className="bg-papier-2 border border-filet rounded-champ p-3 flex items-center justify-between group">
                      <span className="text-xs font-semibold text-encre">{block.type}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button type="button" onClick={() => moveBlock(index, -1)} aria-label={lang === 'FR' ? 'Monter' : 'Move up'} className="p-1 rounded-champ text-gris hover:text-encre"><ArrowUp className="w-3 h-3" /></button>
                         <button type="button" onClick={() => moveBlock(index, 1)} aria-label={lang === 'FR' ? 'Descendre' : 'Move down'} className="p-1 rounded-champ text-gris hover:text-encre"><ArrowDown className="w-3 h-3" /></button>
                         <button type="button" onClick={() => deleteBlock(index)} aria-label={t.remove} className="p-1 rounded-champ text-gris hover:text-rose"><Trash2 className="w-3 h-3" /></button>
                      </div>
                   </div>
                ))}
                {blocks.length === 0 && <p className="text-xs text-gris text-center py-4">{t.empty}</p>}
              </div>

              {/* CAMPAIGNS LIST */}
              <Panneau
                titre={t.campaigns}
                actions={
                  <button type="button" onClick={newDraft} className="inline-flex items-center gap-1 text-xs text-gris hover:text-encre">
                     <Plus className="w-3 h-3" aria-hidden="true" /> {t.newDraft}
                  </button>
                }
              >
                 {campaignsLoading ? (
                    <p className="text-xs text-gris">{t.loading}</p>
                 ) : campaigns.length === 0 ? (
                    <Vide titre={t.noCampaigns} />
                 ) : (
                    <ul className="space-y-1.5">
                       {campaigns.map(c => (
                          <li
                             key={c.id}
                             className={`group p-2 rounded-champ border cursor-pointer transition-colors ${
                               currentCampaignId === c.id ? 'bg-papier border-encre' : 'border-filet hover:bg-papier'
                             }`}
                             onClick={() => loadCampaign(c)}
                          >
                             <div className="flex items-center justify-between gap-2">
                                <span className="text-xs text-encre truncate flex-1">{c.subject || '(sans sujet)'}</span>
                                <button
                                   type="button"
                                   onClick={(e) => { e.stopPropagation(); deleteCampaign(c.id); }}
                                   aria-label={t.remove}
                                   className="opacity-0 group-hover:opacity-100 p-1 rounded-champ text-gris hover:text-rose"
                                >
                                   <Trash2 className="w-3 h-3" />
                                </button>
                             </div>
                             <Etiquette tone={c.status === 'sent' ? 'accent' : 'neutre'} className="mt-1">
                                {c.status === 'sent' ? t.sent : t.draft}
                             </Etiquette>
                          </li>
                       ))}
                    </ul>
                 )}
              </Panneau>
           </div>

           {/* MAIN PREVIEW AREA (Email Context) */}
           <div className="flex-1 bg-papier-2 border border-filet rounded-champ overflow-y-auto flex justify-center py-8 px-4">
              <div className="w-full max-w-[600px] min-h-[600px] lg:min-h-[800px] bg-papier shadow-panneau relative text-encre">
                 {blocks.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Vide titre={t.preview} texte="600 px" />
                    </div>
                 )}

                 {blocks.map(block => (
                    <div key={block.id} className="relative group border border-transparent hover:border-filet border-dashed transition-colors">
                       {/* HEADER RENDER */}
                       {block.type === 'HEADER' && (
                          <div className="p-5 text-center">
                             <input
                                value={(block as HeaderBlock).title}
                                onChange={(e) => updateBlock(block.id, 'title', e.target.value)}
                                className="font-serif text-3xl text-encre text-center w-full focus:outline-none bg-transparent placeholder-gris"
                                placeholder="Titre de votre infolettre"
                             />
                             <p className="text-xs text-gris mt-2">{(block as HeaderBlock).viewOnlineText}</p>
                          </div>
                       )}

                       {/* TEXT RENDER */}
                       {block.type === 'TEXT' && (
                          <div className="p-5">
                             <textarea
                                value={(block as TextBlock).content.replace(/<br>/g, '\n')}
                                onChange={(e) => updateBlock(block.id, 'content', e.target.value.replace(/\n/g, '<br>'))}
                                className="w-full h-auto min-h-[100px] text-encre text-base resize-none focus:outline-none bg-transparent font-sans"
                             />
                             <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 bg-papier shadow-panneau border border-filet rounded-champ flex gap-1 z-10">
                                <button type="button" onClick={() => updateBlock(block.id, 'align', 'left')} className="p-1 rounded-champ text-xs text-gris hover:text-encre">G</button>
                                <button type="button" onClick={() => updateBlock(block.id, 'align', 'center')} className="p-1 rounded-champ text-xs text-gris hover:text-encre">C</button>
                                <button type="button" onClick={() => updateBlock(block.id, 'align', 'right')} className="p-1 rounded-champ text-xs text-gris hover:text-encre">D</button>
                             </div>
                          </div>
                       )}

                       {/* IMAGE RENDER */}
                       {block.type === 'IMAGE' && (
                          <div className="p-2 text-center relative">
                             <img
                                src={(block as ImageBlock).imageUrl}
                                alt={(block as ImageBlock).alt}
                                className="max-w-full h-auto rounded-champ mx-auto cursor-pointer"
                                onClick={() => { setIsGalleryOpen(true); setTargetImageBlockId(block.id); }}
                             />
                             <input
                                value={(block as ImageBlock).link}
                                onChange={(e) => updateBlock(block.id, 'link', e.target.value)}
                                placeholder="Lien de destination..."
                                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-papier/90 px-3 py-1 rounded-champ text-xs w-64 text-center opacity-0 group-hover:opacity-100 shadow-panneau text-encre"
                             />
                          </div>
                       )}

                       {/* BUTTON RENDER */}
                       {block.type === 'BUTTON' && (
                          <div className="p-5 text-center">
                             <button
                                type="button"
                                className="px-6 py-3 rounded-pilule font-semibold inline-block"
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
                                <input type="color" value={(block as ButtonBlock).color} onChange={(e) => updateBlock(block.id, 'color', e.target.value)} className="w-6 h-6 p-0 border-0 rounded-champ cursor-pointer" />
                                <input type="text" value={(block as ButtonBlock).link} onChange={(e) => updateBlock(block.id, 'link', e.target.value)} className="border border-filet rounded-champ px-2 py-1 text-xs text-encre bg-papier" placeholder="http://..." />
                             </div>
                          </div>
                       )}

                       {/* SPACER RENDER */}
                       {block.type === 'SPACER' && (
                           <div style={{ height: (block as SpacerBlock).height }} className="bg-papier flex items-center justify-center relative group/spacer">
                               <span className="text-xs text-gris opacity-0 group-hover/spacer:opacity-100">Espace {(block as SpacerBlock).height}px</span>
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
                          <div className="p-8 border-t border-filet text-center text-xs text-gris">
                             <input
                                value={(block as FooterBlock).companyName}
                                onChange={(e) => updateBlock(block.id, 'companyName', e.target.value)}
                                className="font-semibold text-center w-full focus:outline-none bg-transparent text-encre"
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
         <div className="flex-1 min-h-0 overflow-y-auto">
            <Panneau
              titre={`${t.subscribers}${!subscribersLoading ? ` (${subscribers.length})` : ''}`}
              actions={
                <Bouton variante="secondaire" petit icone={Plus} onClick={() => setIsSubModalOpen(true)}>{t.addSubscriber}</Bouton>
              }
            >
               {subscribersLoading ? (
                  <Chargement texte={t.loading} />
               ) : subscribers.length === 0 ? (
                  <Vide titre={t.noSubscribers} />
               ) : (
                  <div className="overflow-x-auto">
                     <table className="w-full text-sm">
                        <thead>
                           <tr className="text-left kicker text-gris border-b border-filet">
                              <th className="py-2 pr-4">Email</th>
                              <th className="py-2 pr-4">Status</th>
                              <th className="py-2 pr-4">Tags</th>
                              <th className="py-2 pr-4"></th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-filet">
                           {subscribers.map(sub => (
                              <tr key={sub.id} className="hover:bg-papier transition-colors">
                                 <td className="py-3 pr-4 text-encre">{sub.email}</td>
                                 <td className="py-3 pr-4">
                                    <Etiquette tone={sub.status === 'active' ? 'accent' : 'neutre'}>{sub.status}</Etiquette>
                                 </td>
                                 <td className="py-3 pr-4 text-gris text-xs">
                                    {sub.tags && sub.tags.length > 0 ? sub.tags.join(', ') : '·'}
                                 </td>
                                 <td className="py-3 pr-4 text-right">
                                    <button
                                       type="button"
                                       onClick={() => handleRemoveSubscriber(sub.id)}
                                       aria-label={t.remove}
                                       className="p-1.5 rounded-champ text-gris hover:text-rose transition-colors"
                                    >
                                       <Trash2 className="w-4 h-4" />
                                    </button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               )}
            </Panneau>
         </div>
      )}

      {/* WIZARD MODAL */}
      {isWizardOpen && (
       <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-encre/60">
          <div className="bg-papier-2 border border-filet shadow-panneau rounded-champ p-8 max-w-lg w-full">
             <h2 className="font-serif text-h3 text-encre mb-6 flex items-center gap-2"><Bot className="w-5 h-5" aria-hidden="true" /> {t.aiTitle}</h2>
             <div className="space-y-4">
                <Champ
                  label={t.topic}
                  autoFocus
                  value={wizardAnswers.topic}
                  onChange={(e) => setWizardAnswers({ ...wizardAnswers, topic: e.target.value })}
                  placeholder="Ex: Lancement nouvelle offre"
                />
                <Champ
                  label={t.goal}
                  value={wizardAnswers.goal}
                  onChange={(e) => setWizardAnswers({ ...wizardAnswers, goal: e.target.value })}
                  placeholder="Ex: Faire cliquer sur le lien"
                />
                <div className="pt-4 flex justify-end gap-2">
                   <Bouton variante="discret" onClick={() => setIsWizardOpen(false)}>{t.cancel}</Bouton>
                   <Bouton variante="primaire" onClick={generateAiNewsletter}>{t.generate}</Bouton>
                </div>
             </div>
          </div>
       </div>
      )}

      {/* SUBSCRIBER MODAL */}
      {isSubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-encre/60">
           <div className="bg-papier-2 border border-filet shadow-panneau rounded-champ p-8 max-w-md w-full">
              <h2 className="font-serif text-h3 text-encre mb-6 flex items-center gap-2"><Plus className="w-5 h-5" aria-hidden="true" /> {t.addSubscriber}</h2>
              <div className="space-y-4">
                 <Champ
                   label={t.subscriberEmail}
                   autoFocus
                   type="email"
                   value={newSubEmail}
                   onChange={(e) => setNewSubEmail(e.target.value)}
                   placeholder="nom@exemple.com"
                 />
                 <Champ
                   label={t.subscriberTags}
                   value={newSubTags}
                   onChange={(e) => setNewSubTags(e.target.value)}
                   placeholder="vip, mensuel"
                 />
                 <div className="pt-4 flex justify-end gap-2">
                    <Bouton variante="discret" onClick={() => setIsSubModalOpen(false)}>{t.cancel}</Bouton>
                    <Bouton variante="primaire" onClick={handleAddSubscriber}>{t.add}</Bouton>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* GALLERY MODAL (Reusable) */}
      {isGalleryOpen && (
       <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-encre/60">
          <div className="bg-papier-2 border border-filet shadow-panneau rounded-champ w-full max-w-4xl max-h-[80vh] flex flex-col">
             <div className="p-6 border-b border-filet flex justify-between items-center">
                <h2 className="font-serif text-h3 text-encre">{t.selectImg}</h2>
                <button type="button" onClick={() => setIsGalleryOpen(false)} aria-label={t.cancel} className="text-gris hover:text-encre"><X className="w-5 h-5" /></button>
             </div>
             <div className="p-6 overflow-y-auto grid grid-cols-3 md:grid-cols-4 gap-4">
                 {gallery.length === 0 && (
                   <div className="col-span-3 md:col-span-4">
                     <Vide titre={t.emptyGallery} />
                   </div>
                 )}
                 {gallery.map(img => (
                   <button
                     key={img.id}
                     type="button"
                     onClick={() => {
                       if (targetImageBlockId) {
                          updateBlock(targetImageBlockId, 'imageUrl', img.url);
                       }
                       setIsGalleryOpen(false);
                       setTargetImageBlockId(null);
                     }}
                     className="aspect-square rounded-champ overflow-hidden border-2 border-transparent hover:border-rose transition-colors relative group"
                   >
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
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
