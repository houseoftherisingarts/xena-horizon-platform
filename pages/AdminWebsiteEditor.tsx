import React, { useState, useEffect } from 'react';
import { 
  Save, Eye, ArrowLeft, ArrowUp, ArrowDown, Plus, Trash2, 
  LayoutTemplate, AlignLeft, Image as ImageIcon, Phone, 
  BarChart2, Undo, Redo, Globe, Check, Bot, Activity, Search, X
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import PublicHome from './PublicHome';
import { HomeBlock, HomeHeroBlock, HomeServicesBlock, HomeStatsBlock, HomeContactBlock, HomeTextBlock, HomeImageBlock, Language } from '../types';
import { ACTION_BUTTON_CLASSES, GLASS_INPUT_CLASSES } from '../constants';
import { mockSaveToDB, mockGeminiAnalysis, mockIndexNowPing, generateSchemaMarkup, SeoResult } from '../utils/seoHelpers';

interface AdminWebsiteEditorProps {
  initialBlocks: HomeBlock[];
  onSave: (blocks: HomeBlock[]) => void;
  lang: Language;
}

type SeoStatus = 'IDLE' | 'SAVING' | 'ANALYZING' | 'UPDATING' | 'PINGING' | 'DONE';

const AdminWebsiteEditor: React.FC<AdminWebsiteEditorProps> = ({ initialBlocks, onSave, lang }) => {
  const [blocks, setBlocks] = useState<HomeBlock[]>(JSON.parse(JSON.stringify(initialBlocks)));
  const [originalBlocks, setOriginalBlocks] = useState<HomeBlock[]>(JSON.parse(JSON.stringify(initialBlocks)));
  const [viewMode, setViewMode] = useState<'EDIT' | 'PREVIEW' | 'COMPARE'>('EDIT');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  
  // SEO Auto-Pilot State
  const [seoStatus, setSeoStatus] = useState<SeoStatus>('IDLE');
  const [seoData, setSeoData] = useState<SeoResult | null>(null);

  // --- ACTIONS ---

  const addBlock = (type: HomeBlock['type']) => {
    const id = Date.now().toString();
    let newBlock: HomeBlock;

    switch (type) {
      case 'HERO':
        newBlock = { type: 'HERO', id, tagline: 'Xena Horizon', headline: 'Nouveau Titre', subheadline: 'Sous-titre accrocheur', ctaText: 'Action', imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa' } as HomeHeroBlock;
        break;
      case 'SERVICES_PREVIEW':
        newBlock = { type: 'SERVICES_PREVIEW', id, title: 'Nos Services', subtitle: 'Ce que nous offrons' } as HomeServicesBlock;
        break;
      case 'STATS':
        newBlock = { type: 'STATS', id, stat1Value: '10+', stat1Label: 'Années', stat2Value: '100%', stat2Label: 'Satisfaction', stat3Value: '5M$', stat3Label: 'Revenus' } as HomeStatsBlock;
        break;
      case 'CONTACT':
        newBlock = { type: 'CONTACT', id, title: 'Contactez-nous', text: 'Discutons de votre projet', email: 'hello@xena.com' } as HomeContactBlock;
        break;
      case 'TEXT':
        newBlock = { type: 'TEXT', id, content: 'Votre texte ici...' } as HomeTextBlock;
        break;
      case 'IMAGE':
        newBlock = { type: 'IMAGE', id, url: 'https://picsum.photos/1200/600', caption: '' } as HomeImageBlock;
        break;
      default: return;
    }
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(id);
  };

  const updateBlock = (id: string, updates: Partial<HomeBlock>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } as any : b));
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
    if(window.confirm('Supprimer ce bloc ?')) {
       const newBlocks = [...blocks];
       newBlocks.splice(index, 1);
       setBlocks(newBlocks);
       setSelectedBlockId(null);
    }
  };

  // --- SEO AUTO-PILOT ENGINE ---
  const handleSmartSave = async () => {
    // 1. Start Save
    setSeoStatus('SAVING');
    
    // Step A: Save raw content (Mock)
    await mockSaveToDB(blocks);
    onSave(blocks);
    setOriginalBlocks(JSON.parse(JSON.stringify(blocks)));

    // 2. Start Analysis
    setSeoStatus('ANALYZING');
    
    // Aggregate content for the prompt
    const contentString = blocks.map(b => {
        if(b.type === 'HERO') return (b as HomeHeroBlock).headline + ' ' + (b as HomeHeroBlock).subheadline;
        if(b.type === 'TEXT') return (b as HomeTextBlock).content;
        return '';
    }).join(' ');

    // Step B: Call Gemini (Mock)
    const analysisResult = await mockGeminiAnalysis(contentString);
    setSeoData(analysisResult);

    // 3. Updating DB with SEO Data
    setSeoStatus('UPDATING');
    // In a real app, we would update the Page record here with analysisResult.optimizedTitle, etc.
    // For this demo, we'll simulate the "Handshake" (Schema injection) by logging it or storing it in state
    const schemaScript = generateSchemaMarkup(analysisResult);
    console.log("Injecting Schema:", schemaScript);

    // 4. Pinging Search Engines
    setSeoStatus('PINGING');
    await mockIndexNowPing('https://xenahorizon.com');

    // 5. Done
    setSeoStatus('DONE');
    setTimeout(() => setSeoStatus('IDLE'), 3000);
  };

  const handleReset = () => {
    if(window.confirm("Annuler toutes les modifications non sauvegardées ?")) {
      setBlocks(JSON.parse(JSON.stringify(originalBlocks)));
    }
  };

  const getStatusLabel = () => {
    switch(seoStatus) {
        case 'SAVING': return 'Sauvegarde...';
        case 'ANALYZING': return 'Gemini analyse le contenu...';
        case 'UPDATING': return 'Génération Schema.org...';
        case 'PINGING': return 'Ping Google/Bing...';
        case 'DONE': return 'SEO Optimisé !';
        default: return 'Publier';
    }
  };

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      
      {/* --- SIDEBAR EDITOR (Reduced width for laptops) --- */}
      <div className="w-72 border-r border-white/5 bg-slate-900 flex flex-col pt-20 pb-6 z-20 shadow-xl flex-shrink-0">
         <div className="px-6 pb-4 border-b border-white/5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
               <Globe className="w-5 h-5 text-blue-400" /> Éditeur Site
            </h2>
            <div className="mt-4 flex bg-slate-800 rounded-lg p-1 border border-white/5">
               <button onClick={() => setViewMode('EDIT')} className={`flex-1 py-1.5 text-xs font-bold rounded ${viewMode === 'EDIT' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Éditer</button>
               <button onClick={() => setViewMode('COMPARE')} className={`flex-1 py-1.5 text-xs font-bold rounded ${viewMode === 'COMPARE' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Comparer</button>
            </div>
         </div>

         {/* AUTO-PILOT STATUS BAR */}
         {seoStatus !== 'IDLE' && (
             <div className="mx-4 mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-xl flex items-center gap-3 animate-pulse">
                 <Bot className="w-5 h-5 text-blue-400" />
                 <div className="flex-1">
                     <p className="text-xs font-bold text-blue-200">{getStatusLabel()}</p>
                     <div className="w-full bg-blue-900/50 h-1 mt-1.5 rounded-full overflow-hidden">
                         <div className={`h-full bg-blue-400 transition-all duration-500`} style={{
                             width: seoStatus === 'SAVING' ? '20%' : 
                                    seoStatus === 'ANALYZING' ? '50%' : 
                                    seoStatus === 'UPDATING' ? '75%' : 
                                    seoStatus === 'PINGING' ? '90%' : '100%'
                         }}></div>
                     </div>
                 </div>
             </div>
         )}

         {/* SEO RESULTS PREVIEW (If available) */}
         {seoData && seoStatus === 'IDLE' && (
             <div className="mx-4 mt-4 p-3 bg-emerald-900/10 border border-emerald-500/20 rounded-xl">
                 <div className="flex items-center gap-2 mb-2 text-emerald-400">
                     <Search className="w-3 h-3" />
                     <span className="text-[10px] font-bold uppercase tracking-wider">Aperçu Recherche</span>
                 </div>
                 <p className="text-xs text-blue-300 font-medium truncate">{seoData.optimizedTitle}</p>
                 <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">{seoData.metaDescription}</p>
                 <div className="flex flex-wrap gap-1 mt-2">
                     {seoData.keywords.slice(0,3).map(k => (
                         <span key={k} className="text-[9px] px-1.5 py-0.5 bg-white/5 rounded text-slate-400">{k}</span>
                     ))}
                 </div>
             </div>
         )}

         {/* EDITOR CONTROLS (INSPECTOR) OR BLOCK LIST */}
         <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
            
            {selectedBlock ? (
               <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                     <button onClick={() => setSelectedBlockId(null)} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white">
                        <ArrowLeft className="w-4 h-4" /> Retour
                     </button>
                     <span className="text-xs font-bold text-blue-400 uppercase">{selectedBlock.type}</span>
                  </div>

                  <GlassCard className="p-4 space-y-4">
                     {selectedBlock.type === 'HERO' && (
                        <>
                           <div>
                              <label className="text-xs font-bold text-slate-500 mb-1 block">Tagline</label>
                              <input className={GLASS_INPUT_CLASSES} value={(selectedBlock as HomeHeroBlock).tagline} onChange={e => updateBlock(selectedBlock.id, { tagline: e.target.value })} />
                           </div>
                           <div>
                              <label className="text-xs font-bold text-slate-500 mb-1 block">Titre</label>
                              <textarea className={GLASS_INPUT_CLASSES} value={(selectedBlock as HomeHeroBlock).headline} onChange={e => updateBlock(selectedBlock.id, { headline: e.target.value })} rows={3} />
                           </div>
                           <div>
                              <label className="text-xs font-bold text-slate-500 mb-1 block">Sous-titre</label>
                              <textarea className={GLASS_INPUT_CLASSES} value={(selectedBlock as HomeHeroBlock).subheadline} onChange={e => updateBlock(selectedBlock.id, { subheadline: e.target.value })} rows={4} />
                           </div>
                           <div>
                              <label className="text-xs font-bold text-slate-500 mb-1 block">Bouton</label>
                              <input className={GLASS_INPUT_CLASSES} value={(selectedBlock as HomeHeroBlock).ctaText} onChange={e => updateBlock(selectedBlock.id, { ctaText: e.target.value })} />
                           </div>
                           <div>
                              <label className="text-xs font-bold text-slate-500 mb-1 block">Image URL</label>
                              <input className={GLASS_INPUT_CLASSES} value={(selectedBlock as HomeHeroBlock).imageUrl} onChange={e => updateBlock(selectedBlock.id, { imageUrl: e.target.value })} />
                           </div>
                        </>
                     )}
                     
                     {selectedBlock.type === 'SERVICES_PREVIEW' && (
                        <>
                           <div>
                              <label className="text-xs font-bold text-slate-500 mb-1 block">Titre</label>
                              <input className={GLASS_INPUT_CLASSES} value={(selectedBlock as HomeServicesBlock).title} onChange={e => updateBlock(selectedBlock.id, { title: e.target.value })} />
                           </div>
                           <div>
                              <label className="text-xs font-bold text-slate-500 mb-1 block">Sous-titre</label>
                              <input className={GLASS_INPUT_CLASSES} value={(selectedBlock as HomeServicesBlock).subtitle} onChange={e => updateBlock(selectedBlock.id, { subtitle: e.target.value })} />
                           </div>
                        </>
                     )}

                     {selectedBlock.type === 'STATS' && (
                        <div className="space-y-4">
                           <div className="grid grid-cols-2 gap-2">
                              <input className={GLASS_INPUT_CLASSES} value={(selectedBlock as HomeStatsBlock).stat1Value} onChange={e => updateBlock(selectedBlock.id, { stat1Value: e.target.value })} placeholder="Val 1" />
                              <input className={GLASS_INPUT_CLASSES} value={(selectedBlock as HomeStatsBlock).stat1Label} onChange={e => updateBlock(selectedBlock.id, { stat1Label: e.target.value })} placeholder="Label 1" />
                           </div>
                           <div className="grid grid-cols-2 gap-2">
                              <input className={GLASS_INPUT_CLASSES} value={(selectedBlock as HomeStatsBlock).stat2Value} onChange={e => updateBlock(selectedBlock.id, { stat2Value: e.target.value })} placeholder="Val 2" />
                              <input className={GLASS_INPUT_CLASSES} value={(selectedBlock as HomeStatsBlock).stat2Label} onChange={e => updateBlock(selectedBlock.id, { stat2Label: e.target.value })} placeholder="Label 2" />
                           </div>
                           <div className="grid grid-cols-2 gap-2">
                              <input className={GLASS_INPUT_CLASSES} value={(selectedBlock as HomeStatsBlock).stat3Value} onChange={e => updateBlock(selectedBlock.id, { stat3Value: e.target.value })} placeholder="Val 3" />
                              <input className={GLASS_INPUT_CLASSES} value={(selectedBlock as HomeStatsBlock).stat3Label} onChange={e => updateBlock(selectedBlock.id, { stat3Label: e.target.value })} placeholder="Label 3" />
                           </div>
                        </div>
                     )}

                     {selectedBlock.type === 'CONTACT' && (
                        <>
                           <div>
                              <label className="text-xs font-bold text-slate-500 mb-1 block">Titre</label>
                              <input className={GLASS_INPUT_CLASSES} value={(selectedBlock as HomeContactBlock).title} onChange={e => updateBlock(selectedBlock.id, { title: e.target.value })} />
                           </div>
                           <div>
                              <label className="text-xs font-bold text-slate-500 mb-1 block">Texte</label>
                              <textarea className={GLASS_INPUT_CLASSES} value={(selectedBlock as HomeContactBlock).text} onChange={e => updateBlock(selectedBlock.id, { text: e.target.value })} rows={3} />
                           </div>
                           <div>
                              <label className="text-xs font-bold text-slate-500 mb-1 block">Email</label>
                              <input className={GLASS_INPUT_CLASSES} value={(selectedBlock as HomeContactBlock).email} onChange={e => updateBlock(selectedBlock.id, { email: e.target.value })} />
                           </div>
                        </>
                     )}

                     {selectedBlock.type === 'TEXT' && (
                        <div>
                           <label className="text-xs font-bold text-slate-500 mb-1 block">Contenu</label>
                           <textarea className={GLASS_INPUT_CLASSES} value={(selectedBlock as HomeTextBlock).content} onChange={e => updateBlock(selectedBlock.id, { content: e.target.value })} rows={8} />
                        </div>
                     )}

                     {selectedBlock.type === 'IMAGE' && (
                        <>
                           <div>
                              <label className="text-xs font-bold text-slate-500 mb-1 block">URL Image</label>
                              <input className={GLASS_INPUT_CLASSES} value={(selectedBlock as HomeImageBlock).url} onChange={e => updateBlock(selectedBlock.id, { url: e.target.value })} />
                           </div>
                           <div>
                              <label className="text-xs font-bold text-slate-500 mb-1 block">Légende</label>
                              <input className={GLASS_INPUT_CLASSES} value={(selectedBlock as HomeImageBlock).caption} onChange={e => updateBlock(selectedBlock.id, { caption: e.target.value })} />
                           </div>
                        </>
                     )}
                  </GlassCard>
                  
                  <button 
                     onClick={() => deleteBlock(blocks.findIndex(b => b.id === selectedBlock.id))}
                     className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-sm font-medium"
                  >
                     <Trash2 className="w-4 h-4" /> Supprimer ce bloc
                  </button>
               </div>
            ) : (
               <>
                  {/* ADD BLOCKS */}
                  <GlassCard className="p-3">
                     <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ajouter un bloc</p>
                     <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => addBlock('HERO')} className="flex flex-col items-center p-2 rounded bg-white/5 hover:bg-white/10 text-xs text-slate-300"><LayoutTemplate className="w-4 h-4 mb-1"/> Hero</button>
                        <button onClick={() => addBlock('SERVICES_PREVIEW')} className="flex flex-col items-center p-2 rounded bg-white/5 hover:bg-white/10 text-xs text-slate-300"><LayoutTemplate className="w-4 h-4 mb-1"/> Services</button>
                        <button onClick={() => addBlock('STATS')} className="flex flex-col items-center p-2 rounded bg-white/5 hover:bg-white/10 text-xs text-slate-300"><BarChart2 className="w-4 h-4 mb-1"/> Stats</button>
                        <button onClick={() => addBlock('CONTACT')} className="flex flex-col items-center p-2 rounded bg-white/5 hover:bg-white/10 text-xs text-slate-300"><Phone className="w-4 h-4 mb-1"/> Contact</button>
                        <button onClick={() => addBlock('TEXT')} className="flex flex-col items-center p-2 rounded bg-white/5 hover:bg-white/10 text-xs text-slate-300"><AlignLeft className="w-4 h-4 mb-1"/> Texte</button>
                        <button onClick={() => addBlock('IMAGE')} className="flex flex-col items-center p-2 rounded bg-white/5 hover:bg-white/10 text-xs text-slate-300"><ImageIcon className="w-4 h-4 mb-1"/> Image</button>
                     </div>
                  </GlassCard>

                  {/* BLOCK LIST */}
                  <div className="space-y-2">
                     <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-4 mb-2">Structure de la page</p>
                     {blocks.map((block, idx) => (
                        <div 
                           key={block.id} 
                           className={`p-3 rounded border flex items-center justify-between cursor-pointer transition-all ${selectedBlockId === block.id ? 'bg-blue-900/20 border-blue-500' : 'bg-slate-800 border-white/5 hover:bg-slate-700'}`}
                           onClick={() => { setSelectedBlockId(block.id); document.getElementById(`editor-block-${block.id}`)?.scrollIntoView({behavior: 'smooth', block: 'center'}); }}
                        >
                           <span className="text-xs font-bold text-white uppercase">{block.type.replace('_', ' ')}</span>
                           <div className="flex items-center gap-1">
                              <button onClick={(e) => { e.stopPropagation(); moveBlock(idx, -1); }} className="p-1 hover:text-white text-slate-500"><ArrowUp className="w-3 h-3"/></button>
                              <button onClick={(e) => { e.stopPropagation(); moveBlock(idx, 1); }} className="p-1 hover:text-white text-slate-500"><ArrowDown className="w-3 h-3"/></button>
                              <button onClick={(e) => { e.stopPropagation(); deleteBlock(idx); }} className="p-1 hover:text-red-400 text-slate-500"><Trash2 className="w-3 h-3"/></button>
                           </div>
                        </div>
                     ))}
                  </div>
               </>
            )}
         </div>

         <div className="p-4 border-t border-white/5 bg-slate-900 space-y-2">
            <button 
                onClick={handleSmartSave} 
                disabled={seoStatus !== 'IDLE'}
                className={`${ACTION_BUTTON_CLASSES} w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
            >
               {seoStatus === 'IDLE' ? <Save className="w-4 h-4" /> : <Activity className="w-4 h-4 animate-spin"/>}
               {seoStatus === 'IDLE' ? 'Publier (SEO Auto-Pilot)' : getStatusLabel()}
            </button>
            <button onClick={handleReset} className="w-full py-2 text-xs text-slate-500 hover:text-white">
               Réinitialiser
            </button>
         </div>
      </div>

      {/* --- MAIN PREVIEW AREA --- */}
      <div className="flex-1 overflow-y-auto relative bg-black custom-scrollbar pt-4">
         
         {viewMode === 'COMPARE' ? (
            <div className="flex h-full">
               <div className="flex-1 border-r border-white/10 overflow-hidden relative">
                  <div className="absolute top-4 left-4 z-50 bg-black/80 text-white text-xs px-3 py-1 rounded-full border border-white/20">AVANT (Actuel)</div>
                  <div className="opacity-60 pointer-events-none transform scale-[0.8] origin-top h-full overflow-hidden">
                     <PublicHome blocks={originalBlocks} lang={lang} />
                  </div>
               </div>
               <div className="flex-1 overflow-hidden relative">
                   <div className="absolute top-4 right-4 z-50 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-lg">APRÈS (Brouillon)</div>
                   <div className="transform scale-[0.8] origin-top h-full overflow-y-auto">
                     <PublicHome blocks={blocks} lang={lang} />
                   </div>
               </div>
            </div>
         ) : (
            <div className="w-full">
               {/* Interactive Preview - Clicking selects the block for the sidebar editor */}
               <div className="space-y-0 pb-32">
                  {blocks.map((block) => (
                     <div 
                        key={block.id} 
                        id={`editor-block-${block.id}`} 
                        className={`relative transition-all cursor-pointer ${selectedBlockId === block.id ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black z-10' : 'hover:ring-1 hover:ring-white/20'}`}
                        onClick={() => setSelectedBlockId(block.id)}
                     >
                        {/* We use PublicHome purely for rendering, but wrapped in a clickable div */}
                        <div className="">
                           <PublicHome blocks={[block]} lang={lang} />
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}

      </div>
    </div>
  );
};

export default AdminWebsiteEditor;