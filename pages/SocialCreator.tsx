import React, { useState, useRef, useEffect } from 'react';
import { Download, Image as ImageIcon, Type, RefreshCw, Grid, X, Plus, Move, Trash2, Square, Smartphone, Monitor, Sparkles, Upload } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { ACTION_BUTTON_CLASSES, GLASS_INPUT_CLASSES } from '../constants';
import { GalleryImage, Language } from '../types';
import { useCollection } from '../lib/firestore';

interface SocialCreatorProps {
  lang: Language;
}

interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  isBold: boolean;
  color: string;
}

interface Format {
  id: string;
  label: string;
  width: number;
  height: number;
  icon: React.ReactNode;
}

const FORMATS: Format[] = [
  { id: 'square', label: 'Carré (1:1)', width: 1080, height: 1080, icon: <Square className="w-4 h-4"/> },
  { id: 'portrait', label: 'Story (9:16)', width: 1080, height: 1920, icon: <Smartphone className="w-4 h-4"/> },
  { id: 'feed', label: 'Feed (4:5)', width: 1080, height: 1350, icon: <ImageIcon className="w-4 h-4"/> },
  { id: 'landscape', label: 'Paysage (16:9)', width: 1920, height: 1080, icon: <Monitor className="w-4 h-4"/> },
];

const SocialCreator: React.FC<SocialCreatorProps> = ({ lang }) => {
  const { data: gallery } = useCollection<GalleryImage>('gallery');

  // State
  const [selectedFormat, setSelectedFormat] = useState<Format>(FORMATS[0]);
  const [bgImage, setBgImage] = useState("https://picsum.photos/1080/1080");
  const [isGrayscale, setIsGrayscale] = useState(true);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  
  // Nano Banana State
  const [isNanoOpen, setIsNanoOpen] = useState(false);
  const [nanoPrompt, setNanoPrompt] = useState('');
  const [nanoRefImage, setNanoRefImage] = useState<File | null>(null);
  const [nanoRefPreview, setNanoRefPreview] = useState<string | null>(null);
  const nanoFileInputRef = useRef<HTMLInputElement>(null);
  
  const t = {
    FR: {
      title: 'Créateur de Contenu',
      subtitle: 'Générez des visuels de marque pour les réseaux sociaux.',
      format: 'Format',
      layers: 'Calques Texte',
      add: 'Ajouter',
      newText: 'Nouveau texte',
      size: 'Taille Police',
      bgImg: 'Image de fond',
      bw: 'Noir & Blanc',
      random: 'Aléatoire',
      gallery: 'Galerie',
      nano: 'Nano Banana',
      nanoTitle: 'Génération IA (Nano Banana)',
      nanoPlaceholder: 'Décrivez l\'image de fond idéale...',
      generate: 'Générer',
      soon: 'La génération par IA arrive bientôt : elle passera par le serveur pour protéger la clé.',
      download: 'Télécharger l\'image',
      hint: 'Glissez les textes avec la souris',
      selectImg: 'Sélectionner une image',
      use: 'Utiliser',
      uploadRef: 'Ajouter une image de référence (optionnel)',
      remove: 'Retirer'
    },
    EN: {
      title: 'Content Creator',
      subtitle: 'Generate branded visuals for social media.',
      format: 'Format',
      layers: 'Text Layers',
      add: 'Add',
      newText: 'New text',
      size: 'Font Size',
      bgImg: 'Background Image',
      bw: 'B&W',
      random: 'Random',
      gallery: 'Gallery',
      nano: 'Nano Banana',
      nanoTitle: 'AI Generation (Nano Banana)',
      nanoPlaceholder: 'Describe the ideal background image...',
      generate: 'Generate',
      soon: 'AI generation is coming soon: it will go through the server to protect the key.',
      download: 'Download Image',
      hint: 'Drag text with mouse',
      selectImg: 'Select Image',
      use: 'Use',
      uploadRef: 'Add reference image (optional)',
      remove: 'Remove'
    }
  }[lang];

  // Text Layers
  const [layers, setLayers] = useState<TextLayer[]>([
    { id: '1', text: "Votre message inspirant", x: 540, y: 540, fontSize: 60, isBold: true, color: '#ffffff' },
    { id: '2', text: "@xenahorizon", x: 540, y: 900, fontSize: 30, isBold: false, color: '#94a3b8' }
  ]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>('1');

  // Dragging State
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- LOGIC ---

  const addLayer = () => {
    const newLayer: TextLayer = {
      id: Date.now().toString(),
      text: t.newText,
      x: selectedFormat.width / 2,
      y: selectedFormat.height / 2,
      fontSize: 40,
      isBold: false,
      color: '#ffffff'
    };
    setLayers([...layers, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const removeLayer = (id: string) => {
    setLayers(layers.filter(l => l.id !== id));
    if (selectedLayerId === id) setSelectedLayerId(null);
  };

  const updateLayer = (id: string, updates: Partial<TextLayer>) => {
    setLayers(layers.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  // --- GÉNÉRATION IA ---
  // La génération par IA (Nano Banana / Gemini) demande une clé qui ne peut pas vivre dans le
  // navigateur : elle passera par une fonction serveur. En attendant, le bouton reste désactivé
  // (voir la modale plus bas) et aucune clé n'est exposée côté client.

  const handleNanoImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNanoRefImage(file);
      setNanoRefPreview(URL.createObjectURL(file));
    }
  };

  // --- DRAWING ---

  const generateCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load Image
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = bgImage;
    
    img.onload = () => {
      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw BG
      ctx.save();
      if (isGrayscale) {
        ctx.filter = 'grayscale(100%) brightness(60%)'; // Darker for text readability
      } else {
        ctx.filter = 'brightness(70%)';
      }
      
      // Calculate "Cover" fit
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      ctx.restore();

      // Draw Layers
      layers.forEach(layer => {
        ctx.save();
        ctx.font = `${layer.isBold ? 'bold' : 'normal'} ${layer.fontSize}px serif`;
        ctx.fillStyle = layer.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        // Shadow for readability
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // Multiline wrapping logic if text is too long (basic)
        const maxWidth = canvas.width * 0.8;
        const words = layer.text.split(' ');
        let line = '';
        const lines = [];
        
        for(let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }
        lines.push(line);

        const lineHeight = layer.fontSize * 1.2;
        const startY = layer.y - ((lines.length - 1) * lineHeight) / 2;

        lines.forEach((l, i) => {
          ctx.fillText(l, layer.x, startY + (i * lineHeight));
        });
        
        // Draw selection box if selected
        if (layer.id === selectedLayerId && !isDragging) {
           ctx.strokeStyle = "#3b82f6";
           ctx.lineWidth = 2;
           ctx.shadowColor = "transparent";
           // This is an approximation for visual feedback
           const totalHeight = lines.length * lineHeight;
           ctx.strokeRect(layer.x - maxWidth/2, layer.y - totalHeight/2 - 10, maxWidth, totalHeight + 20);
        }

        ctx.restore();
      });
    };
  };

  useEffect(() => {
    generateCanvas();
  }, [layers, bgImage, isGrayscale, selectedFormat, selectedLayerId]);


  // --- MOUSE HANDLERS ---

  const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const coords = getCanvasCoordinates(e);
    
    const clickedLayer = layers.find(layer => {
       const dx = coords.x - layer.x;
       const dy = coords.y - layer.y;
       return Math.abs(dx) < 300 && Math.abs(dy) < layer.fontSize * 2; 
    });

    if (clickedLayer) {
      setSelectedLayerId(clickedLayer.id);
      setIsDragging(true);
      setDragOffset({
        x: coords.x - clickedLayer.x,
        y: coords.y - clickedLayer.y
      });
    } else {
      setSelectedLayerId(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !selectedLayerId) return;
    
    const coords = getCanvasCoordinates(e);
    updateLayer(selectedLayerId, {
      x: coords.x - dragOffset.x,
      y: coords.y - dragOffset.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
        // Deselect before printing to remove the blue box
        const currentSelection = selectedLayerId;
        setSelectedLayerId(null);
        
        // Wait for next render frame
        setTimeout(() => {
            const link = document.createElement('a');
            link.download = `xena-${selectedFormat.id}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
            setSelectedLayerId(currentSelection); // Restore
        }, 50);
    }
  };

  return (
    <div className="pt-24 px-6 pb-12 max-w-[1600px] mx-auto space-y-8 relative">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white">{t.title}</h1>
        <p className="text-slate-400">{t.subtitle}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Controls - Left Panel */}
        <div className="w-full lg:w-1/3 space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar pr-2">
          
          {/* Format Selector */}
          <GlassCard className="p-4">
             <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">{t.format}</h3>
             <div className="grid grid-cols-2 gap-2">
                {FORMATS.map(fmt => (
                   <button
                     key={fmt.id}
                     onClick={() => setSelectedFormat(fmt)}
                     className={`flex flex-col items-center justify-center p-3 rounded-[12px] border transition-all ${selectedFormat.id === fmt.id ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'}`}
                   >
                     {fmt.icon}
                     <span className="text-xs font-medium mt-1">{fmt.label}</span>
                   </button>
                ))}
             </div>
          </GlassCard>

          {/* Text Layers */}
          <GlassCard className="p-4 space-y-4">
             <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t.layers}</h3>
                <button onClick={addLayer} className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-white flex items-center gap-1 transition-colors">
                   <Plus className="w-3 h-3" /> {t.add}
                </button>
             </div>
             
             <div className="space-y-3">
                {layers.map((layer) => (
                   <div 
                      key={layer.id} 
                      className={`p-3 rounded-[12px] border transition-all cursor-pointer ${selectedLayerId === layer.id ? 'bg-blue-900/20 border-blue-500' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                      onClick={() => setSelectedLayerId(layer.id)}
                   >
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-xs font-bold text-slate-400">ID: {layer.id}</span>
                         <button onClick={(e) => { e.stopPropagation(); removeLayer(layer.id); }} className="text-slate-500 hover:text-red-400">
                            <Trash2 className="w-3 h-3" />
                         </button>
                      </div>
                      
                      {selectedLayerId === layer.id ? (
                        <div className="space-y-2">
                           <textarea 
                              className={`${GLASS_INPUT_CLASSES} text-sm h-20 resize-none`}
                              value={layer.text}
                              onChange={(e) => updateLayer(layer.id, { text: e.target.value })}
                           />
                           <div className="flex gap-2">
                              <input 
                                 type="number" 
                                 className={`${GLASS_INPUT_CLASSES} py-1 text-xs`}
                                 value={layer.fontSize}
                                 onChange={(e) => updateLayer(layer.id, { fontSize: parseInt(e.target.value) })}
                                 title={t.size}
                              />
                              <button 
                                 onClick={() => updateLayer(layer.id, { isBold: !layer.isBold })}
                                 className={`px-3 rounded-[10px] border ${layer.isBold ? 'bg-white text-slate-900 border-white' : 'border-white/20 text-slate-400'}`}
                              >
                                 B
                              </button>
                              <input 
                                 type="color" 
                                 className="h-9 w-9 bg-transparent border-0 cursor-pointer rounded overflow-hidden"
                                 value={layer.color}
                                 onChange={(e) => updateLayer(layer.id, { color: e.target.value })}
                              />
                           </div>
                        </div>
                      ) : (
                         <p className="text-sm text-white truncate">{layer.text}</p>
                      )}
                   </div>
                ))}
             </div>
          </GlassCard>

          {/* Background */}
          <GlassCard className="p-4 space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> {t.bgImg}
            </h3>
            
            <div className="flex items-center justify-between bg-white/5 p-3 rounded-[10px] border border-white/5">
                <span className="text-sm text-slate-300 font-medium">{t.bw}</span>
                <button 
                  onClick={() => setIsGrayscale(!isGrayscale)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${isGrayscale ? 'bg-blue-600' : 'bg-slate-700'}`}
                >
                    <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isGrayscale ? 'translate-x-6' : ''}`} />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <button 
                    onClick={() => setBgImage(`https://picsum.photos/1080/1080?random=${Math.random()}`)}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-[10px] text-xs font-medium"
                >
                    {t.random}
                </button>
                <button 
                    onClick={() => setIsGalleryOpen(true)}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-[10px] text-xs font-medium"
                >
                    {t.gallery}
                </button>
                <button 
                    onClick={() => setIsNanoOpen(true)}
                    className="col-span-2 w-full py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 border border-yellow-500/30 text-yellow-300 rounded-[10px] text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                    <Sparkles className="w-4 h-4" /> {t.nano}
                </button>
            </div>
          </GlassCard>

        </div>

        {/* Canvas - Right Panel */}
        <div className="w-full lg:w-2/3 flex flex-col items-center">
             <div ref={containerRef} className="relative rounded-[20px] overflow-hidden shadow-2xl border border-white/10 bg-slate-900">
                <canvas 
                   ref={canvasRef}
                   width={selectedFormat.width}
                   height={selectedFormat.height}
                   className="max-h-[70vh] w-auto max-w-full cursor-move touch-none"
                   onMouseDown={handleMouseDown}
                   onMouseMove={handleMouseMove}
                   onMouseUp={handleMouseUp}
                   onMouseLeave={handleMouseUp}
                   onTouchStart={handleMouseDown}
                   onTouchMove={handleMouseMove}
                   onTouchEnd={handleMouseUp}
                />
                <div className="absolute bottom-4 right-4 flex gap-2">
                    <button onClick={handleDownload} className={`${ACTION_BUTTON_CLASSES} shadow-xl`}>
                       <Download className="w-4 h-4" /> {t.download}
                    </button>
                </div>
             </div>
             <p className="text-slate-500 text-sm mt-4 flex items-center gap-2">
                <Move className="w-4 h-4" /> {t.hint}
             </p>
        </div>

      </div>

      {/* GALLERY MODAL */}
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
                      onClick={() => { setBgImage(img.url); setIsGalleryOpen(false); }}
                      className="aspect-square rounded-[10px] overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all relative group"
                    >
                       <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                          {t.use}
                       </div>
                    </button>
                  ))}
              </div>
           </div>
        </div>
      )}

      {/* NANO BANANA MODAL */}
      {isNanoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
           <div className="bg-slate-900 border border-yellow-500/30 rounded-[20px] shadow-[0_0_50px_rgba(234,179,8,0.2)] w-full max-w-md">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                 <h2 className="text-xl font-bold text-white flex items-center gap-2"><Sparkles className="w-5 h-5 text-yellow-400"/> {t.nanoTitle}</h2>
                 <button onClick={() => setIsNanoOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
              </div>
              <div className="p-6 space-y-4">
                 
                 {/* Image Upload Area */}
                 <div 
                    onClick={() => nanoFileInputRef.current?.click()}
                    className={`
                        relative w-full h-32 rounded-[15px] border-2 border-dashed flex items-center justify-center cursor-pointer transition-all overflow-hidden
                        ${nanoRefPreview ? 'border-yellow-500/50 bg-slate-800' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}
                    `}
                 >
                    {nanoRefPreview ? (
                        <>
                            <img src={nanoRefPreview} alt="Reference" className="h-full w-full object-contain opacity-50" />
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setNanoRefImage(null);
                                    setNanoRefPreview(null);
                                    if(nanoFileInputRef.current) nanoFileInputRef.current.value = '';
                                }}
                                className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-full hover:bg-red-500"
                                title={t.remove}
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center text-slate-500">
                            <Upload className="w-6 h-6 mb-2" />
                            <span className="text-xs">{t.uploadRef}</span>
                        </div>
                    )}
                    <input 
                        type="file" 
                        ref={nanoFileInputRef}
                        onChange={handleNanoImageSelect}
                        className="hidden" 
                        accept="image/*"
                    />
                 </div>

                 <textarea 
                    className={`${GLASS_INPUT_CLASSES} h-32 resize-none`} 
                    placeholder={t.nanoPlaceholder}
                    value={nanoPrompt}
                    onChange={(e) => setNanoPrompt(e.target.value)}
                 />
                 <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-900 font-bold rounded-[15px] flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
                 >
                    <Sparkles className="w-5 h-5"/>
                    {t.generate}
                 </button>
                 <p className="text-xs text-slate-500 text-center">{t.soon}</p>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default SocialCreator;